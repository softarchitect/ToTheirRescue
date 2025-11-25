/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Row, Col, Form, message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const { confirm } = Modal;

const cssPrefix = 'ftr-customization';

const VolunteerActivities: FC<any> = (newProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [volunteerActivityList, setVolunteerActivityList] = useState<[]>([]);
  const [volunteerActivityId, setVolunteerActivityId] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const getVolunteerActivities = () => {
    setListLoading(true);
    apiCall('savolunteer-activity/get-sa-volunteer-activity', 'GET', {})
      .then((resp: any) => {
        setListLoading(false);
        if (resp?.data?.success) {
          setVolunteerActivityList(resp?.data?.data?.saVolunteerActivities);
        }
      });
  };

  useEffect(() => {
    getVolunteerActivities();
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      setLoading(false);
      form.setFieldValue('volunteerActivity', '');
      setVolunteerActivityId(0);
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
    console.log(data?.saVolunteerActivityName, '==========-------++++');

    form.setFieldValue('volunteerActivity', data.saVolunteerActivityName);
    setTempForm(data.saVolunteerActivityName);
    setVolunteerActivityId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    await form.validateFields();
    setLoading(true);
    const data = {
      saVolunteerActivityName: form.getFieldValue('volunteerActivity'),
    };
    apiCall('savolunteer-activity/create-sa-volunteer-activity', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.data?.id) {
          getVolunteerActivities();
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
      saVolunteerActivityName: form.getFieldValue('volunteerActivity'),
    };
    apiCall(`savolunteer-activity/update-sa-volunteer-activity/${volunteerActivityId}`, 'POST', data)
      .then((respUpdate: any) => {
        setLoading(false);
        if (respUpdate?.data?.success) {
          setIsModalVisible(false);
          getVolunteerActivities();
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

  const handleVolunteerActivityDelete = (id: string) => {
    const data = '';
    apiCall(`savolunteer-activity/delete-sa-volunteer-activity/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          getVolunteerActivities();
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
    if (tempForm === form.getFieldValue('volunteerActivity')) {
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
      form="admin-volunteer-activity-form"
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
        title={`${editModal ? 'Edit' : 'Add'} Volunteer Activity`}
        open={isModalVisible}
        okButtonProps={{ loading }}
        footer={footerContent}
        onCancel={handleCancel}
        centered
      >
        <Form id="admin-volunteer-activity-form" form={form}>
          <TextInput
            name="volunteerActivity"
            rules={[
              { required: true, message: 'Volunteer Activity is required' },
            ]}
            label="Volunteer Activity"
            isRequired
            key={key}
            placeholder="Volunteer Activity"
            highlightInput
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
          showHeader={false}
          selectable={false}
          tableType="Volunteer Activity"
          isLoading={listLoading}
          tableData={volunteerActivityList}
          columnData={[{
            title: 'Volunteer Activity',
            dataIndex: 'saVolunteerActivityName',
            width: '80%',
          }]}
          delete={handleVolunteerActivityDelete}
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

export default VolunteerActivities;
