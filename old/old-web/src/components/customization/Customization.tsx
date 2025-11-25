/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Tabs, Typography,
} from 'antd';
import { apiCall } from 'src/shared/api/apiWrapper';
import constants from './constant.json';
// import AnimalTypesForUser from './components/AnimalTypesForUser';
import AnimalType from './components/AnimalType';
// import AnimalSpecies from './components/AnimalSpecies';
import AnimalAcquisitionWay from './components/AnimalAcquisitionWay';
import Behaviors from './components/Behaviors';
import HospitalClinics from './components/HospitalClinics';
import HealthProcedure from './components/HealthProcedure';
import AnimalVaccinationType from './components/AnimalVaccinationType';
import AnimalVeterinarians from './components/AnimalVeterinarian';
import AnimalVaccineInventory from './components/VaccinesInventory';
import AnimalMedicine from './components/AnimalMedicine';
import VolunteerActivities from './components/VolunteerActivities';
import OrganizationInfo from './components/OrganizationInfo';
import AnimalRescues from './components/AnimalRescues';
import { CustomizationProps } from './Customization.types';
import './Customization.less';

const { Title } = Typography;
const { TabPane } = Tabs;

const cssPrefix = 'ftr-customization';

export const Customization: FC<CustomizationProps> = (newCustomizationProps) => {
  const { permissions, role } = newCustomizationProps;
  const [data, setData] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [animalIdToType, setAnimalIdToType] = useState({});
  const [animalType, setAnimalType] = useState<any>('');
  const [animalTypeList, setAnimalTypeList] = useState([]);

  const onchangeAnimalType = (value: any) => {
    setAnimalType(value);
  };

  const [customizationTabs, setCustomizationTabs] = useState<Array<object>>([]);

  useEffect(() => {
    setCustomizationTabs([
      { title: 'Organization Info', content: <OrganizationInfo permissions={permissions} /> },
      // { title: 'Animal Breed/Species', content: <AnimalSpecies activeTab={activeTab} /> },
      { title: 'Animal Types', content: <AnimalType role={role} permissions={permissions} activeTab={activeTab} /> },
      { title: 'Animal Acquisition Ways', content: <AnimalAcquisitionWay permissions={permissions} /> },
      { title: 'Animal Behaviors', content: <Behaviors animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      // { title: 'Animal Hospitals/Clinics', content: <HospitalClinics permissions={permissions} /> },
      // { title: 'Veterinarians', content: <AnimalVeterinarians permissions={permissions} activeTab={activeTab} /> },
      { title: 'Health Procedures', content: <HealthProcedure animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      { title: 'Vaccination Types', content: <AnimalVaccinationType animalIdToType={animalIdToType} onchangeAnimalType={onchangeAnimalType} animalTypeList={animalTypeList} animalType={animalType} permissions={permissions} /> },
      // { title: 'Vaccines In Inventory', content: <AnimalVaccineInventory activeTab={activeTab} /> },
      { title: 'Medicines', content: <AnimalMedicine permissions={permissions} /> },
      { title: 'Volunteer Activities', content: <VolunteerActivities permissions={permissions} /> },
      // { title: 'Other Animal Rescues/Shelters', content: <AnimalRescues permissions={permissions} /> },
      // { title: 'Animal Breed/Species', content: <AnimalSpecies activeTab={activeTab} /> },
      // { title: 'Vaccines In Inventory', content: <VaccinesInventory activeTab={activeTab} /> },
    ]);
  }, [activeTab, animalTypeList, animalType]);

  /**
   *
   * Methods related to CRUD operations goes below
   *
  * */

  /**
   *
   * Navigate or move view to other components
   *
  * */

  /**
   *
   * Business Logic goes below
   *
  * */

  /**
   *
   * All ReactElements or JSX Elements are below
   *
  * */

  useEffect(() => {
    const { animalBehavior, healthProcedure, vaccinationTypes } = constants.customization_types;
    if ([animalBehavior, healthProcedure, vaccinationTypes].includes(parseInt(activeTab, 10))) {
      apiCall(`animaltype/get-animal-types?roleName=${role}`, 'GET', {})
        .then((resp: any) => {
          if (resp?.status === 200) {
            const currentAnimalTypeList = resp?.data?.data?.animalTypes;
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

  if (!permissions?.customization?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <div className={`${cssPrefix}`}>
      {pageHeader}
      <div className="desktop-view">
        <Tabs
          onChange={(activeKey) => setActiveTab(activeKey)}
          activeKey={activeTab}
          tabBarStyle={{ width: 230, fontSize: '2px !important' }}
          tabPosition="left"
          style={{ minHeight: '440px', width: '100%' }}
        >
          {customizationTabs.map((value: any, i) => (
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
          {customizationTabs.map((value: any, i) => (
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
