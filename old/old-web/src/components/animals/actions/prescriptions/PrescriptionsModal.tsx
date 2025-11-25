/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  Modal, DatePicker, Form, Switch, message, Select, Checkbox, Input, InputNumber, Radio, Button, Row, Col,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './PrescriptionsModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RuleObject } from 'antd/lib/form';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { formatDateByCountry } from 'src/utils/common';
import Icon from '@ant-design/icons/lib/components/Icon';
import { StopFilled, StopOutlined, StopTwoTone } from '@ant-design/icons';

const cssPrefix = 'prescriptions-modal';

export interface PrescriptionsModalProps {
  visible: boolean;
  setVisible: any;
  onSave?: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
}

export const PrescriptionsModal = (props: PrescriptionsModalProps) => {
  const [form] = Form.useForm();
  const { visible, setVisible, selectedAnimal } = props;
  const [otherMedicineEnabled, setOtherMedicineEnabled] = useState(false);
  const [duration, setDuration] = useState<any>('for');
  const [medicineValue, setMedicineValue] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);

  const pillSvg = () => (
    // <svg fontSize="38px" height="0.5em" fill="fill" stroke="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    //   <path d="M112 96c-26.5 0-48 21.5-48 48l0 112 96 0 0-112c0-26.5-21.5-48-48-48zM0 144C0 82.1 50.1 32 112 32s112 50.1 112 112l0 224c0 61.9-50.1 112-112 112S0 429.9 0 368L0 144zM554.9 399.4c-7.1 12.3-23.7 13.1-33.8 3.1L333.5 214.9c-10-10-9.3-26.7 3.1-33.8C360 167.7 387.1 160 416 160c88.4 0 160 71.6 160 160c0 28.9-7.7 56-21.1 79.4zm-59.5 59.5C472 472.3 444.9 480 416 480c-88.4 0-160-71.6-160-160c0-28.9 7.7-56 21.1-79.4c7.1-12.3 23.7-13.1 33.8-3.1L498.5 425.1c10 10 9.3 26.7-3.1 33.8z" />
    // </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      fontSize="38px"
      height="0.6em"
      fill="currentColor"
      // stroke="blue"
      className="w-8 h-8"
      strokeWidth="0px"
    >
      <g>
        <path d="M30.852,19.618l13.219-9.013l-4.864-7.123C37.719,1.302,35.243,0,32.585,0c-1.612,0-3.166,0.479-4.495,1.387c-1.758,1.2-2.945,3.021-3.342,5.126c-0.397,2.105,0.046,4.233,1.247,5.991L30.852,19.618z" />
        <path d="M51.614,21.65L45.2,12.257L31.98,21.27l6.421,9.403c1.488,2.18,3.964,3.482,6.623,3.482c1.612,0,3.166-0.479,4.495-1.387C53.161,30.281,54.101,25.293,51.614,21.65z" />
        <path d="M31.36,34.868c2.864-3.355,2.464-8.415-0.891-11.279c-1.441-1.229-3.282-1.907-5.186-1.907c-2.354,0-4.575,1.02-6.093,2.798l-5.563,6.517L25.289,41.98L31.36,34.868z" />
        <path d="M12.327,32.52l-7.42,8.693c-2.864,3.355-2.464,8.415,0.891,11.279c1.441,1.229,3.283,1.907,5.186,1.907c2.354,0,4.575-1.02,6.093-2.798l6.912-8.098L12.327,32.52z" />
        <path d="M30.703,38.717L18.598,52.899c-0.132,0.155-0.278,0.293-0.418,0.439c0.01,0.001,0.019,0.004,0.029,0.005l11.67,1.39l2.224-15.848L30.703,38.717z" />
        <path d="M41.946,40.056L34.09,39.12l-2.224,15.848l8.189,0.975C40.371,55.981,40.687,56,40.999,56c0,0,0,0,0.001,0c4.05,0,7.465-3.033,7.944-7.055C49.465,44.565,46.326,40.577,41.946,40.056z" />
      </g>
    </svg>
  );

  const countryCode = localStorage.getItem('countryCode');

  const cancelModal = () => {
    const isFormTouched = form.isFieldsTouched();

    if (isFormTouched) {
      Modal.confirm({
        title: 'Cancel',
        content: 'Do you want to save your changes?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await form.validateFields();
            const values = form.getFieldsValue();
            form.resetFields();
            props.setVisible(false);
            message.success('Prescriptions saved successfully');
          } catch (error) {
            console.log('Validation error:', error);
          }
        },
        onCancel: () => {
          form.resetFields();
          props.setVisible(false);
          props.onCancelClicked(false);
        },
      });
    } else {
      props.setVisible(false);
      props.onCancelClicked(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setOtherMedicineEnabled(false);
      setMedicineValue(null);
      setValue('');
      setIsDatePickerEnabled(false);
    }
  }, [visible]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      form.resetFields();
      cancelModal();
      message.success('Prescriptions saved successfully!');
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-prescription-form"
      key="submit"
      onClick={handleSave}
    >
      Save
    </Button>,
  ];
  const handleInputChange = (fieldName: string, value: any) => {
    form.setFieldsValue({ [fieldName]: value });
    form.validateFields([fieldName]);
  };

  const handleMedicineChange = (value: string) => {
    setOtherMedicineEnabled(false);
    setMedicineValue(value);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setOtherMedicineEnabled(e.target.checked);
    if (e.target.checked) {
      setMedicineValue(null);
      form.setFieldsValue({ medicine: null });
    }
  };

  const validateAnimalWeight = (_: any, value: string) => {
    if (!value || /^[0-9]*(\.[0-9]{1,2})?$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Weight is required in number');
  };

  type clinicOption = {
    id: string;
    label: string;
    children?: clinicOption[];
  }

  const clinicDropdown: clinicOption[] = [
    {
      id: 'clinic1',
      label: 'Clinic 1',
    },
    {
      id: 'clinic2',
      label: 'Clinic 2',
    },
  ];

  type prescribingVetOption = {
    id: string;
    label: string;
    children?: prescribingVetOption[];
  }

  const prescribingVetDropdown: prescribingVetOption[] = [
    {
      id: 'vet1',
      label: 'Vet 1',
    },
    {
      id: 'vet2',
      label: 'Vet 2',
    },
  ];

  type medicineOption = {
    id: string;
    label: string;
    children?: medicineOption[];
  }

  const medicineDropdown: medicineOption[] = [
    {
      id: 'medicine1',
      label: 'Medicine 1',
    },
    {
      id: 'medicine2',
      label: 'Medicine 2',
    },
  ];

  type frequencyOption = {
    id: string;
    label: string;
    children?: frequencyOption[];
  }

  const frequencyDropdown: frequencyOption[] = [
    {
      id: 'everyDay',
      label: 'Every Day',
    },
    {
      id: 'everyOtherDay',
      label: 'Every Other Day',
    },
    {
      id: 'onceAWeek',
      label: 'Once A Week',
    },
    {
      id: 'twiceAWeek',
      label: 'Twice A Week',
    },
    {
      id: 'onceAMonth',
      label: 'Once A Month',
    },
  ];

  type durationOption = {
    value: string;
    label: string;
    children?: durationOption[];
  }

  const durationDropdown: durationOption[] = [
    {
      value: 'days',
      label: 'Days',
    },
    {
      value: 'weeks',
      label: 'Weeks',
    },
    {
      value: 'months',
      label: 'Months',
    },
  ];

  type untilOption = {
    value: string;
    label: string;
    children?: untilOption[];
  }

  const untilDropdown: untilOption[] = [
    {
      value: 'until1',
      label: 'Supply exhausted',
    },
    {
      value: 'until2',
      label: 'Directed otherwise',
    },
  ];

  const modalTitle = (<span className={`${cssPrefix}__modal__title`}>Add New Prescription</span>);
  const modalContent = (
    <div>
      <Row>
        <Col xs={24} lg={24}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
      </Row>
      <br />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <Row>
          <Col xs={24} md={12}>
            <DropdownInput
              label="Clinic:"
              name="clinic"
              rules={[
                { required: true, message: 'Clinic is required' },
              ]}
              dataList={clinicDropdown}
              keyName="label"
              placeholder="Clinic"
              isRequired
            />
            <DropdownInput
              label="Prescribing Vet"
              name="prescribingVet"
              // rules={[
              //   { required: true, message: 'Please select the prescribing vet' },
              // ]}
              dataList={prescribingVetDropdown}
              keyName="label"
              placeholder="Prescribing Vet"
            />
            <DropdownInput
              label="Medicine"
              name="medicine"
              rules={[
                {
                  required: !otherMedicineEnabled, // Apply the rule only when the checkbox is not checked
                  message: 'Medicine is required',
                },
              ]}
              dataList={medicineDropdown}
              keyName="label"
              placeholder="Medicine"
              disabled={otherMedicineEnabled}
              value={medicineValue}
              onChange={handleMedicineChange}
              isRequired
            />
            <Form.Item
              name="otherMedicine"
              valuePropName="checked"
              style={{ padding: '0px 10px' }}
            >
              <Row align="middle">
                <Col span={2}>
                  <Checkbox
                    onChange={handleCheckboxChange}
                  />
                </Col>
                <Col span={22}>
                  <Input
                    placeholder="Other Medicine"
                    disabled={!otherMedicineEnabled}
                    onChange={(e: any) => handleInputChange('otherMedicine', e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Item>
            <TextInput
              label="Dosage/concentration"
              name="dosage"
              // rules={[
              //   { required: true, message: 'Dosage amount is required' },
              // ]}
              placeholder="Dosage/Concentration"
            />
            <Row>
              <Col xs={24} md={10}>
                <Form.Item
                  label="Times a day"
                  name="Times"
                  className="hide-label"
                  style={{ padding: '0px 10px' }}
                  rules={[
                    { required: true, message: 'Please choose a number' },
                  ]}
                >
                  <InputNumber
                    placeholder="Times a day"
                    min={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <DropdownInput
                  label="Frequency"
                  name="frequency"
                  rules={[
                    { required: true, message: 'Frequency is reqired' },
                  ]}
                  dataList={frequencyDropdown}
                  keyName="label"
                  placeholder="Frequency"
                  isRequired
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row>
              {/* <Col xs={24} md={9}>
                <Radio.Group
                  onChange={(e: any) => setDuration(e.target.value)}
                  defaultValue="for"
                  optionType="button"
                  buttonStyle="solid"
                  size="middle"
                  style={{ paddingLeft: '10px' }}
                >
                  <Radio.Button style={{ padding: '0px 10px' }} checked value="for">
                    <Row style={{ color: 'white' }}>
                      <Icon color="red" component={pillSvg} rev={undefined} />
                      For
                    </Row>
                  </Radio.Button>
                  <Radio.Button style={{ padding: '0px 10px' }} value="onDays">Until</Radio.Button>
                </Radio.Group>
              </Col> */}
              <Col xs={24} md={11}>
                <Row style={{ padding: '0px 10px' }}>
                  <div
                    className={(selectedRadio === 1) ? 'custom-tab-selected' : 'custom-tab'}
                    style={{ padding: '4px 10px', borderRadius: '6px 0px 0px 6px' }}
                    key="procedure-radio-1"
                    onClick={() => setSelectedRadio(1)}
                  >
                    {/* <StopFilled rev={undefined} style={{ marginRight: '4px' }} /> */}
                    <Icon component={pillSvg} rev={undefined} style={{ marginRight: '6px' }} />
                    <span className="radio-label">For</span>
                  </div>
                  <div
                    className={(selectedRadio === 2) ? 'custom-tab-selected' : 'custom-tab'}
                    style={{ padding: '4px 10px', borderRadius: '0px 6px 6px 0px' }}
                    key="procedure-radio-2"
                    onClick={() => setSelectedRadio(2)}
                  >
                    <StopFilled rev={undefined} style={{ marginRight: '6px' }} />
                    <span className="radio-label">Until</span>
                  </div>
                </Row>
              </Col>
              <Col xs={24} md={13}>
                <div className="">
                  {(selectedRadio === 1) ? (
                    <Row wrap={false}>
                      <Form.Item
                        label="Duration"
                        name="duration"
                        className="hide-label"
                        rules={[
                          { required: true, message: 'Duration is required' },
                        ]}
                        style={{ padding: '0px 10px' }}
                      >
                        <InputNumber
                          min={1}
                          className="hide-control"
                          placeholder="Duration"
                          style={{ margin: '0px' }}
                          addonAfter={(
                            <Select
                              options={durationDropdown}
                              placeholder="Days"
                              style={{ width: '94px' }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Row>
                  ) : (
                    <Row>
                      <Form.Item style={{ padding: '0px 10px', width: '100%' }}>
                        <Select
                          defaultValue="until1"
                          options={untilDropdown}
                          placeholder="Duration"
                        />
                      </Form.Item>
                    </Row>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={24} md={24}>
                <Form.Item
                  label="Beginning on"
                  name="beginning"
                  className="hide-label"
                  style={{ padding: '0px 10px' }}
                  rules={[
                    { required: true, message: 'Beginning date is required' },
                  ]}
                >
                  <DatePicker format={formatDateByCountry(countryCode || '')} placeholder="Beginning on date" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={13} style={{ padding: '0px 10px' }}>
                <Form.Item
                  label="First dose administered"
                  name="administered"
                >
                  <Switch checkedChildren="YES" unCheckedChildren="NO" defaultChecked />
                </Form.Item>
              </Col> */}
            </Row>
            <AreaInput
              form={form}
              label="Special instructions"
              placeholder="Special instructions"
              name="instructions"
              rows={8}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        onCancel={cancelModal}
        size="md"
      />
    </div>
  );
};

export default PrescriptionsModal;
