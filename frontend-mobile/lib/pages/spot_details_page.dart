import 'package:flutter/material.dart';

class SpotDetailsPage extends StatefulWidget {
  const SpotDetailsPage({super.key});

  @override
  _SpotDetailsPageState createState() => _SpotDetailsPageState();
}

class _SpotDetailsPageState extends State<SpotDetailsPage> {
  bool _fav = false;

  final Map<String, dynamic> _spot = {
    'name': 'Lake Tohopekaliga',
    'description': '22,700-acre lake known for trophy bass fishing',
    'allowed': ['Largemouth Bass', 'Bluegill', 'Crappie', 'Catfish'],
    'access': 'public',
    'coords': {'lat': 28.2, 'lng': -81.4},
    'best': 'Early morning and late evening',
    'regs': 'License required',
    'amenities': ['Boat ramps', 'Fishing pier', 'Parking', 'Restrooms'],
    'catches': [
      {
        'user': 'Carlos M.',
        'fish': 'Largemouth Bass',
        'weight': '8.2 lbs',
        'time': '2 days ago',
        'likes': 24,
        'comments': 5,
        'image': 'https://images.unsplash.com/photo-1594804233323-5f7b3b3a1e29'
      },
      {
        'user': 'Maria S.',
        'fish': 'Crappie',
        'weight': '2.5 lbs',
        'time': '1 week ago',
        'likes': 18,
        'comments': 3,
        'image': 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1'
      }
    ]
  };

  @override
  Widget build(BuildContext ctx) {
    final theme = Theme.of(ctx);
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header + buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _spot['name'],
                      style: theme.textTheme.headlineLarge,
                    ),
                    Row(
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => setState(() => _fav = !_fav),
                          icon: Icon(
                            Icons.favorite,
                            color: _fav ? Colors.red : Colors.grey,
                          ),
                          label: Text(_fav ? 'Saved' : 'Save'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: theme.primaryColor,
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton.icon(
                          onPressed: () => Navigator.pushNamed(ctx, '/add-catch'),
                          icon: const Icon(Icons.add),
                          label: const Text('Add Catch'),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Spot info
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('About this Spot', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        Text(_spot['description']),
                        const SizedBox(height: 16),
                        Text('Fish Species', style: theme.textTheme.titleSmall),
                        Wrap(
                          spacing: 8,
                          children: (_spot['allowed'] as List)
                              .map<Widget>((s) => Chip(label: Text(s)))
                              .toList(),
                        ),
                        const SizedBox(height: 8),
                        Text('Access', style: theme.textTheme.titleSmall),
                        Text(_spot['access']),
                        const SizedBox(height: 8),
                        Text('Best Times', style: theme.textTheme.titleSmall),
                        Text(_spot['best']),
                        const SizedBox(height: 8),
                        Text('Regulations', style: theme.textTheme.titleSmall),
                        Text(_spot['regs']),
                        const SizedBox(height: 8),
                        Text('Amenities', style: theme.textTheme.titleSmall),
                        Wrap(
                          spacing: 8,
                          children: (_spot['amenities'] as List)
                              .map<Widget>((a) => Chip(label: Text(a)))
                              .toList(),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),
                // Map placeholder
                Card(
                  child: SizedBox(
                    height: 200,
                    child: Center(
                      child: Text(
                        'Map placeholder (Lat: ${_spot['coords']['lat']}, Lng: ${_spot['coords']['lng']})',
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),
                // Recent catches
                Text('Recent Catches', style: theme.textTheme.titleMedium),
                const SizedBox(height: 8),
                ...(_spot['catches'] as List).map<Widget>((c) {
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(c['user'], style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text(c['time'], style: const TextStyle(color: Colors.grey)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('Caught a ${c['fish']} weighing ${c['weight']}'),
                          if (c['image'] != null) ...[
                            const SizedBox(height: 8),
                            Image.network(c['image'], height: 150, fit: BoxFit.cover),
                          ],
                          OverflowBar(
                            children: [
                              TextButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.thumb_up),
                                label: Text(c['likes'].toString()),
                              ),
                              TextButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.comment),
                                label: Text(c['comments'].toString()),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}