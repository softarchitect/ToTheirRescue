/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Button,
  Col, DatePicker, Divider, Form, Input, Row, Select,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import '../AnimalsAddModal.less';
import dayjs from 'dayjs';
import { DollarTwoTone, PlusOutlined } from '@ant-design/icons';
import MilestoneDatePickerCustom from 'src/shared/components/Inputs/MilestoneDatePickerCustom';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import NumberInput from 'src/shared/components/Inputs/NumberInput';
import QuickAddForm from 'src/shared/components/QuickAddForm';
import { apiCall } from '../../../../shared/api/apiWrapper';
import PCOMinifiedScreen from '../minifiedPcoScreen';

interface AnimalBirthMilestoneProps {
  form: any;
  firstError: any;
  setFirstError: any;
  animalMilestoneList: any;
  setIsFormTouched?: any;
  selectedPcoId: number;
  visible: boolean;
  pcoList: [];
}

interface AcquisitionWay {
  id: string;
  acquisitionWayName: string;
}

const { Option } = Select;
const cssPrefix = 'animals-add-modal';

export const AnimalIntakeMilestone = (props: AnimalBirthMilestoneProps) => {
  // eslint-disable-next-line no-empty-pattern
  const {
    form, firstError, setFirstError, animalMilestoneList, setIsFormTouched, selectedPcoId, pcoList, visible,
  } = props;
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [, forceUpdate] = useState({});
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [howRequiredOtherToggle, setHowRequiredOtherToggle] = useState(false);
  const [currentAcquistionWayId, setCurrentAcquistionWayId] = useState('');

  useEffect(() => {
    forceUpdate({});
  }, []);

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
    getAcquisitionWayCall();
    getRescueCall();
  }, []);

  useEffect(() => {
    setCurrentAcquistionWayId(animalMilestoneList[1]?.acquisitionWayId || '');
  }, [animalMilestoneList]);

  useEffect(() => {
    form.setFieldValue('personOrRescueIdIntake', (selectedPcoId > 1) ? selectedPcoId : null);
  }, [selectedPcoId]);

  const isShowMinified = [aqusitionNameToId['Owner Surrender'], aqusitionNameToId['Public Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId);

  return (
    <div className="">
      <Row>
        <Col xs={24} md={isShowMinified ? 24 : 12}>
          <Row>
            <Col span={isShowMinified ? 12 : 24}>
              <MilestoneDatePickerCustom
                name="intakeDate"
                label="Date of Intake"
                placeholder="Intake Date"
                rules={[
                  ({ getFieldValue }: any) => ({
                    required: true,
                    type: 'date',
                    validator(_: any, value: any) {
                      if (!value) {
                        return Promise.reject(new Error('Enter Date in Intake'));
                      }
                      const birthDate = dayjs(animalMilestoneList?.[0]?.milestoneDate).format('MM-DD-yyyy');
                      const newIntakeDate = dayjs(value).format('MM-DD-yyyy');
                      if (dayjs(newIntakeDate).isBefore(birthDate)) {
                        return Promise.reject(new Error('Intake date must be greater than or same as Birth Date'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                onChange={() => setIsFormTouched(true)}
                milestoneType="intake"
                milestoneList={animalMilestoneList}
              />
            </Col>
            {isShowMinified && (
              <Col span={12}>
                <TextInput
                  name="otherRescueID"
                  label="ID No. at Other Rescue"
                  disabled={(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary'])}
                  placeholder="ID No. used at other rescue"
                  onChange={() => setIsFormTouched(true)}
                />
              </Col>
            )}
          </Row>
          <Row>
            <Col xs={24} sm={isShowMinified ? 12 : 24}>
              <DropdownInput
                initialValue={howAcquired[0]?.id}
                name="acquisitionWayId"
                label="How Acquired"
                rules={[{ required: true }]}
                ref={(ref: any) => (firstError === 'acquisitionWayId') && ref && ref.focus()}
                placeholder="istion Type"
                onChange={(data: any) => { setCurrentAcquistionWayId(data); setIsFormTouched(true); }}
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
            {isShowMinified && (
              <Col xs={24} sm={12}>
                <Row>
                  <Col span={11}>
                    <NumberInput
                      name="amountPaidFee"
                      label="Amount Paid By You"
                      placeholder="Paid"
                      onChange={() => setIsFormTouched(true)}
                      rules={[
                        ({ getFieldValue }: any) => ({
                          type: 'number',
                          validator(_: any, value: any) {
                            // Either amountPaid should be there or amountRecieved
                            const amountPaid = getFieldValue('amountPaidFee');
                            const amountRecieved = getFieldValue('amountRecieved');
                            if (amountRecieved) {
                              return Promise.resolve();
                            }
                            if (!amountPaid && !amountRecieved) {
                              return Promise.resolve();
                            }
                            if (Number(amountPaid) && Number(amountRecieved)) {
                              return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                            }
                            if (!Number(amountPaid) && !Number(amountRecieved)) {
                              return Promise.reject(new Error('Amount Received By You must be numeric'));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      isRequired
                      disabled={form.getFieldValue('amountRecieved')}
                      itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
                      style={{ width: '100%' }}
                      min={0}
                      prefix={(
                        <DollarTwoTone rev={undefined} />
                      )}
                    />
                  </Col>
                  <Col span={1}>
                    <Row align="middle" justify="center" style={{ paddingTop: '4px' }}>Or</Row>
                  </Col>
                  <Col span={12}>
                    <TextInput
                      name="amountRecieved"
                      label="Amount Received By You"
                      placeholder="Received"
                      onChange={() => setIsFormTouched(true)}
                      type="number"
                      rules={[
                        ({ getFieldValue }: any) => ({
                          type: 'number',
                          validator(_: any, value: any) {
                            // Either amountPaid should be there or amountRecieved
                            const amountPaid = getFieldValue('amountPaidFee');
                            const amountRecieved = getFieldValue('amountRecieved');
                            if (amountPaid) {
                              return Promise.resolve();
                            }
                            if (!amountPaid && !amountRecieved) {
                              return Promise.resolve();
                            }
                            if (Number(amountPaid) && Number(amountRecieved)) {
                              return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                            }
                            if (!Number(amountPaid) && !Number(amountRecieved)) {
                              return Promise.reject(new Error('Amount Received By You must be numeric'));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      disabled={form.getFieldValue('amountPaidFee')}
                      itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
                      style={{ width: '100%' }}
                      prefix={(
                        <DollarTwoTone rev={undefined} />
                      )}
                    />
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          <Row>
            <Col xs={24} lg={24} style={{ padding: '0px 10px' }}>
              {[aqusitionNameToId['Owner Surrender'], aqusitionNameToId['Public Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId) && (
                <>
                  <PCOMinifiedScreen tableHeight={20} setFirstError={setFirstError} />
                  <Col span={24} style={{ marginBottom: '20px' }}>
                    <Form.Item
                      name="personOrRescueIdIntake"
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
                        ref={(ref) => (firstError === 'personOrRescue') && ref && ref.focus()}
                        placeholder="Select a Person or Rescue"
                        value={(selectedPcoId > 1) ? selectedPcoId : null}
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
            </Col>
            {/* <PlusOutlined style={{ marginLeft: '10px', marginTop: '5px', cursor: 'pointer' }} />
              <EditOutlined style={{ marginLeft: '10px', marginTop: '5px', cursor: 'pointer' }} /> */}
          </Row>
          {(currentAcquistionWayId === aqusitionNameToId['Other Rescue/Shelter/Sanctuary']) && (
            <DropdownInput
              initialValue={otherRescueShelter[0]?.id}
              name="otherRescueShelterId"
              label="Other Rescue/Shelter/Sanctuary"
              rules={[
                { required: true },
              ]}
              ref={(ref: any) => (firstError === 'otherRescueShelterId') && ref && ref.focus()}
              placeholder="Select Other Rescue/Shelter/Sanctuary"
              dataList={otherRescueShelter}
              keyName="lastNameOtherRescue"
              onChange={() => setIsFormTouched(true)}
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
          )}
          {![aqusitionNameToId['Owner Surrender'], aqusitionNameToId['Public Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId) && (
            <TextInput
              name="otherRescueID"
              label="ID No. at Other Rescue"
              disabled={(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary'])}
              placeholder="ID No. used at other rescue"
              onChange={() => setIsFormTouched(true)}
            />
          )}
        </Col>
        <Col xs={24} md={isShowMinified ? 18 : 12}>
          {/* {[aqusitionNameToId['Owner Surrender'], aqusitionNameToId['Public Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId) && (
            <TextInput
              name="otherRescueID"
              label="ID No. at Other Rescue"
              disabled={(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary'])}
              placeholder="ID No. used at other rescue"
              onChange={() => setIsFormTouched(true)}
            />
          )} */}
          {!isShowMinified && (
            <Row>
              <Col span={11}>
                <NumberInput
                  name="amountPaidFee"
                  label="Amount Paid By You"
                  placeholder="Paid"
                  onChange={() => setIsFormTouched(true)}
                  type="number"
                  rules={[
                    ({ getFieldValue }: any) => ({
                      type: 'number',
                      validator(_: any, value: any) {
                        // Either amountPaid should be there or amountRecieved
                        const amountPaid = getFieldValue('amountPaidFee');
                        const amountRecieved = getFieldValue('amountRecieved');
                        if (amountRecieved) {
                          return Promise.resolve();
                        }
                        if (!amountPaid && !amountRecieved) {
                          return Promise.resolve();
                        }
                        if (Number(amountPaid) && Number(amountRecieved)) {
                          return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                        }
                        if (!Number(amountPaid) && !Number(amountRecieved) && (amountPaid !== '0')) {
                          return Promise.reject(new Error('Amount Received By You must be numeric'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  isRequired
                  disabled={form.getFieldValue('amountRecieved')}
                  itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
                  style={{ width: '100%' }}
                  min={0}
                  prefix={(
                    <DollarTwoTone rev={undefined} />
                  )}
                />
              </Col>
              <Col span={1}>
                <Row align="middle" justify="center" style={{ paddingTop: '4px' }}>Or</Row>
              </Col>
              <Col span={12}>
                <NumberInput
                  name="amountRecieved"
                  label="Amount Received By You"
                  placeholder="Received"
                  onChange={() => setIsFormTouched(true)}
                  type="number"
                  rules={[
                    ({ getFieldValue }: any) => ({
                      type: 'number',
                      validator(_: any, value: any) {
                        // Either amountPaid should be there or amountRecieved
                        const amountPaid = getFieldValue('amountPaidFee');
                        const amountRecieved = getFieldValue('amountRecieved');
                        if (amountPaid) {
                          return Promise.resolve();
                        }
                        if (!amountPaid && !amountRecieved) {
                          return Promise.resolve();
                        }
                        if (Number(amountPaid) && Number(amountRecieved)) {
                          return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                        }
                        if (!Number(amountPaid) && !Number(amountRecieved)) {
                          return Promise.reject(new Error('Amount Received By You must be numeric'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  isRequired
                  disabled={form.getFieldValue('amountPaidFee')}
                  itemStyle={{ margin: '0px 0px 20px 0px', padding: '0px 10px' }}
                  style={{ width: '100%' }}
                  prefix={(
                    <DollarTwoTone rev={undefined} />
                  )}
                />
              </Col>
            </Row>
          )}
          <AreaInput
            form={form}
            name="intakeNote"
            label="Intake Notes"
            rows={isShowMinified ? 4 : 4}
            placeholder="Notes"
            onChange={() => setIsFormTouched(true)}
          />
        </Col>
      </Row>
    </div>
  );
};
