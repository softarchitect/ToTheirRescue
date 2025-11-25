/* eslint-disable no-unused-vars */
import {
  Modal, Input, DatePicker, Form, message, Select, Button, Row, Col,
  Divider,
} from 'antd';
import { useEffect, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';

import './SoapsModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import dayjs from 'dayjs';
import { formatDateByCountry } from 'src/utils/common';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import Cookies from 'universal-cookie';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import QuickAddForm from 'src/shared/components/QuickAddForm';

const cssPrefix = 'soaps-modal';

export interface SoapsModalProps {
  visible: boolean;
  setVisible: any;
  onSave: any;
  handleUpdate: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  hospitalClinicList: any;
  getHospitalClinicCall: any;
  addLoading: any;
  setAddLoading: any;
  editRecord: any;
  setEditRecord: any;
}

export const SoapsModal = (props: SoapsModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, hospitalClinicList, getHospitalClinicCall,
    addLoading, setAddLoading, editRecord, setEditRecord, handleUpdate,
  } = props;
  const [value, setValue] = useState('');
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const cookies = new Cookies();
  const { firstName, lastName } = cookies.get('loginDetails')?.loginDetails;
  const countryCode = localStorage.getItem('countryCode');

  useEffect(() => {
    if (visible) {
      setIsFormTouched(false);
      getHospitalClinicCall(null, () => { });
      form.setFieldsValue({ ...editRecord, actionDate: dayjs(editRecord?.actionDate) });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
    form.setFieldValue('date', dayjs());
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
      const data = form.getFieldsValue();
      setAddLoading(true);
      const soapData = {
        animalIds: selectedAnimal?.ids,
        soapVm: { ...data, veterinarian: `${firstName || ''} ${lastName || ''}` },
      };
      apiCall('soap/add-soap', 'POST', soapData)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message,
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
      return;
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
      form="animal-soaps-form"
      key="submit"
      htmlType="submit"
      onClick={editRecord ? () => handleUpdate({ form }) : handleSave}
      loading={addLoading}
    >
      {editRecord ? 'Update' : 'Save'}
    </Button>,
  ];

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {editRecord ? 'Update ' : 'Add New '}
      SOAP
    </span>
  );

  const modalContent = (
    <div>
      <AnimalDetailCard animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <br />
        <Row>
          <Col xs={24} md={12}>
            <Form.Item
              label="Date"
              name="actionDate"
              className="hide-label"
              style={{ padding: '0px 10px' }}
              rules={[
                { required: true, message: 'Date is required' },
              ]}
            >
              <DatePicker onChange={() => setIsFormTouched(true)} format={formatDateByCountry(countryCode || '')} style={{ width: '100%' }} />
            </Form.Item>
            <DropdownInput
              label="Clinic"
              name="hospitalClinicId"
              className="hide-label"
              rules={[
                { required: true, message: 'Clinic is required' },
              ]}
              isRequired
              dataList={hospitalClinicList}
              keyName="lastNameHospital"
              placeholder="Clinic"
              onChange={() => setIsFormTouched(true)}
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
                    getVaccinationTypeCall={null}
                    getProcedureTestTreatmentCall={null}
                    getMedicineListCall={null}
                  />
                </>
              )}
            />
            <AreaInput
              form={form}
              label="Subjective"
              name="subjective"
              placeholder="Subjective"
              rows={2}
              rules={[{
                required: true, message: 'Subjective is required',
              }]}
              onChange={() => setIsFormTouched(true)}
              isRequired
            />
            <AreaInput
              form={form}
              label="Objective"
              placeholder="Objective"
              name="objective"
              rows={2}
              rules={[{
                required: true, message: 'Objective is required',
              }]}
              onChange={() => setIsFormTouched(true)}
              isRequired
            />
          </Col>
          <Col xs={24} md={12}>
            <AreaInput
              form={form}
              label="Assessment"
              name="assessment"
              placeholder="Assessment"
              rows={3}
              rules={[{
                required: true, message: 'Assessment is required',
              }]}
              onChange={() => setIsFormTouched(true)}
              isRequired
            />
            <AreaInput
              form={form}
              label="Plan"
              name="soapPlan"
              placeholder="Plan"
              rows={5}
              rules={[{
                required: true, message: 'Plan is required',
              }]}
              onChange={() => setIsFormTouched(true)}
              isRequired
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
        size="sm"
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

export default SoapsModal;
