/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Diary.less';

import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import DiaryModal from 'src/components/animals/actions/diary/DiaryModal';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { formatStringDateByCountry } from 'src/utils/common';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'diary';

const Diary: FC<any> = ({ permissions, selectedAnimal }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [diaryList, setDiaryList] = useState([]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getDiaryList = async () => {
    setGetLoading(true);
    try {
      apiCall(`diary/get-diary?animalId=${selectedAnimal?.ids?.[0]}`, 'GET', {})
        .then((resp: any) => {
          if (resp?.data?.success) {
            setDiaryList(resp?.data?.data?.diaries);
          }
          setGetLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const handleUpdate = async ({ form }: any) => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = {
        ...values,
        tenantOrAnimal: 'animal',
      };

      apiCall(`diary/update-diary/${editRecord?.id}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.diary_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            getDiaryList();
          }
          setAddLoading(false);
          form.resetFields();
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const deleteDiary = (diaryId: any) => {
    apiCall(`diary/delete-diary/${diaryId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getDiaryList();
          message.success({
            content: resp?.data?.message || alertConstant.diary_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  useEffect(() => {
    if (addLoading) {
      return;
    }
    getDiaryList();
  }, [addLoading]);

  const columnData1 = [
    {
      title: 'Date',
      dataIndex: 'actionDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      width: '70%',
    },
  ];

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setIsModalOpen(value);
  };

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
        <Col xs={24} sm={8} md={6} style={{ padding: '10px 10px' }}>
          <Row justify="end">
            <Col span={12} style={{ paddingRight: '10px' }}>
              <AnimalActionDropdown />
            </Col>
            <Col span={10}>
              <Button className="ftr-button-dashed" onClick={handleAddClick} style={{ margin: '0px', width: '100%' }}>
                <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                <span className="btn-text">Add</span>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <CustomTablePagination
        tableData={diaryList}
        isLoading={getLoading}
        delete={deleteDiary}
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'diary',
          isCustomHeight: 'calc(100vh - 346px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
        setEditModalOpen={setEditModalOpen}
      />

      <DiaryModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        editRecord={editRecord}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={handleUpdate}
        setEditRecord={setEditRecord}
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
