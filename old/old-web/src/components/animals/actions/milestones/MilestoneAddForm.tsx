/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import {
  Modal, Button, Row, Col, DatePicker, Form, Radio, Popover,
} from 'antd';
import {
  CalendarTwoTone, CloseCircleFilled, DollarTwoTone, ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayJs from 'dayjs';
import { startCase } from 'lodash';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { formatDateByCountry } from 'src/utils/common';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import PcoDetailCard from 'src/shared/components/PcoDetailCard';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import alertMessage from 'src/shared/constants/alert.json';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import NumberInput from 'src/shared/components/Inputs/NumberInput';
import PCOMinifiedScreen from '../../components/minifiedPcoScreen';
import RescueShelterMinified from '../../components/minifiedRescueShelter';
import './Milestone.less';

interface AnimalMilestoneProps {
  visible: boolean,
  setVisible: any,
  animalMilestoneList: any,
  selectedAnimal?: any,
  addAnimalMilestoneListCall: any,
  selectedPcoId?: any,
  animalDetail?: any,
  getAnimalListCall?: any,
  filterData?: any,
  setSelectedPco: any,
  addAnimalMilestoneLoading?: boolean,
}

const cssPrefix = 'milestone';

// eslint-disable-next-line
export const MilestoneAddForm = (props: AnimalMilestoneProps) => {
  const {
    visible, setVisible, animalMilestoneList, selectedAnimal, addAnimalMilestoneListCall, selectedPcoId,
    animalDetail, getAnimalListCall, filterData, addAnimalMilestoneLoading, setSelectedPco,
  } = props;

  const [form] = Form.useForm();
  const [firstError, setFirstError] = useState<any>('');
  const [milestoneType, setMilestoneType] = useState<any>('');
  const [selectedRadio, setSelectedRadio] = useState('');
  const [selectedRescueShelter, setSelectedRescueShelter] = useState<any>('');
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [milestoneTypeOptions, setMilestoneTypeOptions] = useState<any>([
    { label: 'Select a milestone type', value: '', id: '' },
    { label: 'Adoption', value: 'adoption', id: 'adoption' },
    { label: 'Adoption Return', value: 'adoption-return', id: 'adoption-return' },
    { label: 'Foster', value: 'foster', id: 'foster' },
    { label: 'Foster Return', value: 'foster-return', id: 'foster-return' },
    { label: 'Lost', value: 'lost', id: 'lost' },
    { label: 'Found', value: 'found', id: 'found' },
    { label: 'Released', value: 'released', id: 'released' },
    { label: 'Death', value: 'death', id: 'death' },
    { label: 'Returned to Owner', value: 'returned-to-owner', id: 'returned-to-owner' },
    { label: 'ReIntake', value: 'reintake', id: 'reintake' },
    { label: 'Transfer', value: 'transfer', id: 'transfer' },
  ]);

  const popupRefAddMilestone: any = useRef('popup-ref-add-milestone');
  const countryCode = localStorage.getItem('countryCode');

  useEffect(() => {
    form.setFieldValue('rescueShelterPcoId', selectedPcoId?.id || '');
  }, [selectedPcoId]);

  useEffect(() => {
    form.setFieldValue('rescueShelterPcoId', selectedRescueShelter || '');
  }, [selectedRescueShelter]);

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

  const enableOptions = (optionsArray: any) => {
    const newMilestoneTypeOptions: String[] = [];
    milestoneTypeOptions.forEach((milestone: any) => {
      if (optionsArray.includes(milestone?.value)) {
        newMilestoneTypeOptions.push({ ...milestone, disabled: false });
      } else {
        newMilestoneTypeOptions.push({ ...milestone, disabled: true });
      }
    });
    return newMilestoneTypeOptions;
  };

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let lastMilestone = selectedAnimal?.animalDetails?.[selectedAnimal?.animalDetails?.length - 1]?.lastMilestone;
    lastMilestone = lastMilestone?.toLowerCase();

    if (lastMilestone === 'intake' || lastMilestone === 'adoption-return' || lastMilestone === 'found' || lastMilestone === 'reintake') {
      const enabledOptions = enableOptions(['adoption', 'foster', 'lost', 'released', 'death', 'returned-to-owner', 'transfer']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'adoption') {
      const enabledOptions = enableOptions(['adoption-return', 'death', 'reintake']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'foster') {
      const enabledOptions = enableOptions(['adoption', 'foster-return', 'lost', 'released', 'death', 'returned-to-owner', 'transfer']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'lost') {
      const enabledOptions = enableOptions(['found']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'released') {
      const enabledOptions = enableOptions(['death', 'intake']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'returned-to-owner') {
      const enabledOptions = enableOptions(['reintake']);
      setMilestoneTypeOptions(enabledOptions);
    } else if (lastMilestone === 'transfer') {
      const enabledOptions = enableOptions(['reintake']);
      setMilestoneTypeOptions(enabledOptions);
    }
    form.setFieldValue('amountPaidFee', 0);
    if (!visible) {
      setSelectedRadio('');
      form.resetFields();
    }
  }, [visible]);

  const findLatestDate = (tempList: any) => {
    if (!tempList?.[0]) {
      return tempList;
    }
    const maxAge = Math.max(...tempList?.map((obj: any) => dayJs(obj.lastMilestoneDate).unix()));
    const latestDate = tempList?.filter((obj: any) => dayJs(obj.lastMilestoneDate).unix() === maxAge);
    return dayJs(latestDate?.[0]?.lastMilestoneDate).format('MM/DD/YYYY');
  };

  const onCancel = () => {
    // if (!form?.isFieldsTouched()) {
    //   setVisible(false);
    //   return;
    // }
    // Modal.confirm({
    //   title: 'Do you want to save your changes?',
    //   icon: <ExclamationCircleOutlined rev={undefined} />,
    //   okText: 'Yes',
    //   okType: 'danger',
    //   cancelText: 'No',
    //   onOk() {
    //     form?.submit();
    //   },
    //   onCancel() {
    //     setVisible(false);
    //   },
    // });
    if (isFormTouched) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      setVisible(false);
    }
  };

  const addMilestoneClick = () => {
    if (!milestoneType) {
      setAlertText('Please select a milestone type');
      setOpen(true);
      setTimeout(() => { setOpen(false); }, 1000);
      return;
    }

    let pcoId;

    if (['lost', 'found', 'released', 'reintake', 'death', 'transfer'].includes(milestoneType)) {
      pcoId = 1;
    } else if (['foster-return', 'adoption-return'].includes(milestoneType)) {
      pcoId = selectedAnimal?.animalDetails?.[0]?.pco?.id;
    } else {
      pcoId = selectedPcoId?.id;
    }

    addAnimalMilestoneListCall({
      ids: selectedAnimal?.ids,
      // pcoId: selectedPcoId,
      // milestoneType,
      animalMilestoneVm: {
        pcoId,
        milestoneType,
        ...form.getFieldsValue(),
        otherRescueShelterId: selectedRescueShelter || 0,
      },
    }, () => {
      setSelectedPco && setSelectedPco('');
      getAnimalListCall && getAnimalListCall({
        ...filterData,
      }, () => {

      });
      setVisible(false);
    });
  };

  useEffect(() => {
    console.log(selectedRescueShelter?.id, '------------|||||');
  }, [selectedRescueShelter?.id]);

  const isMobile = window.innerWidth <= 768;
  const modalSize = (!['foster-return', 'lost', 'found', 'released', 'reintake', 'death'].includes(milestoneType)) ? 'md' : 'sm';

  const footerContent = [
    <Button
      key="back"
      onClick={() => onCancel()}
    >
      Cancel
    </Button>,
    <Popover
      ref={popupRefAddMilestone}
      content={(
        <div>
          <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
          {alertText}
        </div>
      )}
      open={open}
    >
      <Button
        className="ftr-button-primary"
        form="animal-milestone-form"
        key="submit"
        htmlType="submit"
        loading={addAnimalMilestoneLoading}
        onClick={async () => {
          try {
            await form.validateFields();
          } catch (error) {
            setAlertText(alertMessage?.validation_error_message);
            setOpen(true);
            setTimeout(() => { setOpen(false); }, 1000);
          }
        }}
      >
        Save
      </Button>
    </Popover>,
  ];
  const modalTitle = (<span className={`${cssPrefix}__modal__title`}>Add New Milestone</span>);
  const modalContent = (
    <div>
      <Row>
        <Col span={24}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} cardWidth={32} />
        </Col>
      </Row>
      <Row style={{ fontSize: '16px', marginLeft: '4px', marginTop: '' }}>
        <Col lg={16}>
          Last Milestone :
          <span style={{ padding: '0px 4px 0px 4px' }}>
            {startCase(selectedAnimal?.animalDetails?.[0]?.lastMilestone || '')}
          </span>
          on
          {' '}
          <CalendarTwoTone rev={undefined} />
          <span style={{ padding: '0px 4px 0px 4px' }}>
            {startCase(dayJs(selectedAnimal?.animalDetails?.[0]?.lastMilestoneDate).format('MMM DD YYYY') || '')}
          </span>
        </Col>
      </Row>
      <br />
      {/* <Row style={{ paddingTop: '4px' }}>

      </Row> */}
      {/* <br /> */}
      <Form id="animal-milestone-form" form={form} scrollToFirstError validateMessages={validateMessages} onFinish={() => addMilestoneClick()}>
        <Row justify="space-around" style={{ minHeight: '40px' }}>
          <Col xs={24} lg={modalSize === 'sm' ? 8 : 6}>
            {isMobile ? (
              <Row>
                <Col span={24}>
                  <DropdownInput
                    label="Milestone"
                    onChange={(value: any) => { setMilestoneType(value); setSelectedRadio(value); setIsFormTouched(true); }}
                    dataList={milestoneTypeOptions}
                    keyName="label"
                    value={milestoneType}
                    placeholder="select a milestone"
                    isRequired
                  />
                </Col>
              </Row>
            ) : (
              milestoneTypeOptions?.map((data: any) => {
                if (!data.value) {
                  return (<></>);
                }
                return (
                  <Row>
                    <Radio
                      value={data?.value}
                      checked={selectedRadio === data?.value}
                      onChange={(e) => { !data?.disabled && setSelectedRadio(e.target.value); !data?.disabled && setMilestoneType(e.target.value); setIsFormTouched(true); }}
                      disabled={data?.disabled}
                    >
                      <span className="radio-label" style={{ fontWeight: (selectedRadio === data?.value) ? 800 : 300 }}>{data?.label}</span>
                    </Radio>
                  </Row>
                );
              })
            )}
          </Col>
          <Col xs={24} lg={modalSize === 'sm' ? 16 : 18}>
            {!selectedRadio && (
              <Row align="middle" justify="center" style={{ height: isMobile ? '200px' : '100%', backgroundColor: '#F2F2F2', margin: '0px 10px' }}>
                <div>
                  Please select a milestone on the
                  {isMobile ? ' top' : ' left'}
                  <br />
                  <Row justify="center">
                    {isMobile ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="26" width="26" viewBox="0 0 448 512">
                        <path d="M105.6 83.2v86.2a115.5 115.5 0 0 0 -22.4-2.2c-47.9 0-83.2 35.1-83.2 92 0 45.3 48.5 57 78.8 75.7 12.4 7.7 23.3 17 33.3 25.9l.1 .1 .1 .1C129.8 376.3 136 384.2 136 391.2v2.7c-5 5.7-8 13.5-8 22.1v64c0 17.7 12.9 32 28.8 32h230.4c15.9 0 28.8-14.3 28.8-32v-64c0-8.6-3-16.4-8-22.1V391.2c0-28.7 40-67.1 40-127.2v-21.3c0-62.5-38.7-98.8-91.1-99.9-17.8-12.5-40.8-18.5-62.8-16A93.1 93.1 0 0 0 272 118.8V83.2C272 37.8 234.4 0 188.8 0c-45.1 0-83.2 38.1-83.2 83.2zm118.4 0v91c14.7-12.8 42.8-14.4 61.1 5 19.6-11.2 45.6-1.7 53.6 12.9 39.1-6.5 61.3 10.1 61.3 50.6V264c0 45.5-35.9 77.2-39.7 120H183.6c-3-25.2-21.2-43-39.6-59.1-12.7-11.3-25.3-21.7-39.9-30.8C80.7 279.6 48 268 48 259.2c0-23.4 8.8-44 35.2-44 35.2 0 53.1 26.4 70.4 26.4V83.2c0-18.4 16.5-35.2 35.2-35.2 19 0 35.2 16.2 35.2 35.2zM352 424c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z" />
                      </svg>
                    ) : (
                      <svg style={{ marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" height="26" width="26" viewBox="0 0 512 512">
                        <path d="M0 220.8C0 266.4 37.8 304 83.2 304h35.6a93.1 93.1 0 0 0 7.9 22.1c-2.5 22 3.5 45 16 62.8C143.9 441.3 180.2 480 242.7 480H264c60.1 0 98.5-40 127.2-40h2.7c5.7 5 13.5 8 22.1 8h64c17.7 0 32-12.9 32-28.8V188.8c0-15.9-14.3-28.8-32-28.8h-64c-8.6 0-16.4 3-22.1 8H391.2c-7 0-14.9-6.2-30.2-23.7l-.1-.1-.1-.1c-8.9-9.9-18.1-20.8-25.9-33.3C316.2 80.5 304.5 32 259.2 32c-56.9 0-92 35.3-92 83.2 0 8 .8 15.5 2.2 22.4H83.2C38.1 137.6 0 175.7 0 220.8zm48 0c0-18.7 16.8-35.2 35.2-35.2h158.4c0-17.3-26.4-35.2-26.4-70.4 0-26.4 20.6-35.2 44-35.2 8.8 0 20.4 32.7 34.9 56.1 9.1 14.6 19.5 27.2 30.8 39.9 16.1 18.4 33.8 36.6 59.1 39.6v176.8C341.2 396.1 309.5 432 264 432h-21.3c-40.5 0-57.1-22.2-50.6-61.3-14.6-8-24.2-34-12.9-53.6-19.4-18.2-17.8-46.4-5-61.1H83.2C64.2 256 48 239.8 48 220.8zM448 360c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z" />
                      </svg>
                    )}
                  </Row>
                </div>
              </Row>
            )}
            {selectedRadio && (
              <div>
                {(['adoption-return', 'foster-return'].includes(milestoneType)) && (
                  <div style={{ padding: '0px 10px' }}>
                    {`${milestoneType === 'adoption-return' ? 'Adopted' : 'Fostered'} By :`}
                    <PcoDetailCard isModal pcoDetails={selectedAnimal?.animalDetails?.[0]?.pco} />
                    <br />
                  </div>
                )}
                <div style={{ padding: '0px 10px' }}>
                  {(!['adoption-return', 'foster-return', 'lost', 'found', 'released', 'reintake', 'death', 'transfer'].includes(milestoneType)) && <PCOMinifiedScreen setFirstError={setFirstError} />}
                  {(milestoneType === 'transfer') && <RescueShelterMinified selectedRow={selectedRescueShelter?.id} setSelectedRow={setSelectedRescueShelter} />}
                </div>
                {!['adoption-return', 'foster-return', 'lost', 'found', 'released', 'reintake', 'death'].includes(milestoneType) && (
                  <TextInput
                    name="rescueShelterPcoId"
                    key={selectedRescueShelter || selectedPcoId}
                    style={{ minHeight: '0px !important', padding: '0px', display: 'none' }}
                    rules={[
                      {
                        required: (milestoneType === 'transfer'),
                        message: `${(milestoneType === 'transfer') ? 'Rescue Shelter' : 'Person'} is required`,
                      },
                    ]}
                    onChange={() => setIsFormTouched(true)}
                    isRequired
                    value={selectedPcoId || selectedRescueShelter}
                  />
                )}
                <Row>
                  <Col xs={24} md={(modalSize === 'sm') ? 14 : 12} style={{ padding: '0px 10px' }}>
                    <Form.Item className="hide-label" required name="milestoneDate" label="Milestone Date" rules={[{ required: true }]}>
                      <DatePicker onChange={() => setIsFormTouched(true)} placeholder={milestoneType === 'death' ? 'Date of Death' : 'Milestone Date'} style={{ width: '100%' }} format={formatDateByCountry(countryCode || '')} disabledDate={(date) => !dayJs().isAfter(date) || !dayJs(findLatestDate(selectedAnimal?.animalDetails)).isBefore(date)} />
                    </Form.Item>
                  </Col>
                  {(!['lost', 'found', 'released', 'reintake', 'death', 'foster', 'foster-return'].includes(milestoneType)) && (
                    <Col flex="1 1">
                      <NumberInput
                        style={{ margin: '0px', width: '100%' }}
                        name="amountPaidFee"
                        // eslint-disable-next-line no-nested-ternary
                        label={`${(milestoneType === 'adoption-return') ? 'Refund Amount' : ((milestoneType === 'adoption') ? 'Adoption Fee' : 'Amount')} (if any)`}
                        // eslint-disable-next-line no-nested-ternary
                        placeholder={`${(milestoneType === 'adoption-return') ? 'Refund Amount' : ((milestoneType === 'adoption') ? 'Adoption Fee' : 'Amount')} (if any)`}
                        onChange={() => setIsFormTouched(true)}
                        type="number"
                        isRequired
                        prefix={(
                          <DollarTwoTone rev={undefined} />
                        )}
                      />
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col span={24}>
                    <AreaInput
                      form={form}
                      name="notes"
                      label="Notes"
                      placeholder="Notes"
                      onChange={() => setIsFormTouched(true)}
                      rules={[{ required: (['adoption-return', 'death'].includes(milestoneType)), message: 'Notes are required' }]}
                      isRequired={(['adoption-return', 'death'].includes(milestoneType))}
                      rows={3}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );

  return (
    <div className="">
      <TyrModal
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        onCancel={onCancel}
        size={modalSize}
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

export default MilestoneAddForm;
