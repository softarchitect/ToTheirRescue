/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
} from 'antd';
import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Volunteer.less';

import PcoDetailCard from 'src/shared/components/PcoDetailCard';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import VolunteerModal from './VolunteerModal';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import PcoActionsDropdown from '../../components/pcoActionsDropdown/PcoActionsDropdown';

const { Title } = Typography;
const cssPrefix = 'volunteer';

export const Volunteer: FC<any> = ({ permissions, selectedPco }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPcoId] = useState(1);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = (values: any) => {
    console.log('Saving values:', values);
  };

  const tableData1 = [
    {
      date: '5/30/2023',
      status: 'Active',
      animalType: 'Dog, Cats',
      notes: 'Text Text Text',
    },
    {
      date: '9/22/2023',
      status: 'Inactive',
      animalType: 'Dog, Cats',
      notes: 'Text Text Text',
    },
  ];

  const columnData1 = [
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Animal Type',
      dataIndex: 'animalType',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const tableData = tableData1;
  const columnData = columnData1;

  if (!permissions?.pco?.actions?.volunteer) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <Row align="bottom" justify="space-between" style={{ padding: '10px 10px' }}>
        <Col xs={12} md={6}>
          <PcoDetailCard pcoDetails={selectedPco} />
        </Col>
        <Col md={6}>
          <Row justify="end" align="bottom">
            <Col lg={12} xl={10} style={{ paddingRight: '10px' }}>
              <PcoActionsDropdown />
            </Col>
            <Col>
              <Button type="dashed" onClick={handleAddClick} icon={<PlusOutlined rev={undefined} />}>
                Add
              </Button>
            </Col>
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
          tableType: 'volunteer',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <DisclaimerCard />
      <VolunteerModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        onSave={handleSave}
        setVisible={setIsModalOpen}
        pcoList={undefined}
        selectedPco={selectedPco}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedPco: state.common.selectedPco?.pcoDetail,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Volunteer);
