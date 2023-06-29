import { useCallback, useEffect, useState } from "react";
import { getLocalStorageItem } from "../util/manageLocalStorage";

const useGetUsersLocation = (
  updateMapCenter?: (lat: number, lng: number) => void
) => {
  const [usersLocation, setUsersLocation] = useState([] as number[]);

  const onSuccess = useCallback(
    (geolocation: GeolocationPosition) => {
      const localDeliveryList = getLocalStorageItem("deliveryList");

      const { latitude, longitude } = geolocation.coords;

      setUsersLocation([latitude, longitude]);

      if (!localDeliveryList && updateMapCenter) {
        updateMapCenter(latitude, longitude);
      }
    },
    [updateMapCenter]
  );

  const updateUsersLocation = useCallback(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(onSuccess);
    }
  }, [onSuccess]);

  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(onSuccess);
    }
  }, [onSuccess]);

  return { usersLocation, updateUsersLocation };
};

export default useGetUsersLocation;
