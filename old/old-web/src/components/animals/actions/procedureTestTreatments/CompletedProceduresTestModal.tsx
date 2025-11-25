/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import {
  Modal, DatePicker, Form, message, Row, Col, Button, Popover, Tag,
  Divider,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './CompletedProceduresTestModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import DateInput from 'src/shared/components/Inputs/DateInput';
import alertConstant from 'src/shared/constants/alert.json';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'completed-procedures-test-modal';

export interface CompletedProceduresTestModalProps {
  visible: boolean;
  setVisible: any;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  selectedAnimalIds: any;
  animalTypeId: any;
  hospitalClinicList: any;
  procedureList: any;
  setAddLoading: any;
  addLoading: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  getHospitalClinicCall: any;
  getProcedureTestTreatmentCall: any;
  selectedRadio: any;
}

export const CompletedProceduresTestModal = (props: CompletedProceduresTestModalProps) => {
  const [form] = Form.useForm();
  const [weightHistoryList, setWeightHistoryList] = useState([]);
  const [microchipRequired, setMicrochipRequired] = useState(false);
  const [microchipDisabled, setMicrochipDisabled] = useState(true);
  const [weightRequired, setWeightRequired] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const {
    visible, setVisible, selectedAnimal, hospitalClinicList, procedureList, setAddLoading, addLoading, editRecord,
    handleUpdate, getProcedureTestTreatmentCall, getHospitalClinicCall, setEditRecord, selectedRadio, animalTypeId,
    selectedAnimalIds,
  } = props;

  const lastMilestoneDate = selectedAnimal?.animalDetails?.[0]?.birthMilestone?.milestoneDate;

  const disabledDate = (value: any) => dayjs(value).isAfter(dayjs()) || dayjs(value).isBefore(dayjs(lastMilestoneDate || ''));
  const getWeightHistory = () => {
    if (selectedAnimalIds?.[1]) {
      return;
    }
    apiCall(`animal-procedure/get-animal-weight-history?animalId=${selectedAnimalIds}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setWeightHistoryList(resp?.data?.data?.animalWeightHistory);
        }
      });
  };

  useEffect(() => {
    if (visible) {
      getWeightHistory();
      getProcedureTestTreatmentCall(animalTypeId, () => { });
      getHospitalClinicCall(null, () => { });
      form.setFieldsValue({ ...editRecord, actionDate: (selectedRadio === 1) ? dayjs(editRecord?.actionDate) : dayjs() });
      return;
    }
    setIsFormTouched(false);
    setEditRecord && setEditRecord('');
    form.resetFields();
    form.setFieldValue('date', dayjs());
  }, [visible]);

  const cancelModal = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      props.setVisible(false);
      props.onCancelClicked(false);
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const data = {
        animalIds: selectedAnimalIds,
        animalProcedureVm: {
          ...values,
          reminder: false,
        },
      };
      setAddLoading(true);
      apiCall('animal-procedure/add-animal-procedures', 'POST', data)
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
          props.setVisible(false);
          props.onCancelClicked(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-completed-procedure-form"
      key="submit"
      htmlType="submit"
      loading={addLoading}
      onClick={editRecord ? () => handleUpdate({ form, reminder: false }) : handleSave}
    >
      {(selectedRadio === 1) ? (editRecord ? 'Update' : 'Save') : 'Save'}
    </Button>,
  ];

  type personOption = {
    id: string;
    label: string;
    children?: personOption[];
  }

  const personDropdown: personOption[] = [
    {
      id: 'person1',
      label: 'Person 1',
    },
    {
      id: 'person2',
      label: 'Person 2',
    },
    {
      id: 'person3',
      label: 'Person 3',
    },
  ];

  const weightHistory = (
    <div>
      {(weightHistoryList?.length > 0) ? (
        weightHistoryList?.map((data: any) => (
          data?.weight && (
            <Row>
              <Col span={14} style={{ width: '80px', textOverflow: 'ellipsis' }}>
                {data?.weight}
              </Col>
              <Col span={10}>
                <Tag color="blue">
                  {dayjs(data?.actionDate).format('MMM DD YYYY')}
                </Tag>
              </Col>
            </Row>
          )
        ))
      ) : (
        <div>
          No Record Found
        </div>
      )}
    </div>
  );

  const isMultipleAnimalSelected = (selectedAnimalIds?.length > 1);

  const modalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      {(selectedRadio === 1) ? (
        editRecord ? 'Edit Procedure, Test, or Treatment' : 'Add New Procedure, Test, or Treatment'
      ) : (
        'Complete Procedure, Test, or Treatment Reminder'
      )}
    </span>
  );
  const modalContent = (
    <div>
      <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
      <Form
        form={form}
        onFinish={handleSave}
      >
        <div>
          <Row style={{ padding: '30px 0px 0px 0px' }}>
            <Col md={12} sm={24} xs={24}>
              <Row style={{ padding: '0px 10px' }}>
                <Col span={24}>
                  <DropdownInput
                    style={{ padding: '0px' }}
                    label="P, T, or T"
                    name="kindId"
                    rules={[
                      { required: true, message: 'Procedure, test, or treatment is required' },
                    ]}
                    isRequired
                    disabled={selectedRadio === 2}
                    dataList={procedureList}
                    disabledOptionValue={isMultipleAnimalSelected ? ['microchipcheck', 'microchipimplant', 'weight', 'weights'] : false}
                    keyName="kind"
                    placeholder="Procedure, Test or Treatment"
                    onChange={(selectedProcedure: any) => {
                      setIsFormTouched(true);
                      let microchipcheckRequired = false;
                      let isWeightRequired = false;
                      let isMicrochipDisabled = true;
                      procedureList?.forEach((data: any) => {
                        if ((selectedProcedure === data?.id) && ['microchipcheck', 'microchipimplant'].includes(data?.kind?.split(' ').join('').toLowerCase())) {
                          microchipcheckRequired = ['microchipimplant'].includes(data?.kind?.split(' ').join('').toLowerCase());
                          isMicrochipDisabled = false;
                        }
                        if ((selectedProcedure === data?.id) && ['weight', 'weights'].includes(data?.kind?.split(' ').join('').toLowerCase())) {
                          isWeightRequired = true;
                        }
                      });
                      setMicrochipDisabled(isMicrochipDisabled);
                      setMicrochipRequired(microchipcheckRequired);
                      setWeightRequired(isWeightRequired);
                    }}
                    dropdownRender={(menu: any) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <QuickAddForm
                          type="procedure"
                          visible={visible}
                          setReminderType={null}
                          reminderType="procedure"
                          selectedAnimal={selectedAnimal}
                          animalTypeId={animalTypeId}
                          getHospitalClinicCall={null}
                          getVaccinationTypeCall={null}
                          getProcedureTestTreatmentCall={getProcedureTestTreatmentCall}
                          getMedicineListCall={null}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
              <DateInput
                label="Date of P, T or T"
                name="actionDate"
                className="hide-label"
                rules={[
                  { required: true, message: 'Date of P,T or T is required' },
                ]}
                style={{ width: '100%' }}
                onChange={() => setIsFormTouched(true)}
                disabledDate={(date: any) => disabledDate(date)}
              />
              <DropdownInput
                label="Clinic"
                name="hospitalClinicId"
                className="hide-label"
                rules={[
                  { required: true, message: 'Clinic is required' },
                ]}
                isRequired
                dataList={hospitalClinicList}
                keyName="lastNameHospital"
                placeholder="Clinic"
                onChange={() => setIsFormTouched(true)}
                dropdownRender={(menu: any) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <QuickAddForm
                      type="hospital"
                      visible={visible}
                      setReminderType={null}
                      reminderType="hospital"
                      selectedAnimal={selectedAnimal}
                      getHospitalClinicCall={getHospitalClinicCall}
                      getVaccinationTypeCall={null}
                      getProcedureTestTreatmentCall={null}
                      getMedicineListCall={null}
                    />
                  </>
                )}
              />
              <TextInput
                label="Person performing the P,T or T"
                name="administerer"
                // rules={[
                //   { required: true, message: 'Please select a person' },
                // ]}
                onChange={() => setIsFormTouched(true)}
                dataList={personDropdown}
                keyName="label"
                placeholder="Person"
              />
              <Row style={{ paddingRight: '10px' }}>
                <Col flex="1 1">
                  <TextInput
                    label="Weight"
                    name="weight"
                    className="hide-label"
                    placeholder="Weight"
                    rules={[
                      { required: weightRequired, message: 'Weight is required' },
                    ]}
                    onChange={() => setIsFormTouched(true)}
                    isRequired={weightRequired}
                    disabled={isMultipleAnimalSelected}
                    itemStyle={{ paddingRight: '0px' }}
                    style={{ borderRadius: '0px' }}
                  />
                </Col>
                {!isMultipleAnimalSelected && (
                  <Col flex="130px">
                    <Popover trigger="click" content={weightHistory} title="">
                      <Button
                        size="middle"
                        disabled={(weightHistoryList?.length === 0)}
                        style={{ width: '100%', position: 'relative', left: (weightHistoryList?.length > 0) ? '' : '-1px' }}
                        className={(weightHistoryList?.length > 0) ? 'ftr-button-group' : ''}
                      >
                        {(weightHistoryList?.length > 0) ? 'Weight History' : 'No Weight History'}
                      </Button>
                    </Popover>
                  </Col>
                )}
              </Row>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <AreaInput
                form={form}
                label="Test result (if applicable)"
                placeholder="Test result (if applicable)"
                onChange={() => setIsFormTouched(true)}
                name="results"
                rows={2}
              />
              <TextInput
                label="Microchip Number"
                name="microchipNumber"
                placeholder="Microchip Number"
                onChange={() => setIsFormTouched(true)}
                rules={[
                  { required: microchipRequired, message: 'Microchip Number is required' },
                  {
                    pattern: /^[0-9]{1,20}$/,
                    message: 'Microchip should be 20 digit long number',
                  },
                ]}
                disabled={microchipDisabled || isMultipleAnimalSelected}
                isRequired={microchipRequired}
              />
              <AreaInput
                form={form}
                label="Notes"
                onChange={() => setIsFormTouched(true)}
                placeholder="Notes"
                name="notes"
                rows={5}
              />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        onCancel={cancelModal}
        size="md"
      />
      <ConfirmModal
        key={`confirm-modal-${confirmModal}`}
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Do you want to save your changes?"
        onConfirmClick={async () => {
          try {
            setConfirmModal(false);
            await form.validateFields();
            editRecord ? handleUpdate({ form, reminder: false }) : handleSave();
          } catch (error) {
            console.log('Validation error:', error);
          }
        }}
        onCustomCancel={() => {
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
          form.resetFields();
          props.setVisible(false);
          props.onCancelClicked(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};

export default CompletedProceduresTestModal;
