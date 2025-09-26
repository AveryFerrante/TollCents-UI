import RoomIcon from "@mui/icons-material/Room";
import { Divider, Stack, Typography } from "@mui/material";

interface StartEndInformationProps {
  start: string;
  end: string;
}

const StartEndInformation = ({ start, end }: StartEndInformationProps) => {
  return (
    <Stack spacing={1}>
      <AddressInformation
        address={start}
        subtitle="Start"
        iconColor="success"
      />
      <Divider />
      <AddressInformation address={end} subtitle="End" iconColor="error" />
      <Divider />
    </Stack>
  );
};

const AddressInformation = ({
  address,
  subtitle,
  iconColor,
}: {
  address: string;
  subtitle: string;
  iconColor: "success" | "error";
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" sx={{ flex: 1, minWidth: 0 }}>
        <RoomIcon color={iconColor} />
        <Typography noWrap variant="body1" ml={2}>
          {address}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" ml={2} sx={{ fontStyle: "italic" }}>
        {subtitle}
      </Typography>
    </Stack>
  );
};

export default StartEndInformation;
