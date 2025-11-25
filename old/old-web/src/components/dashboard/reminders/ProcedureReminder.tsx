/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, message, InputNumber,
  Popover,
} from 'antd';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import {
  BellOutlined, CheckOutlined, CloseCircleFilled, PrinterFilled,
} from '@ant-design/icons';
import { getHospitalClinicCall, getProcedureTestTreatmentCall } from 'src/redux/common/action';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import { formatStringDateByCountry } from 'src/utils/common';
import CompletedProceduresTestModal from 'src/components/animals/actions/procedureTestTreatments/CompletedProceduresTestModal';
import ProceduresTestReminderModal from 'src/components/animals/actions/procedureTestTreatments/ProceduresTestReminderModal';
import { pluralToSingular } from 'src/utils/pluralToSingular';

const { Title } = Typography;
const cssPrefix = 'meds';

const ProcedureReminder: FC<any> = ({
  permissions, selectedAnimal, getHospitalClinicListCall, procedureList, hospitalClinicList, getProcedureTestTreatmentListCall,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(2);
  const [reminderDays, setReminderDays] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [selectedReminder, setSelectedReminder] = useState<any>('');
  const [addLoading, setAddLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [procedureReminder, setProcedureReminder] = useState<any>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [procedureReminderLoading, setProcedureReminderLoading] = useState(false);
  const [addGivenMedsLoading, setAddGivenMedsLoading] = useState<boolean>(false);

  const isMobile = window.innerWidth <= 768;

  const popupRefAddReminder: any = useRef('popup-ref-reminder');

  const [tableData, setTableData] = useState([
    {
      id: '1',
      name: 'Venus',
      animal: 'Horse',
      dueDate: '5/25/2021',
      type: 'Vaccination',
      kind: 'Rabies',
      notes: 'Text Text Text',
    },
    {
      id: '2',
      name: 'Honey',
      animal: 'Dog',
      dueDate: '5/1/2024',
      type: 'Vaccination',
      kind: 'DHPP-L',
      notes: 'Text Text Text',
    },
    {
      id: '3',
      name: 'Chandler',
      animal: 'Dog',
      dueDate: '5/9/2024',
      type: 'Vaccination',
      kind: 'Bordetella',
      notes: 'Text Text Text',
    },
    {
      id: '4',
      name: 'Ebenezer',
      animal: 'Dog',
      dueDate: '6/28/2024',
      type: 'Procedure',
      kind: 'Deworming',
      notes: 'Text Text Text',
    },
    {
      id: '5',
      name: 'Ebenezer',
      animal: 'Dog',
      dueDate: '6/28/2024',
      type: 'Procedure',
      kind: 'Deworming',
      notes: 'Text Text Text',
    },
  ]);

  const columnData = [
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    // },
    // {
    //   title: 'Animal',
    //   dataIndex: 'animal',
    // },
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
      dataIndex: 'healthProcedureKind',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  useEffect(() => {
    if (isModalOpen) {
      getHospitalClinicListCall('', () => { });
    }
  }, [isModalOpen]);

  const getProcedureReminder = (currentReminderDays: any) => {
    setProcedureReminderLoading(true);
    apiCall(`animal-procedure/get-all-animal-procedures?reminder=true&days=${currentReminderDays}`, 'GET', {})
      .then((resp: any) => {
        setProcedureReminderLoading(false);
        if (resp?.data?.success) {
          setProcedureReminder(resp?.data?.data?.animalProcedures);
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
    const selectedProcedure = selectedReminder?.proceduresTestTreatmentsDetails;
    setEditRecord({ ...selectedProcedure, actionDate: selectedProcedure?.dueDate, hospitalClinicId: null });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const clickShowResult = () => {
    getProcedureReminder(reminderDays);
    setShowResultButton(false);
  };

  const clickShowAll = () => {
    setReminderDays(0);
    getProcedureReminder(0);
  };

  const deleteProcedureTestTreatments = (procedureId: any) => {
    setIsLoading(true);
    apiCall(`animal-procedure/delete-animal-procedure/${procedureId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getProcedureReminder(reminderDays);
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

      apiCall(`animal-procedure/update-animal-procedure/${editRecord?.id}`, 'POST', data)
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
          getProcedureReminder(reminderDays);
          setIsReminderModalOpen(false);
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getProcedureReminder(reminderDays);
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
        tableData={procedureReminder}
        isLoading={procedureReminderLoading}
        delete={deleteProcedureTestTreatments}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: true,
          selectedRow: selectedReminder?.id,
          setSelectedRow: (data: any) => {
            setEditRecord(data?.proceduresTestTreatmentsDetails);
            setSelectedReminder(data);
          },
          isNotEditableBlur: true,
          showHeader: true,
          rowSelection: 'radio',
          tableType: 'procedure-reminder',
          isCustomHeight: 'calc(100vh - 300px)',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <CompletedProceduresTestModal
        key={selectedReminder?.proceduresTestTreatmentsDetails?.animalId}
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        hospitalClinicList={hospitalClinicList}
        animalList={undefined}
        selectedAnimalIds={[selectedReminder?.proceduresTestTreatmentsDetails?.animalId]}
        selectedAnimal={selectedReminder?.proceduresTestTreatmentsDetails?.animalId}
        animalTypeId={selectedReminder?.proceduresTestTreatmentsDetails?.animalTypeId}
        procedureList={procedureList}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        editRecord={editRecord}
        selectedRadio={selectedRadio}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        getHospitalClinicCall={getHospitalClinicListCall}
        getProcedureTestTreatmentCall={getProcedureTestTreatmentListCall}
      />
      <ProceduresTestReminderModal
        visible={isReminderModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        selectedAnimalIds={[selectedReminder?.proceduresTestTreatmentsDetails?.animalId]}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        animalTypeId={editRecord?.animalTypeId}
        procedureList={procedureList}
        setAddLoading={setAddLoading}
        addLoading={addLoading}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        handleUpdate={handleUpdate}
        getProcedureTestTreatmentCall={getProcedureTestTreatmentListCall}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  medicineList: state.common.medicineList,
  procedureList: state.common.procedureList,
  hospitalClinicList: state.common.hospitalClinicList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getHospitalClinicListCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
  getProcedureTestTreatmentListCall: (data: any, callbackFunction: () => void) => dispatch(getProcedureTestTreatmentCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProcedureReminder);
