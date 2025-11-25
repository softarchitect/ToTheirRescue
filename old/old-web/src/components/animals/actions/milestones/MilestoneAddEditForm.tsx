/* eslint-disable no-unreachable */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Button, Form, message, Row, Col,
} from 'antd';
import { LoadingOutlined, CalendarTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import '../../FtrAnimals.less';
import dayjs from 'dayjs';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import { apiCall } from 'src/shared/api/apiWrapper';
import { EditForm } from 'src/components/animals/actions/milestones/forms/otherMilestoneForm';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import ConfirmModal from 'src/shared/components/ConfirmModal';

export interface AnimalsAddModalProps {
  editRecord: any;
  visible: boolean;
  setVisible: any;
  pcoList: [];
  animalMilestoneList: any;
  updateAnimalMilestoneListCall: any;
  getAnimalMilestoneListCall: any;
  setSelectedPco: any;
  animalMilestoneFilter: any;
  selectedPcoId: any;
  selectedAnimal: any;
  updateAnimalMilestoneLoading: boolean;
  role: boolean;
}

interface AnimalType {
  id: string;
  typeName: string;
}

interface AcquisitionWay {
  id: string;
  acquisitionWayName: string;
}

const cssPrefix = 'animals-add-modal';

type SizeType = Parameters<typeof Form>[0]['size'];

export const MilestoneAddEditForm = (props: AnimalsAddModalProps) => {
  const {
    editRecord, visible, setVisible, pcoList, animalMilestoneList, updateAnimalMilestoneListCall,
    getAnimalMilestoneListCall, updateAnimalMilestoneLoading, setSelectedPco, selectedPcoId, selectedAnimal, role,
  } = props;
  const [loading, setLoading] = useState(false);
  const newAnimalType: AnimalType[] = [];
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [animalType, setAnimalType] = useState(newAnimalType);
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [firstError, setFirstError] = useState<any>('');
  const [formUpdatedKey, setFormUpdatedKey] = useState<any>(Date.now());
  const [selectedRescueShelter, setSelectedRescueShelter] = useState('');
  const [key, setKey] = useState<any>(`milestone-modal-${Date.now()}`);
  const [form] = Form.useForm();

  // const ifEditMode: boolean = Boolean(props.editRecord && props.editRecord.key) || false;
  const modalTitle: string = `Edit ${startCase(editRecord?.milestoneType)} Milestone`;

  const onCancel = () => {
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      setVisible(false);
    }
  };

  // const reverseBirthdate = (birthdate: Date): { yrs: number, mos: number, days: number } => {
  //   const currentDate = dayjs();
  //   const diffYears = currentDate.diff(birthdate, 'years');
  //   const diffMonths = currentDate.subtract(diffYears, 'years').diff(birthdate, 'months');
  //   const diffDays = currentDate.subtract(diffMonths, 'months').diff(birthdate, 'days');
  //   return { yrs: diffYears, mos: diffMonths, days: diffDays };
  // };

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setIsFormTouched(false);
      return;
    }
    form.setFieldsValue({
      birthDate: dayjs(editRecord?.milestoneDate),
      amountPaidFee: editRecord?.amountPaidFee || 0,
      amountRecieved: editRecord?.amountReceivedFee || 0,
      notes: editRecord?.notes,
      birthNote: editRecord?.notes,
      intakeNote: editRecord?.notes,
      acquisitionWayId: editRecord?.acquisitionWayId,
      otherRescueShelterId: editRecord?.otherRescueShelterId,
      intakeDate: dayjs(editRecord?.milestoneDate),
      milestoneDate: dayjs(editRecord?.milestoneDate),
      isApproxDOB: editRecord?.isApproxDOB ? 'computedAge' : 'actualAge',
    });
    if (editRecord?.pcoId) {
      setSelectedPco({ id: editRecord?.pcoId, pcoDetail: editRecord });
    }
    setSelectedRescueShelter(editRecord?.otherRescueShelterId);
    setOtherRescueShelter(editRecord?.otherRescueShelterId);
  }, [visible]);

  useEffect(() => {
    setKey(`milestone-modal-${Date.now()}`);
    apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalType(resp?.data?.data?.animalTypes);
        }
      });
    apiCall('acquisition-way/get-acquisition-way', 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setHowAcquired(resp?.data?.data?.acquisitionWays);
          const tempAcquistionWay = resp?.data?.data?.acquisitionWays;
          const newObj: any = {};
          const newAcquistionWayIdToName: any = {};
          tempAcquistionWay.map((currentAcqWay: any, i: any) => {
            newObj[currentAcqWay.acquisitionWayName] = currentAcqWay.id;
            newAcquistionWayIdToName[currentAcqWay.id] = currentAcqWay.acquisitionWayName;
            return newObj;
          });
          setAqusitionNameToId(newObj);
          setAqusitionIdToName(newAcquistionWayIdToName);
        }
      });
    apiCall('pco/get-pco-other-rescues', 'GET', {})
      .then((resp: any) => {
        setOtherRescueShelter(resp?.data?.data?.pcoOtherRescues);
      });
  }, [visible]);

  // const getActualBirthdate = (yrs: number, mos: number, days: number) => {
  //   const birthDate = dayjs().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
  //   return birthDate;
  // };

  const handleUpdate = () => {
    const data = form?.getFieldsValue();
    let newData: any = {};
    if (editRecord?.milestoneType?.toLowerCase() === 'intake') {
      newData = {
        milestoneType: editRecord?.milestoneType,
        isApproxDOB: (data?.isApproxDOB === 'computedAge'),
        otherRescueIDNo: data?.otherRescueID || '',
        acquisitionWayId: data?.acquisitionWayId,
        acquisitionWayName: aqusitionIdToName[data?.acquisitionWayId],
        otherRescueShelterId: data?.otherRescueShelterId || 0,
        amountPaidFee: data?.amountPaidFee ? parseInt(data?.amountPaidFee, 10) : 0,
        amountReceivedFee: data?.amountRecieved ? parseInt(data?.amountRecieved, 10) : 0,
        milestoneDate: dayjs(data?.intakeDate),
        notes: data?.intakeNote,
        pcoId: [aqusitionNameToId['Owner Surrender'], aqusitionNameToId?.['Public Surrender']].includes(data?.acquisitionWayId) ? selectedPcoId?.id : 0,
      };
    } else if (editRecord?.milestoneType?.toLowerCase() === 'birth') {
      newData = {
        milestoneType: editRecord?.milestoneType,
        otherRescueIDNo: editRecord?.otherRescueID || '',
        acquisitionWayId: editRecord?.acquisitionWayId || 0,
        acquisitionWayName: '',
        otherRescueShelterId: 0,
        isApproxDOB: (data?.isApproxDOB === 'computedAge'),
        milestoneDate: data?.birthDate,
        notes: data?.birthNote,
      };
    } else {
      newData = {
        milestoneType: editRecord?.milestoneType,
        isApproxDOB: (data?.isApproxDOB === 'computedAge'),
        otherRescueIDNo: editRecord?.otherRescueID || '',
        acquisitionWayName: aqusitionIdToName[editRecord?.acquisitionWayId] || '',
        otherRescueShelterId: editRecord?.otherRescueShelterId || 0,
        amountPaidFee: parseInt(data?.amountPaidFee, 10) || 0,
        milestoneDate: dayjs(data?.milestoneDate),
        notes: data?.notes,
        pcoId: editRecord?.pcoId ? selectedPcoId?.id : 0,
        acquisitionWayId: editRecord?.acquisitionWayId || 0,
        amountReceivedFee: data?.amountRecieved ? parseInt(data?.amountRecieved, 10) : 0,
      };
    }
    updateAnimalMilestoneListCall({
      milestoneData: newData,
      milestoneId: editRecord?.id,
    }, () => {
      setSelectedPco('');
      setVisible(false);
      getAnimalMilestoneListCall({ page: 1, length: 1000, animalId: selectedAnimal?.ids?.[0] }, () => {
      });
    });
  };

  const validationCheck = () => {
    let errorField = '';
    setFirstError('');
    setTimeout(() => {
      form?.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
      if (errorField) {
        message.error({
          content: 'Correct Highlighted Fields',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
      }
    }, 500);
  };

  const footerContent = [
    <Button key="back" onClick={() => onCancel()}>
      Cancel
    </Button>,
    <Button
      form="animal-other-form"
      key="submit"
      type="primary"
      htmlType="submit"
      loading={loading}
      onClick={() => {
        validationCheck();
      }}
    >
      {editRecord ? 'Update' : 'Save'}
      {updateAnimalMilestoneLoading && <LoadingOutlined rev={undefined} spin />}
    </Button>,
  ];

  const modalContent = (
    <>
      <Row>
        <Col span={24}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
      </Row>
      {!editRecord && (
        <Row style={{ fontSize: '16px', marginLeft: '4px', marginTop: '' }}>
          <Col lg={14}>
            Last Milestone :
            <span style={{ padding: '0px 4px 0px 4px' }}>
              {startCase(animalMilestoneList?.[animalMilestoneList?.length - 1]?.milestoneType || 'Intake')}
            </span>
            on
            {' '}
            <CalendarTwoTone rev={undefined} />
            <span style={{ padding: '0px 4px 0px 4px' }}>
              {startCase(dayjs(selectedAnimal?.animalDetails?.[0]?.lastMilestoneDate).format('MMM DD YYYY') || '')}
            </span>
          </Col>
        </Row>
      )}
      <br />
      <EditForm
        key={key}
        setFormUpdatedKey={setFormUpdatedKey}
        formUpdatedKey={formUpdatedKey}
        form={form}
        firstError={firstError}
        setFirstError={setFirstError}
        handleUpdate={handleUpdate}
        animalMilestoneList={animalMilestoneList}
        selectedRescueShelter={selectedRescueShelter}
        setSelectedRescueShelter={setSelectedRescueShelter}
        editRecord={editRecord}
        visible={visible}
        pcoList={pcoList}
        setSelectedPco={setSelectedPco}
        setOtherRescueShelter={setOtherRescueShelter}
        setIsFormTouched={setIsFormTouched}
        selectedPcoId={selectedPcoId}
      />
    </>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        key={editRecord}
        modalTitle={<span className={`${cssPrefix}__modal__title`}>{modalTitle}</span>}
        modalContent={modalContent}
        footerContent={footerContent}
        modalVisible={visible}
        setModalVisible={setVisible}
        onCancel={onCancel}
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
            form?.submit();
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
          setVisible(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};
