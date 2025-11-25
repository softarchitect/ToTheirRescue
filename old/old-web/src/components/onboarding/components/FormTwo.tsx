/* eslint-disable no-unused-vars */
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, message, Row,
} from 'antd';
import Cookies from 'universal-cookie';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import country from 'src/shared/constants/country.json';
import countryToState from 'src/shared/constants/states.json';
import { apiCall } from 'src/shared/api/apiWrapper';

const cssPrefix = 'ftr-onboarding';

// eslint-disable-next-line no-unused-vars
export const FormTwo: FC<any> = ({
  formData,
  setFormData,
  formNumber,
  setFormNumber,
}) => {
  const [selectCountry, setSelectCountry] = useState<any>('');
  const [selectCountryCode, setSelectCountryCode] = useState('');
  const [selectCountryIsoCode, setSelectCountryIsoCode] = useState<any>('');
  const [countryName, setCountryName] = useState<any>([]);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isLoggedIn = cookies.get('login');

  const countryToStateConst: any = { ...countryToState };

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryName(resp?.data?.data?.countries);
        }
      });
  }, []);

  const onChangeDropDown = (value: any) => {
    setFormData({ ...formData, countryId: value });
    setSelectCountry(value);
    // form.setFieldValue('state', null);
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

  return (
    <div>
      <Row style={{ padding: '10px' }}>
        <span className="roboto-text" style={{ fontSize: '20px', fontWeight: 600, color: '#102F5A' }}>Where is your rescue located</span>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <TextInput
            label="Street Address"
            name="street"
            value={formData?.street}
            onChange={(e: any) => setFormData({ ...formData, street: e.target.value })}
            rules={[{ required: true, message: 'Street Name is required' }]}
            placeholder="Street Address"
            size="large"
            isRequired
            highlightInput
          />
        </Col>
        <Col xs={24} md={12}>
          <TextInput
            label="City or Township"
            name="city"
            value={formData?.city}
            onChange={(e: any) => setFormData({ ...formData, city: e.target.value })}
            rules={[{ required: true, message: 'City or Township Name is required' }]}
            placeholder="City or Township Name"
            size="large"
            isRequired
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <DropdownInput
            label="Country"
            placeholder="Country"
            name="countryId"
            value={formData?.countryId}
            rules={[{ required: true, message: 'Country name is required' }]}
            onChange={onChangeDropDown}
            showSearch
            filterOption={(input: any, option: any) => option?.children?.toLowerCase().startsWith(input.toLowerCase())}
            dataList={countryName}
            keyName="countryName"
            size="large"
            isRequired
          />
        </Col>
        <Col xs={24} md={12}>
          <DropdownInput
            name="state"
            label="State/Province/Locality"
            value={formData?.state}
            onChange={(value: any) => setFormData({ ...formData, state: value })}
            dataList={countryToStateConst[selectCountryIsoCode]}
            showSearch
            filterOption={(input: any, option: any) => option?.children?.toLowerCase().startsWith(input.toLowerCase())}
            placeholder="State/Province/Locality"
            rules={[
              {
                required: true,
                message: 'State/Province/Locality is required',
              },
            ]}
            keyName="label"
            size="large"
            isRequired
          />
        </Col>
      </Row>
    </div>
  );
};
