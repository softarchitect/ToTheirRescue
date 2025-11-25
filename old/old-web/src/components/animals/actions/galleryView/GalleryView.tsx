/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Badge, Button, Card, Col, Row, Skeleton,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry } from 'src/utils/common';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { isMobile } from 'react-device-detect';

const GalleryView: FC<any> = ({ permissions, selectedAnimal, role }) => {
  const [animalTypeList, setAnimalTypeList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [residentType, setResidentType] = useState(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState(0);
  const [attachmentList, setAttachmentList] = useState([]);

  const filterOptions = [
    { id: 'current', name: 'Current Residents' },
    { id: 'former', name: 'Former Residents' },
  ];

  const getAnimalType = () => {
    apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalTypeList(resp?.data?.data?.animalTypes);
        }
      });
  };

  const getCardCoverImage = (data: any) => (
    <div>
      <img
        key={data?.id}
        alt="pco-image"
        src={data?.thumbnailBlobUrl}
        style={{
          height: isMobile ? '120px' : '210px', objectFit: 'contain', width: '100%', padding: '0px',
        }}
      />
    </div>
  );

  const getAttachmentList = async () => {
    setGetLoading(true);
    let url = `artifact-attachment/get-gallery/${selectedAnimalType}`;
    if (residentType) {
      url = `${url}?currentResident=${residentType === 'current'}`;
    }
    try {
      apiCall(url, 'GET', {})
        .then((resp: any) => {
          if (resp?.data?.success) {
            setAttachmentList(resp?.data?.data?.gallery);
          }
          setGetLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getAnimalType();
  }, []);

  useEffect(() => {
    getAttachmentList();
  }, [selectedAnimalType, residentType]);

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setIsModalOpen(value);
  };

  if (!permissions?.animals?.actions?.diary) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <Row justify="end" style={{ padding: isMobile ? '10px 0px' : '0px 50px' }}>
        <Col style={{ width: '100%', margin: '4px 0px' }} xs={24} sm={4} md={4}>
          {(selectedAnimalType || residentType) ? (
            <Button onClick={() => { setSelectedAnimalType(0); setResidentType(null); }}>
              Show All
            </Button>
          ) : ''}
        </Col>
        <Col style={{ padding: '0px 4px' }} xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
          <DropdownInput
            style={{ width: '100%', margin: '4px 0px' }}
            defaultValue={filterOptions[0].id}
            dataList={filterOptions}
            value={residentType}
            keyName="name"
            label="Resident Type"
            placeholder="Resident Type"
            onChange={(value: any) => setResidentType(value)}
          />
        </Col>
        <Col style={{ padding: '0px 4px' }} xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
          <DropdownInput
            style={{ width: '100%', margin: '4px 0px' }}
            dataList={animalTypeList}
            value={selectedAnimalType || null}
            keyName="typeName"
            label="Animal Type"
            placeholder="Animal Type"
            onChange={(value: any) => setSelectedAnimalType(value)}
          />
        </Col>
      </Row>
      <Row className="custom-scrollbar" justify="center" style={{ height: 'calc(100vh - 220px)', overflowY: 'scroll' }}>
        {!getLoading && attachmentList?.map((data: any) => (
          <div style={{ margin: '10px' }}>
            {/* <Badge.Ribbon color="rgb(76 124 191)" placement="end" text={data?.animalTypeName}> */}
            <Card
              bodyStyle={{
                padding: isMobile ? '8px' : '20px',
                cursor: 'pointer',
                height: isMobile ? 180 : 290,
                width: isMobile ? 150 : 250,
                border: '1px solid #F1F2FA',
                backgroundColor: '#F1F2FA',
              }}
              style={{ height: isMobile ? 180 : 290, width: isMobile ? 150 : 250, border: '0px solid #F1F2FA' }}
              key={data?.id}
            >
              <div
                style={{
                  display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
                }}
              >
                {getCardCoverImage(data)}
              </div>
              <Row justify="center" style={{ borderRadius: '0px', margin: '0px', backgroundColor: '#586E8C00' }}>
                <span
                  style={{
                    height: '100%',
                    padding: '10px 0px',
                    fontWeight: 500,
                    fontSize: '18px',
                    color: 'rgb(62 97 146)',
                  }}
                >
                  {data?.animalName}
                </span>
              </Row>
            </Card>
            {/* </Badge.Ribbon> */}
          </div>
        ))}
        {!getLoading && (attachmentList?.length < 1) && (
          <Row
            align="middle"
            style={{
              margin: '80px',
              padding: '10px 200px',
              backgroundColor: '#f2f2f2',
              height: '200px',
            }}
          >
            No Animals Found
          </Row>
        )}
        {getLoading && (
          <Row justify="center" style={{ margin: isMobile ? '0px 10px' : '0px 20px' }}>
            {isMobile ? (
              ['', '', '', '', '', '', '', '', '', '', ''].map((data, i) => (
                <Col xs={isMobile ? 12 : 24} sm={24} md={24}>
                  <Skeleton.Avatar
                    key={`loader-${i}`}
                    style={{ margin: isMobile ? '10px' : '20px' }}
                    shape="square"
                    size={isMobile ? 140 : 238}
                  />
                </Col>
              ))
            ) : (
              ['', '', '', '', '', '', '', '', '', '', ''].map((data, i) => (
                <Skeleton.Avatar
                  key={`loader-${i}`}
                  style={{ margin: isMobile ? '10px' : '20px' }}
                  shape="square"
                  size={isMobile ? 140 : 238}
                />
              ))
            )}
          </Row>
        )}
      </Row>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  role: state.auth.permissions,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView);
