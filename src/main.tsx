import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/app-layout";
import RouteResults from "./components/route-results/route-results";
import RouteResultsLoadError from "./components/route-results/route-results-load-errors/route-results-load-error";
import { RouteResultsLoader } from "./components/route-results/route-results-loader";
import SearchForm from "./components/search-form/search-form";

// using "Data" mode of React Router
const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      { index: true, Component: SearchForm },
      {
        path: "/routes",
        loader: RouteResultsLoader,
        Component: RouteResults,
        errorElement: <RouteResultsLoadError />,
      },
    ],
  },
]);

let theme = createTheme({
  palette: {
    mode: "dark",
  },
});
theme = responsiveFontSizes(theme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
