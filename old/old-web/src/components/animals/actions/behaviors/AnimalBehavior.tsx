/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button,
} from 'antd';
import { FC, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';

import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { AnimalBehaviorModal } from './AnimalBehaviorModal';

import CustomTablePagination from '../../../../shared/components/CustomTablePagination';

const { Title } = Typography;
const cssPrefix = 'diary';

const Diary: FC<any> = ({ permissions, selectedAnimal }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [behaviourList, setBehaviourList] = useState<any>([]);
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
      date: '5/30/2023',
      subject: 'Training',
      notes: 'Text Text Text Text',
    },
  ];

  const columnData1 = [
    {
      title: 'Behavior',
      dataIndex: 'date',
      width: '30%',
    },
    {
      title: 'Yes/No',
      dataIndex: 'subject',
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'notes',
      width: '40%',
    },
  ];

  useEffect(() => {
    const animalId = selectedAnimal?.animalDetails?.[0]?.animalId;
    apiCall(`animal-behavior/get-animal-behaviors?animalId=${animalId}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          // eslint-disable-next-line no-unused-vars
          const newBehaviorData = resp?.data?.data?.behaviors?.map((behavior: any) => ({
            behaviourId: behavior?.id,
          }));
          setBehaviourList(resp?.data?.data?.behaviors);
        }
      });
  }, []);

  const tableData = tableData1;
  const columnData = columnData1;

  if (!permissions?.animals?.actions?.diary) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Diary */}
        </Title>
      </div>

      <Row align="bottom" justify="space-between">
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
        <Col>
          <Button className={`${cssPrefix}__button`} type="dashed" onClick={handleAddClick} icon={<PlusOutlined rev={undefined} />}>
            Add
          </Button>
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
          isNotEditable: true,
          isNotDeletable: true,
          showHeader: true,
          tableType: 'Diary',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <AnimalBehaviorModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
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

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
