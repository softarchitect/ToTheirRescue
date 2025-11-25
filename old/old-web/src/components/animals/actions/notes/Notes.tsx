/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Notes.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import dayjs from 'dayjs';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import { formatStringDateByCountry } from 'src/utils/common';
import NotesModal from './NotesModal';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'notes';

const Notes: FC<any> = ({ permissions, selectedAnimal }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [getLoading, setGetLoading] = useState(false);
  const [healthNotes, setHealthNotes] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getHealthNotesList = async () => {
    setGetLoading(true);
    try {
      apiCall(`healthnote/get-healthnote?animalId=${selectedAnimal?.ids?.[0]}`, 'GET', {})
        .then((resp: any) => {
          if (resp?.data?.success) {
            setHealthNotes(resp?.data?.data?.healthNotes);
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
      const data = {
        note: form.getFieldValue('note'),
        animalId: selectedAnimal?.ids?.[0],
      };

      apiCall(`healthnote/update-healthnote/${editRecord?.id}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.diary_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            getHealthNotesList();
          }
          setAddLoading(false);
          form.resetFields();
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const deleteHealthNotes = (healthId: any) => {
    apiCall(`healthnote/delete-healthnote/${healthId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getHealthNotesList();
          message.success({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const columnData = [
    {
      title: 'Date',
      dataIndex: 'dateModified',
      width: 200,
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode') as any) : ''),
    },
    {
      title: 'Notes',
      dataIndex: 'note',
    },
  ];

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setIsModalOpen(value);
  };

  useEffect(() => {
    if (addLoading) {
      return;
    }
    getHealthNotesList();
  }, [addLoading]);

  if (!permissions?.animals?.actions?.meds) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Notes */}
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
        tableData={healthNotes}
        isLoading={getLoading}
        delete={deleteHealthNotes}
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'notes',
          isCustomHeight: 'calc(100vh - 350px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
        setEditModalOpen={setEditModalOpen}
      />
      <NotesModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        handleUpdate={handleUpdate}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
