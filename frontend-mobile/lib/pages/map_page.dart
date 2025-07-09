import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapPage extends StatefulWidget {
  @override
  _MapPageState createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  GoogleMapController? _mapController;
  double _distance = 50;
  Map<String, bool> _access = {
    'public': true,
    'private': true,
    'trespassing': false
  };
  List<String> _speciesSelected = [];

  final List<Map<String, dynamic>> _spots = [
    {
      'id': 1,
      'name': 'Lake Tohopekaliga',
      'lat': 28.2,
      'lng': -81.4,
      'species': ['Largemouth Bass', 'Bluegill', 'Crappie'],
      'access': 'public'
    },
    {
      'id': 2,
      'name': 'Mosquito Lagoon',
      'lat': 28.7,
      'lng': -80.8,
      'species': ['Redfish', 'Snook', 'Trout'],
      'access': 'public'
    },
    {
      'id': 3,
      'name': 'Butler Chain of Lakes',
      'lat': 28.4,
      'lng': -81.5,
      'species': ['Largemouth Bass', 'Bluegill', 'Catfish'],
      'access': 'private'
    },
    {
      'id': 4,
      'name': 'Johns Lake',
      'lat': 28.5,
      'lng': -81.6,
      'species': ['Largemouth Bass', 'Crappie', 'Bluegill'],
      'access': 'public'
    },
    {
      'id': 5,
      'name': 'Secret Pond',
      'lat': 28.3,
      'lng': -81.3,
      'species': ['Trophy Bass', 'Catfish'],
      'access': 'trespassing'
    },
  ];

  bool _filterSpot(Map<String, dynamic> spot) {
    if (!(_access[spot['access']] ?? false)) return false;
    if (_speciesSelected.isNotEmpty &&
        !(spot['species'] as List).any((s) => _speciesSelected.contains(s))) {
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Map Explorer',
                  style: theme.textTheme.headlineLarge,
                ),
              ),
              Expanded(
                child: Row(
                  children: [
                    // Filters column
                    Container(
                      width: 200,
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Species',
                              style: theme.textTheme.titleMedium,
                            ),
                            ...['Largemouth Bass', 'Bluegill', 'Crappie', 'Redfish', 'Snook', 'Trout', 'Catfish', 'Trophy Bass']
                                .map(
                                  (sp) => CheckboxListTile(
                                    title: Text(sp),
                                    value: _speciesSelected.contains(sp),
                                    onChanged: (v) {
                                      setState(() {
                                        if (v == true) {
                                          _speciesSelected.add(sp);
                                        } else {
                                          _speciesSelected.remove(sp);
                                        }
                                      });
                                    },
                                  ),
                                )
                                .toList(),
                            Divider(),
                            Text(
                              'Access',
                              style: theme.textTheme.titleMedium,
                            ),
                            ..._access.keys.map(
                              (k) => CheckboxListTile(
                                title: Row(
                                  children: [
                                    Icon(
                                      k == 'public' ? Icons.lock_open : Icons.lock,
                                      color: theme.primaryColor,
                                    ),
                                    SizedBox(width: 4),
                                    Text(k),
                                  ],
                                ),
                                value: _access[k],
                                onChanged: (v) {
                                  setState(() {
                                    _access[k] = v ?? false;
                                  });
                                },
                              ),
                            ),
                            Divider(),
                            Text(
                              'Distance (${_distance.toInt()} mi)',
                              style: theme.textTheme.titleMedium,
                            ),
                            Slider(
                              min: 0,
                              max: 100,
                              divisions: 20,
                              value: _distance,
                              onChanged: (v) => setState(() => _distance = v),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Map and list
                    Expanded(
                      child: Column(
                        children: [
                          // Map view
                          Expanded(
                            flex: 2,
                            child: GoogleMap(
                              initialCameraPosition: CameraPosition(
                                target: LatLng(28.4, -81.5),
                                zoom: 10,
                              ),
                              onMapCreated: (c) => _mapController = c,
                              markers: _spots
                                  .where(_filterSpot)
                                  .map(
                                    (s) => Marker(
                                      markerId: MarkerId(s['id'].toString()),
                                      position: LatLng(s['lat'], s['lng']),
                                      infoWindow: InfoWindow(title: s['name']),
                                    ),
                                  )
                                  .toSet(),
                            ),
                          ),
                          // List view
                          Expanded(
                            flex: 1,
                            child: ListView.builder(
                              padding: EdgeInsets.all(8),
                              itemCount: _spots.where(_filterSpot).length,
                              itemBuilder: (ctx, idx) {
                                final s = _spots.where(_filterSpot).toList()[idx];
                                return Card(
                                  child: ListTile(
                                    leading: Icon(
                                      Icons.pin_drop,
                                      color: theme.primaryColor,
                                    ),
                                    title: Text(s['name']),
                                    subtitle: Text((s['species'] as List).join(', ')),
                                    onTap: () => _mapController?.animateCamera(
                                      CameraUpdate.newLatLng(
                                        LatLng(s['lat'], s['lng']),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}