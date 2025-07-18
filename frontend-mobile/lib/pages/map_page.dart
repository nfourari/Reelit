import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  GoogleMapController? _mapController;

  // Location and distance
  LatLng _center = const LatLng(28.4, -81.5); // Default: Orlando
  double _distance = 15;
  bool _locationDenied = false;

  // Data
  List<Map<String, dynamic>> _spots = [];
  List<String> _invasiveSpecies = [];
  List<String> _nativeSpecies = [];
  final List<String> _selectedSpecies = [];

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
      
      // Skip invalid coordinates
      if (lat == null || lng == null) continue;
      
      final spotLatLng = LatLng(lat, lng);
      final dist = _calculateDistance(_center, spotLatLng);
      
      final speciesInSpot = (spot['species'] as List?)?.cast<String>() ?? [];
      final matchesSpecies = _selectedSpecies.isEmpty ||
          speciesInSpot.any(_selectedSpecies.contains);
      
      if (dist <= _distance && matchesSpecies) {
        markers.add(
          Marker(
            markerId: MarkerId(spot['id']?.toString() ?? '${lat}_$lng'),
            position: spotLatLng,
            infoWindow: InfoWindow(title: spot['name']?.toString() ?? 'Unknown'),
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
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLoaded = _spots.isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Map Explorer'),
        centerTitle: true,
      ),
      body: isLoaded
          ? Column(
              children: [
                if (_locationDenied)
                  Container(
                    padding: const EdgeInsets.all(8),
                    color: Colors.yellow[100],
                    child: Text(
                      "Location access denied. Showing results from Orlando.",
                      style: TextStyle(color: Colors.orange[900]),
                    ),
                  ),
                Expanded(
                  child: Row(
                    children: [
                      // Filter UI
                      Container(
                        width: 220,
                        padding: const EdgeInsets.all(8),
                        child: ListView(
                          children: [
                            Text('Invasive Species',
                                style: theme.textTheme.titleMedium),
                            ..._invasiveSpecies.map((s) => CheckboxListTile(
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
                            const Divider(),
                            Text('Native Species',
                                style: theme.textTheme.titleMedium),
                            ..._nativeSpecies.map((s) => CheckboxListTile(
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
                            const Divider(),
                            Text('Distance: ${_distance.toInt()} mi'),
                            Slider(
                              min: 1,
                              max: 25,
                              divisions: 24,
                              value: _distance,
                              label: '${_distance.toInt()} mi',
                              onChanged: (val) {
                                setState(() {
                                  _distance = val;
                                });
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

                      // Map
                      Expanded(
                        child: GoogleMap(
                          initialCameraPosition: CameraPosition(
                            target: _center,
                            zoom: 10,
                          ),
                          onMapCreated: (c) => _mapController = c,
                          markers: _buildMarkers(),
                          myLocationEnabled: true,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}