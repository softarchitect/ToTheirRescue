/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import {
  FC, useEffect, useState, useRef,
} from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import {
  Typography, Row, Col, Button, message, Popover,
  Space,
  Tag,
} from 'antd';
import { isMobileOnly } from 'react-device-detect';
import { apiCall } from 'src/shared/api/apiWrapper';
import { addPCOCall } from 'src/redux/pco/action';
import { getHospitalClinicCall, getVaccinationTypeCall } from 'src/redux/common/action';
import Icon, { CheckOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import './Vaccinations.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { formatStringDateByCountry, getDateByDays } from 'src/utils/common';
import alertConstant from '../../../../shared/constants/alert.json';
import CompletedVaccinationsModal from './CompletedVaccinationsModal';
import VaccinationReminderModal from './VaccinationReminderModal';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'vaccinations';

const Vaccinations: FC<any> = ({
  permissions, selectedAnimal, vaccinationTypeList, getHospitalClinicListCall, getVaccinationTypeListCall,
  hospitalClinicList,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [vaccinationList, setVaccinationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedVaccinationReminder, setSelectedVaccinationReminder] = useState({ id: '', vaccinationDetails: '' });

  const popupRef = useRef(null);

  const handleAddClick = () => {
    if (selectedRadio === 1) {
      setIsModalOpen(true);
    } else if (selectedRadio === 2) {
      setIsReminderModalOpen(true);
    }
  };

  const getVaccinationList = () => {
    setIsLoading(true);
    apiCall(`animal-vaccination/get-animal-vaccination?animalId=${selectedAnimal?.ids?.[0]}&reminder=${(selectedRadio === 2)}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setVaccinationList(resp?.data?.data?.animalVaccinations);
          setIsLoading(false);
        }
      });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord({ ...data });
    if (selectedRadio === 1) {
      setIsModalOpen(true);
    } else if (selectedRadio === 2) {
      setIsReminderModalOpen(true);
    }
  };

  const deleteVaccination = (procedureId: any) => {
    setIsLoading(true);
    apiCall(`animal-vaccination/delete-animal-vaccination/${procedureId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getVaccinationList();
          message.success({
            content: resp?.data?.message || alertConstant.procedure_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const handleUpdate = async ({ form, reminder }: any) => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();

      const data = {
        ...values,
        reminder,
      };
      let completeReminder = 0;
      const { dueAgainNumber, dueAgainType } = values;
      if (dueAgainNumber && dueAgainType) {
        // eslint-disable-next-line no-nested-ternary
        completeReminder = (selectedRadio === 2) ? 1 : 0;
        data.dueDate = getDateByDays(values.actionDate, (`${dueAgainNumber}-${dueAgainType}`));
        data.dueAgain = `${dueAgainNumber}-${dueAgainType}`;
      }

      apiCall(`animal-vaccination/update-animal-vaccination/${editRecord?.id}?completeReminder=${completeReminder}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.behaviour_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddLoading(false);
          form.resetFields();
          setSelectedVaccinationReminder({ id: '', vaccinationDetails: '' });
          setIsReminderModalOpen(false);
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const clickMarkAsComplete = () => {
    if (!selectedVaccinationReminder?.id) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
      return;
    }
    setEditRecord({
      ...selectedVaccinationReminder?.vaccinationDetails as any,
      actionDate: dayjs(),
      hospitalClinicId: null,
      dueAgain: null,
    });
    setIsModalOpen(true);
  };

  const vaccinationListColumn = [
    {
      title: 'Action Date',
      dataIndex: 'actionDate',
      width: '120px',
      render: (date: any) => (date ? formatStringDateByCountry(date, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Kind',
      dataIndex: 'vaccinationKind',
    },
    {
      title: 'Clinic',
      dataIndex: 'hospitalClinic',
    },
    {
      title: 'Vet',
      dataIndex: 'administerer',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const vaccinationReminderColumn = [
    // {
    //   title: 'Vacc No',
    //   width: '180px',
    //   dataIndex: 'vaccRecordNo',
    // },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Kind',
      dataIndex: 'vaccinationKind',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const columnData = selectedRadio === 1 ? vaccinationListColumn : vaccinationReminderColumn;

  useEffect(() => {
    if (addLoading) {
      return;
    }
    getVaccinationList();
  }, [addLoading]);

  useEffect(() => {
    getVaccinationList();
  }, [selectedRadio]);

  if (!permissions?.animals?.actions?.vaccination) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const vaccinationSvg = () => (
    <svg fontSize="38px" height="0.5em" fill="none" strokeWidth={24} stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M201.5 174.8l55.7 55.8c3.1 3.1 3.1 8.2 0 11.3l-11.3 11.3c-3.1 3.1-8.2 3.1-11.3 0l-55.7-55.8-45.3 45.3 55.8 55.8c3.1 3.1 3.1 8.2 0 11.3l-11.3 11.3c-3.1 3.1-8.2 3.1-11.3 0L111 265.2l-26.4 26.4c-17.3 17.3-25.6 41.1-23 65.4l7.1 63.6L2.3 487c-3.1 3.1-3.1 8.2 0 11.3l11.3 11.3c3.1 3.1 8.2 3.1 11.3 0l66.3-66.3 63.6 7.1c23.9 2.6 47.9-5.4 65.4-23l181.9-181.9-135.7-135.7-64.9 65zm308.2-93.3L430.5 2.3c-3.1-3.1-8.2-3.1-11.3 0l-11.3 11.3c-3.1 3.1-3.1 8.2 0 11.3l28.3 28.3-45.3 45.3-56.6-56.6-17-17c-3.1-3.1-8.2-3.1-11.3 0l-33.9 33.9c-3.1 3.1-3.1 8.2 0 11.3l17 17L424.8 223l17 17c3.1 3.1 8.2 3.1 11.3 0l33.9-34c3.1-3.1 3.1-8.2 0-11.3l-73.5-73.5 45.3-45.3 28.3 28.3c3.1 3.1 8.2 3.1 11.3 0l11.3-11.3c3.1-3.2 3.1-8.2 0-11.4z" />
    </svg>
  );

  const alertSvg = () => (
    <svg fontSize="38px" height="0.5em" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
  );

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Vaccinations */}
        </Title>
      </div>
      <Row>
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
      </Row>
      <Row align="bottom" justify="space-between" style={{ margin: '4px 0px 0px 0px' }}>
        <Col xs={24} sm={24} md={16} lg={12} style={{ marginBottom: '10px' }}>
          <Row style={{ padding: isMobileOnly ? '0px' : '0px 6px' }}>
            <div
              className={(selectedRadio === 1) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(1)}
            >
              <span className="radio-label">
                Completed Vaccinations
              </span>
              <Icon component={vaccinationSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
            <div
              className={(selectedRadio === 2) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(2)}
            >
              <span className="radio-label">
                Vaccinations Reminders
              </span>
              <Icon component={alertSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
          </Row>
        </Col>
        <Col xs={24} sm={14} md={8} lg={11}>
          <Row justify="end">
            {!isMobileOnly && (
              <Col xs={6} sm={7} md={9} lg={6} style={{ paddingRight: '10px', marginBottom: '10px' }}>
                <AnimalActionDropdown />
              </Col>
            )}
            {isMobileOnly && (
              <Col flex={(selectedRadio === 2) ? 'auto' : 'none'} style={{ paddingRight: '6px', marginBottom: '10px' }}>
                <AnimalActionDropdown />
              </Col>
            )}
            {(selectedRadio === 2) && (
              <Popover
                ref={popupRef}
                content={(
                  <div>
                    <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                    {alertConstant.select_reminder}
                  </div>
                )}
                open={open}
              >
                <Button onClick={clickMarkAsComplete} className="ftr-button-secondary" style={{ margin: '0px 10px' }}>
                  {!isMobileOnly && (
                    <CheckOutlined rev={undefined} />
                  )}
                  Reminder Complete
                </Button>
              </Popover>
            )}
            <Col style={{ marginBottom: '10px' }}>
              <Button className="ftr-button-dashed" style={{ margin: isMobileOnly ? '0px' : '0px 10px' }} onClick={handleAddClick}>
                <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                {!isMobileOnly && (
                  <span className="btn-text">Add</span>
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <CustomTablePagination
        tableData={vaccinationList}
        isLoading={isLoading}
        delete={deleteVaccination}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: (selectedRadio === 2),
          selectedRow: selectedVaccinationReminder?.id,
          setSelectedRow: setSelectedVaccinationReminder,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: (selectedRadio === 1) ? 'vaccination' : 'vaccination-reminder',
          rowSelection: 'radio',
          isCustomHeight: 'calc(100vh - 396px)',
          mobileViewHeader: (data: any) => (
            <Row justify="start">
              <Space align="baseline" size="middle" style={{ fontWeight: 600 }}>
                {data.id === selectedAnimal?.ids[0] ? (
                  <span id={`animal-${data.id}`}>
                    {data?.vaccinationKind}
                  </span>
                ) : (
                  <span id={`animal-${data.id}`}>{data?.animalName}</span>
                )}
              </Space>
              {/* eslint-disable-next-line no-nested-ternary */}
              <Tag color="blue" style={{ margin: '0px 6px' }}>
                <Row align="middle">
                  {formatStringDateByCountry(data?.actionDate, localStorage.getItem('countryCode'))}
                </Row>
              </Tag>
              <span color="blue" style={{ margin: '0px 2px' }}>
                {data?.hospitalClinic}
              </span>
            </Row>
          ),
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />

      <CompletedVaccinationsModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        vaccinationTypeList={vaccinationTypeList}
        hospitalClinicList={hospitalClinicList}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        getHospitalClinicCall={getHospitalClinicListCall}
        getVaccinationTypeCall={getVaccinationTypeListCall}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        selectedRadio={selectedRadio}
        selectedAnimalIds={selectedAnimal?.ids}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
      />

      <VaccinationReminderModal
        visible={isReminderModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        vaccinationTypeList={vaccinationTypeList}
        getVaccinationTypeCall={getVaccinationTypeListCall}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        selectedAnimalIds={selectedAnimal?.ids}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
      />

    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  vaccinationTypeList: state.common.vaccinationTypeList,
  hospitalClinicList: state.common.hospitalClinicList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getHospitalClinicListCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
  getVaccinationTypeListCall: (data: any, callbackFunction: () => void) => dispatch(getVaccinationTypeCall(data, callbackFunction)),
  addPCOCall: (data: any, callbackFunction: () => void) => dispatch(addPCOCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Vaccinations);
