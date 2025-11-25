/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disbale no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Modal, Form, Select, Upload, Button, DatePicker, InputNumber, UploadFile, UploadProps, Segmented,
  Row, Tabs,
} from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import '../../components/pco/actions/attachments/PcoAttachments.less';
import TyrModal from './Modal/TyrModal';
import PcoDetailCard from './PcoDetailCard';
import AnimalDetailCard from './AnimalDetailCard';
import RescueDetailCard from './RescueDetailCard';

const cssPrefix = 'pco-attachemnts-modal';

export interface AttachmentsModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  onSave: any;
  selectedPcoId: any;
  pcoList: any;
  tyrType: any;
  newPcoProps?: any;
  uploadImageCall?: any;
  selectData?: any;
  pcoId?: any;
  animalId?: any;
  isEdit?: any;
  tenentId?: any;
  selectedAnimal?: any;
  imageView?: any;
  imagethumbView?: any;
}

export const CommonAttachments = (props: AttachmentsModalProps) => {
  const {
    visible, setVisible, tyrType, uploadImageCall, onCancelClicked, selectData, pcoId, animalId, isEdit, tenentId, selectedAnimal, imageView,
  } = props;
  const [imageState, setImageState] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [attachmentId, setAttachmentId] = useState(null);
  const [attachmentRequired, setAttachmentRequired] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageHas, setImageHas] = useState(true);
  const [alignValue, setAlignValue] = useState<any>('center');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectData?.attachmentType === 'Document' || selectData?.attachmentType === 'Video') {
      setAttachmentRequired(false);
    } else {
      setAttachmentRequired(true);
    }
    setAttachmentId(selectData?.id);
    if (selectData?.id > 0) {
      setImageHas(false);
      if (isEdit) {
        setFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: selectData?.originalBlobUrl,
          thumbUrl: selectData?.originalBlobUrl,
        }]);
      } else {
        setFileList([]);
      }
    }
    form.setFieldsValue({
      id: (selectData?.id) ? (selectData?.id) : '',
      attachmentType: (selectData?.attachmentType) ? (selectData?.attachmentType) : '',
      publicityRank: (selectData?.publicityRank) ? (selectData?.publicityRank) : '',
      dateEntered: moment(selectData?.dateEntered),
      notes: (selectData?.notes) ? (selectData?.notes) : '',
      description: (selectData?.description) ? (selectData?.description) : '',
    });
  }, [selectData, isEdit]);

  const cancelModal = () => {
    const isFormTouched = form.isFieldsTouched();
    if (isFormTouched) {
      Modal.confirm({
        title: 'Do you want to save your changes?',
        icon: <ExclamationCircleOutlined rev={undefined} />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          form.resetFields();
          setImageState('');
          setVisible(false);
          onCancelClicked(false);
        },
        onCancel() {
          setImageState('');
          form.resetFields();
          setVisible(false);
          onCancelClicked(false);
        },
      });
    } else {
      setVisible(false);
      onCancelClicked(false);
    }
  };

  const handleModalClose = () => {
    cancelModal();
  };

  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handleUpload = (listFile: any) => {
    setImageState(listFile?.file);
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setUploadImage(true);
    setFileList(newFileList);
  };

  const handleInput = (value: any) => {
    if (value === 'photo') {
      setAttachmentRequired(true);
    } else {
      setAttachmentRequired(false);
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const entityType = tyrType === 'People' ? 'PCO' : tyrType;
      if (imageState?.name || imageView) {
        dispatch(uploadImageCall({
          imageState,
          pcoId: tyrType === 'People' ? pcoId : null,
          animalId: tyrType === 'Animal' ? animalId : null,
          Entity: entityType,
          PublicityRank: values?.publicityRank || 0,
          AttachmentDate: dayjs(),
          AttachmentType: values?.attachmentType || null,
          notes: values?.notes || '',
          description: values?.description || null,
          isEdit,
          attachmentId,
          tenentId,
          uploadImage,
        }, () => {
          form.resetFields();
          setVisible(false);
          onCancelClicked(false);
        }));
      }
    } catch (error) {
      console.log('Validation error -pco', error);
    }
  };
  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-form"
      key="submit"
      htmlType="submit"
      onClick={handleSave}
    >
      {isEdit ? 'Update' : 'Save'}
    </Button>,
  ];

  const uploadButton = (
    <Button
      size="small"
      icon={<UploadOutlined rev={undefined} />}
      style={{ marginTop: '4px' }}
    >
      Upload
    </Button>
  );

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

  const modalTitle = (<span className={`${cssPrefix}__modal__title`}>{isEdit ? 'Edit Photos, Videos, & Documents' : 'Add New Photo, Video, or Document'}</span>);
  const modalContent = (
    <div>
      {tyrType === 'Tenant' ? (
        <RescueDetailCard imageView={imageView} />
      ) : tyrType === 'People' ? (
        <PcoDetailCard imageView={imageView} />
      ) : (
        <AnimalDetailCard imageView={imageView} animalDetails={selectedAnimal?.animalDetails} />
      )}
      {/* <Row justify="center">
        <Segmented
          size="large"
          defaultValue="center"
          style={{ marginBottom: 8, marginTop: '8px', padding: '6px' }}
          onChange={(value: any) => setAlignValue(value)}
          options={['single upload', 'multiple upload']}
        />
      </Row> */}
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        form={form}
      >
        <div className={`${cssPrefix}__container`}>
          <Form.Item
            label="Type"
            name="attachmentType"
            rules={[
              { required: true, message: 'File type is required' },
            ]}
          >
            <Select
              options={typeDropdown.map((data) => ({ label: data.label, value: data.value }))}
              size="small"
              onChange={(value) => {
                handleInput(value);
              }}
              placeholder="Photo"
              style={{ width: '130px', marginTop: '4px' }}
            />
          </Form.Item>

          <Form.Item
            label="Attach a file"
            name="attach"
            rules={[
              { required: imageHas, message: 'Please attach a file' },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={(e) => {
                onChange(e);
                handleUpload(e);
              }}
              beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
            >
              {fileList.length < 5 && uploadButton}
            </Upload>
          </Form.Item>
          <Modal
            open={previewVisible}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Form.Item
            label="Date"
            name="dateEntered"
            rules={[
              { required: true, message: 'Date is required' },
            ]}
          >
            <DatePicker
              format="M/D/YYYY"
              size="small"
              style={{ width: '130px', marginTop: '4px' }}
            />
          </Form.Item>

          <Form.Item
            label="Short description"
            name="description"
            rules={[
              { required: true, message: 'Description is required' },
            ]}
          >
            <TextArea
              rows={5}
              size="small"
              key="description"
              autoSize={{ minRows: 3, maxRows: 4 }}
              style={{
                resize: 'none', marginTop: '4px', width: '250px',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Rank"
            name="publicityRank"
            tooltip="A rank of 1 will be the profile picture"
            rules={[
              { required: attachmentRequired, message: 'Rank is required' },
            ]}
          >
            <InputNumber
              min={1}
              key="publicityRank"
              disabled={!attachmentRequired}
              size="small"
              style={{ width: '80px', marginTop: '4px' }}
            />
          </Form.Item>
          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea
              rows={5}
              size="small"
              autoSize={{ minRows: 3, maxRows: 2 }}
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
    </div>
  );
};
