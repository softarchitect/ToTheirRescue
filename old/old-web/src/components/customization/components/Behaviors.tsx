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

interface Behaviour {
  id: string;
  behaviorName: string
}

const Behaviors: FC<any> = (newProps) => {
  const {
    permissions, animalType, onchangeAnimalType, animalTypeList, animalIdToType,
  } = newProps;
  const newBehaviour: Behaviour[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [behaviourList, setBehaviourList] = useState(newBehaviour);
  const [behaviorId, setBehaviorId] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [behavior, setBehavior] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [tempForm, setTempForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [key, setKey] = useState<any>('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    setGetLoading(true);
    if (animalType) {
      apiCall(`behavior/get-behaviors-by-animalId?animalTypeId=${animalType}`, 'GET', {})
        .then((resp: any) => {
          setGetLoading(false);
          if (resp?.data?.success) {
            setBehaviourList(resp?.data?.data?.behaviors);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setBehavior('');
      setChangeData(false);
      setBehaviorId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [animalType, changeData, isModalVisible]);

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Behavior is required');
      return { validateStatus: 'error' };
    }
    if (behaviour.length > 25) {
      setErrorMsg('Should be less than 25 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setBehavior(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setBehavior(data.behaviorName);
    setTempForm(data.behaviorName);
    setBehaviorId(data.id);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && behavior === tempForm && behavior.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(behavior);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(behavior) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        behaviorName: behavior,
        AnimalTypeId: animalType,
      };
      apiCall(`behavior/available-behavior?behaviorName=${behavior}&animaltypeId=${animalType}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('behavior/create-behavior', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.behaviour_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`behavior/update-behavior/${behaviorId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.behaviour_update_success,
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
              content: resp?.data?.message || alertConstant.behaviour_duplicate_entry,
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

  const handleBehaviorDelete = (id: string) => {
    const data = '';
    apiCall(`behavior/delete-behavior/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.behaviour_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleCancel = () => {
    if (tempForm === behavior) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.animal_behaviors?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {permissions?.customization?.animal_behaviors?.add && (
        <Modal
          title={`${editModal ? 'Edit' : 'Add New '} Behavior, Trait, or Characteristic`}
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
          <Form form={form} onFinish={handleOk}>
            <Form.Item
              label="Behavior"
              className="hide-label"
              style={{ padding: '0px 10px' }}
              required
              validateStatus={validationStatus.validateStatus}
              help={errorMsg}
            >
              <Input
                key={key}
                ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                value={behavior}
                onChange={(e) => {
                  handleInput(e.target.value);
                }}
                placeholder="Behavior"
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
              onChange={(data: any) => onchangeAnimalType(data)}
              defaultValue={animalType}
              value={animalType}
            >
              {animalTypeList?.map((data: any) => <Option key={data?.id} value={data?.id}>{data.typeName}</Option>)}
            </Select>
          </Row>
        </Col>
        {permissions?.customization?.animal_behaviors?.add && (
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
          isNotEditable={!permissions?.customization?.animal_behaviors?.edit}
          isNotDeletable={!permissions?.customization?.animal_behaviors?.delete}
          showHeader={false}
          selectable={false}
          tableType="Behavior"
          tableData={behaviourList}
          isLoading={getLoading}
          columnData={[{
            title: 'Behavior',
            dataIndex: 'behaviorName',
            width: '80%',
          }]}
          delete={handleBehaviorDelete}
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

export default Behaviors;
