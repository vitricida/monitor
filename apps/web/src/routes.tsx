import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import AddArea from "./pages/AddArea";
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
        path: "/add-area",
        element: <AddArea />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
