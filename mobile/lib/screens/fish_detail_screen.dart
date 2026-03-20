import 'package:flutter/material.dart';
import '../models/fish.dart';
import '../services/api_service.dart';

class FishDetailScreen extends StatefulWidget {
  final String fishId;
  const FishDetailScreen({super.key, required this.fishId});

  @override
  State<FishDetailScreen> createState() => _FishDetailScreenState();
}

class _FishDetailScreenState extends State<FishDetailScreen> {
  Fish? _fish;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchFish();
  }

  Future<void> _fetchFish() async {
    try {
      final res = await ApiService.get('/api/fish/${widget.fishId}');
      setState(() => _fish = Fish.fromJson(res));
    } catch (_) {
      setState(() => _fish = null);
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return Scaffold(appBar: AppBar(), body: const Center(child: CircularProgressIndicator()));
    if (_fish == null) return Scaffold(appBar: AppBar(), body: const Center(child: Text('Ikan tidak ditemukan')));

    final f = _fish!;
    return Scaffold(
      appBar: AppBar(title: Text(f.commonName)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Center(child: Container(
              width: double.infinity, height: 180,
              decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.blue.shade100, Colors.cyan.shade100]), borderRadius: BorderRadius.circular(16)),
              child: const Center(child: Text('🐠', style: TextStyle(fontSize: 80))),
            )),
            const SizedBox(height: 16),
            Text(f.commonName, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text(f.scientificName, style: TextStyle(fontSize: 16, fontStyle: FontStyle.italic, color: Colors.grey.shade600)),
            if (f.localName.isNotEmpty) Text('Nama lokal: ${f.localName}', style: TextStyle(fontSize: 14, color: Colors.grey.shade500)),
            const SizedBox(height: 8),
            if (f.isProtected) Container(
              width: double.infinity, padding: const EdgeInsets.all(12), margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.red.shade200)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('⚠️ Spesies Dilindungi${f.citesAppendix != null ? " (CITES ${f.citesAppendix})" : ""}', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red.shade700)),
                if (f.protectionNote != null) Text(f.protectionNote!, style: TextStyle(fontSize: 13, color: Colors.red.shade600)),
              ]),
            ),
            const SizedBox(height: 8),
            Text(f.description, style: const TextStyle(fontSize: 15, height: 1.5)),
            const SizedBox(height: 20),

            // Parameter Cards
            const Text('Parameter Perawatan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            GridView.count(
              crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 8, crossAxisSpacing: 8, childAspectRatio: 1.3,
              children: [
                _ParamCard(label: '🌡️ Suhu', value: '${f.tempMin}–${f.tempMax}°C'),
                _ParamCard(label: '⚗️ pH', value: '${f.phMin}–${f.phMax}'),
                _ParamCard(label: '📏 Max', value: '${f.maxSizeCm} cm'),
                _ParamCard(label: '🏠 Tank', value: '${f.minTankSizeLiters} L'),
                _ParamCard(label: '🔥 Agresif', value: f.aggressiveness),
                _ParamCard(label: '📊 Level', value: f.difficultyLevel),
              ],
            ),
            const SizedBox(height: 20),

            // Diet
            const Text('🍽️ Makanan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(f.dietDescription, style: const TextStyle(fontSize: 15)),
            const SizedBox(height: 16),

            // Care tips
            const Text('💡 Tips Perawatan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(f.careTips, style: const TextStyle(fontSize: 15)),
            const SizedBox(height: 16),

            // Distribution
            if (f.distributionProvinces.isNotEmpty) ...[
              const Text('📍 Distribusi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(spacing: 6, runSpacing: 6, children: f.distributionProvinces.map((p) => Chip(
                label: Text(p, style: const TextStyle(fontSize: 12)),
                backgroundColor: Colors.green.shade50,
              )).toList()),
              const SizedBox(height: 16),
            ],

            // IUCN
            Container(
              width: double.infinity, padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
              child: Text('Status IUCN: ${f.iucnStatus}', style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _ParamCard extends StatelessWidget {
  final String label;
  final String value;
  const _ParamCard({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)),
      padding: const EdgeInsets.all(8),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.blue.shade700), textAlign: TextAlign.center),
      ]),
    );
  }
}

