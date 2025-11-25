/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
import {
  useEffect, FC, useState, useRef,
} from 'react';
import {
  Modal, Input, Form, message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import alertConstant from '../../../shared/constants/alert.json';
import MultiSelect from '../../../shared/components/Inputs/MultiSelect';
// eslint-disable-next-line no-unused-vars
import CustomPhoneInput from '../../../shared/components/Inputs/CustomPhoneInput';

const { confirm } = Modal;

// eslint-disable-next-line no-unused-vars
const cssPrefix = 'ftr-users';

interface Props {
  tempForm: {},
  isModalVisible: boolean,
  editModal: boolean,
  viewInactive: boolean,
  inviteUserLoading: boolean,
  userForm: any,
  setUserForm: (formData: object) => void,
  setEditModal: (isTrue: boolean) => void,
  setIsModalVisible: (status: boolean) => void,
  getUserListCall: (data: any, callbackFunction: any) => void,
  onSubmit: (data: object, callbackFunction: any) => void,
  role: any,
}

const AddUserForm: FC<Props> = (newProps) => {
  const {
    tempForm, isModalVisible, editModal, viewInactive, setEditModal,
    setIsModalVisible, userForm, setUserForm, onSubmit, getUserListCall,
    inviteUserLoading, role,
  } = newProps;

  const [key, setKey] = useState<any>('');
  const [newKey, setNewKey] = useState(Date.now());
  const [form] = Form.useForm();

  const inputRef = useRef<any>(null);
  const permissionConstant = [
    { id: 'Administrator', label: 'Administrator' },
    { id: 'AnimalManager', label: 'Animal Manager' },
    { id: 'Veterinarian', label: 'Veterinarian' },
    { id: 'AnimalCaretaker', label: 'Animal Caretaker' },
    // { id: 'FosterParent', label: 'Foster Parent' },
  ];

  if (role === 'SuperAdministrator') {
    permissionConstant.push({ id: 'SuperAdministrator', label: 'Super Administrator' });
  }

  useEffect(() => {
    inputRef?.current?.focus();
  }, [key]);

  useEffect(() => {
    if (!isModalVisible && !editModal) {
      form.resetFields();
      form.setFieldsValue({ role: permissionConstant[0]?.label });
      setUserForm({ role: permissionConstant[0]?.label });
    }
    setKey(Date.now());
    setNewKey(Date.now());
  }, [isModalVisible]);

  useEffect(() => {
    form.setFieldsValue({ ...userForm, role: userForm.role });
  }, [userForm]);

  const validateMessages = {
    required: '${label} is required',
    types: {
      email: '${label} is not a valid email',
      number: '${label} is not a valid number',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const callbackFunction = () => {
    message.success({
      content: editModal ? alertConstant.user_update_success : alertConstant.user_invite_success,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
    form.resetFields();
    setEditModal(false);
    setIsModalVisible(false);
    getUserListCall(viewInactive, () => console.log('------'));
  };

  const handleOk = async () => {
    if (!editModal) {
      const updateData = {
        firstName: userForm?.firstName,
        lastName: userForm?.lastName,
        email: userForm?.email,
        roleName: userForm?.role,
      };
      onSubmit(updateData, () => callbackFunction());
    } else {
      const updateData = {
        id: userForm?.id,
        firstName: userForm?.firstName,
        lastName: userForm?.lastName,
        role: userForm?.role,
        email: userForm?.email,
      };
      onSubmit(updateData, () => callbackFunction());
    }
  };

  const handleInput = (e: any) => {
    form.setFieldsValue({ [e.target.name]: e.target.value });
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line no-unused-vars
  const setPhoneNumber = (value: any) => {
    form.setFieldsValue({ phoneNumber: value });
    setUserForm({ ...userForm, phoneNumber: value });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditModal(false);
  };

  return (
    <>
      <Modal
        title={editModal ? 'Edit User Detail' : 'Invite User'}
        open={isModalVisible}
        okButtonProps={{ loading: inviteUserLoading }}
        onOk={form.submit}
        okText={editModal ? 'Update' : 'Invite'}
        onCancel={handleCancel}
        key={newKey}
      >
        <Form key={newKey} onFinish={handleOk} form={form} validateMessages={validateMessages}>
          {/* <Form.Item
            name={['username']}
            label="User Name"
            required
            rules={[{ required: true }]}
          >
            <Input
              disabled={editModal}
              key={key}
              ref={inputRef}
              name="username"
              onChange={(e) => handleInput(e)}
              placeholder="User Name"
            />
          </Form.Item> */}
          <TextInput
            label="First Name"
            required
            rules={[{ required: true }]}
            name="firstName"
            onChange={(value: any) => handleInput(value)}
            placeholder="First Name"
            highlightInput
            isRequired
          />
          <TextInput
            label="Last Name"
            required
            rules={[{ required: true }]}
            name="lastName"
            onChange={(value: any) => handleInput(value)}
            placeholder="Last Name"
            isRequired
          />
          <TextInput
            label="Email"
            required
            rules={[{ type: 'email', required: true }]}
            name="email"
            onChange={(value: any) => handleInput(value)}
            placeholder="Email"
            isRequired
          />
          {/* <CustomPhoneInput phoneNumber={userForm?.phoneNumber} setPhoneNumber={(e) => setPhoneNumber(e)} /> */}
          <DropdownInput
            label="Role"
            required
            rules={[{ required: true }]}
            placeholder="User Role"
            dataList={permissionConstant.map((data) => ({ label: data.label, id: data.id }))}
            // eslint-disable-next-line react/jsx-curly-brace-presence
            value={userForm?.role}
            onChange={(data: any) => setUserForm({
              ...userForm,
              role: data,
            })}
            keyName="label"
            isRequired
          />
        </Form>
      </Modal>
    </>
  );
};

export default AddUserForm;
