/* eslint-disable no-unused-vars */
import {
  FC, useEffect, useState, useRef,
} from 'react';
import {
  Modal, Row, Col, Form, Button, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import { singularToPlural } from 'src/utils/pluralToSingular';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import constants from '../constant.json';

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
  const [animalTypeId, setAnimalTypeId] = useState(0);
  const [animalTypeList, setAnimalTypeList] = useState(newItem);
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef<any>(null);

  const showModal = () => {
    form.setFieldValue('animalType', '');
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const getAnimalType = () => {
    setGetLoading(true);
    apiCall('saanimaltype/get-sa-animal-type', 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setGetLoading(false);
          setAnimalTypeList(resp?.data?.data?.saAnimalTypes);
        }
      });
  };

  useEffect(() => {
    setKey(Date.now());
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalTypeId(0);
      form.setFieldValue('animalType', '');
      setValidationStatus({});
    }
  }, [activeTab, isModalVisible]);

  useEffect(() => {
    getAnimalType();
  }, []);

  // eslint-disable-next-line
  const handleAnimalTypeDelete = (id: string) => {
    const data = '';
    apiCall(`saanimaltype/delete-sa-animal-type/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getAnimalType();
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
    form.setFieldValue('animalType', data.typeName || '');
    setAnimalTypeId(data.id);
    setTempForm(data.typeName);
    setEditModal(value);
    form.setFieldValue('animalType', data?.typeName);
    setIsModalVisible(value);
  };

  const validate = (animalTypeData: string): { validateStatus: ValidateStatus } => {
    if (!animalTypeData) {
      setErrorMsg('Animal type is required');
      return { validateStatus: 'error' };
    }
    if (animalTypeData?.split('')?.length > 75) {
      setErrorMsg('Should be less than 75 characters');
      return { validateStatus: 'error' };
    }

    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleOk = async () => {
    form.validateFields();
    setLoading(true);

    const data = {
      typeName: singularToPlural(form.getFieldValue('animalType')),
      roleName: role,
    };
    if (!editModal) {
      apiCall('saanimaltype/create-sa-animal-type', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.data?.id) {
            setLoading(false);
            setIsModalVisible(false);
            getAnimalType();
            message.success({
              content: respAdd?.data?.message || alertConstant.animal_type_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          if (respAdd?.data?.success) {
            setLoading(false);
            message.error({
              content: respAdd?.data?.message || alertConstant.animal_type_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
        });
    } else {
      apiCall(`saanimaltype/update-sa-animal-type/${animalTypeId}`, 'POST', data)
        .then((respUpdate: any) => {
          if (respUpdate?.data?.success) {
            getAnimalType();
            setLoading(false);
            setIsModalVisible(false);
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
  };

  const handleInput = (value: string) => {
    form.setFieldValue('animalType', value);
  };

  const handleCancel = () => {
    if (tempForm === form.getFieldValue('animalType')) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  return (
    <div onMouseMove={() => handleInput(singularToPlural(form.getFieldValue('animalType'))) as any}>
      <Modal
        title={editModal ? 'Edit Animal Type' : 'Add New Animal Type'}
        open={isModalVisible}
        okText={editModal ? 'Update' : 'Save'}
        onOk={form.submit}
        onCancel={handleCancel}
        key={key}
        centered
        okButtonProps={{
          className: 'ftr-button-primary',
          loading,
          onMouseOver: () => handleInput(singularToPlural(form.getFieldValue('animalType'))),
        }}
        cancelButtonProps={{ className: 'ftr-button-secondary' }}
      >
        <Form onFinish={handleOk} form={form}>
          <TextInput
            name="animalType"
            label="Animal Type"
            required
            placeholder="Animal Type"
            isRequired
            highlightInput
            key={key}
            rules={[
              { required: true, message: 'Animal Type is required' },
              { max: 40, message: 'Should be less than 40 characters' },
            ]}
          />
        </Form>
      </Modal>
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="end">
              {/* <Typography.Link><PlusOutlined style={{ fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
              <Button className="ftr-button-dashed" style={{ margin: '0px 10px' }} onClick={showModal}>
                <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                <span className="btn-text">Add</span>
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
