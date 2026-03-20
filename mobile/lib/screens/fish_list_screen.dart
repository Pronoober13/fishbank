import 'package:flutter/material.dart';
import '../models/fish.dart';
import '../services/api_service.dart';
import 'fish_detail_screen.dart';

class FishListScreen extends StatefulWidget {
  const FishListScreen({super.key});

  @override
  State<FishListScreen> createState() => _FishListScreenState();
}

class _FishListScreenState extends State<FishListScreen> {
  List<Fish> _fishList = [];
  bool _loading = true;
  String _search = '';
  String _habitat = 'ALL';
  String _difficulty = 'ALL';

  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchFish();
  }

  Future<void> _fetchFish() async {
    setState(() => _loading = true);
    try {
      final params = <String, String>{};
      if (_search.isNotEmpty) params['search'] = _search;
      if (_habitat != 'ALL') params['habitat'] = _habitat;
      if (_difficulty != 'ALL') params['difficulty'] = _difficulty;
      final res = await ApiService.get('/api/fish', params: params.isEmpty ? null : params);
      final list = res is List ? res : (res['data'] ?? []);
      setState(() => _fishList = (list as List).map((e) => Fish.fromJson(e)).toList());
    } catch (_) {
      setState(() => _fishList = []);
    } finally {
      setState(() => _loading = false);
    }
  }

  Color _difficultyColor(String level) {
    switch (level) {
      case 'beginner': return Colors.green;
      case 'intermediate': return Colors.orange;
      case 'advanced': return Colors.red;
      default: return Colors.grey;
    }
  }

  @override
  void dispose() { _searchController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('📚 Ensiklopedia Ikan')),
      body: Column(
        children: [
          // Filters
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: '🔍 Cari ikan...', border: const OutlineInputBorder(),
                    suffixIcon: IconButton(icon: const Icon(Icons.search), onPressed: () { _search = _searchController.text; _fetchFish(); }),
                  ),
                  onSubmitted: (v) { _search = v; _fetchFish(); },
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: DropdownButtonFormField<String>(
                      initialValue: _habitat, decoration: const InputDecoration(labelText: 'Habitat', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
                      items: ['ALL', 'freshwater', 'marine', 'brackish'].map((e) => DropdownMenuItem(value: e, child: Text(e == 'ALL' ? 'Semua' : e))).toList(),
                      onChanged: (v) { _habitat = v!; _fetchFish(); },
                    )),
                    const SizedBox(width: 8),
                    Expanded(child: DropdownButtonFormField<String>(
                      initialValue: _difficulty, decoration: const InputDecoration(labelText: 'Level', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
                      items: ['ALL', 'beginner', 'intermediate', 'advanced'].map((e) => DropdownMenuItem(value: e, child: Text(e == 'ALL' ? 'Semua' : e))).toList(),
                      onChanged: (v) { _difficulty = v!; _fetchFish(); },
                    )),
                  ],
                ),
              ],
            ),
          ),
          // List
          Expanded(
            child: _loading
              ? const Center(child: CircularProgressIndicator())
              : _fishList.isEmpty
                ? const Center(child: Text('Tidak ada ikan ditemukan'))
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: _fishList.length,
                    itemBuilder: (context, index) {
                      final f = _fishList[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => FishDetailScreen(fishId: f.id))),
                          leading: CircleAvatar(backgroundColor: Colors.blue.shade50, child: const Text('🐟', style: TextStyle(fontSize: 24))),
                          title: Row(children: [
                            Expanded(child: Text(f.commonName, style: const TextStyle(fontWeight: FontWeight.bold))),
                            if (f.isProtected) Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)), child: Text('🛡 Dilindungi', style: TextStyle(fontSize: 10, color: Colors.red.shade700))),
                          ]),
                          subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(f.scientificName, style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey.shade600)),
                            const SizedBox(height: 4),
                            Wrap(spacing: 4, children: [
                              Chip(label: Text(f.habitat, style: const TextStyle(fontSize: 10)), padding: EdgeInsets.zero, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap, backgroundColor: Colors.blue.shade50),
                              Chip(label: Text(f.difficultyLevel, style: const TextStyle(fontSize: 10)), padding: EdgeInsets.zero, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap, backgroundColor: _difficultyColor(f.difficultyLevel).withAlpha(30)),
                              Chip(label: Text('Max ${f.maxSizeCm}cm', style: const TextStyle(fontSize: 10)), padding: EdgeInsets.zero, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
                            ]),
                          ]),
                          isThreeLine: true,
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

