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

  // Current weather fields:
  int? _temp;
  int? _feelsLike;
  String? _humidity;
  String? _wind;
  String? _precip;

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
    const url =
        'https://api.open-meteo.com/v1/forecast'
        '?latitude=28.5383'
        '&longitude=-81.3792'
        '&current_weather=true'
        '&hourly=relativehumidity_2m,precipitation'
        '&temperature_unit=fahrenheit'
        '&wind_speed_unit=mph'
        '&precipitation_unit=inch';

    try {
      final resp = await http.get(Uri.parse(url));
      if (resp.statusCode != 200) {
        throw Exception('HTTP ${resp.statusCode}');
      }
      final data = json.decode(resp.body) as Map<String, dynamic>;

      // extract current weather
      final cw = data['current_weather'] as Map<String, dynamic>?;

      // find index in the hourly arrays that matches current time
      final hourly = data['hourly'] as Map<String, dynamic>?;
      String? hum;
      String? prec;

      if (hourly != null && cw != null) {
        final times = List<String>.from(hourly['time'] ?? []);
        final idx = times.indexOf(cw['time'] as String);
        if (idx >= 0) {
          final rh = List<num>.from(hourly['relativehumidity_2m'] ?? []);
          final pr = List<num>.from(hourly['precipitation'] ?? []);
          hum = '${rh[idx].round()}%';
          prec = pr[idx].toStringAsFixed(2);
        }
      }

      setState(() {
        _temp = cw != null ? (cw['temperature'] as num).round() : null;
        _feelsLike =
            cw != null ? (cw['apparent_temperature'] as num?)?.round() : null;
        _wind = cw != null ? '${(cw['windspeed'] as num).round()} mph' : null;
        _humidity = hum;
        _precip = prec;
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

                // feed
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
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(item['user'] as String,
                                              style: const TextStyle(
                                                  fontWeight:
                                                      FontWeight.bold)),
                                          Text(item['time'] as String,
                                              style: const TextStyle(
                                                  color: Colors.grey))
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text((item['action'] as String) +
                                          ' ' +
                                          ((item['fish'] as String?) ??
                                              (item['achievement']
                                                  as String))),
                                      if (item['image'] != null) ...[
                                        const SizedBox(height: 8),
                                        Image.network(
                                          item['image'] as String,
                                          height: 150,
                                          fit: BoxFit.cover,
                                        ),
                                      ],
                                      const SizedBox(height: 8),
                                      Row(children: [
                                        const Icon(Icons.thumb_up),
                                        const SizedBox(width: 4),
                                        Text((item['likes'] as int).toString()),
                                        const SizedBox(width: 16),
                                        const Icon(Icons.comment),
                                        const SizedBox(width: 4),
                                        Text(
                                            (item['comments'] as int).toString()),
                                      ]),
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

                // stats & weather
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
                              Text('Quick Stats',
                                  style: theme.textTheme.titleMedium),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  _statCard(
                                      c,
                                      'Total Catches',
                                      _stats['totalCatches'].toString(),
                                      Icons.pool),
                                  _statCard(
                                      c,
                                      'Achievements',
                                      _stats['achievements'].toString(),
                                      Icons.emoji_events),
                                  _statCard(
                                      c,
                                      'Favorite Spots',
                                      _stats['favoriteSpots'].toString(),
                                      Icons.pin_drop),
                                  _statCard(
                                      c,
                                      'Personal Best',
                                      _stats['personalBest'] as String,
                                      Icons.whatshot),
                                ],
                              ),
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
                              ? const Center(
                                  child: CircularProgressIndicator())
                              : _error != null
                                  ? Center(
                                      child: Text(_error!,
                                          style: const TextStyle(
                                              color: Colors.red)))
                                  : Column(
                                      children: [
                                        Text('Weather in Orlando',
                                            style: theme
                                                .textTheme.titleMedium),
                                        const SizedBox(height: 8),
                                        Text(
                                          _temp != null
                                              ? '$_temp°F'
                                              : 'N/A',
                                          style:
                                              const TextStyle(fontSize: 24),
                                        ),
                                        const SizedBox(height: 4),
                                        if (_feelsLike != null)
                                          Text(
                                              'Feels like $_feelsLike°F',
                                              style: const TextStyle(
                                                  color: Colors.grey)),
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceEvenly,
                                          children: [
                                            Column(
                                              children: [
                                                const Icon(Icons.opacity),
                                                const SizedBox(height: 4),
                                                Text(_humidity ?? '—'),
                                                const Text('Humidity'),
                                              ],
                                            ),
                                            Column(
                                              children: [
                                                const Icon(Icons.air),
                                                const SizedBox(height: 4),
                                                Text(_wind ?? '—'),
                                                const Text('Wind'),
                                              ],
                                            ),
                                            Column(
                                              children: [
                                                const Icon(Icons.umbrella),
                                                const SizedBox(height: 4),
                                                Text(_precip ?? '—'),
                                                const Text('Precip'),
                                              ],
                                            ),
                                          ],
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

  Widget _statCard(
      BuildContext context, String title, String value, IconData icon) {
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
