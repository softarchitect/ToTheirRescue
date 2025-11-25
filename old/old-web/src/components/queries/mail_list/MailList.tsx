/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */

import { useState, useEffect, FC } from 'react';
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, DatePicker, Tag,
  Dropdown,
  InputNumber,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { apiCall } from 'src/shared/api/apiWrapper';

import './MailList.less';

import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';

const { Title } = Typography;
const cssPrefix = 'mail-list';

const MailList: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterData, setFilterData] = useState<any>({});
  const [value, setValue] = useState(1);

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const queryData = [
    {
      queryType: 'query1',
      id: 'PCOs on the mail list with complete addresses',
    },
    {
      queryType: 'query6',
      id: 'PCOs on the mail list with incomplete addresses',
    },
    {
      queryType: 'query2',
      id: 'PCOs on mail list with email addresses',
    },
    {
      queryType: 'query3',
      id: 'PCOs on mail list without email addresses',
    },
    {
      queryType: 'query4',
      id: 'PCOs not on the mail list',
    },
  ];
  const tableData = [
    {
      lastName: 'Jane',
      firstName: 'Doe',
      street: '287 Gauntlet',
      street2: '',
      city: 'Raceland',
      state: 'KY',
      zip: '41101',
      phone: '123-456-78',
      email: 'test@test.com',
      mailList: 'Yes',
      notes: 'Text Text Text',
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
      title: 'Street',
      dataIndex: 'street',
    },
    {
      title: 'Street 2',
      dataIndex: 'street2',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
    },
    {
      title: 'Zip',
      dataIndex: 'zip',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Mail List',
      dataIndex: 'mailList',
    },
    {
      title: 'notes',
      dataIndex: 'Notes',
    },
  ];

  useEffect(() => {
    console.log(filterData, '-------------||||--');
  }, [filterData]);

  if (!permissions?.query?.mail_list) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }
  const footerContent = [
    <Button key="back">
      Cancel
    </Button>,
    <Button
      form="mailList"
      key="submit"
      type="primary"
      htmlType="submit"
      onClick={() => { setModalVisible(false); setFilterApplied(true); }}
    >
      Search
    </Button>,
  ];

  const modalContent = (
    <>
      <Row gutter={[0, 16]} style={{ marginTop: '15px' }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{ marginLeft: '-10px' }}
        >
          <DropdownInput
            label="Queries"
            name="queries"
            placeholder="Query"
            dataList={queryData}
            value={filterData?.queries}
            onChange={(input: any) => setFilterData({ ...filterData, queries: input })}
            isRequired
            allowClear
            style={{ width: '100%' }} // Ensures the dropdown takes the full width of the column
          />
        </Col>
        <Row justify="center">
          <div style={{
            fontSize: '20px', fontWeight: 150, maxWidth: '900px', textAlign: 'center',
          }}
          >
            <p>
              The below criteria is used to help you target the PCO’s most likely to donate.   You can exclude those that you’ve asked several times before and they’ve not positively responded.
            </p>
          </div>
        </Row>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={13}>
          <Row align="middle">
            <Col span={18}>
              <p>Was added to the database in the last number of years</p>
            </Col>
            <Col span={6}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Col>
          </Row>
        </Col>
        <Col span={13}>
          <Row align="middle">
            <Col span={18}>
              <p>Adopted an animal in the last number of years</p>
            </Col>
            <Col span={6}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Col>
          </Row>
        </Col>
        <Col span={13}>
          <Row align="middle">
            <Col span={18}>
              <p>Made a donation in the last number of years</p>
            </Col>
            <Col span={6}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Col>
          </Row>
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
                  className={true ? 'custom-tab-selected' : 'custom-tab'}
                >
                  <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Search Criteria</span>
                </div>
                <div
                  className={true ? 'custom-tab-selected' : 'custom-tab'}
                >
                  <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">PCO History</span>
                </div>
              </Row>
            </Col>
          </Row>
          <CustomTablePagination
            tableData={tableData}
            isLoading={false}
            delete={() => {}}
            setEditModalOpen={() => { }}
            config={{
              selectable: true,
              isNotEditableBlur: true,
              showHeader: true,
              tableType: 'Mail-List',
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
            Mail List Query
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
                className={true ? 'custom-tab-selected' : 'custom-tab'}
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
        modalTitle={<>Mail List</>}
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

export default connect(mapStateToProps, mapDispatchToProps)(MailList);
