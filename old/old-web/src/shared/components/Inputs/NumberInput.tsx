/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  FC, useRef, useEffect,
} from 'react';
import { InputNumber, Tooltip, Form } from 'antd';

const NumberInput: FC<any> = (newProps) => {
  const {
    isRequired, label, rules, name, disabled, itemStyle, ref, highlightInput = false,
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
      <Form.Item style={itemStyle ? { ...itemStyle } : { padding: '0px 10px' }} className="hide-label" name={name} rules={rules} label={label}>
        <InputNumber
          className=""
          ref={inputRef}
          {...newProps}
          suffix={!isRequired && (
            <span
              style={{
                color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 10px', borderRadius: '4px', fontSize: '12px', lineHeight: '20px',
              }}
            >
              {disabled ? 'disabled' : 'optional'}
            </span>
          )}
        />
      </Form.Item>
    </Tooltip>
  );
};

export default NumberInput;
