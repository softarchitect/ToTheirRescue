/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

const CustomUploadDocument: React.FC<any> = ({ onChange, fileList }: any) => {
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
    <Upload
      name="file"
      headers={{
        authorization: 'authorization-text',
      }}
      onChange={onChange}
      multiple={false}
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
      }}
    >
      {fileList.length < 1 && (
        <div style={{ padding: '20px', cursor: 'pointer' }}>
          + Upload
        </div>
      )}
    </Upload>
  );
};

export default CustomUploadDocument;
