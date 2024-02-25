import {
  Autocomplete,
  AutocompleteOption,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
  ModalDialog,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy';
import { FaLink } from 'react-icons/fa';

export default function DependenciesModal({
  processOptions,
  value,
  setValue,
  open,
  setOpen,
  onConfirm,
  onCancel,
}: {
  processOptions: Array<{
    label: string;
    id: number;
  }>;
  value: Array<string>;
  setValue: React.Dispatch<React.SetStateAction<Array<string>>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          minWidth: 400,
          maxWidth: 400,
        }}
      >
        <DialogTitle
          sx={{
            alignItems: 'center',
          }}
        >
          <FaLink />
          Select Dependencies
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            boxSizing: 'border-box',
          }}
        >
          <Autocomplete
            options={processOptions}
            sx={{
              overflow: 'hidden',
              boxSizing: 'border-box',
              input: {
                marginLeft: 0,
              },
            }}
            value={value}
            onChange={(_, newValue) => {
              setValue(
                newValue.map((v) => {
                  if (typeof v === 'string') return v;
                  return v.label;
                })
              );
            }}
            disableCloseOnSelect
            renderOption={(props, option) => {
              const label = option.label;

              if (value.includes(label)) return;

              return (
                <AutocompleteOption
                  {...props}
                  sx={{
                    overflow: 'hidden',
                  }}
                >
                  <Stack>
                    <Typography>{label}</Typography>
                  </Stack>
                </AutocompleteOption>
              );
            }}
            startDecorator={
              <Tooltip
                arrow
                placement="bottom-start"
                variant="soft"
                sx={{
                  maxWidth: 300,
                }}
                title={`Specify which processes should be running for the backup to occur, if any.`}
              >
                <IconButton
                  tabIndex={-1}
                  sx={{
                    color: 'rgb(164, 145, 194)',
                  }}
                >
                  <FaLink />
                </IconButton>
              </Tooltip>
            }
            multiple
            freeSolo
          />
        </DialogContent>
        <DialogActions
          sx={{
            pt: 0,
          }}
        >
          <Button
            variant="solid"
            color={'primary'}
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
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
