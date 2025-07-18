import 'package:flutter/material.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, String>> _catches = [
    {'fish': 'Bass', 'time': '2 days ago'},
    // ...
  ];
  final List<Map<String, String>> _friends = [
    {'name': 'Carlos M.', 'status': 'online'},
    // ...
  ];
  final List<Map<String, String>> _achievements = [
    {'name': 'First Catch', 'date': 'Jan 2022'},
    // ...
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Column(
        children: [
          // Cover photo
          Stack(
            children: [
              Image.network(
                'https://...coverPhoto...',
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              Positioned(
                right: 16,
                top: 16,
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit),
                  label: const Text('Edit Profile'),
                ),
              )
            ],
          ),
          const SizedBox(height: 8),
          // Avatar + name
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage('https://...avatar...'),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('John Fisherman',
                        style: theme.textTheme.headlineLarge),
                    const Text('@johnfish', style: TextStyle(color: Colors.grey)),
                  ],
                ),
              ],
            ),
          ),
          // Tabs
          TabBar(
            controller: _tabController,
            labelColor: theme.primaryColor,
            tabs: const [Tab(text: 'Catches'), Tab(text: 'Friends'), Tab(text: 'Achievements')],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Catches
                ListView.builder(
                  itemCount: _catches.length,
                  itemBuilder: (ctx, i) => ListTile(
                    title: Text(_catches[i]['fish'] ?? ''),
                    trailing: Text(_catches[i]['time'] ?? ''),
                  ),
                ),
                // Friends
                GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 3,
                  ),
                  itemCount: _friends.length,
                  itemBuilder: (ctx, i) => Card(
                    child: Center(
                      child: Text(_friends[i]['name'] ?? ''),
                    ),
                  ),
                ),
                // Achievements
                ListView.builder(
                  itemCount: _achievements.length,
                  itemBuilder: (ctx, i) => ListTile(
                    leading: Icon(Icons.emoji_events, color: theme.primaryColor),
                    title: Text(_achievements[i]['name'] ?? ''),
                    subtitle: Text(_achievements[i]['date'] ?? ''),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}