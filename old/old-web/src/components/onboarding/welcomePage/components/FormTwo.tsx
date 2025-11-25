/* eslint-disable no-unused-vars */
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormTwo: FC<any> = ({
  formNumber,
  setFormNumber,
  formData,
  setFormData,
}) => {
  const [inputList, setInputList] = useState<any>(['', '', '']);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const setInputFeild = (currentValue: any, index: any) => {
    const newInputList = inputList?.map((value: any, i: any) => {
      if (i === index) {
        return currentValue;
      }
      return value;
    });
    setInputList(newInputList);
    setFormData({ ...formData, otherRescuePCOs: newInputList });
  };

  const clickAddInput = () => {
    const currentInputList = [...inputList];
    currentInputList.push('');
    setInputList(currentInputList);
  };

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span style={{ fontSize: '20px', color: '#102F5A' }}>What other rescues do you take animals from or transfer animals to?</span>
      </Row>
      <Row justify="center" style={{ padding: '10px 0px' }}>
        <Col xs={24} md={18}>
          <ol>
            {
              inputList?.map((value: any, index: any) => (
                <li>
                  <TextInput
                    name={`rescue-name-${index}`}
                    placeholder="Other rescue"
                    label="Other rescue"
                    value={value}
                    size="large"
                    // rules={[{ required: (index < 1), message: 'Rescue name is required' }]}
                    onChange={(e: any) => setInputFeild(e.target.value, index)}
                    // suffix={<Button size="small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputList.splice(index, 1); }}><CloseOutlined /></Button>}
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
    </div>
  );
};
