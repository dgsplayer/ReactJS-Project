import Button from "../../components/util/Button/Button";
import GenericMapBackground from "../../components/util/GenericMapBackground/GenericMapBackground";
import getURLSearchParam from "../../util/getURLSearchParam";
import styles from "./FinishCurrentList.module.scss";
import { useContext, useState } from "react";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getLocalStorageItem } from "../../util/manageLocalStorage";
import { toast } from "react-toastify";

const FinishCurrentListPage = () => {
  const { resetDeliveryList } = useContext(deliveryListContext);
  const [isTryAgainBtnDisabled, setIsTryAgainBtnDisabled] = useState(false);
  const navigate = useNavigate();
  const localDeliveryList = getLocalStorageItem("deliveryList");

  const tryAgain = () => {
    const localDeliveryList = getLocalStorageItem("deliveryList");

    if (localDeliveryList) {
      setIsTryAgainBtnDisabled(true);

      setTimeout(() => {
        setIsTryAgainBtnDisabled(false);
      }, 15000);

      toast.error(
        "Finalize a ordenação da lista na outra aba antes de começar a nova"
      );
      return;
    }

    navigate(`/map/${window.location.search}`);
  };

  const cancelList = () => {
    resetDeliveryList();
    navigate(`/map/${window.location.search}`);
  };

  if (!localDeliveryList) {
    return <Navigate to={`/map/${window.location.search}`} />;
  }

  return (
    <section className={styles.finishCurrentListContainer}>
      <div className={styles.finishCurrentList}>
        <h3>Atenção!</h3>

        <p>
          Já existe uma lista sendo reordenada em outra aba. Encerre ela
          primeiro antes de contiuar com a reordenação da lista{" "}
          <strong>{getURLSearchParam("listId")}</strong>
        </p>

        <div className={styles.buttons}>
          <Button
            type="button"
            color="info"
            onClick={tryAgain}
            disabled={isTryAgainBtnDisabled}
          >
            Tentar novamente
          </Button>
          <Button type="button" color="danger" onClick={cancelList}>
            Forçar nova lista
          </Button>
        </div>
      </div>

      <GenericMapBackground />
    </section>
  );
};

export default FinishCurrentListPage;
