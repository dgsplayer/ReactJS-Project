import { Marker, Popup } from "react-leaflet";
import { DeliveryItem } from "../../../interfaces/DeliveryList";
import createCustomIconMarker from "../../../util/createCustomMarker";
import { useContext, useState, FC, MutableRefObject } from "react";
import PopupContent from "../../PopupContent/PopupContent";
import { DragEndEvent, Marker as MarkerType } from "leaflet";
import { deliveryListContext } from "../../../contexts/DeliveryListContext";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import Modal from "../../util/Modal/Modal";
import Button from "../../util/Button/Button";
import CustomMarkerType from "../../../interfaces/types/CustomMarkerType";

interface Props {
  delivery: DeliveryItem;
  markers: MutableRefObject<(MarkerType<any> | null)[]>;
  index: number;
  openCorrespondingDeliveryOnList: (
    hawb: string,
    lat: string,
    lng: string,
    index: number
  ) => void;
  updateMapCenter: (lat: number, lng: number) => void;
  markerType: CustomMarkerType;
  isRemoved: boolean;
}

const CustomMarker: FC<Props> = ({
  delivery,
  markers,
  index,
  openCorrespondingDeliveryOnList,
  updateMapCenter,
  markerType,
  isRemoved,
}) => {
  const { deliveryList, updateDeliveryList } = useContext(deliveryListContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLatLng, setNewLatLng] = useState<[number, number] | null>(null);
  const [dragMarker, setDragMarker] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const startDraggingMarker = () => setDragMarker(true);
  const stopDraggingMarker = () => setDragMarker(false);

  const updateDeliveryLatLng = (
    lat: string,
    lng: string,
    confirmPosition?: boolean
  ) => {
    const newDeliveryList = Array.from(deliveryList!);
    const draggedDeliveryMarkerIndex = newDeliveryList.findIndex(
      (deliveryItem) => deliveryItem.hawb_completa === delivery.hawb_completa
    )!;
    const [draggedDeliveryMarker] = newDeliveryList.splice(
      draggedDeliveryMarkerIndex,
      1
    );

    if (confirmPosition) {
      draggedDeliveryMarker.lat = lat;
      draggedDeliveryMarker.lng = lng;
    }

    draggedDeliveryMarker.isRemoved = confirmPosition ? false : isRemoved;
    newDeliveryList.push(draggedDeliveryMarker);

    updateDeliveryList(newDeliveryList);
  };

  const onDragEnd = (e: DragEndEvent) => {
    openModal();
    setNewLatLng([e.target._latlng.lat, e.target._latlng.lng]);
  };

  const cancelRepositioning = () => {
    setNewLatLng(null);
    closeModal();
    stopDraggingMarker();
  };

  const continueRepositioning = () => {
    updateDeliveryLatLng(String(newLatLng![0]), String(newLatLng![1]));

    setTimeout(() => {
      updateMapCenter(newLatLng![0], newLatLng![1]);
    }, 300);

    closeModal();
  };

  const confirmNewMarkerPosition = () => {
    updateDeliveryLatLng(String(newLatLng![0]), String(newLatLng![1]), true);
    setNewLatLng(null);
    stopDraggingMarker();
    closeModal();

    toast.success(`Posição da HAWB ${delivery.hawb_completa} atualizada!`);
  };

  return (
    <>
      <Marker
        ref={(el) => (markers.current[index] = el)}
        icon={createCustomIconMarker(
          dragMarker ? "grey" : markerType,
          isRemoved ? undefined : index
        )}
        position={
          newLatLng ? newLatLng : [Number(delivery.lat), Number(delivery.lng)]
        }
        draggable={dragMarker}
        autoPan={true}
        zIndexOffset={dragMarker ? 100 : undefined}
        eventHandlers={{
          dragend: onDragEnd,
          click: () =>
            openCorrespondingDeliveryOnList(
              delivery.hawb_completa,
              newLatLng ? String(newLatLng[0]) : delivery.lat,
              newLatLng ? String(newLatLng[1]) : delivery.lng,
              index
            ),
        }}
      >
        <Popup>
          <PopupContent
            endereco={delivery.endereco}
            hawb={delivery.hawb_completa}
            isRemoved={delivery.isRemoved}
            dragMarker={dragMarker}
            startDraggingMarker={startDraggingMarker}
            cancelRepositioning={cancelRepositioning}
            confirmNewMarkerPosition={confirmNewMarkerPosition}
            newLatLng={newLatLng}
          />
        </Popup>
      </Marker>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            closeModal={() => {
              cancelRepositioning();
              closeModal();
            }}
            padding={true}
          >
            <div className="modalContent">
              <h3>Atenção</h3>

              <p>
                Deseja cancelar, continuar reposicionando o marcador ou
                inseri-ló na lista nessa posição?
              </p>

              <span className="divider"></span>

              <div>
                <Button
                  type="button"
                  color="danger"
                  onClick={cancelRepositioning}
                >
                  Cancelar reposicionamento
                </Button>
                <Button
                  type="button"
                  color="info"
                  onClick={continueRepositioning}
                >
                  Continuar reposicionando
                </Button>
                <Button
                  type="button"
                  color="success"
                  onClick={confirmNewMarkerPosition}
                >
                  Confirmar posição
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomMarker;
