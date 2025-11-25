/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Modal, DatePicker, Form, message, Button, Tooltip,
  Divider,
} from 'antd';
import './ProceduresTestTreatments.less';
import dayjs from 'dayjs';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import DateInput from 'src/shared/components/Inputs/DateInput';
import alertConstant from 'src/shared/constants/alert.json';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'procedures-test-reminder-modal';

export interface ProceduresTestReminderModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  selectedAnimalIds: any;
  animalList: any;
  selectedAnimal: any;
  procedureList: any;
  setAddLoading: any;
  addLoading: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  animalTypeId: any;
  getProcedureTestTreatmentCall: any;
}

export const ProceduresTestReminderModal = (props: ProceduresTestReminderModalProps) => {
  const [form] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const {
    visible, setVisible, selectedAnimal, procedureList, setAddLoading, addLoading, editRecord,
    handleUpdate, getProcedureTestTreatmentCall, setEditRecord, animalTypeId, selectedAnimalIds,
  } = props;

  const disabledDate = (value: any) => dayjs(value).isBefore(dayjs());

  useEffect(() => {
    if (visible && editRecord) {
      getProcedureTestTreatmentCall(animalTypeId, () => { });
      form.setFieldsValue({ ...editRecord, dueDate: dayjs(editRecord?.dueDate) });
      return;
    }
    setIsFormTouched(false);
    setEditRecord && setEditRecord('');
    form.resetFields();
    // form.setFieldValue('date', dayjs());
  }, [visible]);

  const cancelModal = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      props.setVisible(false);
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
        animalProcedureVm: {
          ...values,
          reminder: true,
        },
      };
      apiCall('animal-procedure/add-animal-procedures', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.procedure_reminder_added_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddLoading(false);
          form.resetFields();
          props.onCancelClicked(false);
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
      Procedure, Test, or Treatment Reminder
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
          <DropdownInput
            label="Procedure, Test, or Treatment"
            name="kindId"
            rules={[
              { required: true, message: 'Procedure, test or treatment is required' },
            ]}
            dataList={procedureList}
            keyName="kind"
            placeholder="Procedure, Test or Treatment"
            onChange={() => setIsFormTouched(true)}
            isRequired
            dropdownRender={(menu: any) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <QuickAddForm
                  type="procedure"
                  visible={visible}
                  setReminderType={null}
                  reminderType="procedure"
                  selectedAnimal={selectedAnimal}
                  getHospitalClinicCall={null}
                  getVaccinationTypeCall={null}
                  getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
                  getMedicineListCall={null}
                />
              </>
            )}
          />
          <DateInput
            label="Due Date"
            name="dueDate"
            className="hide-label"
            rules={[
              { required: true, message: 'Date of P,T or T is required' },
            ]}
            onChange={() => setIsFormTouched(true)}
            multiple={!editRecord}
            style={{ width: '100%' }}
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
            editRecord ? handleUpdate({ form, reminder: true }) : handleSave();
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

export default ProceduresTestReminderModal;
