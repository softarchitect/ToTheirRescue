import { FC, useEffect, useState } from 'react';
import { DatePicker, Tooltip, Form } from 'antd';
import { formatDateByCountry } from 'src/utils/common';
import dayjs from 'dayjs';

interface Props {
  milestoneList: any;
  milestoneType: any;
  value?: any;
  onChange?: any;
  format?: any;
  label?: any;
  name?: any;
  itemStyle?: any;
  rules?: any;
  placeholder?: any;
  form?: any;
}

const MilestoneDatePickerCustom: FC<Props> = ({
  // eslint-disable-next-line no-unused-vars
  milestoneList, milestoneType, rules, onChange, label, name, itemStyle, placeholder, form,
}) => {
  const [validDateRange, setValidDateRange] = useState({
    minDate: dayjs(),
    maxDate: dayjs(),
  });

  const countryCode = localStorage.getItem('countryCode');

  useEffect(() => {
    let currentIndex: any = '';
    milestoneList?.forEach((milestone: any, i: any) => {
      if (milestone?.milestoneType?.toLowerCase() === milestoneType?.toLowerCase()) {
        currentIndex = i;
      }
    });

    setValidDateRange({
      minDate: dayjs(milestoneList?.[currentIndex - 1]?.milestoneDate || dayjs('01/01/1990'))?.format('M/D/YYYY') as any,
      maxDate: dayjs(milestoneList?.[currentIndex + 1]?.milestoneDate || dayjs().add(1, 'day'))?.format('M/D/YYYY') as any,
    });
  }, [milestoneType]);

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
        label={label}
        rules={rules}
        key={`${name}-${Date.now()}`}
      >
        <DatePicker
          name={name}
          // value={dayjs(value)}
          onChange={onChange}
          placeholder={placeholder || 'Date'}
          format={formatDateByCountry(countryCode || '')}
          disabledDate={(date) => !dayjs(validDateRange?.maxDate).isAfter(date) || !dayjs(validDateRange?.minDate).isBefore(date)}
          allowClear={false}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Tooltip>
  );
};

export default MilestoneDatePickerCustom;
