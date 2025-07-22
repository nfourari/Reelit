// Define data models for UserProfile and UserCatch
class UserProfile {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final int totalCatches;
  final DateTime createdAt;
  final bool isEmailVerified;

  UserProfile({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.totalCatches,
    required this.createdAt,
    required this.isEmailVerified,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['_id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      totalCatches: json['totalCatches'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      isEmailVerified: json['isEmailVerified'] ?? false,
    );
  }
}