/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, useState, FC,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button, Input, Form, Row,
} from 'antd';
import TextInput from 'src/shared/components/Inputs/TextInput';
import { passwordRegex } from '../../shared/validationRegex';
import { tyrLogoSrc } from '../../assets/images';
import { InviteProps } from './Invite.types';
import './Invite.less';

const cssPrefix = 'ftr-invite';

// eslint-disable-next-line no-unused-vars
export const Invite: FC<InviteProps> = (newInviteProps) => {
  const {
    getUserDetailByToken, tempUserDetail, updatePasswordInvite, getUserDetailByTokenLoading,
  } = newInviteProps;
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [newKey, setNewKey] = useState(Date.now());
  const titleRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationMessage, setVerificationMessage] = useState<any>('');
  // const [firstError, setFirstError] = useState<any>('');

  useEffect(() => {
    // titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const validateMessages = {
    required: '${label} is required',
    types: {
      email: '${label} is not a valid email',
      number: '${label} is not a valid number',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const callbackAfterPasswordUpdate = () => {
    navigate('/login');
  };

  const handleOk = async () => {
    const userData = form.getFieldsValue();
    updatePasswordInvite({ ...userData, id: tempUserDetail?.id, token: searchParams.get('token') }, () => { callbackAfterPasswordUpdate(); });
  };

  const callbackAfterGettingDetail = (message: string) => {
    setVerificationMessage(message);
  };

  useEffect(() => {
    if (!tempUserDetail) {
      return;
    }
    const {
      firstName, lastName, email,
    } = tempUserDetail;
    form.setFieldsValue({ firstName, lastName, email });
  }, [tempUserDetail]);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    getUserDetailByToken({ token, email }, (message: any) => callbackAfterGettingDetail(message));
  }, []);

  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Row justify="center" style={{ paddingBottom: '40px' }}>
        <img className={`${cssPrefix}__img_logo`} src={tyrLogoSrc} alt="toyourrescue.com" />
      </Row>
      {(!getUserDetailByTokenLoading && !tempUserDetail)
        ? (<Row justify="center"><p style={{ color: 'red' }}>{verificationMessage || 'Link Expired'}</p></Row>)
        : (
          <Row justify="center">
            <Form style={{ width: isMobile ? '90%' : '500px', color: 'red' }} labelCol={{ span: 7 }} wrapperCol={{ span: 30 }} key={newKey} onFinish={handleOk} form={form} validateMessages={validateMessages}>
              <TextInput
                label="First Name"
                placeholder="First Name"
                required
                name="firstName"
                highlightInput
              />
              <TextInput
                label="Last Name"
                required
                name="lastName"
              />
              {/* <Form.Item
                label="Phone"
                required
              >
                <Input
                  onChange={(e) => handleInput(e)}
                  value={userForm.phoneNumber}
                  name="phoneNumber"
                />
              </Form.Item> */}
              <TextInput
                label="Email"
                required
                name="email"
                disabled
              />
              <TextInput
                label="User Name"
                placeholder="User Name"
                required
                name="userName"
                isRequired
              />
              <Form.Item
                style={{ padding: '0px 10px' }}
                className="hide-label"
                label="Password"
                name="password"
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
                <Input.Password placeholder="Password" name="password" />
              </Form.Item>
              <Form.Item
                style={{ padding: '0px 10px' }}
                className="hide-label"
                label="Password Confirmation"
                name="confirmPassword"
                dependencies={['password']}
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
                <Input.Password placeholder="Password Confirmation" autoComplete="new-password" />
              </Form.Item>
              <Row justify="center" style={{ marginBottom: '10px', alignItems: 'center' }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Row>
            </Form>
          </Row>
        )}
    </div>
  );
};
