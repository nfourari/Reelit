import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _loading = true;
  String? _error;

  // live weather fields
  String location = '';
  int temp = 0;
  String cond = '';
  String precip = '';
  String wind = '';
  String humid = '';
  List<Map<String, dynamic>> forecast = [];

  // static feed & stats (unchanged)
  final List<Map<String, dynamic>> _feed = [
    {
      'user': 'Carlos M.',
      'action': 'caught a',
      'fish': 'Largemouth Bass',
      'weight': '8.2 lbs',
      'location': 'Lake Tohopekaliga',
      'time': '2h ago',
      'likes': 24,
      'comments': 5,
      'image': 'https://...'
    },
    {
      'user': 'Maria S.',
      'action': 'caught a',
      'fish': 'Snook',
      'weight': '12.5 lbs',
      'location': 'Mosquito Lagoon',
      'time': '4h ago',
      'likes': 32,
      'comments': 8,
      'image': 'https://...'
    },
    {
      'user': 'Tommy J.',
      'action': 'earned',
      'achievement': 'Master Angler',
      'time': '1d ago',
      'likes': 18,
      'comments': 3
    }
  ];
  final Map<String, dynamic> _stats = {
    'totalCatches': 47,
    'achievements': 8,
    'favoriteSpots': 12,
    'personalBest': '14.5 lbs Largemouth Bass'
  };

  @override
  void initState() {
    super.initState();
    _fetchWeather();
  }

  Future<void> _fetchWeather() async {
    try {
      final resp = await http.get(Uri.parse('http://localhost:5000/api/weather'));
      if (resp.statusCode != 200) throw Exception('HTTP ${resp.statusCode}');
      final data = json.decode(resp.body);

      setState(() {
        location = data['location'];
        temp = (data['temp'] as num).round();
        cond = data['cond'];
        precip = data['precip'];
        wind = data['wind'];
        humid = data['humid'];
        forecast = List<Map<String, dynamic>>.from(data['forecast']);
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Could not load weather';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext c) {
    final theme = Theme.of(c);

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
                Text('Dashboard', style: theme.textTheme.headlineLarge),
                const SizedBox(height: 16),

                // feed...
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: _feed.map((item) {
                        return Column(
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const CircleAvatar(child: Icon(Icons.person)),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(item['user'], style: const TextStyle(fontWeight: FontWeight.bold)),
                                          Text(item['time'], style: const TextStyle(color: Colors.grey)),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(item['action'] + ' ' + (item['fish'] ?? item['achievement'])),
                                      if (item['image'] != null) ...[
                                        const SizedBox(height: 8),
                                        Image.network(item['image'], height: 150, fit: BoxFit.cover),
                                      ],
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          const Icon(Icons.thumb_up),
                                          const SizedBox(width: 4),
                                          Text(item['likes'].toString()),
                                          const SizedBox(width: 16),
                                          const Icon(Icons.comment),
                                          const SizedBox(width: 4),
                                          Text(item['comments'].toString()),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const Divider(),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // stats & weather row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // quick stats
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Text('Quick Stats', style: theme.textTheme.titleMedium),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  _statCard(c, 'Total Catches', _stats['totalCatches'].toString(), Icons.pool),
                                  _statCard(c, 'Achievements', _stats['achievements'].toString(), Icons.emoji_events),
                                  _statCard(c, 'Favorite Spots', _stats['favoriteSpots'].toString(), Icons.pin_drop),
                                  _statCard(c, 'Personal Best', _stats['personalBest'], Icons.whatshot),
                                ],
                              )
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 16),

                    // live weather
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: _loading
                              ? const Center(child: CircularProgressIndicator())
                              : _error != null
                                  ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
                                  : Column(
                                      children: [
                                        Text('Weather', style: theme.textTheme.titleMedium),
                                        const SizedBox(height: 8),
                                        Text(location),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            const Icon(Icons.wb_sunny),
                                            const SizedBox(width: 8),
                                            Text('$temp°F', style: const TextStyle(fontSize: 24)),
                                          ],
                                        ),
                                        Text(cond),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                          children: [
                                            Column(children: [
                                              const Icon(Icons.opacity),
                                              const Text('Humidity'),
                                              Text(humid),
                                            ]),
                                            Column(children: [
                                              const Icon(Icons.air),
                                              const Text('Wind'),
                                              Text(wind),
                                            ]),
                                            Column(children: [
                                              const Icon(Icons.umbrella),
                                              const Text('Rain'),
                                              Text(precip),
                                            ]),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                          children: forecast.map((d) {
                                            return Column(
                                              children: [
                                                Text(d['day']),
                                                Icon(
                                                  d['cond'].contains('Rain')
                                                      ? Icons.grain
                                                      : d['cond'].contains('Sunny')
                                                          ? Icons.wb_sunny
                                                          : Icons.cloud,
                                                ),
                                                Text('${d['high']}°/${d['low']}°'),
                                              ],
                                            );
                                          }).toList(),
                                        ),
                                      ],
                                    ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _statCard(BuildContext context, String title, String value, IconData icon) {
    final theme = Theme.of(context);
    return Container(
      width: (MediaQuery.of(context).size.width - 64) / 2,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.orange.shade100),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(icon, color: theme.primaryColor),
          const SizedBox(height: 4),
          Text(title),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
