/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import {
  Row, Select, Space, Tag,
} from 'antd';
import { useEffect, useState, useRef } from 'react';
import { startCase, upperFirst } from 'lodash';
import dayjs from 'dayjs';
import Cookies from 'universal-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlagFilled, ManOutlined, WomanOutlined } from '@ant-design/icons';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { formatStringDateByCountry, getAge } from 'src/utils/common';
import {
  AnimalsProps, TableFilterOptions, TableFilterTypes,
} from './FtrAnimals.types';
import './FtrAnimals.less';
import { AnimalsAddModal } from './components/AnimalsAddModal';
import RelocateModal from './actions/newLocation/RelocateModal';
import { ContentToolbar } from './components/ContentToolbar';
import { CURRENT, FORMER } from './FtrAnimals.data';
import { pageLength } from '../../shared/constants/pagination.json';
import { pluralToSingular } from '../../utils/pluralToSingular';
import CustomTablePagination from '../../shared/components/CustomTablePagination';
import { AnimalBehaviorModal } from './actions/behaviors/AnimalBehaviorModal';
import modalConstant from '../../shared/constants/modalsConstant.json';
import MilestoneAddForm from './actions/milestones/MilestoneAddForm';
import NotesModal from './actions/notes/NotesModal';
import DiaryModal from './actions/diary/DiaryModal';
import PrescriptionsModal from './actions/prescriptions/PrescriptionsModal';
import ImagePopup from '../../shared/components/ImagePopup';
import CompletedVaccinationsModal from './actions/vaccinations/CompletedVaccinationsModal';
import CompletedProceduresTestModal from './actions/procedureTestTreatments/CompletedProceduresTestModal';
import MedsGivenModal from './actions/meds/MedsGivenModal';
import SoapsModal from './actions/SOAPs/SoapsModal';
import SetReminderModal from './actions/setReminder/SetReminderModal';
import AnimalDietModal from './actions/diet/AnimalDietModal';
import AnimalBlurbModal from './actions/animalBlurb/AnimalBlurb';
import { WelcomeFinalModal } from '../onboarding/welcomePage/components/FinalModal';

const { Option } = Select;
const cssPrefix = 'ftr-animals';

// eslint-disable-next-line
export const Animals = (props: AnimalsProps) => {
  const {
    getAnimalListLoading, animalList, totalNumber, addAnimalLoading, updateAnimalLoading, pcoList, setSelectedPcoId, getAnimalListCall, addAnimalCall,
    updateAnimalCall, deleteAnimalCall, selectedPcoId, selectedAnimal, setSelectedAnimal, uploadImageCall, deleteImageCall, setActionModal, actionModalOpen,
    animalMilestoneList, addAnimalMilestoneListCall, permissions, getVaccinationTypeCall, vaccinationTypeList, getProcedureTestTreatmentCall, procedureList,
    getHospitalClinicCall, hospitalClinicList, getMedicineListCall, medicineList, roleType, setRecentlyAddedAnimal,
  } = props;
  const filterOptions: TableFilterOptions[] = [
    // { id: 'all', name: 'All' },
    { id: CURRENT, name: 'Current Residents' },
    { id: FORMER, name: 'Former Residents' },
  ];

  const navigate = useNavigate();

  // eslint-disable-next-line no-nested-ternary
  const currentTableFilter = (selectedAnimal?.animalDetails?.length > 0) ? (selectedAnimal?.animalDetails?.[0]?.currentResident ? 'current' : 'former') : 'current';

  const [onLoad, setOnLoadFlag] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [imagePopupIds, setImagePopupIds] = useState<any>([]);
  const [tableFilter, setTableFilter] = useState<any>(currentTableFilter);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [showRecentlyAdded, setShowRecentlyAdded] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [animalDataForDelete, setAnimalDataForDelete] = useState<any>('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const cookies = new Cookies();
  const loginDetail = cookies.get('loginDetails');

  const location = useLocation();
  const rowToScrollRef = useRef<any>(null);

  const Men = ({ height }: { height: number }) => (
    <Row>
      <svg xmlns="http://www.w3.org/2000/svg" height={height} fill="#029EF6" viewBox="0 0 448 512">
        <path d="M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8l112 0c13.3 0 24 10.7 24 24l0 112c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80s0 0 0 0s0 0 0 0s0 0 0 0zM176 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z" />
      </svg>
    </Row>
  );

  const Female = ({ height }: { height: number }) => (
    <Row>
      <svg xmlns="http://www.w3.org/2000/svg" height={height} fill="#EB3884" viewBox="0 0 384 512">
        {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
        <path d="M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1l0 34.9-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-34.9z" />
      </svg>
    </Row>
  );

  const Unknown = ({ height }: { height: number }) => (
    <Row>
      <svg xmlns="http://www.w3.org/2000/svg" height={height} fill="#CECD00" viewBox="0 0 512 512">
        {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
        <path d="M337.8 14.8C341.5 5.8 350.3 0 360 0L472 0c13.3 0 24 10.7 24 24l0 112c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-24.7 24.7C407 163.3 416 192.6 416 224c0 80.2-59 146.6-136 158.2l0 25.8 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-24 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-25.8C155 370.6 96 304.2 96 224c0-88.4 71.6-160 160-160c39.6 0 75.9 14.4 103.8 38.2L382.1 80 343 41c-6.9-6.9-8.9-17.2-5.2-26.2zM448 48s0 0 0 0s0 0 0 0s0 0 0 0zM352 224a96 96 0 1 0 -192 0 96 96 0 1 0 192 0z" />
      </svg>
    </Row>
  );

  /** Methods related to CRUD operations goes below * */

  // eslint-disable-next-line no-unused-vars
  const onDeleteAnimal = (id: string): void => {
    deleteAnimalCall({ id }, () => {
      // getAnimalListCall({
      //   length: pageLength,
      //   page: currentPageLocal,
      //   isDeleted: false,
      //   isAvailable: tableFilter === 'current',
      //   searchText: searchKey,
      // }, () => console.log('get list of pco'));
    });
  };

  const getAnimalMilestoneById = (animalRecord: any) => {
    setAnimalDataForDelete('');
    setAnimalDataForDelete({
      attachmentCount: animalRecord?.attachmentCountData?.count,
      milestoneCount: animalRecord?.animalMilestoneCountData?.count,
    });
  };

  const deleteAllClicked = () => {
  };

  const setAddModalVisibility = (flag: boolean): void => {
    setAddModalVisible(flag);
  };

  const setRelocateModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.NEW_LOCATION : '');
  };
  const setBehaviorModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.ADD_BEHAVIOUR : '');
  };
  const setAttacmentsModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.ATTACHMENTS : '');
  };
  const setProceduresModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.PROCEDURE_TEST_TREATMENTS : '');
  };
  const setMilestoneModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.ADD_MILESTONE : '');
  };
  const setNotesModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.NOTES : '');
  };
  const setDiaryModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.DIARY : '');
  };
  const setSetReminderModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.SET_REMINDER : '');
  };
  const setPublicityBlurbModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.PUBLICITY_BLURB : '');
  };
  const setPrescriptionModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.PRESCRIPTION : '');
  };
  const setVaccinationModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.VACCINATION : '');
  };

  const setMedsModalVisibility = (flag: boolean): void => {
    setActionModal(flag ? modalConstant?.MEDS : '');
  };

  const onRefresh = () => {
    setOnLoadFlag(true);
  };

  const handleFilterChange = (val: TableFilterTypes) => {
    setSelectedAnimal({
      ids: [],
      animalDetails: [],
    });
    setTableFilter(val);
    setCurrentPageLocal(1);
  };

  const getAnimalListCallAsync = async (filter: any) => { await getAnimalListCall({ ...filter }, () => { }); };

  useEffect(() => {
    const isModalOpen = parseInt(localStorage.getItem('add-animal-modal') || '', 10);
    if (isModalOpen) {
      setAddModalVisible(true);
    }
  }, []);

  useEffect(() => {
    const prevSearchKey = searchKeyFinal;
    getAnimalListCallAsync({
      length: pageLength,
      page: (prevSearchKey !== searchKeyFinal) ? 1 : currentPageLocal,
      isDeleted: false,
      isAvailable: tableFilter === 'current',
      searchText: searchKeyFinal,
    });
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  const filterSlot = (
    <Select
      style={{ width: '100%' }}
      defaultValue={filterOptions[0].id}
      value={tableFilter}
      onChange={handleFilterChange}
    >
      {filterOptions?.map((opt) => (
        <Option key={opt.id} value={opt.id}>{opt.name}</Option>
      ))}
    </Select>
  );

  const contentToolbar = (
    <ContentToolbar
      selectedAnimal={selectedAnimal}
      filterSlot={filterSlot}
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      setSearchKeyFinal={setSearchKeyFinal}
      onAddIconClicked={setAddModalVisibility}
      disableDeleteIcon={false}
      onDeleteIconClicked={deleteAllClicked}
      onRelocateBtnClicked={setRelocateModalVisibility}
      onBehaviorBtnClicked={setBehaviorModalVisibility}
      onAttachmentsBtnClicked={setAttacmentsModalVisibility}
      onProceduresBtnClicked={setProceduresModalVisibility}
      onSetReminderBtnClicked={setSetReminderModalVisibility}
      onPublicityBlurbBtnClicked={setPublicityBlurbModalVisibility}
      onRefresh={() => onRefresh()}
      setConfirmModal={setConfirmModal}
      setNavigateUrl={setNavigateUrl}
      setActionModal={setActionModal}
      permissions={permissions}
      showRecentlyAdded={showRecentlyAdded}
      setShowRecentlyAdded={setShowRecentlyAdded}
      setSelectedAnimal={setSelectedAnimal}
      setPaginationData={setCurrentPageLocal}
    />
  );

  const nameColumnRenderer = (text: string, record: any) => (
    <Space align="baseline" size="middle">
      {(record.id === selectedAnimal?.ids[0]) ? (
        <span id={`animal-${record.id}`} ref={rowToScrollRef}>
          {text}
        </span>
      ) : (
        <span id={`animal-${record.id}`}>
          {text}
        </span>
      )}
      {
        imagePopupIds?.includes(record.id) && (
          <ImagePopup imgUrl={record?.artifactAttachment?.blobUrl} />
        )
      }
      {
        record.flag ? (
          <FlagFilled
            rev={undefined}
            className={`${cssPrefix}__table-cell-flag${record.flag ? '--flagged' : ''}`}
          />
        ) : <span />
      }
    </Space>
  );

  const animalTypeRender = (text: string, record: any) => (
    <span>{pluralToSingular(record?.animalType)}</span>
  );

  const columnsConfig = [
    {
      title: 'Name',
      dataIndex: 'animalName',
      desktopRenderOnly: true,
      render: nameColumnRenderer,
      width: '110px',
      resizable: true,
    },
    {
      title: 'Type',
      dataIndex: 'animalType',
      desktopRenderOnly: true,
      render: animalTypeRender,
      width: '110px',
      resizable: true,
    },
    {
      title: 'Breed/Species',
      dataIndex: 'breed',
      desktopRenderOnly: true,
      width: '110px',
      resizable: true,
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      desktopRenderOnly: true,
      // eslint-disable-next-line arrow-body-style
      render: (data: any) => {
        // eslint-disable-next-line no-nested-ternary
        return (data.toLowerCase() === 'male') ? <Men height={20} /> : ((data.toLowerCase() === 'female') ? <Female height={20} /> : <Unknown height={20} />);
      },
      width: '60px',
      resizable: true,
    },
    {
      title: (tableFilter === 'current') ? 'Age' : 'Birth Date',
      dataIndex: ['birthMilestone', 'milestoneDate'],
      // eslint-disable-next-line no-nested-ternary
      render: (data: any) => (data ? ((tableFilter === 'current') ? getAge(data) : dayjs(data).format('MMM DD YYYY')) : ''),
      width: 115,
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Last Milestone',
      dataIndex: 'lastMilestone',
      render: (data: any) => (startCase(data)),
    },
    {
      title: 'Last Milestone Date',
      dataIndex: 'lastMilestoneDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode') as any) : ''),
    },
  ];

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
  };

  const clickConfirmCancel = () => {
    setActionModal('');
    setConfirmModal(false);
  };

  if (!permissions?.animals?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <div className={`${cssPrefix}`} style={{ overflowY: 'hidden' }}>
      {/* {pageHeader} */}
      {/* We need to pass here modal control in the toolbar component, so that we can control modal from there */}
      {contentToolbar}
      <CustomTablePagination
        config={{
          rowSelection: 'checkbox',
          selectedRow: selectedAnimal?.ids,
          selectedRowDetails: selectedAnimal?.animalDetails,
          setSelectedRow: (data: any) => {
            setSelectedAnimal(data);
            setImagePopupIds(data?.ids);
          },
          isNotEditable: !permissions?.animals?.edit,
          isNotDeletable: !permissions?.animals?.delete,
          showHeader: true,
          selectable: true,
          tableType: 'Animals',
          deleteConfirmationData: animalDataForDelete,
          isCustomHeight: 'calc(100vh - 300px)',
          getDeleteConfirmationDetail: (id: string) => getAnimalMilestoneById(id),
          mobileViewHeader: (data: any) => (
            <Row justify="start">
              <Space align="baseline" size="middle" style={{ fontWeight: 600 }}>
                {data.id === selectedAnimal?.ids[0] ? (
                  <span id={`animal-${data.id}`} ref={rowToScrollRef}>
                    {data?.animalName}
                  </span>
                ) : (
                  <span id={`animal-${data.id}`}>{data?.animalName}</span>
                )}
              </Space>
              {/* eslint-disable-next-line no-nested-ternary */}
              <Tag color={(data?.sex.toLowerCase() === 'male') ? 'blue' : ((data?.sex.toLowerCase() === 'female') ? 'red' : 'yellow')} style={{ margin: '0px 6px' }}>
                <Row align="middle">
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {(data?.sex.toLowerCase() === 'male') ? <Men height={16} /> : ((data?.sex.toLowerCase() === 'female') ? <Female height={16} /> : <Unknown height={16} />)}
                  &nbsp;
                  {pluralToSingular(data?.animalType)}
                </Row>
              </Tag>
              <span color="blue" style={{ margin: '0px 2px' }}>
                {pluralToSingular(data?.breed)}
              </span>
              {data.flag ? <FlagFilled rev={undefined} className={`${cssPrefix}__table-cell-flag${data.flag ? '--flagged' : ''}`} /> : <span />}
            </Row>
          ),
        }}
        totalNumber={totalNumber}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        tableData={animalList}
        columnData={columnsConfig}
        isLoading={getAnimalListLoading}
        delete={(id: string) => onDeleteAnimal(id)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      {/* <SharedTable
        columns={columnsConfig}
        dataSource={animalList}
        selectedRowKeys={selectedRows}
        updateSelectedRows={updateSelectedRows}
      /> */}
      {permissions?.animals?.add && (
        <AnimalsAddModal
          pcoList={pcoList}
          visible={addModalVisible}
          setModalVisible={(data: boolean) => { setAddModalVisible(data); localStorage.setItem('add-animal-modal', '0'); }}
          editRecord={editRecord}
          roleType={roleType}
          setEditRecord={setEditRecord}
          selectedPcoId={selectedPcoId}
          addAnimalCall={addAnimalCall}
          setRecentlyAddedAnimal={setRecentlyAddedAnimal}
          setShowRecentlyAdded={setShowRecentlyAdded}
          rowToScrollRef={rowToScrollRef}
          getAnimalListCall={getAnimalListCall}
          addAnimalLoading={addAnimalLoading}
          updateAnimalCall={updateAnimalCall}
          updateAnimalLoading={updateAnimalLoading}
          setSelectedPcoId={setSelectedPcoId}
          setSelectedAnimal={setSelectedAnimal}
          selectedAnimal={selectedAnimal}
          setAddModalVisibility={setAddModalVisibility}
          setSearchKey={setSearchKey}
          setSearchKeyFinal={setSearchKeyFinal}
          uploadImageCall={uploadImageCall}
          deleteImageCall={deleteImageCall}
          setCurrentPageLocal={setCurrentPageLocal}
          setWelcomeVisible={setWelcomeVisible}
          getAnimalFilter={{
            length: pageLength,
            page: currentPageLocal,
            isDeleted: false,
            isAvailable: tableFilter === 'current',
            searchText: searchKey,
          }}
          handleCancel={() => {
            localStorage.setItem('add-animal-modal', '0');
            setAddModalVisibility(false);
            setEditRecord(null);
          }}
        />
      )}
      {permissions?.animals?.actions?.location && (
        <RelocateModal
          visible={actionModalOpen === modalConstant.NEW_LOCATION && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
          onCancelClicked={setRelocateModalVisibility}
          selectedAnimal={selectedAnimal}
          animalList={animalList}
          getAnimalListCall={getAnimalListCall}
          getAnimalFilter={{
            length: pageLength,
            page: currentPageLocal,
            isDeleted: false,
            isAvailable: tableFilter === 'current',
            searchText: searchKey,
          }}
        />
      )}
      {permissions?.animals?.actions?.behaviour && (
        <AnimalBehaviorModal
          visible={actionModalOpen === modalConstant.ADD_BEHAVIOUR && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
          onCancelClicked={setBehaviorModalVisibility}
          selectedAnimal={selectedAnimal}
          setVisible={setBehaviorModalVisibility}
          animalList={animalList}
        />
      )}
      {/* <ProceduresModal
        visible={(actionModalOpen === modalConstant.PROCEDURE_TEST_TREATMENTS) && ((selectedAnimal?.ids?.length === 1) || !confirmModal)}
        onCancelClicked={setProceduresModalVisibility}
        selectedAnimal={selectedAnimal}
        animalList={animalList}
      /> */}
      <MedsGivenModal
        visible={actionModalOpen === modalConstant.MEDS && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setMedsModalVisibility}
        onCancelClicked={setBehaviorModalVisibility}
        selectedAnimal={selectedAnimal}
        animalList={animalList}
        getMedicineListCall={getMedicineListCall}
        medicineList={medicineList}
        addGivenMedsLoading={addLoading}
        setAddGivenMedsLoading={setAddLoading}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
        selectedAnimalIds={selectedAnimal?.ids}
        editRecord={undefined}
        setEditRecord={undefined}
        handleUpdate={undefined}
        getGivenMedsList={undefined}
        setAddLoading={undefined}
        addLoading={undefined}
        selectedRadio={undefined}
      />
      <SetReminderModal
        visible={actionModalOpen === modalConstant.SET_REMINDER && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setSetReminderModalVisibility}
        onCancelClicked={setSetReminderModalVisibility}
        getVaccinationTypeCall={getVaccinationTypeCall}
        getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
        getMedicineListCall={getMedicineListCall}
        vaccinationTypeList={vaccinationTypeList}
        procedureList={procedureList}
        medicineList={medicineList}
        selectedAnimal={selectedAnimal}
        animalList={animalList}
        onSave={undefined}
      />
      <MilestoneAddForm
        visible={actionModalOpen === modalConstant.ADD_MILESTONE && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setMilestoneModalVisibility}
        animalMilestoneList={animalMilestoneList}
        selectedAnimal={selectedAnimal}
        addAnimalMilestoneListCall={addAnimalMilestoneListCall}
        setSelectedPco={setSelectedPcoId}
        selectedPcoId={selectedPcoId}
        animalDetail={localStorage.getItem('animalDetails') && JSON.parse(localStorage.getItem('animalDetails') || '')}
        getAnimalListCall={getAnimalListCall}
        filterData={{
          length: pageLength,
          page: currentPageLocal,
          isDeleted: false,
          isAvailable: tableFilter === 'current',
          searchText: searchKey,
        }}
      />
      <NotesModal
        visible={actionModalOpen === modalConstant.NOTES && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setNotesModalVisibility}
        onCancelClicked={setNotesModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={undefined}
        setEditRecord={undefined}
      />
      <DiaryModal
        visible={actionModalOpen === modalConstant.DIARY && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setDiaryModalVisibility}
        onCancelClicked={setDiaryModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={undefined}
        setEditRecord={undefined}
      />
      <PrescriptionsModal
        visible={actionModalOpen === modalConstant.PRESCRIPTION && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setPrescriptionModalVisibility}
        onCancelClicked={setPrescriptionModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
      />
      <CompletedVaccinationsModal
        visible={actionModalOpen === modalConstant.VACCINATION && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setVaccinationModalVisibility}
        onCancelClicked={setAddModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        vaccinationTypeList={vaccinationTypeList}
        hospitalClinicList={hospitalClinicList}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        getHospitalClinicCall={getHospitalClinicCall}
        getVaccinationTypeCall={getVaccinationTypeCall}
        editRecord={undefined}
        handleUpdate={undefined}
        selectedRadio={1}
        setEditRecord={undefined}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
        selectedAnimalIds={selectedAnimal?.ids}
      />
      <CompletedProceduresTestModal
        visible={actionModalOpen === modalConstant.PROCEDURE_TEST_TREATMENTS && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setProceduresModalVisibility}
        onCancelClicked={setAddModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        selectedAnimalIds={selectedAnimal?.ids}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
        procedureList={procedureList}
        hospitalClinicList={hospitalClinicList}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        getHospitalClinicCall={getHospitalClinicCall}
        getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
        editRecord={undefined}
        handleUpdate={undefined}
        setEditRecord={undefined}
        selectedRadio={undefined}
      />
      <SoapsModal
        visible={actionModalOpen === modalConstant.SOAPS && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setVaccinationModalVisibility}
        onCancelClicked={setAddModalVisibility}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        handleUpdate={undefined}
        editRecord={undefined}
        setEditRecord={() => { }}
        hospitalClinicList={hospitalClinicList}
        getHospitalClinicCall={getHospitalClinicCall}
        onSave={() => { }}
      />
      <AnimalDietModal
        visible={actionModalOpen === modalConstant.DIET && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setNotesModalVisibility}
        onCancelClicked={setNotesModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={undefined}
        setEditRecord={undefined}
      />
      <AnimalBlurbModal
        visible={actionModalOpen === modalConstant.PUBLICITY_BLURB && (selectedAnimal?.ids?.length === 1 || !confirmModal)}
        setVisible={setNotesModalVisibility}
        onCancelClicked={setNotesModalVisibility}
        animalList={animalList}
        selectedAnimal={selectedAnimal}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={undefined}
        setEditRecord={undefined}
      />
      <WelcomeFinalModal
        visible={welcomeVisible}
        setVisible={setWelcomeVisible}
        loginDetail={loginDetail}
      />
      <ConfirmModal
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Are you sure"
        onConfirmClick={() => {
          if (selectedAnimal?.ids?.length > 1) {
            setConfirmModal(false);
          } else {
            navigateUrl ? navigate(navigateUrl) : setConfirmModal(false);
          }
        }}
        onCancel={() => clickConfirmCancel()}
        modalContent={(
          <>
            <AnimalDetailCard
              animalDetails={selectedAnimal?.animalDetails}
            />
            <div style={{ textAlign: 'center', paddingTop: '30px' }}>Is this correct ?</div>
          </>
        )}
      />
    </div>
  );
};

export default Animals;
