// Imports marked with a //* are not necessary, however, flutter is evil and will
// break without them, I'm at my wit's end with this. Flutter wins.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/api_service.dart';
import 'pages/login_page.dart';
import 'pages/signup_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/map_page.dart';
import 'pages/requests_page.dart'; //*
import 'pages/offers_page.dart'; //*
import 'pages/chat_page.dart'; //*
import 'pages/profile_page.dart';
import 'pages/settings_page.dart'; //*

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
        '/dashboard': (_) => DashboardPage(),
        '/map': (_) => MapPage(),
        '/requests': (_) => RequestsPage(),
        '/offers': (_) => OffersPage(),
        '/chat': (_) => ChatPage(),
        '/profile': (_) => ProfilePage(),
        '/settings': (_) => SettingsPage(),
      },
    ),
  );
}