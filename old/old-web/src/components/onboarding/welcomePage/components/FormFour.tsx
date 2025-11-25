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
export const FormFour: FC<any> = ({ formNumber, setFormNumber }) => {
  const [inputList, setInputList] = useState<any>(['']);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  const clickNext = (number: any) => {
    setFormNumber(number);
  };

  const onClickAddAnimal = () => {
    sessionStorage.setItem('on-boarding', 'false');
    localStorage.setItem('add-animal-modal', '1');
    navigate('/animals');
  };

  const clickAddInput = () => {
    const currentInputList = [...inputList];
    currentInputList.push('');
    setInputList(currentInputList);
  };

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span style={{ fontSize: '24px', color: '#102F5A' }}>
          Now let’s enter your first animal. Entering an animal requires 3 steps:
          <br />
          <br />
          <Row justify="center">
            <ol style={{ fontSize: '20px' }}>
              <li>
                <span>Entering some details about the animal</span>
              </li>
              <li>
                <span>Entering information about its age</span>
              </li>
              <li>
                <span>Saying how you obtained this animal</span>
              </li>
            </ol>
          </Row>
        </span>
      </Row>
      <Row justify="center" style={{ padding: '0px 10px' }}>
        {/* <Col span={10}>
                  <Button onClick={() => navigate('/login')} className={`${cssPrefix}__button`}>
                    Sign In
                  </Button>
                </Col> */}
        <Col>
          <Button onClick={() => onClickAddAnimal()} className={`${cssPrefix}__button`}>
            Add Animal
          </Button>
        </Col>
      </Row>
    </div>
  );
};
