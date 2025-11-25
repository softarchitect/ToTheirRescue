/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useState, useEffect, useRef, FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Button, Input, Form, Row, Checkbox,
} from 'antd';
import { isMobile } from 'react-device-detect';
import Title from 'antd/lib/typography/Title';
import TextInput from 'src/shared/components/Inputs/TextInput';
import ButtonLoader from '../../shared/components/ButtonLoader';
import { tyrLogoSrc } from '../../assets/images';
import { LoginProps } from './Login.types';
import ROLES_CONSTANT from '../../shared/constants/roles.json';
import './Login.less';

const cssPrefix = 'ftr-login';

interface Roles {
  [key: string]: any;
}
const roles: Roles = ROLES_CONSTANT;

// eslint-disable-next-line no-unused-vars
export const Login: FC<LoginProps> = (newLoginProps) => {
  const { loginLoading, userType, updateUserPermission } = newLoginProps;

  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const onFinish = () => {
    const formData = form.getFieldsValue();
    formData.staySignedIn = checked;
    newLoginProps.loginCall(formData, () => {
      navigate('/');
    });
  };

  // useEffect(() => {
  //   updateUserPermission(roles[userType] || {});
  // }, [userType]);

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Row justify="center">
        <Card style={isMobile ? { width: '450px', border: '0px solid' } : { width: '450px' }} bodyStyle={{ paddingTop: '40px', paddingLeft: '50px', paddingRight: '50px' }}>
          <Row justify="center">
            <img className={`${cssPrefix}__img_logo`} src={tyrLogoSrc} alt="toyourrescue.com" />
            <br />
            <Title style={{ fontSize: '25px', color: '#bb142d' }}>Sign in to your account</Title>
          </Row>
          <br />
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <TextInput
              style={{}}
              label="User ID"
              name="userName"
              rules={[{ required: true, message: 'User Id is required' }]}
              placeholder="Your User ID"
              isRequired
            />
            <Form.Item
              style={{ padding: '0px 10px' }}
              label="Password"
              name="password"
              className="hide-label"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder="Your Password" />
            </Form.Item>
            <Checkbox style={{ padding: '0px 10px' }} onChange={() => setChecked(!checked)} checked={checked}>Stay signed in</Checkbox>
            <Row justify="center" style={{ marginTop: '20px' }}>
              <Form.Item style={{}}>
                <Button id="submit-button" className={`${cssPrefix}__button`} type="primary" htmlType="submit">
                  Log in
                  {loginLoading && <ButtonLoader />}
                </Button>
              </Form.Item>
            </Row>
          </Form>
          <Row justify="end" style={{ paddingTop: '40px' }}>
            {'Forgot your '}
            &nbsp;
            <span style={{ color: 'blueviolet', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-username')}>username</span>
            &nbsp;
            {' or '}
            &nbsp;
            <span
              style={{
                color: 'blueviolet',
                cursor: 'pointer',
                textDecoration: 'underline',
                paddingRight: '4px',
              }}
              onClick={() => navigate('/forgot-password')}
            >
              password
            </span>
            ?
          </Row>
          <br />
        </Card>
      </Row>
    </div>
  );
};
