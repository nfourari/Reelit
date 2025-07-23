import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';

class ApiService {
  // Replace with our actual backend URL
  static const String _baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://shuzzy.top/api',
  );

  String? _token;

  ApiService() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
  }

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    _token = token;
    debugPrint('Token saved: $_token');
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _token = null;
    debugPrint('Token cleared.');
  }

  Map<String, String> get _headers {
    return {
      'Content-Type': 'application/json', // <- http package will handle this
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
  }

  /// Log in and store the returned token for future calls.
  Future<Map<String, dynamic>> login(String email, String password) async {
    final uri = Uri.parse('$_baseUrl/users/login');
    final resp = await http.post(
      uri,
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );

    final raw = jsonDecode(resp.body) as Map<String, dynamic>;

    // if we got a token back, treat this as success
    String? token;
    if (raw['token'] != null) {
      token = raw['token'] as String;
    } else if (raw['user']?['token'] != null) {
      token = raw['user']['token'] as String;
    }

    if (resp.statusCode == 200 && token != null) {
      _token = token;
      return {
        'success': true,
        'message': null,
        'data': raw,
      };
    } else {
      // pick up any server‐sent message, or default
      return {
        'success': false,
        'message': raw['message'] ?? 'Invalid credentials',
      };
    }
  }

  /// Sign up a new user.
  Future<Map<String, dynamic>> signup({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$_baseUrl/users/register');
    final resp = await http.post(
      uri,
      headers: _headers,
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
      }),
    );

    return jsonDecode(resp.body) as Map<String, dynamic>;
  }

  /// Fetch the dashboard data (e.g. activity feed, quick stats, weather).
  Future<Map<String, dynamic>> fetchDashboard() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/dashboard'), headers: _headers);
    return jsonDecode(resp.body);
  }

  /// Send a chat message to a user or in a room.
  Future<Map<String, dynamic>> sendMessage(
      String conversationId, String message) async {
    final resp = await http.post(
      Uri.parse('$_baseUrl/messages'),
      headers: _headers,
      body: jsonEncode({
        'conversationId': conversationId,
        'message': message,
      }),
    );
    return jsonDecode(resp.body);
  }

  /// Get the current user’s profile.
  Future<Map<String, dynamic>> getProfile() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/users/profile'), headers: _headers);
    return jsonDecode(resp.body);
  }

  /// Update user settings (e.g. preferences, notification toggles).
  Future<Map<String, dynamic>> updateSettings(
      Map<String, dynamic> settings) async {
    final resp = await http.put(
      Uri.parse('$_baseUrl/users/settings'),
      headers: _headers,
      body: jsonEncode(settings),
    );
    return jsonDecode(resp.body);
  }

  /// Get weather api
  Future<Map<String, dynamic>> fetchWeather() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/weather'), headers: _headers);
    return jsonDecode(resp.body);
  }

  /// Clear out the stored token (e.g. on logout).
  void logout() {
    _token = null;
  }

  Future<List<dynamic>> fetchCatches() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/catches'), headers: _headers);
    final data = jsonDecode(resp.body) as Map<String, dynamic>;
    if (resp.statusCode == 200 && data['success'] == true) {
      return data['data'] as List<dynamic>;
    }
    throw Exception('Failed to load catches');
  }

  Future<Map<String, dynamic>> addCatch({
    required String species,
    required double weight,
    required double length,
    required String location,
    required String comment,
    File? photo,
  }) async {
    // Ensure we have a token before making the request
    if (_token == null) {
      await _loadToken();
      if (_token == null) {
        throw Exception('User not authenticated. Please log in again.');
      }
    }

    final uri = Uri.parse('$_baseUrl/catches');
    final request = http.MultipartRequest('POST', uri)
      ..headers.addAll(_headers)
      ..fields['species'] = species
      ..fields['weight'] = weight.toString()
      ..fields['length'] = length.toString()
      ..fields['location'] = location
      ..fields['comment'] = comment;

    if (photo != null) {
      final mimeType = 'image/${photo.path.split('.').last}';
      request.files.add(
        await http.MultipartFile.fromPath(
          'image',
          photo.path,
          contentType: MediaType.parse(mimeType),
        ),
      );
    }
    final streamed = await request.send();
    final resp = await http.Response.fromStream(streamed);
    final data = jsonDecode(resp.body) as Map<String, dynamic>;

    if ((resp.statusCode == 200 || resp.statusCode == 201) &&
        data['success'] == true) {
      return data;
    }
    throw Exception(data['message'] ?? 'Failed to add catch. Status: ${resp.statusCode}');
  }
}
