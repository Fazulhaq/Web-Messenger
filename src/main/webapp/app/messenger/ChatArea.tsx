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

export const ChatArea = ({ clickedUser, newMessage }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const chatAreaRef = useRef(null);

  const account = useAppSelector(state => state.authentication.account);
  const userLogin = account.login;

  const connect = () => {
    if (connectedPromise !== null || alreadyConnectedOnce) {
      return;
    }
    connection = createConnection();
    listener = createListener();
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

  useEffect(() => {
    connect();
  }, [userLogin]);

  useEffect(() => {
    loadUserChat(userLogin, clickedUser);
  }, [clickedUser]);

  useEffect(() => {
    if (clickedUser && clickedUser === newMessage.senderLogin) {
      setMessages(prev => [...prev, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (messageContent.trim() && stompClient) {
      const chatMessage = {
        senderLogin: userLogin,
        recipientLogin: clickedUser,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      stompClient.send('/topic/message', JSON.stringify(chatMessage), {});
      setMessages(prev => [...prev, chatMessage]);
      setMessageContent('');
    }
  };

  const loadUserChat = async (onlineuser, userClicked) => {
    const senderLogin = onlineuser;
    const recipientLogin = userClicked;
    const response = await axios.get<any[]>(`/api/admin/messages/${senderLogin}/${recipientLogin}`);
    const userChat = response.data;
    if (userChat) {
      setMessages(userChat);
    } else {
      setMessages([]);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div>
      <div
        className="d-flex flex-column p-4 m-0 mx-1 my-1"
        ref={chatAreaRef}
        style={{ height: '556px', overflowY: 'auto', border: '1px solid #ccc' }}
      >
        {messages.map((message, index) =>
          message.recipientLogin === userLogin ? (
            <div className="d-flex flex-column" key={index}>
              <div
                key={index}
                className="m-2 mb-1 justify-content-start ms-auto"
                style={{
                  backgroundColor: '#000080',
                  color: '#F0FFF0',
                  padding: '0.9rem',
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  borderRadius: '0.3rem',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-line',
                }}
              >
                {message.content}
              </div>
              <p className="m-2 justify-content-start ms-auto mt-0" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                Date: {formatDate(message.timestamp)}
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column" key={index}>
              <div
                key={index}
                className="m-2 mb-1 justify-content-end me-auto"
                style={{
                  backgroundColor: '#800080',
                  color: '#F0FFF0',
                  padding: '0.9rem',
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  borderRadius: '0.3rem',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-line',
                }}
              >
                {message.content}
              </div>
              <p className="m-2 justify-content-end me-auto mt-0" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                Date: {formatDate(message.timestamp)}
              </p>
            </div>
          ),
        )}
      </div>
      <div className="d-flex align-items-center m-1">
        <InputTextarea
          value={messageContent}
          onChange={e => setMessageContent(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          cols={100}
          placeholder="Type a message and press Enter"
          className="flex-grow-1 me-2"
        />
        <Button label="Send" className="rounded-pill btn-primary" style={{ width: '120px' }} onClick={sendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
