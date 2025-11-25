import {
  Button,
} from 'antd';
import TyrModal from './Modal/TyrModal';
import './ConfirmModal.less';

interface ConfirmModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  title: string;
  modalContent: any;
  onConfirmClick: any;
  onCancel: any;
  onCustomCancel?: any;
  size?: any;
}

const cssPrefix = 'ftr-confirm-modal';

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    modalVisible, setModalVisible, title, modalContent, onConfirmClick, onCancel, onCustomCancel, size,
  } = props;

  const footerContent = [
    <Button
      key="confirm-cancel-button"
      form="confirm-cancel-form"
      onClick={onCancel}
    >
      No
    </Button>,
    <Button
      className="ftr-button-primary"
      form="confirm-cancel-form"
      key={Date.now()}
      htmlType="submit"
      onClick={onConfirmClick}
    >
      Yes
    </Button>,
  ];

  const modalTitle = (
    <div className={`${cssPrefix}__title`}>
      {title}
    </div>
  );

  return (
    <TyrModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      footerContent={footerContent}
      modalContent={modalContent}
      modalTitle={modalTitle}
      onCancel={onCustomCancel || onCancel}
      size={size || 'sm'}
    />
  );
};

export default ConfirmModal;
