/* eslint-disable no-unused-vars */
import {
  Typography, Row, Col, Image, Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

interface PcoDetailCardProps {
  isModal?: boolean;
  imageView?: any;
}

const { Title } = Typography;

// eslint-disable-next-line
export const RescueDetailCard = (props: PcoDetailCardProps) => {
  const { isModal = false, imageView } = props;
  const [rescueDetails, rescuePcoDetail] = useState<any>({});

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
    let rescueDetailsJson: any = localStorage.getItem('rescueDetails');
    if (rescueDetailsJson) {
      rescueDetailsJson = JSON.parse(rescueDetailsJson);
      rescuePcoDetail(rescueDetailsJson);
    }
  }, []);

  return (
    <div style={{ paddingBottom: '10px' }}>
      <Tag
        key="rescue-detail"
        color="#F2F2F2"
        style={{
          // eslint-disable-next-line no-nested-ternary
          height: '80px', color: '#616161', display: 'flex', alignItems: 'center', borderRadius: '0px', width: isMobile ? '100%' : '350px',
        }}
      >
        <Row align="middle">
          <Col>
            {imageView && (
              <Image
                preview={false}
                src={imageView}
                style={{ ...cardStyle }}
              />
            )}
          </Col>
          <Col style={{ margin: '8px' }}>
            <Row>
              <div style={{ fontWeight: 600 }}>{`${rescueDetails?.name || ''}`}</div>
            </Row>
            <Row>
              <div>{`${rescueDetails?.street || ''}`}</div>
            </Row>
            <Row>
              <div>{`${rescueDetails?.phone || ''} `}</div>
            </Row>
          </Col>
        </Row>
      </Tag>
    </div>
  );
};

export default RescueDetailCard;
