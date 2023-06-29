import { FC } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../../util/manageCookies";

interface Props {
  ElementToRenderIfAllowed: () => JSX.Element;
}

const ProtectedRoute: FC<Props> = ({ ElementToRenderIfAllowed }) => {
  const token = getCookie("token");

  if (!token || token.length === 0) {
    return <Navigate to={`/login/${window.location.search}`} />;
  }

  return <ElementToRenderIfAllowed />;
};

export default ProtectedRoute;
