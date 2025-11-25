/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
  Card,
  Statistic,
} from 'antd';
import { FC, useState } from 'react';

import './CurrentFosters.less';

import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import CustomTablePagination from '../../../shared/components/CustomTablePagination';

const { Title } = Typography;
const cssPrefix = 'current-fosters';

const CurrentFosters: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);

  const tableData = [
    {
      name: 'Casper',
      animalType: 'Dog',
      breed: 'Golden Retriever',
      fosterersName: 'Jardine Family Dent...',
      fosterBeginDate: '12/10/2019',
      email: 'test@test.com',
      phone: '+10020342131',
    },
    {
      name: 'Casper',
      animalType: 'Dog',
      breed: 'Golden Retriever',
      fosterersName: 'Jardine Family Dent...',
      fosterBeginDate: '12/10/2019',
      email: 'test@test.com',
      phone: '+10020342131',
    },
    {
      name: 'Casper',
      animalType: 'Dog',
      breed: 'Golden Retriever',
      fosterersName: 'Jardine Family Dent...',
      fosterBeginDate: '12/10/2019',
      email: 'test@test.com',
      phone: '+10020342131',
    },
    {
      name: 'Casper',
      animalType: 'Dog',
      breed: 'Golden Retriever',
      fosterersName: 'Jardine Family Dent...',
      fosterBeginDate: '12/10/2019',
      email: 'test@test.com',
      phone: '+10020342131',
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
      title: 'Breed',
      dataIndex: 'breed',
    },
    {
      title: 'Fosterers Name',
      dataIndex: 'fosterersName',
    },
    {
      title: 'Foster Begin Date',
      dataIndex: 'fosterBeginDate',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
  ];

  if (!permissions?.query?.current_foster) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <Row justify="center" style={{ padding: '10px 0px', fontSize: '22px', fontWeight: 500 }}>
        Animal Foster Report
      </Row>
      <Row>
        <Col xs={9} sm={8} style={{ padding: '8px 16px', fontSize: '16px' }}>
          {/* <Card bordered={false}>
            <Statistic
              title="Animals in Foster Care"
              value={1}
              valueStyle={{
                color: '#3f8600',
              }}
            />
          </Card> */}
          Animals in Foster Care :
          <span style={{ fontWeight: 500, padding: '8px' }}>1</span>
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
          tableType: 'Current-Fosters',
          isNotEditable: true,
          isNotDeletable: true,
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <DisclaimerCard />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentFosters);
