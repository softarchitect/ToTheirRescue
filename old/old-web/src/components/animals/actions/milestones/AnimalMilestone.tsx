/* eslint-disable no-unused-vars */
import {
  message, Modal, Select, Button, Typography, Row, Col, Image,
} from 'antd';
import {
  FlagFilled, PlusOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import { formatStringDateByCountry } from 'src/utils/common';
import alertConstant from '../../../../shared/constants/alert.json';
import { pageLength } from '../../../../shared/constants/pagination.json';
import AnimalDetailCard from '../../../../shared/components/AnimalDetailCard';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import { MilestoneAddEditForm } from './MilestoneAddEditForm';
import { apiCall } from '../../../../shared/api/apiWrapper';
import './Milestone.less';
import MilestoneAddForm from './MilestoneAddForm';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

interface AnimalMilestoneProps {
  getAnimalMilestoneListCall: any;
  updateAnimalMilestoneListCall: any;
  animalMilestoneList: any;
  getAnimalMilestoneListLoading: boolean;
  selectedAnimal: any;
  setSelectedPco: any;
  animalList: any;
  selectedPcoId: any;
  updateAnimalMilestoneLoading: boolean;
  addAnimalMilestoneListCall: any;
  permissions: any;
  role: any;
  addAnimalMilestoneLoading: any;
  deleteAnimalMilestoneListCall: any;
  pcoList: [];
}

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const cssPrefix = 'milestone';

// eslint-disable-next-line
export const AnimalMilestone = (props: AnimalMilestoneProps) => {
  const {
    getAnimalMilestoneListCall, updateAnimalMilestoneListCall, animalMilestoneList, selectedAnimal, animalList, deleteAnimalMilestoneListCall, pcoList,
    setSelectedPco, selectedPcoId, updateAnimalMilestoneLoading, addAnimalMilestoneListCall, permissions, role, addAnimalMilestoneLoading, getAnimalMilestoneListLoading,
  } = props;
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [editRecord, setEditRecord] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addMilestoneModal, setAddMilestoneModal] = useState(false);
  const [animalDetails, setAnimalDetail] = useState<any>({});
  const [imageUrl, setImageUrl] = useState<any>();

  // eslint-disable-next-line no-unused-vars
  // const onDeleteAnimal = (id: string): void => {
  //   deleteAnimalCall({ id }, () => {
  //     getAnimalListCall({
  //       length: pageLength,
  //       page: currentPageLocal,
  //       isDeleted: false,
  //       isAvailable: tableFilter,
  //       searchText: searchKey,
  //     }, () => console.log('get list of pco'));
  //   });
  // };

  useEffect(() => {
    const selectAnimalId = selectedAnimal?.ids;

    getAnimalMilestoneListCall({
      animalId: selectAnimalId,
      length: 1000,
      page: currentPageLocal,
    }, () => {

    });

    apiCall(`artifact-attachment/get-artifactattachment-byanimal/${selectAnimalId}`, 'GET', {})
      .then((resp: any) => {
        setImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
      });
  }, []);

  useEffect(() => {
    if (addMilestoneModal) {
      setSelectedPco('');
    }
  }, [addMilestoneModal]);

  useEffect(() => {
    if (!addAnimalMilestoneLoading) {
      getAnimalMilestoneListCall({
        animalId: selectedAnimal?.ids?.[0],
        length: 1000,
        page: currentPageLocal,
      }, () => {

      });
    }
  }, [addAnimalMilestoneLoading]);

  useEffect(() => {
    animalList?.forEach((data: any) => {
      if (data?.id === selectedAnimal?.ids?.[0]) {
        setAnimalDetail(data);
      }
    });
  }, [selectedAnimal]);

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
  };

  const onDeleteAnimalMilestone = (id: string) => {
    deleteAnimalMilestoneListCall(id, () => {
      getAnimalMilestoneListCall({
        animalId: selectedAnimal?.ids?.[0],
        length: 1000,
        page: currentPageLocal,
      }, () => { });
    });
  };

  const isDead = selectedAnimal?.animalDetails?.[0]?.lastMilestone === 'death';

  if (!permissions?.animals?.actions?.milestone) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <div className={`${cssPrefix}`}>
      <Row align="bottom" justify="space-between" style={{ padding: '0px 10px' }}>
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
        <Col xs={24} sm={6} style={{ padding: '10px 0px' }}>
          <Row justify="end">
            <Col span={10} style={{ paddingRight: '10px' }}>
              <AnimalActionDropdown />
            </Col>
            <Col>
              <Button
                className={isDead ? 'ftr-button-disabled' : 'ftr-button-dashed'}
                type="dashed"
                onClick={() => {
                  isDead ? message.error({
                    content: alertConstant.animal_is_dead,
                    style: {
                      marginTop: '2vh',
                    },
                    key: 'updatable',
                  }) : setAddMilestoneModal(true);
                }}
                icon={<PlusOutlined rev={undefined} />}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CustomTablePagination
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'AnimalMilestone',
          isCustomHeight: 'calc(100vh - 350px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={() => { }}
        tableData={animalMilestoneList}
        columnData={[
          {
            title: 'Milestone',
            dataIndex: 'milestoneType',
            render: (data: any) => (startCase(data)),
          },
          {
            title: 'Milestone Date',
            dataIndex: 'milestoneDate',
            render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
          },
          {
            title: 'First Name',
            dataIndex: ['pco', 'firstName'],
          },
          {
            title: 'Last Name',
            dataIndex: ['pco', 'lastName'],
          },
          {
            title: 'Notes',
            dataIndex: 'notes',
          },
        ]}
        isLoading={getAnimalMilestoneListLoading}
        delete={(id: string) => onDeleteAnimalMilestone(id)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      <MilestoneAddEditForm
        pcoList={pcoList}
        editRecord={editRecord}
        visible={addModalVisible}
        setVisible={setAddModalVisible}
        updateAnimalMilestoneListCall={updateAnimalMilestoneListCall}
        animalMilestoneList={animalMilestoneList}
        getAnimalMilestoneListCall={getAnimalMilestoneListCall}
        setSelectedPco={setSelectedPco}
        selectedPcoId={selectedPcoId}
        selectedAnimal={selectedAnimal}
        updateAnimalMilestoneLoading={updateAnimalMilestoneLoading}
        role={role}
        animalMilestoneFilter={{
          animalId: selectedAnimal?.ids?.[0],
          length: pageLength,
          page: currentPageLocal,
        }}
      />
      <MilestoneAddForm
        visible={addMilestoneModal}
        setVisible={setAddMilestoneModal}
        animalMilestoneList={animalMilestoneList}
        selectedAnimal={selectedAnimal}
        setSelectedPco={setSelectedPco}
        selectedPcoId={selectedPcoId}
        addAnimalMilestoneListCall={addAnimalMilestoneListCall}
        animalDetail={animalDetails}
        addAnimalMilestoneLoading={addAnimalMilestoneLoading}
      />
    </div>
  );
};

export default AnimalMilestone;
