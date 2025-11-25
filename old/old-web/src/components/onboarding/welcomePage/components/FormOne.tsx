/* eslint-disable no-unused-vars */
import {
  useEffect, FC, useState, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Popover, Row,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';
import { CloseCircleFilled, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import AnimalType from 'src/components/customization/components/AnimalType';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormOne: FC<any> = ({
  formNumber,
  setFormNumber,
  formData,
  setFormData,
  inputList,
  setInputList,
}) => {
  const [popupOpenOne, setPopupOpenOne] = useState(false);

  const popupRef: any = useRef('med-reminder-complete');
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

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
    setFormData({ ...formData, animalTypes: newInputList });
  };

  const clickAddInput = () => {
    if (inputList?.length >= 9) {
      setPopupOpenOne(true);
      setTimeout(() => {
        setPopupOpenOne(false);
      }, 2000);
      return;
    }
    const currentInputList = [...inputList];
    currentInputList.push('');
    setInputList(currentInputList);
  };

  return (
    <div>
      <Row justify="center" style={{ padding: '10px' }}>
        <span style={{ fontSize: '20px', color: '#102F5A' }}>
          What types of animals do you rescue?
          &nbsp;
          <span style={{ fontSize: '18px' }}>Use plural - Ex: Dogs, not Dog</span>
        </span>
      </Row>
      <Row justify={isMobile ? 'start' : 'center'} style={{ padding: '10px 0px' }}>
        {
          inputList?.map((value: any, index: any) => (
            <TextInput
              size="large"
              placeholder="Animal Type"
              label="Animal Type"
              name={`animalType-${index}`}
              rules={[{ required: true, message: 'Animal type is required' }]}
              value={value}
              onChange={(e: any) => setInputFeild(e.target.value, index)}
              suffix={<Button size="small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputList.splice(index, 1); }}><CloseOutlined /></Button>}
              isRequired
              highlightInput
            />
          ))
        }
        <Popover
          ref={popupRef}
          content={(
            <div>
              <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
              You can add more animal later in customization section.
            </div>
          )}
          open={popupOpenOne}
        >
          <Button style={{ padding: '19px 10px' }} onClick={clickAddInput}>
            <PlusOutlined />
          </Button>
        </Popover>
      </Row>
      {/* <Row justify="center" style={{ padding: '0px 10px' }}>
        <Col>
          <Button onClick={() => clickNext(2)} className={`${cssPrefix}__button`}>
            Next
          </Button>
        </Col>
      </Row> */}
    </div>
  );
};
