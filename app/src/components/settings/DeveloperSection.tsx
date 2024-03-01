import { Button, Card, Stack, Typography } from '@mui/joy';
import { FaGlobe } from 'react-icons/fa';
import { FaCode, FaGithub } from 'react-icons/fa6';

export function DeveloperSection() {
  return (
    <Card>
      <Stack>
        <Stack
          gap={2}
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
            <FaCode />
            <Typography level="h4">Developer</Typography>
          </Stack>
          <Stack flexDirection={'row'} gap={2}>
            <a
              href="https://xtrendence.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="solid"
                color="primary"
                endDecorator={<FaGlobe size={18} />}
              >
                Website
              </Button>
            </a>
            <a
              href="https://github.com/Xtrendence/XRC"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outlined"
                color="neutral"
                endDecorator={<FaGithub size={18} />}
                sx={(theme) => ({
                  borderWidth: 2,
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.background.surface,
                })}
              >
                GitHub
              </Button>
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
