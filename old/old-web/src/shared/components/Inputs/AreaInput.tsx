/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  FC, useEffect, useRef, useState,
} from 'react';
import { Input, Tooltip, Form } from 'antd';

const AreaInput: FC<any> = (newProps) => {
  const { TextArea } = Input;
  const {
    isRequired, label, rules, name, disabled, placeholder, form, rows, onChange, highlightInput = false,
  } = newProps;
  const [inputValue, setInputValue] = useState<any>('');
  const value = form?.getFieldValue(`${name}`);
  const inputRef = useRef() as any;

  useEffect(() => {
    setInputValue(value || null);
  }, [value]);

  const handleChange = (event: any) => {
    onChange && onChange();
    setInputValue(event.target.value);
    form?.setFieldValue(`${name}`, event.target.value);
  };

  useEffect(() => {
    highlightInput && inputRef?.current?.focus({});
  }, []);

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
        style={{ padding: '0px 10px' }}
        className="hide-label"
        name={name}
        rules={rules}
        label={label}
      >
        <TextArea
          ref={inputRef}
          placeholder={placeholder}
          rows={rows}
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
        />
        {!isRequired && (
          <div className="area-input-label">
            <span
              style={{
                zIndex: 0, color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 10px', borderRadius: '4px', fontSize: '12px', lineHeight: '0px',
              }}
              className="custom-area-input-label"
            >
              <span style={{ backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '3px 10px' }}>
                {disabled ? 'disabled' : 'optional'}
              </span>
            </span>
          </div>
        )}
      </Form.Item>
    </Tooltip>
  );
};

export default AreaInput;
