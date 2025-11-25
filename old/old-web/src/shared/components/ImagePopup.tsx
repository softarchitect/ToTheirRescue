import { useState, useEffect, FC } from 'react';
import { Tooltip } from 'antd';

const ImagePopup: FC<any> = ({ imgUrl }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  if (!imgUrl) {
    return (<div />);
  }

  return (
    <div>
      {isVisible && (
        <Tooltip
          showArrow
          open
          color="white"
          destroyTooltipOnHide
          title={(
            <img
              style={{ objectFit: 'cover' }}
              height="100px"
              width="100px"
              alt=""
              src={imgUrl}
            />
          )}
        />
      )}
    </div>
  );
};

export default ImagePopup;
