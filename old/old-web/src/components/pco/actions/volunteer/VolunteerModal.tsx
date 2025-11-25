/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Select, Button, Radio, DatePicker, Col, Row,
} from 'antd';

import './VolunteerModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import PcoDetailCard from 'src/shared/components/PcoDetailCard';
import { SetStateAction, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import type { SelectProps } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import { formatDateByCountry } from 'src/utils/common';
import { apiCall } from 'src/shared/api/apiWrapper';
import dayjs from 'dayjs';

const cssPrefix = 'volunteer-modal';

export interface VolunteerModalProps {
  visible: boolean
  setVisible: any
  onCancelClicked: any
  onSave: any
  selectedPco: any
  pcoList: any
}

export const VolunteerModal = (props: VolunteerModalProps) => {
  const { visible, setVisible, selectedPco } = props;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [addLoading, setAddLoading] = useState(false);
  const [volunteersData, setVolunteersData] = useState<any>('');
  const [volunteerActivitiesList, setVolunteerActivitiesList] = useState([]);
  const [volunteerActivityIds, setVolunteerActivityIds] = useState([]);
  const [status, setStatus] = useState('active');

  const countryCode = localStorage.getItem('countryCode');

  const cancelModal = () => {
    props.setVisible(false);
    props.onCancelClicked(false);
  };

  const handleStatusChange = (e: RadioChangeEvent) => {
    setStatus(e.target.value);
  };

  const getVolunteerListData = () => {
    apiCall('volunteer-activity/get-volunteer-activity', 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setVolunteerActivitiesList(resp?.data?.data?.volunteerActivities);
        }
      });
  };

  const handleSave = async () => {
    const value = form.getFieldsValue();
    const data = {
      dateActive: value?.dateActive,
      dateInactive: value?.dateInactive,
      notes: value.notes,
      active: true,
      pcoId: selectedPco?.id,
      volunteerActivityIds: value?.interests,
    };
    try {
      apiCall('volunteer/upsert-volunteer', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
          }
          setAddLoading(false);
          form.resetFields();
          props.setVisible(false);
          props.onCancelClicked(false);
        });
    } catch (error) {
      console.log('Validation error', error);
    }
  };

  const getVolunteers = (pcoId: number) => {
    apiCall(`volunteer/get-volunteers?pcoId=${pcoId}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setVolunteersData(resp?.data?.data?.volunteerPersonCustom);
        }
      });
  };

  const footerContent = [
    <Button key="back" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-volunteer-form"
      key="submit"
      htmlType="submit"
      onClick={handleSave}
    >
      Save
    </Button>,
  ];

  const options: SelectProps['options'] = [
    {
      id: 1,
      label: 'Option A',
      value: 'a',
    },
    {
      id: 2,
      label: 'Option B',
      value: 'b',
    },
    {
      id: 3,
      label: 'Option C',
      value: 'c',
    },
  ];

  const animalOptions: SelectProps['options'] = [
    {
      id: 1,
      label: 'Dogs',
      value: 'dogs',
    },
    {
      id: 2,
      label: 'Cats',
      value: 'cats',
    },
    {
      id: 3,
      label: 'Birds',
      value: 'birds',
    },
  ];

  const handleChange = (value: string[]) => {
    console.log('selected $(value');
  };

  useEffect(() => {
    getVolunteerListData();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    getVolunteers(selectedPco?.id);
  }, [visible]);

  useEffect(() => {
    console.log({
      interests: volunteersData?.volunteerActivityCustoms?.map((data: any) => data?.volunteerActivityId),
      dateActive: volunteersData?.dateActive,
      dateInactive: volunteersData?.dateInactive,
      notes: volunteersData?.notes,
    }, '-----------------');
    form.setFieldsValue({
      interests: volunteersData?.volunteerActivityCustoms?.map((data: any) => data?.volunteerActivityId),
      dateActive: volunteersData?.dateActive ? dayjs(volunteersData?.dateActive) : null,
      dateInactive: volunteersData?.dateInactive ? dayjs(volunteersData?.dateInactive) : null,
      notes: volunteersData?.notes,
    });
  }, [volunteersData]);

  const modalTitle = <span className={`${cssPrefix}__modal__title`}>Volunteer</span>;
  const modalContent = (
    <div>
      <PcoDetailCard pcoDetails={selectedPco} />
      <Form
        form={form}
      >
        <br />
        <div className="">
          <Row>
            <Col xs={24} sm={12}>
              <DropdownInput
                label="Interests"
                name="interests"
                rules={[
                  { required: true, message: 'Interest is required' },
                ]}
                mode="multiple"
                allowClear
                placeholder="Select all activity"
                onChange={handleChange}
                keyName="volunteerActivityName"
                dataList={volunteerActivitiesList}
                isRequired
              />
            </Col>
            {/* <Col xs={24} sm={12}>
              <DropdownInput
                label="Animal Type"
                name="animalType"
                mode="multiple"
                allowClear
                placeholder="Select any that apply"
                onChange={handleChange}
                keyName="label"
                dataList={animalOptions}
              />
            </Col> */}
          </Row>

          <Row>
            <Col span={8}>
              <Radio.Group onChange={handleStatusChange} value={status}>
                <Radio style={{ marginTop: '6px' }} value="active">Active</Radio>
                <Radio style={{ marginTop: '28px' }} value="inactive">Inactive</Radio>
              </Radio.Group>
            </Col>
            <Col span={12}>
              <Form.Item name="dateActive" label="Status" className="hide-label" style={{ padding: '0px' }}>
                <DatePicker format={formatDateByCountry(countryCode || '')} disabled={status === 'inactive'} />
              </Form.Item>
              <Form.Item name="dateInactive" label="Status" className="hide-label" style={{ padding: '0px' }}>
                <DatePicker format={formatDateByCountry(countryCode || '')} disabled={status === 'active'} />
              </Form.Item>
            </Col>
          </Row>

          <AreaInput
            form={form}
            label="Notes"
            name="notes"
            rows={5}
            size="small"
            placeholder="Notes"
            autoSize={{ minRows: 5, maxRows: 4 }}
          />

        </div>
      </Form>
    </div>
  );

  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        key={`volunteer-modal-${visible}`}
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        size="small"
      />
    </div>
  );
};
export default VolunteerModal;
