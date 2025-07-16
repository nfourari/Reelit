import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'services/api_service.dart';
import 'pages/login_page.dart';
import 'pages/signup_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/map_page.dart';
import 'pages/profile_page.dart';
import 'pages/settings_page.dart';

void main() => runApp(ShuzzyApp());

class ShuzzyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) => MultiProvider(
        providers: [Provider<ApiService>(create: (_) => ApiService())],
        child: MaterialApp(
          title: 'Shuzzy Mobile',
          theme: ThemeData(primarySwatch: Colors.blue),
          initialRoute: '/login',
          routes: {
            '/login': (_) => LoginPage(),
            '/signup': (_) => SignupPage(),
            // After login/signup, route to HomeShell with bottom nav
            '/home': (_) => HomeShell(),  
            '/settings': (_) => SettingsPage(), // standalone settings
          },
        ),
      );
}

// HomeShell with BottomNavigationBar
class HomeShell extends StatefulWidget {
  @override
  _HomeShellState createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _currentIndex = 0;
  final _pages = [
    DashboardPage(),
    MapPage(),
    ProfilePage(),
  ];
  final _labels = ['Home', 'Map', 'Profile'];
  final _icons = [
    Icons.home,
    Icons.map,
    Icons.person,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        items: List.generate(_pages.length, (i) {
          return BottomNavigationBarItem(
            icon: Icon(_icons[i]),
            label: _labels[i],
          );
        }),
        onTap: (idx) => setState(() => _currentIndex = idx),
      ),
    );
  }
}