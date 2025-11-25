/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Button, Row, Col,
} from 'antd';
import { useEffect, useState } from 'react';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import dayjs from 'dayjs';
import DateInput from 'src/shared/components/Inputs/DateInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';

export interface DiaryAddModalProps {
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

export const DiaryAddModal = (props: DiaryAddModalProps) => {
  const {
    visible, setVisible, selectedAnimal, editRecord, addLoading, setAddLoading, handleUpdate, setEditRecord,
  } = props;
  const [form] = Form.useForm();
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...editRecord, actionDate: dayjs(editRecord?.actionDate) });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
    form.setFieldValue('date', dayjs());
    setFormTouched(false);
  }, [visible]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = {
        animalIds: [0],
        entityType: 'tenant',
        diaryVm: {
          ...values,
        },
      };

      apiCall('diary/add-diary', 'POST', data)
        .then((respAdd: any) => {
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
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const cancelModal = () => {
    if (formTouched) {
      Modal.confirm({
        title: 'Cancel',
        content: 'Do you want to save your changes?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            handleSave();
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
                onChange={() => setFormTouched(true)}
                format="M/D/YYYY"
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
          <AreaInput
            form={form}
            highlightInput
            rules={[
              { required: true, message: 'Diary entry is required' },
            ]}
            isRequired
            label="Notes"
            name="notes"
            placeholder="Diary Entry"
            rows={5}
            autoSize={{ minRows: 6, maxRows: 8 }}
            onChange={() => setFormTouched(true)}
            style={{
              resize: 'none', marginTop: '4px',
            }}
          />
        </div>
      </Form>
    </div>
  );
  return (
    <TyrModal
      modalVisible={visible}
      setModalVisible={setVisible}
      footerContent={footerContent}
      modalContent={modalContent}
      modalTitle={modalTitle}
      onCancel={cancelModal}
      size="small"
    />
  );
};

export default DiaryAddModal;
