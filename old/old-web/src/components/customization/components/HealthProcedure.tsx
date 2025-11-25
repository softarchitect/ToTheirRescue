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

interface HealthProcedureInterface {
  id: string;
  kind: string
}

const HealthProcedure: FC<any> = (newProps) => {
  const {
    permissions, animalType, onchangeAnimalType, animalTypeList, animalIdToType,
  } = newProps;
  const newHealthProcedure: HealthProcedureInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [healthProcedureList, setHealthProcedureList] = useState(newHealthProcedure);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [healthProcedure, setHealthProcedure] = useState('');
  const [healthProcedureId, setHealthProcedureId] = useState(0);
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
      apiCall(`health-procedure/get-health-procedure-by-animalId?animalTypeId=${animalType}`, 'GET', {})
        .then((resp: any) => {
          setGetLoading(false);
          if (resp?.data?.success) {
            setHealthProcedureList(resp?.data?.data?.healthProcedures);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setHealthProcedure('');
      setChangeData(false);
      setHealthProcedureId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [animalType, changeData, isModalVisible]);

  const validate = (healthProcedureValidate: any): { validateStatus: ValidateStatus } => {
    if (!healthProcedureValidate) {
      setErrorMsg('Health Procedure is required');
      return { validateStatus: 'error' };
    }
    if (healthProcedureValidate.length > 150) {
      setErrorMsg('Should be less than 150 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setHealthProcedure(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setHealthProcedure(data.kind);
    setTempForm(data.kind);
    setHealthProcedureId(data.id);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && healthProcedure === tempForm && healthProcedure.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(healthProcedure);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(healthProcedure) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        kind: healthProcedure,
        AnimalTypeId: animalType,
      };
      apiCall(`health-procedure/available-health-procedure?healthProcedure=${healthProcedure}&animaltypeId=${animalType}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('health-procedure/create-health-procedure', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`health-procedure/update-health-procedure/${healthProcedureId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.health_procedure_update_success,
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
              content: resp?.data?.message || alertConstant.health_procedure_duplicate_entry,
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

  const handleHealthProcedureDelete = (id: string) => {
    const data = '';
    apiCall(`health-procedure/delete-health-procedure/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.health_procedure_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === healthProcedure) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.health_procedures?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {permissions?.customization?.health_procedures?.add && (
        <Modal
          title={`${editModal ? 'Edit' : 'Add'} Health Procedure`}
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
              label="Health Procedure"
              className="hide-label"
              style={{ padding: '0px 10px' }}
              required
              validateStatus={validationStatus.validateStatus}
              help={errorMsg}
            >
              <Input
                key={key}
                ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                value={healthProcedure}
                onChange={(e) => {
                  handleInput(e.target.value);
                }}
                placeholder="Health Procedure"
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
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onchangeAnimalType}
              defaultValue={animalType}
              value={animalType}
            >
              {animalTypeList?.map((data: any) => <Option key={data?.id} value={data?.id}>{data?.typeName}</Option>)}
            </Select>
          </Row>
        </Col>
        {permissions?.customization?.health_procedures?.add && (
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
          isNotEditable={!permissions?.customization?.health_procedures?.edit}
          isNotDeletable={!permissions?.customization?.health_procedures?.delete}
          showHeader={false}
          selectable={false}
          tableType="Health Procedure"
          isLoading={getLoading}
          tableData={healthProcedureList}
          columnData={[{
            title: 'Health Procedure',
            dataIndex: 'kind',
            width: '80%',
          }]}
          delete={handleHealthProcedureDelete}
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

export default HealthProcedure;
