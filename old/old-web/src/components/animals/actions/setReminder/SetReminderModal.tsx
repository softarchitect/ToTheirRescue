/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import {
  Form, message, Button, Row, Col, DatePicker, InputNumber, Input, Select, Popover, Divider,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import TextInput from 'src/shared/components/Inputs/TextInput';
import './SetReminderModal.less';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import alertConstant from 'src/shared/constants/alert.json';
import { CloseCircleFilled } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatDateByCountry, getDateByDays } from 'src/utils/common';

const cssPrefix = 'set-reminder-modal';

export interface SetReminderModalProps {
  visible: boolean
  setVisible: any
  onCancelClicked: any
  onSave: any
  getVaccinationTypeCall: any
  getProcedureTestTreatmentCall: any
  getMedicineListCall: any
  animalList: any
  selectedAnimal: any
  vaccinationTypeList: any
  procedureList: any
  medicineList: any
}

const durationTypeSingular = [
  {
    id: 'day',
    label: 'Day',
  },
  {
    id: 'week',
    label: 'Week',
  },
  {
    id: 'month',
    label: 'Month',
  },
  {
    id: 'Year',
    label: 'Year',
  },
];

const durationTypePlular = [
  {
    id: 'day',
    label: 'Days',
  },
  {
    id: 'week',
    label: 'Weeks',
  },
  {
    id: 'month',
    label: 'Months',
  },
  {
    id: 'year',
    label: 'Years',
  },
];

export const SetReminderModal = (props: SetReminderModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, onCancelClicked, vaccinationTypeList, procedureList,
    getVaccinationTypeCall, getProcedureTestTreatmentCall, getMedicineListCall, medicineList,
  } = props;
  const [updatedKey, setUpdatedKey] = useState(Date.now());
  const [reminderType, setReminderType] = useState<any>(null);
  const [customError, setCustomError] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedDayOption, setSelectedDayOption] = useState(null);
  const [intervalNumber, setIntervalNumber] = useState(null);
  const [addOtherLoading, setAddOtherLoading] = useState(false);
  const [intervalTypeRequired, setIntervalTypeRequired] = useState(false);
  const [durationTypeList, setDurationTypeList] = useState<any>([]);
  const [durationType, setDurationType] = useState<any>([]);
  const [addLoading, setAddLoading] = useState(false);
  const popupReminderSaveRef = useRef('popup-reminder-save-ref');

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setDurationType(durationTypeSingular);
  }, []);

  useEffect(() => {
    if (!visible) {
      setAddOtherLoading(false);
    }
    if (visible) {
      getVaccinationTypeCall(selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
      getProcedureTestTreatmentCall(selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
      getMedicineListCall({}, () => { });
      setReminderType(null);
    }
    form.setFieldsValue('reminderType');
  }, [visible]);

  const cancelModal = () => {
    setVisible(false);
    onCancelClicked(false);
  };

  const durationTypeListSingular = [
    {
      id: 'day',
      value: 'day',
      label: 'Day',
    },
    {
      id: 'week',
      value: 'week',
      label: 'Week',
    },
    {
      id: 'month',
      value: 'month',
      label: 'Month',
    },
    {
      id: 'year',
      value: 'Year',
      label: 'Year',
    },
  ];

  const durationTypeListPlural = [
    {
      id: 'day',
      value: 'day',
      label: 'Days',
    },
    {
      id: 'week',
      value: 'week',
      label: 'Weeks',
    },
    {
      id: 'month',
      value: 'month',
      label: 'Months',
    },
    {
      id: 'year',
      value: 'Year',
      label: 'Years',
    },
  ];

  const onClickReminderType = (type: any) => {
    setReminderType(type);
    form.setFieldsValue({
      reminderType: type,
    });
  };

  useEffect(() => {
    setCustomError(false);
  }, [reminderType]);

  useEffect(() => {
    setDurationTypeList(durationTypeListSingular);
  }, []);

  const handleSaveVaccinationReminder = async (values: any) => {
    try {
      setAddLoading(true);
      const data = {
        animalIds: selectedAnimal?.ids,
        animalVaccinationVm: [{
          ...values,
          reminder: true,
        }],
      };

      apiCall('animal-vaccination/add-animal-vaccinations', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: (values?.dueDate?.length > 1) ? alertConstant.reminder_success_plural : alertConstant.reminder_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          cancelModal();
          setAddLoading(false);
          form.resetFields();
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const handleSaveProcedureReminder = async (values: any) => {
    try {
      setAddLoading(true);
      const data = {
        animalIds: selectedAnimal?.ids,
        animalProcedureVm: {
          ...values,
          reminder: true,
        },
      };
      apiCall('animal-procedure/add-animal-procedures', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: (values?.dueDate?.length > 1) ? alertConstant.reminder_success_plural : alertConstant.reminder_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          cancelModal();
          setAddLoading(false);
          form.resetFields();
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const handleSaveMedsReminder = async (values: any) => {
    try {
      setAddLoading(true);
      const data = {
        animalIds: selectedAnimal?.ids,
        medVms: [{
          ...values,
          reminder: true,
        }],
      };

      apiCall('med/add-meds', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: (values?.dueDate?.length > 1) ? alertConstant.reminder_success_plural : alertConstant.reminder_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          cancelModal();
          setAddLoading(false);
          form.resetFields();
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!reminderType) {
        setErrorPopupOpen(true);
        setTimeout(() => {
          setErrorPopupOpen(false);
        }, 2000);
        setCustomError(true);
        return;
      }
      await form.validateFields();
      const value = form.getFieldsValue();
      let dueDate = value?.reminderDate;
      if (intervalNumber && selectedDayOption) {
        dueDate = [getDateByDays(dayjs(), `${intervalNumber}-${selectedDayOption}`)];
      }
      if (reminderType === 1) {
        handleSaveVaccinationReminder({ kindId: value?.vaccinationKindId, dueDate, notes: value?.notes });
      } else if (reminderType === 2) {
        handleSaveProcedureReminder({ kindId: value?.procedureKindId, dueDate, notes: value?.notes });
      } else if (reminderType === 3) {
        handleSaveMedsReminder({
          medicineId: value?.medicineId, dosage: value?.dosage, dueDate, notes: value?.notes,
        });
      }
      // cancelModal();
      // message.success('Reminder set successfully');
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const footerContent = [
    <Button key="set-reminder-back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Popover
      ref={popupReminderSaveRef as any}
      content={(
        <div>
          <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
          Correct highlighted fields
        </div>
      )}
      open={errorPopupOpen}
    >
      <Button
        className="ftr-button-primary"
        form="set-reminder"
        htmlType="submit"
        loading={addLoading}
        onSubmit={() => {
          if (!reminderType) {
            setErrorPopupOpen(true);
            setTimeout(() => {
              setErrorPopupOpen(false);
            }, 2000);
            setCustomError(true);
          }
          form.submit();
        }}
      >
        Save
      </Button>
    </Popover>,
  ];

  const modalTitle = <span className={`${cssPrefix}__modal__title`}>Set New Reminders</span>;

  const getReminderFormByType = (type: any) => {
    switch (type) {
      case 1:
        return (
          <Col xs={24} sm={16}>
            <DropdownInput
              label="Vaccination Type"
              name="vaccinationKindId"
              placeholder="Vaccination"
              dataList={vaccinationTypeList}
              keyName="kind"
              rules={[{ required: true, message: 'Vaccination type is required' }]}
              isRequired
              dropdownRender={(menu: any) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <QuickAddForm
                    type="vaccination"
                    visible={visible}
                    setReminderType={setReminderType}
                    reminderType={reminderType}
                    selectedAnimal={selectedAnimal}
                    getVaccinationTypeCall={getVaccinationTypeCall}
                    getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
                    getMedicineListCall={getMedicineListCall}
                  />
                </>
              )}
            />
          </Col>
        );
      case 2:
        return (
          <Col xs={24} sm={16}>
            <DropdownInput
              label="Procedure, Test, or Treatment"
              name="procedureKindId"
              placeholder="Procedure, Test, or Treatment"
              dataList={procedureList}
              keyName="kind"
              rules={[{ required: true, message: 'Procedure is required' }]}
              isRequired
              dropdownRender={(menu: any) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <QuickAddForm
                    type="procedure"
                    visible={visible}
                    setReminderType={setReminderType}
                    reminderType={reminderType}
                    selectedAnimal={selectedAnimal}
                    getVaccinationTypeCall={getVaccinationTypeCall}
                    getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
                    getMedicineListCall={getMedicineListCall}
                  />
                </>
              )}
            />
          </Col>
        );
      case 3:
        return (
          <>
            <Col xs={24} sm={13}>
              <DropdownInput
                label="Medicine"
                name="medicineId"
                placeholder="Medicine"
                dataList={medicineList}
                keyName="medicineName"
                rules={[{ required: true, message: 'Medicine is required' }]}
                isRequired
                dropdownRender={(menu: any) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <QuickAddForm
                      type="med"
                      visible={visible}
                      setReminderType={setReminderType}
                      reminderType={reminderType}
                      selectedAnimal={selectedAnimal}
                      getVaccinationTypeCall={getVaccinationTypeCall}
                      getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
                      getMedicineListCall={getMedicineListCall}
                    />
                  </>
                )}
              />
            </Col>
            <Col xs={24} sm={11}>
              <TextInput
                placeholder="Dosage"
                label="Dosage"
                name="dosage"
                rules={[{ required: true, message: 'Dosage is required' }]}
                isRequired
              />
            </Col>
          </>
        );
      case 4:
        return (
          <Col xs={24} sm={24}>
            <TextInput
              label="Recheck"
              placeholder="Recheck What"
              name="recheck"
              rules={[{ required: true, message: 'Recheck is required' }]}
              isRequired
            />
          </Col>
        );
      case 5:
        return (
          <Col xs={24} sm={24}>
            <TextInput
              label="About what"
              placeholder="About what"
              name="updateVet"
              rules={[{ required: true, message: 'Update Vet is required' }]}
              isRequired
            />
          </Col>
        );
      default:
        return (
          <span />
        );
    }
  };

  const disabledDate = (value: any) => dayjs(value).isBefore(dayjs());

  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        id="set-reminder"
        onFieldsChange={() => {
          setUpdatedKey(Date.now());
        }}
        form={form}
        onFinish={handleSave}
      >
        <Row justify="center">
          <Col span={20}>
            <Row justify="center" style={{ padding: '0px 0px', border: customError ? '1px solid red' : '' }}>
              <Col xs={8} sm={7}>
                <div
                  className={(reminderType === 1) ? 'custom-tab-selected' : 'custom-tab'}
                  onClick={() => onClickReminderType(1)}
                >
                  <span className="radio-label">Vaccination</span>
                </div>
              </Col>
              <Col xs={9} sm={12}>
                <div
                  className={(reminderType === 2) ? 'custom-tab-selected' : 'custom-tab'}
                  onClick={() => onClickReminderType(2)}
                >
                  <span className="radio-label">Procedure, Test, or Treatment</span>
                </div>
              </Col>
              <Col xs={7} sm={5}>
                <div
                  className={(reminderType === 3) ? 'custom-tab-selected' : 'custom-tab'}
                  onClick={() => onClickReminderType(3)}
                >
                  <span className="radio-label">Meds</span>
                </div>
              </Col>
              {/* <Col xs={7} sm={4}>
            <div
              className={(reminderType === 4) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => onClickReminderType(4)}
            >
              <span className="radio-label">Recheck</span>
            </div>
          </Col>
          <Col xs={9} sm={6}>
            <div
              className={(reminderType === 5) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => onClickReminderType(5)}
            >
              <span className="radio-label">Update Vet</span>
            </div>
          </Col> */}
            </Row>
            <Form.Item
              label="Reminder Type"
              className="hide-label"
              rules={[
                {
                  validator(_, value) {
                    if (value) {
                      setCustomError(false);
                      return Promise.resolve();
                    }
                    setCustomError(true);
                    return Promise.reject(new Error('Reminder interval is required'));
                  },
                },
              ]}
              name="reminderType"
            >
              <Input id={`date-${updatedKey}`} name="reminderType" style={{ display: 'none' }} />
            </Form.Item>
          </Col>
        </Row>
        <br />
        {/* <Row>
          <Col md={14} xs={24}>
            <Row>
              <Col xs={24} md={14}>
                <Checkbox>
                  Vaccination
                </Checkbox>
              </Col>
              <Col style={{ marginLeft: '130px', width: '200px', marginTop: '-25px' }}>
                <DropdownInput
                  label="Kind"
                  name="kind"
                  placeholder="Kind"
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={14}>
                <Checkbox>
                  Procedure
                </Checkbox>
              </Col>
              <Col style={{ marginLeft: '130px', width: '200px', marginTop: '-25px' }}>
                <DropdownInput
                  label="Kind"
                  name="kind"
                  placeholder="Kind"
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={14}>
                <Checkbox>
                  Recheck
                </Checkbox>
              </Col>
              <Col style={{ marginLeft: '130px', width: '200px', marginTop: '-25px' }}>
                <DropdownInput
                  label="Recheck"
                  name="reCheck"
                  placeholder="What"
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={14}>
                <Checkbox>
                  Update the vet
                </Checkbox>
              </Col>
              <Col style={{ marginLeft: '130px', width: '200px', marginTop: '-25px' }}>
                <DropdownInput
                  label="Update the vet"
                  name="updateTheVet"
                  placeholder="What"
                  isRequired
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={14}>
                <Checkbox>
                  Meds
                </Checkbox>
              </Col>
              <Col style={{ marginLeft: '130px', width: '200px', marginTop: '-25px' }}>
                <TextInput
                  label="Meds"
                  name="Meds"
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DatePicker
                  multiple
                />
              </Col>
            </Row>
            <Col style={{ marginTop: '20px', marginLeft: '20px' }}>
              Or In:
            </Col>
            <Row style={{ marginTop: '15px' }}>
              <Col sm={4}>
                <InputNumber
                  min={1}
                  max={100}
                />
              </Col>

              <Col style={{ marginLeft: '35px' }}>
                <DropdownInput
                  label="Days"
                  name="days"
                  placeholder="Days"
                  isRequired
                />
              </Col>
            </Row>
          </Col>
        </Row> */}
        <Row style={{ padding: isMobile ? '0px' : '0px 10px' }} justify="start">
          {getReminderFormByType(reminderType)}
        </Row>
        <Row align="top" style={{ padding: isMobile ? '0px' : '0px 20px' }}>
          <Col xs={10} sm={12} style={{ padding: '0px' }}>
            <Form.Item
              id={`date-${updatedKey}-${intervalNumber}`}
              label="Date"
              className="hide-label"
              rules={[{ required: !(intervalNumber || selectedDayOption), message: 'Reminder Date is required' }]}
              name="reminderDate"
            >
              <DatePicker
                id={`date-${updatedKey}-${intervalNumber}`}
                name="reminderDate"
                format={formatDateByCountry(localStorage.getItem('countryCode') || '')}
                placeholder={isMobile ? '' : 'Reminder Date'}
                disabledDate={disabledDate}
                multiple
                onChange={() => {
                  setSelectedDayOption(null);
                  setIntervalNumber(null);
                  form.setFieldsValue({ interval: null });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={1} sm={3} style={{ marginTop: '5px' }}>
            <Row justify="center">
              OR
              {!isMobile && ' in'}
            </Row>
          </Col>
          {(reminderType === 1) ? (
            <Col xs={13} sm={9}>
              <Row>
                <Col span={8}>
                  <Form.Item name="dueAgainNumber">
                    <Input
                      name="dueAgainNumber"
                      placeholder="Number"
                      type="number"
                      min={0}
                      defaultValue={0}
                      onChange={(e: any) => {
                        setIntervalNumber(e.target.value);
                        if (e.target.value > 1) {
                          setDurationType(durationTypePlular);
                          setIntervalTypeRequired(true);
                        } else if (e.target.value === '1') {
                          setDurationType(durationTypeSingular);
                          setIntervalTypeRequired(true);
                        } else {
                          setIntervalTypeRequired(false);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={16} style={{ paddingLeft: '10px' }}>
                  {/* <Form.Item>
                <Select dropdownStyle={{ padding: '0px', margin: '0px', border: '0px solid red !important' }} options={durationType} placeholder="Interval" />
              </Form.Item> */}
                  <DropdownInput
                    style={{ padding: '0px' }}
                    label="Interval"
                    name="dueAgainType"
                    placeholder="Interval"
                    dataList={durationType}
                    disabled={!intervalTypeRequired}
                    rules={[
                      { required: intervalTypeRequired, message: 'Interval is required' },
                    ]}
                    onChange={(value: any) => {
                      setSelectedDayOption(value);
                    }}
                    isRequired={intervalTypeRequired}
                    keyName="label"
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col xs={13} sm={9}>
              <Form.Item
                id={`date-interval-${updatedKey}-${selectedDayOption}`}
                label="Date"
                className="hide-label"
                // rules={[{ required: !form.getFieldValue('intervalNumber'), message: 'Reminder Interval is required' }]}
                rules={[
                  ({ getFieldValue }: any) => ({
                    validator(_: any, value: any) {
                      const reminderDate = getFieldValue('reminderDate');
                      if (value) {
                        return Promise.resolve();
                      }
                      if (reminderDate) {
                        return Promise.resolve();
                      }
                      if (intervalNumber && selectedDayOption) {
                        return Promise.resolve();
                      }
                      if (!intervalNumber && !reminderDate) {
                        return Promise.reject(new Error('Reminder interval is required'));
                      }
                      return Promise.reject(new Error('Reminder interval is required'));
                    },
                  }),
                ]}
                name="interval"
              >
                <Row align="top" justify="space-between">
                  <Col xs={10} sm={9}>
                    <InputNumber
                      id={`date-interval-number-${updatedKey}`}
                      style={{ width: '100%', padding: '0px' }}
                      onChange={(value: any) => {
                        form.setFieldsValue({ reminderDate: null });
                        setUpdatedKey(Date.now());
                        setIntervalNumber(value);
                        if (value > 1) {
                          setDurationTypeList(durationTypeListPlural);
                        } else {
                          setDurationTypeList(durationTypeListSingular);
                        }
                      }}
                      onAbortCapture={(value: any) => setIntervalNumber(value)}
                      value={intervalNumber}
                      name="intervalNumber"
                      placeholder="0"
                      defaultValue={0}
                      min={0}
                      max={100}
                    />
                  </Col>
                  <Col xs={14} sm={14}>
                    <Select
                      id={`date-interval-days-${updatedKey}`}
                      style={{ width: '100%' }}
                      // name="days"
                      // rules={[{ required: form.getFieldValue('intervalNumber'), message: 'Days is required' }]}
                      options={durationTypeList}
                      onChange={(value: any) => {
                        form.setFieldsValue({ reminderDate: null, interval: null });
                        setUpdatedKey(Date.now());
                        setSelectedDayOption(value);
                      }}
                      placeholder="Days"
                      value={selectedDayOption}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row style={{ padding: '0px 10px' }}>
          <Col span={24}>
            <AreaInput
              form={form}
              name="notes"
              label="Reminder Notes"
              placeholder="Reminder Notes"
              rows={4}
            />
          </Col>
        </Row>
      </Form>
      {/* <DisclaimerCardModal /> */}
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        key={form.getFieldsValue()}
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalTitle={modalTitle}
        modalContent={modalContent}
        size="sm"
      />
    </div>
  );
};

export default SetReminderModal;
