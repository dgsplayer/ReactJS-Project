import { FC, useContext, useEffect, useMemo, useState } from "react";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import styles from "./DeliveryList.module.scss";
import DeliveryListItem from "./DeliveryListItem";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Modal from "../util/Modal/Modal";
import Button from "../util/Button/Button";
import { toast } from "react-toastify";
import { Marker } from "leaflet";
import {
  Combine,
  DragDropContext,
  DraggableId,
  DraggableLocation,
} from "react-beautiful-dnd";
import StrictModeDroppable from "../util/StrictMode/StrictModeDroppable";
import vibratePhone from "../../util/vibratePhone";
import getURLSearchParam from "../../util/getURLSearchParam";
import { ReactComponent as ExpandLessIcon } from "../../assets/icons/expand_less.svg";
import { ReactComponent as ExpandMoreIcon } from "../../assets/icons/expand_more.svg";
import { getLocalStorageItem } from "../../util/manageLocalStorage";
import { useNavigate } from "react-router-dom";

interface Props {
  updateMapCenter: (lat: number, lng: number) => void;
  usersLocation: number[];
  markers: (Marker | null)[];
  removedMmarkers: (Marker | null)[];
  wasMarkerClicked: boolean;
  resetWasMarkerClicked: () => void;
  clickedMarkerHawb: string | null;
  updateLastReorderedDeliveryIndex: (index: number) => void;
  lastOpenedMarkerIndex: number | null;
  updateLastOpenedMarkerIndex: (index: number) => void;
  updateClickedMarkerHawb: (hawb: string) => void;
}

interface DragResult {
  reason: "DROP" | "CANCEL";
  destination?: DraggableLocation;
  source: DraggableLocation;
  combine?: Combine;
  mode: "FLUID" | "SNAP";
  draggableId: DraggableId;
}

const DeliveryList: FC<Props> = ({
  updateMapCenter,
  usersLocation,
  markers,
  removedMmarkers,
  wasMarkerClicked,
  resetWasMarkerClicked,
  clickedMarkerHawb,
  updateLastReorderedDeliveryIndex,
  lastOpenedMarkerIndex,
  updateLastOpenedMarkerIndex,
  updateClickedMarkerHawb,
}) => {
  const { deliveryList, resetDeliveryList, updateDeliveryList } =
    useContext(deliveryListContext);
  const [displayFullList, setDisplayFullList] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const animation = useAnimation();
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /* Animations to open and close the list */
  const animations = useMemo(() => {
    return {
      growFromBottom: {
        initial: { height: "50px", transformOrigin: "bottom" },
        start: { height: "95vh", overflow: "auto" },
      },
      shrinkFromBottom: {
        initial: { height: "95vh", transformOrigin: "bottom" },
        start: { height: "50px", overflow: "hidden" },
      },
    };
  }, []);

  const toggleDeliveryList = () => {
    setDisplayFullList((state) => !state);
  };

  useEffect(() => {
    /* Opening the list when a marker is clicked */
    if (wasMarkerClicked && displayFullList === false) {
      toggleDeliveryList();
      return;
    }

    if (wasMarkerClicked) {
      resetWasMarkerClicked();
    }

    /* Animating the opening and closing of the list */
    if (displayFullList) {
      animation.start(animations.growFromBottom.start);
      return;
    }

    animation.start(animations.shrinkFromBottom.start);
  }, [
    displayFullList,
    animation,
    animations,
    markers,
    wasMarkerClicked,
    resetWasMarkerClicked,
  ]);

  /* Function that resets the current delivery list */
  const handleFinishList = () => {
    const coords =
      usersLocation.length > 0 ? usersLocation : [-23.55052, -46.633308];

    resetDeliveryList();
    updateMapCenter(coords[0], coords[1]);
    closeModal();
    toast.dismiss();
    toast.error("Reordenaçao cancelada!", { autoClose: false });
    navigate("/list-finished");
  };

  /* Function to handle the onDragEnd event on the delivery list
  and reorder the list accordingly */
  const reorderDeliveryList = (result: DragResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newDeliveryList = Array.from(
      deliveryList!.filter((delivery) => !delivery.isRemoved)
    );
    const [draggedDelivery] = newDeliveryList.splice(result.source.index, 1);

    newDeliveryList.splice(result.destination.index, 0, draggedDelivery);

    updateDeliveryList([
      ...newDeliveryList!,
      ...deliveryList!.filter((delivery) => delivery.isRemoved),
    ]);

    updateLastReorderedDeliveryIndex(result.destination.index);

    toast.success("Entregas reordenadas!");
  };

  return (
    <>
      <motion.div
        initial={
          displayFullList
            ? animations.growFromBottom.initial
            : animations.shrinkFromBottom.initial
        }
        animate={animation}
        transition={{
          type: "spring",
          duration: 0.5,
        }}
        className={styles.deliveryListContainer}
      >
        <div className={styles.deliveryListHeader} onClick={toggleDeliveryList}>
          <span className={styles.toggleDeliveryList}>
            {displayFullList ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </span>
        </div>

        {deliveryList && (
          <>
            <DragDropContext
              onDragEnd={reorderDeliveryList}
              onDragStart={vibratePhone}
            >
              <StrictModeDroppable droppableId="deliveries">
                {(provided, snapshot) => (
                  <>
                    <h3>
                      Lista {getLocalStorageItem("listId")} -{" "}
                      {deliveryList.length} HAWBs
                    </h3>

                    <p>Segure e arraste os itens para reordenar</p>

                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`${styles.deliveryList} ${
                        snapshot.isDraggingOver && styles.draggingOver
                      }`}
                    >
                      <p>
                        {deliveryList.filter((delivery) => !delivery.isRemoved)
                          .length > 0
                          ? "HAWBs a serem entregues"
                          : "Nenhuma HAWB será entregue"}
                      </p>

                      {deliveryList
                        .filter((delivery) => !delivery.isRemoved)
                        .map((delivery, index) => (
                          <DeliveryListItem
                            key={delivery.hawb_completa}
                            index={index}
                            address={delivery.endereco}
                            hawb={delivery.hawb_completa}
                            lat={Number(delivery.lat)}
                            lng={Number(delivery.lng)}
                            draggable={true}
                            updateMapCenter={updateMapCenter}
                            markers={markers}
                            clickedMarkerHawb={clickedMarkerHawb}
                            lastOpenedMarkerIndex={lastOpenedMarkerIndex}
                            updateLastOpenedMarkerIndex={
                              updateLastOpenedMarkerIndex
                            }
                            updateClickedMarkerHawb={updateClickedMarkerHawb}
                          />
                        ))}

                      {provided.placeholder}

                      <div className={styles.finishList}>
                        <Button
                          type="button"
                          color="danger"
                          onClick={openModal}
                        >
                          Cancelar reordenação
                        </Button>
                      </div>
                    </ul>
                  </>
                )}
              </StrictModeDroppable>
            </DragDropContext>

            {deliveryList.filter((delivery) => delivery.isRemoved).length >
              0 && (
              <>
                <ul className={styles.deliveryList}>
                  <p className={styles.removedDelivery}>
                    HAWBs incorretamente geo posicionadas
                  </p>

                  <p className={styles.observation}>
                    * Arraste o marcador no mapa para reposicionar as HAWBs que
                    estão removidas
                  </p>

                  {deliveryList
                    .filter((delivery) => delivery.isRemoved)
                    .map((delivery, index) => (
                      <DeliveryListItem
                        key={delivery.hawb_completa}
                        index={index}
                        address={delivery.endereco}
                        hawb={delivery.hawb_completa}
                        lat={Number(delivery.lat)}
                        lng={Number(delivery.lng)}
                        draggable={false}
                        updateMapCenter={updateMapCenter}
                        removed={true}
                        removedMmarkers={removedMmarkers}
                        clickedMarkerHawb={clickedMarkerHawb}
                        lastOpenedMarkerIndex={lastOpenedMarkerIndex}
                        updateLastOpenedMarkerIndex={
                          updateLastOpenedMarkerIndex
                        }
                        updateClickedMarkerHawb={updateClickedMarkerHawb}
                      />
                    ))}
                </ul>
              </>
            )}
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {deliveryList && isModalOpen && (
          <Modal closeModal={closeModal} padding={true}>
            <div className="modalContent">
              <h3>Atenção</h3>

              {getURLSearchParam("listId") ? (
                <p>
                  Deseja realmente cancelar a reordenação da lista{" "}
                  <strong>{getURLSearchParam("listId")}</strong>?
                </p>
              ) : (
                <p>Deseja realmente cancelar a reordenação da lista?</p>
              )}

              <span className="divider"></span>

              <div>
                <Button type="button" color="danger" onClick={closeModal}>
                  Fechar
                </Button>

                <Button type="button" color="info" onClick={handleFinishList}>
                  Cancelar reordenação
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeliveryList;
