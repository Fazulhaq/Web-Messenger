import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import OnlineUsersList from './online-users';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { Storage } from 'react-jhipster';
import ChatArea from './ChatArea';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';
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

export const Home = () => {
  const [message, setMessage] = useState([]);
  const [visibleChatArea, setVisibleChatArea] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [users, setUsers] = useState([]);

  const account = useAppSelector(state => state.authentication.account);
  const userLogin = account.login;

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };
    fetchData();
  }, []);

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
      fetchUsers();
      connectedPromise = null;
      alreadyConnectedOnce = true;
    });
  };

  const subscribe = () => {
    connection.then(() => {
      stompClient.subscribe(`/chat/${userLogin}/messages`, onMessageReceived);
      stompClient.subscribe(`/topic/public`, onUserEvent);
    });
  };

  useEffect(() => {
    connect();
    subscribe();
  }, [userLogin]);

  const handleUserSelect = login => {
    setSelectedUser(login);
    setVisibleChatArea(true);
  };

  const getUserFullName = fullName => {
    setUserFullName(fullName);
  };

  const onMessageReceived = payload => {
    const payloadMessage = JSON.parse(payload.body);
    setMessage(payloadMessage);
  };

  async function onUserEvent(payload) {
    if (payload.body) {
      await fetchUsers();
    }
  }

  async function fetchUsers() {
    const response = await axios.get('/api/admin/chat-users');
    const chatUsers = response.data;
    setUsers(chatUsers);
  }

  return (
    <div className="justify-content-center pt-5 mt-0 vh-100">
      <Row className="m-0 p-0 justify-content-center">
        <Col md="3" className="m-0 p-0 mt-2">
          <OnlineUsersList onSelectUser={handleUserSelect} userFullName={getUserFullName} users={users} />
        </Col>
        <Col md="9" className="m-0 p-0 mt-2">
          {visibleChatArea ? (
            <ChatArea clickedUser={selectedUser} userFullName={userFullName} newMessage={message} />
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <div className="overflow-hidden mb-4" style={{ width: '45px', height: '45px' }}>
                <img src="../../content/images/favicon.ico" alt="favicon" className="img-fluid" />
              </div>
              <h5 className="d-block mb-2">Web Messenger for Private Chats</h5>
              <span
                className="text-center d-block"
                style={{
                  fontSize: '1.1rem',
                  color: '#6c757d',
                  fontWeight: '250',
                }}
              >
                Experience secure and seamless communication with our real-time chat platform, <br />
                designed for private and instant messaging, anytime and anywhere.
              </span>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
