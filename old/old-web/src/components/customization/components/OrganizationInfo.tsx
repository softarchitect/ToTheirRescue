/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
import { useEffect, useState, FC } from 'react';
import {
  Input, Row, Col, Form, Button, message, Select, Modal, Typography, Collapse, Skeleton,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  ContactsOutlined, EditOutlined, EnvironmentOutlined, ExceptionOutlined, ExclamationCircleOutlined,
  ExportOutlined,
  MailOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import alertConstant from 'src/shared/constants/alert.json';
import countryToState from 'src/shared/constants/states.json';
import country, { byCode } from 'src/shared/constants/country.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import TenantAttachments from 'src/components/customization/components/TenantAttachments';
import TenantDiary from 'src/components/user_diary/index';
import CustomPhoneInput from 'src/shared/components/Inputs/CustomPhoneInput';
import { isMobileOnly } from 'react-device-detect';

const countryByCode: any = byCode;
const { confirm } = Modal;

const { Option } = Select;

interface CountryNameInterface {
  id: string;
  countryName: string;
}

const OrganizationInfo: FC<any> = () => {
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [organizationInfo, setOrganizationInfo] = useState(Object);
  const [tenentId, setTenentId] = useState(0);
  const [countryCode, setCountryCode] = useState('1');
  const [isGetDetailLoading, setIsGetDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState(newCountryNameInterface);
  const [selectCountryIsoCode, setSelectCountryIsoCode] = useState<any>('');
  const [selectIsdCode, setSelectIsdCode] = useState<any>('');
  const [selectCountry, setSelectCountry] = useState<any>('');
  const [editForm, setEditForm] = useState(false);
  const [editBasicForm, setEditBasicForm] = useState(false);
  const [editLocationForm, setEditLocationForm] = useState(false);
  const [editContactForm, setEditContactForm] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [editData, setEditData] = useState(false);
  const [highlightKey, setHighlightKey] = useState<any>('');
  const [firstError, setFirstError] = useState<any>();
  const [newKey, setNewKey] = useState(Date.now());
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const countryToStateConst: any = { ...countryToState };
  const isMobile = window.innerWidth <= 768;

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
    let errorField = '';
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
    }, 500);
  }, [highlightKey]);

  const validationCheck = () => {
    let errorField = '';
    setFirstError('');
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
    }, 500);
  };

  // const handleSave = (values: any) => {
  //   console.log('Saving values:', values);
  // };

  // useEffect(() => {
  //   // eslint-disable-next-line
  //   console.log(countryName, organizationInfo?.countryId, 'ddddddd');
  //   // eslint-disable-next-line
  //   const selectedCountryName = countryName.find(o => o.id == organizationInfo.countryId);
  //   setOrganizationInfo({ ...organizationInfo, countryId: selectedCountryName?.countryName });
  //   console.log(selectedCountryName, 'selectedCountryName');
  // }, [organizationInfo.countryId]);

  useEffect(() => {
    setIsGetDetailLoading(true);
    const data = {};
    setSelectCountry('');
    apiCall('tenant/get-tenant-info', 'GET', data)
      .then((resp: any) => {
        setIsGetDetailLoading(false);
        if (resp?.data?.success) {
          const {
            name, city, countryId, emailAddress, phone, tenantAcronym, state, street, website, zip, countryISO2Code, countryISDCode,
          } = resp?.data?.data?.tenant;
          form.setFieldsValue({
            name, city, countryId, emailAddress, phone, tenantAcronym, state, street, website, zip,
          });
          localStorage.setItem('rescueDetails', JSON.stringify(resp?.data?.data?.tenant));
          setSelectIsdCode(countryISDCode);
          setSelectCountryIsoCode(countryISO2Code);
          setTenentId(resp?.data?.data?.id);
          setSelectCountry(resp?.data?.data?.tenant.countryId);
          setOrganizationInfo({ ...resp?.data?.data?.tenant, countryId: resp?.data?.data?.id });
          localStorage.setItem('countryCode', resp?.data?.data?.tenant?.countryISO2Code);
          localStorage.setItem('stateCode', resp?.data?.data?.tenant?.state);
        }
      });
    if (!editData) {
      setEditData(false);
    }
  }, [editData]);

  const onFinishFailed = () => {
    message.error({
      content: alertConstant.validation_error_message,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const submitForm = async () => {
    setIsLoading(true);
    const updatedData = {
      name: organizationInfo?.name,
      city: organizationInfo?.city,
      countryId: selectCountry !== '' ? selectCountry : localStorage.getItem('countryId'),
      emailAddress: organizationInfo?.emailAddress,
      phone: organizationInfo?.phone,
      tenantAcronym: organizationInfo?.tenantAcronym,
      state: organizationInfo?.state,
      street: organizationInfo?.street,
      website: organizationInfo?.website,
      zip: organizationInfo?.zip,
    };
    if (editForm) {
      apiCall(`tenant/update-tenant/${tenentId}`, 'post', updatedData)
        .then((resp: any) => {
          setIsLoading(false);
          if (resp?.data?.success) {
            setEditLocationForm(false);
            setEditBasicForm(false);
            setEditContactForm(false);
            setIsFormTouched(false);
            setEditData(false);
            localStorage.setItem('countryId', (updatedData?.countryId || ''));
            localStorage.setItem('stateCode', organizationInfo?.state);
            message.success({
              content: resp?.data?.message || alertConstant.organization_info_update_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
    }
    setEditForm(!editForm);
    setNewKey(Date.now());
  };

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

  const onChangeInput = (e: any) => {
    setIsFormTouched(true);
    setOrganizationInfo({ ...organizationInfo, [e.target.name]: e.target.value });
  };

  const onChangeDropDown = (value: any) => {
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

  const handleOpenArtifact = () => {
    navigate('/customization/tenant-attachments');
    // setAttachmentsModalVisible(true);
  };

  const onClickEdit = () => {
    setEditForm(true);
    setEditData(true);
  };

  const onClickEditBasic = () => {
    const {
      name, tenantAcronym,
    } = organizationInfo;
    form.setFieldsValue({
      name, tenantAcronym,
    });
    setEditBasicForm(true);
    setEditLocationForm(false);
    setEditContactForm(false);
  };

  const onClickEditLocation = () => {
    setEditLocationForm(true);
    setEditBasicForm(false);
    setEditContactForm(false);
  };

  const onClickEditContact = () => {
    setEditContactForm(true);
    setEditBasicForm(false);
    setEditLocationForm(false);
  };

  const handleCancel = (cancelType: number) => {
    if (!isFormTouched) {
      setEditForm(false);
      if (cancelType === 1) {
        setEditBasicForm(false);
      }
      if (cancelType === 2) {
        setEditLocationForm(false);
      }
      if (cancelType === 3) {
        setEditContactForm(false);
      }
      setIsFormTouched(false);
      setNewKey(Date.now());
      return;
    }
    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        form.submit();
      },
      onCancel() {
        setNewKey(Date.now());
        setEditForm(false);
        if (cancelType === 1) {
          setEditBasicForm(false);
        }
        if (cancelType === 2) {
          setEditLocationForm(false);
        }
        if (cancelType === 3) {
          setEditContactForm(false);
        }
        setIsFormTouched(false);
      },
    });
  };

  return (
    <div className="custom-scrollbar" style={{ marginTop: '30px', overflowY: 'scroll', height: 'calc(100vh - 220px)' }}>
      <Row justify="center">
        <Col span={22}>
          <Row align="middle" style={{ padding: isMobile ? '' : '10px 0px 0px 14px' }}>
            <Col span={24}>
              <Row wrap={false} justify="space-between">
                <div>
                  <ExceptionOutlined rev={undefined} style={{ fontSize: '20px', color: '#326394', paddingRight: '10px' }} />
                  <span style={{ color: '#326394', fontSize: '18px', fontWeight: 400 }}>
                    Basic Details
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  {editBasicForm
                    ? (
                      <>
                        <Col>
                          <Button style={{ marginRight: '8px' }} className="ftr-button-secondary" onClick={() => handleCancel(1)}>
                            Cancel
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            form="organization-form"
                            className="ftr-button-primary"
                            htmlType="submit"
                            loading={editBasicForm && isLoading}
                            onClick={() => {
                              validationCheck();
                              setHighlightKey(Date.now());
                              form.submit();
                            }}
                          >
                            Save
                          </Button>
                        </Col>
                      </>
                    ) : (
                      <Col>
                        <Button style={{ margin: isMobile ? '' : '0px 4px' }} type="text" onClick={onClickEditBasic}>
                          <EditOutlined rev={undefined} />
                        </Button>
                      </Col>
                    )}
                </div>
              </Row>
            </Col>
          </Row>
          {editBasicForm ? (
            <Form
              id="organization-form"
              onFinish={submitForm}
              form={form}
              onFinishFailed={onFinishFailed}
              scrollToFirstError
              validateMessages={validateMessages}
            >
              <Row style={{ padding: isMobile ? '' : '0px 40px' }} justify="space-between">
                <Col xs={24} sm={10} style={{ paddingTop: '20px' }}>
                  <TextInput
                    label="Organization Name"
                    required
                    rules={[{ required: true }]}
                    onClick={() => setFirstError('')}
                    name="name"
                    ref={(ref: any) => (firstError === 'name') && ref && ref.focus()}
                    // disabled={!editForm}
                    key="name"
                    onChange={onChangeInput}
                    placeholder="Organization Name"
                    value={organizationInfo?.name}
                  />
                </Col>
                <Col xs={24} sm={10} style={{ paddingTop: isMobile ? '' : '20px' }}>
                  <TextInput
                    label="Rescue Acronym"
                    required
                    rules={[{ required: true }]}
                    onClick={() => setFirstError('')}
                    name="tenantAcronym"
                    ref={(ref: any) => (firstError === 'tenantAcronym') && ref && ref.focus()}
                    // disabled={!editForm}
                    key="tenantAcronym"
                    onChange={onChangeInput}
                    placeholder="Rescue Acronym"
                  />
                </Col>
              </Row>
            </Form>
          ) : (
            <Row style={{ padding: isMobile ? '8px' : '8px 40px' }}>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Organization Name : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo?.name : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Rescue Acronym : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo?.tenantAcronym : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <hr style={{
            borderLeft: '0px solid', borderBottom: '0px solid', borderTop: '1px solid #326394', width: '100%', marginTop: '16px',
          }}
          />
          <Row align="middle" style={{ padding: isMobile ? '8px' : '10px 0px 0px 14px' }}>
            <Col span={24}>
              <Row wrap={false} justify="space-between">
                <div>
                  <EnvironmentOutlined rev={undefined} style={{ fontSize: '20px', color: '#326394', paddingRight: '10px' }} />
                  <span style={{ color: '#326394', fontSize: '18px', fontWeight: 400 }}>
                    Location
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  {editLocationForm
                    ? (
                      <>
                        <Col>
                          <Button style={{ marginRight: '8px' }} className="ftr-button-secondary" onClick={() => handleCancel(2)}>
                            Cancel
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            form="organization-form"
                            className="ftr-button-primary"
                            htmlType="submit"
                            loading={editLocationForm && isLoading}
                            onClick={() => {
                              validationCheck();
                              setHighlightKey(Date.now());
                              form.submit();
                            }}
                          >
                            Save
                          </Button>
                        </Col>
                      </>
                    ) : (
                      <Col>
                        <Button style={{ margin: isMobile ? '0px' : '0px 4px' }} type="text" onClick={onClickEditLocation}>
                          <EditOutlined rev={undefined} />
                        </Button>
                      </Col>
                    )}
                </div>
              </Row>
            </Col>
          </Row>
          {editLocationForm ? (
            <Form
              id="organization-form"
              onFinish={submitForm}
              form={form}
              onFinishFailed={onFinishFailed}
              scrollToFirstError
              validateMessages={validateMessages}
            >
              <Row style={{ padding: isMobile ? '' : '0px 40px' }} justify="space-between">
                <Col xs={24} md={10} style={{ paddingTop: '20px' }}>
                  <TextInput
                    label="Street Address"
                    required
                    rules={[{ required: true }]}
                    onClick={() => setFirstError('')}
                    name="street"
                    ref={(ref: any) => (firstError === 'street') && ref && ref.focus()}
                    key="street"
                    onChange={onChangeInput}
                    placeholder="Street Address"
                  />
                </Col>
                <Col xs={24} md={10} style={{ paddingTop: isMobile ? '' : '20px' }}>
                  <TextInput
                    label="City"
                    required
                    rules={[{ required: true }]}
                    onClick={() => setFirstError('')}
                    name="city"
                    ref={(ref: any) => (firstError === 'city') && ref && ref.focus()}
                    key="city"
                    onChange={onChangeInput}
                    placeholder="City"
                  />
                </Col>
                <Col xs={24} md={10} style={{}}>
                  <DropdownInput
                    name="state"
                    label="State/Province/Locality"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    dataList={countryToStateConst[selectCountryIsoCode]}
                    placeholder="State/Province/Locality"
                    keyName="label"
                    onChange={(value: any) => setOrganizationInfo({ ...organizationInfo, state: value })}
                    isRequired
                  />
                </Col>
                <Col xs={24} md={10} style={{}}>
                  <TextInput
                    label="Zip/Postal Code"
                    // rules={[{ required: true, message: 'Zip/Postal code is required' }, { pattern: /^\d{5}[-\s]?(?:\d{4})?$/, message: 'Please enter valid zip' }]}
                    // onClick={() => setFirstError('')}
                    name="zip"
                    // ref={(ref: any) => (firstError === 'zip') && ref && ref.focus()}
                    key="zip"
                    onChange={onChangeInput}
                    placeholder="Zip/Postal Code"
                  />
                </Col>
                <Col xs={24} md={10} style={{}}>
                  <DropdownInput
                    name="countryId"
                    label="Country"
                    style={{ padding: '0px 10px' }}
                    className="hide-label"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    isRequired
                    onChange={onChangeDropDown}
                    placeholder="Select Country"
                    dataList={countryList}
                    keyName="countryName"
                    showSearch
                    filterOption={(input: any, option: any) => option?.children.toLowerCase().startsWith(input.toLowerCase())}
                  />
                </Col>
              </Row>
            </Form>
          ) : (
            <Row style={{ padding: isMobile ? '8px' : '8px 40px' }}>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Street : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.street : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>City : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.city : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>State/Province/Locality : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.state : (<Skeleton.Input size="small" style={{ margin: isMobile ? '' : '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Zip/Postal Code : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.zip : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Country : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? countryByCode?.[organizationInfo.countryISO2Code] : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <hr style={{
            borderLeft: '0px solid', borderBottom: '0px solid', borderTop: '1px solid #326394', width: '100%', marginTop: '16px',
          }}
          />
          <Row align="middle" style={{ fontSize: '20px', padding: isMobile ? '8px' : '10px 0px 0px 14px' }}>
            <Col span={24}>
              <Row wrap={false} justify="space-between">
                <div>
                  <MailOutlined rev={undefined} style={{ fontSize: '20px', color: '#326394', paddingRight: '10px' }} />
                  <span style={{ color: '#326394', fontSize: '18px', fontWeight: 400 }}>
                    Contacts
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  {editContactForm
                    ? (
                      <>
                        <Col>
                          <Button style={{ marginRight: '8px' }} className="ftr-button-secondary" onClick={() => handleCancel(3)}>
                            Cancel
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            form="organization-form"
                            className="ftr-button-primary"
                            htmlType="submit"
                            loading={editContactForm && isLoading}
                            onClick={() => {
                              validationCheck();
                              setHighlightKey(Date.now());
                              form.submit();
                            }}
                          >
                            Save
                          </Button>
                        </Col>
                      </>
                    ) : (
                      <Col>
                        <Button style={{ margin: isMobile ? '' : '0px 4px' }} type="text" onClick={onClickEditContact}>
                          <EditOutlined rev={undefined} />
                        </Button>
                      </Col>
                    )}
                </div>
              </Row>
            </Col>
          </Row>
          {editContactForm ? (
            <Form
              id="organization-form"
              onFinish={submitForm}
              form={form}
              onFinishFailed={onFinishFailed}
              scrollToFirstError
              validateMessages={validateMessages}
            >
              <Row style={{ padding: isMobile ? '' : '0px 40px' }} justify="space-between">
                <Col xs={24} sm={12} style={{ paddingTop: '20px' }}>
                  <CustomPhoneInput
                    required={false}
                    name="phone"
                    label="Phone"
                    placeholder="Phone"
                    onChange={onChangeInput}
                    selectIsdCode={selectIsdCode}
                    setPhoneNumber={(data: any) => form.setFieldValue('phone', data)}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ paddingTop: isMobile ? '' : '20px' }}>
                  <TextInput
                    label="Email"
                    required
                    rules={[{ type: 'email', required: true }]}
                    onClick={() => setFirstError('')}
                    name="emailAddress"
                    ref={(ref: any) => (firstError === 'emailAddress') && ref && ref.focus()}
                    key="email"
                    onChange={onChangeInput}
                    placeholder="Email"
                  />
                </Col>
                <Col xs={24} sm={12} style={{}}>
                  <TextInput
                    label="Website URL"
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Website url is required',
                      },
                      {
                        pattern: /(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/,
                        message: 'Please enter valid website url',
                      },
                    ]}
                    onClick={() => setFirstError('')}
                    name="website"
                    ref={(ref: any) => (firstError === 'website') && ref && ref.focus()}
                    key="website"
                    onChange={onChangeInput}
                    placeholder="Website URL"
                  />
                </Col>
              </Row>
            </Form>
          ) : (
            <Row style={{ padding: isMobile ? '8px' : '8px 40px' }}>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Phone Number : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.phone : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: isMobile ? '' : '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>Email : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.emailAddress : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Row>
                  <Col style={{ fontWeight: 500, fontSize: '16px' }}>URL : </Col>
                  <Col style={{ fontWeight: 400, fontSize: '16px' }}>
                    &nbsp;
                    {!isGetDetailLoading ? organizationInfo.website : (<Skeleton.Input size="small" style={{ margin: '0px 10px', width: '200px' }} active />)}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <hr style={{
            borderLeft: '0px solid', borderBottom: '0px solid', borderTop: '1px solid #326394', width: '100%', marginTop: '16px',
          }}
          />
          <Collapse
            expandIcon={(expand: any) => (
              <Button type="text" style={{ marginTop: '8px' }}>
                {expand?.isActive ? (
                  <>
                    hide
                    &nbsp;
                    <ArrowUpOutlined ref={undefined} />
                  </>
                ) : (
                  <>
                    expand
                    &nbsp;
                    <ArrowDownOutlined ref={undefined} />
                  </>
                )}
              </Button>
            )}
            expandIconPosition="end"
            style={{ backgroundColor: 'white', padding: '0px' }}
            items={[
              {
                key: '1',
                label: (
                  <Row justify="space-between" align="middle" style={{ fontSize: '20px', padding: '0px 0px 0px 0px' }}>
                    <Col span={18}>
                      <Row>
                        <PushpinOutlined rev={undefined} style={{ fontSize: '20px', color: '#326394', paddingRight: '0px' }} />
                        <div style={{ padding: '4px' }} />
                        <span style={{ color: '#326394', fontSize: '18px', fontWeight: 400 }}>
                          {isMobile ? 'Manage PVD' : 'Manage Photos, Videos, and Documents'}
                        </span>
                      </Row>
                    </Col>
                    <Col span={1}>
                      <Button onClick={() => navigate('/customization/tenant-attachments')} type="text" style={{ color: '#326394', fontSize: '16px', fontWeight: 400 }}>
                        <ExportOutlined rev={undefined} />
                      </Button>
                    </Col>
                  </Row>),
                children: (<div style={{ padding: isMobileOnly ? '0px' : '0px', margin: '0px', backgroundColor: '#F2F2F2' }}><TenantAttachments minified /></div>),
              },
            ]}
            bordered={false}
          />
          <hr style={{
            borderLeft: '0px solid', borderBottom: '0px solid', borderTop: '1px solid #326394', width: '100%', marginTop: '8px',
          }}
          />
          <Collapse
            expandIcon={(expand: any) => (
              <Button type="text" style={{ marginTop: '8px' }}>
                {expand?.isActive ? (
                  <>
                    hide
                    &nbsp;
                    <ArrowUpOutlined ref={undefined} />
                  </>
                ) : (
                  <>
                    expand
                    &nbsp;
                    <ArrowDownOutlined ref={undefined} />
                  </>
                )}
              </Button>
            )}
            collapsible="icon"
            expandIconPosition="end"
            style={{ backgroundColor: 'white' }}
            items={[
              {
                key: '1',
                label: (
                  <Row justify="space-between" align="top" style={{ fontSize: '20px', padding: '0px 0px 0px 0px' }}>
                    <Col span={18}>
                      <Row>
                        <BookOutlined rev={undefined} style={{ fontSize: '18px', color: '#326394', paddingRight: '4px' }} />
                        <div style={{ padding: '4px' }} />
                        <span style={{ color: '#326394', fontSize: '18px', fontWeight: 400 }}>
                          Diary
                        </span>
                      </Row>
                    </Col>
                    <Col span={1}>
                      <Button onClick={() => navigate('/customization/diary')} type="text" style={{ color: '#326394', fontSize: '16px', fontWeight: 400 }}>
                        <ExportOutlined rev={undefined} />
                      </Button>
                    </Col>
                  </Row>),
                children: (<div style={{ backgroundColor: '#F2F2F2', paddingBottom: '10px' }}><TenantDiary /></div>),
              },
            ]}
            bordered={false}
          />
        </Col>
      </Row>
      <br />
      <br />
      {/* <Row
        justify="end"
        style={{
          margin: '20px 60px',
        }}
      >
        <Col>
          <Button onClick={() => navigate('/customization/diary')} className="ftr-button-primary">
            Diary
          </Button>
        </Col>
        <Col>
          <Button style={{ margin: '0px 4px' }} className="ftr-button-primary" onClick={handleOpenArtifact}>
            Attachments
          </Button>
        </Col>
        {editForm
          ? (
            <>
              <Col>
                <Button style={{ marginRight: '8px' }} className="ftr-button-secondary" onClick={() => handleCancel()}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  form="organization-form"
                  className="ftr-button-primary"
                  htmlType="submit"
                  onClick={() => {
                    validationCheck();
                    setHighlightKey(Date.now());
                    form.submit();
                  }}
                >
                  Save
                </Button>
              </Col>
            </>
          ) : (
            <Col>
              <Button style={{ margin: '0px 4px' }} type="text" onClick={onClickEdit}>
                edit
              </Button>
            </Col>
          )}
      </Row> */}
      {/* <Form
        id="organization-form"
        onFinish={submitForm}
        form={form}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        validateMessages={validateMessages}
      >
        <Row justify="center">
          <Col lg={11} style={{ padding: '20px 10px 0px 10px', borderRight: '1px solid green' }}>
            <TextInput
              label="Organization Name"
              required
              rules={[{ required: true }]}
              onClick={() => setFirstError('')}
              name="name"
              ref={(ref: any) => (firstError === 'name') && ref && ref.focus()}
              disabled={!editForm}
              key="name"
              onChange={onChangeInput}
              placeholder="Organization Name"
              value={organizationInfo?.name}
            />
            <TextInput
              label="Rescue Acronym"
              required
              rules={[{ required: true }]}
              onClick={() => setFirstError('')}
              name="tenantAcronym"
              ref={(ref: any) => (firstError === 'tenantAcronym') && ref && ref.focus()}
              disabled={!editForm}
              key="tenantAcronym"
              onChange={onChangeInput}
              placeholder="Rescue Acronym"
            />
            <TextInput
              label="Street"
              required
              rules={[{ required: true }]}
              onClick={() => setFirstError('')}
              name="street"
              disabled={!editForm}
              ref={(ref: any) => (firstError === 'street') && ref && ref.focus()}
              key="street"
              onChange={onChangeInput}
              placeholder="Street"
            />
            <TextInput
              label="City"
              required
              rules={[{ required: true }]}
              onClick={() => setFirstError('')}
              name="city"
              disabled={!editForm}
              ref={(ref: any) => (firstError === 'city') && ref && ref.focus()}
              key="city"
              onChange={onChangeInput}
              placeholder="City"
            />
            {editForm ? (
              <DropdownInput
                name="state"
                label="State/Province/Locality"
                rules={[
                  {
                    required: true,
                  },
                ]}
                dataList={countryToStateConst[selectCountryIsoCode]}
                placeholder="State/Province/Locality"
                keyName="label"
                onChange={(value: any) => setOrganizationInfo({ ...organizationInfo, state: value })}
                isRequired
              />
            ) : (
              <div style={{ padding: '0px 10px' }}>
                <Select
                  options={countryToStateConst[selectCountryIsoCode]?.map((option: any) => ({ label: option.label, value: option.id }))}
                  placeholder="State/Province/Locality"
                  value={organizationInfo.state}
                  onChange={(value: any) => setOrganizationInfo({ ...organizationInfo, state: value })}
                  disabled={!editForm}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </Col>
          <Col lg={11} style={{ padding: '20px 10px 0px 10px' }}>
            <TextInput
              label="Zip/Postal Code"
              required
              rules={[{ required: true, message: 'Zip/Postal code is required' }, { pattern: /^\d{5}[-\s]?(?:\d{4})?$/, message: 'Please enter valid zip' }]}
              onClick={() => setFirstError('')}
              name="zip"
              disabled={!editForm}
              ref={(ref: any) => (firstError === 'zip') && ref && ref.focus()}
              key="zip"
              onChange={onChangeInput}
              placeholder="Zip"
            />
            <DropdownInput
              name="countryId"
              label="Country"
              style={{ padding: '0px 10px' }}
              className="hide-label"
              rules={[
                {
                  required: true,
                },
              ]}
              isRequired
              onChange={onChangeDropDown}
              placeholder="Select Country"
              dataList={countryList}
              disabled
              keyName="countryName"
              showSearch
              filterOption={(input: any, option: any) => option?.children.toLowerCase().startsWith(input.toLowerCase())}
            />
            {editForm ? (
              <div style={{ padding: '0px' }}>
                <CustomPhoneInput
                  required={false}
                  name="phone"
                  label="Phone"
                  placeholder="Phone"
                  onChange={onChangeInput}
                  selectIsdCode={selectIsdCode}
                  setPhoneNumber={(data: any) => form.setFieldValue('phone', data)}
                />
              </div>
            ) : (
              <TextInput
                onClick={() => setFirstError('')}
                customInput={Input}
                disabled={!editForm}
                key="phone"
                name="phone"
                onChange={onChangeInput}
                placeholder="Phone"
              />
            )}
            <TextInput
              label="Email"
              required
              rules={[{ type: 'email', required: true }]}
              onClick={() => setFirstError('')}
              name="emailAddress"
              ref={(ref: any) => (firstError === 'emailAddress') && ref && ref.focus()}
              disabled={!editForm}
              key="email"
              onChange={onChangeInput}
              placeholder="Email"
            />
            <TextInput
              label="Website URL"
              required
              rules={[
                {
                  required: true,
                  message: 'Website url is required',
                },
                {
                  pattern: /(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/,
                  message: 'Please enter valid website url',
                },
              ]}
              onClick={() => setFirstError('')}
              name="website"
              ref={(ref: any) => (firstError === 'website') && ref && ref.focus()}
              key="website"
              disabled={!editForm}
              onChange={onChangeInput}
              placeholder="Website URL"
            />
          </Col>
        </Row>
      </Form> */}
      <br />
      {/* <Row
        justify="end"
        style={{
          margin: '20px 60px',
        }}
      >
        <Col span={editForm ? 10 : 10}>
          <Row justify="end">
            <Col span={5}>
              <Button onClick={() => navigate('/customization/diary')} className="ftr-button-primary">
                Diary
              </Button>
            </Col>
            <Col span={8}>
              <Button style=marginng:'0px 4px'}} className="ftr-button-primary" onClick={handleOpenArtifact}>
                Attachments
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={editForm ? 5 : 2}>
          <Row justify="end">
            {editForm
              ? (
                <>
                  <Col span={12}>
                    <Button style={{ marginRight: '8px' }} className="ftr-button-secondary" onClick={() => handleCancel()}>
                      Cancel
                    </Button>
                  </Col>
                  <Col span={10}>
                    <Button
                      form="organization-form"
                      className="ftr-button-primary"
                      htmlType="submit"
                      onClick={() => {
                        validationCheck();
                        setHighlightKey(Date.now());
                        form.submit();
                      }}
                    >
                      Save
                    </Button>
                  </Col>
                </>
              ) : (
                <Col span={18}>
                  <Button style=marginng:'0px 4px'}} className="ftr-button-primary" onClick={onClickEdit}>
                    edit
                  </Button>
                </Col>
              )}
          </Row>
        </Col>
      </Row> */}
    </div>
  );
};

export default OrganizationInfo;
