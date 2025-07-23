import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import '../services/api_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> _recentCatches = [];
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

      _recentCatches = raw.take(5).map<Map<String, dynamic>>((item) {
        return {
          'user': item['userName'] ?? 'You',
          'action': 'caught a',
          'fish': item['catchName'],
          'weight': '${item['catchWeight']} lbs',
          'location': item['catchLocation'],
          'time': DateTime.parse(item['caughtAt']),
          'comments': item['comments'] ?? 0,
          'image': item['imageUrl'],
        };
      }).toList();

      _totalCatches = raw.length;
      if (raw.isNotEmpty) {
        final heaviest = raw.reduce((a, b) =>
            (a['catchWeight'] as num) > (b['catchWeight'] as num) ? a : b);
        _personalBest =
            '${heaviest['catchWeight']} lbs ${heaviest['catchName']}';
      }

      await _loadWeather();

      setState(() {
        _loading = false;
      });
    } catch(e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }


  Future<void> _loadWeather() async {
    try {
      const url = 'https://api.open-meteo.com/v1/forecast'
          '?latitude=28.5383&longitude=-81.3792'
          '&current_weather=true'
          '&hourly=relativehumidity_2m,precipitation'
          '&temperature_unit=fahrenheit'
          '&wind_speed_unit=mph'
          '&precipitation_unit=inch';
      
      final resp = await http.get(Uri.parse(url));
      if (resp.statusCode != 200) return;
      
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
          hum = '${rh[idx].round()}%';
          pr = pp[idx].toStringAsFixed(2);
        }
      }
      
      setState(() {
        _temp = cw != null ? (cw['temperature'] as num).round() : null;
        _feelsLike = cw != null ? (cw['apparent_temperature'] as num?)?.round() : null;
        _wind = cw != null ? '${(cw['windspeed'] as num).round()} mph' : null;
        _humidity = hum;
        _precip = pr;
      });
    } catch (e) {
      // Weather is optional, don't fail the whole page
      print('Weather error: $e');
    }
  }


  Widget _buildWelcomeCard() {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.waving_hand, color: Colors.white, size: 28),
              SizedBox(width: 12),
              Text(
                'Welcome back!',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Ready for your next fishing adventure?',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.9),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildStatsCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
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
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeatherCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.orange.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.wb_sunny, color: Colors.orange, size: 20),
              ),
              const SizedBox(width: 12),
              const Text(
                'Weather in Orlando',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _temp != null ? '${_temp}°F' : 'N/A',
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  if (_feelsLike != null)
                    Text(
                      'Feels like ${_feelsLike}°F',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                ],
              ),
              Column(
                children: [
                  _buildWeatherDetail(Icons.opacity, 'Humidity', _humidity ?? '—'),
                  const SizedBox(height: 8),
                  _buildWeatherDetail(Icons.air, 'Wind', _wind ?? '—'),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }


  Widget _buildWeatherDetail(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 10,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRecentCatchCard(Map<String, dynamic> catchData) {
    final DateTime caughtAt = catchData['time'] as DateTime;
    final String timeAgo = _getTimeAgo(caughtAt);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Image or placeholder
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: catchData['image'] != null
                ? Image.network(
                    catchData['image'] as String,
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      width: 60,
                      height: 60,
                      color: Colors.grey[200],
                      child: const Icon(Icons.broken_image, color: Colors.grey),
                    ),
                  )
                : Container(
                    width: 60,
                    height: 60,
                    color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                    child: const Icon(
                      Icons.catching_pokemon,
                      color: Color(0xFF2563EB),
                    ),
                  ),
          ),
          
          const SizedBox(width: 16),
          
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  catchData['fish'] as String,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.location_on, size: 14, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        catchData['location'] as String,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  timeAgo,
                  style: TextStyle(
                    color: Colors.grey[500],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          
          // Weight badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              '${catchData['weight']} lbs',
              style: const TextStyle(
                color: Color(0xFF2563EB),
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
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
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text('Error: $_error'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadAll,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

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
          child: RefreshIndicator(
            onRefresh: _loadAll,
            child: CustomScrollView(
              slivers: [
                // Header section
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Welcome card
                        _buildWelcomeCard(),
                        
                        const SizedBox(height: 20),
                        
                        // Stats row
                        Row(
                          children: [
                            _buildStatsCard(
                              'Total Catches',
                              '$_totalCatches',
                              Icons.catching_pokemon,
                              const Color(0xFF2563EB),
                            ),
                            const SizedBox(width: 12),
                            _buildStatsCard(
                              'Personal Best',
                              _personalBest.length > 15 
                                ? '${_personalBest.split(' ').take(2).join(' ')}'
                                : _personalBest,
                              Icons.emoji_events,
                              const Color(0xFFF59E0B),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 20),
                        
                        // Weather card
                        _buildWeatherCard(),
                        
                        const SizedBox(height: 24),
                        
                        // Recent catches section header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.history, color: Color(0xFF2563EB)),
                                SizedBox(width: 8),
                                Text(
                                  'Recent Catches',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                              ],
                            ),
                            if (_recentCatches.isNotEmpty)
                              TextButton(
                                onPressed: () {
                                  // Navigate to full catches list or profile
                                  // You can implement this navigation later
                                },
                                child: const Text('View All'),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Recent catches list
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: _recentCatches.isEmpty
                      ? SliverToBoxAdapter(
                          child: Container(
                            padding: const EdgeInsets.all(40),
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
                              children: [
                                Icon(
                                  Icons.catching_pokemon,
                                  size: 64,
                                  color: Colors.grey[400],
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'No catches yet!',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Tap the "Add Catch" tab to log your first catch',
                                  style: TextStyle(
                                    color: Colors.grey[500],
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        )
                      : SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) => _buildRecentCatchCard(_recentCatches[index]),
                            childCount: _recentCatches.length,
                          ),
                        ),
                ),
                
                // Bottom padding
                const SliverToBoxAdapter(
                  child: SizedBox(height: 20),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

  // Widget _statCard(
  //     BuildContext context, String title, String value, IconData icon) {
  //   final theme = Theme.of(context);
  //   return Container(
  //     width: (MediaQuery.of(context).size.width - 64) / 2,
  //     padding: const EdgeInsets.all(8),
  //     decoration: BoxDecoration(
  //       color: Colors.white,
  //       border: Border.all(color: Colors.orange.shade100),
  //       borderRadius: BorderRadius.circular(8),
  //     ),
  //     child: Column(
  //       children: [
  //         Icon(icon, color: theme.primaryColor),
  //         const SizedBox(height: 4),
  //         Text(title),
  //         Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
  //       ],
  //     ),
  //   );
  // }

