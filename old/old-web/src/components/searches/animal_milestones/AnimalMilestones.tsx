/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, Tag, Form,
} from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import TextInput from 'src/shared/components/Inputs/TextInput';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { apiCall } from 'src/shared/api/apiWrapper';
import './AnimalMilestones.less';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import DisclaimerCard from 'src/shared/components/DisclaimerCard';

const { Title } = Typography;
const cssPrefix = 'animal-milestones';

const AnimalMilestones: FC<any> = ({ permissions }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [howAcquired, setHowAcquired] = useState([]);
  const [aqusitionIdToName, setAqusitionIdToName] = useState([]);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>({});
  const [animalType, setAnimalType] = useState<any>([]);

  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const [form] = Form.useForm();

  const tableData = [
    {
      date: '12/17/2022',
      milestone: 'Birth',
      name: 'Biskit',
      animalType: 'Dog',
      notes: 'Text Text Text',
    },
    {
      date: '5/1/2010',
      milestone: 'Birth',
      name: 'Ebenezer',
      animalType: 'Dog',
      notes: 'Text Text Text',
    },
    {
      date: '4/30/2011',
      milestone: 'Birth',
      name: 'Dusty',
      animalType: 'Horse',
      notes: 'Text Text Text',
    },
    {
      date: '7/12/2012',
      milestone: 'Intake',
      name: 'Biskit',
      animalType: 'Dog',
      howAcquired: 'Owner Surrender',
      notes: 'Text Text Text',
    },
  ];

  const columnData = [
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Milestone',
      dataIndex: 'milestone',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Animal Type',
      dataIndex: 'animalType',
    },
    {
      title: 'How Acquired',
      dataIndex: 'howAcquired',
    },
    {
      title: 'Other Rescue',
      dataIndex: 'otherRescue',
    },
    {
      title: 'Other Rescue Id',
      dataIndex: 'otherRescueId',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const getAnimalTypes = () => {
    apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalType(resp?.data?.data?.animalTypes);
        }
      });
  };

  useEffect(() => {
    console.log(otherRescueShelter, '-------------||||--', otherRescueShelter[0]?.id);
  }, [filterData]);

  const getAcquisitionType = () => {
    apiCall('acquisition-way/get-acquisition-way', 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setHowAcquired(resp?.data?.data?.acquisitionWays);
          const tempAcquistionWay = resp?.data?.data?.acquisitionWays;
          const newObj: any = {};
          const newAcquistionWayIdToName: any = {};
          tempAcquistionWay.map((currentAcqWay: any, i: any) => {
            newObj[currentAcqWay.acquisitionWayName] = currentAcqWay.id;
            newAcquistionWayIdToName[currentAcqWay.id] = currentAcqWay.acquisitionWayName;
            return newObj;
          });
          // setAqusitionNameToId(newObj);
          // setAqusitionIdToName(newAcquistionWayIdToName);
        }
      });
  };

  const getRescueCall = () => {
    apiCall('pco/get-pco-other-rescues', 'GET', {})
      .then((resp: any) => {
        const pcoOtherRescues = resp?.data?.data?.pcoOtherRescues;
        setOtherRescueShelter(pcoOtherRescues);
        form.setFieldsValue({ ...filterData, otherRescueShelterId: pcoOtherRescues?.[0]?.id });
        setFilterData({ ...filterData, otherRescueShelterId: pcoOtherRescues?.[0]?.id });
      });
  };

  useEffect(() => {
    getRescueCall();
    getAnimalTypes();
    getAcquisitionType();
  }, []);

  const milestoneData = [
    {
      milestoneType: 'Birth',
      id: 'birth',
    }, {
      milestoneType: 'Intake',
      id: 'intake',
    }, {
      milestoneType: 'Adoption',
      id: 'adoption',
    },
    {
      milestoneType: 'Adoption Return',
      id: 'adoptionReturn',
    },
    {
      milestoneType: 'Foster',
      id: 'foster',
    },
    {
      milestoneType: 'Foster Return',
      id: 'fosterReturn',
    },
    {
      milestoneType: 'Lost',
      id: 'lost',
    },
    {
      milestoneType: 'Found',
      id: 'found',
    },
    {
      milestoneType: 'Released',
      id: 'released',
    },
    {
      milestoneType: 'Death',
      id: 'death',
    },
    {
      milestoneType: 'Return to Owner',
      id: 'returnToOwner',
    },
    {
      milestoneType: 'ReIntake',
      id: 'reIntake',
    },
    {
      milestoneType: 'Transfer',
      id: 'transfer',
    },
  ];

  if (!permissions?.search?.animal_milestone) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button key="back">
      Cancel
    </Button>,
    <Button
      form="animal-form"
      key="submit"
      type="primary"
      htmlType="submit"
      onClick={() => { setModalVisible(false); setFilterApplied(true); }}
    >
      <SearchOutlined rev={undefined} />
      Search
    </Button>,
  ];

  const modalContent = (
    <>
      <Form form={form}>
        <Row justify="center" align="middle">
          <Col md={12} xs={16}>
            <DropdownInput
              dataList={milestoneData}
              label="Milestone"
              name="milestone"
              placeholder="Milestone"
              keyName="milestoneType"
              value={filterData?.milestone}
              onChange={(input: any) => setFilterData({ ...filterData, milestone: input })}
              isRequired
              allowClear
            />
          </Col>
          {/* <Col md={12}>
          <TextInput
            label="Name"
            name="name"
            placeholder="Name"
            value={filterData?.name}
            onChange={(e: any) => setFilterData({ ...filterData, name: e.target.value })}
          />
        </Col> */}
          <Col md={12} xs={16}>
            <DropdownInput
              label="Animal Type"
              name="animalType"
              placeholder="Animal Type"
              dataList={animalType}
              value={filterData?.animalType}
              keyName="typeName"
              onChange={(input: any) => setFilterData({ ...filterData, animalType: input })}
              allowClear
            />
          </Col>
          {(filterData?.milestone === 'intake') && (
            <>
              <Col md={12} xs={16}>
                <DropdownInput
                  label="How Acquired"
                  name="howAcquired"
                  placeholder="How Acquired"
                  value={filterData?.accquired}
                  dataList={howAcquired}
                  keyName="acquisitionWayName"
                  onChange={(input: any) => setFilterData({ ...filterData, howAcquired: input })}
                  allowClear
                />
              </Col>
              {(filterData?.howAcquired === 5) && (
                <Col md={12} xs={16}>
                  <DropdownInput
                    name="otherRescueShelterId"
                    label="Other Rescue/Shelter/Sanctuary"
                    rules={[
                      { required: true },
                    ]}
                    value="Hambird Company"
                    placeholder="Select Other Rescue/Shelter/Sanctuary"
                    dataList={otherRescueShelter}
                    keyName="lastNameOtherRescue"
                    isRequired
                  />
                </Col>
              )}
            </>
          )}
          <Col md={12} xs={16}>
            <TextInput
              label="Other Rescue Id No"
              name="otherRecueIdNo"
              placeholder="Other Rescue Id No"
              value={filterData?.otherRescueNoId}
              onChange={(e: any) => setFilterData({ ...filterData, otherRescueNoId: e.target.value })}
            />
          </Col>
          <Col md={12} xs={16}>
            <TextInput
              label="Other Rescue Id No"
              name="notes"
              placeholder="Notes"
              value={filterData?.otherRescueNoId}
              onChange={(e: any) => setFilterData({ ...filterData, otherRescueNoId: e.target.value })}
            />
          </Col>
        </Row>
      </Form>
    </>
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
                          height: '30px', padding: '3px 12px', margin: '0px 8px', borderRadius: '4px', fontSize: 16,
                        }}
                      >
                        {filterData?.[key]}
                        {/* <CloseCircleOutlined style={{ paddingLeft: '6px', cursor: 'pointer' }} rev={undefined} /> */}
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
                  <span className="radio-label">Search</span>
                </div>
                <div
                  className="ftr-button-basic"
                >
                  <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                  <span className="radio-label">Download to Excel</span>
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
              tableType: 'Animal Milestones',
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
            Animal Milestone Search
          </Row>
          <Row justify="center" style={{ padding: '40px 0px' }}>
            <Col xs={24} md={14}>
              {modalContent}
            </Col>
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} sm={6} md={4} lg={4}>
              <div
                style={{ margin: '0px 10px', display: 'flex', justifyContent: 'center' }}
                onClick={() => setFilterApplied(true)}
                className="ftr-button-basic"
              >
                <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                <span className="radio-label">Search</span>
              </div>
            </Col>
          </Row>
        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Animal Milestone Search</>}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size="sm"
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalMilestones);
