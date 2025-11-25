/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable quote-props */
import {
  useState, FC, useEffect, useRef,
} from 'react';
import { AutoComplete } from 'antd/lib';

const { Option } = AutoComplete;

interface Props {
  label?: string;
  options?: any;
  value?: any;
  searchKey?: string;
  setSearchKey?: any;
  placeholder?: string;
  setSearchKeyFinal?: (value: any) => void;
  onChange?: (value: any) => void;
}

// eslint-disable-next-line no-unused-vars
const Complete: FC<Props> = (newProps) => {
  const {
    options, setSearchKey, setSearchKeyFinal, placeholder, searchKey,
  } = newProps;

  const inputRef = useRef() as any;

  const [key, setKey] = useState(Date.now());
  const [lockSearch, setLockSearch] = useState(false);

  useEffect(() => {
    if (!searchKey && lockSearch) {
      setSearchKey('');
      setSearchKeyFinal && setSearchKeyFinal('');
      setKey(Date.now());
    }
  }, [searchKey]);

  useEffect(() => {
    setKey(Date.now());
  }, []);

  return (
    <div className="custom-search">
      <AutoComplete
        ref={inputRef}
        style={{ width: '100%' }}
        key={key}
        value={searchKey}
        allowClear={{ clearIcon: "clear" }}
        defaultActiveFirstOption
        onChange={(data) => setSearchKey(data)}
        // onSearch={setSearchKeyFinal}
        // clearIcon={lockSearch ? (<div style={{ paddingRight: '60px' }}>Clear</div>) : ""}
        onClear={() => {
          setSearchKey('');
          setSearchKeyFinal && setSearchKeyFinal('');
          setLockSearch(false);
          setKey(Date.now());
        }}
        onSelect={(data: any) => {
          setLockSearch(true);
          setSearchKeyFinal && setSearchKeyFinal(data || '');
          inputRef?.current?.blur();
        }}
        placeholder={placeholder}
      >
        {searchKey && (searchKey !== options[0]) && (
          <Option key={searchKey} value={searchKey}>
            {searchKey}
          </Option>
        )}
        {options?.map((data: any) => (
          <Option key={data} value={data}>
            {data}
          </Option>
        ))}
      </AutoComplete>
    </div>
  );
};

export default Complete;
