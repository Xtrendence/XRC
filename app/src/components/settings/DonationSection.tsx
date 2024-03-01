import { Button, Card, Stack, Typography } from '@mui/joy';
import { FaDonate } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { toastOptions } from '../../globalVariables';
import toast from 'react-hot-toast';
import { FaPaypal } from 'react-icons/fa6';

export function DonationSection() {
  return (
    <Card>
      <Stack>
        <Stack
          gap={2}
          sx={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack alignItems={'center'} justifyContent={'center'} gap={2}>
            <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
              <FaDonate />
              <Typography level="h4">Donations</Typography>
            </Stack>
            <Typography textAlign={'center'}>
              If you like my work and would like to support me, you can donate
              to the following addresses by scanning the QR codes below, or by
              copying the addresses by clicking on the QR codes. You can also
              use PayPal by clicking the button below.
            </Typography>
          </Stack>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            gap={2}
            justifyContent={'center'}
            mb={1}
          >
            <a
              href="https://www.paypal.com/paypalme/Xtrendence"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant={'solid'}
                color={'primary'}
                startDecorator={<FaPaypal />}
              >
                Donate with PayPal
              </Button>
            </a>
          </Stack>
          <Stack
            sx={{
              flexDirection: {
                sm: 'column',
                md: 'row',
              },
            }}
            gap={2}
          >
            <Stack>
              <Stack
                onClick={() => {
                  navigator.clipboard.writeText(
                    'bc1q3tc9urgpkhnvrcdhj32y5x4wgf0zsy8fjdlps4'
                  );

                  toast.success(
                    'Bitcoin address copied to clipboard.',
                    toastOptions
                  );
                }}
                sx={(theme) => ({
                  padding: 2,
                  borderRadius: 'md',
                  background: theme.palette.common.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.25s',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  },
                })}
              >
                <QRCode value="bc1q3tc9urgpkhnvrcdhj32y5x4wgf0zsy8fjdlps4" />
              </Stack>
              <Typography textAlign={'center'}>Bitcoin - BTC</Typography>
            </Stack>
            <Stack>
              <Stack
                onClick={() => {
                  navigator.clipboard.writeText(
                    '0x69f3F5f041bf25B08deAadB81546e4a8904045AB'
                  );

                  toast.success(
                    'Ethereum address copied to clipboard.',
                    toastOptions
                  );
                }}
                sx={(theme) => ({
                  padding: 2,
                  borderRadius: 'md',
                  background: theme.palette.common.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.25s',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  },
                })}
              >
                <QRCode value="0x69f3F5f041bf25B08deAadB81546e4a8904045AB" />
              </Stack>
              <Typography textAlign={'center'}>Ethereum - ETH</Typography>
            </Stack>
          </Stack>
          <Stack
            sx={{
              flexDirection: {
                sm: 'column',
                md: 'row',
              },
            }}
            gap={2}
          >
            <Stack>
              <Stack
                onClick={() => {
                  navigator.clipboard.writeText(
                    'addr1qxvj5mkj6jwemycxcl9r73sv8xmwwyqk2qhw23pr9wl9zmve9fhd94yankfsd3728arqcwdkuugpv5pwu4zzx2a729ksphemqa'
                  );

                  toast.success(
                    'Cardano address copied to clipboard.',
                    toastOptions
                  );
                }}
                sx={(theme) => ({
                  padding: 2,
                  borderRadius: 'md',
                  background: theme.palette.common.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.25s',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  },
                })}
              >
                <QRCode value="addr1qxvj5mkj6jwemycxcl9r73sv8xmwwyqk2qhw23pr9wl9zmve9fhd94yankfsd3728arqcwdkuugpv5pwu4zzx2a729ksphemqa" />
              </Stack>
              <Typography textAlign={'center'}>Cardano - ADA</Typography>
            </Stack>
            <Stack>
              <Stack
                onClick={() => {
                  navigator.clipboard.writeText(
                    '489unYyCjSKbNRkL15nuedGnkLLDVJu9f1Lp2G7af2EpMQpGDbYYdpAPTzCoSVSi67geTzASFxxzSUnFVVrmccrVLTBqkqQ'
                  );

                  toast.success(
                    'Monero address copied to clipboard.',
                    toastOptions
                  );
                }}
                sx={(theme) => ({
                  padding: 2,
                  borderRadius: 'md',
                  background: theme.palette.common.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.25s',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  },
                })}
              >
                <QRCode value="489unYyCjSKbNRkL15nuedGnkLLDVJu9f1Lp2G7af2EpMQpGDbYYdpAPTzCoSVSi67geTzASFxxzSUnFVVrmccrVLTBqkqQ" />
              </Stack>
              <Typography textAlign={'center'}>Monero - XMR</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
