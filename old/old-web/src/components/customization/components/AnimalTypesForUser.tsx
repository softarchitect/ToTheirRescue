/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { FC, useEffect, useState } from 'react';
import {
  Space, Card, Checkbox, Button, Row, Input, Col,
} from 'antd';
import { MinusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { AnimalType } from '../Customization.types';
import { apiCall } from '../../../shared/api/apiWrapper';

const cssPrefix = 'ftr-customization';

// eslint-disable-next-line
interface AnimalTypeChecked {
  id: string;
  type: string;
}

const AnimalTypesForUser: FC<any> = (newAnimalProps) => {
  const { permissions } = newAnimalProps;

  const newItem: AnimalType[] = [];
  const [checkedAnimals, setCheckedAnimals] = useState<any>({
    dogs: {
      checked: false,
      data: {
        german: false,
        husky: false,
        wild: false,
        pitbull: false,
      },
    },
    cats: {
      checked: false,
      data: {
        a: false,
        b: false,
        c: false,
        d: false,
      },
    },
    lion: {
      checked: false,
      data: {
        1: false,
        2: false,
        3: false,
        4: false,
      },
    },
  });
  const [checkedAnimalsOthers, setCheckedAnimalsOthers] = useState<Array<object>>([{ type: '' }]);
  const [checkedAnimalsAll, setCheckedAnimalsAll] = useState(() => new Set<string>());
  const [errorMsg, setErrorMsg] = useState('');

  const onClickAddAnimalTypeAll = (key: string) => {
    const tempData = { ...checkedAnimals };
    const tempDataSubCategory = tempData[key].data;
    Object.keys(tempDataSubCategory)?.map((subKey: any) => {
      tempDataSubCategory[subKey] = !tempData[key].checked;
      return '';
    });
    tempData[key].checked = !tempData[key].checked;
    tempData[key].data = tempDataSubCategory;
    setCheckedAnimals(tempData);
  };

  const onClickAddAnimalType = (key: string, subKey: string) => {
    let allChecked = true;
    const tempData = { ...checkedAnimals };
    const tempDataSubCategory = tempData[key].data;
    tempDataSubCategory[subKey] = !tempDataSubCategory[subKey];
    Object.keys(tempDataSubCategory)?.map((tempKey) => {
      allChecked = allChecked && tempDataSubCategory[tempKey];
      return '';
    });
    tempData[key].checked = allChecked;
    tempData[key].data = tempDataSubCategory;
    setCheckedAnimals(tempData);
  };

  const onClickAddAnimalTypeOthers = () => {
    const tempData: Array<object> = [...checkedAnimalsOthers];
    tempData.push({ type: '' });
    setCheckedAnimalsOthers(tempData);
  };

  const onClickRemoveOtherType = (index: number) => {
    const tempData: Array<object> = [...checkedAnimalsOthers];
    tempData.splice(index, 1);
    setCheckedAnimalsOthers(tempData);
  };

  if (!permissions?.customization?.animal_types?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {
        Object.keys(checkedAnimals)?.map((key: string, i) => {
          const subCategory = checkedAnimals?.[key]?.data;
          return (
            <Card
              size="small"
              style={{ marginBottom: '12px' }}
              title={key}
              extra={(
                <Checkbox
                  checked={checkedAnimals[key]?.checked}
                  style={{ margin: '4px' }}
                  onChange={() => onClickAddAnimalTypeAll(key)}
                >
                  Select All
                </Checkbox>
              )}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', padding: '12px' }}>
                {Object.keys(subCategory)?.map((subKey) => <Checkbox checked={subCategory[subKey]} style={{ margin: '4px' }} onChange={() => onClickAddAnimalType(key, subKey)}>{subKey}</Checkbox>)}
              </div>
            </Card>
          );
        })
      }
      <Card size="small" style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '8px' }}>others</div>
        {
          checkedAnimalsOthers?.map((data, index) => (
            <Row>
              <Col span={22}>
                <Input style={{ margin: '0px 0px 8px 0px' }} placeholder="others type" />
              </Col>
              <Col>
                <div role="button" tabIndex={index} onClick={() => onClickRemoveOtherType(index)} style={{ margin: '6px', cursor: 'pointer' }}>
                  <MinusCircleOutlined rev={undefined} style={{ fontSize: '18px' }} />
                </div>
              </Col>
            </Row>
          ))
        }
        <Button
          className={`${cssPrefix}__button`}
          style={{ margin: '0px' }}
          type="dashed"
          onClick={() => onClickAddAnimalTypeOthers()}
          size="small"
        >
          Add More
        </Button>
      </Card>
      <Row justify="end">
        <Button
          className="ftr-button-primary"
        >
          Save
        </Button>
      </Row>
    </>
  );
};

export default AnimalTypesForUser;
