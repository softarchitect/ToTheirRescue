/* eslint-disable no-unused-vars */
import {
  useEffect, FC,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button, Row, Form, Col,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import { apiCall } from 'src/shared/api/apiWrapper';
import { loginCall, updateUserPermission } from 'src/redux/auth/action';
import { FormOne } from './components/FormOne';
import { FormTwo } from './components/FormTwo';
import { FormThree } from './components/FormThree';
import { FormFour } from './components/FormFour';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
const WelcomePage: FC<any> = ({ loginApiCall }) => {
  const [formStep, setFormStep] = useState(0);
  const [formNumber, setFormNumber] = useState(1);
  const [formData, setFormData] = useState<any>();
  const [addLoading, setAddLoading] = useState(false);
  const [inputList, setInputList] = useState<any>(['']);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  const isMobile = window.innerWidth <= 768;

  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      await form.validateFields();
      setAddLoading(true);
      let hospitalPCOs = formData?.hospitalPCOs;
      hospitalPCOs = hospitalPCOs?.filter((item: any) => item && item.trim() !== '') || [];
      let otherRescuePCOs = formData?.otherRescuePCOs;
      otherRescuePCOs = otherRescuePCOs?.filter((item: any) => item && item.trim() !== '') || [];
      const data = {
        ...formData,
        hospitalPCOs,
        otherRescuePCOs,
      };

      apiCall('onboarding/add-onboarding', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            setFormNumber(4);
            sessionStorage.setItem('on-boarding', 'true');
          }
          setAddLoading(false);
          form.resetFields();
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const clickNext = async (number: any) => {
    if (formNumber === 3 && number === 4) {
      onSubmit();
      return;
    }
    setFormNumber(number);
  };

  const getFormContent = (currentFormNumber: any, currentForm: any) => {
    if (currentFormNumber === 1) {
      return (
        <FormOne
          inputList={inputList}
          setInputList={setInputList}
          formData={formData}
          setFormData={setFormData}
          formNumber={formNumber}
          setFormNumber={setFormNumber}
          form={currentForm}
        />
      );
    } if (currentFormNumber === 2) {
      return <FormTwo formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} form={currentForm} />;
    } if (currentFormNumber === 3) {
      return <FormThree formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} form={currentForm} />;
    } if (currentFormNumber === 4) {
      return <FormFour formData={formData} setFormData={setFormData} formNumber={formNumber} setFormNumber={setFormNumber} form={currentForm} />;
    }
    return null;
  };

  return (
    <div>
      <div style={{ padding: isMobile ? '10px' : '40px 200px', color: '#102F5A', fontSize: isMobile ? '18px' : '22px' }}>
        {(formStep < 1) ? (
          <>
            <div className="roboto-text" style={{}}>
              Thank you for becoming a beta tester. We want you to exercise this app and give us feedback about any problems you encounter and any suggestions you may have.
              We will do all that we can to make it work for you.
            </div>
            <br />
            <div className="roboto-text" style={{}}>
              You can enter as many animals as you want to but know that when we go live we will be initializing the database
              and your animals will disappear. So, it is best to enter a few of your animals and then to use all of the different features of the app for those animals that
              you’ve entered.
            </div>
            <br />
            <div className="roboto-text" style={{}}>
              You’ll next be taken through a series of questions and we will use your answers to set up your database. You will be able to change, delete, or
              add to any of the responses that you give in the Customization section or in the People, Companies, and Organization (PCO) section.
            </div>
            <Row justify="center" style={{ padding: '60px 10px' }}>
              <Button style={{ padding: '30px', fontSize: '22px' }} size="large" className="ftr-button-primary" onClick={() => setFormStep(1)}>
                Let’s Go !
              </Button>
            </Row>
          </>
        ) : (
          <Row justify="center">
            <Form form={form}>
              {getFormContent(formNumber, form)}
            </Form>
          </Row>
        )}
        {(formNumber > 0 && formNumber < 4) && (
          <Row justify="center" style={{ padding: '0px 10px' }}>
            {(formNumber > 1) && (
              <Col span={10}>
                <Button onClick={() => clickNext(formNumber - 1)} className={`${cssPrefix}__button_secondary`}>
                  Back
                </Button>
              </Col>
            )}
            {(formNumber > 0) && (formStep > 0) && (
              <Col>
                <Button onClick={async () => { await form.validateFields(); await clickNext(formNumber + 1); }} className={`${cssPrefix}__button`}>
                  Next
                  {addLoading && (formNumber === 3) && (
                    <LoadingOutlined rev={undefined} spin />
                  )}
                </Button>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  loginLoading: state.auth.loginLoading,
  userType: state.auth.userType,
});

const mapDispatchToProps = (dispatch: any) => ({
  loginApiCall: (data: {}, callbackFunction: () => void) => dispatch(loginCall(data, callbackFunction)),
  updateUserPermission: (data: {}) => dispatch(updateUserPermission(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
