/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Select, Upload, Button, DatePicker, InputNumber, Segmented,
} from 'antd';

import './AttachmentsModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useDispatch } from 'react-redux';
import DateInput from 'src/shared/components/Inputs/DateInput';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import dayjs from 'dayjs';

const cssPrefix = 'attachments-modal';

export interface AttachmentsModalProps {
  visible: boolean;
  editable: boolean;
  setVisible: any;
  onCancelClicked: any;
  onSave: any;
  selectedAnimal: any;
  animalArtifact: any;
  uploadImageCall?: any;
  animalId: any;
}

export const AttachmentsModal = (props: AttachmentsModalProps) => {
  const {
    visible, setVisible, uploadImageCall, animalId, editable, animalArtifact, selectedAnimal,
  } = props;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [alignValue, setAlignValue] = useState<any>('center');
  const [imageState, setImageState] = useState<any>();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const cancelModal = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      props.setVisible(false);
      props.onCancelClicked(false);
    }
  };

  const handleModalClose = () => {
    cancelModal();
  };

  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleUpload = (listFile: any) => {
    setIsFormTouched(true);
    setImageState(listFile?.file);
    // setFileList(listFile);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (imageState) {
        dispatch(uploadImageCall({
          imageState,
          animalId: [animalId],
          entity: 'Animal',
          publicityRank: values?.rank,
          attachmentDate: dayjs(),
          attachmentType: values?.type,
          notes: values?.notes,
          description: values?.description,
        }, () => {
          setPreviewVisible(false);
        }));
      }
      form.resetFields();
      cancelModal();
    } catch (error) {
      console.log('Validation error', error);
    }
  };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-attachment-form"
      key="submit"
      htmlType="submit"
      onClick={handleSave}
    >
      Save
    </Button>,
  ];

  type typeOption = {
    value: string;
    label: string;
    children?: typeOption[];
  }

  const typeDropdown: typeOption[] = [
    {
      value: 'photo',
      label: 'Photo',
    },
    {
      value: 'document',
      label: 'Document',
    },
    {
      value: 'video',
      label: 'Video',
    },
  ];

  const modalTitle = (<span className={`${cssPrefix}__modal__title`}>{`${editable ? 'Edit' : 'Add New'} Photos, Videos, and Documents`}</span>);
  const modalContent = (
    <div>
      <AnimalDetailCard animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
      >
        <div className={`${cssPrefix}__container`}>
          <Form.Item
            label="Type"
            name="type"
            rules={[
              { required: true, message: 'File type is required' },
            ]}
          >
            <Select
              onChange={() => setIsFormTouched(true)}
              options={typeDropdown}
              size="small"
              placeholder="Photo"
              style={{ width: '130px', marginTop: '4px' }}
            />
          </Form.Item>

          <Form.Item
            label="Attach a file"
            name="attach"
            rules={[
              { required: true, message: 'Please attach a file' },
            ]}
          >
            <Upload
              listType="picture-card"
              // fileList={fileList}
              onPreview={handlePreview}
              onChange={handleUpload}
              beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
            >
              <Button
                size="small"
                icon={<UploadOutlined rev={undefined} />}
                style={{ marginTop: '4px' }}
              >
                Upload
              </Button>
            </Upload>
          </Form.Item>

          <DateInput
            label="Date"
            name="date"
            onChange={() => setIsFormTouched(true)}
            rules={[
              { required: true, message: 'Date is required' },
            ]}
            size="small"
            style={{ width: '130px', marginTop: '4px' }}
          />

          <Form.Item
            label="Short description"
            name="description"
          >
            <TextArea
              rows={5}
              size="small"
              autoSize={{ minRows: 3, maxRows: 4 }}
              onChange={() => setIsFormTouched(true)}
              style={{
                resize: 'none', marginTop: '4px', width: '250px',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Rank"
            name="rank"
            tooltip="A rank of 1 will be the profile picture"
            rules={[
              { required: true, message: 'Rank is required' },
            ]}
          >
            <InputNumber
              min={1}
              size="small"
              style={{ width: '80px', marginTop: '4px' }}
              onChange={() => setIsFormTouched(true)}
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea
              rows={5}
              size="small"
              onChange={() => setIsFormTouched(true)}
              value={animalArtifact?.notes}
              autoSize={{ minRows: 5, maxRows: 4 }}
              style={{
                resize: 'none', marginTop: '4px', width: '250px',
              }}
            />
          </Form.Item>
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
        onCancel={handleModalClose}
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
            handleSave();
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
export default AttachmentsModal;
