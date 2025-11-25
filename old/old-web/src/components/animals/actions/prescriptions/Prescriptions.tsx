/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
} from 'antd';
import { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Prescriptions.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import PrescriptionsModal from './PrescriptionsModal';

import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'prescriptions';

const Prescriptions: FC<any> = ({ permissions, selectedAnimal }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedAnimalId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      actionDate: '5/30/2023',
      clinic: 'Companion...',
      veterinarian: 'Dr. Ruth B...',
      kind: 'Clavanox, 1 Pill, 2 times(s) a day',
      specialInstructions: 'Text Text Text Text',
    },
    {

    },
  ];

  const columnData1 = [
    {
      title: 'Action Date',
      dataIndex: 'actionDate',
    },
    {
      title: 'Clinic',
      dataIndex: 'clinic',
    },
    {
      title: 'Veterinarian',
      dataIndex: 'veterinarian',
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
    },
    {
      title: 'Special Instructions',
      dataIndex: 'specialInstructions',
    },
  ];

  const tableData = tableData1;
  const columnData = columnData1;

  if (!permissions?.animals?.actions?.prescription) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Prescriptions */}
        </Title>
      </div>
      <Row align="bottom" justify="space-between">
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
        <Col xs={24} sm={6}>
          <Row justify="end">
            <Col span={10} style={{ paddingRight: '10px' }}>
              <AnimalActionDropdown />
            </Col>
            <Col>
              <Button className={`${cssPrefix}__button`} type="dashed" onClick={handleAddClick} icon={<PlusOutlined rev={undefined} />}>
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
          tableType: 'Prescription',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <DisclaimerCard />

      <PrescriptionsModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        onSave={handleSave}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
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

export default connect(mapStateToProps, mapDispatchToProps)(Prescriptions);
