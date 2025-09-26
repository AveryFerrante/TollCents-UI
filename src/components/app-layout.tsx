import { Backdrop, CircularProgress } from "@mui/material";
import Container from "@mui/material/Container";
import { Outlet, useNavigation } from "react-router";

const AppLayout = () => {
  const { state: navigationState } = useNavigation();
  return (
    <Container sx={{ my: 4 }}>
      <Backdrop open={navigationState === "loading"}>
        <CircularProgress color="primary" size="3rem" />
      </Backdrop>
      <Outlet />
    </Container>
  );
};

export default AppLayout;
