import { deliveryListContext } from "./contexts/DeliveryListContext";
import Map from "./components/Map/Map";
import "react-toastify/dist/ReactToastify.css";
import "./globalStyles/App.scss";
import { useContext, useEffect, useState } from "react";
import getURLSearchParam from "./util/getURLSearchParam";
import { getLocalStorageItem } from "./util/manageLocalStorage";
import Menu from "./components/Menu/Menu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeCookie } from "./util/manageCookies";

const App = () => {
  const { fetchDeliveryList } = useContext(deliveryListContext);
  const [shouldDisplayMap, setShouldDisplayMap] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const listId = Number(getURLSearchParam("listId"));
    const clenstore = !!getURLSearchParam("cleanstore");
    const localDeliveryList = getLocalStorageItem("deliveryList");
    const localListId = getLocalStorageItem("listId");
    const localUsername = getLocalStorageItem("username");
    const URLUsername = getURLSearchParam("login");

    if (URLUsername) {
      if (localUsername !== URLUsername) {
        setShouldDisplayMap(false);
        removeCookie("token");
        navigate(`/login/${window.location.search}`);
        toast.warning("O login foi alterado, confirme sua senha novamente", {
          toastId: "newLogin",
        });

        return;
      }
    }

    if (clenstore && listId !== localListId) {
      if (isNaN(listId)) {
        toast.error("A lista deve ser um número");
        return;
      }

      fetchDeliveryList(listId);
      return;
    }

    if (
      listId &&
      !isNaN(listId) &&
      listId !== localListId &&
      localDeliveryList
    ) {
      setShouldDisplayMap(false);
      navigate(`/finish-current-list/${window.location.search}`);
    }
  }, [navigate, fetchDeliveryList]);

  return (
    <div className="App">
      {shouldDisplayMap && (
        <>
          <Map zoom={14} />

          <Menu />
        </>
      )}
    </div>
  );
};

export default App;
