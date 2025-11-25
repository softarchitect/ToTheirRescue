/* eslint-disable no-unused-vars */
import {
  useEffect, useState, FC, useRef,
} from 'react';
import {
  Modal, Select, Space, Switch, Typography, AutoComplete, Tooltip,
} from 'antd';
import {
  QuestionCircleOutlined, CheckOutlined, CloseOutlined, FlagFilled,
} from '@ant-design/icons';
import {
  filterOptions, ORG,
} from 'src/components/pco/Pco.data';
import {
  PcoProps, TableFilterTypes,
} from 'src/components/pco/PCO.types';
import { apiCall } from 'src/shared/api/apiWrapper';
import { ContentToolbar } from 'src/components/pco/components/ContentToolbar';
import { PcoAddModal } from 'src/components/pco/components/PcoAddModal';
import CustomTablePagination from 'src/shared/components/CustomTablePagination';
import { pageLength } from 'src/shared/constants/pagination.json';
import './PCO.less';
import ImagePopup from 'src/shared/components/ImagePopup';
import VolunteerModal from './actions/volunteer/VolunteerModal';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const cssPrefix = 'ftr-pco';

// eslint-disable-next-line
export const PCO: FC<PcoProps> = (newPcoProps) => {
  const [imageState, setImageState] = useState<any>();
  const [imagePopupIds, setImagePopupIds] = useState<any>([]);
  const [tableFilter, setTableFilter] = useState<TableFilterTypes>(filterOptions[0].id);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [donationType, setDonationType] = useState<any>(1);
  const [tempForm, setTempForm] = useState({});
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [showRecentlyAdded, setShowRecentlyAdded] = useState<any>(null);
  const [editRecord, setEditRecord] = useState(null);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [clickedValue, setClickedValue] = useState(false);

  const {
    getPcoListLoading,
    getPcoListCall,
    addPCOCall,
    updatePCOCall,
    updatePCOAttachment,
    pcoList,
    selectedId,
    selectedRowDetail,
    addPcoLoading,
    updatePcoLoading,
    deletePCOCall,
    setSelectedPco,
    totalNumber,
    userCountryCode,
    uploadImageCall,
    deleteImageCall,
    permissions,
  } = newPcoProps;

  /** Methods related to CRUD operations goes below  */

  const onDeletePco = (id: string): void => {
    // setSelectedPco(id);
    setCurrentPageLocal(1);
    deletePCOCall({ id }, () => {
      getPcoListCall({
        length: pageLength,
        page: currentPageLocal,
        isDeleted: false,
        entityType: tableFilter,
        searchText: searchKey,
      }, () => console.log('get list of pco'));
    });
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setSelectedPco({ id: data?.id, pcoDetail: data });
    setEditRecord(data);
    setAddModalVisible(value);
    setTempForm(data);
  };

  /*  Navigate or move view to other components */

  const setAddModalVisibility = (flag: boolean): void => {
    setAddModalVisible(flag);
  };

  /** Business Logic goes below */

  const handleFilterChange = (val: TableFilterTypes) => {
    setSearchKey('');
    setSearchKeyFinal('');
    setSelectedPco('');
    setCurrentPageLocal(1);
    setTableFilter(val);
  };

  /** All ReactElements or JSX Elements are below * */
  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      <Title level={3} style={{ margin: '16px 0' }}>
        People, Companies, and Organizations
      </Title>
    </div>
  );

  const filterSlot = (
    <Select
      className={`${cssPrefix}__ct__filter`}
      defaultValue={filterOptions[0].id}
      onChange={handleFilterChange}
      style={{ width: '100%' }}
    >
      {filterOptions?.map((opt) => (
        <Option key={opt.id} value={opt.id}>{opt.name}</Option>
      ))}
    </Select>
  );

  const contentToolbar = (
    <ContentToolbar
      selectedPcoId={selectedId}
      filterSlot={filterSlot}
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      setSearchKeyFinal={setSearchKeyFinal}
      currentPage={currentPageLocal}
      pageLength={pageLength}
      tableFilter={tableFilter}
      onAddIconClicked={setAddModalVisibility}
      disableDeleteIcon={false}
      onActionItemClick={() => alert('item clicked')}
      setVolunteerActionModal={setIsVolunteerModalOpen}
      showRecentlyAdded={showRecentlyAdded}
      setShowRecentlyAdded={setShowRecentlyAdded}
      setPaginationData={setCurrentPageLocal}
      setSelectedPco={setSelectedPco}
      permissions={permissions}
    />
  );

  const nameColumnRenderer = (text: string, record: any) => (
    <Space align="baseline" size="middle">
      {(record.id === selectedId) ? (
        <span>
          {text}
        </span>
      ) : (
        <span>
          {text}
        </span>
      )}
      {
        (imagePopupIds === record.id) && (
          record?.attachments?.[0]?.blobUrl && <ImagePopup imgUrl={record?.attachments?.[0]?.blobUrl} />
        )
      }
      {record.flag ? (
        <FlagFilled
          rev={undefined}
          className={`${cssPrefix}__table-cell-flag${record.flag ? '--flagged' : ''}`}
        />
      ) : <span />}
    </Space>
  );

  const mailListColumnRenderer = (_text: any, record: any) => (
    <Switch
      size="small"
      defaultChecked={record.mailList}
      checkedChildren={<CheckOutlined rev={undefined} />}
      unCheckedChildren={<CloseOutlined rev={undefined} />}
      checked={record?.mailList}
      onChange={(checked: boolean) => {
        updatePCOCall({ ...record, mailList: checked, countryId: record.countryId ?? localStorage.getItem('countryId') }, () => {
          setAddModalVisibility(false);
        });
      }}
    />
  );

  const pcoColumns = [{
    title: tableFilter === ORG ? 'Name' : 'Last Name',
    dataIndex: 'lastName',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    render: nameColumnRenderer,
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: 'Street',
    dataIndex: 'street',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.street.localeCompare(b.street),
    render: (value: any) => <Tooltip color="#73706F" title={value}>{value}</Tooltip>,
  },
  // {
  //   title: 'Street 2',
  //   dataIndex: 'street2',
  //   onFilter: (value: any, record: any) => record.name.includes(value),
  //   sorter: (a: any, b: any) => a.street2.localeCompare(b.street2),
  //   render: (value: any) => <Tooltip color="#73706F" title={value}>{value}</Tooltip>,
  // },
  {
    title: 'City',
    dataIndex: 'city',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.city.localeCompare(b.city),
    width: 100,
    render: (value: any) => <Tooltip color="#73706F" title={value}>{value}</Tooltip>,
  },
  {
    title: 'State',
    dataIndex: 'state',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.state.localeCompare(b.state),
    render: (value: any) => <Tooltip color="#73706F" title={value?.replace(/_/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}>{value?.replace(/_/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}</Tooltip>,
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.zip.localeCompare(b.zip),
    width: 90,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.phone.length - b.phone.length,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    onFilter: (value: any, record: any) => record.name.includes(value),
    // sorter: (a: any, b: any) => a.email.length - b.email.length,
    width: 220,
  },
  {
    title: 'Mail List',
    dataIndex: 'mailList',
    render: mailListColumnRenderer,
    width: 90,
  }];

  useEffect(() => {
    getPcoListCall({
      length: pageLength,
      page: clickedValue ? '1' : currentPageLocal,
      isDeleted: false,
      entityType: tableFilter,
      searchText: searchKey,
    }, () => console.log('get list of pco'));
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  if (!permissions?.pco?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <div className="container">
      {/* <CustomPhoneInput required={false} name="phonePco" label="Phone" phoneNumber={phoneNumber} setPhoneNumber={(data) => setPhoneNumber(data)} /> */}
      {/* {pageHeader} */}
      {contentToolbar}
      {/* <SharedTable
        columns={columnsConfig}
        dataSource={filteredTableData}
        selectedRowKeys={selectedRows}
        updateSelectedRows={updateSelectedRows}
      /> */}
      <CustomTablePagination
        config={{
          rowSelection: 'radio',
          selectedRow: selectedId,
          selectedRowDetails: selectedRowDetail,
          setSelectedRow: (data: any) => {
            setSelectedPco(data);
            setImagePopupIds(data);
          },
          isNotEditable: !permissions?.pco?.edit,
          isNotDeletable: !permissions?.pco?.delete,
          showHeader: true,
          selectable: true,
          tableType: 'pco',
          isCustomHeight: 'calc(100vh - 300px)',
        }}
        totalNumber={totalNumber}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        tableData={showRecentlyAdded || pcoList}
        // tableData={pcoList}
        columnData={pcoColumns}
        isLoading={getPcoListLoading}
        delete={(data: any) => onDeletePco(data)}
        setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
      />
      {permissions?.pco?.add && (
        <PcoAddModal
          minifiedVersion={false}
          visible={addModalVisible}
          setAddModalVisibility={setAddModalVisibility}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
          addPCOCall={addPCOCall}
          updatePCOCall={updatePCOCall}
          addPcoLoading={addPcoLoading}
          updatePcoLoading={updatePcoLoading}
          getPcoListCall={getPcoListCall}
          userCountryCode={userCountryCode}
          setSearchKey={setSearchKey}
          setSearchKeyFinal={setSearchKeyFinal}
          setShowRecentlyAdded={setShowRecentlyAdded}
          setSelectedPco={setSelectedPco}
          uploadImageCall={uploadImageCall}
          deleteImageCall={deleteImageCall}
          selectedPcoId={selectedId}
          imageState={imageState}
          setImageState={setImageState}
          updatePCOAttachment={updatePCOAttachment}
          getPcoFilter={{
            length: pageLength,
            page: currentPageLocal,
            isDeleted: false,
            entityType: tableFilter,
            searchText: '',
          }}
          handleCancel={() => {
            setAddModalVisibility(false);
            setEditRecord(null);
          }}
        />
      )}
      <VolunteerModal
        visible={isVolunteerModalOpen}
        onCancelClicked={() => setIsVolunteerModalOpen(false)}
        onSave={() => { }}
        setVisible={setIsVolunteerModalOpen}
        pcoList={undefined}
        selectedPco={selectedRowDetail}
      />
    </div>
  );
};
