import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useIsMobile = () => {
  const theme = useTheme();
  // 'sm' is the breakpoint for small screens (mobile) in MUI's default theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile;
};

export default useIsMobile;
