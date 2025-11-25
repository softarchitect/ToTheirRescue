/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Row, Col, Select, Form, message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import { apiCall } from 'src/shared/api/apiWrapper';

const cssPrefix = 'ftr-customization';

interface HealthProcedureInterface {
  id: string;
  kind: string
}

const AnimalVaccinationType: FC<any> = (newProps) => {
  const {
    animalIdToType, animalTypeList, animalType, onchangeAnimalType,
  } = newProps;
  const newHealthProcedure: HealthProcedureInterface[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vaccinationTypeList, setVaccinationTypeList] = useState(newHealthProcedure);
  const [vaccinationTypeId, setVaccinationTypeId] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const getVaccinationType = (animalTypeId: number) => {
    setListLoading(true);
    apiCall(`savaccination-type/get-sa-vaccination-type-by-animalTypeId?saAnimalTypeId=${animalTypeId}`, 'GET', {})
      .then((resp: any) => {
        setListLoading(false);
        if (resp?.data?.success) {
          setVaccinationTypeList(resp?.data?.data?.saVaccinationTypes);
        }
      });
  };

  useEffect(() => {
    getVaccinationType(animalType);
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false);
      form.setFieldValue('vaccinationType', '');
      setVaccinationTypeId(0);
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
    form.setFieldValue('vaccinationType', data.kind);
    setTempForm(data.kind);
    setVaccinationTypeId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    await form.validateFields();
    setLoading(true);
    const data = {
      kind: form.getFieldValue('vaccinationType'),
      saAnimalTypeId: animalType,
    };
    apiCall('savaccination-type/create-sa-vaccination-type', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.data?.id) {
          getVaccinationType(animalType);
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
      kind: form.getFieldValue('vaccinationType'),
      saAnimalTypeId: animalType,
    };
    apiCall(`savaccination-type/update-sa-vaccination-type/${vaccinationTypeId}`, 'POST', data)
      .then((respUpdate: any) => {
        setLoading(false);
        if (respUpdate?.data?.success) {
          setIsModalVisible(false);
          getVaccinationType(animalType);
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

  const handleVaccinationTypeDelete = (id: string) => {
    const data = '';
    apiCall(`savaccination-type/delete-sa-vaccination-type/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getVaccinationType(animalType);
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
    if (tempForm === form.getFieldValue('vaccinationType')) {
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
      form="admin-vaccination-type-form"
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
        title={`${editModal ? 'Edit' : 'Add'} Vaccination Type`}
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
        <Form id="admin-vaccination-type-form" form={form}>
          <TextInput
            name="vaccinationType"
            rules={[
              { required: true, message: 'Vaccination Type is required' },
            ]}
            label="Vaccination Type"
            isRequired
            key={key}
            placeholder="Vaccination Type"
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
          showHeader={false}
          selectable={false}
          tableType="Vaccination Type"
          isLoading={listLoading}
          tableData={vaccinationTypeList}
          columnData={[{
            title: 'Vaccination Type',
            dataIndex: 'kind',
            width: '80%',
          }]}
          delete={handleVaccinationTypeDelete}
          setEditModalOpen={setEditModalOpen}
          isNotEditable={false}
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
