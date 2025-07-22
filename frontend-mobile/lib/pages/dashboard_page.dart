import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import '../services/api_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> _feed = [];
  int _totalCatches = 0;
  String _personalBest = 'No catches yet';
  int? _temp;
  int? _feelsLike;
  String? _humidity;
  String? _wind;
  String? _precip;

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    try {
      final api = context.read<ApiService>();
      final raw = await api.fetchCatches();
      _feed = raw.map<Map<String, dynamic>>((item) {
        return {
          'user': item['userName'] ?? 'You',
          'action': 'caught a',
          'fish': item['catchName'],
          'weight': '${item['catchWeight']} lbs',
          'location': item['catchLocation'],
          'time': DateTime.parse(item['caughtAt'])
                  .difference(DateTime.now())
                  .inHours
                  .abs()
                  .toString() +
              'h ago',
          'likes': item['likes'] ?? 0,
          'comments': item['comments'] ?? 0,
          'image': item['imageUrl'],
        };
      }).toList();
      _totalCatches = raw.length;
      if (raw.isNotEmpty) {
        final heaviest = raw.reduce((a, b) =>
            (a['catchWeight'] as num) > (b['catchWeight'] as num) ? a : b);
        _personalBest = '${heaviest['catchWeight']} lbs ${heaviest['catchName']}';
      }
      const url = 'https://api.open-meteo.com/v1/forecast'
          '?latitude=28.5383&longitude=-81.3792'
          '&current_weather=true'
          '&hourly=relativehumidity_2m,precipitation'
          '&temperature_unit=fahrenheit'
          '&wind_speed_unit=mph'
          '&precipitation_unit=inch';
      final resp = await http.get(Uri.parse(url));
      if (resp.statusCode != 200) throw Exception('Weather \${resp.statusCode}');
      final data = json.decode(resp.body) as Map<String, dynamic>;
      final cw = data['current_weather'] as Map<String, dynamic>?;
      String? hum, pr;
      if (cw != null) {
        final hourly = data['hourly'] as Map<String, dynamic>;
        final times = List<String>.from(hourly['time'] ?? []);
        final idx = times.indexOf(cw['time'] as String);
        if (idx >= 0) {
          final rh = List<num>.from(hourly['relativehumidity_2m'] ?? []);
          final pp = List<num>.from(hourly['precipitation'] ?? []);
          hum = '\${rh[idx].round()}%';
          pr = pp[idx].toStringAsFixed(2);
        }
      }
      setState(() {
        _temp = cw != null ? (cw['temperature'] as num).round() : null;
        _feelsLike =
            cw != null ? (cw['apparent_temperature'] as num?)?.round() : null;
        _wind = cw != null ? '${(cw['windspeed'] as num).round()} mph' : null;
        _humidity = hum;
        _precip = pr;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (_error != null) {
      return Scaffold(
        body: Center(child: Text('Error: \$_error')),
      );
    }
    return Scaffold(
      body: Container(
        constraints: const BoxConstraints.expand(),
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
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: _feed.isEmpty
                        ? SizedBox(
                            height: 150,
                            child: Center(
                              child: Text(
                                'No catches logged yet!\nAdd one now!',
                                textAlign: TextAlign.center,
                                style: theme.textTheme.bodyLarge,
                              ),
                            ),
                          )
                        : Column(
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
                                                Text(
                                                  item['user'] as String,
                                                  style: const TextStyle(
                                                      fontWeight: FontWeight.bold),
                                                ),
                                                Text(
                                                  item['time'] as String,
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 4),
                                            Text('${item['action']} ${item['fish']}'),
                                            if (item['image'] != null) ...[
                                              const SizedBox(height: 8),
                                              Image.network(
                                                item['image'] as String,
                                                height: 150,
                                                fit: BoxFit.cover,
                                              ),
                                            ],
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                const Icon(Icons.thumb_up),
                                                const SizedBox(width: 4),
                                                Text('${item['likes']}'),
                                                const SizedBox(width: 16),
                                                const Icon(Icons.comment),
                                                const SizedBox(width: 4),
                                                Text('${item['comments']}'),
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
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Text('Your Stats', style: theme.textTheme.titleMedium),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  _statCard(context, 'Total Catches', '$_totalCatches', Icons.pool),
                                  _statCard(context, 'Personal Best', _personalBest, Icons.emoji_events),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Text('Weather in Orlando', style: theme.textTheme.titleMedium),
                              const SizedBox(height: 8),
                              Text(_temp != null ? '$_temp°F' : 'N/A', style: const TextStyle(fontSize: 24)),
                              if (_feelsLike != null) ...[
                                const SizedBox(height: 4),
                                Text('Feels like $_feelsLike°F', style: const TextStyle(color: Colors.grey)),
                              ],
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  Column(children: [
                                    const Icon(Icons.opacity),
                                    const SizedBox(height: 4),
                                    Text(_humidity ?? '—'),
                                    const Text('Humidity'),
                                  ]),
                                  Column(children: [
                                    const Icon(Icons.air),
                                    const SizedBox(height: 4),
                                    Text(_wind ?? '—'),
                                    const Text('Wind'),
                                  ]),
                                  Column(children: [
                                    const Icon(Icons.umbrella),
                                    const SizedBox(height: 4),
                                    Text(_precip ?? '—'),
                                    const Text('Precip'),
                                  ]),
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
