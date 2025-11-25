/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, message,
  Popover,
} from 'antd';
import dayjs from 'dayjs';
import {
  FC, useEffect, useState, useRef,
} from 'react';
import Marquee from 'react-fast-marquee';
import Icon, { CheckOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { isMobileOnly, isTablet } from 'react-device-detect';

import './ProceduresTestTreatments.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { apiCall } from 'src/shared/api/apiWrapper';
import { getHospitalClinicCall, getProcedureTestTreatmentCall } from 'src/redux/common/action';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import CompletedProceduresTestModal from 'src/components/animals/actions/procedureTestTreatments/CompletedProceduresTestModal';
import ProceduresTestReminderModal from 'src/components/animals/actions/procedureTestTreatments/ProceduresTestReminderModal';
import alertConstant from 'src/shared/constants/alert.json';
import { formatStringDateByCountry } from 'src/utils/common';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'procedures-test-treatments';

const ProceduresTestTreatments: FC<any> = ({
  permissions, selectedAnimal, procedureList, hospitalClinicList, getHospitalClinicListCall,
  getProcedureTestTreatmentListCall,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [procedureTestTreatmentsList, setProcedureTestTreatmentsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [selectedProcedureReminder, setSelectedProcedureReminder] = useState({ id: '', proceduresTestTreatmentsDetails: '' });
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const popupRef = useRef(null);

  const getProcedureTestTreatments = () => {
    setIsLoading(true);
    apiCall(`animal-procedure/get-animal-procedure?animalId=${selectedAnimal?.ids?.[0]}&reminder=${(selectedRadio === 2)}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setProcedureTestTreatmentsList(resp?.data?.data?.animalProcedures);
          setIsLoading(false);
        }
      });
  };

  const deleteProcedureTestTreatments = (procedureId: any) => {
    setIsLoading(true);
    apiCall(`animal-procedure/delete-animal-procedure/${procedureId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getProcedureTestTreatments();
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
          setSelectedProcedureReminder({ id: '', proceduresTestTreatmentsDetails: '' });
          setIsReminderModalOpen(false);
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    if (addLoading) {
      return;
    }
    getProcedureTestTreatments();
  }, [addLoading, isReminderModalOpen]);

  useEffect(() => {
    getProcedureTestTreatments();
  }, [selectedRadio]);

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
    } else if (selectedRadio === 2) {
      setIsReminderModalOpen(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsReminderModalOpen(false);
  };

  const clickMarkAsComplete = () => {
    if (!selectedProcedureReminder?.id) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
      return;
    }
    setEditRecord({ ...selectedProcedureReminder?.proceduresTestTreatmentsDetails as any, actionDate: dayjs(), hospitalClinicId: null });
    setIsModalOpen(true);
  };

  const completedProcedureColumn = [
    {
      title: 'Action Date',
      dataIndex: 'actionDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Proc., Tests or Treatment',
      dataIndex: 'healthProcedureKind',
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

  const reminderColumn = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Proc., Test, or Treatment',
      dataIndex: 'healthProcedureKind',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const columnData = selectedRadio === 1 ? completedProcedureColumn : reminderColumn;

  if (!permissions?.animals?.actions?.procedure) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const procedureSvg = () => (
    <svg fontSize="38px" height="0.5em" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  );

  const alertSvg = () => (
    <svg fontSize="38px" height="0.5em" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
  );

  const isShowMinimumText = window.innerWidth <= 1070;

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage Procedures, Tests, & Treatments */}
        </Title>
      </div>
      <Row>
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
      </Row>
      <Row align="bottom" justify="space-between" style={{ padding: '4px 0px 0px 0px' }}>
        <Col xs={24} sm={18} md={12} lg={17} xl={14} style={{ marginBottom: '6px' }}>
          <Row style={isMobileOnly ? {} : { padding: '0px 6px' }}>
            <div
              className={(selectedRadio === 1) ? 'custom-tab-selected' : 'custom-tab'}
              key="procedure-radio-1"
              onClick={() => setSelectedRadio(1)}
            >
              {isMobileOnly ? (
                <Marquee>
                  <span className="radio-label">Completed Procedures, Tests, & Treatments</span>
                </Marquee>
              ) : (
                <span className="radio-label">
                  {isShowMinimumText ? 'Complete PTT' : 'Completed Procedures, Tests, & Treatments'}
                </span>
              )}
              <Icon component={procedureSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
            <div
              className={(selectedRadio === 2) ? 'custom-tab-selected' : 'custom-tab'}
              key="procedure-radio-2"
              onClick={() => setSelectedRadio(2)}
            >
              {isMobileOnly ? (
                <Marquee>
                  <span className="radio-label">Procedures, Tests & Treatments Reminders</span>
                </Marquee>
              ) : (
                <span className="radio-label">
                  {isShowMinimumText ? 'PTT Reminders' : 'Procedures, Tests & Treatments Reminders'}
                </span>
              )}
              <Icon component={alertSvg} rev={undefined} style={{ marginLeft: '8px' }} />
            </div>
          </Row>
        </Col>
        <Col xs={24} flex="auto" style={{ marginBottom: '6px' }}>
          <Row justify="end">
            <Col xs={7} sm={6} md={8} xl={8} style={isMobileOnly ? {} : { paddingRight: '10px' }}>
              <AnimalActionDropdown />
            </Col>
            {(selectedRadio === 2) && (
              <Col>
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
                  <Button className="ftr-button-secondary" style={{ margin: '0px 10px', paddingTop: '1px' }} onClick={clickMarkAsComplete}>
                    {!isMobileOnly && (
                      <CheckOutlined rev={undefined} />
                    )}
                    Reminder Complete
                  </Button>
                </Popover>
              </Col>
            )}
            <Col>
              <Button className="ftr-button-dashed" onClick={handleAddClick} style={{ margin: '0px 10px' }}>
                <span className={isMobileOnly ? '' : 'btn-icon'}><PlusOutlined rev={undefined} /></span>
                {!isMobileOnly && (
                  <span className="btn-text">Add</span>
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CustomTablePagination
        tableData={procedureTestTreatmentsList}
        isLoading={isLoading}
        delete={deleteProcedureTestTreatments}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: (selectedRadio === 2),
          isNotEditableBlur: true,
          showHeader: true,
          selectedRow: selectedProcedureReminder?.id,
          setSelectedRow: setSelectedProcedureReminder,
          tableType: (selectedRadio === 1) ? 'proceduresTestTreatments' : 'procedure-reminder',
          isCustomHeight: 'calc(100vh - 396px)',
          rowSelection: 'radio',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />
      <CompletedProceduresTestModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        setVisible={setIsModalOpen}
        hospitalClinicList={hospitalClinicList}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        selectedAnimalIds={selectedAnimal?.ids}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
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
        selectedAnimalIds={selectedAnimal?.ids}
        animalList={undefined}
        selectedAnimal={selectedAnimal}
        animalTypeId={selectedAnimal?.animalDetails[0]?.animalTypeId}
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
  hospitalClinicList: state.common.hospitalClinicList,
  procedureList: state.common.procedureList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getHospitalClinicListCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
  getProcedureTestTreatmentListCall: (data: any, callbackFunction: () => void) => dispatch(getProcedureTestTreatmentCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProceduresTestTreatments);
