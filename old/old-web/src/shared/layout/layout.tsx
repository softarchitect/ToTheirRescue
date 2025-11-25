/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { FC, useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  message,
  Button,
  Popover,
  Row,
  Col,
} from 'antd';
import { connect } from 'react-redux';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  Outlet, Link, useLocation, useNavigate,
} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { isMobileOnly } from 'react-device-detect';
import { setSelectedAnimal, setSelectedPco } from 'src/redux/common/action';
import { apiCall } from '../api/apiWrapper';
import BreadCrumb from '../components/BreadCrumb';

interface IState {
}

const { Header, Content, Footer } = Layout;

export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const StyledLayout = styled(Layout)`
  background-color: white;
  position: relative;
  height: 100vh;
`;
const StyledContent = styled(Content)`
  padding: 0 50px;
  margin-top: 64px;
  height: 100vh;
  overflow: hidden auto;
  & .site-layout-content {
    min-height: 380px;
    padding: 24px;
    background: #fff;
  }
  @media only screen and (max-width: 600px) {
    padding: 20px;
  }
`;
const StyledHeader = styled(Header)`
  background-color: var(--tyr-primary); 
  position: fixed;
  width: 100%;
  z-index: 1;
`;

const TyrLayout: FC<any> = ({
  login, permissions, updateAnimalMilestoneLoading, addAnimalMilestoneLoading, uploadImageLoading,
  selectedAnimal, setSelectedAnimalData, deleteAnimalMilestoneLoading, setSelectedPcoData,
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState<string[]>([]);
  const [isLogin, setLogin] = useState(false);
  const authExludedRoutes = ['/login', '/signup', '/', '/auth', '/forgot-username', '/forgot-password', '/registration'];
  const [tenantName, setTenantName] = useState('To Their Rescue');
  const location = useLocation().pathname;

  const cookies = new Cookies();
  const isLogged = Boolean(cookies.get('login'));

  const routesLeft = [
    {
      path: '/animals',
      title: 'Animals',
      isNotVisible: !permissions?.animals?.view,
    },
    {
      path: '/pco',
      title: 'PCOs',
      isNotVisible: !permissions?.pco?.view,
    },
    {
      path: '/searches',
      title: 'Searches',
      isNotVisible: !permissions?.search?.view,
      subMenus: [
        { path: '/donations-search', title: 'Donations', isNotVisible: !permissions?.search?.donation },
        { path: '/animal-milestone-search', title: 'Animal Milestones', isNotVisible: !permissions?.search?.animal_milestone },
        { path: '/animal-search', title: 'Animals', isNotVisible: !permissions?.search?.animal_search },
        { path: '/animal-health-search', title: 'Animal Health', isNotVisible: !permissions?.search?.animal_health },
      ],
    },
    {
      path: '/queries',
      title: 'Queries',
      isNotVisible: !permissions?.query?.view,
      subMenus: [
        { path: '/animal-milestone-query', title: 'Animal Milestones', isNotVisible: !permissions?.query?.animal_milestone },
        { path: '/animal-health-query', title: 'Animal Health', isNotVisible: !permissions?.query?.animal_health },
        { path: '/donations-query', title: 'Donations', isNotVisible: !permissions?.query?.donation },
        { path: '/mail-list-query', title: 'Mail List', isNotVisible: !permissions?.query?.mail_list },
      ],
    },
    {
      path: '/reports',
      title: 'Reports',
      isNotVisible: !permissions?.report?.view,
      subMenus: [
        { path: '/reports/volunteers', title: 'Volunteers', isNotVisible: !permissions?.report?.volunteer },
        { path: '/reports/todays-meds', title: "Today's Meds", isNotVisible: !permissions?.report?.meds },
        // { path: '/reports/animal-health', title: 'Animal Health', isNotVisible: !permissions?.report?.animal_health },
        { path: '/reports/current-fosters', title: 'Current Fosters', isNotVisible: !permissions?.query?.current_foster },
        // { path: '/reports/animal-report', title: 'Animal Report', isNotVisible: !permissions?.query?.animal_report },
      ],
    },
    {
      title: 'Admin',
      isNotVisible: (!permissions?.customization?.view && !permissions?.users?.view),
      subMenus: [
        { path: '/customization', title: 'Customization', isNotVisible: !permissions?.customization?.view },
        { path: '/users', title: 'Users', isNotVisible: !permissions?.users?.view },
      ],
    },
    { title: 'Super Admin', path: '/super-admin', isNotVisible: !permissions?.super_admin?.view },
    // { path: '#', title: 'Help' },
  ];

  useEffect(() => {
    localStorage.removeItem('selectedPcoDetail');
    setSelectedAnimal('');
    if (isLogged) {
      const data = {};
      apiCall('tenant/get-tenant-info', 'GET', data)
        .then((resp: any) => {
          if (resp?.data?.success) {
            const tenantLoginName = resp?.data?.data?.tenant?.name;
            const tenantAcronym = resp?.data?.data?.tenant?.tenantAcronym;
            setTenantName(tenantLoginName?.length < 35 ? tenantLoginName : tenantAcronym);
            localStorage.setItem('countryId', resp?.data?.data?.tenant?.countryId);
            localStorage.setItem('countryCode', resp?.data?.data?.tenant?.countryISO2Code);
            localStorage.setItem('stateCode', resp?.data?.data?.tenant?.state);
            localStorage.setItem('email', resp?.data?.data?.tenant?.emailAddress);
          }
        });
    }
  }, [isLogged]);

  useEffect(() => {
    let ids = selectedAnimal?.ids;
    if (!ids || ids?.length === 0) {
      return;
    }
    if (updateAnimalMilestoneLoading || addAnimalMilestoneLoading || uploadImageLoading || deleteAnimalMilestoneLoading) {
      return;
    }

    ids = ids?.join(',');
    apiCall(`animal/get-animals-by-animalIds?ids=${ids}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          const animalDetails = resp?.data?.data?.animalList;
          setSelectedAnimalData({
            ids: [...selectedAnimal?.ids],
            animalDetails,
          });
        }
      });
  }, [updateAnimalMilestoneLoading, addAnimalMilestoneLoading, uploadImageLoading, deleteAnimalMilestoneLoading]);

  useEffect(() => {
    location && setView([location]);
    const isLoggedInTemp = Boolean(cookies.get('login'));
    const isLoggedOut = !isLoggedInTemp;
    const newLocation = location.split('/')[1];

    if (location?.split('/')[1] !== 'animals') {
      setSelectedAnimalData({
        ids: [],
        animalDetails: [],
      });
    }

    if (location?.split('/')[1] !== 'pco') {
      localStorage.removeItem('selectedPcoDetail');
      setSelectedPcoData('');
    }

    if (isLoggedOut) {
      // eslint-disable-next-line prefer-template
      if (location === '/') {
        navigate('/');
      } else if (location === '/signup') {
        navigate('/signup');
      } else if (location === '/registration') {
        navigate('/registration');
      } else if (location.split('/auth')[1]) {
        // navigate(location);
      } else if (authExludedRoutes.includes(`/${newLocation}`)) {
        navigate(`${location}`);
      } else {
        navigate('/login');
      }
    } else if (authExludedRoutes.includes(location)) {
      navigate('/');
    }
    const isLoggedIn = cookies.get('login');
    setLogin(isLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleClickHelp = () => {
    window.open('https://satotheirrescue.blob.core.windows.net/$web/docs/v1.0/index.htm');
  };

  const handleClick = (e: any) => {
    const routesDef = ['/animals', '/pco', '/searches', '/queries', '/donations', '/customization', '/reports', '/help', '/', '/signup'];
    if (routesDef.includes(e.key)) setView([e.key]);
  };

  const onLogout = (sesstionExpire: boolean) => {
    sesstionExpire ? message.error('Session Expire', 1.5) : message.success('Logout Successful', 1.5);
    cookies.remove('login', { path: '/' });
    cookies.remove('loginDetails', { path: '/' });
    sessionStorage.setItem('on-boarding', 'false');
    localStorage.setItem('countryId', '');
    localStorage.setItem('countryCode', '');
    localStorage.setItem('stateCode', '');
    localStorage.setItem('email', '');
    setTenantName('To Their Rescue');
    setLogin(false);
    navigate('/login');
  };

  const navigateToHomePage = () => {
    const isLoggedOut = !cookies.get('login');

    if (isLoggedOut) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (!login) {
      return;
    }
    setInterval(() => {
      const isLoggedIn = cookies.get('login');
      if (!isLoggedIn && !authExludedRoutes.includes(`/${window.location?.pathname?.split('/')?.[0]}`)) {
        onLogout(true);
      }
      if (isLoggedIn && authExludedRoutes.includes(window.location.pathname)) {
        navigate('/');
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  useEffect(() => {
    if (isBrowser) setView([window.location.pathname]);
    const isLoggedIn = Boolean(cookies.get('login'));
    if (!isLoggedIn && !authExludedRoutes.includes(`/${window.location?.pathname?.split('/')?.[0]}`)) {
      onLogout(true);
    }
    if (isLoggedIn && authExludedRoutes.includes(window.location.pathname)) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  const isMobile = window.innerWidth <= 768;

  return (
    <StyledLayout>
      <StyledHeader>
        <Row justify="space-between" align="middle" wrap={false} style={{ height: '100%' }}>
          <Col xs={4} sm={2} md={4} lg={3} xl={3} xxl={2}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="logo-header" onClick={navigateToHomePage} style={{ width: isMobile ? '40px' : `${tenantName ? (tenantName?.length * 9) : 100}px` }}>
              <p
                style={{
                  height: 31,
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 2,
                  overflowY: 'hidden',
                }}
              >
                {isMobile ? tenantName?.split('')?.[0] : tenantName}
              </p>
            </div>
          </Col>

          {isLogin
            && (
              <Col flex="auto">
                <Menu expandIcon="" className="menu-left" onClick={handleClick} theme="dark" mode="horizontal" selectedKeys={view}>
                  {routesLeft.map((route: any) => {
                    if (route?.isNotVisible) {
                      return (
                        <></>
                      );
                    }
                    if (route?.subMenus) {
                      return (
                        <Menu.SubMenu
                          key={route?.title}
                          title={(
                            <span className={isMobileOnly ? 'main-nav-tab' : 'submenus-title'}>
                              {route.title}
                              {' '}
                              <span style={{ paddingLeft: '6px', cursor: 'pointer' }}>
                                {!isMobile && (
                                  <DownOutlined className="" rev={undefined} style={{ fontSize: '10px' }} />
                                )}
                              </span>
                            </span>
                          )}
                        >
                          {
                            route?.subMenus.map((subMenu: any) => {
                              if (subMenu?.isNotVisible) {
                                return <span />;
                              }
                              return (
                                <Menu.Item key={subMenu?.path} onClick={() => navigate(subMenu?.path)}>
                                  {subMenu?.title}
                                </Menu.Item>
                              );
                            })
                          }
                        </Menu.SubMenu>
                      );
                    }
                    return (
                      <Menu.Item key={route.path}>
                        {route.title === 'Help' ? <Link to="#" target="_blank" onClick={handleClickHelp}>{route.title}</Link> : <Link className="main-nav-tab" to={route.path}>{route.title}</Link>}
                      </Menu.Item>
                    );
                  })}
                  <Menu.Item key="help-one">
                    <Link
                      style={isMobileOnly ? {} : {
                        backgroundColor: '#102F5A',
                        padding: '10px 20px',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '20px',
                      }}
                      className="help-tab"
                      to="#"
                      target="_blank"
                      onClick={handleClickHelp}
                    >
                      Help
                    </Link>
                  </Menu.Item>
                </Menu>
              </Col>
            )}

          {isLogin
            && (
              <Col xs={4} sm={2} md={6} lg={6} xl={4} xxl={5} style={{ backgroundColor: 'red' }}>
                <Menu className="user-menu" style={{ backgroundColor: 'green' }} theme="light" mode="horizontal" selectedKeys={view}>
                  <Popover
                    placement="bottom"
                    content={(
                      <Button
                        style={{
                          textAlign: 'center', cursor: 'pointer',
                        }}
                        onClick={() => onLogout(false)}
                      >
                        <div>Logout</div>
                      </Button>
                    )}
                    trigger="click"
                  >
                    <Row
                      align="middle"
                      justify="end"
                      style={{
                        textAlign: 'center', cursor: 'pointer', lineHeight: '1.3', width: '100%',
                      }}
                    >
                      <Col>
                        <Avatar size="large" icon={cookies.get('loginDetails').loginDetails?.firstName?.split('')[0] || <UserOutlined rev={undefined} />} />
                      </Col>
                      {!isMobile && (
                        <Col style={{ paddingLeft: '10px' }}>
                          <div
                            style={{
                              textAlign: 'start', fontSize: '16px', fontWeight: 300, textTransform: 'capitalize',
                            }}
                          >
                            {cookies.get('loginDetails').loginDetails?.firstName || cookies.get('loginDetails').loginDetails?.data?.firstName}
                          </div>
                          <div style={{ textAlign: 'start', fontSize: '12px' }}>{cookies.get('loginDetails')?.userType?.replace(/([a-z])([A-Z])/g, '$1 $2')}</div>
                        </Col>
                      )}
                    </Row>
                  </Popover>
                </Menu>
              </Col>
            )}
        </Row>
      </StyledHeader>
      <StyledContent style={{ overflowY: 'hidden' }}>
        {isLogged && <BreadCrumb />}
        <div className="content-page" id="content-page">
          <Outlet />
        </div>
      </StyledContent>
      <Footer
        key="tyr-footer"
        style={{
          backgroundColor: '#F2F2F2',
          textAlign: 'center',
          border: '#F2F2F2 1px solid',
          padding: '4px 0px 2px 0px',
        }}
      >
        {`To Their Rescue ©${new Date().getFullYear()}`}
      </Footer>
    </StyledLayout>
  );
};

const mapStateToProps = (state: any) => ({
  login: state.auth.login,
  permissions: state.auth.permissions,
  updateAnimalMilestoneLoading: state.animal.updateAnimalMilestoneLoading,
  addAnimalMilestoneLoading: state.animal.addAnimalMilestoneLoading,
  uploadImageLoading: state.common.uploadImageLoading,
  selectedAnimal: state.common.selectedAnimal,
  deleteAnimalMilestoneLoading: state.animal.deleteAnimalMilestoneLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
  setSelectedAnimalData: (data: any) => dispatch(setSelectedAnimal(data)),
  setSelectedPcoData: (data: any) => dispatch(setSelectedPco(data)),
});

export default connect<IState, any>(mapStateToProps, mapDispatchToProps)(TyrLayout);
