/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Button,
} from 'antd';
import { useEffect, useState } from 'react';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import dayjs from 'dayjs';

const cssPrefix = 'notes-modal';

export interface DietModalProps {
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

const AnimalDietModal = (props: DietModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedAnimal, addLoading, setAddLoading, editRecord, setEditRecord, handleUpdate,
  } = props;
  const [value, setValue] = useState('');
  const [updatedKey, setUpdatedKey] = useState(Date.now());

  const getDiet = () => {
    if (selectedAnimal?.ids?.length > 1) {
      return;
    }
    apiCall(`animal/get-animal-diet?animalId=${selectedAnimal?.ids?.[0]}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          form.setFieldsValue({ diet: resp?.data?.data?.diet });
        }
      });
  };

  useEffect(() => {
    if (visible) {
      getDiet();
      // form.setFieldsValue({ ...editRecord });
      return;
    }
    setEditRecord && setEditRecord('');
    form.resetFields();
  }, [visible]);

  const cancelModal = () => {
    props.setVisible(false);
    props.onCancelClicked(false);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      setAddLoading(true);
      // const data = {
      //   ids: selectedAnimal?.ids,
      //   diet: form.getFieldValue('diet'),
      // };

      apiCall(`animal/update-animal-diet?ids=${selectedAnimal?.ids}&diet=${form.getFieldValue('diet')}`, 'PUT', {})
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
          cancelModal();
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
      form="animal-diet-form"
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
      {/* {editRecord ? 'Edit ' : 'Add New '} */}
      Diet
    </span>
  );
  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        id="animal-diet-form"
        form={form}
        onFieldsChange={() => {
          setUpdatedKey(Date.now());
        }}
        onFinish={handleSave}
      >
        <br />
        <AreaInput
          label="Diet"
          placeholder="Diet"
          name="diet"
          rows={5}
          size="large"
          form={form}
          highlightInput
          autoSize={{ minRows: 6, maxRows: 8 }}
          style={{
            resize: 'none', marginTop: '4px',
          }}
          rules={[{ required: true, message: 'Diet is required' }]}
          isRequired
        />
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
    </div>
  );
};

export default AnimalDietModal;
