import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'reactstrap';
import OnlineUsersList from './online-users';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useAppSelector } from 'app/config/store';
import { Storage } from 'react-jhipster';

export const Home = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const chatAreaRef = useRef(null);
  const stompClientRef = useRef(null);

  const account = useAppSelector(state => state.authentication.account);

  useEffect(() => {
    const loc = window.location;
    const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
    let url = '//' + loc.host + baseHref + '/websocket/tracker';
    const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (authToken) {
      url += '?access_token=' + authToken;
    }
    const socket = new SockJS(url);
    const stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });
    stompClient.connect({}, onConnected, onError);
    stompClientRef.current = stompClient;
    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  const onConnected = () => {
    setConnected(true);
    stompClientRef.current.subscribe(`/user/${account.login}/queue/messages`, onMessageReceived);
    stompClientRef.current.subscribe(`/user/public`, onMessageReceived);
  };

  const onError = () => {
    console.error('Could not connect to WebSocket server.');
  };

  const onMessageReceived = payload => {
    const message = JSON.parse(payload.body);
    setMessages(prev => [...prev, message]);
    if (selectedUser && selectedUser === message.senderLogin) {
      scrollToBottom();
    }
  };

  const handleUserSelect = login => {
    setSelectedUser(login);
    loadUserChat(login);
  };

  const loadUserChat = async user => {
    const senderLogin = account.login;
    const recipientLogin = user;
    const response = await fetch(`/messages/${senderLogin}/${recipientLogin}`);
    const userChat = await response.json();
    setMessages(userChat);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (messageContent.trim() && connected && stompClientRef.current) {
      const chatMessage = {
        senderLogin: account.login,
        recipientLogin: selectedUser,
        content: messageContent,
        timestamp: new Date(),
      };
      stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
      setMessages(prev => [...prev, chatMessage]);
      setMessageContent('');
      scrollToBottom();
    }
  };

  return (
    <div className="m-0 p-0">
      <Row className="m-0 p-0 justify-content-center">
        <Col md="3" className="m-0 p-0">
          <OnlineUsersList onSelectUser={handleUserSelect} />
        </Col>
        <Col md="9" className="m-0 p-0">
          <div className="d-flex p-3" ref={chatAreaRef} style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <div className="message-input mt-2">
            <InputTextarea
              value={messageContent}
              onChange={e => setMessageContent(e.target.value)}
              rows={2}
              cols={60}
              placeholder="Type a message"
              autoResize
            />
            <Button label="Send" icon="pi pi-send" className="ml-2" onClick={sendMessage} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
