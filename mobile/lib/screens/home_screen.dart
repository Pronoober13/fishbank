import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.primary, Colors.cyan.shade500],
                  begin: Alignment.topLeft, end: Alignment.bottomRight,
                ),
              ),
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 32),
              child: Column(
                children: [
                  const Text('🐠', style: TextStyle(fontSize: 56)),
                  const SizedBox(height: 8),
                  const Text('FishBank', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('Platform Ekosistem Perikanan Indonesia', style: TextStyle(fontSize: 16, color: Colors.white.withAlpha(200))),
                  const SizedBox(height: 4),
                  Text('Ensiklopedia ikan & marketplace terpercaya', style: TextStyle(fontSize: 14, color: Colors.white.withAlpha(180))),
                ],
              ),
            ),
          ),

          // Features
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  Text('Fitur Utama', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  const _FeatureCard(icon: Icons.menu_book, title: 'Ensiklopedia Ikan', desc: 'Database lengkap spesies ikan Indonesia dengan info habitat, perawatan & konservasi.', color: Colors.blue),
                  const SizedBox(height: 12),
                  const _FeatureCard(icon: Icons.store, title: 'Marketplace', desc: 'Jual-beli ikan hias dengan sistem aman. Termasuk panduan pengiriman ikan hidup.', color: Colors.green),
                  const SizedBox(height: 12),
                  const _FeatureCard(icon: Icons.chat_bubble_outline, title: 'Chat & Komunitas', desc: 'Komunikasi langsung antara buyer dan seller. Diskusi & berbagi pengalaman.', color: Colors.orange),
                ],
              ),
            ),
          ),

          // Stats
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(16)),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _StatItem(value: '500+', label: 'Spesies'),
                  _StatItem(value: '10K+', label: 'Pengguna'),
                  _StatItem(value: '5K+', label: 'Produk'),
                  _StatItem(value: '34', label: 'Provinsi'),
                ],
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;
  final Color color;
  const _FeatureCard({required this.icon, required this.title, required this.desc, required this.color});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(backgroundColor: color.withAlpha(30), radius: 24, child: Icon(icon, color: color, size: 28)),
            const SizedBox(width: 16),
            Expanded(child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(desc, style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
              ],
            )),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue.shade700)),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
      ],
    );
  }
}

