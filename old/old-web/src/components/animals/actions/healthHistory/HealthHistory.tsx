/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
} from 'antd';
import { FC, useEffect, useState } from 'react';

import './HealthHistory.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry } from 'src/utils/common';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'health-history';

const HealthHistory: FC<any> = ({ permissions, selectedAnimal }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [getLoading, setGetLoading] = useState(false);
  const [healthHistoryList, setHealthHistoryList] = useState([]);

  const getHealthHistoryList = async (animalId: any) => {
    setGetLoading(true);
    try {
      apiCall(`health-history/get-health-history?animalId=${animalId}`, 'GET', {})
        .then((resp: any) => {
          if (resp?.data?.success) {
            setHealthHistoryList(resp?.data?.data?.healthHistories);
          }
          setGetLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const columnData1 = [
    {
      title: 'Date',
      dataIndex: 'actionDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
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
      title: 'Clinic',
      dataIndex: 'clinic',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const columnData = columnData1;

  useEffect(() => {
    getHealthHistoryList(selectedAnimal?.ids);
  }, []);

  if (!permissions?.animals?.actions?.health_history) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Health History */}
        </Title>
      </div>
      <Row justify="space-between" align="bottom" style={{ padding: '0px 10px' }}>
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
        <Col xs={24} sm={6} md={3} style={{ padding: '10px 0px' }}>
          <AnimalActionDropdown />
        </Col>
      </Row>
      <CustomTablePagination
        tableData={healthHistoryList}
        isLoading={getLoading}
        delete={() => { }}
        setEditModalOpen={() => { }}
        config={{
          isNotEditable: true,
          isNotDeletable: true,
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'Health History',
          isCustomHeight: 'calc(100vh - 346px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(HealthHistory);
