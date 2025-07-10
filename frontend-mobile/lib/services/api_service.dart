import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Replace with our actual backend URL
  static const String _baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:5001/api',
  );

  // Optional: store auth token once logged in
  String? _token;

  // Helper to include token in headers if present
  Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (_token != null) headers['Authorization'] = 'Bearer $_token';
    return headers;
  }


  /// Log in and store the returned token for future calls.
  Future<Map<String, dynamic>> login(String email, String password) async {
    final uri = Uri.parse('$_baseUrl/auth/login');
    final resp = await http.post(
      uri,
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(resp.body) as Map<String, dynamic>;
    if (resp.statusCode == 200 && data['token'] != null) {
      _token = data['token'] as String;
    }
    return data;
  }

  /// Sign up a new user.
  Future<Map<String, dynamic>> signup({
    required String login,
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$_baseUrl/auth/register');
    final resp = await http.post(
      uri,
      headers: _headers,
      body: jsonEncode({
        'login':     login,
        'firstName': firstName,
        'lastName':  lastName,
        'email':     email,
        'password':  password,
      }),
    );

    return jsonDecode(resp.body) as Map<String, dynamic>;
  }

  /// Fetch the dashboard data (e.g. activity feed, quick stats, weather).
  Future<Map<String, dynamic>> fetchDashboard() async {
    final resp = await http.get(Uri.parse('$_baseUrl/dashboard'),
        headers: _headers);
    return jsonDecode(resp.body);
  }

  /// Retrieve pending requests (e.g. ride requests or whatever “requests” your app uses).
  Future<List<dynamic>> getRequests() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/requests'), headers: _headers);
    return jsonDecode(resp.body) as List<dynamic>;
  }

  /// Retrieve available offers.
  Future<List<dynamic>> getOffers() async {
    final resp =
        await http.get(Uri.parse('$_baseUrl/offers'), headers: _headers);
    return jsonDecode(resp.body) as List<dynamic>;
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

  /// Clear out the stored token (e.g. on logout).
  void logout() {
    _token = null;
  }
}
