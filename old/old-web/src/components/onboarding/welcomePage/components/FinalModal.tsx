/* eslint-disable no-unused-vars */
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row,
} from 'antd';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import { apiCall } from 'src/shared/api/apiWrapper';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const WelcomeFinalModal: FC<any> = ({ visible, setVisible, loginDetail }) => {
  useEffect(() => {
  }, []);

  return (
    <TyrModal
      modalVisible={visible}
      setModalVisible={setVisible}
      footerContent={(<span />)}
      modalContent={(
        <div style={{ padding: '40px' }}>
          <Row style={{ padding: '10px' }}>
            <span style={{ fontSize: '16px', color: '#102F5A' }}>
              {/* Congratulations, you’ve entered your first animal and completed our onboarding sequence.
              Now we’ll take you to your home page and suggest that next you enter a person and a company or organization.
              Please read the documentation about entering what we call PCOs.   PCOs stands for People, Companies, and Organizations. */}

              Success! You have established your database and entered your first animal. Check your email for recommended next steps.
              <br />
              <br />
              Please explore the app and all of its features.   And know that we are here to help:
              <br />
              <a href="mailto:contact@totheirrescue.org">contact@totheirrescue.org</a>
            </span>
          </Row>
          <br />
          <Row justify="center"><Button onClick={() => setVisible(false)} className="ftr-button-primary">Close</Button></Row>
        </div>
      )}
      modalTitle={() => <span />}
      onCancel={() => setVisible(false)}
      size="md"
    />
  );
};
