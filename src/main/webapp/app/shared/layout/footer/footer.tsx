import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div className="footer page-content">
    <Row>
      <Col md="12" className="justify-content-center d-flex">
        <p>Web Messenger Developed By: MCIT DEVELOPERS</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
