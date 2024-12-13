import { useAppSelector } from 'app/config/store';
import React, { useState } from 'react';
import { Badge } from 'primereact/badge';

const OnlineUsersList = ({ onSelectUser, userFullName, users }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const account = useAppSelector(state => state.authentication.account);

  const onlineUsers = users.filter(user => user.login !== account.login);

  const handleUserClick = user => {
    setSelectedUser(user.login);
    onSelectUser(user.login);
    userFullName(user.firstName + ' ' + user.lastName);
  };

  const itemTemplate = user => (
    <div
      key={user.login}
      className={`d-flex align-items-center p-2 m-1 pr-3 border-bottom list-group-item-action shadow-sm hover-shadow-lg ${
        selectedUser === user.login ? 'bg-white text-black' : 'bg-light text-black'
      }`}
      onClick={() => handleUserClick(user)}
    >
      <div className="flex-shrink-0 me-3">
        <div className="rounded-circle overflow-hidden" style={{ width: '45px', height: '45px' }}>
          <img src="../../content/images/user_icon.png" alt={`${user.firstName} ${user.lastName}`} className="img-fluid" />
        </div>
      </div>
      <div className="flex-grow-1 d-flex align-items-center">
        <h6 className="mb-0 me-2" style={{ fontSize: '1rem' }}>
          {user.firstName} {user.lastName}
        </h6>
        {user.status === 'ONLINE' ? (
          <span
            className="rounded-circle bg-success"
            style={{
              width: '15px',
              height: '15px',
            }}
            title="Online"
          ></span>
        ) : null}
      </div>
      <div className="d-flex align-items-center ms-auto" style={{ marginRight: '15px' }}>
        <Badge value="1" severity="danger"></Badge>
      </div>
    </div>
  );

  return (
    <div className="p-0 m-0">
      <span className="p-0 m-0 d-block w-100 text-center p-3 bg-dark text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        All Users
      </span>
      <div
        className="list-group ml-4"
        style={{
          maxHeight: '545px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {onlineUsers.map(user => itemTemplate(user))}
      </div>
    </div>
  );
};

export default OnlineUsersList;
