/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, FC, useState,
} from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Row, Button, Form, Col,
} from 'antd';
import PasswordInput from 'src/shared/components/Inputs/PasswordInput';
import { passwordRegex } from '../../shared/validationRegex';
import ButtonLoader from '../../shared/components/ButtonLoader';
import './ResetPassword.less';

const cssPrefix = 'ftr-reset-password';
interface ResetPasswordProps {
  resetPassword: any,
  forgotPasswordLoading: boolean,
}

// eslint-disable-next-line no-unused-vars
export const ResetPassword: FC<ResetPasswordProps> = (props) => {
  const { resetPassword, forgotPasswordLoading } = props;
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [pageType, setPageType] = useState<any>('');
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // titleRef.current?.scrollIntoView();
  }, [titleRef]);

  useEffect(() => {
    setPageType(location?.pathname?.split('-')[1]);
  }, [location]);

  const onFinish = () => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const password = form.getFieldValue('password');
    resetPassword({
      token,
      email,
      password,
    }, () => {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    });
  };

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      <Form
        className={`${cssPrefix}__form`}
        name="basic"
        initialValues={{ remember: true }}
        form={form}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Row justify="center">
          <Col xs={24} md={8}>
            <PasswordInput
              label="Password"
              placeholder="Password"
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
              autoComplete="new-password"
              highlightInput
            />
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={24} md={8}>
            <PasswordInput
              label="Password Confirmation"
              placeholder="Password Confirmation"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Confirm Password is required' },
                ({ getFieldValue }: any) => ({
                  validator(_: any, value: any) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password mismatch'));
                  },
                }),
              ]}
            />
          </Col>
        </Row>
        <Row justify="center">
          <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
            Reset Password
            {forgotPasswordLoading && <ButtonLoader />}
          </Button>
        </Row>
        <br />
      </Form>
    </div>
  );
};
