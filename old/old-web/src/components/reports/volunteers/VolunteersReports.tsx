/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
  Statistic,
  Card,
  Popover,
} from 'antd';
import { FC, useEffect, useState } from 'react';

import './VolunteersReports.less';
import { CloseCircleFilled, PrinterFilled } from '@ant-design/icons';
import CustomTablePagination from '../../../shared/components/CustomTablePagination';

const { Title } = Typography;
const cssPrefix = 'volunteers-reports';

const VolunteersReports: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [volunteersList, setVolunteersList] = useState<any>([]);
  const [givenVolunteersListLoading, setGivenVolunteersListLoading] = useState<boolean>(false);

  const activeList = [
    {
      date: '5/30/2023',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '123456',
      email: 'janedoe@test.com',
      status: 'Active',
      preferredAnimals: 'Dogs, Cats',
    },
    {
      date: '6/15/2023',
      firstName: 'John',
      lastName: 'Smith',
      phone: '789012',
      email: 'johnsmith@test.com',
      status: 'Active',
      preferredAnimals: 'Cats',
    },
    {
      date: '6/15/2023',
      firstName: 'John',
      lastName: 'Smith',
      phone: '789012',
      email: 'johnsmith@test.com',
      status: 'Active',
      preferredAnimals: 'Cats',
    },
  ];

  const inactiveList = [
    {
      date: '4/20/2023',
      firstName: 'Emily',
      lastName: 'Johnson',
      phone: '345678',
      email: 'emilyj@test.com',
      status: 'Inactive',
      preferredAnimals: 'N/A',
    },
    {
      date: '3/12/2023',
      firstName: 'Michael',
      lastName: 'Brown',
      phone: '901234',
      email: 'michaelb@test.com',
      status: 'Inactive',
      preferredAnimals: 'Dogs',
    },
  ];

  useEffect(() => {
    // Set the initial volunteers list based on selected radio
    if (selectedRadio === 1) {
      setVolunteersList(activeList);
    } else {
      setVolunteersList(inactiveList);
    }
  }, [selectedRadio]);

  const columnData = [
    {
      title: 'Date',
      dataIndex: 'date',
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
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Preferred Animals',
      dataIndex: 'preferredAnimals',
    },
  ];

  return (
    <>
      <Row align="bottom" justify="space-between" style={{ paddingBottom: '10px' }}>
        <Col span={10}>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Active"
                  value={activeList.length}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Inactive"
                  value={inactiveList.length}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row align="bottom" justify="space-between">
        <Col>
          <Row style={{ padding: '4px 6px' }}>
            <div
              className={selectedRadio === 1 ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(1)}
            >
              <span className="radio-label">Active</span>
            </div>
            <div
              className={selectedRadio === 2 ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(2)}
            >
              <span className="radio-label">Inactive</span>
            </div>
          </Row>
        </Col>
        <Col xs={10} sm={10}>
          <Row justify="end">
            <PrinterFilled
              rev={undefined}
              style={{
                marginRight: '10px',
                fontSize: '28px',
                color: '#204F91',
                cursor: 'pointer',
              }}
            />
          </Row>
        </Col>
      </Row>
      <CustomTablePagination
        tableData={volunteersList}
        isLoading={givenVolunteersListLoading}
        delete={() => {}}
        setEditModalOpen={() => {}}
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'volunteers-reports',
          isCustomHeight: 'calc(100vh - 400px)',
        }}
        totalNumber={volunteersList.length}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

export default connect(mapStateToProps)(VolunteersReports);
