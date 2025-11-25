/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import {
  useState, useEffect, FC, useRef,
} from 'react';
import { connect } from 'react-redux';
import {
  Form, Row, Col, Button, DatePicker, Tag,
  Popover,
} from 'antd';
import { CSVLink } from 'react-csv';
import { CloseCircleFilled, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import DropdownInput from 'src/shared/components/Inputs/DropdownInput';
import { formatDateByCountry, formatStringDateByCountry } from 'src/utils/common';
import './AnimalMilestone.less';

import { startCase } from 'lodash';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { apiCall } from 'src/shared/api/apiWrapper';
import alertConstant from 'src/shared/constants/alert.json';
import { pluralToSingular, singularToPlural } from 'src/utils/pluralToSingular';

const AnimalMilestone: FC<any> = ({ permissions, roleType }) => {
  const [getLoading, setGetLoading] = useState(false);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedAnimalMilestoneQuery, setSelectedAnimalMilestoneQuery] = useState<any>('');
  const [milestoneQueryResult, setMilestoneQueryResult] = useState([]);
  const [animalTypeList, setAnimalTypeList] = useState<any>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>({});

  const [animalMilestoneQueryForm] = Form.useForm();
  const cookies = new Cookies();
  const role = cookies.get('loginDetails')?.userType;

  const popupRef: any = useRef('download-to-excel');

  const { RangePicker } = DatePicker;

  const timeSpanData = [
    {
      id: 'lastWeek',
      label: 'Last Week',
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
    },
    {
      id: 'yearToDate',
      label: 'Year to Date',
    },
    {
      id: 'lastYear',
      label: 'Last Year',
    },
    {
      id: 'lastTwoYears',
      label: 'Last Two Years',
    },
    {
      id: 'lastThreeYears',
      label: 'Last Three Years',
    },
    {
      id: 'sinceInception',
      label: 'Since Inception',
    },
  ];

  const milestoneData = [
    {
      milestoneType: 'Intakes',
      id: 'intake',
    },
    {
      milestoneType: 'Adoptions',
      id: 'adoption',
    },
    {
      milestoneType: 'Adoption Returns',
      id: 'adoption-return',
    },
    {
      milestoneType: 'Fosters',
      id: 'foster',
    },
    {
      milestoneType: 'Foster Returns',
      id: 'foster-return',
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
      milestoneType: 'Transfers',
      id: 'transfer',
    },
    {
      milestoneType: 'Returns To Owner',
      id: 'return-to-owner',
    },
    {
      milestoneType: 'Re Intakes',
      id: 'reintake',
    },
    {
      milestoneType: 'Deaths',
      id: 'death',
    },
  ];

  const columnData = [
    {
      title: 'Milestone Date',
      dataIndex: 'milestoneDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Name',
      dataIndex: 'animalName',
    },
    {
      title: 'Milestone',
      dataIndex: 'milestoneType',
      render: (data: any) => (startCase(data)),
    },
    {
      title: 'How Acquired',
      dataIndex: 'howAcquired',
    },
    {
      title: 'Other Shelter',
      dataIndex: 'otherRescue',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
  ];

  const onClickTimeSpan = (currTimeSpan: any) => {
    if (currTimeSpan === 'lastWeek') {
      setFilterDate([dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')]);
    }
    if (currTimeSpan === 'lastMonth') {
      setFilterDate([dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]);
    }
    if (currTimeSpan === 'yearToDate') {
      setFilterDate([dayjs().startOf('year'), dayjs()]);
    }
    if (currTimeSpan === 'lastYear') {
      setFilterDate([dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
    if (currTimeSpan === 'lastTwoYears') {
      setFilterDate([dayjs().subtract(2, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
    if (currTimeSpan === 'lastThreeYears') {
      setFilterDate([dayjs().subtract(3, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')]);
    }
    if (currTimeSpan === 'sinceInception') {
      setFilterDate([null, null]);
    }
  };

  const handleCopySelection = () => {

  };

  const handleSubmit = async () => {
    let dateFilter = '';
    if (filterDate[0] && filterDate[1]) {
      dateFilter = `&milestoneStartDate=${filterDate?.[0]}&milestoneEndDate=${filterDate?.[1]}`;
    }
    try {
      setGetLoading(true);
      apiCall(`query/get-animal-milestone-query?milestoneType=${filterData?.milestone}&animalTypeName=${(filterData?.typeName === 'All') ? '' : filterData?.typeName}${dateFilter}`, 'GET', {})
        .then((respAdd: any) => {
          setGetLoading(false);
          if (respAdd?.data?.success) {
            setMilestoneQueryResult(respAdd?.data?.data?.animalMilestoneQueries);
            // message.success({
            //   content: respAdd?.data?.message || alertConstant.completed_vaccination_add_success,
            //   style: {
            //     marginTop: '2vh',
            //   },
            //   key: 'updatable',
            // });
          }
          setFilterLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const getAnimalType = () => {
    apiCall(`animaltype/get-animal-types?roleName=${roleType}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.status === 200) {
          const animalTypes = resp?.data?.data?.animalTypes;
          setAnimalTypeList([{ typeName: 'all', id: 'All' }, ...animalTypes]);
        }
      });
  };

  useEffect(() => {
    getAnimalType();
  }, []);

  const headers = [
    { label: 'Milestone Date', key: 'milestoneDate' },
    { label: 'Animal Name', key: 'animalName' },
    { label: 'Milestone', key: 'milestoneType' },
    { label: 'How Acquired', key: 'howAcquired' },
    { label: 'Other Shelter', key: 'otherRescue' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
  ];

  const data = selectedAnimalMilestoneQuery?.milestoneQueryDetails || [];

  if (!permissions?.query?.animal_milestone) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  const footerContent = [
    <Button onClick={() => setModalVisible(false)} key="back">
      Cancel
    </Button>,
    <Button
      form="animal-milestone"
      key="submit"
      type="primary"
      htmlType="submit"
      onClick={async () => {
        await animalMilestoneQueryForm.validateFields();
        setModalVisible(false);
        setFilterApplied(true);
        handleSubmit();
      }}
    >
      <SearchOutlined rev={undefined} />
      Submit
    </Button>,
  ];

  const modalContent = (
    <Form form={animalMilestoneQueryForm}>
      <Row justify="center">
        <Col md={12} xs={16}>
          <DropdownInput
            label="Milestone"
            placeholder="Milestone"
            name="milestone"
            keyName="milestoneType"
            dataList={milestoneData}
            value={filterData?.milestone}
            rules={[{ required: true, message: 'Milestone is required' }]}
            onChange={(input: any) => setFilterData({ ...filterData, milestone: input })}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <DropdownInput
            label="Time Span"
            placeholder="Time Span"
            name="timeSpan"
            dataList={timeSpanData}
            keyName="label"
            value={filterData?.timeSpan}
            rules={[{ required: true, message: 'Time span is required' }]}
            onChange={(input: any) => {
              onClickTimeSpan(input);
              setFilterData({ ...filterData, timeSpan: input });
            }}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <DropdownInput
            label="Animal Type"
            placeholder="Animal Type"
            keyName="typeName"
            name="animalType"
            dataList={animalTypeList.map((data: any) => ({
              id: (data.id === 'All') ? 'All' : singularToPlural(data.typeName),
              typeName: (data.id === 'All') ? 'All' : singularToPlural(data.typeName),
            }))}
            value={filterData?.typeName}
            rules={[{ required: true, message: 'Animal type is required' }]}
            onChange={(input: any) => setFilterData({ ...filterData, typeName: input })}
            isRequired
            allowClear
          />
        </Col>
        <Col md={12} xs={16}>
          <Form.Item
            style={{ padding: '0px 10px', width: '100%' }}
            rules={[{ required: true, message: 'Date range is required' }]}
          >
            <RangePicker
              disabled={filterData?.timeSpan === 'sinceInception'}
              value={filterDate}
              style={{ width: '100%' }}
              format={formatDateByCountry(localStorage.getItem('countryCode') || '')}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      {filterApplied ? (
        <>
          <Row align="bottom" justify="space-between" style={{ padding: '10px 10px' }}>
            <Col span={14}>
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
                        {startCase((key === 'milestone') ? singularToPlural(filterData?.[key]) : filterData?.[key])}
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
                  <span className="radio-label">Query Criteria</span>
                </div>
                {(selectedAnimalMilestoneQuery?.milestoneQueryDetails?.length > 0) ? (
                  <CSVLink target="_blank" filename={`animal-query-${Date.now()}.csv`} data={data} headers={headers}>
                    <div className="ftr-button-basic">
                      <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                      <span className="radio-label">Download to Excel</span>
                    </div>
                  </CSVLink>
                ) : (
                  <Popover
                    ref={popupRef}
                    content={(
                      <div>
                        <CloseCircleFilled style={{ color: 'red', padding: '0px 4px' }} rev={undefined} />
                        {alertConstant.query_select_atleast_one_animal}
                      </div>
                    )}
                    open={popupOpen}
                  >
                    <div
                      onClick={() => {
                        setPopupOpen(true);
                        setTimeout(() => {
                          setPopupOpen(false);
                        }, 3000);
                      }}
                      className="ftr-button-basic"
                    >
                      <CopyOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                      <span className="radio-label">Download to Excel</span>
                    </div>
                  </Popover>
                )}
              </Row>
            </Col>
          </Row>
          <CustomTablePagination
            tableData={milestoneQueryResult}
            isLoading={getLoading}
            delete={() => { }}
            setEditModalOpen={() => { }}
            config={{
              selectable: true,
              selectedRow: selectedAnimalMilestoneQuery?.id,
              setSelectedRow: (data: any) => {
                console.log(selectedAnimalMilestoneQuery, '---------++++----');
                setSelectedAnimalMilestoneQuery(data);
              },
              isNotEditableBlur: true,
              isNotEditable: true,
              isNotDeletable: true,
              showHeader: true,
              tableType: 'animal-milestone-query',
            }}
            totalNumber={4}
            currentPage={currentPageLocal}
            setPaginationData={setCurrentPageLocal}
            columnData={columnData}
          />
        </>
      ) : (
        <>
          <Row justify="center" style={{ fontSize: '22px', fontWeight: 500 }}>
            Animal Milestone Query
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} md={12}>
              {modalContent}
            </Col>
          </Row>
          <Row justify="center" style={{ padding: '20px 0px' }}>
            <Col xs={24} sm={6} md={4} lg={4}>
              <div
                style={{ margin: '0px 10px', display: 'flex', justifyContent: 'center' }}
                onClick={async () => {
                  await animalMilestoneQueryForm.validateFields();
                  setFilterApplied(true);
                  handleSubmit();
                }}
                className="ftr-button-basic"
              >
                <SearchOutlined rev={undefined} style={{ fontSize: 18, marginRight: '8px' }} />
                <span className="radio-label">Submit</span>
              </div>
            </Col>
          </Row>
        </>
      )}
      <TyrModal
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={<>Animal Milestone Query</>}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size="sm"
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  roleType: state.auth.userType,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalMilestone);
