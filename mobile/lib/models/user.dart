class UserProfile {
  final String id;
  final String fullName;
  final String email;
  final String role;
  final String phone;
  final String city;
  final String province;
  final String sellerVerificationStatus;

  UserProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.phone = '',
    this.city = '',
    this.province = '',
    this.sellerVerificationStatus = 'not_applied',
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'buyer',
      phone: json['phone'] ?? '',
      city: json['city'] ?? '',
      province: json['province'] ?? '',
      sellerVerificationStatus: json['sellerVerificationStatus'] ?? 'not_applied',
    );
  }
}

