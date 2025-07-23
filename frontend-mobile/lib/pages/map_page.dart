import 'dart:convert';
import 'dart:math';
import 'dart:ui' as ui;
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
  LatLng _center = const LatLng(28.4, -81.5); // Default: Orlando
  double _distance = 15;
  bool _locationDenied = false;
  bool _isLoadingLocation = true;

  // Data
  List<Map<String, dynamic>> _spots = [];
  List<String> _invasiveSpecies = [];
  List<String> _nativeSpecies = [];
  List<String> _selectedSpecies = [];
  bool _isDataLoading = true;

  // Filter panel state
  bool _isFilterPanelExpanded = false;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    await Future.wait([
      _loadData(),
      _getUserLocation(),
      _loadGreenDotIcon(),
    ]);
  }

  // Load JSON files from assets
  Future<void> _loadData() async {
    try {
      final lakesJson = await rootBundle.loadString('assets/data/lakes.json');
      final speciesJson = await rootBundle.loadString('assets/data/fish_species.json');

      final lakes = List<Map<String, dynamic>>.from(json.decode(lakesJson));
      final speciesList = List<Map<String, dynamic>>.from(json.decode(speciesJson));

      final invasive = speciesList
          .where((s) => s['status'] == 'invasive')
          .map((s) => s['species'].toString())
          .toList()
        ..sort();

      final native = speciesList
          .where((s) => s['status'] == 'native')
          .map((s) => s['species'].toString())
          .toList()
        ..sort();

      setState(() {
        _spots = lakes;
        _invasiveSpecies = invasive;
        _nativeSpecies = native;
        _isDataLoading = false;
      });
    } catch (e) {
      debugPrint("Error loading data: $e");
      setState(() {
        _isDataLoading = false;
      });
    }
  }

  BitmapDescriptor? _customMarkerIcon;

  Future<void> _loadGreenDotIcon() async {
    try {
      // Create a custom marker that looks more professional
      _customMarkerIcon = await _createCustomMarkerIcon();
    } catch (e) {
      debugPrint("Error creating custom marker icon: $e");
      // Fallback to default green marker
      _customMarkerIcon = BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen);
    }
  }

  Future<BitmapDescriptor> _createCustomMarkerIcon() async {
    // Create a custom marker icon programmatically
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final size = 60.0;
    
    // Main circle (outer ring)
    final outerPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size / 2, size / 2), size / 2, outerPaint);
    
    // Inner circle (fishing spot color)
    final innerPaint = Paint()
      ..shader = LinearGradient(
        colors: [Color(0xFF0EA5E9), Color(0xFF2563EB)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromCircle(center: Offset(size / 2, size / 2), radius: size / 2 - 4))
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size / 2, size / 2), size / 2 - 4, innerPaint);
    
    // Fish icon in the center
    final fishPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    
    // Simple fish shape using path
    final fishPath = Path();
    final centerX = size / 2;
    final centerY = size / 2;
    
    // Fish body (oval)
    fishPath.addOval(Rect.fromCenter(
      center: Offset(centerX - 2, centerY), 
      width: 16, 
      height: 10
    ));
    
    // Fish tail (triangle)
    fishPath.moveTo(centerX + 6, centerY);
    fishPath.lineTo(centerX + 12, centerY - 4);
    fishPath.lineTo(centerX + 12, centerY + 4);
    fishPath.close();
    
    canvas.drawPath(fishPath, fishPaint);
    
    // Add a small dot for the eye
    canvas.drawCircle(Offset(centerX - 6, centerY - 2), 1.5, Paint()..color = Color(0xFF2563EB));
    
    // Add shadow/border effect
    final borderPaint = Paint()
      ..color = Colors.black.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    canvas.drawCircle(Offset(size / 2, size / 2), size / 2 - 0.5, borderPaint);
    
    final picture = recorder.endRecording();
    final image = await picture.toImage(size.toInt(), size.toInt());
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    
    return BitmapDescriptor.fromBytes(bytes!.buffer.asUint8List());
  }

  // Get user location
  Future<void> _getUserLocation() async {
    try {
      final location = Location();
      final hasPermission = await location.hasPermission();
      
      if (hasPermission == PermissionStatus.denied) {
        final permissionResult = await location.requestPermission();
        if (permissionResult != PermissionStatus.granted) {
          setState(() {
            _locationDenied = true;
            _isLoadingLocation = false;
          });
          return;
        }
      }

      final locData = await location.getLocation();
      if (locData.latitude != null && locData.longitude != null) {
        setState(() {
          _center = LatLng(locData.latitude!, locData.longitude!);
          _isLoadingLocation = false;
        });
        _mapController?.animateCamera(CameraUpdate.newLatLng(_center));
      }
    } catch (e) {
      debugPrint("Location error: $e");
      setState(() {
        _locationDenied = true;
        _isLoadingLocation = false;
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
    int filteredCount = 0;

    for (final spot in _spots) {
      final lat = _toDouble(spot['lat']);
      final lng = _toDouble(spot['lng']);

      if (lat == null || lng == null) continue;

      final spotLatLng = LatLng(lat, lng);
      final dist = _calculateDistance(_center, spotLatLng);

      final speciesInSpot = (spot['species'] as List?)?.cast<String>() ?? [];
      
      // Fixed filter logic: if species selected, spot must contain ALL selected species
      bool matchesSpecies = true;
      if (_selectedSpecies.isNotEmpty) {
        matchesSpecies = _selectedSpecies.every((selected) => speciesInSpot.contains(selected));
      }

      if (matchesSpecies && dist <= _distance) {
        filteredCount++;
        markers.add(
          Marker(
            markerId: MarkerId(spot['id']?.toString() ?? '${lat}_${lng}'),
            position: spotLatLng,
            icon: _customMarkerIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
            infoWindow: InfoWindow(
              title: spot['name']?.toString() ?? 'Unknown',
              snippet: 'Distance: ${dist.toStringAsFixed(1)} mi\nSpecies: ${speciesInSpot.take(3).join(', ')}${speciesInSpot.length > 3 ? '...' : ''}',
            ),
          ),
        );
      }
    }

    return markers;
  }

  Widget _buildFilterChip(String species, bool isInvasive) {
    final isSelected = _selectedSpecies.contains(species);
    return FilterChip(
      label: Text(
        species,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          if (selected) {
            _selectedSpecies.add(species);
          } else {
            _selectedSpecies.remove(species);
          }
        });
      },
      backgroundColor: isInvasive ? Colors.red.shade50 : Colors.green.shade50,
      selectedColor: isInvasive ? Colors.red.shade200 : Colors.green.shade200,
      checkmarkColor: isInvasive ? Colors.red.shade800 : Colors.green.shade800,
      side: BorderSide(
        color: isInvasive ? Colors.red.shade300 : Colors.green.shade300,
        width: 1,
      ),
    );
  }

  Widget _buildQuickFiltersBar() {
    final filteredMarkersCount = _buildMarkers().length;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status and distance filter row
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.location_on, color: Colors.orange, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          'Distance: ${_distance.toInt()} mi',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Showing $filteredMarkersCount fishing spots',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              // Distance slider
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    Slider(
                      min: 1,
                      max: 25,
                      divisions: 24,
                      value: _distance,
                      activeColor: Colors.orange,
                      label: '${_distance.toInt()} mi',
                      onChanged: (val) {
                        setState(() => _distance = val);
                      },
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('1 mi', style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
                        Text('25 mi', style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 12),
          
          // Species filter toggle
          Row(
            children: [
              Icon(Icons.tune, color: Colors.orange, size: 16),
              const SizedBox(width: 4),
              Text(
                'Species Filters',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              if (_selectedSpecies.isNotEmpty) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.orange,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${_selectedSpecies.length}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
              const Spacer(),
              TextButton(
                onPressed: () {
                  setState(() {
                    _selectedSpecies.clear();
                    _distance = 15;
                  });
                },
                child: const Text('Reset'),
              ),
              IconButton(
                icon: Icon(
                  _isFilterPanelExpanded ? Icons.expand_less : Icons.expand_more,
                  color: Colors.orange,
                ),
                onPressed: () {
                  setState(() {
                    _isFilterPanelExpanded = !_isFilterPanelExpanded;
                  });
                },
              ),
            ],
          ),
          
          // Expandable species filter panel
          if (_isFilterPanelExpanded) ...[
            const SizedBox(height: 12),
            const Divider(),
            const SizedBox(height: 8),
            
            // Invasive species
            if (_invasiveSpecies.isNotEmpty) ...[
              Row(
                children: [
                  Icon(Icons.warning, color: Colors.red.shade600, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    'Invasive Species',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.red.shade800,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: _invasiveSpecies.map((species) => _buildFilterChip(species, true)).toList(),
              ),
              const SizedBox(height: 12),
            ],
            
            // Native species
            if (_nativeSpecies.isNotEmpty) ...[
              Row(
                children: [
                  Icon(Icons.eco, color: Colors.green.shade600, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    'Native Species',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.green.shade800,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: _nativeSpecies.map((species) => _buildFilterChip(species, false)).toList(),
              ),
            ],
          ],
        ],
      ),
    );
  }

  Widget _buildMapControls() {
    return Positioned(
      right: 16,
      top: 100,
      child: Column(
        children: [
          // Zoom in button
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(Icons.add, color: Colors.black87),
              onPressed: () {
                _mapController?.animateCamera(CameraUpdate.zoomIn());
              },
            ),
          ),
          const SizedBox(height: 8),
          // Zoom out button
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(Icons.remove, color: Colors.black87),
              onPressed: () {
                _mapController?.animateCamera(CameraUpdate.zoomOut());
              },
            ),
          ),
          const SizedBox(height: 8),
          // Center on user location button
          if (!_locationDenied)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: IconButton(
                icon: const Icon(Icons.my_location, color: Colors.orange),
                onPressed: () {
                  _mapController?.animateCamera(
                    CameraUpdate.newLatLngZoom(_center, 12),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildGestureHint() {
    return Positioned(
      bottom: 100,
      left: 16,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: 0.7),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.pinch, color: Colors.white, size: 16),
            const SizedBox(width: 6),
            const Text(
              'Pinch to zoom • Drag to move',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: _isDataLoading
              ? const Center(child: CircularProgressIndicator())
              : Column(
                  children: [
                    // Header matching other pages
                    Container(
                      padding: const EdgeInsets.all(20),
                      child: Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.map, color: Colors.white, size: 28),
                            const SizedBox(width: 12),
                            const Text(
                              'Map Explorer',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Spacer(),
                            if (_locationDenied)
                              Icon(Icons.location_off, color: Colors.white.withValues(alpha: 0.7), size: 20),
                          ],
                        ),
                      ),
                    ),
                    
                    // Quick filters bar
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: _buildQuickFiltersBar(),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Map
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 20),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.1),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Stack(
                            children: [
                              GoogleMap(
                                initialCameraPosition: CameraPosition(
                                  target: _center,
                                  zoom: 10,
                                ),
                                markers: _buildMarkers(),
                                onMapCreated: (GoogleMapController controller) {
                                  _mapController = controller;
                                },
                                myLocationEnabled: !_locationDenied,
                                myLocationButtonEnabled: false,
                                zoomControlsEnabled: false,
                                mapToolbarEnabled: false,
                                compassEnabled: true,
                                rotateGesturesEnabled: true,
                                scrollGesturesEnabled: true,
                                zoomGesturesEnabled: true,
                                tiltGesturesEnabled: true,
                              ),
                              _buildMapControls(),
                              _buildGestureHint(),
                            ],
                          ),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                  ],
                ),
        ),
      ),
    );
  }
}


















// import 'dart:convert';
// import 'dart:math';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:google_maps_flutter/google_maps_flutter.dart';
// import 'package:location/location.dart';

// class MapPage extends StatefulWidget {
//   const MapPage({Key? key}) : super(key: key);

//   @override
//   State<MapPage> createState() => _MapPageState();
// }

// class _MapPageState extends State<MapPage> {
//   GoogleMapController? _mapController;

//   // Location and distance
//   LatLng _center = const LatLng(28.4, -81.5); // Default: Orlando
//   double _distance = 15;
//   bool _locationDenied = false;
//   bool _isLoadingLocation = true;

//   // Data
//   List<Map<String, dynamic>> _spots = [];
//   List<String> _invasiveSpecies = [];
//   List<String> _nativeSpecies = [];
//   List<String> _selectedSpecies = [];
//   bool _isDataLoading = true;

//   // Filter panel state
//   bool _isFilterPanelExpanded = false;

//   @override
//   void initState() {
//     super.initState();
//     _initializeData();
//   }

//   Future<void> _initializeData() async {
//     await Future.wait([
//       _loadData(),
//       _getUserLocation(),
//       _loadGreenDotIcon(),
//     ]);
//   }

//   // Load JSON files from assets
//   Future<void> _loadData() async {
//     try {
//       final lakesJson = await rootBundle.loadString('assets/data/lakes.json');
//       final speciesJson = await rootBundle.loadString('assets/data/fish_species.json');

//       final lakes = List<Map<String, dynamic>>.from(json.decode(lakesJson));
//       final speciesList = List<Map<String, dynamic>>.from(json.decode(speciesJson));

//       final invasive = speciesList
//           .where((s) => s['status'] == 'invasive')
//           .map((s) => s['species'].toString())
//           .toList()
//         ..sort();

//       final native = speciesList
//           .where((s) => s['status'] == 'native')
//           .map((s) => s['species'].toString())
//           .toList()
//         ..sort();

//       setState(() {
//         _spots = lakes;
//         _invasiveSpecies = invasive;
//         _nativeSpecies = native;
//         _isDataLoading = false;
//       });
//     } catch (e) {
//       debugPrint("Error loading data: $e");
//       setState(() {
//         _isDataLoading = false;
//       });
//     }
//   }

//   BitmapDescriptor? _greenDotIcon;

//   Future<void> _loadGreenDotIcon() async {
//     try {
//       final icon = await BitmapDescriptor.fromAssetImage(
//         const ImageConfiguration(size: Size(24, 24)),
//         'assets/images/green_dot.png',
//       );
//       setState(() {
//         _greenDotIcon = icon;
//       });
//     } catch (e) {
//       debugPrint("Error loading green dot icon: $e");
//     }
//   }

//   // Get user location
//   Future<void> _getUserLocation() async {
//     try {
//       final location = Location();
//       final hasPermission = await location.hasPermission();
      
//       if (hasPermission == PermissionStatus.denied) {
//         final permissionResult = await location.requestPermission();
//         if (permissionResult != PermissionStatus.granted) {
//           setState(() {
//             _locationDenied = true;
//             _isLoadingLocation = false;
//           });
//           return;
//         }
//       }

//       final locData = await location.getLocation();
//       if (locData.latitude != null && locData.longitude != null) {
//         setState(() {
//           _center = LatLng(locData.latitude!, locData.longitude!);
//           _isLoadingLocation = false;
//         });
//         _mapController?.animateCamera(CameraUpdate.newLatLng(_center));
//       }
//     } catch (e) {
//       debugPrint("Location error: $e");
//       setState(() {
//         _locationDenied = true;
//         _isLoadingLocation = false;
//       });
//     }
//   }

//   double _calculateDistance(LatLng a, LatLng b) {
//     const r = 3958.8; // miles
//     final dLat = (b.latitude - a.latitude) * (pi / 180);
//     final dLng = (b.longitude - a.longitude) * (pi / 180);
//     final lat1 = a.latitude * (pi / 180);
//     final lat2 = b.latitude * (pi / 180);

//     final aComp = (sin(dLat / 2) * sin(dLat / 2)) +
//         (cos(lat1) * cos(lat2) * sin(dLng / 2) * sin(dLng / 2));
//     final c = 2 * atan2(sqrt(aComp), sqrt(1 - aComp));

//     return r * c;
//   }

//   double? _toDouble(dynamic value) {
//     if (value == null) return null;
//     if (value is num) return value.toDouble();
//     if (value is String) return double.tryParse(value);
//     return null;
//   }

//   Set<Marker> _buildMarkers() {
//     final markers = <Marker>{};
//     int filteredCount = 0;

//     for (final spot in _spots) {
//       final lat = _toDouble(spot['lat']);
//       final lng = _toDouble(spot['lng']);

//       if (lat == null || lng == null) continue;

//       final spotLatLng = LatLng(lat, lng);
//       final dist = _calculateDistance(_center, spotLatLng);

//       final speciesInSpot = (spot['species'] as List?)?.cast<String>() ?? [];
      
//       // Fixed filter logic: if species selected, spot must contain ALL selected species
//       bool matchesSpecies = true;
//       if (_selectedSpecies.isNotEmpty) {
//         matchesSpecies = _selectedSpecies.every((selected) => speciesInSpot.contains(selected));
//       }

//       if (matchesSpecies && dist <= _distance) {
//         filteredCount++;
//         markers.add(
//           Marker(
//             markerId: MarkerId(spot['id']?.toString() ?? '${lat}_${lng}'),
//             position: spotLatLng,
//             icon: _greenDotIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
//             infoWindow: InfoWindow(
//               title: spot['name']?.toString() ?? 'Unknown',
//               snippet: 'Distance: ${dist.toStringAsFixed(1)} mi\nSpecies: ${speciesInSpot.take(3).join(', ')}${speciesInSpot.length > 3 ? '...' : ''}',
//             ),
//           ),
//         );
//       }
//     }

//     return markers;
//   }

//   Widget _buildFilterChip(String species, bool isInvasive) {
//     final isSelected = _selectedSpecies.contains(species);
//     return FilterChip(
//       label: Text(
//         species,
//         style: TextStyle(
//           fontSize: 12,
//           fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
//         ),
//       ),
//       selected: isSelected,
//       onSelected: (selected) {
//         setState(() {
//           if (selected) {
//             _selectedSpecies.add(species);
//           } else {
//             _selectedSpecies.remove(species);
//           }
//         });
//       },
//       backgroundColor: isInvasive ? Colors.red.shade50 : Colors.green.shade50,
//       selectedColor: isInvasive ? Colors.red.shade200 : Colors.green.shade200,
//       checkmarkColor: isInvasive ? Colors.red.shade800 : Colors.green.shade800,
//       side: BorderSide(
//         color: isInvasive ? Colors.red.shade300 : Colors.green.shade300,
//         width: 1,
//       ),
//     );
//   }

//   Widget _buildQuickFiltersBar() {
//     final filteredMarkersCount = _buildMarkers().length;
    
//     return Container(
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(16),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withValues(alpha: 0.05),
//             blurRadius: 10,
//             offset: const Offset(0, 2),
//           ),
//         ],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           // Status and distance filter row
//           Row(
//             children: [
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Row(
//                       children: [
//                         const Icon(Icons.location_on, color: Colors.orange, size: 16),
//                         const SizedBox(width: 4),
//                         Text(
//                           'Distance: ${_distance.toInt()} mi',
//                           style: const TextStyle(
//                             fontWeight: FontWeight.bold,
//                             fontSize: 14,
//                           ),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 4),
//                     Text(
//                       'Showing $filteredMarkersCount fishing spots',
//                       style: TextStyle(
//                         color: Colors.grey.shade600,
//                         fontSize: 12,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//               // Distance slider
//               Expanded(
//                 flex: 2,
//                 child: Column(
//                   children: [
//                     Slider(
//                       min: 1,
//                       max: 25,
//                       divisions: 24,
//                       value: _distance,
//                       activeColor: Colors.orange,
//                       label: '${_distance.toInt()} mi',
//                       onChanged: (val) {
//                         setState(() => _distance = val);
//                       },
//                     ),
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Text('1 mi', style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
//                         Text('25 mi', style: TextStyle(fontSize: 10, color: Colors.grey.shade600)),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             ],
//           ),
          
//           const SizedBox(height: 12),
          
//           // Species filter toggle
//           Row(
//             children: [
//               const Icon(Icons.tune, color: Colors.orange, size: 16),
//               const SizedBox(width: 4),
//               const Text(
//                 'Species Filters',
//                 style: TextStyle(
//                   fontWeight: FontWeight.bold,
//                   fontSize: 14,
//                 ),
//               ),
//               if (_selectedSpecies.isNotEmpty) ...[
//                 const SizedBox(width: 8),
//                 Container(
//                   padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
//                   decoration: BoxDecoration(
//                     color: Colors.orange,
//                     borderRadius: BorderRadius.circular(10),
//                   ),
//                   child: Text(
//                     '${_selectedSpecies.length}',
//                     style: const TextStyle(
//                       color: Colors.white,
//                       fontSize: 10,
//                       fontWeight: FontWeight.bold,
//                     ),
//                   ),
//                 ),
//               ],
//               const Spacer(),
//               TextButton(
//                 onPressed: () {
//                   setState(() {
//                     _selectedSpecies.clear();
//                     _distance = 15;
//                   });
//                 },
//                 child: const Text('Reset'),
//               ),
//               IconButton(
//                 icon: Icon(
//                   _isFilterPanelExpanded ? Icons.expand_less : Icons.expand_more,
//                   color: Colors.orange,
//                 ),
//                 onPressed: () {
//                   setState(() {
//                     _isFilterPanelExpanded = !_isFilterPanelExpanded;
//                   });
//                 },
//               ),
//             ],
//           ),
          
//           // Expandable species filter panel
//           if (_isFilterPanelExpanded) ...[
//             const SizedBox(height: 12),
//             const Divider(),
//             const SizedBox(height: 8),
            
//             // Invasive species
//             if (_invasiveSpecies.isNotEmpty) ...[
//               Row(
//                 children: [
//                   Icon(Icons.warning, color: Colors.red.shade600, size: 16),
//                   const SizedBox(width: 4),
//                   Text(
//                     'Invasive Species',
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: Colors.red.shade800,
//                       fontSize: 13,
//                     ),
//                   ),
//                 ],
//               ),
//               const SizedBox(height: 8),
//               Wrap(
//                 spacing: 6,
//                 runSpacing: 4,
//                 children: _invasiveSpecies.map((species) => _buildFilterChip(species, true)).toList(),
//               ),
//               const SizedBox(height: 12),
//             ],
            
//             // Native species
//             if (_nativeSpecies.isNotEmpty) ...[
//               Row(
//                 children: [
//                   Icon(Icons.eco, color: Colors.green.shade600, size: 16),
//                   const SizedBox(width: 4),
//                   Text(
//                     'Native Species',
//                     style: TextStyle(
//                       fontWeight: FontWeight.bold,
//                       color: Colors.green.shade800,
//                       fontSize: 13,
//                     ),
//                   ),
//                 ],
//               ),
//               const SizedBox(height: 8),
//               Wrap(
//                 spacing: 6,
//                 runSpacing: 4,
//                 children: _nativeSpecies.map((species) => _buildFilterChip(species, false)).toList(),
//               ),
//             ],
//           ],
//         ],
//       ),
//     );
//   }

//   Widget _buildMapControls() {
//     return Positioned(
//       right: 16,
//       top: 100,
//       child: Column(
//         children: [
//           // Zoom in button
//           Container(
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.circular(8),
//               boxShadow: [
//                 BoxShadow(
//                   color: Colors.black.withValues(alpha: 0.1),
//                   blurRadius: 4,
//                   offset: const Offset(0, 2),
//                 ),
//               ],
//             ),
//             child: IconButton(
//               icon: const Icon(Icons.add, color: Colors.black87),
//               onPressed: () {
//                 _mapController?.animateCamera(CameraUpdate.zoomIn());
//               },
//             ),
//           ),
//           const SizedBox(height: 8),
//           // Zoom out button
//           Container(
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.circular(8),
//               boxShadow: [
//                 BoxShadow(
//                   color: Colors.black.withValues(alpha: 0.1),
//                   blurRadius: 4,
//                   offset: const Offset(0, 2),
//                 ),
//               ],
//             ),
//             child: IconButton(
//               icon: const Icon(Icons.remove, color: Colors.black87),
//               onPressed: () {
//                 _mapController?.animateCamera(CameraUpdate.zoomOut());
//               },
//             ),
//           ),
//           const SizedBox(height: 8),
//           // Center on user location button
//           if (!_locationDenied)
//             Container(
//               decoration: BoxDecoration(
//                 color: Colors.white,
//                 borderRadius: BorderRadius.circular(8),
//                 boxShadow: [
//                   BoxShadow(
//                     color: Colors.black.withValues(alpha: 0.1),
//                     blurRadius: 4,
//                     offset: const Offset(0, 2),
//                   ),
//                 ],
//               ),
//               child: IconButton(
//                 icon: const Icon(Icons.my_location, color: Colors.orange),
//                 onPressed: () {
//                   _mapController?.animateCamera(
//                     CameraUpdate.newLatLngZoom(_center, 12),
//                   );
//                 },
//               ),
//             ),
//         ],
//       ),
//     );
//   }

//   Widget _buildGestureHint() {
//     return Positioned(
//       bottom: 100,
//       left: 16,
//       child: Container(
//         padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//         decoration: BoxDecoration(
//           color: Colors.black.withValues(alpha: 0.7),
//           borderRadius: BorderRadius.circular(20),
//         ),
//         child: const Row(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             Icon(Icons.pinch, color: Colors.white, size: 16),
//             SizedBox(width: 6),
//             Text(
//               'Pinch to zoom • Drag to move',
//               style: TextStyle(
//                 color: Colors.white,
//                 fontSize: 12,
//                 fontWeight: FontWeight.w500,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     final theme = Theme.of(context);
    
//     return Scaffold(
//       body: Container(
//         decoration: const BoxDecoration(
//           gradient: LinearGradient(
//             colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
//             begin: Alignment.topCenter,
//             end: Alignment.bottomCenter,
//           ),
//         ),
//         child: SafeArea(
//           child: _isDataLoading
//               ? const Center(child: CircularProgressIndicator())
//               : Column(
//                   children: [
//                     // Header matching other pages
//                     Container(
//                       padding: const EdgeInsets.all(20),
//                       child: Container(
//                         padding: const EdgeInsets.all(24),
//                         decoration: BoxDecoration(
//                           gradient: const LinearGradient(
//                             colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
//                             begin: Alignment.topLeft,
//                             end: Alignment.bottomRight,
//                           ),
//                           borderRadius: BorderRadius.circular(20),
//                           boxShadow: [
//                             BoxShadow(
//                               color: const Color(0xFF2563EB).withValues(alpha: 0.3),
//                               blurRadius: 20,
//                               offset: const Offset(0, 8),
//                             ),
//                           ],
//                         ),
//                         child: Row(
//                           children: [
//                             const Icon(Icons.map, color: Colors.white, size: 28),
//                             const SizedBox(width: 12),
//                             const Text(
//                               'Map Explorer',
//                               style: TextStyle(
//                                 color: Colors.white,
//                                 fontSize: 24,
//                                 fontWeight: FontWeight.bold,
//                               ),
//                             ),
//                             const Spacer(),
//                             if (_locationDenied)
//                               Icon(Icons.location_off, color: Colors.white.withValues(alpha: 0.7), size: 20),
//                           ],
//                         ),
//                       ),
//                     ),
                    
//                     // Quick filters bar
//                     Padding(
//                       padding: const EdgeInsets.symmetric(horizontal: 20),
//                       child: _buildQuickFiltersBar(),
//                     ),
                    
//                     const SizedBox(height: 16),
                    
//                     // Map
//                     Expanded(
//                       child: Container(
//                         margin: const EdgeInsets.symmetric(horizontal: 20),
//                         decoration: BoxDecoration(
//                           borderRadius: BorderRadius.circular(16),
//                           boxShadow: [
//                             BoxShadow(
//                               color: Colors.black.withValues(alpha: 0.1),
//                               blurRadius: 10,
//                               offset: const Offset(0, 4),
//                             ),
//                           ],
//                         ),
//                         child: ClipRRect(
//                           borderRadius: BorderRadius.circular(16),
//                           child: Stack(
//                             children: [
//                               GoogleMap(
//                                 initialCameraPosition: CameraPosition(
//                                   target: _center,
//                                   zoom: 10,
//                                 ),
//                                 markers: _buildMarkers(),
//                                 onMapCreated: (GoogleMapController controller) {
//                                   _mapController = controller;
//                                 },
//                                 myLocationEnabled: !_locationDenied,
//                                 myLocationButtonEnabled: false,
//                                 zoomControlsEnabled: false,
//                                 mapToolbarEnabled: false,
//                                 compassEnabled: true,
//                                 rotateGesturesEnabled: true,
//                                 scrollGesturesEnabled: true,
//                                 zoomGesturesEnabled: true,
//                                 tiltGesturesEnabled: true,
//                               ),
//                               _buildMapControls(),
//                               _buildGestureHint(),
//                             ],
//                           ),
//                         ),
//                       ),
//                     ),
                    
//                     const SizedBox(height: 20),
//                   ],
//                 ),
//         ),
//       ),
//     );
//   }
// }















// import 'dart:convert';
// import 'dart:math';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:google_maps_flutter/google_maps_flutter.dart';
// import 'package:location/location.dart';


// class MapPage extends StatefulWidget {
//   const MapPage({Key? key}) : super(key: key);

//   @override
//   State<MapPage> createState() => _MapPageState();
// }

// class _MapPageState extends State<MapPage> {
//   GoogleMapController? _mapController;

//   // Location and distance
//   LatLng _center = LatLng(28.4, -81.5); // Default: Orlando
//   double _distance = 15;
//   bool _locationDenied = false;

//   // Data
//   List<Map<String, dynamic>> _spots = [];
//   List<String> _invasiveSpecies = [];
//   List<String> _nativeSpecies = [];
//   List<String> _selectedSpecies = [];

//   // Load JSON files from assets
//   Future<void> _loadData() async {
//     final lakesJson = await rootBundle.loadString('assets/data/lakes.json');
//     final speciesJson =
//         await rootBundle.loadString('assets/data/fish_species.json');

//     final lakes = List<Map<String, dynamic>>.from(json.decode(lakesJson));
//     final speciesList =
//         List<Map<String, dynamic>>.from(json.decode(speciesJson));

//     final invasive = speciesList
//         .where((s) => s['status'] == 'invasive')
//         .map((s) => s['species'].toString())
//         .toList();

//     final native = speciesList
//         .where((s) => s['status'] == 'native')
//         .map((s) => s['species'].toString())
//         .toList();

//     setState(() {
//       _spots = lakes;
//       _invasiveSpecies = invasive;
//       _nativeSpecies = native;
//     });
//   }

//   BitmapDescriptor? _greenDotIcon;

//   Future<void> _loadGreenDotIcon() async {
//     final icon = await BitmapDescriptor.fromAssetImage(
//       const ImageConfiguration(size: Size(24, 24)),
//       'assets/images/green_dot.png',
//     );
//     setState(() {
//       _greenDotIcon = icon;
//     });
//   }

//   // Get user location
//   Future<void> _getUserLocation() async {
//     final location = Location();
//     final hasPermission = await location.hasPermission();
//     if (hasPermission == PermissionStatus.denied) {
//       final permissionResult = await location.requestPermission();
//       if (permissionResult != PermissionStatus.granted) {
//         setState(() => _locationDenied = true);
//         return;
//       }
//     }

//     final locData = await location.getLocation();
//     if (locData.latitude != null && locData.longitude != null) {
//       setState(() {
//         _center = LatLng(locData.latitude!, locData.longitude!);
//         _mapController
//             ?.animateCamera(CameraUpdate.newLatLng(_center));
//       });
//     }
//   }

//   double _calculateDistance(LatLng a, LatLng b) {
//     const r = 3958.8; // miles
//     final dLat = (b.latitude - a.latitude) * (pi / 180);
//     final dLng = (b.longitude - a.longitude) * (pi / 180);
//     final lat1 = a.latitude * (pi / 180);
//     final lat2 = b.latitude * (pi / 180);

//     final aComp = (sin(dLat / 2) * sin(dLat / 2)) +
//         (cos(lat1) * cos(lat2) * sin(dLng / 2) * sin(dLng / 2));
//     final c = 2 * atan2(sqrt(aComp), sqrt(1 - aComp));

//     return r * c;
//   }

//   double? _toDouble(dynamic value) {
//     if (value == null) return null;
//     if (value is num) return value.toDouble();
//     if (value is String) return double.tryParse(value);
//     return null;
//   }

//   Set<Marker> _buildMarkers() {
//     final markers = <Marker>{};

//     for (final spot in _spots) {
//       final lat = _toDouble(spot['lat']);
//       final lng = _toDouble(spot['lng']);

//       if (lat == null || lng == null) continue;

//       final spotLatLng = LatLng(lat, lng);
//       final dist = _calculateDistance(_center, spotLatLng);

//       final speciesInSpot = (spot['species'] as List?)?.cast<String>() ?? [];
//       final matchesSpecies = _selectedSpecies.isEmpty ||
//               _selectedSpecies.every((selected) => speciesInSpot.contains(selected));

//       if (matchesSpecies && dist <= _distance) {
//         markers.add(
//           Marker(
//             markerId: MarkerId(
//                 spot['id']?.toString() ?? '${lat}_${lng}'),
//             position: spotLatLng,
//             icon: _greenDotIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
//             infoWindow: InfoWindow(
//                 title: spot['name']?.toString() ?? 'Unknown'),
//           ),
//         );
//       }
//     }

//     return markers;
//   }

//   @override
//   void initState() {
//     super.initState();
//     _loadData().catchError((e) {
//       debugPrint("Error loading data: $e");
//     });
//     _getUserLocation().catchError((e) {
//       debugPrint("Location error: $e");
//       setState(() => _locationDenied = true);
//     });
//     _loadGreenDotIcon();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final isLoaded = _spots.isNotEmpty;
//     final sheetHeight = MediaQuery.of(context).size.height * 0.35;

//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Map Explorer'),
//         centerTitle: true,
//       ),
//       body: isLoaded
//           ? Stack(
//               children: [
//                 // Fullscreen map
//                 GoogleMap(
//                   initialCameraPosition: CameraPosition(
//                     target: _center,
//                     zoom: 10,
//                   ),
//                   onMapCreated: (c) => _mapController = c,
//                   markers: _buildMarkers(),
//                   myLocationEnabled: true,
//                 ),

//                 // If location denied, show a banner
//                 if (_locationDenied)
//                   Positioned(
//                     top: kToolbarHeight + 8,
//                     left: 16,
//                     right: 16,
//                     child: Material(
//                       color: Colors.yellow[100],
//                       borderRadius: BorderRadius.circular(8),
//                       child: Padding(
//                         padding: const EdgeInsets.all(8),
//                         child: Text(
//                           "Location access denied. Showing Orlando.",
//                           style: TextStyle(color: Colors.orange[900]),
//                         ),
//                       ),
//                     ),
//                   ),

//                 // Bottom draggable sheet for filters
//                 Positioned(
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   height: sheetHeight,
//                   child: DraggableScrollableSheet(
//                     initialChildSize: 1.0,
//                     minChildSize: 0.6,
//                     maxChildSize: 1.0,
//                     builder: (context, scrollCtrl) {
//                       return Container(
//                         decoration: BoxDecoration(
//                           color: Colors.white,
//                           boxShadow: [
//                             BoxShadow(
//                                 blurRadius: 8,
//                                 color: Colors.black26,
//                                 offset: Offset(0, -2))
//                           ],
//                           borderRadius: BorderRadius.vertical(
//                               top: Radius.circular(16)),
//                         ),
//                         child: Padding(
//                           padding: const EdgeInsets.symmetric(
//                               horizontal: 16, vertical: 8),
//                           child: ListView(
//                             controller: scrollCtrl,
//                             children: [
//                               Center(
//                                 child: Container(
//                                   width: 40,
//                                   height: 4,
//                                   color: Colors.grey[400],
//                                 ),
//                               ),
//                               const SizedBox(height: 8),
//                               Text('Invasive Species',
//                                   style:
//                                       Theme.of(context).textTheme.titleMedium),
//                               ..._invasiveSpecies.map((s) =>
//                                   CheckboxListTile(
//                                     title: Text(s),
//                                     value: _selectedSpecies.contains(s),
//                                     onChanged: (v) {
//                                       setState(() {
//                                         v == true
//                                             ? _selectedSpecies.add(s)
//                                             : _selectedSpecies.remove(s);
//                                       });
//                                     },
//                                   )),
//                               Divider(),
//                               Text('Native Species',
//                                   style:
//                                       Theme.of(context).textTheme.titleMedium),
//                               ..._nativeSpecies.map((s) =>
//                                   CheckboxListTile(
//                                     title: Text(s),
//                                     value: _selectedSpecies.contains(s),
//                                     onChanged: (v) {
//                                       setState(() {
//                                         v == true
//                                             ? _selectedSpecies.add(s)
//                                             : _selectedSpecies.remove(s);
//                                       });
//                                     },
//                                   )),
//                               Divider(),
//                               Text('Distance: ${_distance.toInt()} mi'),
//                               Slider(
//                                 min: 1,
//                                 max: 25,
//                                 divisions: 24,
//                                 value: _distance,
//                                 label: '${_distance.toInt()} mi',
//                                 onChanged: (val) {
//                                   setState(() => _distance = val);
//                                 },
//                               ),
//                               OutlinedButton(
//                                 onPressed: () {
//                                   setState(() {
//                                     _selectedSpecies.clear();
//                                     _distance = 15;
//                                   });
//                                 },
//                                 child: const Text("Reset Filters"),
//                               ),
//                             ],
//                           ),
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//               ],
//             )
//           : const Center(child: CircularProgressIndicator()),
//     );
//   }
// }
