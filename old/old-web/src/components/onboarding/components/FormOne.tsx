/* eslint-disable no-unused-vars */
import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Row,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormOne: FC<any> = ({
  form,
  formData,
  setFormData,
  setFormNumber,
  clickNext,
}) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  return (
    <div>
      <Row justify="center" style={{ padding: '10px' }}>
        <span className="roboto-text" style={{ fontSize: '20px', fontWeight: 600, color: '#102F5A' }}>Enter the Name and Acronym of your rescue or sanctuary</span>
      </Row>
      <Row justify="center">
        <Col xs={24} md={12}>
          <TextInput
            size="large"
            name="name"
            placeholder="Name of rescue"
            label="Name of rescue"
            rules={[{ required: true, message: 'Rescue name is required' }]}
            value={formData?.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            isRequired
            highlightInput
          />
        </Col>
        <Col xs={24} md={10}>
          <TextInput
            size="large"
            name="tenantAcronym"
            placeholder="Acronym"
            label="Rescue Acronym"
            value={formData?.tenantAcronym}
            onChange={(e: any) => setFormData({ ...formData, tenantAcronym: e.target.value })}
            rules={[{ required: true, message: 'Rescue acronym is required' }]}
            isRequired
          />
        </Col>
      </Row>
    </div>
  );
};
