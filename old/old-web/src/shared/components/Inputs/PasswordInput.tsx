/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  FC, useState, useRef, useEffect,
} from 'react';
import { Input, Tooltip, Form } from 'antd';

const TextInput: FC<any> = (newProps) => {
  const {
    isRequired, label, rules, name, disabled, itemStyle = {}, highlightInput = false, ref, value, suffix,
  } = newProps;
  let inputRef = useRef() as any;
  if (ref) {
    inputRef = ref;
  }

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
        style={{ padding: '0px 10px', ...itemStyle }}
        className="hide-label"
        name={name}
        rules={rules}
        label={label}
        key={`${name}-${Date.now()}`}
      >
        {suffix ? (
          <Input.Password
            {...newProps}
            ref={inputRef}
            suffix={suffix}
          />
        ) : (
          <Input.Password
            {...newProps}
            ref={inputRef}
            suffix={!isRequired && (
              <span
                style={{
                  color: disabled ? '#A2A2A2' : '#848484', backgroundColor: disabled ? '#E2E2E2' : '#F2F2F2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
                }}
                className="custom-input-tag"
              >
                {disabled ? 'disabled' : 'optional'}
              </span>
            )}
          />
        )}
      </Form.Item>
    </Tooltip>
  );
};

export default TextInput;
