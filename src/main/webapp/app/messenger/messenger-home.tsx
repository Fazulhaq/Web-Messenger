import React from 'react';
import { Row, Col } from 'reactstrap';

export const Home = () => {
  return (
    <div className="justify-content-center">
      <Row className="justify-content-center">
        <Col md="5" className="justify-content-center">
          <h1 className="display-4">Hello Main Page!</h1>
        </Col>
      </Row>
      <Row className="justify-content-center" noGutters>
        <Col md="5" className="justify-content-center">
          Hello EveryOne!
        </Col>
      </Row>
    </div>
  );
};

export default Home;
