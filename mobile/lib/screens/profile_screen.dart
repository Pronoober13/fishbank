import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/user.dart';
import '../models/order.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  UserProfile? _user;
  List<Order> _orders = [];
  bool _loading = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final results = await Future.wait([
        ApiService.get('/api/users/profile', auth: true),
        ApiService.get('/api/orders/buyer', auth: true),
      ]);
      final ordersData = results[1] is List ? results[1] : (results[1]['data'] ?? []);
      setState(() {
        _user = UserProfile.fromJson(results[0]);
        _orders = (ordersData as List).map((e) => Order.fromJson(e)).toList();
      });
    } catch (_) {
      // Not logged in or error
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _handleLogout() async {
    await AuthService.logout();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  String _formatPrice(double price) {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(price);
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'pending_payment': return Colors.orange;
      case 'paid': return Colors.blue;
      case 'shipped': return Colors.purple;
      case 'completed': return Colors.green;
      case 'cancelled': return Colors.red;
      default: return Colors.grey;
    }
  }

  @override
  void dispose() { _tabController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    if (_loading) return Scaffold(appBar: AppBar(title: const Text('👤 Profil')), body: const Center(child: CircularProgressIndicator()));
    if (_user == null) {
      return Scaffold(appBar: AppBar(title: const Text('👤 Profil')), body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
      const Text('Silakan login untuk melihat profil'),
      const SizedBox(height: 16),
      FilledButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())), child: const Text('Login')),
    ])));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('👤 Profil'),
        actions: [IconButton(icon: const Icon(Icons.logout), onPressed: _handleLogout, tooltip: 'Logout')],
        bottom: TabBar(controller: _tabController, tabs: const [
          Tab(text: '👤 Profil'),
          Tab(text: '📦 Pesanan'),
        ]),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Profile Tab
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(children: [
                  CircleAvatar(radius: 40, backgroundColor: Colors.blue.shade100, child: Text(_user!.fullName.isNotEmpty ? _user!.fullName[0].toUpperCase() : '?', style: const TextStyle(fontSize: 32))),
                  const SizedBox(height: 12),
                  Text(_user!.fullName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Text(_user!.email, style: TextStyle(color: Colors.grey.shade600)),
                  const SizedBox(height: 16),
                  ...[
                    _ProfileRow(Icons.phone, 'Telepon', _user!.phone.isEmpty ? '-' : _user!.phone),
                    _ProfileRow(Icons.location_city, 'Kota', _user!.city.isEmpty ? '-' : _user!.city),
                    _ProfileRow(Icons.map, 'Provinsi', _user!.province.isEmpty ? '-' : _user!.province),
                    _ProfileRow(Icons.badge, 'Role', _user!.role),
                    _ProfileRow(Icons.verified, 'Status Seller', _user!.sellerVerificationStatus),
                  ],
                ]),
              ),
            ),
          ),
          // Orders Tab
          _orders.isEmpty
            ? const Center(child: Text('Belum ada pesanan'))
            : ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _orders.length,
                itemBuilder: (context, index) {
                  final o = _orders[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text(o.product?.title ?? 'Produk', style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text(o.createdAt.isNotEmpty ? DateTime.tryParse(o.createdAt)?.toString().substring(0, 10) ?? '' : ''),
                      trailing: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [
                        Text(_formatPrice(o.totalPrice), style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: _statusColor(o.status).withAlpha(30), borderRadius: BorderRadius.circular(8)),
                          child: Text(o.status, style: TextStyle(fontSize: 11, color: _statusColor(o.status), fontWeight: FontWeight.w600)),
                        ),
                      ]),
                    ),
                  );
                },
              ),
        ],
      ),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _ProfileRow(this.icon, this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(children: [
        Icon(icon, size: 20, color: Colors.grey.shade500),
        const SizedBox(width: 12),
        Text('$label:', style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
        const SizedBox(width: 8),
        Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500))),
      ]),
    );
  }
}

