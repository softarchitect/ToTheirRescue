/* eslint-disable no-console */
import { useEffect, useState, FC } from 'react';
import {
  Modal, Button, Input, Row, Col, Select, Form, message,
} from 'antd';
import TyrModal from 'src/shared/components/Modal/TyrModal';
// eslint-disable-next-line no-unused-vars
import { PlusOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CustomTable from '../../../shared/components/CustomTable';
// eslint-disable-next-line
import alertConstant from '../../../shared/constants/alert.json';

// import {useAnimalTypeApi} from '../../api/useAnimalType';
// import {useAnimalBehaviour} from '../../api/useAnimalBehaviour';

const { confirm } = Modal;

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface AnimalType {
  id: string;
  type: string;
}

interface AnimalBehaviour {
  id: string;
  behavior: string
}

interface Props {
  activeTab: string;
}

const AddAnimalToCategory: FC<Props> = (newProps) => {
  const { activeTab } = newProps;
  const newAnimalType: AnimalType[] = [];
  const newAnimalBehaviour: AnimalBehaviour[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [animalTypeList, setAnimalTypeList] = useState(newAnimalType);
  // eslint-disable-next-line
  const [animalBehaviourList, setAnimalBehaviourList] = useState(newAnimalBehaviour);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [animalType, setAnimalType] = useState<any>('');
  const [animalBehaviour, setAnimalBehaviour] = useState('');
  const [editModal, setEditModal] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [tempForm, setTempForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');

  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    setAnimalTypeList([
      { id: '1', type: 'Dogs' },
      { id: '2', type: 'Cats' },
      { id: '3', type: 'Birds' },
    ]);
    setAnimalBehaviourList([
      { id: '1', behavior: 'Siberian Lion' },
      { id: '2', behavior: 'Bengal Tiger' },
      { id: '3', behavior: 'Asian Lion' },
    ]);
    setAnimalType(JSON.stringify({ id: '1', type: 'Dogs' }));
  }, []);

  // const animalTypesApi = useAnimalTypeApi();
  // let getAnimalTypes = animalTypesApi.getAnimalTypes;
  // const animalBehaviourApi = useAnimalBehaviour();
  // let getAnimalBehaviour = animalBehaviourApi.getAnimalBehaviour;
  // let addAnimalBehaviour = animalBehaviourApi.createAnimalBehaviour;
  // let updateAnimalBehaviour = animalBehaviourApi.updateAnimalBehaviour;
  // let deleteAnimalBehaviour = animalBehaviourApi.deleteAnimalBehaviour;

  const validate = (behaviour: any): { validateStatus: ValidateStatus } => {
    if (!behaviour) {
      setErrorMsg('Animal To Category is required');
      return { validateStatus: 'error' };
    }
    if (behaviour.length > 20) {
      setErrorMsg('Should be less than 20 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  function onChange(value: string) {
    setAnimalType(value);
  }

  function onBlur() {
    // console.log('blur');
  }

  function onFocus() {
    // console.log('focus');
  }

  function onSearch() {
    // console.log('search:', value);
  }

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setAnimalBehaviour(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAnimalBehaviour(data.behavior);
    setTempForm(data.behavior);
    setEditData(data);
    setEditModal(value);
    setIsModalVisible(value);
  };

  useEffect(() => {

  }, [activeTab]);

  useEffect(() => {
    if (!animalType?.id) {
      // eslint-disable-next-line
      return;
    }
  }, [animalType]);

  useEffect(() => {
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAnimalBehaviour('');
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [isModalVisible]);

  const handleOk = async () => {
    setLoading(true);
    const validateResponse = validate(animalBehaviour);
    if (validateResponse && validateResponse.validateStatus !== 'success') {
      setValidationStatus({ ...validate(animalBehaviour) });
      setLoading(false);
      // eslint-disable-next-line no-useless-return
      return;
    }
    if (!editModal) {
      message.success({
        content: alertConstant.animal_behaviour_add_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
    } else {
      message.success({
        content: alertConstant.animal_behaviour_update_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
    }
    setEditModal(false);
    setIsModalVisible(false);
  };

  // eslint-disable-next-line
  const handleAnimalToCategoryDelete = (id: string) => {
    message.success({
      content: alertConstant.animal_behaviour_delete_success,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const handleCancel = () => {
    if (tempForm === animalBehaviour) {
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleOk();
      },
      onCancel() {
        setIsModalVisible(false);
        setEditModal(false);
      },
    });
  };

  const ModalContent = (
    <div>
      <p style={{ marginBottom: '0px', fontSize: '12px' }}>
        <b>Note: </b>
        Enter the PLURAL version of the animal category that you rescue.
      </p>
      <p style={{ marginBottom: '20px' }}>
        <b>Examples: </b>
        Dogs not Dog. Rabbits not Rabbit.
      </p>
      <div style={{ margin: '10px' }}>
        <b>Animal Type</b>
        :
        {` ${animalType && JSON.parse(animalType)?.type}`}
      </div>
      <Form form={form} onFinish={handleOk}>
        <Form.Item
          label="Animal Type"
          required
          validateStatus={validationStatus.validateStatus}
          help={errorMsg}
        >
          <Input
            key={key}
            ref={(ref) => ref && ref.focus({ cursor: 'end' })}
            value={animalBehaviour}
            onChange={(e) => {
              handleInput(e.target.value);
            }}
            placeholder="Animal Type"
          />
        </Form.Item>
      </Form>
    </div>
  );

  const FooterContent = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-category-form"
      key="submit"
      htmlType="submit"
      loading={loading}
      onClick={form.submit}
    >
      Save
    </Button>,
  ];

  return (
    <>
      <TyrModal
        modalTitle={`${editModal ? 'Edit' : 'Add'} Animal To Category`}
        modalContent={ModalContent}
        footerContent={FooterContent}
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        onCancel={handleCancel}
        size="small"
      />
      {/* <Modal
        title={`${editModal ? 'Edit' : 'Add'} Animal To Category`}
        onOk={form.submit}
        onCancel={handleCancel}
        okButtonProps={{ className: 'ftr-button-primary', loading }}
        cancelButtonProps={{ className: 'ftr-button-secondary' }}
      >
        <div style={{ margin: '10px' }}>
          <b>Animal Type</b>
          :
          {` ${animalType && JSON.parse(animalType)?.type}`}
        </div>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            label="Animal To Category"
            required
            validateStatus={validationStatus.validateStatus}
            help={errorMsg}
          >
            <Input
              key={key}
              ref={(ref) => ref && ref.focus({ cursor: 'end' })}
              value={animalBehaviour}
              onChange={(e) => {
                handleInput(e.target.value);
              }}
              placeholder="Animal To Category"
            />
          </Form.Item>
        </Form>
      </Modal> */}
      <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
        <Col flex={3}>
          <Row justify="start" style={{ width: '200px' }}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a animal type"
              optionFilterProp="children"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onChange}
              // eslint-disable-next-line react/jsx-no-bind
              onFocus={onFocus}
              // eslint-disable-next-line react/jsx-no-bind
              onBlur={onBlur}
              // eslint-disable-next-line react/jsx-no-bind
              onSearch={onSearch}
            >
              {animalTypeList?.map((data) => <Option key={data?.id} value={JSON.stringify(data)}>{data.type}</Option>)}
            </Select>
          </Row>
        </Col>
        <Col flex={3}>
          <Row justify="end">
            <Button
              disabled={!animalType}
              className="ftr-button-secondary"
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
          tableType="Animal To Category"
          tableData={animalBehaviourList}
          isLoading={false}
          columnData={[{
            title: 'Animal To Category',
            dataIndex: 'behavior',
            width: '80%',
          }]}
          delete={handleAnimalToCategoryDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default AddAnimalToCategory;
