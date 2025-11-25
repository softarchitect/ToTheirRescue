/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Button, Col, DatePicker, Form, FormInstance, Input, InputNumber, message, Modal,
  Row, Select, Switch, Steps, Segmented, Popover, Divider, UploadProps, Popconfirm,
} from 'antd';
import {
  LoadingOutlined, ExclamationCircleOutlined, DollarTwoTone, CloseCircleFilled,
  RedoOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { GetProp } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import './AnimalsAddModal.less';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import NumberInput from 'src/shared/components/Inputs/NumberInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import DateInput from 'src/shared/components/Inputs/DateInput';
import { formatDateByCountry } from 'src/utils/common';
import { AnimalLocationTooltip } from 'src/shared/constants/tooltips.data';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import dayjs, { Dayjs } from 'dayjs';
import { isMobileOnly } from 'react-device-detect';
import { apiCall } from 'src/shared/api/apiWrapper';
import { pluralToSingular } from 'src/utils/pluralToSingular';
import SingleAvatarUpload from 'src/shared/components/Inputs/SingleAvatarUpload';
import PCOMinifiedScreen from './minifiedPcoScreen';

const { confirm } = Modal;

export interface AnimalsAddModalProps {
  pcoList?: any;
  editRecord?: any | null;
  visible: boolean;
  addAnimalLoading: boolean,
  updateAnimalLoading: boolean;
  getAnimalFilter: any,
  selectedPcoId: string,
  setSelectedPcoId: any;
  setSearchKey: any;
  setSearchKeyFinal: any;
  setSelectedAnimal: any;
  selectedAnimal: any;
  updateAnimalCall: (data: object, callbackFunction: any) => void;
  setEditRecord: (data: any) => void,
  setAddModalVisibility: (isModalVisible: boolean) => void;
  getAnimalListCall: (data: object, callbackFunction: any) => void;
  addAnimalCall: any;
  setCurrentPageLocal: any;
  uploadImageCall?: any,
  deleteImageCall?: any,
  handleCancel: () => void;
  roleType: any;
  setWelcomeVisible: any;
  rowToScrollRef: any;
  setModalVisible: any;
  setRecentlyAddedAnimal: any;
  setShowRecentlyAdded: any;
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
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

type SizeType = Parameters<typeof Form>[0]['size'];

const cookies = new Cookies();

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
  types: {
    email: '${label} is not a valid email',
    number: '${label} is not a valid number',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const isMobile = window.innerWidth <= 768;

export const AnimalsAddModal = (props: AnimalsAddModalProps) => {
  const {
    addAnimalCall, getAnimalListCall, setAddModalVisibility, getAnimalFilter, addAnimalLoading, editRecord,
    updateAnimalCall, updateAnimalLoading, selectedPcoId, visible, setEditRecord, pcoList, setSelectedPcoId,
    setSearchKey, setSearchKeyFinal, setSelectedAnimal, uploadImageCall, setModalVisible, roleType, rowToScrollRef,
    setCurrentPageLocal, setRecentlyAddedAnimal, setShowRecentlyAdded, setWelcomeVisible,
  } = props;

  const [isFormTouched, setIsFormTouched] = useState(false);
  const [imageState, setImageState] = useState<any>('');
  const [imageUrl, setImageUrl] = useState('');
  const [existedImageUrl, setExistedImageUrl] = useState<any>();
  const [currentImageState, setCurrentImageState] = useState('');
  const [existedImageId, setExistedImageId] = useState<any>();
  const [, forceUpdate] = useState({});
  const [saveAnother, setSaveAnother] = useState(false);
  const [saveAndClone, setSaveAndClone] = useState(false);
  const [loading, setLoading] = useState(false);
  const newAnimalType: AnimalType[] = [];
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [animalType, setAnimalType] = useState(newAnimalType);
  const [animalForm, setAnimalForm] = useState<any>();
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [currentAcquistionWayId, setCurrentAcquistionWayId] = useState('');
  const [noOfAnimal, setNoOfAnimal] = useState(1);
  const [firstError, setFirstError] = useState<any>('');
  const [ageType, setAgeType] = useState<any>('approxAge');
  const [flagReasonKey, setFlagReasonKey] = useState<any>('');
  const [nameSuggestionLoading, setNameSuggestionLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarId, setAvatarId] = useState(Date.now());
  const [confirmModal, setConfirmModal] = useState(false);
  const [open, setOpen] = useState<any>(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  const popupRefNext: any = useRef('popup-ref-next');
  const popupRefSaveClone: any = useRef('popup-ref-save-clone');
  const popupRefSaveAddAnother: any = useRef('popup-ref-saveAdd-another');
  const popupRefSave: any = useRef('popup-ref-save');

  const countryCode = localStorage.getItem('countryCode');
  const ifEditMode: boolean = Boolean(props.editRecord && props.editRecord.key) || false;
  const navigate = useNavigate();

  const addAnimalTitle = (
    <span className={`${cssPrefix}__modal__title`}>
      Add Animal -
      <span style={{ padding: '0px 10px', fontWeight: 500, fontSize: '16px' }}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {currentStep === 1 ? 'Birth Milestone' : (currentStep === 2 ? 'Intake Milestone' : 'Animal Details')}
      </span>
    </span>
  );

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const onChange = () => {

  };

  const editTitle = <span className={`${cssPrefix}__modal__title`}>Edit Animal</span>;
  const modalTitle = editRecord ? editTitle : addAnimalTitle;

  const getRescueCall = () => {
    apiCall('pco/get-pco-other-rescues', 'GET', {})
      .then((resp: any) => {
        setOtherRescueShelter(resp?.data?.data?.pcoOtherRescues);
      });
  };

  const getAcquisitionWayCall = () => {
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
  };

  useEffect(() => {
    setTimeout(() => {
      formAdd.setFieldValue('numberOfAnimals', 1);
    }, 500);
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    apiCall(`animaltype/get-animal-types?roleName=${roleType}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          const animalTypes = resp?.data?.data?.animalTypes;
          if (animalTypes.length === 1) {
            formAdd.setFieldValue('animalTypeId', animalTypes[0]?.id);
          }
          setAnimalType(animalTypes);
        }
      });
    getAcquisitionWayCall();
    getRescueCall();
  }, [visible]);

  useEffect(() => {
    setAvatarId(Date.now());
    const editAnimalRecord = {
      animalName: editRecord?.animalName,
      gender: editRecord?.sex?.toLowerCase(),
      breed: editRecord?.breed,
      color: editRecord?.color,
      chronicCondition: editRecord?.chronicCondition,
      status: editRecord?.status,
      spayedOrNeutered: editRecord?.spayedOrNeutered,
      notes: editRecord?.notes,
      otherIDNo: editRecord?.otherRescueID,
      flag: editRecord?.flag,
      flagReason: editRecord?.flagReason,
      location: editRecord?.location,
      animalTypeId: editRecord?.animalTypeId,
    };

    if (visible) {
      formEdit.setFieldsValue({ ...editAnimalRecord });
      setCurrentStep(0);
      setNoOfAnimal(1);
      setImageState('');
      setExistedImageId('');
      setFlagReasonKey(Date.now());
      formAdd.setFieldsValue({ numberOfAnimals: 1, amountPaid: 0, amountReceived: 0 });
      return;
    }
    setEditRecord && setEditRecord('');
    formAdd.resetFields();
    formEdit.resetFields();
    setIsFormTouched(false);
    setSelectedPcoId('');
    setFirstError('');
    setCurrentAcquistionWayId('');
  }, [visible]);

  useEffect(() => {
    if (!editRecord?.id) {
      return;
    }
    apiCall(`artifact-attachment/get-artifactattachment-byanimal/${editRecord?.id}`, 'GET', {})
      .then((resp: any) => {
        setExistedImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
        setExistedImageId(resp?.data?.data?.artifactAttachment?.id);
      });
  }, [editRecord]);

  if (ifEditMode) {
    // form.setFieldsValue({
    //   ...props.editRecord,
    // });
  }

  // Can not select days after today
  const disabledDate = (current: Dayjs) => current && current > dayjs().endOf('day');

  // eslint-disable-next-line no-unused-vars
  const sexValidator: any = ({ getFieldValue }: FormInstance) => ({
    required: true,
    validator() {
      const totalAnimals = parseInt(getFieldValue('numberOfAnimals'), 10) || 0;
      const maleCnt = parseInt(getFieldValue('males'), 10) || 0;
      const femaleCnt = parseInt(getFieldValue('females'), 10) || 0;
      const uknCnt = parseInt(getFieldValue('unknown'), 10) || 0;

      if ((maleCnt + femaleCnt + uknCnt) === totalAnimals) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Total Count Must Equal the Number of Animals'));
    },
  });

  const generateName = () => {
    const genderAdd = formAdd.getFieldValue('gender');
    const genderEdit = formEdit.getFieldValue('gender');
    const currentForm = editRecord ? formEdit : formAdd;
    setNameSuggestionLoading(true);

    apiCall(`animal/get-animalname-suggestions?gender=${editRecord ? genderEdit : genderAdd}`, 'GET', {})
      .then((resp: any) => {
        setNameSuggestionLoading(false);
        if (resp?.status === 200) {
          currentForm.setFieldsValue({
            animalName: resp?.data?.data,
          });
        }
      });
  };

  const sendOnboardingEmail = () => {
    const firstName = cookies.get('loginDetails')?.loginDetails?.data?.firstName;
    const email = localStorage.getItem('email');
    apiCall(`onboarding/onboarding-email?firstName=${firstName}&email=${email}`, 'POST', {}).then((resp: any) => { });
  };

  const handleUpdate = () => {
    const data = formEdit.getFieldsValue();
    updateAnimalCall({
      ...data,
      sex: data?.gender,
      id: editRecord?.id,
      spayedOrNeutered: data.spayedOrNeutered ? data.spayedOrNeutered : false,
      flag: data?.flag,
    }, (updatedData: any) => {
      if (!updatedData) {
        return;
      }

      setSelectedAnimal({ ids: [updatedData?.id], animalDetails: [updatedData] });
      setAddModalVisibility(false);
      setIsFormTouched(false);
    });
  };

  const onSave = async () => {
    const currentFormValue = await formAdd.validateFields();

    const data = { ...animalForm, ...currentFormValue };
    const {
      yrs, mos, days, gender, numberOfAnimals,
    } = data;

    let {
      males, females, unknown,
    } = data;

    const newAnimalData = {
      animal: {
        // assignedAnimalId: data?.assignedAnimalId || 0,
        animalName: data?.animalName,
        currentResident: true,
        breed: data?.breed,
        color: data?.color,
        chronicCondition: data?.chronicCondition,
        status: data?.status,
        spayedOrNeutered: data.spayedOrNeutered ? data.spayedOrNeutered : false,
        lastMilestone: 'intake',
        lastMilestoneDate: data?.intakeDate,
        notes: data?.notes,
        otherIDNo: data?.otherRescueID,
        flag: data?.flag,
        flagReason: data?.flagReason,
        location: data?.location,
        isDeleted: false,
        pcoId: data?.personOrRescueId ? data?.personOrRescueId?.id : null,
        animalTypeId: data?.animalTypeId,
        tenantId: cookies.get('loginDetails').tenantId,
      },
      intakeMileStone: {
        milestoneType: 'intake',
        milestoneDate: data?.intakeDate || dayjs(),
        otherRescueShelterId: data?.otherRescueShelterId,
        otherRescueIDNo: data?.otherRescueID,
        amountPaidFee: data?.amountPaid || 0,
        amountReceivedFee: data?.amountReceived || 0,
        notes: data?.intakeNote,
        acquisitionWayId: data?.acquisitionWayId,
        acquisitionWayName: aqusitionIdToName[data?.acquisitionWayId],
        isDeleted: false,
        pcoId: data?.personOrRescueId ? data?.personOrRescueId?.id : null,
      },
      birthMilestone: {
        isApproxDOB: !data?.birthDateFlag,
        milestoneType: 'birth',
        milestoneDate: data?.birthDateFlag ? data?.birthDate : getActualBirthdate(yrs, mos, days),
        notes: data?.birthNote,
      },
    };

    setSearchKey('');
    setSearchKeyFinal('');

    if (gender && (noOfAnimal === 1)) {
      if (gender === 'male') {
        males = 1;
        females = 0;
        unknown = 0;
      } else if (gender === 'female') {
        males = 0;
        females = 1;
        unknown = 0;
      } else {
        males = 0;
        females = 0;
        unknown = 1;
      }
    }

    addAnimalCall({
      formData: newAnimalData, noOfAnimal: numberOfAnimals, noOfMale: males || 0, noOfFemale: females || 0, noOfUnknown: unknown || 0,
    }, (animalDetail: any) => {
      const animalIds = animalDetail?.ids;
      setSelectedAnimal(animalDetail);
      setRecentlyAddedAnimal(animalDetail?.animalDetails);
      setShowRecentlyAdded(true);
      setCurrentPageLocal(0);
      if (imageState) {
        uploadImageCall({
          imageState: imageState?.[0],
          animalId: animalIds,
          entity: 'Animal',
          publicityRank: 0,
          attachmentDate: dayjs(),
          attachmentType: 'Photo',
          tenentId: cookies.get('loginDetails')?.tenantId,
          uploadImage: true,
          notShowSuccessAlert: true,
        }, () => {
          // setCurrentPageLocal(1);
          // getAnimalListCall({ ...getAnimalFilter, page: 1, searchText: '' }, () => {
          //   // setTimeout(() => {
          //   //   rowToScrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          //   // }, 500);
          // });
        });
      } else {
        // setCurrentPageLocal(1);
        // getAnimalListCall({ ...getAnimalFilter, page: 1, searchText: '' }, () => {
        //   setTimeout(() => {
        //     rowToScrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        //   }, 500);
        // });
      }

      if (saveAnother) {
        formAdd.resetFields();
        formAdd.setFieldValue('numberOfAnimals', 1);
        setNoOfAnimal(1);
        setImageState('');
        setCurrentImageState('');
        setCurrentAcquistionWayId('');
        setCurrentStep(0);
      } else if (saveAndClone) {
        // eslint-disable-next-line no-console
        console.log('Nothing Happen');
        setCurrentStep(0);
      } else {
        setAddModalVisibility(false);
        setImageState('');
        formAdd.resetFields();
        formEdit.resetFields();
        setCurrentAcquistionWayId('');
      }
      const isModalOpen = parseInt(localStorage.getItem('add-animal-modal') || '', 10);
      if (isModalOpen) {
        sendOnboardingEmail();
        setWelcomeVisible(true);
        localStorage.setItem('add-animal-modal', '0');
      }
      setSaveAnother(false);
      setSaveAndClone(false);
    });
  };

  const getActualBirthdate = (yrs: number = 0, mos: number = 0, days: number = 0) => {
    const birthDate = dayjs().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
    return birthDate;
  };

  const onCancel = () => {
    const isFormChanged = editRecord ? isFormTouched : formAdd.isFieldsTouched();
    if (!isFormChanged) {
      setImageState('');
      formAdd.resetFields();
      formEdit.resetFields();
      props.handleCancel();
      return;
    }

    confirm({
      title: 'Do you want to save your changes..?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      closable: true,
      onClose: () => {

      },
      onOk() {
        editRecord ? handleUpdate() : formAdd.submit();
      },
      onCancel() {
        setImageState('');
        formAdd.resetFields();
        formEdit.resetFields();
        props.handleCancel();
      },
    });
  };

  useEffect(() => {
    const formField = formAdd.getFieldsValue();
    formAdd.setFieldsValue({ ...formField, personOrRescueId: selectedPcoId });
  }, [selectedPcoId]);

  const animalDetailForm = (
    <div>
      <Row>
        <Col flex={isMobile ? 'auto' : '1 1'}>
          <Row>
            {!editRecord && (
              <Col sm={6} md={12} lg={7} xs={10}>
                <NumberInput
                  name="numberOfAnimals"
                  label="Number of Animals"
                  rules={[{ required: true, type: 'number', min: 1 }]}
                  onChange={(data: any) => setNoOfAnimal(data)}
                  min={1}
                  isRequired
                  addonBefore={isMobile ? 'Count' : 'Animal Count'}
                  highlightInput
                />
              </Col>
            )}
            <Col sm={10} md={18} lg={10} xs={14}>
              <TextInput
                name="animalName"
                ref={(ref: any) => (firstError === 'animalName') && ref && ref.focus({ cursor: 'end' })}
                placeholder={(noOfAnimal > 1) ? 'Group Name' : 'Animal Name'}
                label={(noOfAnimal > 1) ? 'Group Name' : 'Animal Name'}
                rules={[{ required: true }]}
                onChange={() => setIsFormTouched(true)}
                addonAfter={(noOfAnimal <= 1) && (
                  <span style={{ width: '100%', cursor: 'pointer' }} key="generateName" onClick={() => generateName()}>
                    {!nameSuggestionLoading && (isMobile ? <RedoOutlined /> : 'Suggest')}
                    {nameSuggestionLoading && <LoadingOutlined rev={undefined} spin />}
                  </span>
                )}
                isRequired
              />
            </Col>
            <Col sm={8} lg={7} xs={12}>
              <DropdownInput
                label="Animal Type"
                initialValue={(animalType?.length > 1) ? null : animalType[0]?.id}
                name="animalTypeId"
                rules={[{ required: true }]}
                keyName="typeName"
                dataList={animalType}
                noOfAnimal={noOfAnimal}
                ref={(ref: any) => (firstError === 'animalTypeId') && ref && ref.focus()}
                placeholder="Animal Type"
                form={formAdd}
                onChange={() => setIsFormTouched(true)}
                isRequired
              />
            </Col>
            {isMobile && (
              <Col sm={(noOfAnimal > 1) ? 7 : 10} md={13} lg={(noOfAnimal > 1) ? 8 : 10} xs={12}>
                <TextInput
                  name="breed"
                  label="Breed or Species"
                  rules={[{ required: true }]}
                  ref={(ref: any) => (firstError === 'breed') && ref && ref.focus()}
                  placeholder="Breed or Species"
                  onChange={() => setIsFormTouched(true)}
                  isRequired
                />
              </Col>
            )}
            {!isMobile && (
              <Col sm={12} md={13} lg={(noOfAnimal > 1) ? 8 : 10} xs={12}>
                <TextInput
                  name="breed"
                  label="Breed or Species"
                  rules={[{ required: true }]}
                  ref={(ref: any) => (firstError === 'breed') && ref && ref.focus()}
                  placeholder="Breed or Species"
                  onChange={() => setIsFormTouched(true)}
                  isRequired
                />
              </Col>
            )}
            <Col style={{ padding: '0px', width: '190px' }} sm={(noOfAnimal > 1) ? 10 : 6} lg={(noOfAnimal > 1) ? 16 : 7} xs={(noOfAnimal > 1) ? 24 : 10}>
              {(noOfAnimal > 1) ? (
                <Form.Item
                  name="gender"
                  style={isMobile ? { padding: '0px 10px' } : { marginBottom: '0px' }}
                  dependencies={['numberOfAnimals']}
                  rules={[
                    sexValidator,
                  ]}
                >
                  <Row justify="space-between">
                    <Col xs={7} lg={7} sm={8}>
                      <Form.Item name="males" style={{ marginBottom: '0px', width: '100%', borderRadius: '0px !important' }}>
                        <InputNumber
                          addonBefore={isMobile ? 'M' : 'Males'}
                          defaultValue={0}
                          min={0}
                          onChange={() => setIsFormTouched(true)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={7} lg={8} sm={8}>
                      <Form.Item name="females" style={{ marginBottom: '0px', width: '100%' }}>
                        <InputNumber
                          addonBefore={isMobile ? 'F' : 'Females'}
                          defaultValue={0}
                          min={0}
                          onChange={() => setIsFormTouched(true)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={7} lg={9} sm={8}>
                      <Form.Item name="unknown" style={{ marginBottom: '0px', width: '100%' }}>
                        <InputNumber
                          addonBefore={isMobile ? 'U' : 'Unknowns'}
                          defaultValue={0}
                          min={0}
                          onChange={() => setIsFormTouched(true)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              ) : (
                <DropdownInput
                  className="hide-label"
                  placeholder="Sex"
                  name="gender"
                  label="Sex"
                  keyName="label"
                  rules={[{ required: true }]}
                  onChange={() => setIsFormTouched(true)}
                  dataList={[{ id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }, { id: 'unknown', label: 'Unknown' }]}
                  isRequired
                />
              )}
            </Col>
            <Col md={7} sm={(noOfAnimal > 1) ? 7 : 8} xs={14} style={{ padding: '0px' }}>
              <DropdownInput
                name="status"
                rules={[{ required: true }]}
                label="Status"
                placeholder="Status"
                keyName="label"
                onChange={() => setIsFormTouched(true)}
                isRequired
                dataList={[
                  { id: 'adoptable', label: 'Adoptable' },
                  { id: 'permanentResident', label: 'Permanent Resident' },
                  { id: 'quarantineHold', label: 'Quarantine Hold' },
                  { id: 'outdoorFeral', label: 'Outdoor Feral' },
                ]}
              />
            </Col>
            <Col md={7} sm={7} xs={10}>
              <TextInput
                name="color"
                label="Color"
                rules={[{ type: 'string', max: 30 }]}
                placeholder="Color"
                onChange={() => setIsFormTouched(true)}
              />
            </Col>
            <Col md={9} sm={9} xs={14}>
              <TextInput
                name="chronicCondition"
                label="Chronic Condition"
                rules={[{ type: 'string', max: 30 }]}
                placeholder="Chronic Condition"
                onChange={() => setIsFormTouched(true)}
              />
            </Col>
            <Col sm={8} xs={24} style={{ padding: '0px 10px', flexFlow: 'nowrap' }}>
              {/* eslint-disable-next-line object-curly-newline */}
              <Form.Item style={isMobileOnly ? { width: '150px', margin: '0px' } : {}} rootClassName="radio-button-custom" layout="horizontal" name="spayedOrNeutered" label="Spayed or Neutered" valuePropName="checked">
                <Switch checkedChildren="true" unCheckedChildren="optional" onChange={() => forceUpdate({})} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* <Col xs={24} sm={14}>
              <TextInput
                name="location"
                label={AnimalLocationTooltip}
                rules={[{ type: 'string', max: 30 }]}
                placeholder="Location"
              />
            </Col> */}
            {/* <Col sm={8} xs={24} style={{ padding: '0px 10px' }}>
              <Form.Item name="spayedOrNeutered" label="Spayed or Neutered" valuePropName="checked">
                <Switch unCheckedChildren="optional" onChange={() => forceUpdate({})} />
              </Form.Item>
            </Col> */}
          </Row>
          <Row>
            <Col md={14} sm={24} xs={24} style={{ padding: '0px 10px' }}>
              <Row>
                <Col xs={3} sm={5}>
                  <Form.Item style={{ margin: '0px' }} rootClassName="radio-button-custom" name="flag" label="Flag" valuePropName="checked">
                    <Switch
                      onChange={(data: any) => {
                        forceUpdate({});
                        setFlagReasonKey(Date.now());
                        if (!data) {
                          const formField = formAdd.getFieldsValue();
                          formAdd.setFieldsValue({ ...formField, flagReason: '' });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={19}>
                  <TextInput
                    key={flagReasonKey}
                    name="flagReason"
                    label="Reason"
                    rules={[{ required: formAdd.getFieldValue('flag'), type: 'string' }]}
                    isRequired={formAdd.getFieldValue('flag')}
                    disabled={!(formAdd.getFieldValue('flag'))}
                    placeholder="Reason For Flag"
                    highlightInput={formAdd.getFieldValue('flag')}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={10} sm={24} xs={24}>
              <AreaInput
                form={formAdd}
                name="notes"
                label="My Story"
                placeholder="Notes"
                rows={4}
                onChange={() => setIsFormTouched(true)}
              />
            </Col>
          </Row>
        </Col>
        {!editRecord && (
          <Col flex="199px" style={{ padding: '0px 10px' }}>
            <SingleAvatarUpload
              key={`avatar-${avatarId}`}
              visible={props.visible}
              setImageState={setImageState}
              setImageUrl={setImageUrl}
              imageState={imageState}
              imageUrl={imageUrl}
              onChange={onChange}
              type="Animal"
              disabled={(noOfAnimal > 1)}
            />
          </Col>
        )}
      </Row>
      {/* <Row>
        <Col sm={14} xs={24} style={{ padding: '0px 10px' }}>
          <Row>
            <Col span={4}>
              <Form.Item name="flag" label="Flag" valuePropName="checked">
                <Switch
                  onChange={(data: any) => {
                    forceUpdate({});
                    setFlagReasonKey(Date.now());
                    if (!data) {
                      const formField = formAdd.getFieldsValue();
                      formAdd.setFieldsValue({ ...formField, flagReason: '' });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={20}>
              <TextInput
                key={flagReasonKey}
                name="flagReason"
                label="Reason"
                rules={[{ required: formAdd.getFieldValue('flag'), type: 'string' }]}
                isRequired={formAdd.getFieldValue('flag')}
                disabled={!(formAdd.getFieldValue('flag'))}
                placeholder="Reason For Flag"
              />
            </Col>
          </Row>
        </Col>
        <Col sm={10} xs={24}>
          <AreaInput
            form={formAdd}
            name="notes"
            label="My Story"
            placeholder="Notes"
            rows={4}
            onChange={() => setIsFormTouched(true)}
          />
        </Col>
      </Row> */}
    </div>
  );

  const animalDetailEditForm = (
    <div style={{ padding: '40px' }}>
      <Row>
        <Col sm={18} lg={7} xs={24}>
          <Row wrap={false}>
            <Col flex="auto">
              <TextInput
                name="animalName"
                ref={(ref: any) => (firstError === 'animalName') && ref && ref.focus({ cursor: 'end' })}
                placeholder={(noOfAnimal > 1) ? 'Group Name' : 'Animal Name'}
                label={(noOfAnimal > 1) ? 'Group Name' : 'Animal Name'}
                rules={[{ required: true }]}
                onChange={() => setIsFormTouched(true)}
                addonAfter={(noOfAnimal <= 1) && (
                  <span style={{ width: '100%', cursor: 'pointer' }} key="generateName" onClick={() => generateName()}>
                    Suggest
                    {nameSuggestionLoading && <LoadingOutlined rev={undefined} spin />}
                  </span>
                )}
                isRequired
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12} lg={5} xs={24}>
          <Form.Item className="hide-label" style={{ padding: '0px 10px' }} label="Animal Type" initialValue={animalType[0]?.id} name="animalTypeId" rules={[{ required: true }]}>
            <Select
              ref={(ref) => (firstError === 'animalTypeId') && ref && ref.focus()}
              placeholder="Select a Animal Type"
            >
              {animalType.map((data) => (
                <Option key={data.id} value={data.id} onChange={() => setIsFormTouched(true)}>{(noOfAnimal > 1) ? data.typeName : pluralToSingular(data.typeName)}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col sm={7} xs={24}>
          <TextInput
            name="breed"
            label="Breed or Species"
            rules={[{ required: true }]}
            ref={(ref: any) => (firstError === 'breed') && ref && ref.focus()}
            placeholder="Breed or Species"
            onChange={() => setIsFormTouched(true)}
            isRequired
          />
        </Col>
        <Col sm={5} xs={24}>
          <DropdownInput
            className="hide-label"
            placeholder="Sex"
            name="gender"
            label="Sex"
            keyName="label"
            rules={[{ required: true }]}
            onChange={() => setIsFormTouched(true)}
            dataList={[{ id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }, { id: 'unknown', label: 'Unknown' }]}
            isRequired
          />
        </Col>
      </Row>
      <Row>
        <Col sm={7} xs={24} style={{ padding: '0px' }}>
          <DropdownInput
            placeholder="Status"
            name="status"
            label="Status"
            keyName="label"
            isRequired
            onChange={() => setIsFormTouched(true)}
            dataList={[
              { id: 'adoption', label: 'Adoptable' },
              { id: 'permanentResident', label: 'Permanent Resident' },
              { id: 'quarantineHold', label: 'Quarantine Hold' },
              { id: 'outdoorFeral', label: 'Outdoor Feral' },
            ]}
          />
        </Col>
        <Col sm={8}>
          <TextInput
            name="color"
            label="Color"
            rules={[{ type: 'string', max: 30 }]}
            onChange={() => setIsFormTouched(true)}
            placeholder="Color"
          />
        </Col>
        <Col sm={9} xs={24}>
          <TextInput
            name="chronicCondition"
            label="Chronic Condition"
            rules={[{ type: 'string', max: 30 }]}
            onChange={() => setIsFormTouched(true)}
            placeholder="Chronic Condition"
          />
        </Col>
        {/* <Col sm={8}>
          <TextInput
            name="location"
            label={AnimalLocationTooltip}
            rules={[{ type: 'string', max: 30 }]}
            onChange={() => setIsFormTouched(true)}
            placeholder="Location"
            disabled={!editRecord?.currentResident || ['adoption', 'foster', 'returned-to-owner', 'tranfer'].includes(editRecord?.lastMilestone)}
          />
        </Col> */}
      </Row>
      <Row>
        <Col sm={6} xs={24} style={{ padding: '0px 10px' }}>
          <Form.Item name="spayedOrNeutered" label="Spayed or Neutered" valuePropName="checked">
            <Switch unCheckedChildren="optional" onChange={() => setIsFormTouched(true)} />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item name="flag" label="Flag" valuePropName="checked">
            <Switch
              onChange={(data: any) => {
                forceUpdate({});
                setFlagReasonKey(Date.now());
                if (!data) {
                  const formField = formEdit.getFieldsValue();
                  formEdit.setFieldsValue({ ...formField, flagReason: '' });
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={14}>
          <TextInput
            key={flagReasonKey}
            name="flagReason"
            label="Reason"
            rules={[{ required: formEdit.getFieldValue('flag'), type: 'string' }]}
            isRequired={formEdit.getFieldValue('flag')}
            disabled={!(formEdit.getFieldValue('flag'))}
            onChange={() => setIsFormTouched(true)}
            placeholder="Reason For Flag"
          />
        </Col>
        <Col sm={12} xs={24}>
          <AreaInput
            form={formEdit}
            name="notes"
            label="My Story"
            placeholder="Notes"
            onChange={() => setIsFormTouched(true)}
            rows={4}
          />
        </Col>
      </Row>
    </div>
  );

  const birthIntakeForm = (
    <div>
      <Row justify="space-between" align="top">
        <Col xs={24} sm={24} md={12}>
          <Row justify="start">
            <Col span={14} style={{ padding: '0px 10px' }}>
              <Form.Item
                name="birthDateFlag"
                style={{ marginBottom: 0 }}
                key={`${formAdd.getFieldValue('birthDateFlag')}-key`}
                initialValue=""
              >
                <Segmented
                  size="middle"
                  value={ageType}
                  style={{
                    margin: '0px', marginTop: '0px', padding: '3px',
                  }}
                  onChange={(value: any) => setAgeType(value)}
                  options={[{ label: 'Approximate Age', value: '' }, { label: 'Actual Birth Date', value: 'actualAge' }]}
                />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Row justify="start">
            <Col style={{ padding: '0px 10px' }} sm={formAdd.getFieldValue('birthDateFlag') ? 15 : 24} xs={24}>
              {(formAdd.getFieldValue('birthDateFlag')) ? (
                <Form.Item
                  name="birthDate"
                  style={{ marginBottom: 0 }}
                  className="hide-label"
                  key={`${formAdd.getFieldValue('birthDateFlag')}-key`}
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue('birthDateFlag'),
                      validator() {
                        // const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                        const [flag, date] = [getFieldValue('birthDateFlag'), getFieldValue('birthDate')];
                        if ((flag && date) || !flag) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Birth Date must be specified'));
                      },
                    }),
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} value={formAdd.getFieldValue('birthDate')} onChange={(value) => formAdd.setFieldValue('birthDate', value)} format={formatDateByCountry(countryCode || '')} disabledDate={disabledDate} />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="approxAge"
                    label="Approximate Age"
                    className="hide-label"
                    style={{ marginBottom: 10 }}
                    key={formAdd.getFieldValue('yrs') + formAdd.getFieldValue('mos')}
                    rules={[
                      ({ getFieldValue }) => ({
                        required: !getFieldValue('birthDateFlag'),
                        validator() {
                          const actualDataflag = getFieldValue('birthDateFlag');
                          if (actualDataflag) {
                            return Promise.resolve();
                          }
                          const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                          const birthDate = dayjs().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
                          if (!birthDate) {
                            return Promise.reject(new Error('At least fill any one input'));
                          }
                          const [flag] = [getFieldValue('birthDateFlag')];
                          if (flag || (!flag && (yrs > 0 || mos > 0 || days > 0))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Approximate Age must be specified'));
                        },
                      }),
                    ]}
                  >
                    <Row>
                      <Col style={{ paddingRight: '4px', width: '30%' }}>
                        <Form.Item name="yrs" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="yrs"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ padding: '0px 2px', width: '34%' }}>
                        <Form.Item name="mos" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="mos"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      {/* <Col style={{ paddingLeft: '4px', width: '36%' }}>
                        <Form.Item name="days" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="days"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col> */}
                    </Row>
                  </Form.Item>
                  <p style={{ color: '#F57D33', fontSize: '12px' }}>
                    Note: If you enter an approximate age TYR will compute an approximate birthdate.
                  </p>
                </>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <AreaInput
            form={formAdd}
            name="birthNote"
            label="Birth Notes"
            placeholder="Birth notes"
            rows={4}
            onChange={() => setIsFormTouched(true)}
          />
        </Col>
      </Row>
    </div>
  );

  const milestoneIntakeForm = (
    <div>
      <Row justify="start">
        <Col xs={24} sm={5}>
          <DateInput
            name="intakeDate"
            label="Date of Intake"
            placeholder="Intake Date"
            initialValue={dayjs()}
            className="hide-label"
            rules={[
              ({ getFieldValue }: any) => ({
                required: true,
                type: 'date',
                validator(_: any, value: any) {
                  if (!value) {
                    return Promise.reject(new Error('Enter date of intake'));
                  }
                  const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                  const actualBirthDate = getActualBirthdate(yrs, mos, days);
                  const isBirthDate = getFieldValue('birthDateFlag');
                  if (isBirthDate && (getFieldValue('birthDate') >= value)) {
                    return Promise.reject(new Error('Intake date must be greater or same as Birth Date'));
                  }
                  if (!isBirthDate && (actualBirthDate >= value)) {
                    return Promise.reject(new Error('Intake date must be greater or same as Birth Date'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            onChange={(value: any) => setAnimalForm({ ...animalForm, intakeDate: value })}
            disabledDate={disabledDate}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <DropdownInput
            name="acquisitionWayId"
            label="How Acquired"
            rules={[{ required: true, message: 'How Acquired is required' }]}
            ref={(ref: any) => (firstError === 'acquisitionWayId') && ref && ref.focus()}
            placeholder="How Acquired"
            onChange={(data: any) => setCurrentAcquistionWayId(data)}
            dataList={howAcquired}
            keyName="acquisitionWayName"
            isRequired
            dropdownRender={(menu: any) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <QuickAddForm
                  type="howAcquired"
                  visible={visible}
                  setReminderType={null}
                  reminderType="howAcquired"
                  getAcquisitionWayCall={getAcquisitionWayCall}
                />
              </>
            )}
          />
        </Col>
        {[aqusitionNameToId['Owner Surrender'], aqusitionNameToId['Public Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId) && (
          <>
            <Col span={24} style={{ marginBottom: '', padding: '0px 10px' }}>
              <PCOMinifiedScreen tableHeight={20} setFirstError={setFirstError} />
            </Col>
            <Col span={24} style={{ marginBottom: '20px' }}>
              <Form.Item
                name="personOrRescueId"
                key={currentAcquistionWayId}
                style={{ minHeight: '0px !important', margin: '10px 10px' }}
              // rules={[
              //   {
              //     required: [aqusitionNameToId['Owner Surrender'], aqusitionNameToId?.Person].includes(currentAcquistionWayId),
              //     message: "Owner's name is required",
              //   },
              // ]}
              >
                <Select
                  style={{ display: 'none' }}
                  disabled
                  ref={(ref) => (firstError === 'personOrRescue') && ref && ref.focus()}
                  placeholder="Select a Person or Rescue"
                  value={(parseInt(selectedPcoId, 10) > 1) ? selectedPcoId : null}
                >
                  {pcoList.map((data: any) => (
                    <Option
                      key={data?.id}
                      value={data?.id}
                      onChange={() => forceUpdate({})}
                    >
                      {`${data?.lastName} ${data?.firstName} / ${data?.street} / ${data?.city} / ${data?.state}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </>
        )}
        {(currentAcquistionWayId === aqusitionNameToId['Other Rescue/Shelter/Sanctuary']) && (
          <Col xs={24} sm={12} lg={8}>
            <DropdownInput
              // initialValue={otherRescueShelter[0]?.id}
              name="otherRescueShelterId"
              label="Other Rescue/Shelter/Sanctuary"
              rules={[
                { required: true, message: 'Rescue is required' },
              ]}
              ref={(ref: any) => (firstError === 'otherRescueShelterId') && ref && ref.focus()}
              placeholder="Select Other Rescue/Shelter/Sanctuary"
              keyName="lastNameOtherRescue"
              dataList={otherRescueShelter}
              isRequired
              dropdownRender={(menu: any) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <QuickAddForm
                    type="rescue"
                    visible={visible}
                    setReminderType={null}
                    reminderType="rescue"
                    getRescueCall={getRescueCall}
                  />
                </>
              )}
            />
          </Col>
        )}
        {!(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary']) && (
          <Col xs={24} sm={8}>
            <TextInput
              name="otherRescueID"
              label="ID No. at Other Rescue"
              disabled={(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary'])}
              placeholder="ID No. used at other rescue"
            />
          </Col>
        )}
        <Col xs={11} md={5}>
          <NumberInput
            key={formAdd.getFieldsValue()}
            name="amountPaid"
            label="Amount Paid By You"
            // style={{ marginBottom: '0px' }}
            placeholder="Amount Paid"
            rules={[
              ({ getFieldValue }: any) => ({
                type: 'number',
                validator(_: any, value: any) {
                  // Either amountPaid should be there or amountReceived
                  const amountPaid = getFieldValue('amountPaid');
                  const amountReceived = getFieldValue('amountReceived');
                  if (amountReceived) {
                    return Promise.resolve();
                  }
                  if (!amountPaid && !amountReceived) {
                    return Promise.resolve();
                  }
                  if (Number(amountPaid) && Number(amountReceived)) {
                    return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                  }
                  if (!Number(amountPaid) && !Number(amountReceived) && (amountPaid !== '0')) {
                    return Promise.reject(new Error('Amount Received By You must be numeric'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            prefix={(
              <DollarTwoTone rev={undefined} />
            )}
            isRequired
            type="number"
            onChange={() => { formAdd.setFieldValue('amountReceived', null); forceUpdate({}); }}
            disabled={formAdd.getFieldValue('amountReceived')}
            itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
            style={{ width: '100%' }}
            min={0}
          />
        </Col>
        <Col span={1}>
          <Row align="middle" justify="center" style={{ height: '32px' }}>OR</Row>
        </Col>
        <Col xs={12} md={5}>
          <NumberInput
            key={formAdd.getFieldsValue()}
            name="amountReceived"
            label="Amount Received By You"
            placeholder="Amount Received"
            rules={[
              ({ getFieldValue }: any) => ({
                type: 'number',
                validator(_: any, value: any) {
                  // Either amountPaid should be there or amountReceived
                  const amountPaid = getFieldValue('amountPaid');
                  const amountReceived = getFieldValue('amountReceived');
                  if (amountPaid) {
                    return Promise.resolve();
                  }
                  if (!amountPaid && !amountReceived) {
                    return Promise.resolve();
                  }
                  if (Number(amountPaid) && Number(amountReceived)) {
                    return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                  }
                  if (!Number(amountPaid) && !Number(amountReceived)) {
                    return Promise.reject(new Error('Amount Received By You must be numeric'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            prefix={(
              <DollarTwoTone rev={undefined} />
            )}
            isRequired
            type="number"
            onClick={() => setFirstError('')}
            onChange={() => { formAdd.setFieldValue('amountPaid', null); forceUpdate({}); }}
            disabled={formAdd.getFieldValue('amountPaid')}
            itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
            style={{ width: '100%' }}
            min={0}
          />
        </Col>
        <Col xs={24} md={13}>
          <AreaInput
            form={formAdd}
            name="intakeNote"
            label="Intake Notes"
            rows={4}
            placeholder="Notes"
            onChange={() => setIsFormTouched(true)}
          />
        </Col>
      </Row>
    </div>
  );

  const steps = [
    {
      title: isMobile ? 'Detail' : 'Animal Detail',
      content: animalDetailForm,
    },
    {
      title: isMobile ? 'Birth' : 'Birth Milestone',
      content: birthIntakeForm,
    },
    {
      title: isMobile ? 'Intake' : 'Intake Milestone',
      content: milestoneIntakeForm,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const next = async () => {
    try {
      await formAdd.validateFields();
      const feildValue = formAdd.getFieldsValue();
      setAnimalForm({ ...animalForm, ...feildValue });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      setOpen(1);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const modalContent = (
    <Form
      id="animal-form"
      form={formAdd}
      onFinish={() => onSave()}
      name="animal-form"
      scrollToFirstError
      validateMessages={validateMessages}
      size={'middle' as SizeType}
    >
      <Steps current={currentStep} items={items} size={isMobile ? 'small' : 'default'} direction="horizontal" responsive={false} />
      <div className="animals-add-modal-container">{steps[currentStep].content}</div>
    </Form>
  );

  const modalContentForEdit = (
    <Form
      id="animal-form-edit"
      className={`${cssPrefix}__form`}
      form={formEdit}
      onFinish={() => handleUpdate()}
      name="animal-form-edit"
      scrollToFirstError
      validateMessages={validateMessages}
      size={'middle' as SizeType}
    >
      {animalDetailEditForm}
    </Form>
  );

  const footerContent = [
    (isFormTouched || formAdd.isFieldsTouched()) ? (
      <Button
        onClick={() => setConfirmModal(true)}
        style={{ margin: '6px 0px' }}
        key="back-popup"
      >
        Cancel
      </Button>
    ) : (
      <Button
        onClick={() => {
          setImageState('');
          formAdd.resetFields();
          formEdit.resetFields();
          props.handleCancel();
        }}
        style={{ margin: '6px 0px' }}
        key="back"
      >
        Cancel
      </Button>
    ),
    (currentStep > 0 && (
      <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
        Previous
      </Button>
    )),
    (currentStep < steps.length - 1 && (
      <Popover
        ref={popupRefNext}
        content={(
          <div>
            <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
            Correct highlighted fields
          </div>
        )}
        open={open === 1}
      >
        <Button type="primary" onClick={() => next()}>
          Next
        </Button>
      </Popover>
    )),
    ((currentStep === steps.length - 1) && (
      <Popover
        ref={popupRefSaveClone}
        content={(
          <div>
            <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
            Correct highlighted fields
          </div>
        )}
        open={open === 2}
      >
        <Button
          style={{ display: editRecord ? 'none' : 'inline' }}
          key="saveAndClone"
          type="primary"
          loading={loading}
          onClick={async () => {
            try {
              await formAdd.validateFields();
              setSaveAndClone(true);
              formAdd.submit();
            } catch (error) {
              setOpen(2);
              setTimeout(() => {
                setOpen(false);
              }, 1000);
            }
          }}
        >
          Save and Clone
          {saveAndClone && addAnimalLoading && <LoadingOutlined rev={undefined} spin />}
        </Button>
      </Popover>
    )),
    ((currentStep === steps.length - 1) && (
      <Popover
        ref={popupRefSaveAddAnother}
        content={(
          <div>
            <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
            Correct highlighted fields
          </div>
        )}
        open={open === 3}
      >
        <Button
          style={{ display: editRecord ? 'none' : 'inline' }}
          key="saveAnother"
          type="primary"
          loading={loading}
          onClick={async () => {
            try {
              await formAdd.validateFields();
              setSaveAnother(true);
              formAdd.submit();
            } catch (error) {
              setOpen(3);
              setTimeout(() => {
                setOpen(false);
              }, 1000);
            }
          }}
        >
          Save and Add Another
          {saveAnother && addAnimalLoading && <LoadingOutlined rev={undefined} spin />}
        </Button>
      </Popover>
    )),
    ((currentStep === steps.length - 1) && (
      <Popover
        ref={popupRefSave}
        content={(
          <div>
            <CloseCircleFilled style={{ color: '#FF4D4F', padding: '0px 4px' }} rev={undefined} />
            Correct highlighted fields
          </div>
        )}
        open={open === 4}
      >
        <Button
          form="animal-form"
          key="submit"
          type="primary"
          htmlType="submit"
          style={{ margin: '6px 10px' }}
          onClick={async () => {
            try {
              await formAdd.validateFields();
            } catch (error) {
              setOpen(4);
              setTimeout(() => {
                setOpen(false);
              }, 1000);
            }
          }}
          loading={loading}
        >
          Save
          {(!saveAndClone && !saveAnother) && (updateAnimalLoading || addAnimalLoading) && <LoadingOutlined rev={undefined} spin />}
        </Button>
      </Popover>
    )),
  ];

  const footerContentForEdit = [
    (isFormTouched) ? (
      <Button
        onClick={() => {
          setImageState('');
          formAdd.resetFields();
          formEdit.resetFields();
          props.handleCancel();
        }}
        key="back-popup"
      >
        Cancel
      </Button>
    ) : (
      <Button
        onClick={() => {
          setImageState('');
          formAdd.resetFields();
          formEdit.resetFields();
          props.handleCancel();
        }}
        key="back"
      >
        Cancel
      </Button>
    ),
    <Button
      form="animal-form-edit"
      key="submit"
      type="primary"
      htmlType="submit"
      loading={loading}
    >
      Update
      {(!saveAndClone && !saveAnother) && (updateAnimalLoading || addAnimalLoading) && <LoadingOutlined rev={undefined} spin />}
    </Button>,
  ];

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        key={editRecord}
        modalVisible={visible}
        setModalVisible={setModalVisible}
        onCancel={onCancel}
        modalTitle={modalTitle}
        footerContent={editRecord ? footerContentForEdit : footerContent}
        modalContent={editRecord ? modalContentForEdit : modalContent}
        isNotClosable
        size="lg"
      />
      <ConfirmModal
        key={`confirm-modal-${confirmModal}`}
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Do you want to save your changes?"
        onConfirmClick={async () => {
          try {
            setConfirmModal(false);
            // eslint-disable-next-line no-nested-ternary
            (currentStep < steps.length - 1) ? next() : (editRecord ? handleUpdate() : formAdd.submit());
          } catch (error) {
            console.log('Validation error:', error);
          }
        }}
        onCustomCancel={() => {
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
          formAdd.resetFields();
          formEdit.resetFields();
          props.handleCancel();
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};
