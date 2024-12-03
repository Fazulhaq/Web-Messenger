package com.mcit.messenger.chatroom;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySenderLoginAndRecipientLogin(String senderLogin, String recipientLogin);
}
