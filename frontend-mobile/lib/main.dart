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
import 'pages/catch_page.dart';

void main() => runApp(const ShuzzyApp());

class ShuzzyApp extends StatelessWidget {
  const ShuzzyApp({super.key});

  @override
  Widget build(BuildContext context) => MultiProvider(
        providers: [Provider<ApiService>(create: (_) => ApiService())],
        child: MaterialApp(
          title: 'Shuzzy Go',
          theme: ThemeData(primarySwatch: Colors.orange),
          initialRoute: '/login',
          routes: {
            '/login': (_) => const LoginPage(),
            '/signup': (_) => const SignupPage(),

            // After login/signup, route to HomeShell with bottom nav
            '/home': (_) => const HomeShell(),
            '/home/dashboard': (_) => const HomeShell(initialTab: 0),
            '/home/map': (_) => const HomeShell(initialTab: 1),
            '/home/add-catch': (_) => const HomeShell(initialTab: 2),
            '/home/profile': (_) => const HomeShell(initialTab: 3),
            '/settings': (_) => const SettingsPage(), // standalone settings
          },
        ),
      );
}

// HomeShell with BottomNavigationBar
class HomeShell extends StatefulWidget {
  final int initialTab;

  const HomeShell({super.key, this.initialTab = 0});

  @override
  _HomeShellState createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  late int _currentIndex = 0;

  

  final _labels = ['Home', 'Map', 'Add Catch', 'Profile'];
  final _icons = [
    Icons.home,
    Icons.map,
    Icons.catching_pokemon,
    Icons.person,
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTab;
  }

  @override
  void didUpdateWidget(HomeShell oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Update tab if the route changes
    if (widget.initialTab != oldWidget.initialTab) {
      setState(() {
        _currentIndex = widget.initialTab;
      });
    }
  }

   // Callback function to switch tabs
  void _switchToTab(int tabIndex) {
    setState(() {
      _currentIndex = tabIndex;
    });
  }

  // Create pages with callback for tab switching
  List<Widget> get _pages => [
    DashboardPage(onSwitchToProfile: () => _switchToTab(3)), // Pass callback to Dashboard
    const MapPage(),
    const AddCatchPage(),
    const ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {

    // Create pages with callback for tab switching
    final pages =  [
    DashboardPage(onSwitchToProfile: () => _switchToTab(3)),
    MapPage(),
    AddCatchPage(),
    ProfilePage(),
  ];

    return Scaffold(
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        items: List.generate(pages.length, (i) {
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
