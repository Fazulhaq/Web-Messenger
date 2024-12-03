package com.mcit.messenger.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "chat_message")
public class ChatMessage implements Serializable {

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

    @NotNull
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "timestamp", nullable = true)
    private Instant timestamp;

    public ChatMessage(String chatId, String senderLogin, String recipientLogin, @NotNull String content, Instant timestamp) {
        this.chatId = chatId;
        this.senderLogin = senderLogin;
        this.recipientLogin = recipientLogin;
        this.content = content;
        this.timestamp = timestamp;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        ChatMessage other = (ChatMessage) obj;
        if (id == null) {
            if (other.id != null) return false;
        } else if (!id.equals(other.id)) return false;
        return true;
    }

    @Override
    public String toString() {
        return (
            "ChatMessage [id=" +
            id +
            ", chatId=" +
            chatId +
            ", senderLogin=" +
            senderLogin +
            ", recipientLogin=" +
            recipientLogin +
            ", content=" +
            content +
            ", timestamp=" +
            timestamp +
            "]"
        );
    }
}
