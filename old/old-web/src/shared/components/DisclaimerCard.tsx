/* eslint-disable no-empty-pattern */
import {
  Row, Col, Alert,
} from 'antd';
import { useState } from 'react';

export const DisclaimerCard = ({ onClose }: any) => {
  const [] = useState(false);

  return (
    <div
      style={{
        paddingBottom: '10px', position: 'absolute', top: 270, zIndex: 1000,
      }}
    >
      <Row justify="center" style={{ padding: '20px 0px' }}>
        <Col xs={24} md={14}>
          <Alert
            style={{ border: '0px solid' }}
            message="Disclaimer"
            description="The information displayed is simulated and does not represent your actual animals. The programming is still in progress, but this preview demonstrates the future format of the search results."
            type="info"
            showIcon
            closable
            onClose={onClose}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DisclaimerCard;
