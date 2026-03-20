import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'chat_detail_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  List<Map<String, dynamic>> _conversations = [];
  bool _loading = true;
  String? _currentUserId;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final user = await AuthService.getUser();
      _currentUserId = user?['id'];
      final res = await ApiService.get('/api/chat/conversations', auth: true);
      final list = res is List ? res : [];
      setState(() => _conversations = List<Map<String, dynamic>>.from(list));
    } catch (_) {
      setState(() => _conversations = []);
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('💬 Chat')),
      body: _loading
        ? const Center(child: CircularProgressIndicator())
        : _conversations.isEmpty
          ? const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              Text('💬', style: TextStyle(fontSize: 48)),
              SizedBox(height: 8),
              Text('Belum ada percakapan', style: TextStyle(fontSize: 16, color: Colors.grey)),
              SizedBox(height: 4),
              Text('Chat akan muncul saat Anda menghubungi seller', style: TextStyle(fontSize: 13, color: Colors.grey)),
            ]))
          : RefreshIndicator(
              onRefresh: _fetchData,
              child: ListView.builder(
                itemCount: _conversations.length,
                itemBuilder: (context, index) {
                  final conv = _conversations[index];
                  final sender = conv['sender'] as Map<String, dynamic>?;
                  final receiver = conv['receiver'] as Map<String, dynamic>?;

                  // Determine the other person in the conversation
                  final isCurrentSender = sender?['id'] == _currentUserId;
                  final otherUser = isCurrentSender ? receiver : sender;
                  final otherName = otherUser?['fullName'] ?? 'User';
                  final otherUserId = otherUser?['id'] ?? '';
                  final lastMessage = conv['message'] ?? '';
                  final isRead = conv['isRead'] ?? true;

                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.blue.shade100,
                        child: Text(otherName.isNotEmpty ? otherName[0].toUpperCase() : '?', style: const TextStyle(fontWeight: FontWeight.bold)),
                      ),
                      title: Text(otherName, style: TextStyle(fontWeight: isRead ? FontWeight.normal : FontWeight.bold)),
                      subtitle: Text(lastMessage, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: isRead ? Colors.grey : Colors.black87)),
                      trailing: !isRead && !isCurrentSender
                        ? Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.blue, shape: BoxShape.circle))
                        : null,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ChatDetailScreen(otherUserId: otherUserId, otherUserName: otherName)),
                      ).then((_) => _fetchData()),
                    ),
                  );
                },
              ),
            ),
    );
  }
}

