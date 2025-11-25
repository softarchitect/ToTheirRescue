import { FC, useEffect, useState } from 'react';
import {
  Modal, Input, Row, Col, Form, Button, message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'ftr-customization';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface Item {
  id: string;
  volunteerActivityName: string;
}

const VolunteerActivities: FC<any> = ({ permissions }) => {
  const newItem: Item[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [volunteerActivities, setVolunteerActivities] = useState('');
  const [volunteerActivityId, setVolunteerActivityId] = useState(0);
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [volunteerActivitiesList, setVolunteerActivitiesList] = useState(newItem);
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [tempForm, setTempForm] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const data = {};
    apiCall('volunteer-activity/get-volunteer-activity', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setVolunteerActivitiesList(resp?.data?.data?.volunteerActivities);
        }
      });
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setVolunteerActivities('');
      setChangeData(false);
      setVolunteerActivityId(0);
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  const validate = (volunteerActivitie: string): { validateStatus: ValidateStatus } => {
    if (!volunteerActivitie) {
      setErrorMsg('Volunteer Activity is required');
      return { validateStatus: 'error' };
    }
    if (volunteerActivitie.split('').length > 75) {
      setErrorMsg('Should be less than 75 characters');
      return { validateStatus: 'error' };
    }
    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  const handleVolunteerActivityDelete = (id: string) => {
    const data = '';
    apiCall(`volunteer-activity/delete-volunteer-activity/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.volunteer_activities_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setVolunteerActivities(data.volunteerActivityName);
    setTempForm(data.volunteerActivityName);
    setChangeData(data);
    setVolunteerActivityId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && volunteerActivities === tempForm && volunteerActivities.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(volunteerActivities);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(volunteerActivities) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        volunteerActivityName: volunteerActivities,
      };
      apiCall(`volunteer-activity/available-volunteer-activity?volunteerActivityName=${volunteerActivities}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('volunteer-activity/create-volunteer-activity', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.volunteer_activities_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`volunteer-activity/update-volunteer-activity/${volunteerActivityId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.volunteer_activities_update_success,
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
              content: resp?.data?.message || alertConstant.volunteer_activities_duplicate_entry,
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

  const onChangeInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
  };

  const handleCancel = () => {
    if (tempForm === volunteerActivities) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.volunteer_activities?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {permissions?.customization?.volunteer_activities?.add && (
        <Modal
          title={`${editModal ? 'Edit' : 'Add'} Volunteer Activity`}
          visible={isModalVisible}
          okButtonProps={{ loading }}
          onOk={form.submit}
          okText={editModal ? 'Update' : 'Save'}
          onCancel={handleCancel}
          centered
        >
          <Form onFinish={handleOk} form={form}>
            <Form.Item
              label="Volunteer Activity"
              className="hide-label"
              style={{ padding: '0px 10px' }}
              required
              validateStatus={validationStatus.validateStatus}
              help={errorMsg}
            >
              <Input
                key={key}
                ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                value={volunteerActivities}
                onChange={(e) => {
                  onChangeInput(e.target.value);
                  setVolunteerActivities(e.target.value);
                }}
                placeholder="Volunteer Activity"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input
                 onChange={(e)=>onSearch(e.target.value)}
                 placeholder="Search Animal Type"/> */}
            </Row>
          </Col>
          {permissions?.customization?.volunteer_activities?.add && (
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
          )}
        </Row>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={!permissions?.customization?.volunteer_activities?.edit}
          isNotDeletable={!permissions?.customization?.volunteer_activities?.delete}
          showHeader={false}
          selectable={false}
          tableData={volunteerActivitiesList}
          tableType="Volunteer Activity"
          isLoading={false}
          columnData={[{
            title: 'Volunteer Activity',
            dataIndex: 'volunteerActivityName',
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
