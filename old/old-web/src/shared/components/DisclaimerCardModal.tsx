/* eslint-disable no-empty-pattern */
import {
  Row, Col, Alert,
} from 'antd';
import { useState } from 'react';

export const DisclaimerCardModal = () => {
  const [] = useState(false);

  return (
    <div style={{ paddingBottom: '10px' }}>
      <Row justify="center" style={{ padding: '20px 0px' }}>
        <Col xs={24} md={20}>
          <Alert
            message="Disclaimer"
            description="This modal is under development."
            type="info"
            showIcon
            closable
          />
        </Col>
      </Row>
    </div>
  );
};

export default DisclaimerCardModal;
