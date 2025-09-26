import { Close, Warning } from "@mui/icons-material";
import {
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
  onClose: () => void;
}

const DynamicTollsLearnMoreDialog = ({
  open,
  onClose,
}: IDynamicTollsLearnMoreDialogProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Container>
        <Card
          sx={{
            marginTop: 8,
            marginX: "auto",
            maxWidth: "60%",
            md: { maxWidth: "80%" },
            backgroundColor: "success",
          }}
        >
          <CardHeader
            title="Understanding Dynamic Tolls"
            action={
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            }
          />
          <CardContent sx={{ opacity: 1 }}>
            <Typography variant="body1">
              Dynamic tolls adjust in real time based on current traffic
              conditions. While TEXpress toll roads use this pricing model,
              there is currently no public access to live toll rates. To provide
              an estimate, we use average pricing data from the past 180 days.
            </Typography>
            <Typography variant="body1" mt={1}>
              Please refer to posted toll signage before entering to confirm
              actual pricing.
            </Typography>
            <Typography variant="body1" mt={1}>
              Estimates are based on single-occupant vehicles and do not include
              HOV discounts.
            </Typography>

            <Stack direction="row" spacing={1} my={1}>
              <Warning color="warning" />
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Important:</span> Drivers
                without a Toll Tag typically pay double the tagged rate. Our
                estimate reflects whether a Toll Tag is present.
              </Typography>
            </Stack>

            <Link
              href="https://www.texpresslanes.com/pricing/dynamic-pricing/"
              target="_blank"
            >
              Read more on the TEXpress website
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Modal>
  );
};

export default DynamicTollsLearnMoreDialog;
