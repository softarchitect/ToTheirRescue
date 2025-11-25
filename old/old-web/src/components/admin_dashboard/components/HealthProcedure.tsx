/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import { apiCall } from 'src/shared/api/apiWrapper';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

interface HealthProcedureInterface {
  id: string;
  kind: string
}

const HealthProcedure: FC<any> = (newProps) => {
  const {
    activeTab, animalIdToType, permissions, animalTypeList, animalType, onchangeAnimalType,
  } = newProps;
  const newHealthProcedure: HealthProcedureInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [healthProcedureList, setHealthProcedureList] = useState(newHealthProcedure);
  const [healthProcedureId, setHealthProcedureId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const getHealthProcedure = (animalTypeId: number) => {
    setListLoading(true);
    apiCall(`sahealth-procedure/get-sa-health-procedure-by-animaltypeId?saAnimalTypeId=${animalTypeId}`, 'GET', {})
      .then((resp: any) => {
        setListLoading(false);
        if (resp?.data?.success) {
          setHealthProcedureList(resp?.data?.data?.saHealthProcedures);
        }
      });
  };

  useEffect(() => {
    getHealthProcedure(animalType);
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false);
      form.setFieldValue('procedure', '');
      setHealthProcedureId(0);
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
    form.setFieldValue('procedure', data.kind);
    setTempForm(data.kind);
    setHealthProcedureId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    await form.validateFields();
    setLoading(true);
    const data = {
      kind: form.getFieldValue('procedure'),
      saAnimalTypeId: animalType,
    };
    apiCall('sahealth-procedure/create-sa-health-procedure', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.data?.id) {
          getHealthProcedure(animalType);
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
      kind: form.getFieldValue('procedure'),
      saAnimalTypeId: animalType,
    };
    apiCall(`sahealth-procedure/update-sa-health-procedure/${healthProcedureId}`, 'POST', data)
      .then((respUpdate: any) => {
        setLoading(false);
        if (respUpdate?.data?.success) {
          setIsModalVisible(false);
          getHealthProcedure(animalType);
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

  const handleHealthProcedureDelete = (id: string) => {
    const data = '';
    apiCall(`sahealth-procedure/delete-sa-health-procedure/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getHealthProcedure(animalType);
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
    if (tempForm === form.getFieldValue('procedure')) {
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
      form="admin-health-procedure-form"
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
        title={`${editModal ? 'Edit' : 'Add'} Health Procedure`}
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
        <Form id="admin-health-procedure-form" form={form}>
          <TextInput
            name="procedure"
            rules={[
              { required: true, message: 'Health Procedure is required' },
            ]}
            label="Health Procedure"
            isRequired
            key={key}
            placeholder="Health Procedure"
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
          tableType="Health Procedure"
          isLoading={listLoading}
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
