/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useEffect, useState, useRef, FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import {
  Form,
  Input,
  Button,
  Tooltip,
  Typography,
  Select,
  message,
  Col,
  Row,
} from 'antd';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import country from 'src/shared/constants/country.json';
import countryToState from 'src/shared/constants/states.json';
import CustomPhoneInput from 'src/shared/components/Inputs/CustomPhoneInput';
import ButtonLoader from '../../shared/components/ButtonLoader';
import { SignupProps } from './Signup.types';

import { apiCall } from '../../shared/api/apiWrapper';
import { passwordRegex } from '../../shared/validationRegex';
import './Signup.less';
import { tyrLogoSrc } from '../../assets/images';

const cssPrefix = 'ftr-signup';

interface CountryNameInterface {
  id: string;
  countryName: string;
}

// eslint-disable-next-line
export const Signup: FC<SignupProps> = (newSignupProps) => {
  const { signupLoading } = newSignupProps;
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [countryCodePhone, setCountryCodePhone] = useState('1');
  const [selectCountryIsoCode, setSelectCountryIsoCode] = useState<any>('');
  // eslint-disable-next-line no-unused-vars
  const [selectCountryCode, setSelectCountryCode] = useState('');
  const [countryName, setCountryName] = useState(newCountryNameInterface);
  // eslint-disable-next-line no-unused-vars
  const [selectCountry, setSelectCountry] = useState('');
  const [mobileView, setMobileView] = useState(window.innerWidth);
  const handleWindowResize = () => {
    setMobileView(window.innerWidth);
  };

  const countryToStateConst: any = { ...countryToState };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryName(resp?.data?.data?.countries);
        }
      });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // titleRef.current?.scrollIntoView();
  }, [titleRef]);

  // eslint-disable-next-line no-unused-vars
  const onFinish = (values: any) => {
    const {
      alternateEmailAddress,
      city,
      countryId = selectCountry,
      email,
      firstName,
      lastName,
      name,
      password,
      phone,
      emailAddressPerson,
      phoneNumber,
      state,
      street,
      tenantAcronym,
      username,
      Website,
      zip,
    } = form.getFieldsValue();

    // eslint-disable-next-line no-unused-vars
    const formData = {
      username,
      email,
      alternateEmailAddress,
      password,
      firstName,
      lastName,
      phoneNumber: `+${selectCountryCode}${phoneNumber}`,
      status: sessionStorage.getItem('signup-type'),
      tenantVm: {
        name,
        tenantAcronym,
        street,
        city,
        state,
        zip,
        countryId,
        phone,
        emailAddress: emailAddressPerson,
        website: Website,
        mailList: true,
      },
    };
    localStorage.setItem('countryId', formData.tenantVm.countryId);
    newSignupProps.signUpCall(formData, () => {
      navigate('/signup/success');
    });
  };

  const onChangeDropDown = (value: any) => {
    setSelectCountry(value);
    form.setFieldValue('state', null);
    const countryByName = country?.byName as any;
    countryName?.forEach((data: any) => {
      if (data?.id === value) {
        const currentCountry = countryByName?.[data?.countryName as any];
        const byCountryCode = country?.byCountryCode as any;
        setSelectCountryIsoCode(countryByName?.[data?.countryName as any]);
        setSelectCountryCode(byCountryCode?.[currentCountry as any]?.stdCode);
      }
    });
  };

  // eslint-disable-next-line no-unused-vars
  const onFinishFailed = (errorInfo: any) => {
    message.error('Please correct highlighted fields', 1.5);
  };

  // eslint-disable-next-line
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        Signup
      </Title>
    </div>
  );

  const onChangeCountry = (value: any) => {
    setCountryCodePhone(value);
  };

  // eslint-disable-next-line no-unused-vars
  const prefixSelector = (
    <Select
      value={countryCodePhone}
      style={{ width: 70 }}
      showSearch
      placeholder="Select a country"
      optionFilterProp="children"
      onChange={onChangeCountry}
      filterOption={(input: any, option: any) => option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value="1">US</Option>
      <Option value="91">IN</Option>
      <Option value="44">UK</Option>
    </Select>
  );

  const isMobile = mobileView < 600;

  const signupForm = (
    <Form
      id="registration-form"
      className={`${cssPrefix}__form`}
      name="basic"
      initialValues={{ remember: true }}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <img className={`${cssPrefix}__form__img`} style={{ width: '13vh', paddingTop: '10px', paddingBottom: '20px' }} src={tyrLogoSrc} alt="toyourrescue.com" />
      <br />
      <Row justify="center" style={{ padding: isMobile ? '0px' : '0px  80px' }}>
        <Col style={{ borderRight: '1px solid #2954A2', padding: '0px 30px' }} xl={10} md={12} xs={24}>
          <Title className={`${cssPrefix}__form__header`} level={5}>Your Rescue Information</Title>
          <TextInput
            label="Rescue Name"
            name="name"
            rules={[{ required: true, message: 'Rescue Name is required' }]}
            placeholder="Your rescue name"
            isRequired
          />
          <TextInput
            label="Rescue Acronym"
            name="tenantAcronym"
            rules={[{ required: true, message: 'Rescue Acronym is required' }]}
            placeholder="Your rescue acronym"
            isRequired
          />
          <TextInput
            label="Street Address"
            name="street"
            rules={[{ required: true, message: 'Street Name is required' }]}
            placeholder="Street Address"
            isRequired
          />
          <TextInput
            label="City or Township"
            name="city"
            rules={[{ required: true, message: 'City or Township Name is required' }]}
            placeholder="City or Township Name"
            isRequired
          />
          <Row>
            <Col md={11} xs={24}>
              <DropdownInput
                label="Country"
                placeholder="Country"
                name="countryId"
                rules={[{ required: true, message: 'Country name is required' }]}
                onChange={onChangeDropDown}
                showSearch
                filterOption={(input: any, option: any) => option?.children?.toLowerCase().startsWith(input.toLowerCase())}
                dataList={countryName}
                keyName="countryName"
                isRequired
              />
            </Col>
            <Col md={13} xs={12}>
              <DropdownInput
                name="state"
                label="State/Province/Locality"
                rules={[
                  {
                    required: true,
                  },
                ]}
                dataList={countryToStateConst[selectCountryIsoCode]}
                placeholder="State/Province/Locality"
                keyName="label"
                isRequired
              />
            </Col>
          </Row>
          <Row>
            <Col md={11} xs={12}>
              <TextInput
                label="Zip/Postal Code"
                name="zip"
                // rules={[{ required: true, message: 'Zip is required' }, { pattern: /^\d{5}[-\s]?(?:\d{4})?$/, message: 'Please enter valid zip' }]}
                placeholder="Zip/Postal Code"
                isRequired={false}
              />
            </Col>
            <Col md={13} xs={24}>
              <CustomPhoneInput
                required={false}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone"
                selectIsdCode={selectCountryCode}
                setPhoneNumber={(data: any) => form.setFieldValue('phoneNumber', data)}
              />
            </Col>
          </Row>
          <TextInput
            label="Email Address"
            name="emailAddressPerson"
            rules={[{ required: true, message: 'Email Address is required' }, { type: 'email', message: 'Email is not a valid email' }]}
            placeholder="Email Address"
            isRequired
          />
          <Form.Item
            label="Website"
            name="Website"
            className="hide-label"
            style={{ padding: '0px 10px' }}
            rules={[{
              required: true,
              message: 'Website, Facebook, etc. address is required',
            }, {
              pattern: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
              message: 'Please enter valid URL',
            }]}
          >
            <div className={`${cssPrefix}__form__inline`}>
              <Input name="website" className={`${cssPrefix}__form__input`} placeholder="Website, Facebook, etc. address" />
              {/*
              <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="right" title={WebsiteValidationTooltip}>
                <Typography.Link><InfoCircleOutlined rev={undefined} /></Typography.Link>
              </Tooltip>
               */}
            </div>
          </Form.Item>
        </Col>
        <Col style={{ padding: '0px 30px' }} xl={10} md={12} xs={24}>
          <Title className={`${cssPrefix}__form__header`} level={5}>Your Information</Title>
          <TextInput
            label="First Name"
            name="firstName"
            rules={[{ required: true, type: 'string', message: 'First Name is required' }]}
            placeholder="First Name"
            isRequired
          />
          <TextInput
            label="Last Name"
            name="lastName"
            rules={[{ required: true, type: 'string', message: 'Last Name is required' }]}
            placeholder="Last Name"
            isRequired
          />
          <TextInput
            label="User ID"
            name="username"
            rules={[{ required: true, message: 'User Id is required' }]}
            placeholder="User ID"
            isRequired
          />
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
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>
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
            <Input.Password placeholder="Password Confirmation" />
          </Form.Item>
          <CustomPhoneInput
            required={false}
            name="phone"
            label="Phone"
            placeholder="Phone"
            selectIsdCode={selectCountryCode}
            setPhoneNumber={(data: any) => form.setFieldValue('phone', data)}
          />
          <TextInput
            label="Email Address"
            name="email"
            rules={[{ required: true, message: 'Email Address is required' }, { type: 'email', message: 'Email is not a valid email' }]}
            placeholder="Your Email Address"
            isRequired
          />
          <TextInput
            label="Alternate Email Address"
            name="alternateEmailAddress"
            rules={[
              { type: 'email', message: 'Email is not a valid email' },
              ({ getFieldValue }: any) => ({
                validator(_: any, value: any) {
                  if (!value || getFieldValue('email') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Alternate Email should not be same as Email Address'));
                },
              }),
            ]}
            placeholder="Alternate Email Address"
          />
        </Col>
      </Row>
      <br />
      <br />
      {
        !isMobile
        && (
          <Row justify="center">
            <Col span={24}>
              <Row justify="center">
                <Button className={`${cssPrefix}__form__submit`} type="primary" htmlType="submit">
                  Submit
                  {signupLoading && <ButtonLoader />}
                </Button>
              </Row>
            </Col>
            <div className={`${cssPrefix}__form__signin-instead`}>
              <span>Already have an account ? &nbsp;</span>
              <span
                style={{
                  textDecoration: 'underline',
                  color: 'blue',
                  textDecorationColor: 'blue',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/login')}
              >
                Sign in instead
              </span>
            </div>
            {/* <img className={`${cssPrefix}__form__img`} src={tyrAnimalImgSrc} alt="toyourrescue.com" /> */}
          </Row>
        )
      }
      {
        isMobile
        && (
          <Row justify="center" style={{ padding: '0px 20px 0px 20px' }}>
            <Button className={`${cssPrefix}__form__submit`} form="registration-form" type="primary" htmlType="submit">
              Submit
              {signupLoading && <ButtonLoader />}
            </Button>
            <div className={`${cssPrefix}__form__signin-instead`}>
              <span>Already have an account ? &nbsp;</span>
              <span
                style={{
                  textDecoration: 'underline',
                  color: 'blue',
                  textDecorationColor: 'blue',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/login')}
              >
                Sign in instead
              </span>
            </div>
            {/* <img className={`${cssPrefix}__form__img`} src={tyrAnimalImgSrc} alt="toyourrescue.com" /> */}
          </Row>
        )
      }
    </Form>
  );

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {/* {pageHeader} */}
      {signupForm}
    </div>
  );
};
