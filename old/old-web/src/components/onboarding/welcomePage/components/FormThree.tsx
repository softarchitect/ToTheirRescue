/* eslint-disable no-unused-vars */
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormThree: FC<any> = ({
  formNumber,
  setFormNumber,
  formData,
  setFormData,
}) => {
  const [inputList, setInputList] = useState<any>(['', '', '']);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  const clickNext = (number: any) => {
    setFormNumber(number);
  };

  const setInputFeild = (currentValue: any, index: any) => {
    const newInputList = inputList?.map((value: any, i: any) => {
      if (i === index) {
        return currentValue;
      }
      return value;
    });
    setInputList(newInputList);
    setFormData({ ...formData, hospitalPCOs: newInputList });
  };

  const clickAddInput = () => {
    const currentInputList = [...inputList];
    currentInputList.push('');
    setInputList(currentInputList);
  };

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span style={{ fontSize: '20px', color: '#102F5A' }}>What are some of the animal clinics/hospitals that you work with?</span>
      </Row>
      <Row justify="center" style={{ padding: '10px 0px' }}>
        <Col xs={24} md={18}>
          <ol>
            {
              inputList?.map((value: any, index: any) => (
                <li>
                  <TextInput
                    placeholder="Clinic/Hospital Name"
                    label="Clinic/Hospital Name"
                    value={value}
                    size="large"
                    // rules={[{ required: (index < 1), message: 'Rescue name is required' }]}
                    onChange={(e: any) => setInputFeild(e.target.value, index)}
                    // isRequired={index < 1}
                    highlightInput={(index === 0)}
                  />
                </li>
              ))
            }
          </ol>
        </Col>
        {/* <Button onClick={clickAddInput}>
          <PlusOutlined />
        </Button> */}
      </Row>
      {/* <Row justify="center" style={{ padding: '0px 10px' }}>
        <Col span={10}>
          <Button onClick={() => navigate('/login')} className={`${cssPrefix}__button`}>
            Sign In
          </Button>
        </Col>
        <Col>
          <Button onClick={() => clickNext(4)} className={`${cssPrefix}__button`}>
            Next
          </Button>
        </Col>
      </Row> */}
    </div>
  );
};
