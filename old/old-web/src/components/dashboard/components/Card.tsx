/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { FC } from 'react';
import {
  Card, Row, Col,
} from 'antd';
import { RightCircleOutlined, RightCircleTwoTone } from '@ant-design/icons';
import { isMobileOnly } from 'react-device-detect';

const { Meta } = Card;

const cssPrefix = 'ftr-dashboard';

interface Props {
  image: string,
  title: any,
  description: any,
  navigateUrl: any;
}

const DashboardCard: FC<Props> = (newProps) => {
  const {
    image, title, description, navigateUrl,
  } = newProps;

  return (
    <Card onClick={isMobileOnly && navigateUrl} bodyStyle={{ padding: '0px', margin: '0px', backgroundColor: '#F1F2FA', borderRadius: '0px' }} style={{ borderRadius: '0px' }}>
      <Row justify="space-between" align="middle" style={{ margin: '0px', padding: isMobileOnly ? '6px 0px' : '0px' }}>
        {isMobileOnly ? (
          <Col span={24}>
            <Row justify="center" align="top" style={{ height: '70px', paddingLeft: '20px' }}>
              <Col span={19} style={{ padding: '0px', margin: '0px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#204F91',
                    paddingBottom: '2px',
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400 }}>
                  {description}
                </div>
              </Col>
              <Col span={5} style={{ width: '10px', height: '100%' }}>
                <Row align="middle" style={{ height: '100%' }}>
                  <img className={`${cssPrefix}__card__img`} src={image} alt="toyourrescue.com" />
                </Row>
              </Col>
            </Row>
          </Col>
        ) : (
          <>
            <Col span={isMobileOnly ? 1 : 3} style={{ padding: isMobileOnly ? '10px 20px' : '20px 40px', width: '10px' }}>
              <img className={`${cssPrefix}__card__img`} src={image} alt="toyourrescue.com" />
            </Col>
            <Col
              span={15}
              style={{ height: '12vh' }}
            >
              <Row justify="center" align="middle" style={{ height: '10vh', paddingLeft: '20px' }}>
                <Col span={24} style={{ padding: '0px', margin: '0px' }}>
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#204F91',
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 400 }}>
                    {description}
                  </div>
                </Col>
              </Row>
            </Col>
          </>
        )}
        {!isMobileOnly && (
          <Col span={4} style={{ minHeight: '100%' }}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div className="customization-button" onClick={navigateUrl}>
              <RightCircleOutlined rev={undefined} />
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default DashboardCard;
