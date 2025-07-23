import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/user_profile.dart'; // Make sure this path is correct

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key ? key}) : super(key: key);

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool _loading = true;
  String? _error;
  UserProfile? _userProfile;
  List<Map<String, dynamic>> _userCatches = []; // To store user-specific catches

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    try {
      final api = context.read<ApiService>();

      // Fetch user profile
      final profileData = await api.getProfile();
      _userProfile = UserProfile.fromJson(profileData);

      // Fetch user's catches (assuming backend filters by authenticated user)
      final rawCatches = await api.fetchCatches(); 
      _userCatches = rawCatches.map<Map<String, dynamic>>((item) {
        return {
          'fish': item['catchName'],
          'weight': '${item['catchWeight']} lbs',
          'location': item['catchLocation'],
          'time': DateTime.parse(item['caughtAt']).difference(DateTime.now()).inHours.abs().toString() + 'h ago',
          'image': item['imageUrl'],
        };
      }).toList();

      setState(() {
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        body: Center(child: Text('Error: $_error')),
      );
    }

    return Scaffold(
      body: Container(
        constraints: const BoxConstraints.expand(),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('My Profile', style: theme.textTheme.headlineLarge),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: CircleAvatar(
                            radius: 50,
                            backgroundColor: theme.primaryColor.withOpacity(0.1),
                            child: Icon(Icons.person, size: 60, color: theme.primaryColor),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Center(
                          child: Text(
                            '${_userProfile?.firstName} ${_userProfile?.lastName}',
                            style: theme.textTheme.headlineSmall,
                          ),
                        ),
                        Center(
                          child: Text(
                            _userProfile?.email ?? 'N/A',
                            style: theme.textTheme.bodyLarge?.copyWith(color: Colors.grey),
                          ),
                        ),
                        const Divider(height: 32),
                        Text('Profile Details', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        _buildProfileDetailRow(context, Icons.badge, 'Full Name', '${_userProfile?.firstName} ${_userProfile?.lastName}'),
                        _buildProfileDetailRow(context, Icons.email, 'Email', _userProfile?.email ?? 'N/A'),
                        // Add more profile details here if your UserProfile model has them
                        // _buildProfileDetailRow(context, Icons.location_on, 'Location', _userProfile?.location ?? 'N/A'),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('My Catches', style: theme.textTheme.titleMedium),
                        const SizedBox(height: 8),
                        _userCatches.isEmpty
                            ? SizedBox(
                                height: 100,
                                child: Center(
                                  child: Text(
                                    'You haven\'t logged any catches yet!',
                                    textAlign: TextAlign.center,
                                    style: theme.textTheme.bodyLarge,
                                  ),
                                ),
                              )
                            : ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _userCatches.length,
                                itemBuilder: (context, index) {
                                  final item = _userCatches[index];
                                  return Column(
                                    children: [
                                      Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(8),
                                            child: item['image'] != null
                                                ? Image.network(
                                                    item['image'] as String,
                                                    height: 80,
                                                    width: 80,
                                                    fit: BoxFit.cover,
                                                    errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image, size: 80),
                                                  )
                                                : Container(
                                                    height: 80,
                                                    width: 80,
                                                    color: Colors.grey[200],
                                                    child: const Icon(Icons.image_not_supported, size: 40),
                                                  ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  item['fish'] as String,
                                                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                                ),
                                                Text('Weight: ${item['weight']}'),
                                                Text('Location: ${item['location']}'),
                                                Text('Caught: ${item['time']}', style: const TextStyle(color: Colors.grey)),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const Divider(),
                                    ],
                                  );
                                },
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
    );
  }

  Widget _buildProfileDetailRow(BuildContext context, IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, color: Theme.of(context).primaryColor, size: 20),
          const SizedBox(width: 12),
          Text(
            '$title:',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyLarge,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

}