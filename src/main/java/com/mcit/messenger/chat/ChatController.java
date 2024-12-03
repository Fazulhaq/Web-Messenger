package com.mcit.messenger.chat;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        ChatNotification notification = new ChatNotification(
            savedMsg.getId(),
            savedMsg.getSenderLogin(),
            savedMsg.getRecipientLogin(),
            savedMsg.getContent()
        );
        messagingTemplate.convertAndSendToUser(chatMessage.getRecipientLogin(), "/queue/messages", notification);
    }

    @GetMapping("/messages/{senderLogin}/{recipientLogin}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
        @PathVariable("senderLogin") String senderLogin,
        @PathVariable("recipientLogin") String recipientLogin
    ) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderLogin, recipientLogin));
    }
}
