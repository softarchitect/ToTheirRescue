/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  Row, Button, Space,
} from 'antd';
import {
  PlusOutlined, FlagFilled,
} from '@ant-design/icons';
import { apiCall } from '../../../../shared/api/apiWrapper';
import CustomTable from '../../../../shared/components/CustomTable';

export interface RescueShelterMinifiedProps {
  selectedRow: any;
  setSelectedRow: any;
}

const cookies = new Cookies();
const cssPrefix = 'ftr-pco';

export const RescueShelterMinified: FC<RescueShelterMinifiedProps> = (props) => {
  const { selectedRow, setSelectedRow } = props;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>({});
  const [tempForm, setTempForm] = useState({});
  const [pcoSuggestion, setPcoSuggestion] = useState([]);
  const [animalRescueList, setAnimalRescueList] = useState([]);

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
    setTempForm(data);
  };

  useEffect(() => {
    apiCall('pco/get-pco-other-rescues', 'GET', {})
      .then((resp: any) => {
        setAnimalRescueList(resp?.data?.data?.pcoOtherRescues);
      });
  }, []);

  return (
    <div>
      <CustomTable
        config={{
          selectedRow,
          setSelectedRow: (data: any) => setSelectedRow(data),
        }}
        tableHeight={30}
        isNotEditable
        isNotDeletable
        showHeader={false}
        hideBorderColor
        selectable
        tableType="minified"
        tableData={animalRescueList}
        isLoading={false}
        columnData={[{
          title: 'Other Animal Rescues/Shelters',
          dataIndex: 'lastNameOtherRescue',
          width: '80%',
        }]}
        delete={() => { }}
        setEditModalOpen={setEditModalOpen}
      />
      {/* <br /> */}
    </div>
  );
};
