import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget {
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
  final Map<String, dynamic> _weather = {
    'location': 'Orlando, FL',
    'temp': 84,
    'cond': 'Partly Cloudy',
    'precip': '20%',
    'wind': '8 mph',
    'humid': '65%',
    'forecast': [
      {'day': 'Today', 'high': 84, 'low': 72, 'cond': 'Partly Cloudy'},
      {'day': 'Tomorrow', 'high': 86, 'low': 74, 'cond': 'Sunny'},
      {'day': 'Wed', 'high': 82, 'low': 71, 'cond': 'Rain'}
    ]
  };

  @override
  Widget build(BuildContext c) {
    final theme = Theme.of(c);
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
          child: SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Dashboard', style: theme.textTheme.headlineLarge),
                SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      children: _feed.map((item) {
                        return Column(
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CircleAvatar(child: Icon(Icons.person)),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(item['user'],
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold)),
                                          Text(item['time'],
                                              style: TextStyle(color: Colors.grey))
                                        ],
                                      ),
                                      SizedBox(height: 4),
                                      Text(item['action'] + ' ' + (item['fish'] ?? item['achievement'])),
                                      if (item['image'] != null) ...[
                                        SizedBox(height: 8),
                                        Image.network(item['image'],
                                            height: 150, fit: BoxFit.cover),
                                      ],
                                      Row(children: [
                                        Icon(Icons.thumb_up),
                                        SizedBox(width: 4),
                                        Text(item['likes'].toString()),
                                        SizedBox(width: 16),
                                        Icon(Icons.comment),
                                        SizedBox(width: 4),
                                        Text(item['comments'].toString()),
                                      ]),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            Divider(),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
                ),
                SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Text('Quick Stats', style: theme.textTheme.titleMedium),
                              SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  _statCard(c, 'Total Catches', _stats['totalCatches'].toString(), Icons.pool),
                                  _statCard(c, 'Achievements', _stats['achievements'].toString(), Icons.emoji_events),
                                  _statCard(c, 'Favorite Spots', _stats['favoriteSpots'].toString(), Icons.pin_drop),
                                  _statCard(c, 'Personal Best', _stats['personalBest'], Icons.whatshot),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Text('Weather', style: theme.textTheme.titleMedium),
                              SizedBox(height: 8),
                              Text(_weather['location']),
                              SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.wb_sunny),
                                  SizedBox(width: 8),
                                  Text(
                                    '${_weather['temp']}°F',
                                    style: TextStyle(fontSize: 24),
                                  ),
                                ],
                              ),
                              Text(_weather['cond']),
                              SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  Column(children: [
                                    Icon(Icons.opacity),
                                    Text('Humidity'),
                                    Text(_weather['humid']),
                                  ]),
                                  Column(children: [
                                    Icon(Icons.air),
                                    Text('Wind'),
                                    Text(_weather['wind']),
                                  ]),
                                  Column(children: [
                                    Icon(Icons.umbrella),
                                    Text('Rain'),
                                    Text(_weather['precip']),
                                  ]),
                                ],
                              ),
                              SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: (_weather['forecast'] as List)
                                    .map((d) => Column(children: [
                                          Text(d['day']),
                                          Icon(
                                            d['cond'] == 'Sunny'
                                                ? Icons.wb_sunny
                                                : d['cond'] == 'Rain'
                                                    ? Icons.grain
                                                    : Icons.cloud,
                                          ),
                                          Text('${d['high']}°/${d['low']}°'),
                                        ]))
                                    .toList(),
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
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.orange.shade100),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(icon, color: theme.primaryColor),
          SizedBox(height: 4),
          Text(title),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}