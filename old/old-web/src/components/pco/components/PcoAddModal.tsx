/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useEffect, useState, useRef } from 'react';
import { FieldData } from 'rc-field-form/es/interface';
import {
  Button, Col, Form, Select, Modal, Row, Switch, Tooltip, Typography, Segmented, message,
} from 'antd';
import { kebabCase } from 'lodash';
import dayjs from 'dayjs';
import {
  InfoCircleOutlined, LoadingOutlined,
} from '@ant-design/icons';
import { WebsiteValidationTooltip } from 'src/shared/constants/tooltips.data';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import alertConstant from 'src/shared/constants/alert.json';
import countryToState from 'src/shared/constants/states.json';
import country from 'src/shared/constants/country.json';
import './PcoAddModal.less';
import CustomPhoneInput from 'src/shared/components/Inputs/CustomPhoneInput';
import SingleAvatarUpload from 'src/shared/components/Inputs/SingleAvatarUpload';
import { apiCall } from 'src/shared/api/apiWrapper';
import { PERSON, ORG } from 'src/components/pco/Pco.data';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const { Option } = Select;

export interface PcoAddModalProps {
  minifiedVersion: boolean;
  editRecord?: any;
  visible: boolean;
  addPcoLoading: boolean;
  updatePcoLoading: boolean;
  getPcoFilter: any;
  userCountryCode: String;
  setSearchKey: (searchKey: string) => void;
  setSearchKeyFinal: (searchKey: string) => void;
  setAddModalVisibility: (isVisible: boolean) => void;
  setEditRecord: (data: any) => void;
  addPCOCall: (data: object, callbackFunction: any) => void;
  updatePCOCall: (data: object, callbackFunction: any) => void;
  updatePCOAttachment?: (data: Object, callbackFunction: any) => void;
  getPcoListCall: (data: object, callbackFunction: any) => void;
  uploadImageCall?: any;
  deleteImageCall?: any,
  selectedPcoId?: any,
  setShowRecentlyAdded?: any,
  setSelectedPco: (data: any) => void;
  handleCancel: () => void;
  imageState: any,
  setImageState: any,
}

const cssPrefix = 'pco-add-modal';

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

interface CountryNameInterface {
  id: string;
  countryName: string;
}

export const PcoAddModal = (props: PcoAddModalProps) => {
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [existedImageUrl, setExistedImageUrl] = useState<any>();
  const [existedImageId, setExistedImageId] = useState<any>();
  const [entityType, setEntityType] = useState(PERSON);
  const [countryList, setCountryList] = useState(newCountryNameInterface);
  const [selectCountryIsoCode, setSelectCountryIsoCode] = useState<any>('');
  const [selectIsdCode, setSelectIsdCode] = useState<any>('');
  const [selectCountry, setSelectCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [saveAnother, setSaveAnother] = useState(false);
  const [flagReasonKey, setFlagReasonKey] = useState(false);
  const [currentImageState, setCurrentImageState] = useState<any>();
  const [confirmModal, setConfirmModal] = useState(false);
  // const [, forceUpdate] = useState({});
  // const [key, setKey] = useState(Date.now());

  const countryToStateConst: any = { ...countryToState };

  const [form] = Form.useForm();

  const {
    addPCOCall, updatePCOCall, getPcoListCall, setAddModalVisibility, addPcoLoading, updatePcoLoading, visible, editRecord, getPcoFilter, updatePCOAttachment,
    setEditRecord, userCountryCode, minifiedVersion, setSelectedPco, uploadImageCall, deleteImageCall, imageState, setImageState, setShowRecentlyAdded,
  } = props;

  useEffect(() => {
    console.log(confirmModal, '----------------||--', isFormTouched);
  }, [confirmModal, isFormTouched]);

  const onChange = () => {

  };

  useEffect(() => {
    if (!imageUrl) {
      return;
    }
    setIsFormTouched(true);
  }, [imageUrl]);

  useEffect(() => {
    if (!editRecord?.id) {
      return;
    }
    setSelectCountryIsoCode(editRecord?.countryISO2Code);
    apiCall(`artifact-attachment/get-artifactattachment-bypco/${editRecord?.id}`, 'GET', {})
      .then((resp: any) => {
        setExistedImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
        setExistedImageId(resp?.data?.data?.artifactAttachment?.id);
      });
  }, [editRecord]);

  const countryId = localStorage.getItem('countryId');

  const modalTitle: string = editRecord ? `Edit ${props.editRecord!.firstName} ${props.editRecord!.lastName}` : `Add Person${!minifiedVersion ? ', Company or Organization' : ''}`;

  const onEntityChange = (currentEntityType: string) => {
    setEntityType(currentEntityType);
    if (currentEntityType === ORG) {
      form.setFieldsValue({
        firstName: '',
        hospital: false,
        rescue: false,
      });
    } else {
      form.setFieldsValue({
        firstName: '',
        hospital: false,
        rescue: false,
      });
    }
    const updatedFields = form.getFieldsError()
      .filter((field) => field.errors.length > 0)
      .map((field) => ({ name: field.name, errors: [] }));
    form.setFields(updatedFields as unknown as FieldData[]);
  };

  const onChangeDropDown = (value: any) => {
    setIsFormTouched(true);
    setSelectCountry(value);
    form.setFieldValue('state', null);
    const countryByName = country?.byName as any;
    countryList?.forEach((data: any) => {
      if (data?.id === value) {
        const currentCountry = countryByName?.[data?.countryName as any];
        const byCountryCode = country?.byCountryCode as any;
        setSelectCountryIsoCode(countryByName?.[data?.countryName as any]);
        setSelectIsdCode(byCountryCode?.[currentCountry as any]?.stdCode);
      }
    });
  };

  useEffect(() => {
    onEntityChange(editRecord?.entityType || 'Person');
    // setKey(Date.now());
    setImageState('');
    setImageUrl('');
    form.setFieldsValue({ countryCode: userCountryCode });
    if (editRecord) {
      form.setFieldsValue({ ...editRecord });
      setSelectIsdCode(editRecord?.countryISDCode);
      setSelectCountryIsoCode(editRecord?.countryISO2Code);
    } else {
      form.setFieldValue('countryId', parseInt(localStorage.getItem('countryId') as any, 10));
      onChangeDropDown(parseInt(localStorage.getItem('countryId') as any, 10));
      form.setFieldValue('state', localStorage.getItem('stateCode') || '');
    }
    if (!visible) {
      // setImageState('');
      setExistedImageUrl('');
      setExistedImageId('');
      form.resetFields();
      setSelectIsdCode('');
      setSelectCountryIsoCode('');
      setEditRecord(null);
    }
  }, [visible]);

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryList(resp?.data?.data?.countries);
        }
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    const selectedCountryName = countryList.find(o => o.id == countryId);
    setSelectCountry(selectedCountryName?.countryName || '');
  }, [countryList]);

  const onSearch = (val: string) => {
    // const searchedCountries = countryList.filter((o) => {
    //   const regex = new RegExp(val, 'g');
    //   return (o.countryName.match(regex));
    // });
    // setCountryList([...searchedCountries]);
  };

  const onFlagChange = (flag: boolean) => {
    setFlagReasonKey(flag as any);
    if (!flag) {
      form.setFieldsValue({
        flagReason: '',
      });
    }
    // forceUpdate({});
  };

  const onSave = async ({ addAnother, forceAdd }: { addAnother?: boolean, forceAdd?: boolean } = { addAnother: false, forceAdd: false }) => {
    const data = form.getFieldsValue();
    await form.validateFields();

    const formData = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      street: data?.street,
      street2: data?.street2,
      city: data?.city,
      state: data?.state,
      zip: data?.zip,
      countryId: data?.countryId,
      phone: data?.phone,
      otherPhone: data?.otherPhone,
      email: data?.email,
      // eslint-disable-next-line no-unneeded-ternary
      mailList: data?.mailList ? true : false,
      website: data?.website,
      notes: data?.notes,
      entityType: entityType ?? data?.entityType,
      hospital: data?.hospital,
      rescue: data?.rescue,
      flag: data?.flag,
      flagReason: data?.flagReason || '',
    };

    addPCOCall({
      formData,
      forceAdd,
      addConfirmPco: (addPcoMessage: string) => (
        <div className="">
          <p>
            {addPcoMessage}
          </p>
          <Button type="primary" onClick={() => onSave({ addAnother: false, forceAdd: true })}>
            Add Anyway
            {addPcoLoading && <LoadingOutlined rev={undefined} spin />}
          </Button>
        </div>
      ),
    }, (response: any) => {
      setSelectedPco({ id: response?.id, pcoDetail: response?.pco });
      if (imageState) {
        uploadImageCall({
          imageState: imageState?.[0],
          pcoId: response?.id,
          entity: 'PCO',
          publicityRank: 0,
          attachmentDate: dayjs(),
          attachmentType: 'Photo',
          notShowSuccessAlert: true,
        }, (attachmentRes: any) => {
          setShowRecentlyAdded && setShowRecentlyAdded([{ ...response?.pco, attachments: [attachmentRes?.data?.attachment] }]);
        });
      }
      getPcoListCall({ ...getPcoFilter }, () => {

      });

      if (addAnother) {
        form.resetFields();
        setImageState('');
        setCurrentImageState('');
      } else {
        setAddModalVisibility(false);
      }
    });
  };

  const onFinishFailed = () => {
    message.error({
      content: alertConstant.validation_error_message,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const onUpdate = async () => {
    const data = form.getFieldsValue();
    await form.validateFields();

    const newEditRecord = {
      id: editRecord?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      street: data?.street,
      street2: data?.street2,
      city: data?.city,
      state: data?.state,
      zip: data?.zip,
      countryId: data?.countryId,
      phone: data?.phone,
      otherPhone: data?.otherPhone,
      email: data?.email,
      // eslint-disable-next-line no-unneeded-ternary
      mailList: data?.mailList ? true : false,
      website: data?.website,
      rescue: data?.rescue,
      hospital: data?.hospital,
      notes: data?.notes,
      entityType: data?.entityType,
      flag: data?.flag,
      flagReason: data?.flagReason || '',
      isDeleted: false,
    };

    updatePCOCall(newEditRecord, () => {
      setAddModalVisibility(false);
    });
  };

  const onCancel = () => {
    const isFormChanged = isFormTouched || form.isFieldsTouched();
    if (isFormChanged) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
      form.resetFields();
      props.handleCancel();
    }
  };

  const footerContent = [
    <Button key="back-pco" onClick={() => onCancel()}>
      Cancel
    </Button>,
    <Button
      style={{ display: (editRecord || minifiedVersion) ? 'none' : 'inline' }}
      key="save-another-pco"
      type="primary"
      // loading={loading}
      onClick={() => {
        setSaveAnother(true);
        form.validateFields();
        form.submit();
      }}
    >
      Save and Add Another
      {saveAnother && addPcoLoading && <LoadingOutlined rev={undefined} spin />}
    </Button>,
    <Button
      form="pco-form-add"
      htmlType="submit"
      key="submit-pco"
      type="primary"
      onClick={() => {
        setSaveAnother(false);
      }}
    >
      {editRecord ? 'Update' : 'Save'}
      {!saveAnother && (addPcoLoading || updatePcoLoading) && <LoadingOutlined rev={undefined} spin />}
    </Button>,
  ];

  const ModalContent = () => (
    <Form
      id="pco-form-add"
      // key={`form-${uniqueKey}`}
      className={`${cssPrefix}__form`}
      form={form}
      onFinish={() => { editRecord ? onUpdate() : onSave({ addAnother: saveAnother, forceAdd: false }); }}
      name="nest-messages-pco"
      validateMessages={validateMessages}
      onFinishFailed={onFinishFailed}
      scrollToFirstError={false}
      size="middle"
    >
      <div className="pco-add-modal-container">
        {!minifiedVersion && (
          <Row justify="center">
            <Segmented
              size="large"
              defaultValue={PERSON}
              value={entityType}
              style={{ marginBottom: 8, marginTop: '0px', padding: '6px' }}
              onChange={(value: any) => onEntityChange(value)}
              options={[{ label: 'Person', value: PERSON }, { label: 'Company Or Organization', value: ORG }]}
            />
          </Row>
        )}
        <br />
        <Row justify="space-between">
          <Col sm={(minifiedVersion || editRecord) ? 24 : 18} xs={24}>
            <Row>
              <Col sm={(minifiedVersion || editRecord) ? 8 : 12} xs={24}>
                <TextInput
                  name="firstName"
                  // key={uniqueKey}
                  disabled={entityType === ORG}
                  placeholder="First Name"
                  label="First Name"
                  onChange={() => setIsFormTouched(true)}
                  highlightInput
                />
              </Col>
              <Col sm={(minifiedVersion || editRecord) ? 8 : 12} xs={24}>
                <TextInput
                  placeholder={entityType === ORG ? 'Company/Organization Name' : 'Last Name'}
                  isRequired
                  label={entityType === ORG ? 'Name' : 'Last Name'}
                  name="lastName"
                  onChange={() => setIsFormTouched(true)}
                  rules={[{ required: true }]}
                />
              </Col>
              <Col sm={(minifiedVersion || editRecord) ? 8 : 12} xs={24}>
                <TextInput
                  name="email"
                  label="Email"
                  onChange={() => setIsFormTouched(true)}
                  rules={[{ type: 'email' }]}
                  placeholder="Email"
                />
              </Col>
              <Col sm={minifiedVersion ? 10 : 12} xs={24}>
                <TextInput
                  name="street"
                  placeholder="Street Address"
                  label="Street Address"
                  onChange={() => setIsFormTouched(true)}
                />
              </Col>
              {!minifiedVersion && (
                <Col sm={(minifiedVersion || editRecord) ? 6 : 13} xs={24}>
                  <TextInput
                    name="street2"
                    placeholder="Additional Street"
                    label="Street 2"
                    onChange={() => setIsFormTouched(true)}
                  />
                </Col>
              )}
              <Col sm={(minifiedVersion || editRecord) ? 6 : 11} xs={24}>
                <TextInput
                  name="city"
                  placeholder="City Name"
                  label="City"
                  onChange={() => setIsFormTouched(true)}
                />
              </Col>
              <Col sm={7} xs={22} style={{ margin: '0px 10px' }}>
                <Tooltip
                  title={(
                    <p style={{ color: 'black', padding: '0px 10px', margin: '0px' }}>
                      Country
                    </p>
                  )}
                  color="white"
                >
                  <Form.Item
                    rules={[{ required: true, message: 'Country is required' }]}
                    name="countryId"
                    key="countryId"
                  >
                    <Select
                      onSearch={onSearch}
                      showSearch
                      onChange={onChangeDropDown}
                      placeholder="Country"
                      filterOption={(input: any, option: any) => option?.children?.toLowerCase().startsWith(input.toLowerCase())}
                    >
                      {countryList?.map((data) => (
                        <Option key={kebabCase(data.id)} value={data?.id}>{data?.countryName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Tooltip>
              </Col>
              <Col sm={minifiedVersion ? 9 : 8} xs={24}>
                <DropdownInput
                  name="state"
                  label="State/Province/Locality"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  onChange={() => setIsFormTouched(true)}
                  dataList={countryToStateConst[selectCountryIsoCode]}
                  placeholder="State/Province/Locality"
                  keyName="label"
                  isRequired
                />
              </Col>
              <Col sm={8} xs={24}>
                <TextInput
                  name="zip"
                  label="Zip/Postal Code"
                  placeholder="Zip/Postal Code"
                  onChange={() => setIsFormTouched(true)}
                />
              </Col>
              {minifiedVersion && (
                <Col sm={7} xs={22} style={{ marginLeft: '10px' }}>
                  <CustomPhoneInput
                    required={false}
                    name="phone"
                    label="phone"
                    placeholder="Phone"
                    selectIsdCode={selectIsdCode}
                    onChange={() => setIsFormTouched(true)}
                    setPhoneNumber={(data) => form.setFieldValue('phone', data)}
                  />
                </Col>
              )}
            </Row>
          </Col>
          {(!minifiedVersion && !editRecord) && (
            <div style={{ padding: '0px 10px', width: '220px', height: '220px' }}>
              <SingleAvatarUpload
                key={`pco-add-modal-image-${imageUrl}`}
                visible={visible}
                imageState={imageState}
                setImageState={setImageState}
                onChange={onChange}
                type="PCO"
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
              />
            </div>
          )}
        </Row>
        <Row justify="space-between">
          {!minifiedVersion && (
            <Col sm={6} xs={22} style={{ margin: '0px' }}>
              <CustomPhoneInput onChange={() => setIsFormTouched(true)} required={false} name="phone" label="Phone" placeholder="Phone" selectIsdCode={selectIsdCode} setPhoneNumber={(data) => form.setFieldValue('phone', data)} />
            </Col>
          )}
          {!minifiedVersion && (
            <Col sm={6} xs={22} style={{ margin: '0px' }}>
              <CustomPhoneInput onChange={() => setIsFormTouched(true)} required={false} name="otherPhone" label="Other Phone" placeholder="Other Phone" selectIsdCode={selectIsdCode} setPhoneNumber={(data) => form.setFieldValue('otherPhone', data)} />
            </Col>
          )}
          {!minifiedVersion && (
            <Col sm={11} xs={24} style={{ marginLeft: '0px 10px' }}>
              <TextInput
                name="website"
                label="Website, Facebook, or other URL"
                suffix={(
                  <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={WebsiteValidationTooltip}>
                    <Typography.Link><InfoCircleOutlined rev={undefined} /></Typography.Link>
                  </Tooltip>
                )}
                onChange={() => setIsFormTouched(true)}
                className={`${cssPrefix}__form__input`}
                placeholder="Website, Facebook, or any other URL"
                rows={5}
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col sm={minifiedVersion ? 9 : 12}>
            <Row>
              {!minifiedVersion && (
                <Form.Item style={{ padding: '0px 10px' }} name="hospital" label="Animal Clinic/Hospital" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren={(entityType === ORG) ? 'optional' : 'disabled'} disabled={(entityType !== ORG)} />
                </Form.Item>
              )}
              <Form.Item style={{ padding: '0px 10px' }} name="mailList" initialValue label="Mail List?" valuePropName="checked" rules={[{ type: 'boolean' }]}>
                <Switch checkedChildren="Yes" unCheckedChildren="optional" defaultChecked />
              </Form.Item>
              {!minifiedVersion && (
                <Form.Item style={{ padding: '0px 10px' }} name="rescue" label="Other Animal Rescue/Shelter" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren={(entityType === ORG) ? 'optional' : 'disabled'} disabled={(entityType !== ORG)} />
                </Form.Item>
              )}
              <Form.Item style={{ padding: '0px 10px' }} name="flag" label=" Flag" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="optional" onChange={onFlagChange} />
              </Form.Item>
              {minifiedVersion && (
                <Col xs={24} style={{ marginLeft: '0px 10px' }}>
                  <TextInput
                    name="website"
                    label="Website, Facebook, or other URL"
                    suffix={(
                      <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={WebsiteValidationTooltip}>
                        <Typography.Link><InfoCircleOutlined rev={undefined} /></Typography.Link>
                      </Tooltip>
                    )}
                    onChange={() => setIsFormTouched(true)}
                    className={`${cssPrefix}__form__input`}
                    placeholder="Website, Facebook, or any other URL"
                    rows={5}
                  />
                </Col>
              )}
            </Row>
          </Col>
          <Col sm={minifiedVersion ? 7 : 6} xs={24}>
            <AreaInput
              form={form}
              name="flagReason"
              label="Flag Reason"
              rules={[{ required: flagReasonKey, type: 'string' }]}
              onChange={() => setIsFormTouched(true)}
              disabled={!flagReasonKey}
              placeholder="Flag Reason"
              rows={minifiedVersion ? 4 : 5}
              isRequired={flagReasonKey}
            />
          </Col>
          <Col sm={minifiedVersion ? 8 : 6} xs={24}>
            <AreaInput
              form={form}
              name="notes"
              label=" Notes"
              onChange={() => setIsFormTouched(true)}
              rows={minifiedVersion ? 4 : 5}
              placeholder="Notes"
            />
          </Col>
        </Row>
      </div>
    </Form>
  );

  // useEffect(() => {
  //   forceUpdate({});
  // }, []);

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        // key={`pco-add-modal-${key}`}
        modalVisible={props.visible}
        setModalVisible={setAddModalVisibility}
        modalTitle={<span className={`${cssPrefix}__modal__title`}>{modalTitle}</span>}
        modalContent={(<ModalContent />)}
        footerContent={footerContent}
        onCancel={onCancel}
        size={minifiedVersion ? 'lg' : 'lg'}
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
            (editRecord?.id) ? onUpdate() : form.submit();
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
          // setImageState('');
          props.handleCancel();
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};
