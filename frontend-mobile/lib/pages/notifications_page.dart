import 'package:flutter/material.dart';

class NotificationsPage extends StatefulWidget {
  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _notifications = [
    // example mock data
    { 'type': 'friend_request', 'user': 'Alex D.', 'message': 'sent you a friend request', 'time': '2 hours ago', 'read': false },
    // ... more items ...
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _filter(String tab) {
    switch (tab) {
      case 'All':
        return _notifications;
      case 'Requests':
        return _notifications.where((n) => n['type'] == 'friend_request').toList();
      case 'Activity':
        return _notifications.where((n) => n['type'] == 'like' || n['type'] == 'comment').toList();
      case 'Updates':
        return _notifications.where((n) => n['type'] == 'system').toList();
      default:
        return _notifications;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'All'),
            Tab(text: 'Requests'),
            Tab(text: 'Activity'),
            Tab(text: 'Updates'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                for (var n in _notifications) {
                  n['read'] = true;
                }
              });
            },
            child: Text('Mark all as read', style: TextStyle(color: Colors.white)),
          )
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: ['All', 'Requests', 'Activity', 'Updates'].map((tab) {
          final list = _filter(tab);
          if (list.isEmpty) {
            return Center(
              child: Text('No notifications', style: theme.textTheme.titleMedium),
            );
          }
          return ListView.builder(
            itemCount: list.length,
            itemBuilder: (ctx, i) {
              final n = list[i];
              return ListTile(
                title: Text(n['user'] ?? ''),
                subtitle: Text(n['message'] ?? ''),
                trailing: Text(n['time'] ?? ''),
                tileColor: n['read'] == true ? Colors.white : theme.colorScheme.secondary.withOpacity(0.1),
                onTap: () {
                  setState(() => n['read'] = true);
                },
              );
            },
          );
        }).toList(),
      ),
    );
  }
}