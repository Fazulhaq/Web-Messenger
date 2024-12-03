import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

const OnlineUsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const account = useAppSelector(state => state.authentication.account);

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get('/api/admin/connected-users');
      const onlineUsers = response.data.filter(user => user.login !== account.login);
      setUsers(onlineUsers);
    }
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [account.login]);

  const itemTemplate = user => (
    <div
      key={user.login}
      className="d-flex align-items-center p-2 ml-3 border-bottom list-group-item-action shadow-sm hover-shadow-lg"
      onClick={() => onSelectUser(user.login)}
    >
      <div className="flex-shrink-0 me-3">
        <div className="rounded-circle overflow-hidden" style={{ width: '45px', height: '45px' }}>
          <img src="../../content/images/user_icon.png" alt={`${user.firstName} ${user.lastName}`} className="img-fluid" />
        </div>
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-0">
          {user.firstName} {user.lastName}
        </h6>
      </div>
    </div>
  );

  return (
    <div className="p-0 m-0">
      <span className="p-0 m-0 d-block w-100 text-center p-3 bg-dark text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        Online Users
      </span>
      <div
        className="list-group ml-4"
        style={{
          maxHeight: '540px',
          overflowY: 'auto',
        }}
      >
        {users.map(user => itemTemplate(user))}
      </div>
    </div>
  );
};

export default OnlineUsersList;
