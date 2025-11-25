/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, message,
  InputNumber,
  Popover,
} from 'antd';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  BellOutlined, CheckOutlined, CloseCircleFilled, LoadingOutlined, PrinterFilled,
} from '@ant-design/icons';
import { getMedicineCall } from 'src/redux/common/action';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry } from 'src/utils/common';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { pluralToSingular } from 'src/utils/pluralToSingular';
import MedsGivenModal from 'src/components/animals/actions/meds/MedsGivenModal';
import dayjs from 'dayjs';
import { MedRemindersModal } from 'src/components/animals/actions/meds/MedRemindersModal';

const { Title } = Typography;
const cssPrefix = 'meds';

const Meds: FC<any> = ({
  permissions, selectedAnimal, getMedicineListCall, medicineList,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState(2);
  const [markAsGivenLoading, setMarkAsGivenLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupTwo, setShowPopupTwo] = useState(false);
  const [reminderDays, setReminderDays] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [medsReminderList, setMedsReminderList] = useState<any>([]);
  const [medsReminderListLoading, setMedsReminderListLoading] = useState<boolean>(false);
  const [addGivenMedsLoading, setAddGivenMedsLoading] = useState<boolean>(false);

  const isMobile = window.innerWidth <= 768;

  const popupRefAddReminder: any = useRef('popup-ref-reminder');
  const popupRefAddReminderGiven: any = useRef('popup-ref-add-reminder-given');

  const setEditModalOpen = (value: boolean, data: any) => {
    setSelectedRadio(1);
    const selectedMeds = data;
    setEditRecord({
      id: selectedMeds?.id,
      medicineId: selectedMeds?.medicineId,
      dosage: selectedMeds?.dosage,
      dueDate: selectedMeds?.dueDate,
      notes: selectedMeds?.notes,
      animalTypeId: selectedMeds?.animalTypeId,
      reminder: true,
    });

    setIsReminderModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const getMedsReminderList = async (currentReminderDays: any) => {
    try {
      setMedsReminderListLoading(true);
      apiCall(`med/get-all-meds?reminder=true&days=${currentReminderDays}`, 'GET', {})
        .then((resp: any) => {
          setMedsReminderListLoading(false);
          if (resp?.data?.success) {
            setMedsReminderList(resp?.data?.data?.meds);
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
          getMedsReminderList(reminderDays);
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

  const handleUpdate = async ({ form, reminder }: any) => {
    try {
      await form.validateFields();
      setAddGivenMedsLoading(true);
      const values = form.getFieldsValue();
      const data = {
        ...values,
        reminder: true,
      };

      apiCall(`med/update-med/${editRecord?.id}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            getMedsReminderList(reminderDays);
            message.success({
              content: respAdd?.data?.message || alertConstant.behaviour_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddGivenMedsLoading(false);
          form.resetFields();
          setIsReminderModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getMedsReminderList(reminderDays);
  }, []);

  const clickShowResult = () => {
    getMedsReminderList(reminderDays);
    setShowResultButton(false);
  };

  const clickCompleteReminder = () => {
    if (!selectedReminder?.id?.[0]) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return;
    }
    setSelectedRadio(2);
    const selectedMeds = selectedReminder?.medReminderDetails?.[0];
    setEditRecord({ ...selectedMeds, administeredDate: selectedMeds?.dueDate });
    setIsModalOpen(true);
  };

  const clickMarkAsGiven = () => {
    if (!selectedReminder?.id?.[0]) {
      setShowPopupTwo(true);
      setTimeout(() => {
        setShowPopupTwo(false);
      }, 1000);
      return;
    }
    try {
      setMarkAsGivenLoading(true);
      apiCall(`med/update-meds-given?ids=${selectedReminder?.id}`, 'PUT', {})
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            setSelectedReminder('');
            getMedsReminderList(reminderDays);
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

  const clickShowAll = () => {
    setReminderDays(0);
    getMedsReminderList(0);
  };

  const columnData = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      width: '140px',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Animal Name',
      dataIndex: 'animalName',
    },
    {
      title: 'Animal Type',
      dataIndex: 'animalType',
      render: (data: any) => pluralToSingular(data),
    },
    {
      title: 'Medicine',
      dataIndex: 'medicine',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      width: '120px',
    },
    {
      title: 'Instructions',
      dataIndex: 'instructions',
    },
  ];

  useEffect(() => {
    if (reminderDays >= 1) {
      setShowResultButton(true);
    } else {
      setShowResultButton(false);
    }
  }, [reminderDays]);

  if (!permissions?.animals?.actions?.meds) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Meds */}
        </Title>
      </div>
      {!isMobile && (
        <Row align="middle" justify="space-between">
          <Col style={{ padding: '6px 10px' }}>
            <Row justify="start" align="middle">
              <Col>
                <div
                  style={{ marginTop: '1.5px' }}
                  className={(!showResultButton && (reminderDays !== 0)) ? 'ftr-button-basic' : 'ftr-button-basic-disabled'}
                  onClick={() => clickShowAll()}
                >
                  <span className="radio-label">
                    Show all reminders
                  </span>
                  <BellOutlined rev={undefined} style={{ marginLeft: '8px' }} />
                </div>
              </Col>
              <Col>
                <div>
                  <span className="radio-label">&nbsp; Show reminders for next</span>
                </div>
              </Col>
              <Col style={{ padding: '0px 10px' }}>
                <InputNumber min={0} variant="filled" onChange={(number: any) => setReminderDays(number)} controls className="" value={reminderDays} style={{ width: '60px', borderRadius: '0px' }} type="number" />
              </Col>
              Days &nbsp;
              {showResultButton && (
                <div
                  style={{ width: 'auto' }}
                  className="ftr-button-basic"
                  onClick={() => clickShowResult()}
                >
                  <span className="radio-label">Show Result</span>
                </div>
              )}
            </Row>
          </Col>
          {!isMobile && (
            <Col xs={17} sm={10} style={{ padding: isMobile ? '11px 10px' : '6px 10px' }}>
              <Row justify="end">
                <Col style={{ marginRight: '10px' }}>
                  <Popover
                    ref={popupRefAddReminderGiven}
                    content={(
                      <div>
                        <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
                        Select a reminder
                      </div>
                    )}
                    open={showPopupTwo}
                  >
                    <div
                      className="ftr-button-basic"
                      onClick={() => clickMarkAsGiven()}
                    >
                      <span className="radio-label">
                        Mark as Given
                      </span>
                      {markAsGivenLoading && (
                        <LoadingOutlined style={{ marginLeft: '4px' }} rev={undefined} spin />
                      )}
                    </div>
                  </Popover>
                </Col>
                <Col>
                  {!(selectedReminder?.id?.length > 1) && (
                    <Popover
                      ref={popupRefAddReminder}
                      content={(
                        <div>
                          <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
                          Select a reminder
                        </div>
                      )}
                      open={showPopup}
                    >
                      <div
                        className="ftr-button-basic"
                        onClick={() => clickCompleteReminder()}
                      >
                        <span className="radio-label">
                          Reminder Complete
                        </span>
                      </div>
                    </Popover>
                  )}
                </Col>
                <PrinterFilled
                  rev={undefined}
                  style={{
                    marginLeft: '8px',
                    fontSize: '28px',
                    color: '#204F91',
                    cursor: 'pointer',
                  }}
                />
              </Row>
            </Col>
          )}
        </Row>
      )}
      {isMobile && (
        <>
          <Row style={{ paddingBottom: '6px' }} justify="space-between" align="middle">
            <Col xs={12}>
              <div
                className={(!showResultButton && (reminderDays !== 0)) ? 'ftr-button-basic' : 'ftr-button-basic-disabled'}
                onClick={() => clickShowAll()}
              >
                <span className="radio-label" style={{}}>
                  Show All Reminders
                </span>
                {!isMobile && (
                  <BellOutlined rev={undefined} style={{ marginLeft: '8px' }} />
                )}
              </div>
            </Col>
            {isMobile && (
              <Col xs={12} sm={6} md={8} lg={7} xl={6} style={{ padding: isMobile ? '0px' : '6px 10px' }}>
                <Row justify="end">
                  <Col>
                    <Popover
                      ref={popupRefAddReminder}
                      content={(
                        <div>
                          <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
                          Select a reminder
                        </div>
                      )}
                      open={showPopup}
                    >
                      <div
                        className="ftr-button-basic"
                        onClick={() => clickCompleteReminder()}
                      >
                        <span className="radio-label" style={{}}>Reminder Complete</span>
                        {/* <CheckOutlined rev={undefined} style={{ marginLeft: '8px' }} /> */}
                      </div>
                    </Popover>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
          <Row style={{ paddingBottom: '6px' }} justify="space-between" align="middle">
            <Col span={15}>
              <Row align="middle" justify="space-between">
                <Col span={11}>
                  <div
                    // className="ftr-button-basic"
                    onClick={() => { }}
                  >
                    <span className="radio-label">&nbsp; Show for next</span>
                  </div>
                </Col>
                <Col style={{ padding: '0px 10px' }}>
                  <InputNumber onChange={(number: any) => setReminderDays(number)} controls className="" value={reminderDays} style={{ width: '60px', border: '1px solid #204F91', borderRadius: '0px' }} type="number" />
                </Col>
                Days &nbsp;
              </Row>
            </Col>
            <Col>
              {showResultButton && (
                <div
                  style={{ width: 'auto' }}
                  className="ftr-button-basic"
                  onClick={() => clickShowResult()}
                >
                  <span className="radio-label">Show Result</span>
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
      <CustomTablePagination
        tableData={medsReminderList}
        isLoading={medsReminderListLoading}
        delete={deleteMeds}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: true,
          selectedRow: selectedReminder?.id,
          setSelectedRow: (data: any) => {
            setEditRecord(data?.medReminderDetails);
            setSelectedReminder(data);
          },
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'meds-reminder',
          isCustomHeight: 'calc(100vh - 300px)',
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
        selectedAnimal={selectedAnimal}
        selectedAnimalIds={[selectedReminder?.medReminderDetails?.animalId]}
        animalTypeId={selectedReminder?.medReminderDetails?.animalTypeId}
        medicineList={medicineList}
        editRecord={editRecord}
        getMedicineListCall={getMedicineListCall}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        selectedRadio={selectedRadio}
        addGivenMedsLoading={addGivenMedsLoading}
        setAddGivenMedsLoading={setAddGivenMedsLoading}
        getGivenMedsList={null}
      />

      <MedRemindersModal
        visible={isReminderModalOpen}
        setVisible={setIsReminderModalOpen}
        animalList={undefined}
        getGivenMedsList={getMedsReminderList}
        selectedAnimal={selectedAnimal}
        getMedicineListCall={getMedicineListCall}
        medicineList={medicineList}
        onCancelClicked={handleModalCancel}
        setAddLoading={setAddGivenMedsLoading}
        addLoading={addGivenMedsLoading}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
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
