/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

const AnimalBehavior: FC<any> = (newProps) => {
  const {
    activeTab, animalIdToType, permissions, animalTypeList, animalType, onchangeAnimalType,
  } = newProps;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [behaviorList, setBehaviorList] = useState<[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [behaviorId, setBehaviorId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getListLoading, setGetListLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const getBehaviors = (animalTypeId: number) => {
    setGetListLoading(true);
    apiCall(`sabehavior/get-sa-behaviors-by-animaltypeid?animalTypeId=${animalTypeId}`, 'GET', {})
      .then((resp: any) => {
        setGetListLoading(false);
        if (resp?.data?.success) {
          setBehaviorList(resp?.data?.data?.saBehaviors);
        }
      });
  };

  useEffect(() => {
    getBehaviors(animalType);
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false);
      form.setFieldValue('behavior', '');
      setBehaviorId(0);
    }
    setKey(Date.now());
  }, [isModalVisible]);

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(value: string) {
    console.log('search:', value);
  }

  const setEditModalOpen = (value: boolean, data: any) => {
    form.setFieldValue('behavior', data.behaviorName);
    setTempForm(data.behaviorName);
    setBehaviorId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    await form.validateFields();
    setLoading(true);
    const data = {
      behaviorName: form.getFieldValue('behavior'),
      saAnimalTypeId: animalType,
    };
    apiCall('sabehavior/create-sa-behavior', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.data?.id) {
          getBehaviors(animalType);
          message.success({
            content: respAdd?.data?.message || alertConstant.health_procedure_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          setIsModalVisible(false);
        } else {
          message.error({
            content: respAdd?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    const data = {
      behaviorName: form.getFieldValue('behavior'),
      saAnimalTypeId: animalType,
    };
    apiCall(`sabehavior/update-sa-behavior/${behaviorId}`, 'POST', data)
      .then((respUpdate: any) => {
        setLoading(false);
        if (respUpdate?.data?.success) {
          setIsModalVisible(false);
          getBehaviors(animalType);
          message.success({
            content: respUpdate?.data?.message || alertConstant.health_procedure_update_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleBehaviorDelete = (id: string) => {
    const data = '';
    apiCall(`sabehavior/delete-sa-behavior/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getBehaviors(animalType);
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
    if (tempForm === form.getFieldValue('behavior')) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  const footerContent = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="admin-behavior-form"
      key="submit"
      htmlType="submit"
      onClick={editModal ? handleUpdate : handleOk}
      loading={loading}
    >
      {editModal ? 'Update' : 'Save'}
    </Button>,
  ];

  return (
    <>
      <Modal
        key={key}
        title={`${editModal ? 'Edit' : 'Add'} Animal Behavior`}
        open={isModalVisible}
        okButtonProps={{ loading }}
        footer={footerContent}
        onCancel={handleCancel}
        centered
      >
        <div style={{ margin: '10px' }}>
          <b>Animal Type</b>
          :
          {` ${animalIdToType[animalType]}`}
        </div>
        <Form id="admin-behavior-form" form={form}>
          <TextInput
            name="behavior"
            rules={[
              { required: true, message: 'Animal Behavior is required' },
            ]}
            label="Animal Behavior"
            isRequired
            key={key}
            placeholder="Animal Behavior"
            highlightInput
          />
        </Form>
      </Modal>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="start" style={{ width: '200px' }}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a animal type"
              optionFilterProp="children"
              // eslint-disable-next-line
              onChange={(data: any) => onchangeAnimalType(data)}
              // eslint-disable-next-line
              onFocus={onFocus}
              // eslint-disable-next-line
              onBlur={onBlur}
              // eslint-disable-next-line
              onSearch={onSearch}
              value={animalType}
            >
              {animalTypeList?.map((data: any) => <Option key={data?.id} value={data?.id}>{data.typeName}</Option>)}
            </Select>
          </Row>
        </Col>
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
      </Row>
      <div style={{ marginTop: '10px' }}>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={false}
          showHeader={false}
          selectable={false}
          tableType="Animal Behavior"
          isLoading={getListLoading}
          tableData={behaviorList}
          columnData={[{
            title: 'Animal Behavior',
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

export default AnimalBehavior;
