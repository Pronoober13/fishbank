import 'package:flutter_test/flutter_test.dart';
import 'package:fishbank/main.dart';

void main() {
  testWidgets('FishBank app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const FishBankApp());
    expect(find.text('FishBank'), findsAny);
  });
}
