/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Upload, Form, Image, Modal, Row, Tooltip, UploadProps,
} from 'antd';
import type { GetProp } from 'antd';
import {
  DeleteOutlined, EyeOutlined,
} from '@ant-design/icons';
import './SingleAvatarUpload.less';
import ImgCrop from 'antd-img-crop';

export interface SingleAvatarUploadProps {
  imageState: any,
  imageUrl: any;
  setImageUrl: any;
  setImageState: any;
  visible?: boolean,
  type?: any,
  key?: any;
  disabled?: any;
  onChange?: any;
}

const SingleAvatarUpload = (props: SingleAvatarUploadProps) => {
  const {
    imageState, key, setImageState, imageUrl, type, setImageUrl, onChange,
  } = props;

  const [preview, setPreview] = useState(false);

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  // function getBase64(file: any) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = ({ target: img }: { target: any }) => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = (error: any) => reject(error);
  //   });
  // }

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);

  const handleDelete = () => {
    setImageState('');
    setImageUrl('');
  };

  const handlePreview = () => {
    setPreview(true);
  };

  // const onChange = async ({ file }: { file: any }) => {
  //   const image = await getBase64(file.originFileObj);
  //   setCurrentImageState(image);
  //   setImageState(file.originFileObj);
  // };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const currentImageState = imageState;

  return (
    <>
      <Tooltip
        title={(
          <p style={{ color: 'black', padding: '0px 10px', margin: '0px' }}>
            {type}
            {' '}
            Image Upload
          </p>
        )}
        color="white"
        key={key}
        id={key}
      >
        <Form.Item
          name="upload"
          // label={`${type} Image`}
          className="form-div-avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          key={key}
          id={key}
        >
          <div
            className="container-div"
            key={key}
            id={key}
          >
            {imageState ? (
              <div key={key} id={key} className="image-wrapper" style={{ width: 199, height: 199 }}>
                <div className="image-container">
                  <Image
                    id={key}
                    key={key}
                    preview={false}
                    src={imageUrl}
                    className="animal-image-upload"
                    style={{
                      objectFit: 'contain',
                      border: '0px dashed #8F8F8F',
                      height: 199,
                      width: 199,
                    }}
                  />
                  <div className="action-item">
                    <span className="image-icon" onClick={() => handleDelete()}>
                      <DeleteOutlined rev={undefined} />
                    </span>
                    <span className="image-icon" onClick={() => handlePreview()}>
                      <EyeOutlined rev={undefined} />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  className="animal-image-upload-button"
                  fileList={imageState ? [imageState] : []}
                  onChange={onChange}
                  onPreview={handlePreview}
                  // eslint-disable-next-line no-unused-vars
                  customRequest={({ file, onSuccess }) => {
                    getBase64(file as FileType, (url) => {
                      // loading event
                      setImageState([file]);
                      setImageUrl(url);
                    });
                    onSuccess && onSuccess(null, file as any);
                  }}
                >
                  + Upload
                </Upload>
              </ImgCrop>
            )}
          </div>
        </Form.Item>
      </Tooltip>
      <Modal title="Image Preview" footer={false} open={preview} onCancel={() => setPreview(false)}>
        <Row justify="center">
          <Image
            preview={false}
            src={imageUrl}
            className=""
            style={{
              objectFit: 'contain',
              border: '0px dashed #8F8F8F',
            }}
          />
        </Row>
      </Modal>
    </>
  );
};

export default SingleAvatarUpload;
