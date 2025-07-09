import 'package:flutter/material.dart';

class NotFoundPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('404', style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Text(
              'Oops! Page not found',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            SizedBox(height: 16),
            TextButton(
              onPressed: () => Navigator.pushReplacementNamed(context, '/'),
              child: Text('Return to Home', style: TextStyle(color: Theme.of(context).colorScheme.secondary)),
            ),
          ],
        ),
      ),
    );
  }
}