/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Button,
} from 'antd';
import { useEffect, useState } from 'react';

import './NotesModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import dayjs from 'dayjs';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'notes-modal';

export interface NotesModalProps {
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

export const NotesModal = (props: NotesModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, addLoading, setAddLoading, editRecord, setEditRecord, handleUpdate,
  } = props;
  const [value, setValue] = useState('');
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...editRecord });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
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
      setAddLoading(true);
      const data = {
        animalId: selectedAnimal?.ids?.[0],
        note: form.getFieldValue('note'),
      };

      apiCall('healthnote/add-healthnote', 'POST', data)
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
      form="animal-health-note-form"
      key="submit"
      htmlType="submit"
      loading={addLoading}
      onSubmit={() => form.submit()}
    >
      Save
    </Button>,
  ];

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {editRecord ? 'Edit ' : 'Add New '}
      Note
    </span>
  );
  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        id="animal-health-note-form"
        form={form}
        onFinish={editRecord ? () => handleUpdate({ form }) : handleSave}
      >
        <br />
        <div>
          <AreaInput
            label="Notes"
            placeholder="Notes"
            name="note"
            rows={5}
            size="large"
            form={form}
            highlightInput
            autoSize={{ minRows: 6, maxRows: 8 }}
            style={{
              resize: 'none', marginTop: '4px',
            }}
            onChange={() => setIsFormTouched(true)}
            rules={[{ required: true, message: 'Notes are required' }]}
            isRequired
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
        modalTitle={modalTitle}
        modalContent={modalContent}
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
          props.setVisible(false);
          props.onCancelClicked(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};

export default NotesModal;
