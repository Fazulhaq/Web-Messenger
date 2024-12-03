package com.mcit.messenger.chat;

public class ChatNotification {

    private Long id;
    private String senderLogin;
    private String recipientLogin;
    private String content;

    public ChatNotification(Long id, String senderLogin, String recipientLogin, String content) {
        this.id = id;
        this.senderLogin = senderLogin;
        this.recipientLogin = recipientLogin;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
