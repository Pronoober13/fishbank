class Order {
  final String id;
  final double totalPrice;
  final String status;
  final String createdAt;
  final OrderProduct? product;

  Order({
    required this.id,
    required this.totalPrice,
    required this.status,
    required this.createdAt,
    this.product,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      totalPrice: (json['totalPrice'] ?? 0).toDouble(),
      status: json['status'] ?? '',
      createdAt: json['createdAt'] ?? '',
      product: json['product'] != null ? OrderProduct.fromJson(json['product']) : null,
    );
  }
}

class OrderProduct {
  final String title;

  OrderProduct({required this.title});

  factory OrderProduct.fromJson(Map<String, dynamic> json) {
    return OrderProduct(title: json['title'] ?? '');
  }
}

