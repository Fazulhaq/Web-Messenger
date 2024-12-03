package com.mcit.messenger.chatroom;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "chat_room")
public class ChatRoom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "chat_id", nullable = false)
    private String chatId;

    @Column(name = "sender_login", nullable = false)
    private String senderLogin;

    @Column(name = "recipient_login", nullable = false)
    private String recipientLogin;

    public ChatRoom(String chatId, String senderLogin, String recipientLogin) {
        this.chatId = chatId;
        this.senderLogin = senderLogin;
        this.recipientLogin = recipientLogin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getSenderLogin() {
        return senderLogin;
    }

    public void setSenderLogin(String senderLogin) {
        this.senderLogin = senderLogin;
    }

    public String getRecipientLogin() {
        return recipientLogin;
    }

    public void setRecipientLogin(String recipientLogin) {
        this.recipientLogin = recipientLogin;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((chatId == null) ? 0 : chatId.hashCode());
        result = prime * result + ((senderLogin == null) ? 0 : senderLogin.hashCode());
        result = prime * result + ((recipientLogin == null) ? 0 : recipientLogin.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        ChatRoom other = (ChatRoom) obj;
        if (id == null) {
            if (other.id != null) return false;
        } else if (!id.equals(other.id)) return false;
        if (chatId == null) {
            if (other.chatId != null) return false;
        } else if (!chatId.equals(other.chatId)) return false;
        if (senderLogin == null) {
            if (other.senderLogin != null) return false;
        } else if (!senderLogin.equals(other.senderLogin)) return false;
        if (recipientLogin == null) {
            if (other.recipientLogin != null) return false;
        } else if (!recipientLogin.equals(other.recipientLogin)) return false;
        return true;
    }

    @Override
    public String toString() {
        return "ChatRoom [chatId=" + chatId + ", senderLogin=" + senderLogin + ", recipientLogin=" + recipientLogin + "]";
    }
}
