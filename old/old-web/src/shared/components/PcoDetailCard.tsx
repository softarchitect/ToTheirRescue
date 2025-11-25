/* eslint-disable no-unused-vars */
import {
  Typography, Row, Col, Image,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';

interface PcoDetailCardProps {
  isModal?: boolean;
  imageView?: any;
  pcoDetails?: any;
  extraRender?: any;
}

const { Title } = Typography;

// eslint-disable-next-line
export const PCODetailCard = (props: PcoDetailCardProps) => {
  const {
    isModal = false, imageView, pcoDetails = null, extraRender = () => (''),
  } = props;
  const imageUrl = 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png';

  const [currentPcoDetail, setCurrentPcoDetail] = useState<any>({});

  const cardStyle: any = isModal ? {
    fontSize: 16,
    height: 62,
    width: 62,
    objectFit: 'contain',
  } : {
    fontSize: 14,
    height: 80,
    width: 80,
    objectFit: 'contain',
  };

  useEffect(() => {
    setCurrentPcoDetail(pcoDetails);
  }, []);

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ paddingBottom: '10px' }}>
      <Tag
        color="#F2F2F2"
        style={{
          // eslint-disable-next-line no-nested-ternary
          height: '80px',
          color: '#616161',
          margin: '4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0px',
          width: isMobile ? '98%' : '100%',
        }}
      >
        <Row align="middle">
          <Col>
            {imageView && (
              <Image
                preview={false}
                src={imageView}
                style={{ ...cardStyle }} // Use different CSS classes for modal and page image sizes
              />
            )}
          </Col>
          <Col style={{ marginLeft: '10px' }}>
            <Row>
              <span style={{ fontWeight: 600 }}>{`${currentPcoDetail?.firstName || ''} ${currentPcoDetail?.lastName || ''}`}</span>
            </Row>
            <Row wrap={false}>
              <div style={{ padding: '0px 2px 0px 0px' }}>{`${currentPcoDetail?.street || ''}`}</div>
              <div style={{ padding: '0px 0px 0px 2px' }}>{` ${currentPcoDetail?.phone && '|'} ${currentPcoDetail?.phone || ''} `}</div>
            </Row>
            {extraRender()}
          </Col>
        </Row>
      </Tag>
    </div>
  );
};

export default PCODetailCard;
