/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import {
  Form, message, Button, Row, Col, DatePicker,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { startCase } from 'lodash';
import TextInput from 'src/shared/components/Inputs/TextInput';
import alertConstant from 'src/shared/constants/alert.json';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';

const cssPrefix = 'set-reminder-modal';

export interface QuickAddFormProps {
  type: string,
  visible: boolean,
  selectedAnimal?: any,
  reminderType: any,
  setReminderType: any,
  animalTypeId?: any,
  getVaccinationTypeCall?: any,
  getProcedureTestTreatmentCall?: any,
  getMedicineListCall?: any,
  getHospitalClinicCall?: any,
  getRescueCall?: any,
  getAcquisitionWayCall?: any,
}

const QuickAddForm = (props: QuickAddFormProps) => {
  const [quickAddForm] = Form.useForm();
  const {
    visible, type, reminderType, animalTypeId, selectedAnimal, getVaccinationTypeCall, getAcquisitionWayCall,
    getProcedureTestTreatmentCall, getMedicineListCall, getHospitalClinicCall, getRescueCall,
  } = props;
  const [addOtherLoading, setAddOtherLoading] = useState(false);
  const [otherInputToogle, setOtherInputToogle] = useState(false);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    quickAddForm.setFieldValue('reminderType', null);
  }, [type, reminderType]);

  useEffect(() => {
    if (!visible) {
      setAddOtherLoading(false);
    }
    if (type === 'vaccination') {
      getVaccinationTypeCall(animalTypeId || selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
    } else if (type === 'procedure') {
      getProcedureTestTreatmentCall(animalTypeId || selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
    } else if (type === 'med') {
      getMedicineListCall({}, () => { });
    } else if (type === 'hospital') {
      getHospitalClinicCall('', () => { });
    } else if (type === 'rescue') {
      getRescueCall({}, () => { });
    }
    // quickAddForm.setFieldsValue('reminderType');
  }, [visible]);

  const addAnimalVaccinationType = () => {
    setAddOtherLoading(true);
    const data = {
      kind: quickAddForm.getFieldValue('reminderType'),
      AnimalTypeId: selectedAnimal?.animalDetails?.[0]?.animalTypeId,
    };
    apiCall('vaccination-type/create-vaccination-type', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.success && respAdd?.data?.data?.id) {
          setAddOtherLoading(false);
          quickAddForm.setFieldsValue({ reminderType: '' });
          setOtherInputToogle(false);
          getVaccinationTypeCall(selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
          message.success({
            content: respAdd?.data?.message || alertConstant.vaccination_type_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        } else {
          setAddOtherLoading(false);
          message.error({
            content: respAdd?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const addAnimalProcedure = () => {
    setAddOtherLoading(true);
    const data = {
      kind: quickAddForm.getFieldValue('reminderType'),
      AnimalTypeId: selectedAnimal?.animalDetails?.[0]?.animalTypeId,
    };
    apiCall('health-procedure/create-health-procedure', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.success && respAdd?.data?.data?.id) {
          setAddOtherLoading(false);
          quickAddForm.setFieldsValue({ reminderType: '' });
          setOtherInputToogle(false);
          getProcedureTestTreatmentCall(selectedAnimal?.animalDetails[0]?.animalTypeId, () => { });
          message.success({
            content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const addHospitalCilinic = () => {
    setAddOtherLoading(true);
    const formData = {
      firstName: '',
      lastName: quickAddForm.getFieldValue('reminderType'),
      state: localStorage.getItem('stateCode'),
      countryId: localStorage.getItem('countryId'),
      mailList: false,
      entityType: 'CorO',
      hospital: true,
      flagReason: '',
    };
    apiCall('PCO/create-PCO?force=false', 'POST', formData)
      .then((resp: any) => {
        setAddOtherLoading(false);
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        getHospitalClinicCall('', () => { });
        quickAddForm.setFieldsValue({ reminderType: '' });
        setOtherInputToogle(false);
        message.success({
          content: 'Hospital clinic added successfully',
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };

  const addMeds = () => {
    setAddOtherLoading(true);
    const data = {
      medicineName: quickAddForm.getFieldValue('medicineName'),
      usedFor: quickAddForm.getFieldValue('usedFor'),
    };
    apiCall('medicine/create-medicine', 'POST', data)
      .then((respAdd: any) => {
        setAddOtherLoading(false);
        if (respAdd?.data?.success && respAdd?.data?.data?.id) {
          quickAddForm.setFieldsValue({ medicineName: '', usedFor: '' });
          setOtherInputToogle(false);
          getMedicineListCall({}, () => { });
          message.success({
            content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        } else {
          message.error({
            content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const addRescue = () => {
    setAddOtherLoading(true);
    const formData = {
      firstName: '',
      lastName: quickAddForm.getFieldValue('reminderType'),
      state: localStorage.getItem('stateCode'),
      countryId: localStorage.getItem('countryId'),
      mailList: false,
      entityType: 'CorO',
      rescue: true,
      flagReason: '',
    };
    apiCall('PCO/create-PCO?force=false', 'POST', formData)
      .then((resp: any) => {
        setAddOtherLoading(false);
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        getRescueCall({}, () => { });
        quickAddForm.setFieldsValue({ reminderType: '' });
        setOtherInputToogle(false);
        message.success({
          content: 'Rescue added successfully',
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };

  const addHowAcquired = () => {
    const data = {
      acquisitionWayName: quickAddForm.getFieldValue('reminderType'),
    };
    setAddOtherLoading(true);
    apiCall('acquisition-way/create-acquisition-way', 'POST', data)
      .then((resp: any) => {
        setAddOtherLoading(false);
        if (resp?.data?.success) {
          quickAddForm.setFieldsValue({ reminderType: '' });
          getAcquisitionWayCall();
          message.success({
            content: alertConstant.animal_acquisition_way_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleClickSave = () => {
    if (type === 'vaccination') {
      addAnimalVaccinationType();
    } else if (type === 'procedure') {
      addAnimalProcedure();
    } else if (type === 'med') {
      addMeds();
    } else if (type === 'hospital') {
      addHospitalCilinic();
    } else if (type === 'rescue') {
      addRescue();
    } else if (type === 'howAcquired') {
      addHowAcquired();
    }
  };

  return (
    <div className={`${cssPrefix}`}>
      {otherInputToogle ? (
        <Form
          id={reminderType}
          form={quickAddForm}
          onFinish={handleClickSave}
        >
          {(type === 'med') ? (
            <Row justify="center">
              <Col style={{ padding: '4px 0px' }}>
                <TextInput
                  highlightInput
                  key={reminderType}
                  name="medicineName"
                  placeholder="Medicine Name"
                  rules={[
                    { required: true, message: 'Medicine is required' },
                  ]}
                  label={`Other ${startCase(type)}`}
                  isRequired
                  style={{ margin: '0px' }}
                  itemStyle={{ margin: '0px', padding: '0.5px 4px' }}
                />
              </Col>
              <Col>
                <TextInput
                  key={`${reminderType}-usedFor`}
                  name="usedFor"
                  placeholder="Used For"
                  rules={[
                    { required: true, message: 'Used For is required' },
                  ]}
                  label={`Other ${startCase(type)}`}
                  isRequired
                  style={{ margin: '0px' }}
                  itemStyle={{ margin: '0px', padding: '0.5px 4px' }}
                />
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24}>
                <TextInput
                  highlightInput
                  key={reminderType}
                  name="reminderType"
                  rules={[
                    { required: true, message: `${startCase(type)} is required` },
                  ]}
                  placeholder={`${startCase(type)}`}
                  label={`Other ${startCase(type)}`}
                  isRequired
                  style={{ margin: '0px' }}
                  itemStyle={{ margin: '0px', padding: '0.5px 4px' }}
                />
              </Col>
            </Row>
          )}
          <Row justify="center" style={{ padding: '10px 0px' }}>
            <Col>
              <Button loading={addOtherLoading} htmlType="submit" style={{ margin: '0px 4px' }} className="ftr-button-secondary" type="text">
                Save
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setOtherInputToogle(false)} htmlType="submit" style={{ margin: '0px 0px' }} className="ftr-button-secondary" type="text">
                {/* <CloseOutlined rev={undefined} /> */}
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row justify="center" style={{ padding: '0 8px 4px' }}>
          <Button onClick={() => setOtherInputToogle(true)} style={{ margin: '4px 0px' }} className="ftr-button-secondary" type="text" icon={<PlusOutlined rev={undefined} />}>
            Add
            {' '}
            {(type === 'howAcquired') ? 'Acquisition Way' : startCase(type)}
          </Button>
        </Row>
      )}
    </div>
  );
};

export default QuickAddForm;
