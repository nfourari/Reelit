import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    final api = context.read<ApiService>();
    try {
      final res = await api
          .login(_emailCtrl.text.trim(), _passCtrl.text)
          .timeout(const Duration(seconds: 10));

      setState(() => _isLoading = false);

      if (res['success'] == true) {
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message'] as String),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } on TimeoutException {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Server did not respond. Try again later.')),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (Navigator.of(context).canPop())
                    IconButton(
                      icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  Card(
                    elevation: 8,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                      child: Column(
                        children: [
                          // logo + title
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [theme.primaryColor, theme.colorScheme.secondary],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.park, color: Colors.white),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Shuzzy+',
                                style: theme.textTheme.headlineLarge?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  foreground: Paint()
                                    ..shader = LinearGradient(
                                      colors: [theme.primaryColor, theme.colorScheme.secondary],
                                    ).createShader(const Rect.fromLTWH(0, 0, 200, 0)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text('Welcome Back', style: theme.textTheme.titleLarge),
                          const SizedBox(height: 4),
                          Text(
                            'Sign in to your Orlando fishing account',
                            style: theme.textTheme.titleSmall
                                ?.copyWith(color: Colors.grey[600]),
                          ),

                          const SizedBox(height: 24),
                          TextField(
                            controller: _emailCtrl,
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              border: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.orange[200]!),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: theme.colorScheme.secondary),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _passCtrl,
                            obscureText: true,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              border: OutlineInputBorder(
                                borderSide: BorderSide(color: Colors.orange[200]!),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: theme.colorScheme.secondary),
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: _isLoading ? null : _handleLogin,
                              icon: _isLoading
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                          strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Icon(Icons.login),
                              label: Text(_isLoading ? 'Signing In...' : 'Sign In'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                backgroundColor: theme.primaryColor,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text("Don’t have an account? ",
                                  style: TextStyle(color: Colors.grey[600])),
                              GestureDetector(
                                onTap: () => Navigator.pushNamed(context, '/signup'),
                                child: Text(
                                  'Sign up here',
                                  style: TextStyle(
                                    color: theme.primaryColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
