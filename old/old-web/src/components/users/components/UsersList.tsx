import { useState, FC, useEffect } from 'react';
import {
  Row, Col, Button, message,
} from 'antd';
import Cookies from 'universal-cookie';
import { PlusOutlined } from '@ant-design/icons';
import CustomTable from 'src/shared/components/CustomTable';
import AddUserForm from 'src/components/users/components/AddUserForm';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import { formatStringDateByCountry } from 'src/utils/common';

interface UserListProps {
  loading: boolean,
  inviteUserLoading: boolean,
  userList: any,
  inviteUserCall: any,
  updateUser: any,
  getUserListCall: any,
  deleteUser: any,
  viewInactive: any,
  setViewInactive: any,
  permissions: any,
  role: any,
}

const cookies = new Cookies();
const cssPrefix = 'ftr-users';

const UserList: FC<UserListProps> = (newUserListProps) => {
  const {
    loading, userList, updateUser, inviteUserCall, getUserListCall, deleteUser, viewInactive,
    setViewInactive, inviteUserLoading, permissions, role,
  } = newUserListProps;
  const [editModal, setEditModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line
  const [editData, setEditData] = useState(Object);
  const [userForm, setUserForm] = useState<any>({});
  const [tempForm, setTempForm] = useState('');
  const [userType, setUserType] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    setUserType(cookies.get('loginDetails')?.userType);
  }, []);

  const showModal = () => {
    setTempForm('');
    setIsModalVisible(true);
  };

  const handleUserDelete = (userId: string) => {
    deleteUser({ userId }, () => {
      message.success({
        content: alertConstant.user_delete_success,
        style: {
          marginTop: '2vh',
        },
        key: 'updatable',
      });
      getUserListCall(viewInactive, () => console.log('Getting user list'));
    });
  };

  // eslint-disable-next-line
  const setEditModalOpen = (value: boolean, data: any) => {
    setEditModal(true);
    setTempForm(data);
    setEditData(data);
    setUserForm({ ...data });
    setIsModalVisible(value);
  };

  const sendInvitation = (record: any) => {
    setSendLoading(record?.id);
    apiCall(`user/resend-invitation?email=${record?.email}`, 'POST', {})
      .then((resp: any) => {
        setSendLoading(false);
        if (resp.status === 200) {
          const messageText = resp?.data?.errors?.[0] || resp?.data?.message;
          message.success({
            content: (messageText),
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  return (
    <>
      <div style={{ marginTop: '0px' }}>
        {permissions?.users?.invite && (
          <AddUserForm
            inviteUserLoading={inviteUserLoading}
            viewInactive={viewInactive}
            userForm={userForm}
            setUserForm={setUserForm}
            editModal={editModal}
            setEditModal={setEditModal}
            tempForm={tempForm}
            isModalVisible={isModalVisible}
            setIsModalVisible={(data) => setIsModalVisible(data)}
            getUserListCall={getUserListCall}
            onSubmit={editModal ? updateUser : inviteUserCall}
            role={role}
          />
        )}
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input
                 onChange={(e)=>onSearch(e.target.value)}
                 placeholder="Search Animal Type"/> */}
            </Row>
          </Col>
          <Col flex={3}>
            <Row justify="end">
              {/* <Typography.Link><PlusOutlined style={{ fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
              {permissions?.users?.view_inactive_user && (
                <Button
                  className={`${cssPrefix}__button`}
                  type="dashed"
                  onClick={() => setViewInactive(!viewInactive)}
                >
                  View
                  {(viewInactive ? ' Active ' : ' Inactive ')}
                  Users
                </Button>
              )}
              {permissions?.users?.invite && (
                <Button
                  className={`${cssPrefix}__button`}
                  type="dashed"
                  onClick={showModal}
                  icon={<PlusOutlined rev={undefined} />}
                >
                  Invite New
                </Button>
              )}
            </Row>
          </Col>
        </Row>
        <CustomTable
          config={{
            rowSelection: 'none',
            sendLoading,
            sendInvitation,
          }}
          isNotEditable={viewInactive || userType?.toLocaleLowerCase() !== 'administrator' || !permissions?.users?.edit}
          isNotDeletable={!permissions?.users?.delete}
          showHeader
          selectable={false}
          tableData={userList}
          tableType="Users"
          isLoading={loading}
          columnData={[{
            title: 'Name',
            width: 260,
            dataIndex: 'firstName',
            render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
          },
          {
            title: 'Email',
            render: (_: any, record: any) => (record.email),
            width: 200,
          },
          {
            title: 'Role',
            width: 60,
            render: (_: any, record: any) => (
              record?.role?.replace(/([a-z])([A-Z])/g, '$1 $2')
            ),
          },
          {
            title: 'Date Active',
            width: 120,
            render: (_: any, record: any) => (record.dateActive ? formatStringDateByCountry(record.dateActive, localStorage.getItem('countryCode')) : ''),
          },
          {
            title: 'Date Inactive',
            width: 140,
            render: (_: any, record: any) => (record.dateInactive ? formatStringDateByCountry(record.dateInactive, localStorage.getItem('countryCode')) : ''),
          },
          ]}
          delete={handleUserDelete}
          setEditModalOpen={setEditModalOpen}
        />
      </div>
    </>
  );
};

export default UserList;
