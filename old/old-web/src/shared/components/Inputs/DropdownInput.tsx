/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import { FC, useEffect, useState } from 'react';
import {
  Select, Tooltip, Form,
} from 'antd';
import { isMobile } from 'react-device-detect';
import { pluralToSingular } from '../../../utils/pluralToSingular';

const { Option } = Select;

const DropdownInput: FC<any> = (newProps) => {
  const {
    isRequired, label, rules, name, disabled, dataList, disabledOptionValue, mode, showSearch, filterOption, size,
    noOfAnimal, keyName, initialValue, ref, placeholder, onChange, dropdownRender, value, allowClear, style,
  } = newProps;
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [disabled]);

  return (
    <Tooltip
      title={(
        <p style={{ color: 'black', padding: '0px 10px', margin: '0px' }}>
          {label}
        </p>
      )}
      color="white"
    >
      <div style={{ position: 'relative' }}>
        <Form.Item key={key} initialValue={initialValue} style={style ? { ...style } : { padding: '0px 10px' }} className="hide-label" name={name} rules={rules} label={label}>
          <Select
            size={size || 'medium'}
            disabled={disabled}
            ref={ref}
            placeholder={placeholder}
            onChange={onChange}
            dropdownRender={dropdownRender}
            mode={mode}
            showSearch={showSearch}
            filterOption={filterOption}
            value={value}
            allowClear={allowClear}
          >
            {dataList?.map((data: any) => {
              if (name === 'animalTypeId') {
                return (<Option disabled={data?.disabled} key={data.id} value={data.id}>{(noOfAnimal > 1) ? data?.[keyName] : pluralToSingular(data?.[keyName])}</Option>);
              }
              if (disabledOptionValue) {
                return (<Option disabled={data?.disabled || disabledOptionValue.includes(data?.[keyName]?.split(' ').join('').toLowerCase())} key={data.id} value={data.id}>{data?.[keyName]}</Option>);
              }
              if (name === 'state') {
                return (<Option disabled={data?.disabled} key={data.id} value={data?.[keyName]}>{data?.[keyName]}</Option>);
              }
              return (<Option disabled={data?.disabled} key={data.id} value={data.id}>{data?.[keyName]}</Option>);
            })}
          </Select>
        </Form.Item>
        <div className="dropdown-input-label">
          {(!isRequired || disabled) && (
            <span
              style={{
                zIndex: 0, color: '#848484', backgroundColor: disabled ? '#E9E9E9' : '#f2f2f2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
              }}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {disabled ? 'disabled' : (isMobile ? 'opt.' : 'optional')}
            </span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default DropdownInput;
