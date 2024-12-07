import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import OnlineUsersList from './online-users';

import ChatArea from './ChatArea';

export const Home = () => {
  const [visibleChatArea, setVisibleChatArea] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = login => {
    setSelectedUser(login);
    setVisibleChatArea(true);
  };

  return (
    <div className="m-0 p-0">
      <Row className="m-0 p-0 justify-content-center">
        <Col md="3" className="m-0 p-0">
          <OnlineUsersList onSelectUser={handleUserSelect} />
        </Col>
        <Col md="9" className="m-0 p-0">
          {visibleChatArea && <ChatArea clickedUser={selectedUser} />}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
