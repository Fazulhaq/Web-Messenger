import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div>
    <Row>
      <Col md="12" className="d-flex justify-content-center fixed-bottom py-1" style={{ backgroundColor: '#ADD8E6' }}>
        <p className="p-0 m-0">Web Messenger Developed By: MCIT Developers</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
