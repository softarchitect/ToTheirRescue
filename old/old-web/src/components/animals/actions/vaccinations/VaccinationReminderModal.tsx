/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Modal, DatePicker, Form, message, Row, Col, Checkbox, Button,
  Divider,
} from 'antd';
import './VaccinationReminderModal.less';
import { apiCall } from 'src/shared/api/apiWrapper';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import alertConstant from 'src/shared/constants/alert.json';
import DateInput from 'src/shared/components/Inputs/DateInput';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'vaccinations-reminder-modal';

export interface VaccinationReminderModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  vaccinationTypeList: any;
  getVaccinationTypeCall: any;
  setAddLoading: any;
  addLoading: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  selectedAnimalIds: any;
  animalTypeId: any;
}

export const VaccinationReminderModal = (props: VaccinationReminderModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, vaccinationTypeList, setAddLoading, addLoading, handleUpdate,
    editRecord, setEditRecord, onCancelClicked, getVaccinationTypeCall, selectedAnimalIds, animalTypeId,
  } = props;

  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  // const getVaccinationType = () => {
  //   apiCall(`vaccination-type/get-vaccination-type-by-animalId?animalTypeId=${animalTypeId}`, 'GET', {})
  //     .then((resp: any) => {
  //       if (resp?.data?.success) {
  //         setVaccinationTypeList(resp?.data?.data?.vaccinationTypes);
  //       }
  //     });
  // };

  useEffect(() => {
    if (visible) {
      getVaccinationTypeCall(animalTypeId, () => { });
      form.setFieldsValue({ ...editRecord, dueDate: editRecord ? dayjs(editRecord?.dueDate) : null });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
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
      const data = {
        animalIds: selectedAnimalIds,
        animalVaccinationVm: [{
          ...values,
          reminder: true,
        }],
      };

      apiCall('animal-vaccination/add-animal-vaccinations', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.vaccination_reminder_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          onCancelClicked();
          setAddLoading(false);
          form.resetFields();
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
      form="animal-vaccination-reminder-form"
      key="submit"
      htmlType="submit"
      onClick={editRecord ? () => handleUpdate({ form, reminder: true }) : handleSave}
      loading={addLoading}
    >
      {editRecord ? 'Update' : 'Save'}
    </Button>,
  ];

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {editRecord ? 'Edit ' : 'Add New '}
      Vaccination Reminder
    </span>
  );

  const disabledDate = (value: any) => dayjs(value).isBefore(dayjs());

  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
        size="middle"
      >
        <div>
          <br />
          <Row>
            <Col xs={24} sm={14}>
              <DropdownInput
                label="Kind"
                name="kindId"
                rules={[
                  { required: true, message: 'Vaccination kind is required' },
                ]}
                placeholder="Kind"
                dataList={vaccinationTypeList}
                keyName="kind"
                isRequired
                onChange={() => setIsFormTouched(true)}
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
                      animalTypeId={animalTypeId}
                      getVaccinationTypeCall={getVaccinationTypeCall}
                      getProcedureTestTreatmentCall={null}
                      getMedicineListCall={null}
                    />
                  </>
                )}
              />
            </Col>
            <Col flex="1 1">
              <DateInput
                label="Due Date"
                name="dueDate"
                className="hide-label"
                rules={[
                  { required: true, message: 'Date of vaccination is required' },
                ]}
                multiple={!editRecord}
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                onChange={() => setIsFormTouched(true)}
              />
            </Col>
          </Row>
          <AreaInput
            form={form}
            label="Notes"
            name="notes"
            placeholder="Notes"
            rows={5}
            autoSize={{ minRows: 5, maxRows: 4 }}
            onChange={() => setIsFormTouched(true)}
          />
        </div>
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
        size="small"
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

export default VaccinationReminderModal;
