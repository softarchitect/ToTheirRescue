/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { useState, useEffect, FC } from 'react';
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, DatePicker, Tag, Alert,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { apiCall } from 'src/shared/api/apiWrapper';

import './AnimalHealth.less';

import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';

const { Title } = Typography;
const cssPrefix = 'animal-health';

const AnimalHealth: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterData, setFilterData] = useState<any>({});
  const [value, setValue] = useState(1);

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const { RangePicker } = DatePicker;

  const timeSpanData = [
    {
      timeSpanType: 'lastWeek',
      id: 'Last Week',
    },
    {
      timeSpanType: 'lastMonth',
      id: 'Last Month',
    },
    {
      timeSpanType: 'yearToDate',
      id: 'Year to Date',
    },
    {
      timeSpanType: 'lastYear',
      id: 'Last Year',
    },
    {
      timeSpanType: 'lastTwoYears',
      id: 'Last Two Years',
    },
    {
      timeSpanType: 'lastThreeYears',
      id: 'Last Three Years',
    },
    {
      timeSpanType: 'sinceInception',
      id: 'Since Inception',
    },
  ];

  const kindData = [
    {
      kindType: 'vaccinations',
      id: 'Vaccinations',
    },
    {
      kindType: 'procedures',
      id: 'Procedures',
    },
    {
      kindType: 'prescriptions',
      id: 'Prescriptions',
    },
    {
      kindType: 'soaps',
      id: 'SOAPs',
    },
    {
      kindType: 'diet',
      id: 'Diet',
    },
    {
      kindType: 'notes',
      id: 'Notes',
    },
    {
      kindType: 'all',
      id: 'All',
    },
  ];

  const animalTypeData = [
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
    {
      animalType: 'horse',
      id: 'Horse',
    },
  ];

  const tableData = [
    {
      name: 'Sarah',
      animal: 'Horse',
      breedSpecies: 'Trotter',
      date: '5/25/2020',
      type: 'Vaccination',
      kind: 'Rabies',
      tagNo: '1234',
      microchipNo: '1234',
      notes: 'Text Text Text',
    },
  ];

  const columnData = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Animal',
      dataIndex: 'animal',
    },
    {
      title: 'Breed/Species',
      dataIndex: 'breedSpecies',
    },
    {
      title: 'Date',
      dataIndex: 'date',
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
      title: 'Tag Number',
      dataIndex: 'tagNumber',
    },
    {
      title: 'Microchip Number',
      dataIndex: 'microchipNo',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  useEffect(() => {
    console.log(filterData, '-------------||||--');
  }, [filterData]);

  if (!permissions?.query?.animal_health) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back">
      Cancel
    </Button>,
    <Button
      form="animal-health"
      key="submit"
      type="primary"
      htmlType="submit"
      onClick={() => { setModalVisible(false); setFilterApplied(true); }}
    >
      <SearchOutlined rev={undefined} />
      Search
    </Button>,
  ];

  const modalContent = (
    <>
      <Row justify="center">
        <Col md={12} xs={16}>
          <DropdownInput
            label="Kind"
            name="kind"
            placeholder="Kind"
            dataList={kindData}
            value={filterData?.kind}
            onChange={(input: any) => setFilterData({ ...filterData, kind: input })}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <DropdownInput
            label="Time Span"
            name="timeSpan"
            placeholder="Time Span"
            dataList={timeSpanData}
            value={filterData?.timeSpan}
            onChange={(input: any) => setFilterData({ ...filterData, timeSpan: input })}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <DropdownInput
            label="Animal Type"
            name="animalType"
            placeholder="Animal Type"
            dataList={animalTypeData}
            value={filterData?.animalType}
            onChange={(input: any) => setFilterData({ ...filterData, animalType: input })}
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <RangePicker
            style={{ marginLeft: '10px' }}
          />
        </Col>
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
                          height: '30px', padding: '3px 12px', margin: '0px 8px', borderRadius: '4px', fontSize: 16,
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
              isNotEditable: true,
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
          <Row justify="center" style={{ fontSize: '22px', fontWeight: 500 }}>
            Animal Health Query
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} md={14}>
              {modalContent}
            </Col>
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} sm={6} md={4} lg={4}>
              <div
                style={{ margin: '0px 10px', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                  setFilterApplied(true);
                }}
                className="ftr-button-basic"
              >
                <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                <span className="radio-label">Submit</span>
              </div>
            </Col>
          </Row>
        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Animal Milestone</>}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size="sm"
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalHealth);
