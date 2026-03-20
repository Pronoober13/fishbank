class Product {
  final String id;
  final String title;
  final String description;
  final double price;
  final int stock;
  final String condition;
  final double sizeCm;
  final int ageMths;
  final List<String> images;
  final List<String> shippingMethods;
  final ProductSeller? seller;
  final ProductFish? fishSpecies;
  final double averageRating;
  final int totalReviews;

  Product({
    required this.id,
    required this.title,
    this.description = '',
    required this.price,
    required this.stock,
    this.condition = '',
    this.sizeCm = 0,
    this.ageMths = 0,
    this.images = const [],
    this.shippingMethods = const [],
    this.seller,
    this.fishSpecies,
    this.averageRating = 0,
    this.totalReviews = 0,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      stock: json['stock'] ?? 0,
      condition: json['condition'] ?? '',
      sizeCm: (json['sizeCm'] ?? 0).toDouble(),
      ageMths: json['ageMths'] ?? 0,
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      shippingMethods: json['shippingMethods'] != null ? List<String>.from(json['shippingMethods']) : [],
      seller: json['seller'] != null ? ProductSeller.fromJson(json['seller']) : null,
      fishSpecies: json['fishSpecies'] != null ? ProductFish.fromJson(json['fishSpecies']) : null,
      averageRating: (json['averageRating'] ?? 0).toDouble(),
      totalReviews: json['totalReviews'] ?? 0,
    );
  }
}

class ProductSeller {
  final String id;
  final String fullName;
  final String city;
  final String province;

  ProductSeller({required this.id, required this.fullName, this.city = '', this.province = ''});

  factory ProductSeller.fromJson(Map<String, dynamic> json) {
    return ProductSeller(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? '',
      city: json['city'] ?? '',
      province: json['province'] ?? '',
    );
  }
}

class ProductFish {
  final String id;
  final String commonName;
  final String scientificName;

  ProductFish({required this.id, required this.commonName, this.scientificName = ''});

  factory ProductFish.fromJson(Map<String, dynamic> json) {
    return ProductFish(
      id: json['id'] ?? '',
      commonName: json['commonName'] ?? '',
      scientificName: json['scientificName'] ?? '',
    );
  }
}

