/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
import { useState, useEffect } from 'react';
import {
  Modal, message, Input, Switch, Button, Form,
  Col,
  Row,
  Skeleton,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import 'src/components/animals/actions/behaviors/Behavior.less';
import { pluralToSingular, singularToPlural } from 'src/utils/pluralToSingular';
import { isMobile } from 'react-device-detect';

const cssPrefix = 'behavior-modal';

export interface BehaviorModalProps {
  visible: boolean;
  onCancelClicked: any;
  animalList: any;
  selectedAnimal: any;
  setVisible: any;
}

export const AnimalBehaviorModal = (props: BehaviorModalProps) => {
  const { selectedAnimal, visible, setVisible } = props;
  const { confirm } = Modal;
  const [formData, setFormData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [addLoading, setAddLoading] = useState<any>(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [formKey, setFormKey] = useState('form-behavior-1');

  const { useForm } = Form;
  const [behaviorForm] = useForm();

  const closeModal = () => {
    props.onCancelClicked(!visible);
  };

  const handleSubmit = async () => {
    const abc = await behaviorForm.validateFields();
    console.log(abc, '_______________-');

    setAddLoading(true);

    // eslint-disable-next-line no-shadow
    const data = {
      animalIds: selectedAnimal?.ids,
      AnimalBehaviorVms: [
        ...formData,
      ],
    };

    apiCall('animal-behavior/upsert-animal-behaviors', 'POST', data)
      .then((respAdd: any) => {
        if (respAdd?.data?.success) {
          message.success({
            content: respAdd?.data?.message || alertConstant.behaviour_add_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
        setAddLoading(false);
        closeModal();
      });
  };

  // eslint-disable-next-line no-unused-vars
  const handleCancel = () => {
    confirm({
      title: 'Do you want to cancel?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        closeModal();
      },
      onCancel() { },
    });
  };

  // eslint-disable-next-line no-unused-vars
  const onCancel = () => {
    if (!isFormChanged) {
      setVisible(false);
      return;
    }
    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleSubmit();
      },
      onCancel() {
        closeModal();
      },
    });
  };

  const handleBehaviorChange = (checked: boolean, record: any) => {
    const currentFormData = formData;
    const newBehavior = currentFormData?.map((data: any) => {
      if (data?.id === record?.id) {
        return { ...data, yesOrNo: checked || false };
      }
      return data;
    });
    setFormData(newBehavior);
    setIsFormChanged(true);
  };

  const handleCommentChange = (value: string, record: any) => {
    const currentFormData = formData;
    const newBehavior = currentFormData?.map((data: any) => {
      if (data?.id === record?.id) {
        return { ...data, notes: value || '' };
      }
      return data;
    });
    setFormData(newBehavior);
    setIsFormChanged(true);
  };

  const columns = [
    {
      title: 'Behavior',
      dataIndex: 'behaviorName',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Yes/No',
      dataIndex: 'yesOrNo',
      key: 'yesOrNo',
      width: '10%',
      render: (value: boolean, record: any) => (
        <div>
          <Switch
            onClick={(checked) => handleBehaviorChange(checked, record)}
            checked={record?.yesOrNo || false}
            checkedChildren="yes"
            unCheckedChildren="no"
          />
        </div>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'notes',
      key: 'comment',
      width: '35%',
      render: (text: string, record: any, index: any) => (
        <Form.Item
          className="hide-label"
          style={{ padding: '0px', margin: '0px' }}
          rules={[{ required: true, type: 'string', max: 10 }]}
        >
          <Input
            required
            placeholder={`Comment for ${record?.behaviorName}`}
            value={record?.notes}
            onChange={(e) => handleCommentChange(e.target.value, record)}
            suffix={(
              <span
                style={{
                  color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
                }}
              >
                optional
              </span>
            )}
          />
        </Form.Item>
      ),
    },
  ];

  const setBehaviorsByAnimalId = async (animalId: any) => {
    const animalTypeId = selectedAnimal?.animalDetails?.[0]?.animalTypeId;
    const behaviorMap: any = {};
    let animalBehavior: any = await apiCall(`animal-behavior/get-animal-behaviors?animalId=${animalId}`, 'GET', {});
    animalBehavior = animalBehavior?.data?.data?.animalBehaviors;
    animalBehavior?.forEach((data: any) => {
      behaviorMap[data?.behaviorId] = data;
    });
    apiCall(`behavior/get-behaviors-by-animalId?animalTypeId=${animalTypeId}`, 'GET', formData)
      .then((behaviorList: any) => {
        if (behaviorList?.data?.success) {
          const newBehaviorData = behaviorList?.data?.data?.behaviors?.map((behavior: any) => {
            if (behaviorMap?.[behavior?.id]) {
              return ({
                key: Date.now() + behavior?.id,
                id: behavior?.id,
                behaviorId: behavior?.id,
                behaviorName: behavior?.behaviorName,
                yesOrNo: behaviorMap?.[behavior?.id]?.yesOrNo,
                notes: behaviorMap?.[behavior?.id]?.notes,
              });
            }
            return ({
              key: Date.now() + behavior?.id,
              id: behavior?.id,
              behaviorId: behavior?.id,
              behaviorName: behavior?.behaviorName,
              yesOrNo: false,
              notes: '',
            });
          });
          setFormData(newBehaviorData);
          setIsLoading(false);
        }
      });
  };

  const setBehaviorsByAnimalTypeId = async (animalTypeId: any) => {
    setIsLoading(true);
    apiCall(`behavior/get-behaviors-by-animalId?animalTypeId=${animalTypeId}`, 'GET', formData)
      .then((behaviorList: any) => {
        if (behaviorList?.data?.success) {
          const newBehaviorData = behaviorList?.data?.data?.behaviors?.map((behavior: any) => ({
            id: behavior?.id,
            behaviorId: behavior?.id,
            behaviorName: behavior?.behaviorName,
            yesOrNo: false,
            notes: '',
          }));
          setFormData(newBehaviorData);
          setIsLoading(false);
        }
      });
  };

  const fetchAnimalBehaviors = async () => {
    setIsLoading(true);
    const idLength = selectedAnimal?.ids?.length;
    const animalId = selectedAnimal?.ids?.[0];
    const animalTypeId = selectedAnimal?.animalDetails?.[0]?.animalTypeId;

    if (idLength > 1) {
      await setBehaviorsByAnimalTypeId(animalTypeId);
      return;
    }
    await setBehaviorsByAnimalId(animalId);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    setFormKey(`form-behavior-${Date.now()}`);
    setIsFormChanged(false);
    fetchAnimalBehaviors();
  }, [visible]);

  const modalContent = (
    <div key={formKey} className={`${cssPrefix}__container`}>
      <AnimalDetailCard animalDetails={selectedAnimal?.animalDetails} cardWidth={32} />
      <div style={{ width: '100%', padding: isMobile ? '0px' : '0px 10px' }}>
        {!isLoading && !formData?.[0] && (
          <Row justify="center" style={{ padding: '60px 0px', color: '#FF8282' }}>
            Enter behaviors you would like to track for &nbsp;
            {singularToPlural(selectedAnimal?.animalDetails?.[0]?.animalType)}
            &nbsp; in your customization section
          </Row>
        )}
        {!isLoading ? (
          <Form id="behavior-form" form={behaviorForm}>
            {formData?.map((record: any) => {
              behaviorForm?.setFieldValue(`behavior-${record?.id}`, record?.notes);
              return (
                <Row key={`behavior-${record?.id}`} align="middle" style={{ padding: '10px 0px' }}>
                  <Col xs={8} sm={10}>
                    {record?.behaviorName}
                  </Col>
                  <Col xs={4} sm={4}>
                    <div>
                      <Switch
                        onClick={(checked) => handleBehaviorChange(checked, record)}
                        checked={record?.yesOrNo || false}
                        checkedChildren="yes"
                        unCheckedChildren="no"
                      />
                    </div>
                  </Col>
                  <Col xs={12} sm={10}>
                    <Form.Item
                      htmlFor="behavior-form"
                      key={`behavior-${record?.id}`}
                      className="hide-label"
                      name={`behavior-${record?.id}`}
                      style={{ padding: '0px', margin: '0px' }}
                      rules={[{ type: 'string', max: 20, message: 'Must be 20 characters or less' }]}
                    >
                      <Input
                        placeholder={`Comment for ${record?.behaviorName}`}
                        value={record?.notes}
                        onChange={(e) => handleCommentChange(e.target.value, record)}
                        suffix={(
                          <span
                            style={{
                              color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
                            }}
                          >
                            optional
                          </span>
                        )}
                      />
                    </Form.Item>
                    {/* <Form.Item
                  htmlFor="behavior-form"
                  className="hide-label"
                  name="behavior"
                  style={{ padding: '0px', margin: '0px' }}
                  rules={[{ max: 10 }]}
                >
                  <Input
                    placeholder={`Comment for ${record?.behaviorName}`}
                    value={record?.notes}
                    onChange={(e) => handleCommentChange(e.target.value, record)}
                    suffix={(
                      <span
                        style={{
                          color: '#848484', backgroundColor: '#f2f2f2', padding: '0px 6px', borderRadius: '4px', fontSize: '10px', lineHeight: '20px',
                        }}
                      >
                        optional
                      </span>
                    )}
                  />
                </Form.Item> */}
                  </Col>
                </Row>
              );
            })}
          </Form>
        ) : (
          <>
            <Skeleton.Input style={{ margin: '6px 0px' }} active block />
            <Skeleton.Input style={{ margin: '6px 0px' }} active block />
            <Skeleton.Input style={{ margin: '6px 0px' }} active block />
          </>
        )}
      </div>
      {/* <CustomTable
          tableId={formKey}
          tableKey={formKey}
          config={{ rowSelection: 'none' }}
          isNotDeletable
          isNotEditable
          showHeader={false}
          selectable={false}
          tableType="Animal To Category"
          tableData={[...formData]}
          columnData={columns}
          delete={() => { }}
          setEditModalOpen={() => { }}
          isLoading={isLoading}
        /> */}

    </div>
  );

  const footerContent = [
    <Button key="back" onClick={onCancel}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-behavior-form"
      key="submit"
      htmlType="submit"
      onClick={async () => {
        behaviorForm.validateFields();
        handleSubmit();
      }}
      loading={addLoading}
    >
      Save
    </Button>,
  ];

  return (
    <div>
      <TyrModal
        key={formKey}
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle="Manage Behaviors, Traits, and Characteristics"
        onCancel={onCancel}
        size="md"
      />
    </div>
  );
};
