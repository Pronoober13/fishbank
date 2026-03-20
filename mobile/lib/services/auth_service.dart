import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  static const _tokenKey = 'token';
  static const _userKey = 'user';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString(_userKey);
    if (userStr == null) return null;
    return jsonDecode(userStr);
  }

  static Future<void> _saveAuth(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, data['accessToken']);
    if (data['user'] != null) {
      await prefs.setString(_userKey, jsonEncode(data['user']));
    }
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await ApiService.post('/api/auth/login', body: {
      'email': email,
      'password': password,
    });
    await _saveAuth(res);
    return res;
  }

  static Future<void> register({
    required String fullName,
    required String email,
    required String password,
    String? phone,
  }) async {
    await ApiService.post('/api/auth/register', body: {
      'fullName': fullName,
      'email': email,
      'password': password,
      if (phone != null && phone.isNotEmpty) 'phone': phone,
    });
  }

  static Future<void> logout() async {
    try {
      await ApiService.post('/api/auth/logout', auth: true);
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
}

