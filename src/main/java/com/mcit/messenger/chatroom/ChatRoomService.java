package com.mcit.messenger.chatroom;

import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    public Optional<String> getChatRoomId(String senderLogin, String recipientLogin, boolean createNewRoomIfNotExists) {
        return chatRoomRepository
            .findBySenderLoginAndRecipientLogin(senderLogin, recipientLogin)
            .map(ChatRoom::getChatId)
            .or(() -> {
                if (createNewRoomIfNotExists) {
                    var chatId = createChatId(senderLogin, recipientLogin);
                    return Optional.of(chatId);
                }
                return Optional.empty();
            });
    }

    private String createChatId(String senderLogin, String recipientLogin) {
        String chatId = String.format("%s_%s", senderLogin, recipientLogin);

        ChatRoom senderRecipient = new ChatRoom();
        senderRecipient.setChatId(chatId);
        senderRecipient.setSenderLogin(senderLogin);
        senderRecipient.setRecipientLogin(recipientLogin);

        ChatRoom recipientSender = new ChatRoom();
        recipientSender.setChatId(chatId);
        recipientSender.setSenderLogin(recipientLogin);
        recipientSender.setRecipientLogin(senderLogin);

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);
        return chatId;
    }
}
