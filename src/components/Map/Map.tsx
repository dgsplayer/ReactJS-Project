import { LatLngExpression, Marker as MarkerType } from "leaflet";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { toast } from "react-toastify";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import useGetUsersLocation from "../../hooks/useGetUsersLocation";
import createCustomMarker from "../../util/createCustomMarker";
import getURLSearchParam from "../../util/getURLSearchParam";
import { getLocalStorageItem } from "../../util/manageLocalStorage";
import DeliveryList from "../DeliveryList/DeliveryList";
import Routing from "./Routing/Routing";
import Loading from "../util/Loading/Loading";
import CustomMarkerType from "../../interfaces/types/CustomMarkerType";
import SearchDeliveryList from "../DeliveryList/SearchDeliveryList/SearchDeliveryList";
import CustomMarker from "./CustomMarker/CustomMarker";

interface Props {
  center?: null | LatLngExpression;
  zoom?: number;
  updateMapCenter?: (lat: number, lng: number) => void;
}

/* Component to update de center of the map */
const ChangeView: FC<Props> = ({ center }) => {
  const map = useMap();
  map.setView(center!, map.getZoom(), { animate: true });

  return null;
};

const Map: FC<Props> = ({ zoom }) => {
  const { deliveryList, isLoading, fetchDeliveryList, franchise } =
    useContext(deliveryListContext);
  const [center, setCenter] = useState<null | LatLngExpression>(null);
  const markersRef = useRef<Array<MarkerType | null>>([]);
  const removedMarkersRef = useRef<Array<MarkerType | null>>([]);
  // Keeping track of the last item that was reordered on the
  // Drag & Drop list so when the list is reordered, the map
  // centralizes on its marker
  const [lastReorderedDeliveryIndex, setLastReorderedDeliveryIndex] = useState<
    null | number
  >(null);

  // State to open the delivery list when a marker is clicked
  const [wasMarkerClicked, setWasMarkerClicked] = useState(false);

  // State to track the last clicked marker e pass its hawb
  // to the delivery list component so the corresponding
  // delivery item is highlighted on the list
  const [clickedMarkerHawb, setClickedMarkerHawb] = useState<string | null>(
    null
  );
  // State to track of the last opened marker popup
  const [lastOpenedMarkerIndex, setLastOpenedMarkerIndex] = useState<
    number | null
  >(null);

  const resetWasMarkerClicked = () => {
    setWasMarkerClicked(false);
  };

  const updateClickedMarkerHawb = (hawb: string) => {
    setClickedMarkerHawb(hawb);
  };

  const updateLastReorderedDeliveryIndex = (index: number) => {
    setLastReorderedDeliveryIndex(index);
  };

  const updateLastOpenedMarkerIndex = (index: number) => {
    setLastOpenedMarkerIndex(index);
  };

  const updateMapCenter = useCallback((lat: number, lng: number) => {
    setCenter([lat, lng]);
  }, []);

  const { usersLocation } = useGetUsersLocation(updateMapCenter);

  useEffect(() => {
    const localDeliveryList = getLocalStorageItem("deliveryList");

    if (deliveryList) {
      markersRef.current.forEach((marker) => marker?.closePopup());

      if (lastReorderedDeliveryIndex) {
        updateMapCenter(
          Number(deliveryList[lastReorderedDeliveryIndex].lat),
          Number(deliveryList[lastReorderedDeliveryIndex].lng)
        );
        return;
      }

      updateMapCenter(Number(deliveryList[0].lat), Number(deliveryList[0].lng));
      return;
    }

    if (!deliveryList && !localDeliveryList) {
      const listId = Number(getURLSearchParam("listId"));

      if (listId) {
        if (isNaN(listId)) {
          toast.error("A lista deve ser um número");
          return;
        }

        fetchDeliveryList(listId);
      }
    }
  }, [
    deliveryList,
    updateMapCenter,
    fetchDeliveryList,
    lastReorderedDeliveryIndex,
  ]);

  /* Function to open the list and highlight the delivery
  item that matches the clicked marker */
  const openCorrespondingDeliveryOnList = (
    hawb: string,
    lat: string,
    lng: string,
    index: number
  ) => {
    // Verifying if the delivery is removed or not
    const isDeliveryRemoved = deliveryList!.find(
      (delivery) => delivery.hawb_completa === clickedMarkerHawb
    )?.isRemoved;

    /* Closing the last popup so the maps centralizes on the marker smoothly */
    if (lastOpenedMarkerIndex) {
      if (!isDeliveryRemoved) {
        markersRef.current[lastOpenedMarkerIndex]?.closePopup();
      }

      if (isDeliveryRemoved) {
        removedMarkersRef.current[lastOpenedMarkerIndex]?.closePopup();
      }
    }

    updateMapCenter(Number(lat), Number(lng));

    /* Adding a delay to open the corresponding marker
      popup, so the map closes any other popup tha might be
      opened, centralizes the marker and only then the
      popup opens */
    setTimeout(() => {
      const allMarkers = [
        ...markersRef.current!,
        ...removedMarkersRef.current!,
      ];

      allMarkers
        // @ts-ignore
        .find((marker) => marker?._latlng.lat === Number(lat))
        ?.openPopup();
    }, 300);

    /* Tracking the last clicked marker hawb */
    setWasMarkerClicked(true);
    setClickedMarkerHawb(hawb);
    setLastOpenedMarkerIndex(index);
  };

  return (
    <>
      {deliveryList && franchise ? (
        <MapContainer
          center={
            center
              ? center
              : [Number(deliveryList[0].lat), Number(deliveryList[0].lng)]
          }
          zoom={zoom}
          zoomControl={false}
        >
          {center && <ChangeView center={center} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            icon={createCustomMarker("franchise")}
            position={[Number(franchise.lat), Number(franchise.lng)]}
          >
            <Popup>Franquia {franchise.franquia}</Popup>
          </Marker>

          {deliveryList
            .filter((delivery) => !delivery.isRemoved)
            .map((delivery, index) => {
              let markerType: CustomMarkerType = "blue";

              if (index === 0) {
                markerType = "green";
              }

              if (
                index ===
                deliveryList.filter((delivery) => !delivery.isRemoved).length -
                  1
              ) {
                markerType = "purple";
              }

              if (clickedMarkerHawb === delivery.hawb_completa) {
                markerType = "orange";
              }

              return (
                <CustomMarker
                  key={delivery.hawb_completa}
                  delivery={delivery}
                  markers={markersRef}
                  index={index}
                  openCorrespondingDeliveryOnList={
                    openCorrespondingDeliveryOnList
                  }
                  updateMapCenter={updateMapCenter}
                  markerType={markerType}
                  isRemoved={delivery.isRemoved}
                />
              );
            })}

          {deliveryList
            .filter((delivery) => delivery.isRemoved)
            .map((delivery, index) => {
              let markerType: CustomMarkerType = "red";

              if (clickedMarkerHawb === delivery.hawb_completa) {
                markerType = "orange";
              }

              return (
                <CustomMarker
                  key={delivery.hawb_completa}
                  delivery={delivery}
                  markers={removedMarkersRef}
                  index={index}
                  openCorrespondingDeliveryOnList={
                    openCorrespondingDeliveryOnList
                  }
                  updateMapCenter={updateMapCenter}
                  markerType={markerType}
                  isRemoved={delivery.isRemoved}
                />
              );
            })}

          <Routing />
        </MapContainer>
      ) : (
        <MapContainer
          center={center ? center : [-14.235004, -51.925282]}
          zoom={zoom}
          zoomControl={false}
        >
          {center && <ChangeView center={center} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            icon={createCustomMarker("blue")}
            position={center ? center : [-14.235004, -51.925282]}
          >
            <Popup>
              {usersLocation.length > 0 ? "Você está aqui" : "Brasil"}
            </Popup>
          </Marker>
        </MapContainer>
      )}

      {deliveryList ? (
        <DeliveryList
          updateMapCenter={updateMapCenter}
          usersLocation={usersLocation}
          markers={markersRef.current}
          removedMmarkers={removedMarkersRef.current}
          clickedMarkerHawb={clickedMarkerHawb}
          updateClickedMarkerHawb={updateClickedMarkerHawb}
          wasMarkerClicked={wasMarkerClicked}
          resetWasMarkerClicked={resetWasMarkerClicked}
          lastOpenedMarkerIndex={lastOpenedMarkerIndex}
          updateLastOpenedMarkerIndex={updateLastOpenedMarkerIndex}
          updateLastReorderedDeliveryIndex={updateLastReorderedDeliveryIndex}
        />
      ) : (
        <SearchDeliveryList />
      )}

      {isLoading && <Loading />}
    </>
  );
};

export default Map;
