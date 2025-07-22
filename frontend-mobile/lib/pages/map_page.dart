import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';


class MapPage extends StatefulWidget {
  const MapPage({Key? key}) : super(key: key);

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  GoogleMapController? _mapController;

  // Location and distance
  LatLng _center = LatLng(28.4, -81.5); // Default: Orlando
  double _distance = 15;
  bool _locationDenied = false;

  // Data
  List<Map<String, dynamic>> _spots = [];
  List<String> _invasiveSpecies = [];
  List<String> _nativeSpecies = [];
  List<String> _selectedSpecies = [];

  // Load JSON files from assets
  Future<void> _loadData() async {
    final lakesJson = await rootBundle.loadString('assets/data/lakes.json');
    final speciesJson =
        await rootBundle.loadString('assets/data/fish_species.json');

    final lakes = List<Map<String, dynamic>>.from(json.decode(lakesJson));
    final speciesList =
        List<Map<String, dynamic>>.from(json.decode(speciesJson));

    final invasive = speciesList
        .where((s) => s['status'] == 'invasive')
        .map((s) => s['species'].toString())
        .toList();

    final native = speciesList
        .where((s) => s['status'] == 'native')
        .map((s) => s['species'].toString())
        .toList();

    setState(() {
      _spots = lakes;
      _invasiveSpecies = invasive;
      _nativeSpecies = native;
    });
  }

  BitmapDescriptor? _greenDotIcon;

  Future<void> _loadGreenDotIcon() async {
    final icon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(24, 24)),
      'assets/images/green_dot.png',
    );
    setState(() {
      _greenDotIcon = icon;
    });
  }

  // Get user location
  Future<void> _getUserLocation() async {
    final location = Location();
    final hasPermission = await location.hasPermission();
    if (hasPermission == PermissionStatus.denied) {
      final permissionResult = await location.requestPermission();
      if (permissionResult != PermissionStatus.granted) {
        setState(() => _locationDenied = true);
        return;
      }
    }

    final locData = await location.getLocation();
    if (locData.latitude != null && locData.longitude != null) {
      setState(() {
        _center = LatLng(locData.latitude!, locData.longitude!);
        _mapController
            ?.animateCamera(CameraUpdate.newLatLng(_center));
      });
    }
  }

  double _calculateDistance(LatLng a, LatLng b) {
    const r = 3958.8; // miles
    final dLat = (b.latitude - a.latitude) * (pi / 180);
    final dLng = (b.longitude - a.longitude) * (pi / 180);
    final lat1 = a.latitude * (pi / 180);
    final lat2 = b.latitude * (pi / 180);

    final aComp = (sin(dLat / 2) * sin(dLat / 2)) +
        (cos(lat1) * cos(lat2) * sin(dLng / 2) * sin(dLng / 2));
    final c = 2 * atan2(sqrt(aComp), sqrt(1 - aComp));

    return r * c;
  }

  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }

  Set<Marker> _buildMarkers() {
    final markers = <Marker>{};

    for (final spot in _spots) {
      final lat = _toDouble(spot['lat']);
      final lng = _toDouble(spot['lng']);

      if (lat == null || lng == null) continue;

      final spotLatLng = LatLng(lat, lng);
      final dist = _calculateDistance(_center, spotLatLng);

      final speciesInSpot = (spot['species'] as List?)?.cast<String>() ?? [];
      final matchesSpecies = _selectedSpecies.isEmpty ||
              _selectedSpecies.every((selected) => speciesInSpot.contains(selected));

      if (matchesSpecies && dist <= _distance) {
        markers.add(
          Marker(
            markerId: MarkerId(
                spot['id']?.toString() ?? '${lat}_${lng}'),
            position: spotLatLng,
            icon: _greenDotIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
            infoWindow: InfoWindow(
                title: spot['name']?.toString() ?? 'Unknown'),
          ),
        );
      }
    }

    return markers;
  }

  @override
  void initState() {
    super.initState();
    _loadData().catchError((e) {
      debugPrint("Error loading data: $e");
    });
    _getUserLocation().catchError((e) {
      debugPrint("Location error: $e");
      setState(() => _locationDenied = true);
    });
    _loadGreenDotIcon();
  }

  @override
  Widget build(BuildContext context) {
    final isLoaded = _spots.isNotEmpty;
    final sheetHeight = MediaQuery.of(context).size.height * 0.35;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Map Explorer'),
        centerTitle: true,
      ),
      body: isLoaded
          ? Stack(
              children: [
                // Fullscreen map
                GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: _center,
                    zoom: 10,
                  ),
                  onMapCreated: (c) => _mapController = c,
                  markers: _buildMarkers(),
                  myLocationEnabled: true,
                ),

                // If location denied, show a banner
                if (_locationDenied)
                  Positioned(
                    top: kToolbarHeight + 8,
                    left: 16,
                    right: 16,
                    child: Material(
                      color: Colors.yellow[100],
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(
                          "Location access denied. Showing Orlando.",
                          style: TextStyle(color: Colors.orange[900]),
                        ),
                      ),
                    ),
                  ),

                // Bottom draggable sheet for filters
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: sheetHeight,
                  child: DraggableScrollableSheet(
                    initialChildSize: 1.0,
                    minChildSize: 0.6,
                    maxChildSize: 1.0,
                    builder: (context, scrollCtrl) {
                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                                blurRadius: 8,
                                color: Colors.black26,
                                offset: Offset(0, -2))
                          ],
                          borderRadius: BorderRadius.vertical(
                              top: Radius.circular(16)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 8),
                          child: ListView(
                            controller: scrollCtrl,
                            children: [
                              Center(
                                child: Container(
                                  width: 40,
                                  height: 4,
                                  color: Colors.grey[400],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text('Invasive Species',
                                  style:
                                      Theme.of(context).textTheme.titleMedium),
                              ..._invasiveSpecies.map((s) =>
                                  CheckboxListTile(
                                    title: Text(s),
                                    value: _selectedSpecies.contains(s),
                                    onChanged: (v) {
                                      setState(() {
                                        v == true
                                            ? _selectedSpecies.add(s)
                                            : _selectedSpecies.remove(s);
                                      });
                                    },
                                  )),
                              Divider(),
                              Text('Native Species',
                                  style:
                                      Theme.of(context).textTheme.titleMedium),
                              ..._nativeSpecies.map((s) =>
                                  CheckboxListTile(
                                    title: Text(s),
                                    value: _selectedSpecies.contains(s),
                                    onChanged: (v) {
                                      setState(() {
                                        v == true
                                            ? _selectedSpecies.add(s)
                                            : _selectedSpecies.remove(s);
                                      });
                                    },
                                  )),
                              Divider(),
                              Text('Distance: ${_distance.toInt()} mi'),
                              Slider(
                                min: 1,
                                max: 25,
                                divisions: 24,
                                value: _distance,
                                label: '${_distance.toInt()} mi',
                                onChanged: (val) {
                                  setState(() => _distance = val);
                                },
                              ),
                              OutlinedButton(
                                onPressed: () {
                                  setState(() {
                                    _selectedSpecies.clear();
                                    _distance = 15;
                                  });
                                },
                                child: const Text("Reset Filters"),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}
