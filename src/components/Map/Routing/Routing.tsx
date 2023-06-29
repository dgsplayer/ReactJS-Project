import { useContext, useEffect } from "react";
import { useMap } from "react-leaflet";
import { deliveryListContext } from "../../../contexts/DeliveryListContext";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const Routing = () => {
  const { deliveryList, franchise } = useContext(deliveryListContext);
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const goingWaypoints: L.LatLng[] = [];

    goingWaypoints.push(
      L.latLng(Number(franchise!.lat), Number(franchise!.lng))
    );

    deliveryList!.forEach((delivery) => {
      if (!delivery.isRemoved) {
        goingWaypoints.push(
          L.latLng(Number(delivery.lat), Number(delivery.lng))
        );
      }
    });

    const goingRoute = L.Routing.control({
      waypoints: goingWaypoints,
      lineOptions: {
        styles: [
          {
            color: "blue",
            weight: 3,
          },
        ],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false,
      // @ts-ignore
      serviceUrl: "https://rotasapi.flashcourier.com.br/route/v1",
      createMarker: () => null,
    }).addTo(map);

    const returnDeliveryList = deliveryList!.filter(
      (delivery) => !delivery.isRemoved
    );
    let returnRoute: L.Routing.Control | null = null;

    if (returnDeliveryList.length > 0) {
      const lastDelivery = returnDeliveryList!.pop();

      const returnWaypoints = [
        L.latLng(Number(lastDelivery!.lat), Number(lastDelivery!.lng)),
        L.latLng(Number(franchise!.lat), Number(franchise!.lng)),
      ];

      returnRoute = L.Routing.control({
        waypoints: returnWaypoints,
        lineOptions: {
          styles: [
            {
              color: "red",
              weight: 3,
            },
          ],
          extendToWaypoints: false,
          missingRouteTolerance: 0,
        },
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: false,
        // @ts-ignore
        serviceUrl: "https://rotasapi.flashcourier.com.br/route/v1",
        createMarker: () => null,
      }).addTo(map);
    }

    return () => {
      if (map) {
        map.removeControl(goingRoute);

        if (returnRoute) {
          map.removeControl(returnRoute);
        }
      }
    };
  }, [map, deliveryList, franchise]);

  return null;
};

export default Routing;
