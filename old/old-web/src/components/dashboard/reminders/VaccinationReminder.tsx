/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, message, InputNumber, Popover,
} from 'antd';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  BellOutlined, CheckOutlined, CloseCircleFilled, PrinterFilled,
} from '@ant-design/icons';
import { getHospitalClinicCall, getVaccinationTypeCall } from 'src/redux/common/action';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { formatStringDateByCountry, getDateByDays } from 'src/utils/common';
import { pluralToSingular } from 'src/utils/pluralToSingular';
import CompletedVaccinationsModal from 'src/components/animals/actions/vaccinations/CompletedVaccinationsModal';
import VaccinationReminderModal from 'src/components/animals/actions/vaccinations/VaccinationReminderModal';

const { Title } = Typography;
const cssPrefix = 'meds';

const VaccinationReminder: FC<any> = ({
  permissions, selectedAnimal, getVaccinationTypeListCall, getHospitalClinicListCall, hospitalClinicList, vaccinationTypeList,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(2);
  const [showPopup, setShowPopup] = useState(false);
  const [reminderDays, setReminderDays] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [selectedReminder, setSelectedReminder] = useState<any>('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [vaccinationReminder, setVaccinationReminder] = useState<any>([]);
  const [addLoading, setAddLoading] = useState<boolean>(true);
  const [addGivenMedsLoading, setAddGivenMedsLoading] = useState<boolean>(false);
  const [vaccinationReminderLoading, setVaccinationReminderLoading] = useState<boolean>(false);

  const isMobile = window.innerWidth <= 768;

  const popupRefAddReminder: any = useRef('popup-ref-reminder');

  const columnData = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
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
      title: 'Kind',
      dataIndex: 'vaccinationKind',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  useEffect(() => {
    if (isModalOpen) {
      getHospitalClinicListCall('', () => { });
      getVaccinationTypeListCall(selectedReminder?.vaccinationDetails?.animalTypeId, () => { });
    }
  }, [isModalOpen]);

  const getVaccinationReminder = (currentReminderDays: any) => {
    setVaccinationReminderLoading(true);
    apiCall(`animal-vaccination/get-all-animal-vaccinations?reminder=true&days=${currentReminderDays}`, 'GET', {})
      .then((resp: any) => {
        setVaccinationReminderLoading(false);
        if (resp?.data?.success) {
          setVaccinationReminder(resp?.data?.data?.animalVaccinations);
        }
      });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setSelectedRadio(1);
    const selectedProcedure = data;
    setEditRecord({
      id: selectedProcedure?.id,
      kindId: selectedProcedure?.kindId,
      dueDate: selectedProcedure?.dueDate,
      notes: selectedProcedure?.notes,
      animalTypeId: selectedProcedure?.animalTypeId,
      reminder: true,
    });
    setIsReminderModalOpen(true);
  };

  const clickCompleteReminder = () => {
    if (!selectedReminder?.id) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return;
    }
    setSelectedRadio(2);
    const selectedProcedure = selectedReminder?.vaccinationDetails;
    setEditRecord({ ...selectedProcedure, actionDate: selectedProcedure?.dueDate, hospitalClinicId: null });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const clickShowResult = () => {
    getVaccinationReminder(reminderDays);
    setShowResultButton(false);
  };

  const clickShowAll = () => {
    setReminderDays(0);
    getVaccinationReminder(0);
  };

  const deleteVaccinationReminder = (procedureId: any) => {
    setIsLoading(true);
    apiCall(`animal-vaccination/delete-animal-vaccination/${procedureId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getVaccinationReminder(reminderDays);
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
        completeReminder = (selectedRadio === 2) ? 1 : (dueAgainNumber ? 1 : 0);
        data.dueDate = getDateByDays(values.actionDate, (`${dueAgainNumber}-${dueAgainType}`));
        data.dueAgain = `${dueAgainNumber}-${dueAgainType}`;
      }

      apiCall(`animal-vaccination/update-animal-vaccination/${editRecord?.id}?completeReminder=${completeReminder}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            getVaccinationReminder(reminderDays);
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
          setSelectedReminder('');
          setIsReminderModalOpen(false);
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getVaccinationReminder(reminderDays);
  }, []);

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
                <div
                  // className="ftr-button-basic"
                  onClick={() => setSelectedRadio(2)}
                >
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
            <Col xs={17} sm={6} md={8} lg={7} xl={6} style={{ padding: isMobile ? '11px 10px' : '6px 10px' }}>
              <Row justify="end">
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
                    <CheckOutlined rev={undefined} style={{ marginLeft: '8px' }} />
                  </div>
                </Popover>
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
                  Show all reminders
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
                  {/* <Col>
                     <PrinterFilled
                       rev={undefined}
                       style={{
                         marginLeft: '8px',
                         fontSize: '28px',
                         color: '#204F91',
                         cursor: 'pointer',
                       }}
                     />
                   </Col> */}
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
                    onClick={() => setSelectedRadio(2)}
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

      <CompletedVaccinationsModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        selectedAnimalIds={[selectedReminder?.vaccinationDetails?.animalId]}
        animalTypeId={selectedReminder?.vaccinationDetails?.animalTypeId}
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
      />

      <VaccinationReminderModal
        visible={isReminderModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        animalList={undefined}
        animalTypeId={editRecord?.animalTypeId}
        selectedAnimalIds={[selectedReminder?.proceduresTestTreatmentsDetails?.animalId]}
        selectedAnimal={selectedAnimal}
        vaccinationTypeList={vaccinationTypeList}
        getVaccinationTypeCall={getVaccinationTypeListCall}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
      />

      <CustomTablePagination
        tableData={vaccinationReminder}
        isLoading={vaccinationReminderLoading}
        delete={deleteVaccinationReminder}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: true,
          selectedRow: selectedReminder?.id,
          setSelectedRow: (data: any) => {
            setEditRecord(data?.vaccinationDetails);
            setSelectedReminder(data);
          },
          isNotEditableBlur: true,
          showHeader: true,
          rowSelection: 'radio',
          tableType: 'vaccination-reminder',
          isCustomHeight: 'calc(100vh - 300px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  medicineList: state.common.medicineList,
  vaccinationTypeList: state.common.vaccinationTypeList,
  hospitalClinicList: state.common.hospitalClinicList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getHospitalClinicListCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
  getVaccinationTypeListCall: (data: any, callbackFunction: () => void) => dispatch(getVaccinationTypeCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VaccinationReminder);
