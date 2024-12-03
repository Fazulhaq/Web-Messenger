package com.mcit.messenger.chat;

import com.mcit.messenger.chatroom.ChatRoomService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessageService(ChatMessageRepository repository, ChatRoomService chatRoomService) {
        this.repository = repository;
        this.chatRoomService = chatRoomService;
    }

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService.getChatRoomId(chatMessage.getSenderLogin(), chatMessage.getRecipientLogin(), true).orElseThrow();
        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderLogin, String recipientLogin) {
        var chatId = chatRoomService.getChatRoomId(senderLogin, recipientLogin, false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
}
