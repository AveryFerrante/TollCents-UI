import type { SvgIconComponent } from "@mui/icons-material";
import { Card, Stack, Typography } from "@mui/material";

interface InformationHighlightProps {
  title: string;
  subText?: string;
  infoHighlight: string;
  icon: SvgIconComponent;
}

const InformationHighlight = ({
  title,
  subText,
  infoHighlight,
  icon,
}: InformationHighlightProps) => {
  const Icon = icon;
  return (
    <Card
      elevation={0}
      sx={(theme) => ({ backgroundColor: theme.palette.grey[800], padding: 1 })}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon color="primary" fontSize="large" />
        <Stack spacing={0}>
          <Typography variant="subtitle2" color="textDisabled">
            {title}
          </Typography>
          <Typography variant="body1">{infoHighlight}</Typography>
        </Stack>
      </Stack>
      {subText && (
        <Typography
          variant="body1"
          color="textDisabled"
          sx={{ fontStyle: "italic", lineHeight: 1.3, fontSize: "0.75rem" }}
        >
          {subText}
        </Typography>
      )}
    </Card>
  );
};

export default InformationHighlight;
