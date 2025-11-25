/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, Tag, Alert,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import './Donations.less';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';

const { Title } = Typography;
const cssPrefix = 'donations';

const Donations: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterData, setFilterData] = useState<any>({});

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const tableData = [
    {
      donationDate: '30/05/2023',
      firstName: 'Jane',
      lastName: 'Doe',
      donationType: 'Electronic',
      notes: 'Text Text Text Text',
    },
    {
      donationDate: '12/20/2022',
      firstName: 'Jane',
      lastName: 'Doe',
      donationType: 'In Kind',
      notes: 'Text Text Text Text',
    },
  ];

  const columnData = [
    {
      title: 'Donation Date',
      dataIndex: 'donationDate',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'Donation Type',
      dataIndex: 'donationType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const donationTypeData = [
    {
      donationType: 'money',
      id: 'Money',
    },
    {
      donationType: 'other',
      id: 'Other',
    },
    {
      donationType: 'all',
      id: 'All',
    },
  ];

  useEffect(() => {
    console.log(filterData, '-------------||||--');
  }, [filterData]);

  if (!permissions?.search?.donation) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back" onClick={() => setModalVisible(false)}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="donations"
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
        <Col md={12} xs={13}>
          <TextInput
            label="First Name"
            name="firstName"
            placeholder="First Name"
            value={filterData?.firstName}
            onChange={(e: any) => setFilterData({ ...filterData, firstName: e.target.value })}
            maxLength={10}
            allowClear
          />
        </Col>
        <Col md={12} xs={13}>
          <TextInput
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            value={filterData?.lastName}
            onChange={(e: any) => setFilterData({ ...filterData, lastName: e.target.value })}
            maxLength={10}
            allowClear
          />
        </Col>
        <Col md={12} xs={13}>
          <DropdownInput
            label="Type"
            name="type"
            placeholder="Type"
            dataList={donationTypeData}
            value={filterData?.type}
            onChange={(input: any) => setFilterData({ ...filterData, gender: input })}
            maxLength={10}
            allowClear
          />
        </Col>
        <Col md={12} xs={13}>
          <TextInput
            label="Notes"
            name="notes"
            placeholder="Notes"
            value={filterData?.notes}
            onChange={(e: any) => setFilterData({ ...filterData, type: e.target.value })}
            maxLength={10}
            allowClear
          />
        </Col>
      </Row>
    </>
  );

  return (
    <>
      {filterApplied ? (
        <>
          <Row align="bottom" justify="space-around" style={{ padding: '10px 0px' }}>
            <Col span={17}>
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
              </Row>
            </Col>
          </Row>
          <CustomTablePagination
            tableData={tableData}
            isLoading={false}
            delete={() => { }}
            setEditModalOpen={() => { }}
            config={{
              selectable: false,
              isNotEditableBlur: true,
              showHeader: true,
              tableType: 'Donations',
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
            Donations Search
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
                <span className="radio-label">Search</span>
              </div>
            </Col>
          </Row>
        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Donations Search</>}
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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Donations);
