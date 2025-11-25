/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Tabs, Typography,
} from 'antd';
import { apiCall } from 'src/shared/api/apiWrapper';
import AnimalTypes from './components/AnimalTypes';
import Behaviors from './components/Behaviors';
import HealthProcedure from './components/HealthProcedure';
import VaccinationType from './components/AnimalVaccinationType';
import AnimalMedicine from './components/AnimalMedicine';
import VolunteerActivities from './components/VolunteerActivities';

const { Title } = Typography;
const { TabPane } = Tabs;

const cssPrefix = 'ftr-customization';

export const AdminDashboard = ({ permissions }: any) => {
  const [activeTab, setActiveTab] = useState<any>('0');
  const [animalType, setAnimalType] = useState('');
  const [animalIdToType, setAnimalIdToType] = useState({});
  const [animalTypeList, setAnimalTypeList] = useState([]);
  const [adminTabs, setAdminTabs] = useState<Array<object>>([]);

  const onchangeAnimalType = (value: any) => {
    setAnimalType(value);
  };

  useEffect(() => {
    setAdminTabs([
      { title: 'Animal Types', content: <AnimalTypes activeTab={activeTab} permissions={permissions} /> },
      { title: 'Behaviors', content: <Behaviors activeTab={activeTab} animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      { title: 'Health Procedures', content: <HealthProcedure activeTab={activeTab} animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      { title: 'Vaccination Types', content: <VaccinationType activeTab={activeTab} animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      { title: 'Medicines', content: <AnimalMedicine activeTab={activeTab} permissions={permissions} /> },
      { title: 'Volunteer Activities', content: <VolunteerActivities activeTab={activeTab} permissions={permissions} /> },
      // { title: 'Add Animal To Category', content: <AddAnimalToCategory activeTab={activeTab} /> },
    ]);
  }, [activeTab, animalType, animalTypeList]);

  useEffect(() => {
    if ([0, 1, 2].includes(parseInt(activeTab, 10))) {
      apiCall('/saanimaltype/get-sa-animal-type', 'GET', {})
        .then((resp: any) => {
          if (resp?.status === 200) {
            const currentAnimalTypeList = resp?.data?.data?.saAnimalTypes;
            const currentAnimalIdToType: any = {};
            currentAnimalTypeList?.forEach((element: any) => {
              currentAnimalIdToType[element?.id] = element.typeName;
            });
            setAnimalIdToType(currentAnimalIdToType);
            setAnimalTypeList(currentAnimalTypeList);
            if (!animalType) {
              setAnimalType(currentAnimalTypeList?.[0]?.id);
            }
          }
        });
    }
  }, [activeTab]);

  const pageHeader = (
    <div className={`${cssPrefix}__header-row`}>
      {/* <Title level={3} style={{ margin: '16px 0' }}>
        Customization
      </Title> */}
    </div>
  );

  if (!permissions?.super_admin?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
      <div className="desktop-view">
        <Tabs
          onChange={(activeKey) => setActiveTab(activeKey)}
          activeKey={activeTab}
          tabBarStyle={{ width: 230, fontSize: '2px !important', marginTop: '40px' }}
          tabPosition="left"
          style={{ minHeight: '440px', width: '100%' }}
        >
          {adminTabs.map((value: any, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabPane tab={value.title} key={i} disabled={i === 28}>
              {value.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div className="mobile-view">
        <Tabs
          onChange={(activeKey) => setActiveTab(activeKey)}
          activeKey={activeTab}
          tabBarStyle={{ width: '94vw', fontSize: '2px !important' }}
          tabPosition="top"
          style={{ minHeight: '440px', width: '100%' }}
        >
          {adminTabs.map((value: any, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabPane tab={value.title} key={i} disabled={i === 28}>
              {value.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
