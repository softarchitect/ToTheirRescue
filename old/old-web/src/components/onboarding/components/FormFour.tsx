/* eslint-disable no-unused-vars */
import {
  useEffect, FC, useState, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row, Form, Input, message,
  Popover,
} from 'antd';
import Cookies from 'universal-cookie';
import { passwordRegex } from 'src/shared/validationRegex';
import CustomPhoneInput from 'src/shared/components/Inputs/CustomPhoneInput';
import TextInput from 'src/shared/components/Inputs/TextInput';
import { CheckCircleOutlined, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import OTPInput from 'react-otp-input';
// import TextInput from 'src/shared/components/Inputs/TextInput';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormFour: FC<any> = ({
  form,
  formData,
  setFormData,
  setSelectCountryCode,
  selectCountryCode,
  isVerified,
  setIsVerified,
}) => {
  const [otp, setOtp] = useState('');
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Verify Email');
  const [popupOpenOne, setPopupOpenOne] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const isMobile = window.innerWidth <= 768;

  const popupRef: any = useRef('med-reminder-complete');

  const checkDuplicateEmail = async (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return apiCall(`authenticate/check-email-available?email=${email}`, 'GET', {})
      .then((respAdd: any) => {
        if (respAdd?.data?.message === 'Email available!') {
          return true;
        }
        return false;
      });
  };

  const sendOTP = async () => {
    await form.validateFields(['firstName', 'email']);

    setSendOTPLoading(true);
    const isEmailAvailable = await checkDuplicateEmail(formData?.email);
    if (!isEmailAvailable) {
      setPopupOpenOne(true);
      setTimeout(() => {
        setPopupOpenOne(false);
      }, 3000);
      setSendOTPLoading(false);
      return;
    }

    try {
      apiCall(`otp/otp-generate?email=${formData?.email}&firstName=${formData?.firstName}`, 'POST', {})
        .then((respAdd: any) => {
          setSendOTPLoading(false);
          if (respAdd?.data?.success) {
            setShowOTPVerification(true);
            setButtonText('Resend Verify Code');
            message.success({
              content: respAdd?.data?.message || alertConstant.sent_otp_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const verifyOTP = async () => {
    try {
      apiCall(`otp/otp-verify?email=${formData?.email}&otp=${otp}`, 'POST', {})
        .then((respAdd: any) => {
          if (respAdd?.data?.data?.otpVerified) {
            setIsVerified(true);
            setShowOTPVerification(false);
            setButtonText('');
          }
          // setFilterLoading(false);
        });
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span className="roboto-text" style={{ fontSize: '20px', fontWeight: 600, color: '#102F5A' }}>Enter your personal details</span>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <TextInput
            label="First Name"
            name="firstName"
            value={formData?.firstName}
            onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
            rules={[{ required: true, type: 'string', message: 'First Name is required' }]}
            placeholder="First Name"
            size="large"
            isRequired
            highlightInput
          />
        </Col>
        <Col xs={24} md={12}>
          <TextInput
            label="Last Name"
            name="lastName"
            value={formData?.lastName}
            onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
            rules={[{ required: true, type: 'string', message: 'Last Name is required' }]}
            placeholder="Last Name"
            size="large"
            isRequired
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={16}>
          {(isVerified) ? (
            <div style={{ padding: '0px 10px 30px 10px' }}>
              <Row justify="space-between" align="middle" style={{ backgroundColor: 'white', padding: '7px 10px' }}>
                <Col style={{ fontSize: '17px' }}>
                  {formData?.email}
                </Col>
                <Col span={6}>
                  <span
                    style={{
                      color: 'green',
                      fontSize: '12px',
                      display: 'flex',
                      padding: '0px 6px',
                      backgroundColor: '',
                    }}
                  >
                    Verified
                    &nbsp;
                    <CheckCircleOutlined />
                  </span>
                </Col>
              </Row>
            </div>
          ) : (
            <TextInput
              label="Email Address"
              name="email"
              value={formData?.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              rules={[{ required: true, message: 'Email Address is required' }, { type: 'email', message: 'Email is not a valid email' }]}
              placeholder="Your Email Address"
              suffix={isVerified ? (
                <span
                  style={{
                    color: 'green',
                    fontSize: '12px',
                    display: 'flex',
                    padding: '0px 6px',
                    backgroundColor: '',
                  }}
                >
                  Verified
                  &nbsp;
                  <CheckCircleOutlined />
                </span>
              ) : (
                <span
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    display: 'flex',
                    padding: '0px 6px',
                    backgroundColor: '',
                  }}
                >
                  Not Verified
                </span>
              )}
              size="large"
              isRequired
            />
          )}
        </Col>
        <Col style={{ padding: isMobile ? '0px 10px 10px 10px' : '0px' }}>
          {buttonText && (
            <Popover
              ref={popupRef}
              content={(
                <div>
                  <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                  Email not available. Please try another email.
                </div>
              )}
              open={popupOpenOne}
            >
              <Button onClick={sendOTP} size="large">
                {buttonText}
                {sendOTPLoading && (
                  <LoadingOutlined rev={undefined} spin />
                )}
              </Button>
            </Popover>
          )}
        </Col>
        {showOTPVerification && (
          <span style={{ padding: '0px 12px', paddingBottom: '10px', color: '#2358A6' }}>
            A Verify Code has been sent to your email address. Please check your inbox and enter the code below. If you have not received it, click on
            <b> Resend Verify Code </b>
            above.
          </span>
        )}
      </Row>
      {showOTPVerification && (
        <Row justify="start" style={{ padding: '0px 10px' }}>
          <Col sm={24} md={14}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span style={{ padding: '4px' }} />}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(props: any) => <Form.Item><Input size="large" {...props} style={{ width: '40px' }} /></Form.Item>}
            />
          </Col>
          <Col style={{ paddingBottom: isMobile ? '30px' : '0px' }}>
            <Button onClick={verifyOTP} size="large">Verify Code</Button>
          </Col>
          {/* <Col>
            <Button size="large">Resend OTP</Button>
          </Col> */}
        </Row>
      )}
      <Row>
        <Col xs={24} md={12}>
          <TextInput
            label="User ID"
            name="username"
            disabled={!isVerified}
            value={formData?.username}
            onChange={(e: any) => setFormData({ ...formData, username: e.target.value })}
            rules={[{ required: true, message: 'User Id is required' }]}
            placeholder="User ID"
            size="large"
            isRequired
          />
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            style={{ padding: '0px 10px' }}
            label="Password"
            name="password"
            className="hide-label"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Password is required',
              },
              {
                pattern: passwordRegex,
                message: 'Minimum eight characters, at least one uppercase and one lowercase letter, one number and one special character',
              },
            ]}
          >
            <Input.Password
              disabled={!isVerified}
              value={formData?.password}
              onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
              size="large"
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Form.Item
            style={{ padding: '0px 10px' }}
            label="Password Confirmation"
            name="confirmPassword"
            dependencies={['password']}
            className="hide-label"
            hasFeedback
            rules={[
              { required: true, message: 'Confirm Password is required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password mismatch'));
                },
              }),
            ]}
          >
            <Input.Password
              disabled={!isVerified}
              size="large"
              placeholder="Password Confirmation"
              value={formData?.confirmPassword}
              onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <CustomPhoneInput
            disabled={!isVerified}
            size="large"
            required={false}
            name="phone"
            label="Phone"
            placeholder="Phone"
            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
            selectIsdCode={selectCountryCode}
            setPhoneNumber={() => { }}
          />
        </Col>
      </Row>
      {isMobile && (<br />)}
    </div>
  );
};
