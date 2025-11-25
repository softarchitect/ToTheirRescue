/* eslint-disable no-unused-vars */
import { useEffect, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
// eslint-disable-next-line no-unused-vars
import Title from 'antd/lib/typography/Title';
import {
  // eslint-disable-next-line no-unused-vars
  Row, Col, Button,
  Card,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { apiCall } from 'src/shared/api/apiWrapper';
import { DashboardProps } from './Dashboard.types';
import DashboardCard from './components/Card';
import './Dashboard.less';
import {
  animalIcon, calendarIcon, customizationIcon, thankYouIcon, userIcon, vaccineIcon,
} from '../../assets/images';
import { LandingPage } from '../landing/LandingPage';
import WelcomePage from '../onboarding/welcomePage/WelcomePage';

const cssPrefix = 'ftr-dashboard';

export const Dashboard: FC<DashboardProps> = (newDashboardProps) => {
  // eslint-disable-next-line no-unused-vars
  const {
    getCountLoading, counts, getCountCall, permissions,
  } = newDashboardProps;
  const navigate = useNavigate();
  const [vaccinationReminderCount, setVaccinationReminderCount] = useState(0);
  const [vaccinationReminderCountLoading, setVaccinationReminderCountLoading] = useState(false);
  const [procedureReminderCount, setProcedureReminderCount] = useState(false);
  const [procedureReminderCountLoading, setProcedureReminderCountLoading] = useState(false);
  const [medsReminderCount, setMedsReminderCount] = useState(false);
  const [medsReminderCountLoading, setMedsReminderCountLoading] = useState(false);
  const cookies = new Cookies();
  const isLogIn = Boolean(cookies.get('login'));

  const isOnBoarding = JSON.parse(sessionStorage.getItem('on-boarding') || 'false');

  const getVaccinationReminderCount = () => {
    setVaccinationReminderCountLoading(true);
    apiCall('animal-vaccination/get-all-animal-vaccinations?reminder=true', 'GET', {})
      .then((resp: any) => {
        setVaccinationReminderCountLoading(false);
        if (resp?.data?.success) {
          setVaccinationReminderCount(resp?.data?.data?.count);
        }
      });
  };

  const getProcedureReminderCount = () => {
    setProcedureReminderCountLoading(true);
    apiCall('animal-procedure/get-all-animal-procedures?reminder=true', 'GET', {})
      .then((resp: any) => {
        setProcedureReminderCountLoading(false);
        if (resp?.data?.success) {
          setProcedureReminderCount(resp?.data?.data?.count);
        }
      });
  };

  const getMedsReminderCount = () => {
    setMedsReminderCountLoading(true);
    apiCall('med/get-all-meds?reminder=true&days=-999', 'GET', {})
      .then((resp: any) => {
        setMedsReminderCountLoading(false);
        if (resp?.data?.success) {
          setMedsReminderCount(resp?.data?.data?.count);
        }
      });
  };

  useEffect(() => {
    if (isLogIn) {
      getVaccinationReminderCount();
      getProcedureReminderCount();
      getMedsReminderCount();
      getCountCall({}, () => {
        console.log('fetching count');
      });
    }
  }, []);

  const cardData = [
    {
      isShow: permissions?.animals?.view,
      imageUrl: animalIcon,
      title: 'Animals',
      url: '/animals',
      description: (<div>
        {getCountLoading ? (
          <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
        ) : (
          <span className="dashboard-count">
            {counts?.animalCount?.residentAnimalCount || 0}
          </span>
        )}
        Current Residents
        <br />
        {getCountLoading ? (
          <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
        ) : (
          <span className="dashboard-count">
            {counts?.animalCount?.formarAnimalCount || 0}
          </span>
        )}
        Former Residents
      </div>),
    },
    {
      isShow: permissions?.pco?.view,
      imageUrl: userIcon,
      title: (<div>
        People, Companies and Organizations
      </div>),
      url: '/pco',
      description: (<div>
        {getCountLoading ? (
          <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
        ) : (
          <span className="dashboard-count">
            {counts?.pcoCount?.personCount || 0}
          </span>
        )}
        People
        <br />
        {getCountLoading ? (
          <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
        ) : (
          <span className="dashboard-count">
            {counts?.pcoCount?.organizationCount || 0}
          </span>
        )}
        Companies and Organizations
      </div>),
    },
    {
      isShow: permissions?.customization?.view,
      imageUrl: customizationIcon,
      title: 'Customization',
      url: '/customization',
      description: 'Customize all settings',
    },
    {
      isShow: permissions?.animals?.actions?.procedure,
      imageUrl: 'https://cdn-icons-png.freepik.com/512/5523/5523579.png',
      title: (<div>
        Vaccination Reminders
      </div>),
      url: 'vaccination-reminder',
      description: (
        <div>
          {vaccinationReminderCountLoading ? (
            <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
          ) : (
            <span className="dashboard-count">
              {vaccinationReminderCount || 0}
            </span>
          )}
          Vaccination Reminders
        </div>
      ),
    },
    {
      isShow: permissions?.animals?.actions?.procedure,
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/7417/7417066.png',
      title: (<div>
        Procedures, Tests, Treatment Reminders
      </div>),
      url: 'procedure-reminder',
      description: (
        <div>
          {procedureReminderCountLoading ? (
            <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
          ) : (
            <span className="dashboard-count">
              {procedureReminderCount || 0}
            </span>
          )}
          Procedure Reminders
        </div>
      ),
    },
    {
      isShow: permissions?.animals?.actions?.meds,
      imageUrl: calendarIcon,
      title: 'Med Reminders',
      url: '/med-reminder',
      description: (<div>
        {medsReminderCountLoading ? (
          <LoadingOutlined rev={undefined} style={{ marginRight: '4px' }} spin />
        ) : (
          <span className="dashboard-count">
            {medsReminderCount || 0}
          </span>
        )}
        Today’s Med Reminders
      </div>),
    },
    // {
    //   isShow: true,
    //   imageUrl: thankYouIcon,
    //   title: 'Thank You Reminders',
    //   url: '',
    //   description: (<div>
    //     16 Pending Thank Yous
    //   </div>),
    // },
  ];

  const isMobile = window.innerWidth <= 768;

  return (
    isLogIn ? (
      <div
        className={`${cssPrefix}`}
        style={{
          paddingBottom: '40px',
          height: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {
          isOnBoarding ? (
            <WelcomePage />
          ) : (
            <Row justify="center" align="middle" style={{ height: '70vh' }}>
              <Col xs={24} sm={24} md={24} xl={20} xxl={18}>
                <Row justify="center" gutter={isMobile ? [10, 10] : [20, 20]}>
                  {
                    cardData.map((data) => {
                      if (data?.isShow) {
                        return (
                          <Col key={`card-${data.title}`} span={12} xs={24} md={12} xl={12}>
                            <DashboardCard image={data.imageUrl} title={data.title} description={data.description} navigateUrl={() => navigate(data.url)} />
                          </Col>
                        );
                      }
                      return '';
                    })
                  }
                </Row>
              </Col>
            </Row>
          )
        }
      </div>
    ) : (
      <LandingPage />
    )
  );
};
