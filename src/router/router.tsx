import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/util/ProtectedRoute/ProtectedRoute";
import FinishCurrentListPage from "../pages/FinishCurrentList/FinishCurrentList";
import ListFinishedPage from "../pages/ListFinished/ListFinished";
import LoginPage from "../pages/Login/Login";

// Setting up the project routes
const router = createBrowserRouter([
  // Redirecting the main route to login
  {
    path: "/",
    element: <Navigate to={`/login/${window.location.search}`} />,
  },
  // User login
  {
    path: "/login",
    element: <LoginPage />,
  },
  // Page with the map and all the app's
  // core functionality
  {
    path: "/map",
    element: <ProtectedRoute ElementToRenderIfAllowed={App} />,
  },
  // Page for when the user tries to reorder
  // two lists on different tabs
  {
    path: "/finish-current-list",
    element: (
      <ProtectedRoute ElementToRenderIfAllowed={FinishCurrentListPage} />
    ),
  },
  // Page for when the user either finishes
  // or cancels the list reordering
  {
    path: "/list-finished",
    element: <ProtectedRoute ElementToRenderIfAllowed={ListFinishedPage} />,
  },
]);

export default router;
