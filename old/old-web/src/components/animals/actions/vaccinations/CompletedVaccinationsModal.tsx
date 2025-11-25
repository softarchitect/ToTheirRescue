/* eslint-disable no-unreachable */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import {
  Modal, Input, Form, message, Row, Col, Button,
  Select,
  Divider,
  Checkbox,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import './CompletedVaccinationsModal.less';
import { apiCall } from 'src/shared/api/apiWrapper';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import DateInput from 'src/shared/components/Inputs/DateInput';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import { getDateByDays } from 'src/utils/common';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import alertConstant from '../../../../shared/constants/alert.json';

const cssPrefix = 'completed-vaccinations-modal';

export interface CompletedVaccinationsModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  vaccinationTypeList: any;
  getHospitalClinicCall: any;
  editRecord: any;
  setAddLoading: any;
  addLoading: any;
  getVaccinationTypeCall: any;
  hospitalClinicList: any;
  handleUpdate: any;
  selectedRadio: any;
  setEditRecord: any;
  animalTypeId: any;
  selectedAnimalIds: any;
}

export const CompletedVaccinationsModal = (props: CompletedVaccinationsModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, vaccinationTypeList, getHospitalClinicCall, editRecord, setEditRecord, animalTypeId,
    setAddLoading, addLoading, getVaccinationTypeCall, hospitalClinicList, handleUpdate, selectedRadio, selectedAnimalIds,
  } = props;
  const [isTagRequired, setIsTagRequired] = useState(false);
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);
  const [intervalTypeRequired, setIntervalTypeRequired] = useState(false);
  const [dueAgainCheckbox, setDueAgainCheckbox] = useState(false);
  const [durationType, setDurationType] = useState<any>([]);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

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

  useEffect(() => {
    setDurationType(durationTypeSingular);
  }, []);

  useEffect(() => {
    if (visible) {
      getHospitalClinicCall(animalTypeId, () => { });
      getVaccinationTypeCall(animalTypeId, () => { });
      form.setFieldsValue({ ...editRecord, actionDate: (selectedRadio === 1) ? dayjs(editRecord?.actionDate) : dayjs() });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
    setAddLoading(false);
    setIsDatePickerEnabled(false);
    form.setFieldValue('actionDate', dayjs());
    form.setFieldValue('specific', dayjs());
    setIsFormTouched(false);
  }, [visible]);

  const cancelModal = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      setVisible(false);
      props.onCancelClicked(false);
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const {
        kindId, vaccineManufacturer, vaccineSerialNo, tagNumber, notes, actionDate, hospitalClinicId,
        administerer, dueAgainNumber = null, dueAgainType = null,
      } = values;
      let dueDate = null;
      let dueAgain: any = null;

      if (dueAgainNumber && dueAgainType) {
        dueDate = getDateByDays(actionDate, (`${dueAgainNumber}-${dueAgainType}`));
        dueAgain = `${dueAgainNumber}-${dueAgainType}`;
      }

      const data = {
        animalIds: selectedAnimalIds,
        animalVaccinationVm: dueAgain ? [{
          kindId,
          vaccineManufacturer,
          vaccineSerialNo,
          tagNumber,
          notes,
          actionDate,
          hospitalClinicId,
          administerer,
          reminder: false,
          dueAgain,
        }, {
          kindId,
          reminder: true,
          dueAgain,
          dueDate: [dueDate],
          notes: '',
        }] : [{
          kindId,
          vaccineManufacturer,
          vaccineSerialNo,
          tagNumber,
          notes,
          actionDate,
          hospitalClinicId,
          administerer,
          reminder: false,
          dueAgain,
        }],
      };

      apiCall('animal-vaccination/add-animal-vaccinations', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.completed_vaccination_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddLoading(false);
          form.resetFields();
          setVisible(false);
        });
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
      form="animal-vaccination-form"
      key="submit"
      htmlType="submit"
      onClick={editRecord ? () => handleUpdate({ form, reminder: false }) : handleSave}
      loading={addLoading}
    >
      {(selectedRadio === 1) ? (editRecord ? 'Update' : 'Save') : 'Save'}
    </Button>,
  ];

  const disabledDate = (value: any) => dayjs(value).isAfter(dayjs()) || dayjs(value).isBefore(dayjs(selectedAnimal?.animalDetails?.[0]?.birthMilestone?.milestoneDate));

  // const getVaccinationType = () => {
  //   if (!selectedAnimal?.animalDetails || selectedAnimal?.animalDetails?.length <= 0) {
  //     return;
  //   }
  //   apiCall(`vaccination-type/get-vaccination-type-by-animalId?animalTypeId=${animalTypeId}`, 'GET', {})
  //     .then((resp: any) => {
  //       if (resp?.data?.success) {
  //         setVaccinationTypeList(resp?.data?.data?.vaccinationTypes);
  //       }
  //     });
  // };

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {(selectedRadio === 1) ? (
        editRecord ? 'Edit Completed Vaccination' : 'Add New Completed Vaccination'
      ) : (
        'Complete Vaccination Reminder'
      )}
    </span>
  );

  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} cardWidth={32} />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <Row>
          <Col md={12} xs={24}>
            <Row>
              <Col xs={24} md={15}>
                <DropdownInput
                  style={{ paddingLeft: '10px' }}
                  label="Kind"
                  name="kindId"
                  rules={[
                    { required: true, message: 'Vaccination kind is required' },
                  ]}
                  disabled={selectedRadio === 2}
                  isRequired
                  placeholder="Kind"
                  dataList={vaccinationTypeList}
                  onChange={(selectedType: any) => {
                    setIsFormTouched(true);
                    let tagRequired = false;
                    vaccinationTypeList?.forEach((data: any) => {
                      if ((selectedType === data?.id) && ['rabies'].includes(data?.kind?.split(' ').join('').toLowerCase())) {
                        tagRequired = true;
                      }
                    });
                    setIsTagRequired(tagRequired);
                  }}
                  keyName="kind"
                  dropdownRender={(menu: any) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <QuickAddForm
                        type="vaccination"
                        visible={visible}
                        setReminderType={null}
                        reminderType="vaccination"
                        selectedAnimal={selectedAnimal}
                        getVaccinationTypeCall={getVaccinationTypeCall}
                        getProcedureTestTreatmentCall={null}
                        getMedicineListCall={null}
                      />
                    </>
                  )}
                />
              </Col>
              <Col xs={24} md={9}>
                <DateInput
                  label="Vaccination Date"
                  name="actionDate"
                  className="hide-label"
                  rules={[
                    { required: true, message: 'Date is required' },
                  ]}
                  onChange={() => setIsFormTouched(true)}
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                  format="M/D/YYYY"
                />
              </Col>
            </Row>
            <DropdownInput
              label="Clinic"
              name="hospitalClinicId"
              rules={[
                { required: true, message: 'Clinic is required' },
              ]}
              onChange={() => setIsFormTouched(true)}
              placeholder="Clinic"
              dataList={hospitalClinicList}
              keyName="lastNameHospital"
              isRequired
              dropdownRender={(menu: any) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <QuickAddForm
                    type="hospital"
                    visible={visible}
                    setReminderType={null}
                    reminderType="hospital"
                    selectedAnimal={selectedAnimal}
                    getHospitalClinicCall={getHospitalClinicCall}
                    getVaccinationTypeCall={getVaccinationTypeCall}
                    getProcedureTestTreatmentCall={null}
                    getMedicineListCall={null}
                  />
                </>
              )}
            />
            <TextInput
              label="Administerer"
              name="administerer"
              rules={[
                { required: false, message: 'An administerer is required' },
              ]}
              placeholder="Administerer"
            />
            <Col span={24} style={{ margin: '0px' }}>
              <Row style={{ paddingLeft: '10px' }}>
                <Col style={{ alignSelf: 'center' }} span={2}>
                  <Form.Item name="dueAgainCheckbox">
                    <Checkbox onClick={() => setDueAgainCheckbox(!dueAgainCheckbox)} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item name="dueAgainNumber" label={(<div>Due Again</div>)}>
                    <Input
                      name="dueAgainNumber"
                      placeholder="Number"
                      type="number"
                      min={0}
                      defaultValue={0}
                      disabled={!dueAgainCheckbox}
                      onChange={(e: any) => {
                        if (e.target.value > 1) {
                          setDurationType(durationTypePlular);
                          setIntervalTypeRequired(true);
                        } else if (e.target.value === '1') {
                          setDurationType(durationTypeSingular);
                          setIntervalTypeRequired(true);
                        } else {
                          setIntervalTypeRequired(false);
                        }
                        setIsFormTouched(true);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={11} style={{ paddingLeft: '10px' }}>
                  {/* <Form.Item>
                    <Select dropdownStyle={{ padding: '0px', margin: '0px', border: '0px solid red !important' }} options={durationType} placeholder="Interval" />
                  </Form.Item> */}
                  <DropdownInput
                    style={{ padding: '0px' }}
                    label="Interval"
                    name="dueAgainType"
                    onChange={() => setIsFormTouched(true)}
                    placeholder="Interval"
                    dataList={durationType}
                    disabled={!intervalTypeRequired}
                    rules={[
                      { required: intervalTypeRequired, message: 'Interval is required' },
                    ]}
                    isRequired={intervalTypeRequired}
                    keyName="label"
                  />
                </Col>
              </Row>
              <TextInput
                label="Vacc. Mfg."
                name="vaccineManufacturer"
                rules={[
                  { message: 'Vacc. mfg. is required' },
                ]}
                placeholder="Vacc. Mfg."
                onChange={() => setIsFormTouched(true)}
              />
            </Col>
          </Col>
          <Col md={12} xs={24}>
            <TextInput
              label="Vacc. Serial No."
              name="vaccineSerialNo"
              rules={[
                { message: 'Serial number is required' },
              ]}
              placeholder="Vacc Serial No."
              onChange={() => setIsFormTouched(true)}
            />
            <TextInput
              label="Tag No."
              name="tagNumber"
              placeholder="Tag No."
              rules={[
                { required: isTagRequired, message: 'Tag number is required' },
              ]}
              isRequired
              disabled={!isTagRequired}
              onChange={() => setIsFormTouched(true)}
            />
            <AreaInput
              key={`area-${visible}`}
              label="Notes"
              name="notes"
              placeholder="Notes"
              form={form}
              rows={5}
              autoSize={{ minRows: 5, maxRows: 4 }}
              onChange={() => setIsFormTouched(true)}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        key={`modal-${visible}`}
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        onCancel={cancelModal}
        size="md"
      />
      <ConfirmModal
        key={`confirm-modal-${confirmModal}`}
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Do you want to save your changes?"
        onConfirmClick={async () => {
          try {
            setConfirmModal(false);
            await form.validateFields();
            editRecord ? handleUpdate({ form }) : handleSave();
          } catch (error) {
            console.log('Validation error:', error);
          }
        }}
        onCustomCancel={() => {
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
          form.resetFields();
          props.setVisible(false);
          props.onCancelClicked(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};

export default CompletedVaccinationsModal;
