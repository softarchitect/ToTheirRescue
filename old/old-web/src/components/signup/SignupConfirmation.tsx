import {
  FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
} from 'antd';
import { CheckCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { tyrLogoSrc } from '../../assets/images';

export const SignupConfirmation: FC<any> = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Row justify="center" style={{ padding: '0px 80px' }}>
        <img className="" style={{ width: '120px', paddingTop: '10px', paddingBottom: '20px' }} src={tyrLogoSrc} alt="toyourrescue.com" />
      </Row>
      <Row justify="center" align="middle" style={{ height: '50vh' }}>
        <div
          style={{
            fontSize: '22px',
            color: '#2954A2',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          <CheckCircleOutlined rev={undefined} style={{ fontSize: '24px', marginRight: '10px', fontWeight: 100 }} />
          Signup Successful
          <div
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: '#2954A2',
              width: '440px',
            }}
          >
            Your signup process process has successfully completed.
            {/* <br /> */}
            &nbsp;
            Please check your email to confirm your account. You may have to check your spam folder.
          </div>
          <Button size="large" className="ftr-button-secondary" style={{ margin: '40px' }} onClick={() => navigate('/login')}>
            <span className="btn-text">Go To Login</span>
            &nbsp;
            <span className="btn-icon"><LoginOutlined rev={undefined} /></span>
          </Button>
        </div>
      </Row>
    </div>
  );
};
