import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface VaccinationType {
  id: string;
  vaccinationTypes: string
}

const AnimalVaccinationType: FC<any> = (newProps) => {
  const {
    permissions, animalType, onchangeAnimalType, animalTypeList, animalIdToType,
  } = newProps;
  const newVaccinationType: VaccinationType[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vaccinationTypeList, setVaccinationTypeList] = useState(newVaccinationType);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [vaccinationTypeId, setVaccinationTypeId] = useState(0);
  const [vaccinationType, setVaccinationType] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (animalType) {
      setGetLoading(true);
      apiCall(`vaccination-type/get-vaccination-type-by-animalId?animalTypeId=${animalType}`, 'GET', {})
        .then((resp: any) => {
          setGetLoading(false);
          if (resp?.data?.success) {
            setVaccinationTypeList(resp?.data?.data?.vaccinationTypes);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setVaccinationType('');
      setChangeData(false);
      setVaccinationTypeId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [animalType, changeData, isModalVisible]);

  const validate = (vaccinationTypeData: any): { validateStatus: ValidateStatus } => {
    if (!vaccinationTypeData) {
      setErrorMsg('Vaccination Type is required');
      return { validateStatus: 'error' };
    }
    if (vaccinationTypeData.length > 150) {
      setErrorMsg('Should be less than 150 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setVaccinationType(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setVaccinationType(data.kind);
    setTempForm(data.kind);
    setVaccinationTypeId(data.id);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && vaccinationType === tempForm && vaccinationType.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(vaccinationType);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(vaccinationType) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        kind: vaccinationType,
        AnimalTypeId: animalType,
      };
      apiCall(`vaccination-type/available-vaccination-type?vaccinationType=${vaccinationType}&animaltypeId=${animalType}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('vaccination-type/create-vaccination-type', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.vaccination_type_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`vaccination-type/update-vaccination-type/${vaccinationTypeId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.vaccination_type_update_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            }
          } else {
            message.success({
              content: resp?.data?.message || alertConstant.vaccination_type_duplicate_entry,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            setIsModalVisible(true);
            setLoading(false);
            if (!editModal) {
              setEditModal(false);
            } else {
              setEditModal(true);
            }
          }
        });
    }
  };

  const handleVaccinationTypeDelete = (id: string) => {
    const data = '';
    apiCall(`vaccination-type/delete-vaccination-type/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.vaccination_type_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === vaccinationType) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.vaccination_types?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {permissions?.customization?.vaccination_types?.add && (
        <Modal
          title={`${editModal ? 'Edit' : 'Add'} Vaccination Type`}
          visible={isModalVisible}
          okButtonProps={{ loading }}
          okText={editModal ? 'Update' : 'Save'}
          onOk={form.submit}
          onCancel={handleCancel}
          centered
        >
          <div style={{ margin: '10px' }}>
            <b>Animal Type</b>
            :
            {` ${animalIdToType[animalType]}`}
          </div>
          <Form onFinish={handleOk} form={form}>
            <Form.Item
              label="Vaccination Type"
              className="hide-label"
              style={{ padding: '0px 10px' }}
              required
              validateStatus={validationStatus.validateStatus}
              help={errorMsg}
            >
              <Input
                key={key}
                ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                value={vaccinationType}
                onChange={(e) => {
                  handleInput(e.target.value);
                }}
                placeholder="Vaccination Type"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="start" style={{ width: '200px' }}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a animal type"
              optionFilterProp="children"
              // eslint-disable-next-line
              onChange={onchangeAnimalType}
              value={animalType}
              defaultValue={animalType}
            >
              {animalTypeList?.map((data: any) => <Option key={data?.id} value={data?.id}>{data.typeName}</Option>)}
            </Select>
          </Row>
        </Col>
        {permissions?.customization?.vaccination_types?.add && (
          <Col flex={3}>
            <Row justify="end">
              <Button
                disabled={!animalType}
                className={`${cssPrefix}__button`}
                type="dashed"
                onClick={showModal}
                icon={<PlusOutlined rev={undefined} />}
              >
                Add
              </Button>
            </Row>
          </Col>
        )}
      </Row>
      <div style={{ marginTop: '10px' }}>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={!permissions?.customization?.vaccination_types?.edit}
          isNotDeletable={!permissions?.customization?.vaccination_types?.delete}
          showHeader={false}
          selectable={false}
          tableType="Vaccination Type"
          isLoading={getLoading}
          tableData={vaccinationTypeList}
          columnData={[{
            title: 'Vaccination Type',
            dataIndex: 'kind',
            width: '80%',
          }]}
          delete={handleVaccinationTypeDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
      <ConfirmModal
        key={`confirm-modal-${confirmModal}`}
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Do you want to save your changes?"
        onConfirmClick={async () => {
          try {
            setConfirmModal(false);
            handleOk();
          } catch (error) {
            console.log('Validation error:', error);
          }
        }}
        onCustomCancel={() => {
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
          setIsModalVisible(false);
          setEditModal(false);
        }}
        modalContent=""
        size="xs"
      />
    </>
  );
};

export default AnimalVaccinationType;
