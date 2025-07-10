import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _firstNameCtrl = TextEditingController();
  final _lastNameCtrl  = TextEditingController();
  final _emailCtrl     = TextEditingController();
  final _passCtrl      = TextEditingController();
  final _confirmCtrl   = TextEditingController();

  bool _isLoading = false;

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    if (_passCtrl.text != _confirmCtrl.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Passwords do not match'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    final api = context.read<ApiService>();
    final res = await api.signup(
      firstName: _firstNameCtrl.text.trim(),
      lastName:  _lastNameCtrl.text.trim(),
      email:     _emailCtrl.text.trim(),
      password:  _passCtrl.text,
    );

    setState(() => _isLoading = false);

    if (res['token'] != null) {
      // successful registration returns a token
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Signup failed'),
          backgroundColor: Colors.redAccent,
        ),
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
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
                    onPressed: () => Navigator.pop(context),
                  ),
                  Card(
                    elevation: 8,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          // Logo + title
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      theme.primaryColor,
                                      theme.colorScheme.secondary
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.park,
                                    color: Colors.white),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Shuzzy+',
                                style: theme.textTheme.headlineLarge
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),

                          const SizedBox(height: 16),
                          Text('Join Shuzzy+',
                              style: theme.textTheme.titleLarge),
                          const SizedBox(height: 8),
                          Text(
                            'Create your Orlando fishing account',
                            style: TextStyle(color: Colors.grey[600]),
                          ),

                          // const SizedBox(height: 24),
                          // // New fields: login, first name, last name
                          // TextField(
                          //   controller: _loginCtrl,
                          //   decoration:
                          //       const InputDecoration(labelText: 'Username'),
                          // ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _firstNameCtrl,
                            decoration:
                                const InputDecoration(labelText: 'First Name'),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _lastNameCtrl,
                            decoration:
                                const InputDecoration(labelText: 'Last Name'),
                          ),

                          const SizedBox(height: 16),
                          TextField(
                            controller: _emailCtrl,
                            decoration:
                                const InputDecoration(labelText: 'Email'),
                            keyboardType: TextInputType.emailAddress,
                          ),

                          const SizedBox(height: 16),
                          TextField(
                            controller: _passCtrl,
                            decoration:
                                const InputDecoration(labelText: 'Password'),
                            obscureText: true,
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _confirmCtrl,
                            decoration: const InputDecoration(
                                labelText: 'Confirm Password'),
                            obscureText: true,
                          ),

                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: _isLoading ? null : _handleSignup,
                              icon: _isLoading
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Icon(Icons.person_add),
                              label: Text(_isLoading
                                  ? 'Creating Account...'
                                  : 'Create Account'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: theme.primaryColor,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),
                          TextButton(
                            onPressed: () => Navigator
                                .pushReplacementNamed(context, '/login'),
                            child: const Text(
                                'Already have an account? Sign in here'),
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















// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../services/api_service.dart';

// class SignupPage extends StatefulWidget {
//   @override
//   _SignupPageState createState() => _SignupPageState();
// }

// class _SignupPageState extends State<SignupPage> {
//   final _nameCtrl = TextEditingController();
//   final _emailCtrl = TextEditingController();
//   final _passCtrl = TextEditingController();
//   final _confirmCtrl = TextEditingController();
//   bool _isLoading = false;

//   Future<void> _handleSignup() async {
//     if (_passCtrl.text != _confirmCtrl.text) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text('Passwords do not match'),
//           backgroundColor: Colors.redAccent,
//         ),
//       );
//       return;
//     }
//     setState(() => _isLoading = true);
//     final api = context.read<ApiService>();
//     final res = await api.signup(
//       _nameCtrl.text,
//       _emailCtrl.text,
//       _passCtrl.text,
//     );
//     setState(() => _isLoading = false);
//     if (res['success'] == true) {
//       Navigator.pushReplacementNamed(context, '/login');
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text(res['message'] ?? 'Signup failed'),
//           backgroundColor: Colors.redAccent,
//         ),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final theme = Theme.of(context);
//     return Scaffold(
//       body: Container(
//         decoration: BoxDecoration(
//           gradient: LinearGradient(
//             colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
//             begin: Alignment.topCenter,
//             end: Alignment.bottomCenter,
//           ),
//         ),
//         child: SafeArea(
//           child: Center(
//             child: SingleChildScrollView(
//               padding: EdgeInsets.all(16),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   IconButton(
//                     icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
//                     onPressed: () => Navigator.pop(context),
//                   ),
//                   Card(
//                     elevation: 8,
//                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//                     child: Padding(
//                       padding: EdgeInsets.all(24),
//                       child: Column(
//                         children: [
//                           Row(
//                             mainAxisAlignment: MainAxisAlignment.center,
//                             children: [
//                               Container(
//                                 width: 40,
//                                 height: 40,
//                                 decoration: BoxDecoration(
//                                   gradient: LinearGradient(
//                                     colors: [theme.primaryColor, theme.colorScheme.secondary],
//                                   ),
//                                   borderRadius: BorderRadius.circular(8),
//                                 ),
//                                 child: Icon(Icons.park, color: Colors.white),
//                               ),
//                               SizedBox(width: 8),
//                               Text(
//                                 'Shuzzy+',
//                                 style: theme.textTheme.headlineLarge?.copyWith(
//                                   fontWeight: FontWeight.bold,
//                                 ),
//                               ),
//                             ],
//                           ),
//                           SizedBox(height: 16),
//                           Text('Join Shuzzy+', style: theme.textTheme.titleLarge),
//                           SizedBox(height: 8),
//                           Text(
//                             'Create your Orlando fishing account',
//                             style: TextStyle(color: Colors.grey[600]),
//                           ),
//                           SizedBox(height: 24),
//                           TextField(
//                             controller: _nameCtrl,
//                             decoration: InputDecoration(labelText: 'Full Name'),
//                           ),
//                           SizedBox(height: 16),
//                           TextField(
//                             controller: _emailCtrl,
//                             decoration: InputDecoration(labelText: 'Email'),
//                             keyboardType: TextInputType.emailAddress,
//                           ),
//                           SizedBox(height: 16),
//                           TextField(
//                             controller: _passCtrl,
//                             decoration: InputDecoration(labelText: 'Password'),
//                             obscureText: true,
//                           ),
//                           SizedBox(height: 16),
//                           TextField(
//                             controller: _confirmCtrl,
//                             decoration: InputDecoration(labelText: 'Confirm Password'),
//                             obscureText: true,
//                           ),
//                           SizedBox(height: 24),
//                           SizedBox(
//                             width: double.infinity,
//                             child: ElevatedButton.icon(
//                               onPressed: _isLoading ? null : _handleSignup,
//                               icon: _isLoading
//                                   ? SizedBox(
//                                       width: 16,
//                                       height: 16,
//                                       child: CircularProgressIndicator(
//                                         strokeWidth: 2,
//                                         color: Colors.white,
//                                       ),
//                                     )
//                                   : Icon(Icons.person_add),
//                               label: Text(
//                                 _isLoading ? 'Creating Account...' : 'Create Account',
//                               ),
//                               style: ElevatedButton.styleFrom(
//                                 backgroundColor: theme.primaryColor,
//                                 foregroundColor: Colors.white,
//                               ),
//                             ),
//                           ),
//                           SizedBox(height: 16),
//                           TextButton(
//                             onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
//                             child: Text('Already have an account? Sign in here'),
//                           )
//                         ],
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }