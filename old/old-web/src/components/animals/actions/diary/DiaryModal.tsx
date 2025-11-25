/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, DatePicker, Button, Row, Col,
} from 'antd';
import { useEffect, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';

import './DiaryModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import dayjs from 'dayjs';
import DateInput from 'src/shared/components/Inputs/DateInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'diary-modal';

export interface DiaryModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  editRecord?: any;
  addLoading: any;
  setAddLoading: any;
  handleUpdate: any;
  setEditRecord: any;
}

export const DiaryModal = (props: DiaryModalProps) => {
  const {
    visible, setVisible, selectedAnimal, editRecord, addLoading, setAddLoading, handleUpdate,
    setEditRecord,
  } = props;
  const [form] = Form.useForm();
  const [value, setDiaryList] = useState('');
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const disabledDate = (date: any) => dayjs(date).isBefore(dayjs(selectedAnimal?.animalDetails?.[0]?.birthMilestone?.milestoneDate)) || dayjs(date).isAfter(dayjs());

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...editRecord, actionDate: dayjs(editRecord?.actionDate) });
      return;
    }
    setIsFormTouched(false);
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
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = {
        animalIds: selectedAnimal?.ids,
        entityType: 'animal',
        diaryVm: {
          ...values,
        },
      };

      apiCall('diary/add-diary', 'POST', data)
        .then((respAdd: any) => {
          setConfirmModal(false);
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.diary_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddLoading(false);
          form.resetFields();
          props.setVisible(false);
          props.onCancelClicked(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     await form.validateFields();
  //     const values = form.getFieldsValue();
  //     form.resetFields();
  //     cancelModal();
  //     message.success('Diary saved successfully');
  //   } catch (error) {
  //     console.log('Validation error:', error);
  //   }
  // };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-diary-form"
      key="submit"
      htmlType="submit"
      loading={addLoading}
      onClick={editRecord ? () => handleUpdate({ form }) : handleSave}
    >
      {editRecord ? 'Update' : 'Save'}
    </Button>,
  ];

  const modalTitle = (
    <span>
      {editRecord ? 'Edit ' : 'Add New '}
      Diary Entry
    </span>
  );

  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
        size="middle"
      >
        <div>
          <Row>
            <Col sm={24} md={12}>
              <DateInput
                label="Date"
                name="actionDate"
                className="hide-label"
                rules={[
                  { required: true, message: 'Date is required' },
                ]}
                format="M/D/YYYY"
                disabledDate={disabledDate}
                onChange={() => setIsFormTouched(true)}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
          <AreaInput
            rules={[
              { required: true, message: 'Diary entry is required' },
            ]}
            highlightInput
            isRequired
            label="Notes"
            name="notes"
            placeholder="Diary Entry"
            onChange={() => setIsFormTouched(true)}
            rows={5}
            form={form}
          />
        </div>
      </Form>
    </div>
  );
  return (
    <>
      <TyrModal
        key={`dairy-modal-${visible}`}
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
    </>
  );
};

export default DiaryModal;
