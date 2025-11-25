/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import { apiCall } from 'src/shared/api/apiWrapper';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

const AnimalMedicene: FC<any> = (newProps) => {
  const {
    permissions,
  } = newProps;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [animalMedicineList, setAnimalMedicineList] = useState<[]>([]);
  const [medicineId, setMedicineId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [isFormTouched, setIsFormTouched] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const getMedicines = () => {
    setListLoading(true);
    apiCall('samedicine/get-samedicine', 'GET', {})
      .then((resp: any) => {
        setListLoading(false);
        if (resp?.data?.success) {
          setAnimalMedicineList(resp?.data?.data?.medicines);
        }
      });
  };

  useEffect(() => {
    getMedicines();
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false);
      form.resetFields();
      setMedicineId(0);
    }
    setKey(Date.now());
    setIsFormTouched(false);
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
    form.setFieldsValue({ ...data });
    setTempForm({ ...data });
    setMedicineId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    await form.validateFields();
    setLoading(true);
    const data = form.getFieldsValue();
    apiCall('samedicine/create-samedicine', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.data?.id) {
          getMedicines();
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
    const data = form.getFieldsValue();
    apiCall(`samedicine/update-samedicine/${medicineId}`, 'POST', data)
      .then((respUpdate: any) => {
        setLoading(false);
        if (respUpdate?.data?.success) {
          setIsModalVisible(false);
          getMedicines();
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

  const handleAnimalMedicineDelete = async (id: string) => {
    const data = '';
    apiCall(`samedicine/delete-samedicine/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getMedicines();
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
    if (!isFormTouched) {
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
      form="superadmin-animal-medicine"
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
        title={`${editModal ? 'Edit' : 'Add'} Medicine`}
        open={isModalVisible}
        okButtonProps={{ loading }}
        footer={footerContent}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} id="superadmin-animal-medicine">
          <TextInput
            label="Name"
            name="medicineName"
            placeholder="Medicine Name"
            rules={[
              { required: true, message: 'Medicine Name is required' },
            ]}
            isRequired
            onChange={() => setIsFormTouched(true)}
          />
          <TextInput
            label="Used For"
            name="usedFor"
            placeholder="Used For"
            rules={[
              { required: true, message: 'Used For is required' },
            ]}
            isRequired
            onChange={() => setIsFormTouched(true)}
          />
          <AreaInput
            label="Notes"
            name="notes"
            placeholder="Notes"
            form={form}
            onChange={() => setIsFormTouched(true)}
          />
        </Form>
      </Modal>
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          {/* <Row justify="start" style={{ width: '200px' }}>
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
          </Row> */}
        </Col>
        <Col flex={3}>
          <Row justify="end">
            <Button
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
          showHeader
          selectable={false}
          tableData={animalMedicineList}
          tableType="Animal Medicine"
          isLoading={false}
          hideBorderColor
          columnData={[
            {
              title: 'Medicine Name',
              dataIndex: 'medicineName',
              width: '40%',
            },
            {
              title: 'Used For',
              dataIndex: 'usedFor',
              width: '40%',
            },
          ]}
          delete={handleAnimalMedicineDelete}
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

export default AnimalMedicene;
