/* eslint-disable no-unused-vars */
import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row, Form,
  Input,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';
// import TextInput from 'src/shared/components/Inputs/TextInput';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormThree: FC<any> = ({ formData, setFormData, setFormNumber }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  const clickNext = (number: any) => {
    setFormNumber(number);
  };

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span className="roboto-text" style={{ fontSize: '20px', fontWeight: 600, color: '#102F5A' }}>Your social media page or website</span>
      </Row>
      <TextInput
        label="Website"
        name="website"
        rules={[{
          required: true,
          message: 'Website, Facebook, etc. address is required',
        }, {
          pattern: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
          message: 'Please enter valid URL',
        }]}
        size="large"
        value={formData?.website}
        onChange={(e: any) => setFormData({ ...formData, website: e.target.value })}
        placeholder="Website, Facebook, etc. address"
        isRequired
        highlightInput
      />
    </div>
  );
};
