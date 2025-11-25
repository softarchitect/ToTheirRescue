/* eslint-disable no-unused-vars */
import {
  Typography, Row, Col, Image, Tag,
} from 'antd';
import { getAge } from 'src/utils/common';

interface AnimalDetailCardProps {
  isModal?: boolean; // Add a prop to indicate if the component is rendered in a modal
  imageView?: any;
  animalDetails?: any;
  cardWidth?: any;
  incomingImageView?: any;
  isAttachment?: any;
}

const { Title } = Typography;

export const AnimalDetailCard = (props: AnimalDetailCardProps) => {
  const {
    isModal = false, animalDetails, cardWidth, incomingImageView, isAttachment,
  } = props;

  let imageView = animalDetails?.[0]?.artifactAttachment?.blobUrl;

  if (isAttachment) {
    imageView = incomingImageView;
  }

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

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ paddingBottom: '10px' }}>
      {(animalDetails?.length > 1) && (
        <div
          style={{
            // border: '1px solid #F2F2F2',
            maxHeight: '108px',
            overflowY: (animalDetails?.length > 4) ? 'scroll' : 'hidden',
            overflowX: 'hidden',
            backgroundColor: '#f8f8f8',
          }}
        >
          {animalDetails?.map((data: any) => (
            <Tag
              key={data?.id}
              color="blue"
              style={{
                // eslint-disable-next-line no-nested-ternary
                height: '44px', margin: '4px', borderRadius: '4px', width: isMobile ? '98%' : (cardWidth ? `${cardWidth}%` : '48%'),
              }}
            >
              <Row>
                <span style={{ fontWeight: 600 }}>{data?.animalName}</span>
              </Row>
              <Row wrap={false}>
                <div style={{ padding: '0px 2px 0px 0px' }}>{`${data?.animalId}`}</div>
                |
                <div style={{ padding: '0px 2px 0px 2px' }}>{`${data?.breed}`}</div>
                |
                <div style={{ padding: '0px 2px 0px 2px' }}>{`${data?.sex}`}</div>
                |
                <div style={{ padding: '0px 0px 0px 2px' }}>{`${getAge(data?.birthMilestone?.milestoneDate)}`}</div>
              </Row>
            </Tag>
          ))}
        </div>
      )}
      {
        (animalDetails?.length === 1) && (
          <Tag
            key={animalDetails?.[0]?.id}
            color="#F2F2F2"
            style={{
              // eslint-disable-next-line no-nested-ternary
              height: '80px', color: '#616161', margin: '4px', display: 'flex', alignItems: 'center', borderRadius: '0px', width: isMobile ? '98%' : '350px',
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
                  <span style={{ fontWeight: 600 }}>{`${animalDetails?.[0]?.animalName} | ID NO: ${animalDetails?.[0]?.animalId}`}</span>
                </Row>
                <Row wrap={false}>
                  <div style={{ padding: '0px 2px 0px 2px' }}>{`${animalDetails?.[0]?.breed}`}</div>
                  |
                  <div style={{ padding: '0px 2px 0px 2px' }}>{`${animalDetails?.[0]?.sex}`}</div>
                  |
                  <div style={{ padding: '0px 0px 0px 2px' }}>{`${getAge(animalDetails?.[0]?.birthMilestone?.milestoneDate)}`}</div>
                </Row>
              </Col>
            </Row>
          </Tag>
        )
      }
    </div>
  );
};

export default AnimalDetailCard;
