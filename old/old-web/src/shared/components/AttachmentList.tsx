/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disbale no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Row, Col, Button, Typography, Card, Modal, Image,
} from 'antd';
import ReactPlayer from 'react-player';
import { isMobile, isMobileOnly } from 'react-device-detect';
import Carousel from 'react-multi-carousel';
import {
  DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined, PlayCircleFilled, PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AnimalActionDropdown from 'src/components/animals/components/animalActionsDropdown/animalActionDropdown';
import PcoActionsDropdown from 'src/components/pco/components/pcoActionsDropdown/PcoActionsDropdown';
import PcoDetailCard from './PcoDetailCard';
import AnimalDetailCard from './AnimalDetailCard';
import RescueDetailCard from './RescueDetailCard';
import { CommonAttachments } from './CommonAttachments';
import { uploadImageCall } from '../../redux/common/action';
import 'react-multi-carousel/lib/styles.css';

const { Title } = Typography;
const cssPrefix = 'pco-attachments';

export interface AttachmentsListProps {
  tyrType: any;
  artifacts: any;
  onDeleteAttachment: any;
  pcoId: any;
  animalId: any;
  tenantId: any;
  selectedAnimal: any;
  selectedPco: any;
  uploadImageLoading: any;
  minified?: boolean;
}

export const AttachmentList = (props: AttachmentsListProps) => {
  const {
    tyrType, artifacts, onDeleteAttachment, pcoId, animalId, tenantId, selectedAnimal,
    uploadImageLoading, selectedPco, minified,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [preview, setPreview] = useState(false);
  const [currentImageState, setCurrentImageState] = useState('');
  const [selectData, setSelectData] = useState<any>();
  const [imageView, setImageView] = useState(null);
  const [imagethumbView, setImageThumbView] = useState(null);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1500 },
      items: 4,
    },
    medium: {
      breakpoint: { max: 1500, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  const responsiveMinified = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1500 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1500, min: 1024 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 1024, min: 0 },
      items: 1,
    },
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    setImageView(null);
  };

  const { confirm } = Modal;

  useEffect(() => {
    const filterArtifact = artifacts?.filter((user: any) => user.publicityRank === 1 && user.attachmentType === 'Photo');

    setImageView(filterArtifact?.[0]?.blobUrl);
    setImageThumbView(filterArtifact?.[0]?.thumbnailBlobUrl);
  }, [artifacts]);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = (values: any) => {
    console.log('Saving values:', values);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setSelectData(data);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDownload = (data: any) => {
    if (data?.thumbnailBlobUrl) {
      // Create a download link using an anchor tag
      const downloadLink = document.createElement('a');
      downloadLink.href = data?.thumbnailBlobUrl;
      downloadLink.download = data?.originalFileName; // Set the filename here
      document.body.appendChild(downloadLink);

      // Trigger a click event on the download link to start the download
      downloadLink.click();

      // Cleanup
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(data?.thumbnailBlobUrl);
    }
  };

  const getCardCoverImage = (data: any) => {
    if (data?.attachmentType?.toLowerCase() === 'photo') {
      return (
        <div>
          <img
            key={data?.id}
            alt="pco-image"
            src={data?.thumbnailBlobUrl}
            style={{
              height: '300px', objectFit: 'contain', width: '100%', padding: '0px',
            }}
          />
          <div className="attachment-file-name" style={{ height: '100%' }}>
            <Row justify="center">{data?.originalFileName}</Row>
            {/* <br />
            <br />
            <Row justify="center">
              <Button style={{ border: '0px solid' }} onClick={() => { setCurrentImageState(data?.originalBlobUrl); setPreview(true); }}>
                Preview
                {' '}
                <EyeOutlined rev={undefined} />
              </Button>
            </Row> */}
          </div>
        </div>
      );
    }
    if (data?.attachmentType?.toLowerCase() === 'video') {
      return (
        <Row justify="center" align="middle" style={{ padding: '10px' }}>
          <ReactPlayer height={200} id={data?.id} key={data?.id} url={data?.thumbnailBlobUrl} controls playIcon={<PlayCircleFilled rev={undefined} />} />
          <div className="attachment-file-name">{data?.originalFileName}</div>
        </Row>
      );
    }
    return (
      <Row justify="center">
        <FileTextOutlined key={data?.id} style={{ height: '200px', fontSize: '80px' }} rev={undefined} />
        <div className="attachment-document-file-name">{data?.originalFileName}</div>
      </Row>
    );
  };

  const showConfirmModal = async (record: any) => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: <span>
        Do you want to delete &nbsp;
        {record?.attachmentType}
      </span>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDeleteAttachment(record?.id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }} />
      </div>
      {!minified && (
        <Row align="bottom" justify="space-between" style={{ paddingBottom: '10px' }}>
          <Col xs={24} sm={24} md={8}>
            {tyrType === 'Tenant' ? (
              <RescueDetailCard imageView={imageView} />
            ) : tyrType === 'People' ? (
              <PcoDetailCard imageView={imageView} pcoDetails={selectedPco?.pcoDetail} />
            ) : (
              <AnimalDetailCard isAttachment incomingImageView={imageView} animalDetails={selectedAnimal?.animalDetails} />
            )}
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Row justify="end">
              {(tyrType === 'Animal') && (
                <Col span={10} style={{ paddingRight: '10px' }}>
                  <AnimalActionDropdown />
                </Col>
              )}
              {(tyrType === 'People') && (
                <Col span={10} style={{ paddingRight: '10px' }}>
                  <PcoActionsDropdown />
                </Col>
              )}
              <Button className="ftr-button-dashed" onClick={handleAddClick} icon={<PlusOutlined rev={undefined} />}>
                Add
              </Button>
            </Row>
          </Col>
        </Row>
      )}
      <Row
        justify="center"
        align="middle"
        style={{
          height: isMobile ? 'calc(100vh - 320px)' : (minified ? 'calc(100vh - 350px)' : 'calc(100vh - 280px)'),
          overflowY: 'auto',
          borderRadius: '8px',
          marginLeft: '4px',
          backgroundColor: isMobileOnly ? '#e8e8e8' : '',
        }}
      >
        <Col span={24}>
          <Carousel containerClass="custom-crousel-container" itemClass="custom-crousel-item" infinite={false} key={artifacts?.length} responsive={minified ? responsiveMinified : responsive}>
            {(artifacts || [])?.map((data: any) => (
              <div style={isMobileOnly ? { display: 'flex', justifyContent: 'center' } : { display: 'flex', justifyContent: 'center' }}>
                <div className="custom-card">
                  <div className="custom-card-overlay" />
                  <div className="custom-card-inner">
                    <Card
                      bordered={false}
                      styles={{
                        body: {
                          padding: '0px', cursor: 'pointer', height: 236, width: 300,
                        },
                      }}
                      style={{ height: 300, width: 300, margin: '0px', backgroundColor: 'transparent' }}
                      key={data?.id}
                      actions={[
                        <EditOutlined onClick={() => setEditModalOpen(true, data)} rev={undefined} />,
                        <DeleteOutlined onClick={() => showConfirmModal(data)} rev={undefined} />,
                        <EyeOutlined onClick={() => { setCurrentImageState(data?.originalBlobUrl); setPreview(true); }} rev={undefined} />,
                        <DownloadOutlined onClick={() => handleDownload(data)} rev={undefined} />,
                      ]}
                    >
                      {getCardCoverImage(data)}
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>
      </Row>

      <Modal title="Image Preview" footer={false} open={preview} onCancel={() => setPreview(false)}>
        <Row justify="center">
          <Image
            preview={false}
            src={currentImageState}
            className=""
            style={{
              objectFit: 'contain',
              border: '0px dashed #8F8F8F',
            }}
          />
        </Row>
      </Modal>

      <CommonAttachments
        uploadImageLoading={uploadImageLoading}
        visible={isModalOpen}
        tyrType={tyrType}
        onCancelClicked={handleModalCancel}
        selectedPcoId=""
        pcoList=""
        setVisible={setIsModalOpen}
        onSave={handleSave}
        uploadImageCall={uploadImageCall}
        selectData={selectData}
        pcoId={pcoId}
        animalId={animalId}
        isEdit={isEdit}
        tenantId={tenantId}
        selectedAnimal={selectedAnimal}
        selectedPco={selectedPco}
        imageView={(selectData?.id > 0 && isEdit) ? imageView : ''}
        imagethumbView={(selectData?.id > 0 && isEdit) ? imagethumbView : ''}
      />
    </>
  );
};
