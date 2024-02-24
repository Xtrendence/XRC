import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { IoWarning } from 'react-icons/io5';

export default function ConfirmationModal({
  open,
  setOpen,
  onConfirm,
  danger = false,
  title = 'Confirmation',
  content,
  actions,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  danger?: boolean;
  title: string;
  content: string;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle
            sx={{
              alignItems: 'center',
            }}
          >
            <IoWarning />
            {title}
          </DialogTitle>
          <Divider />
          {content && <DialogContent>{content}</DialogContent>}
          <DialogActions>
            <Button
              variant="solid"
              color={danger ? 'danger' : 'primary'}
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Confirm
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {actions}
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
