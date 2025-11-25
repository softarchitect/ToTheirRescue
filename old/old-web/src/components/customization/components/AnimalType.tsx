/* eslint-disable no-unused-vars */
import {
  FC, useEffect, useState, useRef,
} from 'react';
import {
  Modal, Input, Row, Col, Form, Button, message,
} from 'antd';
import { AutoComplete } from 'antd/lib';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import { singularToPlural } from 'src/utils/pluralToSingular';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import constants from '../constant.json';

const { Option } = AutoComplete;

const { confirm } = Modal;

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

// eslint-disable-next-line
interface Item {
  id: string;
  type: string;
}

const AnimalType: FC<any> = (newAnimalProps) => {
  const { activeTab, permissions, role } = newAnimalProps;
  const newItem: Item[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [animalType, setAnimalType] = useState<string>('');
  const [animalTypeId, setAnimalTypeId] = useState(0);
  const [animalTypeList, setAnimalTypeList] = useState(newItem);
  const [animalTypeListMaster, setAnimalTypeListMaster] = useState(newItem);
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();

  const showModal = () => {
    setAnimalType('');
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    setKey(Date.now());
    const data = {};
    if (parseInt(activeTab, 10) === constants.customization_types.animalType) {
      apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', data)
        .then((resp: any) => {
          if (resp?.status === 200) {
            setAnimalTypeList(resp?.data?.data?.animalTypes);
          }
        });
      setGetLoading(true);
      apiCall('animaltype/get-animal-types?roleName=SuperAdministrator', 'GET', data)
        .then((resp: any) => {
          setGetLoading(false);
          if (resp?.status === 200) {
            setAnimalTypeListMaster(resp?.data?.data?.animalTypes);
          }
        });
    }
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalTypeId(0);
      setChangeData(false);
      setAnimalType('');
      setValidationStatus({});
    }
  }, [activeTab, changeData, isModalVisible]);

  // eslint-disable-next-line
  const handleAnimalTypeDelete = (id: string) => {
    const data = '';
    apiCall(`animaltype/delete-animal-type/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.animal_type_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  // eslint-disable-next-line
  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalType(data.typeName || '');
    setAnimalTypeId(data.id);
    setTempForm(data.typeName);
    setChangeData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const validate = (acquisitionWayData: string): { validateStatus: ValidateStatus } => {
    if (!acquisitionWayData) {
      setErrorMsg('Animal type is required');
      return { validateStatus: 'error' };
    }
    if (acquisitionWayData.split('').length > 75) {
      setErrorMsg('Should be less than 75 characters');
      return { validateStatus: 'error' };
    }

    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleOk = async () => {
    if (editModal && animalType === tempForm && animalType.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(animalType);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(animalType) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      setAnimalType(singularToPlural(animalType) || animalType);
      const data = {
        typeName: singularToPlural(animalType),
        roleName: role,
      };
      apiCall(`animaltype/available-animal-type?typeName=${animalType}&roleName=${role}`, 'get', {})
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('animaltype/create-animal-type', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.animal_type_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`animaltype/update-animal-type/${animalTypeId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.animal_type_update_success,
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
              content: resp?.data?.message || alertConstant.animal_type_duplicate_entry,
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

  const checkPlural = () => {
    if (animalType?.length > 0) {
      const value = singularToPlural(animalType);
      const modStr = value[0].toUpperCase() + value.slice(1);
      setAnimalType(modStr);
    }
  };

  const selectMasterAnimalType = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setAnimalType(value);
  };

  const handleInput = (value: string) => {
    setAnimalType(value);
  };

  const handleCancel = () => {
    if (tempForm === animalType) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.animal_types?.view) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <div onMouseMove={() => handleInput(singularToPlural(animalType)) as any}>
      <Modal
        title={editModal ? 'Edit Animal Type' : 'Add New Animal Type'}
        visible={isModalVisible}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
        okButtonProps={{
          className: 'ftr-button-primary',
          loading,
          onMouseOver: () => handleInput(singularToPlural(animalType)),
        }}
        cancelButtonProps={{ className: 'ftr-button-secondary' }}
        centered
      >
        <Form onFinish={handleOk} form={form}>
          <Form.Item
            label="Animal Type"
            className="hide-label"
            style={{ padding: '0px 10px' }}
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <AutoComplete
              key={key}
              ref={(ref: any) => ref && ref.focus()}
              options={animalTypeListMaster?.map((data: any) => ({ value: data?.typeName, label: data?.typeName }))}
              placeholder="Animal Type"
              value={animalType}
              onChange={(value: any) => {
                selectMasterAnimalType(value);
              }}
              filterOption={(inputValue: any, option: any) => option!.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="end">
              {/* <Typography.Link><PlusOutlined style={{ fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
              <Button
                className="ftr-button-secondary"
                onClick={showModal}
                icon={<PlusOutlined rev={undefined} />}
              >
                Add
              </Button>
            </Row>
          </Col>
        </Row>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={false}
          showHeader={false}
          selectable={false}
          tableData={animalTypeList}
          tableType="Animal Type"
          isLoading={getLoading}
          columnData={[{
            title: 'Animal Type',
            dataIndex: 'typeName',
            width: '80%',
          }]}
          delete={handleAnimalTypeDelete}
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
    </div>
  );
};

export default AnimalType;
