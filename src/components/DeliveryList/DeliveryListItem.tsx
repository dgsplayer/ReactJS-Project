import { Marker } from "leaflet";
import { FC, MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import scrollElementIntoView from "../../util/scrollElementIntoView";
import styles from "./DeliveryListItem.module.scss";
import { Draggable } from "react-beautiful-dnd";
import { ReactComponent as MoveUpIcon } from "../../assets/icons/move_up.svg";
import { ReactComponent as MoveDownIcon } from "../../assets/icons/move_down.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

interface Props {
  index: number;
  address: string;
  hawb: string;
  lat: number;
  lng: number;
  draggable: boolean;
  updateMapCenter: (lat: number, lng: number) => void;
  clickedMarkerHawb?: string | null;
  markers?: (Marker | null)[];
  removedMmarkers?: (Marker | null)[];
  removed?: boolean;
  lastOpenedMarkerIndex?: number | null;
  updateLastOpenedMarkerIndex: (index: number) => void;
  updateClickedMarkerHawb: (hawb: string) => void;
}

const DeliveryListItem: FC<Props> = ({
  index,
  lat,
  lng,
  address,
  hawb,
  draggable,
  updateMapCenter,
  clickedMarkerHawb,
  markers,
  removedMmarkers,
  removed,
  lastOpenedMarkerIndex,
  updateLastOpenedMarkerIndex,
  updateClickedMarkerHawb,
}) => {
  const { deliveryList, toggleIsRemoved, moveDelivery } =
    useContext(deliveryListContext);
  const [lastClickedItem, setLastClickedItem] = useState<HTMLLIElement | null>(
    null
  );
  const deliveryItemRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (clickedMarkerHawb && clickedMarkerHawb === hawb) {
      deliveryItemRef.current?.classList.add(styles.clicked);

      setTimeout(() => {
        scrollElementIntoView(deliveryItemRef.current as HTMLElement);
      }, 150);

      setLastClickedItem(deliveryItemRef.current);
    }
  }, [clickedMarkerHawb, hawb]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (lastClickedItem) {
      timeout = setTimeout(() => {
        lastClickedItem.classList.remove(styles.clicked);
        setLastClickedItem(null);
      }, 1200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [lastClickedItem]);

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    if (!removed) {
      if (lastOpenedMarkerIndex) {
        markers?.[lastOpenedMarkerIndex]?.closePopup();
      }

      updateMapCenter(lat, lng);

      /* Adding a delay to open the corresponding marker
      popup, so the map closes any other popup tha might be
      opened, centralizes the marker and only then the
      popup opens */
      setTimeout(() => {
        markers![index]?.openPopup();
      }, 300);
    }

    if (removed) {
      if (lastOpenedMarkerIndex) {
        removedMmarkers?.[lastOpenedMarkerIndex]?.closePopup();
      }

      updateMapCenter(lat, lng);

      /* Adding a delay to open the corresponding marker
      popup, so the map closes any other popup tha might be
      opened, centralizes the marker and only then the
      popup opens */
      setTimeout(() => {
        removedMmarkers![index]?.openPopup();
      }, 300);
    }

    e.currentTarget.classList.add(styles.clicked);
    setLastClickedItem(e.currentTarget);

    updateLastOpenedMarkerIndex(index);
    updateClickedMarkerHawb(hawb);

    scrollElementIntoView(e.currentTarget);
  };

  if (draggable) {
    return (
      <Draggable key={hawb} draggableId={hawb} index={index}>
        {(provided, snapshot) => (
          <li
            ref={(element) => {
              provided.innerRef(element);
              deliveryItemRef.current = element;
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.deliveryListItem} ${
              snapshot.isDragging && styles.isDragging
            } ${styles.draggable}`}
            onClick={onClick}
            title="Ver no mapa"
            draggable={draggable}
          >
            <span>{index + 1}</span>

            <div className={styles.deliveryInfo}>
              <p>{address}</p>
              <p>HAWB: {hawb}</p>
            </div>

            <div className={styles.reorderBtns}>
              {index !== 0 && (
                <span
                  className={`${styles.moveUp} `}
                  onClick={() => {
                    markers?.forEach((marker) => marker?.closePopup());
                    updateMapCenter(lat, lng);
                    moveDelivery(hawb, "top");
                  }}
                  title="Mover para o topo da lista"
                >
                  <MoveUpIcon />
                </span>
              )}

              {deliveryList!.filter((delivery) => !delivery.isRemoved).length -
                1 !==
                index && (
                <span
                  className={`${styles.moveDown} `}
                  onClick={() => {
                    markers![index]?.openPopup();
                    updateMapCenter(lat, lng);
                    moveDelivery(hawb, "bottom");
                  }}
                  title="Mover para o final da lista"
                >
                  <MoveDownIcon />
                </span>
              )}
            </div>
          </li>
        )}
      </Draggable>
    );
  }

  return (
    <li
      ref={deliveryItemRef}
      className={`${styles.deliveryListItem} ${removed && `${styles.removed}`}`}
      onClick={onClick}
      title="Ver no mapa"
    >
      <span>{index + 1}</span>

      <div className={styles.deliveryInfo}>
        <p>{address}</p>
        <p>HAWB: {hawb}</p>
      </div>

      <span
        className={`${styles.unremoveDelivery} `}
        onClick={() => toggleIsRemoved(hawb, false)}
        title="Inserir novamente na lista"
      >
        <CloseIcon />
      </span>
    </li>
  );
};

export default DeliveryListItem;
