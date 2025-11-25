/* eslint-disable no-unreachable */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, Radio,
  message,
  Popover,
} from 'antd';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import dayjs from 'dayjs';
import Icon, {
  CheckOutlined, CloseCircleFilled, LoadingOutlined, PlusOutlined,
} from '@ant-design/icons';
import { isMobileOnly } from 'react-device-detect';
import './Meds.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { getMedicineCall } from 'src/redux/common/action';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry } from 'src/utils/common';
import MedsGivenModal from './MedsGivenModal';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import { MedRemindersModal } from './MedRemindersModal';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'meds';

const Meds: FC<any> = ({
  permissions, selectedAnimal, getMedicineListCall, medicineList,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [medsList, setMedsList] = useState<any>([]);
  const [givenMedsListLoading, setGivenMedsListLoading] = useState<boolean>(false);
  const [addGivenMedsLoading, setAddGivenMedsLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState(false);
  const [markAsGivenLoading, setMarkAsGivenLoading] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>('');
  const [popupOpenOne, setPopupOpenOne] = useState<any>(false);
  const [popupOpenTwo, setPopupOpenTwo] = useState<any>(false);

  const popupRef: any = useRef('med-reminder-complete');

  const handleAddClick = () => {
    if (selectedRadio === 1) {
      setIsModalOpen(true);
    } else if (selectedRadio === 2) {
      setIsReminderModalOpen(true);
    }
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    if (selectedRadio === 1) {
      setIsModalOpen(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const getGivenMedsList = async () => {
    try {
      setGivenMedsListLoading(true);
      apiCall(`med/get-meds?animalId=${selectedAnimal?.ids?.[0]}&reminder=${(selectedRadio === 2)}`, 'GET', {})
        .then((resp: any) => {
          setGivenMedsListLoading(false);
          if (resp?.data?.success) {
            setMedsList(resp?.data?.data?.meds);
          } else {
            message.error({
              content: 'Internal Error',
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const deleteMeds = (medId: any) => {
    apiCall(`med/delete-med/${medId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getGivenMedsList();
          message.success({
            content: resp?.data?.message || alertConstant.med_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleUpdate = async ({ form }: any) => {
    try {
      await form.validateFields();
      setAddGivenMedsLoading(true);
      const values = form.getFieldsValue();
      const data = {
        ...values,
        administered: true,
      };

      apiCall(`med/update-med/${editRecord?.id}`, 'POST', data)
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
          setSelectedReminder('');
          getGivenMedsList();
          setAddGivenMedsLoading(false);
          form.resetFields();
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const clickCompleteReminder = () => {
    if (!selectedReminder?.id?.[0]) {
      setPopupOpenTwo(true);
      setTimeout(() => {
        setPopupOpenTwo(false);
      }, 1000);
      return;
    }
    setSelectedRadio(2);
    const selectedMeds = selectedReminder?.medReminderDetails?.[0];
    setEditRecord({ ...selectedMeds, administeredDate: selectedMeds?.dueDate });
    setIsModalOpen(true);
  };

  const clickMarkAsGiven = () => {
    let isClickMarkDisabled = false;
    selectedReminder?.medReminderDetails?.forEach((data: any) => {
      if (dayjs(data?.dueDate).isAfter(dayjs())) {
        isClickMarkDisabled = true;
      }
    });
    if (isClickMarkDisabled) {
      setPopupOpenOne(alertConstant.future_date_not_allowed);
      setTimeout(() => {
        setPopupOpenOne(false);
      }, 2000);
      return;
    }
    if (!selectedReminder?.id?.[0]) {
      setPopupOpenOne(alertConstant.select_reminder);
      setTimeout(() => {
        setPopupOpenOne(false);
      }, 1000);
      return;
    }
    try {
      setMarkAsGivenLoading(true);
      apiCall(`med/update-meds-given?ids=${selectedReminder?.id}`, 'PUT', {})
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            setSelectedReminder('');
            getGivenMedsList();
            message.success({
              content: alertConstant.med_given_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setMarkAsGivenLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getGivenMedsList();
  }, [selectedRadio]);

  const columnData1 = [
    {
      title: 'Date Administered',
      dataIndex: 'administeredDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Medicine',
      dataIndex: 'medicine',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
    },
    {
      title: 'Administered By',
      dataIndex: 'administeredBy',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const columnData2 = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Medicine',
      dataIndex: 'medicine',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
    },
    {
      title: 'Instructions',
      dataIndex: 'instructions',
    },
    {
      title: 'Notes',
      dataIndex: 'given',
    },
  ];

  const columnData = selectedRadio === 1 ? columnData1 : columnData2;

  if (!permissions?.animals?.actions?.meds) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const medSvg = () => (
    <svg fontSize="38px" height="0.5em" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M61.748 70.68h-4.914v-4.914a1.749 1.749 0 0 0-1.75-1.75h-8.649a1.75 1.75 0 0 0-1.75 1.75v4.914h-4.913a1.75 1.75 0 0 0-1.75 1.75v8.648a1.75 1.75 0 0 0 1.75 1.75h4.913v4.913a1.75 1.75 0 0 0 1.75 1.75h8.649a1.749 1.749 0 0 0 1.75-1.75v-4.913h4.914a1.75 1.75 0 0 0 1.75-1.75V72.43a1.75 1.75 0 0 0-1.75-1.75zM60 79.328h-4.916a1.75 1.75 0 0 0-1.75 1.75v4.913h-5.149v-4.913a1.75 1.75 0 0 0-1.75-1.75h-4.913V74.18h4.913a1.751 1.751 0 0 0 1.75-1.75v-4.914h5.149v4.914a1.751 1.751 0 0 0 1.75 1.75H60z" />
      <path d="M97.694 93.58H82.223V45.986a8.531 8.531 0 0 0-6.712-8.3l-1.93-.414a5.014 5.014 0 0 1-3.945-4.872v-4.633h3.975a1.75 1.75 0 0 0 1.75-1.75V14.146a1.75 1.75 0 0 0-1.75-1.75h-45.7a1.751 1.751 0 0 0-1.75 1.75v11.871a1.751 1.751 0 0 0 1.75 1.75h3.975V32.4a5.013 5.013 0 0 1-3.944 4.877l-1.931.414a8.53 8.53 0 0 0-6.712 8.3v61.129a8.5 8.5 0 0 0 8.488 8.489h45.948a8.483 8.483 0 0 0 3.379-.712 10.919 10.919 0 0 0 3.847.708h16.733a11.01 11.01 0 0 0 0-22.02zM22.8 59.924h55.923v33.66H22.8zM29.658 15.9h42.2v8.371h-42.2zm-2.917 25.208 1.93-.413a8.529 8.529 0 0 0 6.712-8.3v-4.628h30.753V32.4a8.53 8.53 0 0 0 6.713 8.3l1.929.413a5.016 5.016 0 0 1 3.945 4.878v10.433H22.8V45.986a5.015 5.015 0 0 1 3.941-4.878zM22.8 107.115V97.084h50.134a10.942 10.942 0 0 0 0 15.02h-45.15a4.994 4.994 0 0 1-4.984-4.989zm50.655-2.525a7.528 7.528 0 0 1 7.51-7.51h6.622v15.02h-6.626a7.519 7.519 0 0 1-7.51-7.51zm29.563 5.311a7.5 7.5 0 0 1-5.32 2.2h-6.615V97.08h6.611a7.517 7.517 0 0 1 5.32 12.821z" />
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
          {/* Manage Meds */}
        </Title>
      </div>
      <Row align="bottom" justify="space-between" style={{ paddingBottom: '10px' }}>
        <Col xs={24} md={10}>
          <AnimalDetailCard animalDetails={selectedAnimal?.animalDetails} />
        </Col>
      </Row>
      <Row align="bottom" justify="space-between">
        <Col xs={24} sm={24} md={12}>
          <Row style={isMobileOnly ? { padding: '4px 0px' } : { padding: '4px 6px' }}>
            <div
              className={(selectedRadio === 1) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(1)}
            >
              <span className="radio-label">Meds Given</span>
              <Icon component={medSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
            <div
              className={(selectedRadio === 2) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => setSelectedRadio(2)}
            >
              <span className="radio-label">Med Reminders</span>
              <Icon component={alertSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={12} style={isMobileOnly ? {} : { padding: '0px 10px' }}>
          <Row justify="end">
            <Col flex="auto" sm={4} md={8} lg={5} style={isMobileOnly ? { padding: '6px 10px 0px 0px' } : { padding: '6px' }}>
              <AnimalActionDropdown />
            </Col>
            {(selectedRadio === 2) && (
              <Col style={{ padding: '6px 0px' }}>
                <Popover
                  ref={popupRef}
                  content={(
                    <div>
                      <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                      {popupOpenOne}
                    </div>
                  )}
                  open={popupOpenOne}
                >
                  <Button
                    className="ftr-button-secondary"
                    style={isMobileOnly ? {} : { margin: '0px 10px' }}
                    onClick={() => clickMarkAsGiven()}
                  >
                    <CheckOutlined rev={undefined} />
                    Mark as Given
                    {markAsGivenLoading && (
                      <LoadingOutlined style={{ marginLeft: '4px' }} rev={undefined} spin />
                    )}
                  </Button>
                </Popover>
              </Col>
            )}
            {(selectedRadio === 2) && !(selectedReminder?.id?.length > 1) && (
              <Col style={{ padding: '6px 0px' }}>
                <Popover
                  ref={popupRef}
                  content={(
                    <div>
                      <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                      {alertConstant.select_reminder}
                    </div>
                  )}
                  open={popupOpenTwo}
                >
                  <Button
                    onClick={() => clickCompleteReminder()}
                    className="ftr-button-secondary"
                    style={{ margin: '0px 10px' }}
                  >
                    {/* <CheckOutlined rev={undefined} /> */}
                    Reminder Complete
                  </Button>
                </Popover>
              </Col>
            )}
            <Col style={{ padding: '6px 0px' }}>
              <Button className="ftr-button-dashed" onClick={handleAddClick} style={{ margin: '0px', width: '100%' }}>
                <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                <span className="btn-text">Add</span>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CustomTablePagination
        tableData={medsList}
        isLoading={givenMedsListLoading}
        delete={deleteMeds}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: (selectedRadio === 2),
          selectedRow: selectedReminder?.id,
          setSelectedRow: (data: any) => {
            setEditRecord(data?.medReminderDetails);
            setSelectedReminder(data);
          },
          isNotEditableBlur: true,
          showHeader: true,
          tableType: (selectedRadio === 1) ? 'meds' : 'meds-reminder',
          isCustomHeight: 'calc(100vh - 400px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <MedsGivenModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        getGivenMedsList={getGivenMedsList}
        selectedAnimal={selectedAnimal}
        getMedicineListCall={getMedicineListCall}
        medicineList={medicineList}
        addGivenMedsLoading={addGivenMedsLoading}
        setAddGivenMedsLoading={setAddGivenMedsLoading}
        handleUpdate={handleUpdate}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        selectedAnimalIds={selectedAnimal?.ids}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        selectedRadio={selectedRadio}
      />
      <MedRemindersModal
        visible={isReminderModalOpen}
        setVisible={setIsReminderModalOpen}
        animalList={undefined}
        getGivenMedsList={getGivenMedsList}
        selectedAnimal={selectedAnimal}
        getMedicineListCall={getMedicineListCall}
        medicineList={medicineList}
        onCancelClicked={handleModalCancel}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        editRecord={undefined}
        setEditRecord={undefined}
        handleUpdate={undefined}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  medicineList: state.common.medicineList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getMedicineListCall: (data: any, callbackFunction: () => void) => dispatch(getMedicineCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meds);
