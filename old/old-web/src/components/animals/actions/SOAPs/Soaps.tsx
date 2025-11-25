/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Soaps.less';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { getHospitalClinicCall } from 'src/redux/common/action';
import SoapsModal from 'src/components/animals/actions/SOAPs/SoapsModal';
import { formatStringDateByCountry } from 'src/utils/common';
import { apiCall } from 'src/shared/api/apiWrapper';
import AnimalActionDropdown from '../../components/animalActionsDropdown/animalActionDropdown';

const { Title } = Typography;
const cssPrefix = 'soaps';

const Soaps: FC<any> = ({
  permissions, selectedAnimal, getHospitalClinicListCall, hospitalClinicList,
}) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [soapList, setSoapList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = (values: any) => {
    console.log('Saving values:', values);
  };

  const getSoap = () => {
    setIsLoading(true);
    apiCall(`soap/get-soap?animalId=${selectedAnimal?.ids?.[0]}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setSoapList(resp?.data?.data?.soaPs);
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    if (addLoading) {
      return;
    }
    getSoap();
  }, [addLoading]);

  const handleUpdate = async ({ form }: any) => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = { ...values };

      apiCall(`soap/update-soap/${editRecord?.id}`, 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            getSoap();
          }
          setAddLoading(false);
          form.resetFields();
          setIsModalOpen(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const deleteSoap = (soapId: any) => {
    apiCall(`soap/delete-soap/${soapId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getSoap();
          message.success({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setIsModalOpen(value);
  };

  const columnData = [
    {
      title: 'Date',
      dataIndex: 'actionDate',
      width: 130,
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Subjective',
      dataIndex: 'subjective',
    },
    {
      title: 'Objective',
      dataIndex: 'objective',
    },
    {
      title: 'Assessment',
      dataIndex: 'assessment',
    },
    {
      title: 'Plan',
      dataIndex: 'soapPlan',
    },
  ];

  if (!permissions?.animals?.actions?.soaps) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          {/* Manage SOAPs */}
        </Title>
      </div>

      <Row align="bottom" justify="space-between">
        <Col xs={24} lg={10}>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
        </Col>
        <Col xs={24} sm={6}>
          <Row justify="end">
            <Col span={10} style={{ paddingRight: '10px' }}>
              <AnimalActionDropdown />
            </Col>
            <Col>
              <Button className={`${cssPrefix}__button`} type="dashed" onClick={handleAddClick} icon={<PlusOutlined rev={undefined} />}>
                Add
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <CustomTablePagination
        tableData={soapList}
        isLoading={false}
        delete={deleteSoap}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'SOAPs',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />

      <SoapsModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        onSave={handleSave}
        setVisible={setIsModalOpen}
        animalList={undefined}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        handleUpdate={handleUpdate}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        selectedAnimal={selectedAnimal}
        hospitalClinicList={hospitalClinicList}
        getHospitalClinicCall={getHospitalClinicListCall}
      />
    </>

  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedAnimal: state.common.selectedAnimal,
  hospitalClinicList: state.common.hospitalClinicList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getHospitalClinicListCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Soaps);
