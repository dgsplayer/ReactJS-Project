import { AnimatePresence } from "framer-motion";
import { FC, useContext, useState } from "react";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import Button from "../util/Button/Button";
import Modal from "../util/Modal/Modal";
import styles from "./PopupContent.module.scss";

interface Props {
  endereco: string;
  hawb: string;
  isRemoved: boolean;
  dragMarker: boolean;
  startDraggingMarker: () => void;
  cancelRepositioning: () => void;
  confirmNewMarkerPosition: () => void;
  newLatLng: [number, number] | null;
}

const PopupContent: FC<Props> = ({
  endereco,
  hawb,
  isRemoved,
  dragMarker,
  startDraggingMarker,
  cancelRepositioning,
  confirmNewMarkerPosition,
  newLatLng,
}) => {
  const { toggleIsRemoved } = useContext(deliveryListContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.popupContent}>
        {dragMarker ? (
          <p>Arraste o marcador para reposicioná-lo</p>
        ) : (
          <>
            <p>{endereco}</p>
            <p>HAWB: {hawb}</p>
          </>
        )}

        <div className={styles.popupFooter}>
          {dragMarker ? (
            <div className={styles.buttons}>
              <Button
                type="button"
                color="danger"
                onClick={cancelRepositioning}
              >
                Cancelar reposicionamento
              </Button>

              {newLatLng && (
                <Button
                  type="button"
                  color="success"
                  onClick={confirmNewMarkerPosition}
                >
                  Confirmar posição
                </Button>
              )}
            </div>
          ) : (
            <>
              {isRemoved ? (
                <div className={styles.buttons}>
                  <Button type="button" color="info" onClick={openModal}>
                    Inserir documento na lista
                  </Button>
                  <Button
                    type="button"
                    color="success"
                    onClick={startDraggingMarker}
                  >
                    Reposicionar
                  </Button>
                </div>
              ) : (
                <div className={styles.buttons}>
                  <Button type="button" color="danger" onClick={openModal}>
                    Enviar ao final da lista
                  </Button>
                  <Button
                    type="button"
                    color="success"
                    onClick={startDraggingMarker}
                  >
                    Reposicionar
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal closeModal={closeModal} padding={true}>
            <div className="modalContent">
              <h3>Atenção</h3>

              <p>
                {isRemoved
                  ? "Deseja inserir novamente esse documento na lista?"
                  : "Esse documento será adicionado ao final da lista quando a reordenação for salva. Deseja continuar?"}
              </p>

              <span className="divider"></span>

              <div>
                <Button type="button" color="danger" onClick={closeModal}>
                  Não
                </Button>

                <Button
                  type="button"
                  color="success"
                  onClick={() => {
                    toggleIsRemoved(hawb, !isRemoved);
                    closeModal();
                  }}
                >
                  Sim
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default PopupContent;
