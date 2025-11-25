/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disbale no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import {
  Modal, Form, Select, Upload, Button, DatePicker, InputNumber, Input, UploadFile, UploadProps, Segmented,
  Row, Tabs, Col, Tooltip,
  Popover,
} from 'antd';
import {
  InfoCircleOutlined, CloseCircleFilled,
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { formatDateByCountry } from 'src/utils/common';
import '../../components/pco/actions/attachments/PcoAttachments.less';
import TyrModal from './Modal/TyrModal';
import PcoDetailCard from './PcoDetailCard';
import AnimalDetailCard from './AnimalDetailCard';
import RescueDetailCard from './RescueDetailCard';
import AttachementFileUpload from './Inputs/FIleUpload';
import CustomUpload from './Inputs/CustomUploadImage';
import CustomUploadDocument from './Inputs/CustomUploadDocument';
import AreaInput from './Inputs/AreaInput';
import DropdownInput from './Inputs/DropdownInput';
import ConfirmModal from './ConfirmModal';

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
  tenantId?: any;
  selectedAnimal?: any;
  selectedPco?: any;
  imageView?: any;
  imagethumbView?: any;
  uploadImageLoading?: any;
}

export const CommonAttachments = (props: AttachmentsModalProps) => {
  const {
    visible, setVisible, tyrType, uploadImageCall, onCancelClicked, selectData, pcoId, animalId, isEdit, tenantId, selectedAnimal, imageView,
    uploadImageLoading, selectedPco,
  } = props;
  const [imageState, setImageState] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [attachmentId, setAttachmentId] = useState(null);
  const [attachmentRankRequired, setAttachmentRankRequired] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [attachmentType, setAttachmentType] = useState('');
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [popupOne, setPopupOne] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const popupRef: any = useRef('common-attachment');
  const countryCode = localStorage.getItem('countryCode');

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const file = newFileList[0]?.originFileObj;
    if (!file?.name) {
      return;
    }
    if (file?.name?.length > 34) {
      console.log(file, '------------+++++++ ---------', file?.name?.length);
      setPopupOne(true);
      setTimeout(() => {
        setPopupOne(false);
      }, 2000);
      return;
    }
    console.log(file?.name?.length, '------------+++++++', file?.name, '---------');
    setIsFormTouched(true);
    setFileList(newFileList);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFileList([]);
    setAttachmentType('');
    form.resetFields();
  }, [visible]);

  useEffect(() => {
    if (selectData?.attachmentType === 'Document' || selectData?.attachmentType === 'Video') {
      setAttachmentRankRequired(false);
    } else {
      setAttachmentRankRequired(true);
    }
    if (isEdit) {
      setAttachmentId(selectData?.id);
      form.setFieldsValue({
        id: (selectData?.id) ? (selectData?.id) : '',
        attachmentType: (selectData?.attachmentType) ? (selectData?.attachmentType) : '',
        publicityRank: (selectData?.publicityRank) ? (selectData?.publicityRank) : '',
        attachmentDate: dayjs(selectData?.attachmentDate),
        notes: (selectData?.notes) ? (selectData?.notes) : '',
        description: (selectData?.description) ? (selectData?.description) : '',
      });
    } else {
      form.setFieldValue('attachmentDate', dayjs());
    }
  }, [selectData, isEdit]);

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

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handleUpload = (listFile: any) => {
    setImageState(listFile?.file);
  };

  const handleInput = (value: any) => {
    setAttachmentType(value);

    if (value === 'photo') {
      setAttachmentRankRequired(true);
    } else {
      setAttachmentRankRequired(false);
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const entityType = tyrType === 'People' ? 'PCO' : tyrType;
      const file = fileList[0]?.originFileObj;

      const uploadData = isEdit ? {
        imageState: file,
        pcoId: tyrType === 'People' ? pcoId : null,
        animalId: tyrType === 'Animal' ? animalId : 0,
        entity: entityType,
        publicityRank: values?.publicityRank || 0,
        attachmentDate: form.getFieldValue('attachmentDate'),
        attachmentType: values?.attachmentType || '',
        notes: values?.notes || '',
        description: values?.description || '',
        isEdit,
        attachmentId,
        tenantId,
        uploadImage: true,
      } : {
        imageState: file,
        pcoId: tyrType === 'People' ? pcoId : null,
        animalId: tyrType === 'Animal' ? animalId : 0,
        entity: entityType,
        publicityRank: values?.publicityRank || 0,
        attachmentDate: form.getFieldValue('attachmentDate') || dayjs(),
        attachmentType: values?.attachmentType || '',
        notes: values?.notes || '',
        description: values?.description || '',
        isEdit,
        attachmentId,
        tenantId,
        uploadImage: true,
      };
      console.log(uploadData, '-----------');

      dispatch(uploadImageCall(uploadData, () => {
        form.resetFields();
        setVisible(false);
        onCancelClicked(false);
      }));
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
      form="animal-attachment-form"
      key="submit"
      htmlType="submit"
      onClick={handleSave}
      loading={uploadImageLoading}
    >
      {isEdit ? 'Update' : 'Save'}
    </Button>,
  ];

  // const uploadButton = (
  //   <Button
  //     size="middle"
  //     icon={<UploadOutlined rev={undefined} />}
  //   >
  //     {false ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
  //   </Button>
  // );

  type typeOption = {
    value: string;
    label: string;
    disabled?: boolean;
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
        <PcoDetailCard imageView={imageView} pcoDetails={selectedPco?.pcoDetail} />
      ) : (
        <AnimalDetailCard imageView={imageView} animalDetails={selectedAnimal?.animalDetails} />
      )}
      <Form
        form={form}
        size="large"
        style={{ padding: isMobile ? '20px 0px' : '20px 0px 0px 0px' }}
      >
        <Row justify="space-between">
          <Col xs={24} sm={9}>
            <DropdownInput
              name="attachmentType"
              rules={[
                { required: true, message: 'File type is required' },
              ]}
              style={{ marginBottom: '20px', padding: '0px 10px' }}
              defaultValue="Select Type"
              labelInValue
              dataList={typeDropdown.map((data) => ({ label: data.label, id: data.value, disabled: data?.disabled }))}
              onChange={(value: any) => {
                handleInput(value);
                setIsFormTouched(true);
              }}
              disabled={isEdit}
              keyName="label"
              label="Select Type"
              placeholder="Select Type"
              isRequired
            />
          </Col>
          <Col xs={13} sm={8}>
            <Form.Item
              name="attachmentDate"
              // rules={[
              //   { required: true, message: 'Date is required' },
              // ]}
              style={{ marginBottom: '20px', padding: isMobileOnly ? '0px 10px' : '0px 0px' }}
            >
              <DatePicker
                size="middle"
                format={formatDateByCountry(countryCode || '')}
                onChange={() => setIsFormTouched(true)}
                suffixIcon={(
                  <span
                    style={{
                      color: '#848484', backgroundColor: '#F2F2F2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
                    }}
                  // className="custom-input-tag"
                  >
                    optional
                  </span>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={11} sm={7}>
            <Form.Item
              label=""
              name="publicityRank"
              tooltip="A rank of 1 will be the profile picture"
              rules={[
                { required: attachmentRankRequired, message: 'Rank is required' },
              ]}
              style={{ marginBottom: '0px', padding: '0px 10px' }}
            >
              <Input
                type="number"
                placeholder="Rank"
                min={1}
                size="middle"
                key="publicityRank"
                onChange={() => setIsFormTouched(true)}
                disabled={!attachmentRankRequired}
                suffix={(
                  <Tooltip title="A rank of 1 will be the profile picture">
                    <InfoCircleOutlined rev={undefined} style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                ) as any}
              />
            </Form.Item>
          </Col>
        </Row>
        {!isEdit && attachmentType && (
          <Col style={{ padding: '0px 10px' }}>
            <Popover
              ref={popupRef}
              content={(
                <div>
                  <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                  Please short filename length less than 30 character
                </div>
              )}
              open={popupOne}
            >
              <Form.Item
                name="attach"
                style={{ marginBottom: '20px', backgroundColor: '#F2F2F2', padding: '8px 10px' }}
              >
                {(attachmentType === 'photo') ? (
                  <CustomUpload
                    onChange={onChange as any}
                    fileList={fileList}
                    handlePreview={handlePreview}
                  />
                ) : (
                  <CustomUploadDocument
                    onChange={onChange as any}
                    fileList={fileList}
                  />
                )}
              </Form.Item>
            </Popover>
          </Col>
        )}
        <AreaInput
          form={form}
          label="Enter Attachment Short Description"
          name="description"
          rules={[
            { required: (attachmentType === 'document'), message: 'Description is required' },
          ]}
          onChange={() => setIsFormTouched(true)}
          placeholder="Short description"
          rows={3}
          key="description"
          isRequired={(attachmentType === 'document')}
        />
        <AreaInput
          form={form}
          label="Enter Attachment Notes"
          name="notes"
          onChange={() => setIsFormTouched(true)}
          style={{ padding: '0px 10px' }}
          placeholder="Notes"
          rows={3}
        />
      </Form>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
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
          setImageState('');
          form.resetFields();
          setVisible(false);
          onCancelClicked(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};
