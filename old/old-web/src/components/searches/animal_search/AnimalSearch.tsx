/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Button, Tag, Form,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import './AnimalSearch.less';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import { apiCall } from 'src/shared/api/apiWrapper';

const AnimalSearch: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterData, setFilterData] = useState<any>({});
  const [animalTypeList, setAnimalTypeList] = useState([]);

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;
  const [form] = Form.useForm();

  const tableData = [
    {
      animalType: 'Text',
      name: ' Text',
      color: 'Text',
      spayedNeutered: 'Text',
      notes: 'Text',
      flagged: 'Text',
      status: 'Text',
      currentResident: 'Text',
      breed: 'Text',
      sex: 'Text',
      location: 'Text',
      chronicCondition: 'Text',
      dietPresent: 'Text',
    },
  ];

  const columnData = [
    {
      title: 'Animal Type',
      dataIndex: 'animalType',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Spayed/Neutered',
      dataIndex: 'spayedNeutered',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
    {
      title: 'Flagged',
      dataIndex: 'flagged',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Current Resident',
      dataIndex: 'currentResident',
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const chronicCondition = [
    {
      id: 'Yes',
      label: 'yes',
    },
    {
      id: 'No',
      label: 'no',
    },
  ];

  const diet = [
    {
      id: 'Yes',
      label: 'yes',
    },
    {
      id: 'No',
      label: 'no',
    },
  ];

  const flag = [
    {
      id: 'Yes',
      label: 'yes',
    },
    {
      id: 'No',
      label: 'no',
    },
  ];

  const status = [
    {
      id: 'Adoptable',
      label: 'adoptable',
    },
    {
      id: 'Permanent Resident',
      label: 'permanentResident',
    },
    {
      id: 'Quarantine Hold',
      label: 'quarantineHold',
    },
    {
      id: 'Outdoor Feral',
      label: 'outdoorFeral',
    },
  ];

  const getAnimalType = () => {
    apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalTypeList(resp?.data?.data?.animalTypes);
        }
      });
  };

  useEffect(() => {
    getAnimalType();
  }, []);

  if (!permissions?.search?.animal_search) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back" onClick={() => setModalVisible(false)}>
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-search"
      key="submit"
      htmlType="submit"
      onClick={() => {
        setModalVisible(false);
      }}
    >
      <SearchOutlined rev={undefined} />
      Search
    </Button>,
  ];

  const modalContent = (
    <Form form={form}>
      <Row justify="center" align="middle">
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Name"
            name="name"
            placeholder="Name"
            maxLength={10}
            value={filterData?.name}
            onChange={(e: any) => setFilterData({ ...filterData, name: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Animal Type"
            name="animalType"
            placeholder="Animal Type"
            keyName="typeName"
            dataList={animalTypeList}
            value={filterData?.animalType}
            onChange={(input: any) => setFilterData({ ...filterData, type: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Current Resident"
            name="currentResident"
            placeholder="Select residency status"
            keyName="label"
            dataList={[{ id: 'current', label: 'Current' }, { id: 'former', label: 'Former' }]}
            value={filterData?.currentResident}
            onChange={(input: any) => setFilterData({ ...filterData, type: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Name"
            name="name"
            placeholder="Name"
            value={filterData?.name}
            rules={[{ type: 'string', max: 10, message: 'Limited to 10 characters' }]}
            maxLength={10}
            onChange={(e: any) => setFilterData({ ...filterData, name: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Breed"
            name="breed"
            placeholder="Breed"
            maxLength={10}
            value={filterData?.breed}
            rules={[{ type: 'string', max: 10, message: 'Limited to 10 characters' }]}
            onChange={(e: any) => setFilterData({ ...filterData, breed: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Color"
            name="color"
            placeholder="Color"
            value={filterData?.color}
            rules={[{ type: 'string', max: 10, message: 'Limited to 10 characters' }]}
            maxLength={10}
            onChange={(e: any) => setFilterData({ ...filterData, color: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Sex"
            name="sex"
            placeholder="Select sex"
            keyName="label"
            dataList={[{ id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }, { id: 'unknown', label: 'Unknown' }]}
            value={filterData?.sex}
            onChange={(input: any) => setFilterData({ ...filterData, sex: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Location"
            name="location"
            placeholder="Location"
            value={filterData?.location}
            rules={[{ type: 'string', max: 10, message: 'Limited to 10 characters' }]}
            maxLength={10}
            onChange={(e: any) => setFilterData({ ...filterData, location: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Notes"
            name="notes"
            placeholder="Notes"
            value={filterData?.notes}
            rules={[{ type: 'string', max: 10, message: 'Limited to 10 characters' }]}
            maxLength={10}
            onChange={(e: any) => setFilterData({ ...filterData, notes: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Chronic Condition"
            name="chronicCondition"
            placeholder="Chronic Condition"
            dataList={chronicCondition}
            value={filterData?.chronicCondition}
            onChange={(e: any) => setFilterData({ ...filterData, chronicCondition: e.target.value })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Flagged"
            name="flagged"
            placeholder="Flagged"
            dataList={flag}
            value={filterData?.flagged}
            onChange={(input: any) => setFilterData({ ...filterData, flagged: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Diet Present"
            name="dietPresent"
            placeholder="Diet Present"
            dataList={diet}
            value={filterData?.flagged}
            onChange={(input: any) => setFilterData({ ...filterData, dietPresent: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Status"
            name="status"
            placeholder="Select status"
            dataList={status}
            value={filterData?.status}
            onChange={(input: any) => setFilterData({ ...filterData, status: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Spayed/Neutered"
            name="spayedNeutered"
            placeholder="Spayed/Neutered"
            dataList={[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]}
            keyName="label"
            value={filterData?.spayedNeutered}
            onChange={(input: any) => setFilterData({ ...filterData, spayedNeutered: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <DropdownInput
            label="Current Resident"
            name="currentResident"
            placeholder="Select residency status"
            keyName="label"
            dataList={[{ id: 'current', label: 'Current' }, { id: 'former', label: 'Former' }]}
            value={filterData?.currentResident}
            onChange={(input: any) => setFilterData({ ...filterData, type: input })}
            allowClear
          />
        </Col>
        <Col md={16} xs={19} lg={9}>
          <TextInput
            label="Notes"
            name="notes"
            placeholder="Notes"
            maxLength={10}
            value={filterData?.notes}
            onChange={(e: any) => setFilterData({ ...filterData, notes: e.target.value })}
            allowClear
          />
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      {filterApplied ? (
        <>
          <Row align="bottom" justify="space-between" style={{ padding: '10px 0px' }}>
            <Col span={18}>
              {filterApplied && (
                <Row>
                  {Object.keys(filterData)?.map((key: string) => (
                    (filterData?.[key] && (
                      <Tag
                        color="blue"
                        style={{
                          height: '30px', padding: '3px 12px', margin: '0px 0px', borderRadius: '4px', fontSize: 16,
                        }}
                      >
                        {filterData?.[key]}
                      </Tag>
                    ))
                  ))}
                </Row>
              )}
            </Col>
            <Col>
              <Row>
                <div
                  style={{ margin: '0px 10px' }}
                  onClick={() => setModalVisible(true)}
                  className="ftr-button-basic"
                >
                  <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Search Criteria</span>
                </div>
                <div
                  className="ftr-button-basic"
                >
                  <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Copy Selection</span>
                </div>
              </Row>
            </Col>
          </Row>
          <CustomTablePagination
            tableData={tableData}
            isLoading={false}
            delete={() => { }}
            setEditModalOpen={() => { }}
            config={{
              selectable: true,
              isNotEditableBlur: true,
              showHeader: true,
              tableType: 'Animal-Search',
            }}
            totalNumber={4}
            currentPage={currentPageLocal}
            setPaginationData={setCurrentPageLocal}
            columnData={columnData}
          />
          <DisclaimerCard />
        </>
      ) : (
        <>
          <Row justify="center" style={{ fontSize: '22px', fontWeight: 500 }}>
            Animals Search
          </Row>

          <Row justify="center" style={{ padding: '20px 0px ' }}>
            <Col xs={24} md={14}>
              {modalContent}
            </Col>
          </Row>
          <Row justify="center" style={{ padding: '0px' }}>
            <Col xs={15} sm={6} md={4} lg={4}>
              <div
                style={{ margin: '10px 10px', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                  setFilterApplied(true);
                }}
                className="ftr-button-basic"
              >
                <SearchOutlined style={{ fontSize: 18, marginRight: '8px' }} />
                <span className="radio-label">Search</span>
              </div>
            </Col>
          </Row>

        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Animals Search</>}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size="sm"
      />
    </>
  );
};

const mapStatetoProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStatetoProps, mapDispatchToProps)(AnimalSearch);
