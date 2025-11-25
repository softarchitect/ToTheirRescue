/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { useState, useEffect, FC } from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Button, DatePicker, Tag, Form,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { apiCall } from 'src/shared/api/apiWrapper';

import './Donations.less';

import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import dayjs from 'dayjs';
import { formatDateByCountry } from 'src/utils/common';

const cssPrefix = 'donations';

const Donations: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [filterDate, setFilterDate] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterData, setFilterData] = useState<any>({});

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  useEffect(() => {
    form.setFieldValue('donations', 'all');
  }, []);

  const timeSpanData = [
    {
      id: 'lastWeek',
      label: 'Last Week',
    },
    {
      id: 'sinceInception',
      label: 'Since Inception',
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
    },
    {
      id: 'yearToDate',
      label: 'Year to Date',
    },
    {
      id: 'lastYear',
      label: 'Last Year',
    },
    {
      id: 'lastTwoYears',
      label: 'Last Two Years',
    },
    {
      id: 'lastThreeYears',
      label: 'Last Three Years',
    },
    {
      id: 'sinceInception',
      label: 'Since Inception',
    },
  ];

  const donationsData = [
    {
      donationType: 'Money',
      id: 'money',
    },
    {
      donationType: 'Other',
      id: 'other',
    },
    {
      donationType: 'All',
      id: 'all',
    },
  ];

  const topDonorsData = [
    {
      topDonorsType: 'byTotalAmount',
      id: 'By Total Amount',
    },
    {
      topDonorsType: 'byNumberOfDonations',
      id: 'By Number of Donations',
    },
  ];

  const tableData = [
    {
      lastName: 'Goodwin',
      firstName: 'Sally',
      numberOfDonations: '2',
      totalAmount: '$40.00',
      mailList: '',
      note: 'Text Text Text',
    },
  ];

  const columnData = [
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Number of Donations',
      dataIndex: 'numberOfDonations',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
    },
    {
      title: 'Note',
      dataIndex: 'note',
    },
  ];

  const onClickTimeSpan = (currTimeSpan: any) => {
    if (currTimeSpan === 'lastWeek') {
      setFilterDate([dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')]);
    }
    if (currTimeSpan === 'lastMonth') {
      setFilterDate([dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]);
    }
    if (currTimeSpan === 'yearToDate') {
      setFilterDate([dayjs().startOf('year'), dayjs()]);
    }
    if (currTimeSpan === 'lastYear') {
      setFilterDate([dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
    if (currTimeSpan === 'lastTwoYears') {
      setFilterDate([dayjs().subtract(2, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
    if (currTimeSpan === 'lastThreeYears') {
      setFilterDate([dayjs().subtract(3, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
  };

  if (!permissions?.query?.donation) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back" onClick={() => setModalVisible(false)}>
      Cancel
    </Button>,
    <Button
      form="donations"
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
    <Form form={form}>
      <Row justify="center">
        <Col md={12} xs={16}>
          <DropdownInput
            label="Donations"
            name="donations"
            placeholder="Donations"
            initialValue="all"
            keyName="donationType"
            dataList={donationsData}
            value={filterData?.donations}
            onChange={(input: any) => setFilterData({ ...filterData, donations: input })}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <DropdownInput
            label="Time Span"
            name="timeSpan"
            placeholder="Time Span"
            keyName="label"
            dataList={timeSpanData}
            value={filterData?.timeSpan}
            onChange={(input: any) => {
              onClickTimeSpan(input);
              setFilterData({ ...filterData, timeSpan: input });
            }}
            isRequired
            allowClear
          />
        </Col>
        {(filterData?.donations === 'all') && (
          <Col md={12} xs={16}>
            <DropdownInput
              label="Top Donors"
              name="topDonors"
              placeholder="Top Donors"
              dataList={topDonorsData}
              value={filterData?.topDonors}
              onChange={(input: any) => setFilterData({ ...filterData, topDonors: input })}
              allowClear
            />
          </Col>
        )}
        <Col md={12} xs={16}>
          <Form.Item style={{ padding: '0px 10px', width: '100%' }}>
            <RangePicker
              value={filterDate}
              style={{ width: '100%' }}
              format={formatDateByCountry(localStorage.getItem('countryCode') || '')}
              onChange={(data: any) => setFilterDate(data)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
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
            Donations Query
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} md={14} xl={10}>
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
        modalTitle={<>Donations Query</>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Donations);
