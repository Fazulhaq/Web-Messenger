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
  const [visibleChatArea, setVisibleChatArea] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
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
      fetchUsers();
      connectedPromise = null;
      alreadyConnectedOnce = true;
    });
  };

  const subscribe = () => {
    connection.then(() => {
      stompClient.subscribe(`/chat/${userLogin}/messages`, onMessageReceived);
      stompClient.subscribe(`/topic/public`, onMessageReceived);
    });
  };

  useEffect(() => {
    connect();
    subscribe();
  }, [userLogin]);

  async function onMessageReceived(payload) {
    if (payload.body) {
      await fetchUsers();
    }
  }

  async function fetchUsers() {
    const response = await axios.get('/api/admin/connected-users');
    const onlineUsers = response.data;
    setUsers(onlineUsers);
  }

  const handleUserSelect = login => {
    setSelectedUser(login);
    setVisibleChatArea(true);
  };

  return (
    <div className="m-0 p-0">
      <Row className="m-0 p-0 justify-content-center">
        <Col md="3" className="m-0 p-0">
          <OnlineUsersList onSelectUser={handleUserSelect} users={users} />
        </Col>
        <Col md="9" className="m-0 p-0">
          {visibleChatArea && <ChatArea clickedUser={selectedUser} />}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
