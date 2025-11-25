/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Modal, Form, message, Button, Divider, Row, Col,
} from 'antd';
import './MedRemindersModal.less';
import dayjs from 'dayjs';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import DateInput from 'src/shared/components/Inputs/DateInput';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import alertConstant from 'src/shared/constants/alert.json';
import TextInput from 'src/shared/components/Inputs/TextInput';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'procedures-test-reminder-modal';

export interface ProceduresTestReminderModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  medicineList: any;
  selectedAnimal: any;
  setAddLoading: any;
  addLoading: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  getMedicineListCall: any;
  getGivenMedsList: any;
}

export const MedRemindersModal = (props: ProceduresTestReminderModalProps) => {
  const [form] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const {
    visible, setVisible, selectedAnimal, getGivenMedsList, setAddLoading, addLoading, editRecord,
    handleUpdate, setEditRecord, getMedicineListCall, medicineList,
  } = props;

  const disabledDate = (value: any) => dayjs(value).isBefore(dayjs());

  useEffect(() => {
    if (visible && editRecord) {
      form.setFieldsValue({ ...editRecord, dueDate: dayjs(editRecord?.dueDate) });
      return;
    }
    if (visible) {
      getMedicineListCall({}, () => { });
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
    // form.setFieldValue('date', dayjs());
  }, [visible]);

  const cancelModal = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      form.resetFields();
      props.setVisible(false);
      props.onCancelClicked(false);
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = await form.getFieldsValue();
      setAddLoading(true);
      const data = {
        animalIds: selectedAnimal?.ids,
        medVms: [{
          medicineId: values?.medicineId,
          dosage: values?.dosage,
          dueDate: values?.dueDate,
          notes: values?.notes,
          reminder: true,
        }],
      };

      apiCall('med/add-meds', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            getGivenMedsList();
            message.success({
              content: alertConstant.meds_reminder_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          props.setVisible(false);
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
      form="animal-procedure-reminder-form"
      key="submit"
      htmlType="submit"
      loading={addLoading}
      onClick={editRecord ? () => handleUpdate({ form, reminder: true }) : handleSave}
    >
      {editRecord ? 'Update' : 'Save'}
    </Button>,
  ];

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {editRecord ? 'Edit ' : 'Add New '}
      Medicine Reminder
    </span>
  );
  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <div className={`${cssPrefix}__container`}>
          <br />
          <Row>
            <Col xs={24} sm={13}>
              <DropdownInput
                label="Medicine"
                name="medicineId"
                placeholder="Medicine"
                dataList={medicineList}
                keyName="medicineName"
                rules={[{ required: true, message: 'Medicine is required' }]}
                isRequired
                onChange={() => setIsFormTouched(true)}
                dropdownRender={(menu: any) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <QuickAddForm
                      type="med"
                      visible={visible}
                      setReminderType={null}
                      reminderType="meds"
                      selectedAnimal={selectedAnimal}
                      getVaccinationTypeCall={null}
                      getProcedureTestTreatmentCall={null}
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
                onChange={() => setIsFormTouched(true)}
                rules={[{ required: true, message: 'Dosage is required' }]}
                isRequired
              />
            </Col>
          </Row>
          <DateInput
            label="Due Date"
            name="dueDate"
            className="hide-label"
            rules={[
              { required: true, message: 'Date of P,T or T is required' },
            ]}
            multiple={!editRecord}
            style={{ width: '100%' }}
            onChange={() => setIsFormTouched(true)}
            disabledDate={disabledDate}
          />
          <AreaInput
            form={form}
            label="Notes"
            name="notes"
            placeholder="Notes"
            rows={5}
            size="small"
            onChange={() => setIsFormTouched(true)}
            autoSize={{ minRows: 5, maxRows: 4 }}
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
