import {
  BarChart,
  Close,
  DirectionsCar,
  HelpOutline,
  LocalOffer,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

interface IDynamicTollsLearnMoreDialogProps {
  open: boolean;
  processedAllDynamicTolls: boolean;
  onClose: () => void;
}

const DynamicTollsLearnMoreDialog = ({
  open,
  processedAllDynamicTolls,
  onClose,
}: IDynamicTollsLearnMoreDialogProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(6px)" },
        },
      }}
    >
      <Container>
        <Card
          sx={{
            maxWidth: 800,
            borderRadius: 3,
            mx: "auto",
            mt: 10,
            boxShadow: 8,
            bgcolor: "grey.900",
            border: "2px solid",
            borderColor: "grey.700",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold">
                Understanding Dynamic Tolls
              </Typography>
            }
            action={
              <IconButton onClick={onClose} aria-label="Close">
                <Close />
              </IconButton>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <DirectionsCar color="primary" />
                  <Typography variant="subtitle2" color="grey.300">
                    What are dynamic tolls?
                  </Typography>
                </Stack>
                <Typography variant="body2" color="grey.400">
                  Dynamic tolls adjust in real time based on current traffic
                  conditions. TEXpress lanes use this pricing model, but exact
                  update-to-date toll rate data is not publicly available.
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <BarChart color="info" />
                  <Typography variant="subtitle2" color="grey.300">
                    How are estimates calculated?
                  </Typography>
                </Stack>
                <Typography variant="body2" color="grey.400">
                  We use average pricing data from the past{" "}
                  <strong>180 days</strong> to provide an estimate. These
                  estimates are based on{" "}
                  <strong>single-occupant vehicles</strong> and do not include
                  HOV discounts.
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <LocalOffer color="success" />
                  <Typography variant="subtitle2" color="grey.300">
                    Toll Tag impact
                  </Typography>
                </Stack>
                <Typography variant="body2" color="grey.400">
                  Drivers without a Toll Tag typically pay{" "}
                  <strong>double</strong> the rate. Our estimated price does
                  reflect your selected Toll Tag option.
                </Typography>
              </Box>

              {!processedAllDynamicTolls && (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <HelpOutline color="warning" />
                    <Typography variant="subtitle2" color="grey.300">
                      Missing toll estimate
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="grey.400">
                    Estimating is hard—especially when toll rates aren’t
                    publicly available. This route includes one or more dynamic
                    toll segments we couldn’t reliably estimate, so they’ve been{" "}
                    <strong>entirely omitted</strong> from the estimated toll
                    price.
                  </Typography>
                </Box>
              )}

              <Alert
                severity="warning"
                icon={<Warning />}
                sx={{
                  borderRadius: 3,
                }}
              >
                <Typography variant="body2">
                  Always check posted toll signage before entering to confirm
                  actual pricing.
                </Typography>
              </Alert>

              <Link
                href="https://www.texpresslanes.com/pricing/dynamic-pricing/"
                target="_blank"
                variant="body2"
              >
                Learn more on the TEXpress website
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Modal>
  );
};

export default DynamicTollsLearnMoreDialog;
