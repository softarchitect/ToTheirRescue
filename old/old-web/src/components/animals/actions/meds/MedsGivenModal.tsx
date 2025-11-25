/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import {
  Modal, DatePicker, Form, message, Button, Row, Col, Divider,
} from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './MedRemindersModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import alertConstant from 'src/shared/constants/alert.json';
import { PlusOutlined } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';
import DateInput from 'src/shared/components/Inputs/DateInput';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import QuickAddForm from 'src/shared/components/QuickAddForm';

const cssPrefix = 'meds-given-modal';

export interface MedsGivenModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  getMedicineListCall: any;
  medicineList: any;
  addGivenMedsLoading: any;
  setAddGivenMedsLoading: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  selectedAnimalIds: any;
  setAddLoading: any;
  addLoading: any;
  animalTypeId?: any;
  selectedRadio: any;
  getGivenMedsList: any;
}

export const MedsGivenModal = (props: MedsGivenModalProps) => {
  const [form] = Form.useForm();
  const [medicineForm] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, getMedicineListCall, medicineList, addGivenMedsLoading, setAddGivenMedsLoading,
    editRecord, handleUpdate, setEditRecord, getGivenMedsList, selectedAnimalIds, selectedRadio,
  } = props;

  const disabledDate = (value: any) => dayjs(value).isAfter(dayjs()) || dayjs(value).isBefore(dayjs(selectedAnimal?.animalDetails?.[0]?.birthMilestone?.milestoneDate));

  const [otherMedicineEnabled, setOtherMedicineEnabled] = useState(false);
  const [medicineLoading, setMedicineLoading] = useState<boolean>(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [saveMedicineToggle, setSaveMedicineToggle] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...editRecord, administeredDate: (selectedRadio === 1) ? dayjs(editRecord?.administeredDate) : dayjs() });
      getMedicineListCall({}, () => { });
      setOtherMedicineEnabled(false);
      return;
    }
    setSaveMedicineToggle(false);
    setEditRecord && setEditRecord(null);
    form.resetFields();
    form.setFieldValue('administeredDate', dayjs());
    setIsFormTouched(false);
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
      let data = form.getFieldsValue();
      data = {
        animalIds: selectedAnimalIds,
        medVms: [{
          administered: true,
          ...data,
        }],
      };
      setAddGivenMedsLoading(true);
      apiCall('med/add-meds', 'POST', data)
        .then((resp: any) => {
          setAddGivenMedsLoading(false);
          if (resp?.data?.success) {
            setVisible(false);
            getGivenMedsList();
            message.success({
              content: resp?.data?.message || alertConstant?.add_given_meds_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          } else {
            message.error({
              content: resp?.data?.message,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const addMedicineClick = async () => {
    const data = medicineForm?.getFieldsValue();
    setMedicineLoading(true);
    apiCall('medicine/create-medicine', 'POST', data)
      .then((resp: any) => {
        setMedicineLoading(false);
        if (resp?.data?.success) {
          medicineForm.resetFields();
          setSaveMedicineToggle(false);
          getMedicineListCall({}, () => { });
        } else {
          message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-med-given-form"
      key="submit"
      htmlType="submit"
      loading={addGivenMedsLoading}
      onClick={editRecord ? () => handleUpdate({ form }) : handleSave}
    >
      {(selectedRadio === 1) ? (editRecord ? 'Update' : 'Save') : 'Save'}
    </Button>,
  ];

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {(selectedRadio === 1) ? (
        `${editRecord ? 'Edit ' : 'Add New '} Med Given`
      ) : (
        'Complete Meds Reminder'
      )}
    </span>
  );

  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <div className="">
          <Row>
            <Col span={10}>
              <DateInput
                label="Administered Date"
                name="administeredDate"
                className="hide-label"
                rules={[
                  { required: true, message: 'Date is required' },
                ]}
                onChange={() => setIsFormTouched(true)}
                disabledDate={disabledDate}
                style={{ width: '100%' }}
                placeholder="Date Given"
              />
            </Col>
            <Col span={14} style={{ padding: '0px 10px' }}>
              <DropdownInput
                style={{ padding: '0px' }}
                label="Medicine"
                name="medicineId"
                disabled={selectedRadio === 2}
                rules={[
                  {
                    required: !otherMedicineEnabled,
                    message: 'Medicine is required',
                  },
                ]}
                onChange={() => setIsFormTouched(true)}
                dataList={medicineList}
                keyName="medicineName"
                placeholder="Medicine"
                isRequired
                dropdownRender={(menu: any) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <QuickAddForm
                      type="med"
                      visible={visible}
                      setReminderType={() => { }}
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
          </Row>
          <TextInput
            label="Dosage"
            name="dosage"
            rules={[
              { required: true, message: 'Dosage is required' },
            ]}
            placeholder="Dosage"
            onChange={() => setIsFormTouched(true)}
            isRequired
          />
          <TextInput
            label="Person Administering"
            name="administeredBy"
            rules={[
              { required: true, message: 'Administerer name is required' },
            ]}
            placeholder="Person Administering"
            onChange={() => setIsFormTouched(true)}
            isRequired
          />
          <AreaInput
            form={form}
            label="Notes"
            name="notes"
            rows={5}
            autoSize={{ minRows: 5, maxRows: 4 }}
            onChange={() => setIsFormTouched(true)}
            placeholder="Notes"
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
        size=""
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

export default MedsGivenModal;
