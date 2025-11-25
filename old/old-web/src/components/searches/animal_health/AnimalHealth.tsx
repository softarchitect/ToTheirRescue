/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, Tag,
  Alert,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import './AnimalHealth.less';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import { isMobileOnly } from 'react-device-detect';
import { apiCall } from 'src/shared/api/apiWrapper';

const { Title } = Typography;
const cssPrefix = 'animal-health';

const AnimalHealth: FC<any> = ({ permissions, vaccinationTypeList, hospitalClinicList }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [animalTypeList, setAnimalTypeList] = useState([]);
  const [filterData, setFilterData] = useState<any>({});

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const tableData = [
    {
      name: 'Sarah',
      animalType: 'Horse',
      breedSpecies: 'Trotter',
      clinic: 'Clinic Name',
      type: 'Vaccination',
      kind: 'Rabies',
      rabiesTagNo: '1000',
      microchipNo: '1234',
      notes: 'Text Text Text',
    },
    {
      name: 'Viola',
      animalType: 'Dog',
      breedSpecies: 'Husky',
      clinic: 'Clinic Name',
      type: 'Vaccination',
      kind: 'Rabies',
      rabiesTagNo: '1001',
      microchipNo: '1235',
      notes: 'Text Text Text',
    },
  ];

  const columnData = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Animal Type',
      dataIndex: 'animalType',
    },
    {
      title: 'Breed/Species',
      dataIndex: 'breedSpecies',
    },
    {
      title: 'Clinic',
      dataIndex: 'clinic',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
    },
    {
      title: 'Rabies Tag',
      dataIndex: 'rabiesTag',
    },
    {
      title: 'Microchip No.',
      dataIndex: 'microchipNo',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const procedureTypeData = [
    {
      procedureType: 'Vaccinations',
      id: 'vaccination',
    },
    {
      procedureType: 'Procedures, Tests, and Treatments',
      id: 'ptt',
    },
    {
      procedureType: 'Prescriptions',
      id: 'prescription',
    },
    {
      procedureType: 'SOAPs',
      id: 'soaps',
    },
    {
      procedureType: 'Notes',
      id: 'notes',
    },
  ];

  const AnimalTypeData = [
    {
      animalType: 'all',
      id: 'All',
    },
    {
      animalType: 'dog',
      id: 'Dog',
    },
    {
      animalType: 'cat',
      id: 'Cat',
    },
  ];

  const ClinicData = [
    {
      clinicType: 'clinic1',
      id: 'Clinic 1',
    },
    {
      clinicType: 'clinic2',
      id: 'Clinic 2',
    },
    {
      clinicType: 'clinic3',
      id: 'Clinic 3',
    },
  ];

  const getAnimalType = () => {
    apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalTypeList(resp?.data?.data?.animalTypes);
        }
      });
  };

  useEffect(() => {
    getAnimalType();
  }, []);

  if (!permissions?.search?.animal_health) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back" onClick={() => setModalVisible(false)}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-health"
      key="submit"
      htmlType="submit"
      onClick={() => {
        setModalVisible(false);
      }}
    >
      <SearchOutlined rev={undefined} />
      Search
    </Button>,
  ];

  const modalContent = (
    <>
      <Row justify="center" align="middle">
        <Col md={12} xs={24}>
          <DropdownInput
            label="Type"
            name="type"
            placeholder="Type"
            keyName="procedureType"
            dataList={procedureTypeData}
            value={filterData?.type}
            onChange={(input: any) => setFilterData({ ...filterData, type: input })}
          />
        </Col>
        {(filterData?.type !== 'prescription') ? (
          <>
            {(filterData?.type === 'vaccination') && (
              <Col md={12} xs={24}>
                <DropdownInput
                  label="Vaccination Type"
                  name="vaccinationType"
                  placeholder="Vaccination Type"
                  keyName="kind"
                  dataList={vaccinationTypeList}
                  value={filterData?.vaccinationType}
                  onChange={(input: any) => setFilterData({ ...filterData, vaccinationType: input })}
                  allowClear
                />
              </Col>
            )}
            <Col md={12} xs={24}>
              <DropdownInput
                label="Animal Type"
                name="animalType"
                dataList={animalTypeList}
                placeholder="Animal Type"
                keyName="typeName"
                value={filterData?.animalType}
                onChange={(value: any) => setFilterData({ ...filterData, animalType: value })}
                allowClear
              />
            </Col>
            <Col md={12} xs={24}>
              <DropdownInput
                label="Clinic"
                name="clinic"
                placeholder="Clinic"
                keyName="lastNameHospital"
                dataList={hospitalClinicList}
                value={filterData?.clinic}
                onChange={(value: any) => setFilterData({ ...filterData, clinic: value })}
                allowClear
              />
            </Col>
            {['vaccination', 'ptt'].includes(filterData?.type) && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Administerer"
                  name="administerer"
                  placeholder="Administerer"
                  value={filterData?.administerer}
                  onChange={(value: any) => setFilterData({ ...filterData, administerer: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'vaccination') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Serial Number"
                  name="serialNumber"
                  placeholder="Serial Number"
                  value={filterData?.administerer}
                  onChange={(value: any) => setFilterData({ ...filterData, administerer: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'vaccination') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Vaccine Manufacturer"
                  name="vaccineManufacturer"
                  placeholder="Vaccine Manufacturer"
                  value={filterData?.vaccineManufacturer}
                  onChange={(value: any) => setFilterData({ ...filterData, vaccineManufacturer: value })}
                  allowClear
                />
              </Col>
            )}
            {['vaccination', 'ptt'].includes(filterData?.type) && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Rabies Tag No."
                  name="rabiesTagNo"
                  placeholder="Rabies Tag No."
                  value={filterData?.rabiesTagNo}
                  onChange={(value: any) => setFilterData({ ...filterData, rabiesTagNo: value })}
                  allowClear
                />
              </Col>
            )}
            {['SOAPs', 'prescriptions'].includes(filterData?.type) && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Veterinarian"
                  name="veterinarian"
                  placeholder="Veterinarian"
                  value={filterData?.veterinarian}
                  onChange={(value: any) => setFilterData({ ...filterData, veterinarian: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'notes') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Person Entered"
                  name="personEntered"
                  placeholder="Person Entered"
                  value={filterData?.personEntered}
                  onChange={(value: any) => setFilterData({ ...filterData, personEntered: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'ptt') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Microchip No."
                  name="microchipNo"
                  placeholder="Microchip No."
                  value={filterData?.microchipNo}
                  onChange={(value: any) => setFilterData({ ...filterData, microchipNo: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'soaps') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Subjective"
                  name="subjective"
                  placeholder="Subjective"
                  value={filterData?.subjective}
                  onChange={(value: any) => setFilterData({ ...filterData, subjective: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'soaps') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Objective"
                  name="objective"
                  placeholder="Objective"
                  value={filterData?.objective}
                  onChange={(value: any) => setFilterData({ ...filterData, objective: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'soaps') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Assessment"
                  name="assessment"
                  placeholder="Assessment"
                  value={filterData?.assessment}
                  onChange={(value: any) => setFilterData({ ...filterData, assessment: value })}
                  allowClear
                />
              </Col>
            )}
            {(filterData?.type === 'soaps') && (
              <Col md={12} xs={24}>
                <TextInput
                  label="Plan"
                  name="plan"
                  placeholder="Plan"
                  value={filterData?.plan}
                  onChange={(value: any) => setFilterData({ ...filterData, plan: value })}
                  allowClear
                />
              </Col>
            )}
            <Col md={12} xs={24}>
              <TextInput
                label="Notes"
                name="notes"
                placeholder="Notes"
                value={filterData?.notes}
                onChange={(value: any) => setFilterData({ ...filterData, notes: value })}
                allowClear
              />
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Row justify="center" align="middle" style={{ padding: '40px' }}>
              <div>
                Coming Soon !
              </div>
            </Row>
          </Col>
        )}
      </Row>
    </>
  );

  return (
    <>
      {filterApplied ? (
        <>
          <Row align="bottom" justify="space-between" style={{ padding: '10px 0px' }}>
            <Col span={18}>
              {filterApplied && (
                <Row>
                  {Object.keys(filterData)?.map((key: string) => (
                    (filterData?.[key] && (
                      <Tag
                        color="blue"
                        style={{
                          height: '30px', padding: '3px 12px', margin: '0px 0px', borderRadius: '4px', fontSize: 16,
                        }}
                      >
                        {filterData?.[key]}
                      </Tag>
                    ))
                  ))}
                </Row>
              )}
            </Col>
            <Col>
              <Row>
                <div
                  style={{ margin: '0px 10px' }}
                  onClick={() => setModalVisible(true)}
                  className="ftr-button-basic"
                >
                  <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Search Criteria</span>
                </div>
                <div
                  className="ftr-button-basic"
                >
                  <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Copy Selection</span>
                </div>
              </Row>
            </Col>
          </Row>
          <CustomTablePagination
            tableData={tableData}
            isLoading={false}
            delete={() => { }}
            setEditModalOpen={() => { }}
            config={{
              selectable: true,
              isNotEditableBlur: true,
              showHeader: true,
              tableType: 'Animal-Health',
            }}
            totalNumber={4}
            currentPage={currentPageLocal}
            setPaginationData={setCurrentPageLocal}
            columnData={columnData}
          />
          <DisclaimerCard />
        </>
      ) : (
        <>
          <Row justify="center" style={{ fontSize: '22px', fontWeight: 500, padding: isMobileOnly ? '10px' : '' }}>
            Animal Health Search
          </Row>
          <Row justify="center" style={{ padding: '20px 0px ' }}>
            <Col xs={24} md={14}>
              {modalContent}
            </Col>
          </Row>
          {(filterData?.type !== 'prescription') && (
            <Row justify="center" style={{ padding: '20px 0px' }}>
              <Col xs={16} sm={6} md={4} lg={4}>
                <div
                  style={{ margin: '0px 10px', display: 'flex', justifyContent: 'center' }}
                  onClick={() => {
                    setFilterApplied(true);
                  }}
                  className="ftr-button-basic"
                >
                  <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Search</span>
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Animal Health Search</>}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size="sm"
      />
    </>
  );
};

const mapStatetoProps = (state: any) => ({
  permissions: state.auth.permissions,
  vaccinationTypeList: state.common.vaccinationTypeList,
  hospitalClinicList: state.common.hospitalClinicList,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStatetoProps, mapDispatchToProps)(AnimalHealth);
