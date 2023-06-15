import { FC } from 'react';
import { Modal as ModalMUI } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <ModalMUI open={open} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          background: 'white',
          padding: '2rem',
        }}
      >
        {children}
      </div>
    </ModalMUI>
  );
};

export default Modal;
