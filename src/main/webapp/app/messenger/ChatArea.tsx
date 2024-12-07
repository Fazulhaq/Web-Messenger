import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from 'app/config/store';
import { Button } from 'primereact/button';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { InputTextarea } from 'primereact/inputtextarea';
import { Storage } from 'react-jhipster';
import axios from 'axios';
import { Observable } from 'rxjs';

let stompClient = null;

let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let alreadyConnectedOnce = false;

const createConnection = (): Promise<any> => new Promise(resolve => (connectedPromise = resolve));

const createListener = (): Observable<any> =>
  new Observable(observer => {
    listenerObserver = observer;
  });

export const ChatArea = ({ clickedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const chatAreaRef = useRef(null);
  const stompClientRef = useRef(null);

  const account = useAppSelector(state => state.authentication.account);
  const userLogin = account.login;

  const connect = () => {
    if (connectedPromise !== null || alreadyConnectedOnce) {
      return;
    }
    connection = createConnection();
    listener = createListener();

    // building absolute path so that websocket doesn't fail when deploying with a context path
    const loc = window.location;
    const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

    const headers = {};
    let url = '//' + loc.host + baseHref + '/websocket/tracker';
    const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (authToken) {
      url += '?access_token=' + authToken;
    }
    const socket = new SockJS(url);
    stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });

    stompClient.connect(headers, () => {
      connectedPromise('success');
      connectedPromise = null;
      alreadyConnectedOnce = true;
    });
  };

  const subscribe = () => {
    connection.then(() => {
      stompClient.subscribe(`/user/${userLogin}/queue/messages`, onMessageReceived);
    });
  };

  useEffect(() => {
    connect();
    subscribe();
    loadUserChat(userLogin, clickedUser);
  }, [clickedUser]);

  const onMessageReceived = payload => {
    const message = JSON.parse(payload.body);
    setMessages(prev => [...prev, message]);
    if (clickedUser && clickedUser === message.senderLogin) {
      scrollToBottom();
    }
  };

  const sendMessage = () => {
    if (messageContent.trim() && stompClient) {
      const chatMessage = {
        senderLogin: userLogin,
        recipientLogin: clickedUser,
        content: messageContent,
      };
      stompClient.send('/topic/message', JSON.stringify(chatMessage), {});
      setMessages(prev => [...prev, chatMessage]);
      setMessageContent('');
      scrollToBottom();
    }
  };

  const loadUserChat = async (onlineuser, userClicked) => {
    const senderLogin = onlineuser;
    const recipientLogin = userClicked;
    const response = await axios.get<any[]>(`/api/admin/messages/${senderLogin}/${recipientLogin}`);
    const userChat = response.data;
    if (userChat) {
      setMessages(userChat);
      scrollToBottom();
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  return (
    <div className="m-0 p-0">
      <div className="d-flex p-3 mx-1 my-0" ref={chatAreaRef} style={{ height: '556px', overflowY: 'auto', border: '1px solid #ccc' }}>
        {messages.map((message, index) => (
          <div
            style={{
              backgroundColor: '#3498db',
              color: '#fff',
              alignSelf: 'flex-end',
              padding: '0 12px',
              borderRadius: '7px',
              wordWrap: 'break-word',
            }}
            key={index}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="d-flex align-items-center m-1">
        <InputTextarea
          value={messageContent}
          onChange={e => setMessageContent(e.target.value)}
          rows={1}
          cols={100}
          placeholder="Type a message here"
          className="flex-grow-1 me-2"
        />
        <Button label="Send" className="rounded-pill btn-primary" style={{ width: '120px' }} onClick={sendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
