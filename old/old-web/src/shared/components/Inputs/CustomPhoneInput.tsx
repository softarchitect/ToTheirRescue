/* eslint-disable no-unused-vars */
import { FC, useState } from 'react';
import {
  Input, Form, Select,
  Tooltip,
} from 'antd';
import NumberFormat from 'react-number-format';

const { Option } = Select;

interface Props {
  size?: any,
  label: string,
  name: string,
  required: boolean,
  placeholder?: string,
  selectIsdCode?: any,
  onChange?: any,
  isRequired?: any,
  disabled?: any,
  // eslint-disable-next-line no-unused-vars
  setPhoneNumber: (data: any) => void,
}

const CustomPhoneInput: FC<Props> = (newProps) => {
  const {
    selectIsdCode, setPhoneNumber, label, name, placeholder, onChange, isRequired, disabled, size,
  } = newProps;
  const [countryCode, setCountryCode] = useState('1');

  const onChangeCountry = (value: any) => {
    setCountryCode(value);
  };

  const onChangeInput = (e: any) => {
    setPhoneNumber(e.target.value);
  };

  const prefixSelector = (
    <Select
      value={countryCode}
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

  return (
    <Tooltip
      title={(
        <p style={{ color: 'black', padding: '0px 10px', margin: '0px' }}>
          {label}
        </p>
      )}
      color="white"
    >
      <Form.Item
        name={[name]}
        label={label}
        className="hide-label"
        style={{ width: '100%', padding: '0px 10px' }}
        rules={[
          {
            required: isRequired,
            message: `${name} is required`,
          },
          {
            pattern: /^[^\n]{6,15}$/,
            message: 'Please enter 6 to 15 digit phone number',
          },
        ]}
      >
        <Input
          style={{ width: '100%' }}
          name={name}
          addonBefore={selectIsdCode ? `+ ${selectIsdCode}` : ''}
          key={name}
          disabled={disabled}
          onChange={onChange || onChangeInput}
          placeholder={placeholder}
          size={size || 'middle'}
          suffix={!isRequired && (
            <span
              style={{
                color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
              }}
              className="custom-input-tag"
            >
              {disabled ? 'disabled' : 'optional'}
            </span>
          )}
        // format={`+${countryCode} (###) ###-####`}
        />
      </Form.Item>
    </Tooltip>
  );
};

export default CustomPhoneInput;
