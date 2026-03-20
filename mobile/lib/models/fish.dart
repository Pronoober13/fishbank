class Fish {
  final String id;
  final String commonName;
  final String scientificName;
  final String localName;
  final String habitat;
  final String description;
  final double maxSizeCm;
  final String difficultyLevel;
  final bool isProtected;
  final String iucnStatus;
  final double tempMin;
  final double tempMax;
  final double phMin;
  final double phMax;
  final int minTankSizeLiters;
  final String dietDescription;
  final String aggressiveness;
  final String careTips;
  final List<String> distributionProvinces;
  final String? citesAppendix;
  final String? protectionNote;

  Fish({
    required this.id,
    required this.commonName,
    required this.scientificName,
    this.localName = '',
    required this.habitat,
    required this.description,
    required this.maxSizeCm,
    required this.difficultyLevel,
    required this.isProtected,
    required this.iucnStatus,
    this.tempMin = 0,
    this.tempMax = 0,
    this.phMin = 0,
    this.phMax = 0,
    this.minTankSizeLiters = 0,
    this.dietDescription = '',
    this.aggressiveness = '',
    this.careTips = '',
    this.distributionProvinces = const [],
    this.citesAppendix,
    this.protectionNote,
  });

  factory Fish.fromJson(Map<String, dynamic> json) {
    return Fish(
      id: json['id'] ?? '',
      commonName: json['commonName'] ?? '',
      scientificName: json['scientificName'] ?? '',
      localName: json['localName'] ?? '',
      habitat: json['habitat'] ?? '',
      description: json['description'] ?? '',
      maxSizeCm: (json['maxSizeCm'] ?? 0).toDouble(),
      difficultyLevel: json['difficultyLevel'] ?? '',
      isProtected: json['isProtected'] ?? false,
      iucnStatus: json['iucnStatus'] ?? '',
      tempMin: (json['tempMin'] ?? 0).toDouble(),
      tempMax: (json['tempMax'] ?? 0).toDouble(),
      phMin: (json['phMin'] ?? 0).toDouble(),
      phMax: (json['phMax'] ?? 0).toDouble(),
      minTankSizeLiters: json['minTankSizeLiters'] ?? 0,
      dietDescription: json['dietDescription'] ?? '',
      aggressiveness: json['aggressiveness'] ?? '',
      careTips: json['careTips'] ?? '',
      distributionProvinces: json['distributionProvinces'] != null
          ? List<String>.from(json['distributionProvinces'])
          : [],
      citesAppendix: json['citesAppendix'],
      protectionNote: json['protectionNote'],
    );
  }
}

