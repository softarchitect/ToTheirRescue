/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  FC, useState, useRef, useEffect,
} from 'react';
import { DatePicker, Tooltip, Form } from 'antd';
import { formatDateByCountry } from 'src/utils/common';

const DateInput: FC<any> = (newProps) => {
  const {
    multiple, label, rules, name, suffixIcon, disabledDate, style = {}, itemStyle = {}, highlightInput = false, ref, onChange, placeholder = '',
  } = newProps;
  let inputRef = useRef() as any;

  const countryCode = localStorage.getItem('countryCode');

  const calendarIcon = (
    <span className="ant-picker-suffix">
      <span role="img" aria-label="calendar" className="anticon anticon-calendar">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="calendar" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" />
        </svg>
      </span>
    </span>
  );

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
      key={`${name}-${Date.now()}`}
    >
      <Form.Item
        style={{ padding: '0px 10px', ...itemStyle }}
        className="hide-label"
        name={name}
        rules={rules}
        label={label}
        key={`${name}-input-date-feild`}
      >
        <DatePicker
          multiple={multiple}
          placeholder={placeholder || formatDateByCountry(countryCode || '')}
          format={formatDateByCountry(countryCode || '')}
          style={{ ...style }}
          disabledDate={disabledDate}
          suffixIcon={suffixIcon || calendarIcon}
          onChange={onChange}
          clearIcon={false}
        />
      </Form.Item>
    </Tooltip>
  );
};

export default DateInput;
