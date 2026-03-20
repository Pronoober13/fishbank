import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'chat_detail_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  const ProductDetailScreen({super.key, required this.productId});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  bool _loading = true;
  int _qty = 1;
  bool _ordering = false;

  @override
  void initState() {
    super.initState();
    _fetchProduct();
  }

  Future<void> _fetchProduct() async {
    try {
      final res = await ApiService.get('/api/products/${widget.productId}');
      setState(() => _product = Product.fromJson(res));
    } catch (_) {
      setState(() => _product = null);
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _handleOrder() async {
    final loggedIn = await AuthService.isLoggedIn();
    if (!loggedIn) {
      if (!mounted) return;
      Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      return;
    }
    if (_product == null) return;
    setState(() => _ordering = true);
    try {
      await ApiService.post('/api/orders', auth: true, body: {
        'productId': _product!.id,
        'quantity': _qty,
        'shippingMethod': _product!.shippingMethods.isNotEmpty ? _product!.shippingMethods[0] : 'standard',
        'shippingAddress': 'Alamat dari profil',
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order berhasil dibuat!')));
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
    } finally {
      if (mounted) setState(() => _ordering = false);
    }
  }

  String _formatPrice(double price) {
    return NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(price);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return Scaffold(appBar: AppBar(), body: const Center(child: CircularProgressIndicator()));
    if (_product == null) return Scaffold(appBar: AppBar(), body: const Center(child: Text('Produk tidak ditemukan')));

    final p = _product!;
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Produk')),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FilledButton(
            onPressed: _ordering || p.stock == 0 ? null : _handleOrder,
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
            child: Text(_ordering ? 'Memproses...' : p.stock == 0 ? 'Stok Habis' : '🛒 Beli Sekarang'),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 250, width: double.infinity,
              decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.blue.shade100, Colors.cyan.shade100])),
              child: const Center(child: Text('🐠', style: TextStyle(fontSize: 100))),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(p.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                if (p.fishSpecies != null) Text('${p.fishSpecies!.commonName} (${p.fishSpecies!.scientificName})', style: TextStyle(fontSize: 14, color: Colors.blue.shade600)),
                const SizedBox(height: 8),
                Text(_formatPrice(p.price), style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.blue.shade700)),
                const SizedBox(height: 12),
                Wrap(spacing: 8, runSpacing: 8, children: [
                  _InfoChip('Kondisi', p.condition),
                  _InfoChip('Stok', '${p.stock}'),
                  if (p.sizeCm > 0) _InfoChip('Ukuran', '${p.sizeCm} cm'),
                  if (p.ageMths > 0) _InfoChip('Umur', '${p.ageMths} bln'),
                ]),
                const SizedBox(height: 12),
                Row(children: [
                  const Text('Jumlah: '),
                  IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: _qty > 1 ? () => setState(() => _qty--) : null),
                  Text('$_qty', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: _qty < p.stock ? () => setState(() => _qty++) : null),
                ]),
                const Divider(height: 24),
                if (p.seller != null) ...[
                  Text('📍 Seller: ${p.seller!.fullName} — ${p.seller!.city}, ${p.seller!.province}', style: TextStyle(color: Colors.grey.shade600)),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    onPressed: () => Navigator.push(context, MaterialPageRoute(
                      builder: (_) => ChatDetailScreen(otherUserId: p.seller!.id, otherUserName: p.seller!.fullName, productId: p.id),
                    )),
                    icon: const Icon(Icons.chat_bubble_outline),
                    label: const Text('Chat dengan Seller'),
                  ),
                ],
                const SizedBox(height: 16),
                const Text('Deskripsi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(p.description, style: const TextStyle(fontSize: 15, height: 1.5)),
                const SizedBox(height: 24),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String label;
  final String value;
  const _InfoChip(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
      child: Text('$label: $value', style: const TextStyle(fontSize: 13)),
    );
  }
}

