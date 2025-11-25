/* eslint-disable no-unused-vars */
// import { useState } from 'react';
import { Upload } from 'antd';
import type { UploadFile } from 'antd';
import ImgCrop from 'antd-img-crop';

const CustomUpload: React.FC<any> = ({ onChange, fileList, handlePreview }: any) => {
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as any);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotationSlider>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={handlePreview}
        // eslint-disable-next-line no-unused-vars
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess && onSuccess(null, fileList);
          }, 500);
        }}
      >
        {fileList.length < 1 && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
};

export default CustomUpload;
