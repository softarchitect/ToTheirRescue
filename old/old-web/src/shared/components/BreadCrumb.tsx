/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import {
  useEffect, useRef,
} from 'react';
import {
  Typography, Row, Col,
} from 'antd';
import {
  HomeOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import navigationConstant from '../constants/navigationConstant.json';

const navigationConstantObj: any = navigationConstant;

interface BreadCrumbProps {
}

const { Title } = Typography;

const cssPrefix = 'ftr-animals';

// eslint-disable-next-line
export const BreadCrumb = (props: BreadCrumbProps) => {
  const titleRefBreadCrumb = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 600;

  useEffect(() => {
    titleRefBreadCrumb.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [location?.pathname]);

  return (
    <Row style={isMobile ? { padding: '0px 0px 10px 0px' } : { padding: '20px 0px 20px 0px' }} ref={titleRefBreadCrumb} wrap={false}>
      <Col key="home">
        <span
          onClick={() => navigate('/')}
          style={{ color: 'gray', cursor: 'pointer', padding: '0px 10px 0px 10px' }}
          className="truncate"
        >
          <HomeOutlined rev={undefined} />
        </span>
        {(location?.pathname.split('/')?.[1]) && <span style={{ color: 'gray', padding: '0px 10px 0px 10px' }}>/</span>}
      </Col>
      {
        location?.pathname.split('/')?.map((locationName: any, i) => (
          <Col key={`breadcrumb-${i}`} className="truncate">
            <span
              onClick={() => {
                (i < (location?.pathname.split('/')?.length - 1)) && navigate(`/${locationName}`);
              }}
              style={{
                color: (i < (location?.pathname.split('/')?.length - 1)) ? 'gray' : 'black',
                cursor: 'pointer',
                padding: '0px 2px 0px 2px',
                fontWeight: (i < (location?.pathname.split('/')?.length - 1)) ? 400 : 500,
              }}
            >
              {navigationConstantObj?.[locationName]}
            </span>
            {(i < (location?.pathname.split('/')?.length - 1)) && navigationConstantObj?.[locationName] && (
              <span style={{ color: 'gray', padding: '0px 10px 0px 10px' }}>/</span>
            )}
          </Col>
        ))
      }
    </Row>
  );
};

export default BreadCrumb;
