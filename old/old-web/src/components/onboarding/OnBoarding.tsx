/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import {
  useEffect, FC, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card, Col, Row, Form, Button,
  Popover,
} from 'antd';
import { CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import { addPCOCall } from 'src/redux/pco/action';
import { loginCall, updateUserPermission, signUpCall } from 'src/redux/auth/action';
import { tyrLogoSrc } from 'src/assets/images';
import animalImage from 'src/assets/images/cat-image.jpg';
import animalImageMobile from 'src/assets/images/cat-image-mobile.jpg';
import footPrint from 'src/assets/images/foot-png.png';
import { isMobileOnly } from 'react-device-detect';
import { setAnimalActionModalState } from 'src/redux/common/action';
import './OnBoarding.less';
import { FormOne } from './components/FormOne';
import { FormThree } from './components/FormThree';
import { FormTwo } from './components/FormTwo';
import { FormFour } from './components/FormFour';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
const Onboarding: FC<any> = ({
  loginApiCall, addPCOApiCall, signUpApiCall, setActionModal,
}) => {
  const [formNumber, setFormNumber] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [signupLoginLoading, setSignupLoginLoading] = useState(false);
  const [selectCountry, setSelectCountry] = useState('');
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [selectCountryCode, setSelectCountryCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [popupOpenOne, setPopupOpenOne] = useState(false);

  const isMobile = window.innerWidth <= 768;

  const popupRef: any = useRef('login-next-button');
  const navigate = useNavigate();
  const cookies = new Cookies();
  const titleRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = cookies.get('login');

  const [form] = Form.useForm();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  const onFinish = () => {
    setActionModal('');
    if (!isVerified) {
      setPopupOpenOne(true);
      setTimeout(() => {
        setPopupOpenOne(false);
      }, 3000);
      return;
    }

    setSignupLoginLoading(true);
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
      website,
      zip,
    } = formData;

    // eslint-disable-next-line no-unused-vars
    const currentFormData = {
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
        emailAddress: email,
        website,
        mailList: true,
      },
    };
    const formDataPCO = {
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      countryId,
      phone,
      email,
      mailList: false,
      website,
      entityType: 'Person',
      hospital: false,
      rescue: false,
      flag: false,
    };

    signUpApiCall(currentFormData, (success: boolean) => {
      if (!success) {
        setSignupLoginLoading(false);
        return;
      }
      loginApiCall({ userName: username, password }, () => {
        addPCOApiCall({
          formData: formDataPCO,
          forceAdd: true,
          addConfirmPco: () => { },
        }, () => { });
        setSignupLoginLoading(false);
        navigate('/');
      });
    });
  };

  const clickNext = async (number: any) => {
    if (number === 5) {
      sessionStorage.setItem('on-boarding', 'true');
      onFinish();
    } else {
      setFormNumber(number);
    }
  };

  const getFormContent = (currentFormNumber: any, currentForm: any) => {
    if (currentFormNumber === 1) {
      return <FormOne form={currentForm} formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} clickNext={clickNext} />;
    } if (currentFormNumber === 2) {
      return <FormTwo formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} />;
    } if (currentFormNumber === 3) {
      return <FormThree formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} />;
    } if (currentFormNumber === 4) {
      return (
        <FormFour
          isVerified={isVerified}
          setIsVerified={setIsVerified}
          form={currentForm}
          formData={formData}
          setFormData={setFormData}
          setSelectCountryCode={setSelectCountryCode}
          selectCountryCode={selectCountryCode}
        />
      );
    }
    return null;
  };

  // return (
  //   <div className={`${cssPrefix}`} ref={titleRef}>
  //     <Row justify="center" style={{ padding: '20px 10px' }}>
  //       <img style={{ height: '80px', paddingTop: '0px', paddingBottom: '10px' }} src={tyrLogoSrc} alt="toyourrescue.com" />
  //     </Row>
  //     <Row justify="center" align="top" style={{ height: '89%' }}>
  //       <Card
  //         style={{
  //           backgroundColor: isMobile ? '' : '#F8F8F8',
  //           width: '800px',
  //           padding: isMobile ? '0px' : '80px',
  //           border: isMobile ? '0px solid white' : '1px #A8A8A8 solid',
  //           borderRadius: '4px 0px 0px 4px',
  //         }}
  //       >
  //         <Row justify="center" align="middle" style={{ height: '100%' }}>
  //           <Col span={24}>
  //             <Form form={form}>
  //               {getFormContent(formNumber, form)}
  //             </Form>
  //             <Row justify="center" style={{ padding: '0px 10px' }}>
  //               {(formNumber > 1) && (
  //                 <Col span={10}>
  //                   <Button onClick={() => clickNext(formNumber - 1)} className={`${cssPrefix}__button_secondary`}>
  //                     Back
  //                   </Button>
  //                 </Col>
  //               )}
  //               <Col>
  //                 <Popover
  //                   ref={popupRef}
  //                   content={(
  //                     <div>
  //                       <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
  //                       Please verify email.
  //                     </div>
  //                   )}
  //                   open={popupOpenOne}
  //                 >
  //                   <Button onClick={async () => { await form.validateFields(); await clickNext(formNumber + 1); }} className={`${cssPrefix}__button`}>
  //                     {(formNumber === 4) ? 'Continue' : 'Next'}
  //                     {signupLoginLoading && (formNumber === 4) && (
  //                       <LoadingOutlined rev={undefined} spin />
  //                     )}
  //                   </Button>
  //                 </Popover>
  //               </Col>
  //             </Row>
  //           </Col>
  //         </Row>
  //       </Card>
  //     </Row>
  //   </div>
  // );
  return (
    <div style={{ height: '100vh', backgroundImage: `url(${isMobileOnly ? animalImageMobile : animalImage})`, backgroundSize: 'cover' }}>
      <Row className={showOnboardingForm ? 'signup-welcome-screen-gradient-white' : 'signup-welcome-screen-gradient'}>
        <Col xs={0} sm={14} />

        {showOnboardingForm ? (
          <Col xs={24} sm={10} className="roboto-text">
            <Row justify="center" align="middle" style={{ height: '100%', padding: '0px 20px' }}>
              <Col span={24}>
                <Form form={form} className="onboarding-form">
                  {getFormContent(formNumber, form)}
                </Form>
                <Row justify="center" style={{ padding: '0px 10px' }}>
                  {(formNumber > 1) && (
                    <Col span={10}>
                      <Button onClick={() => clickNext(formNumber - 1)} className={`${cssPrefix}__button_secondary`}>
                        Back
                      </Button>
                    </Col>
                  )}
                  <Col>
                    <Popover
                      ref={popupRef}
                      content={(
                        <div>
                          <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                          Please verify email.
                        </div>
                      )}
                      open={popupOpenOne}
                    >
                      <Button onClick={async () => { await form.validateFields(); await clickNext(formNumber + 1); }} className={`${cssPrefix}__button`}>
                        {(formNumber === 4) ? 'Continue' : 'Next'}
                        {signupLoginLoading && (formNumber === 4) && (
                          <LoadingOutlined rev={undefined} spin />
                        )}
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col xs={24} sm={10} className="roboto-text">
            {!isMobileOnly && (
              <>
                <div style={{ position: 'absolute', left: 30, bottom: 20, transform: 'rotate(10deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
                <div style={{ position: 'absolute', right: 30, bottom: 100, transform: 'rotate(20deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
                <div style={{ position: 'absolute', left: -60, bottom: 180, transform: 'rotate(320deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
                <div style={{ position: 'absolute', left: 200, bottom: 80, transform: 'rotate(320deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
                <div style={{ position: 'absolute', left: 360, bottom: 180, transform: 'rotate(320deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
                <div style={{ position: 'absolute', left: 90, bottom: 310, transform: 'rotate(320deg)', opacity: 0.5 }}>
                  <img className="vibrate-slow" style={{ width: '80px', height: '80px' }} src={footPrint} alt="" />
                </div>
              </>
            )}
            <Row justify="center">
              <div className="roboto-text animate__bounceIn" style={{ fontSize: isMobileOnly ? '26px' : '40px', color: '#f2f2f2', paddingTop: '60px', fontWeight: 700 }}>
                Welcome to To Their Rescue!
              </div>
            </Row>
            <Row justify="center">
              <div style={{ fontSize: isMobileOnly ? '20px' : '24px', color: '#f2f2f2', padding: '10px', fontWeight: 500 }}>
                Onboarding Wizard
              </div>
            </Row>
            <Row style={{ padding: isMobileOnly ? '60px 10px' : '60px' }}>
              <div className="roboto-text" style={{ fontSize: '20px', color: '#f2f2f2', padding: '10px', fontWeight: 400, textAlign: 'center' }}>
                Thank you for trying To Their Rescue!
                <br />
                We&apos;re thrilled to have you and confident
                the platform will simplify record-keeping,
                enhance fundraising, and give you more time for your animals.
              </div>
            </Row>
            <Row justify="center">
              <div className="" style={{ fontSize: '18px', color: '#f2f2f2', padding: '10px', fontWeight: 400, textAlign: 'center' }}>
                CLICK BELOW TO GET STARTED
              </div>
            </Row>
            <Row justify="center" style={{ padding: '10px' }}>
              <Button onClick={() => setShowOnboardingForm(true)} className="hover-button-start animate__bounceIn animate__delay-5s">
                START
              </Button>
            </Row>
          </Col>
        )}
      </Row>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  loginLoading: state.auth.loginLoading,
  userType: state.auth.userType,
});

const mapDispatchToProps = (dispatch: any) => ({
  loginApiCall: (data: {}, callbackFunction: () => void) => dispatch(loginCall(data, callbackFunction)),
  signUpApiCall: (data: {}, callbackFunction: (status: boolean) => void) => dispatch(signUpCall(data, callbackFunction)),
  addPCOApiCall: (data: {}, callbackFunction: () => void) => dispatch(addPCOCall(data, callbackFunction)),
  updateUserPermission: (data: {}) => dispatch(updateUserPermission(data)),
  setActionModal: (data: any, callbackFunction: () => void) => dispatch(setAnimalActionModalState(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
