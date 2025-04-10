import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
