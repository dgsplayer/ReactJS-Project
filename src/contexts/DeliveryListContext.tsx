import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DeliveryList } from "../interfaces/DeliveryList";
import makeRequest from "../services/makeRequest";
import { toast } from "react-toastify";
import RouteDetails from "../interfaces/RouteDetails";
import {
  getLocalStorageItem,
  removeAllLocalStorageItems,
  setLocalStorageItem,
} from "../util/manageLocalStorage";
import getRoutedDeliveryList from "../util/getRoutedDeliveryList";
import { Franchise } from "../interfaces/Franchise";
import { getCookie } from "../util/manageCookies";
import calculateDistanceBetweenTwoPoints from "../util/calculateDistanceBetweenTwoPoints";

interface DeliveryListContext {
  franchise: null | Franchise;
  routeDetails: null | RouteDetails[];
  deliveryList: null | DeliveryList;
  updateDeliveryList: (deliveryList: DeliveryList) => void;
  isLoading: boolean;
  error: null | any;
  fetchDeliveryList: (id: number) => void;
  toggleIsRemoved: (hawb: string, isRemoved: boolean) => void;
  resetDeliveryList: () => void;
  routeDeliveryList: (deliveryList: DeliveryList) => void;
  moveDelivery: (hawb: string, to: "top" | "bottom") => void;
  saveReorderedList: () => void;
}

interface Props {
  children: ReactNode;
}

export const deliveryListContext = createContext({} as DeliveryListContext);

const DeliveryListProvider = ({ children }: Props) => {
  const [franchise, setFranchise] = useState<null | Franchise>(null);
  const [routeDetails, setRouteDetails] = useState<null | RouteDetails[]>(null);
  const [deliveryList, setDeliveryList] = useState<null | DeliveryList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | any>(null);

  /* Effect to check if there's an delivery in progress already
  on the local storage */
  useEffect(() => {
    const franchise = getLocalStorageItem("franchise");
    const routeDetails = getLocalStorageItem("routeDetails");
    const deliveryList = getLocalStorageItem("deliveryList");

    if (franchise) {
      setFranchise(franchise);
    }

    if (routeDetails) {
      setRouteDetails(routeDetails);
    }

    if (deliveryList) {
      setDeliveryList(deliveryList);
    }
  }, []);

  const updateDeliveryList = (deliveryList: DeliveryList) => {
    setDeliveryList(deliveryList);

    setLocalStorageItem("deliveryList", deliveryList);
  };

  const fetchDeliveryList = useCallback(async (id: number) => {
    try {
      setIsLoading(true);

      /* First request to get the list with the hawbs to be delivered */
      const deliveryList = await makeRequest<DeliveryList>({
        url: `${process.env.REACT_APP_ROTAS_PEGASUS_BASE_URL}lista-entrega/${id}/data-for-map`,
        method: "get",
        options: {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        },
      });

      if (deliveryList.hasOwnProperty("error")) {
        const errorMessage =
          deliveryList.error.response.data[0]?.mensagemUsuario;

        if (errorMessage) {
          throw new Error(errorMessage);
        }

        throw new Error("Não foi possível encontrar a lista!");
      }

      // Accessing the franchise data
      const franchise = {
        franquia: deliveryList.franquia,
        lat: deliveryList.lat,
        lng: deliveryList.lng,
        endereco: deliveryList.endereco,
      };

      const routedDeliveryList = await getRoutedDeliveryList(
        franchise,
        deliveryList.hawbs,
        true
      );

      if (routedDeliveryList === null) {
        throw new Error("Erro ao roteirizar as HAWBs!");
      }

      /* Saving the data on local storage */
      setLocalStorageItem(
        "deliveryList",
        routedDeliveryList.routedDeliveryList
      );
      setLocalStorageItem("routeDetails", routedDeliveryList.routeDetails);
      setLocalStorageItem("listId", id);
      setLocalStorageItem("franchise", franchise);

      setFranchise(franchise);
      setDeliveryList(routedDeliveryList.routedDeliveryList);
      setRouteDetails(routedDeliveryList.routeDetails);
      setError(null);

      toast.success("Rotas calculadas!", {
        toastId: "calculatedRoutes",
      });
    } catch (e: any) {
      setDeliveryList(null);
      setRouteDetails(null);
      setFranchise(null);
      setError(e.message);

      toast.error(e.message, {
        toastId: "errorFetchList",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const routeDeliveryList = async (deliveryList: DeliveryList) => {
    try {
      const franchise = getLocalStorageItem("franchise");
      setIsLoading(true);
      toast.dismiss();

      const response = await getRoutedDeliveryList(
        franchise,
        deliveryList,
        false
      );

      if (response === null) {
        throw new Error("Erro ao roteirizar as HAWBs!");
      }

      const { routeDetails, routedDeliveryList } = response;

      /* Saving the data on local storage */
      setLocalStorageItem("routeDetails", routeDetails);
      setLocalStorageItem("deliveryList", routedDeliveryList);

      setRouteDetails(routeDetails);
      setDeliveryList(routedDeliveryList);
      setError(null);

      toast.success("Rotas recalculadas!", {
        toastId: "recalculatedRoutes",
      });
    } catch (e: any) {
      setRouteDetails(null);
      setError(e.message);

      toast.error(e.message, {
        toastId: "errorFetchList",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle the isRemoved status of a delivery
  const toggleIsRemoved = (hawb: string, isRemoved: boolean) => {
    const newDeliveryList = Array.from(deliveryList!);
    const removedDeliveryIndex = newDeliveryList.findIndex(
      (delivery) => delivery.hawb_completa === hawb
    );

    newDeliveryList[removedDeliveryIndex].isRemoved = isRemoved;
    const [removedDelivery] = newDeliveryList.splice(removedDeliveryIndex, 1);
    newDeliveryList.push(removedDelivery);

    setLocalStorageItem("deliveryList", newDeliveryList);
    setDeliveryList(newDeliveryList);
  };

  // Function to move a delivery to the top or bottom of the list
  const moveDelivery = (hawb: string, to: "top" | "bottom") => {
    const newDeliveryList = Array.from(deliveryList!);
    const movedDeliveryIndex = newDeliveryList.findIndex(
      (delivery) => delivery.hawb_completa === hawb
    );
    const [movedDelivery] = newDeliveryList.splice(movedDeliveryIndex, 1);

    if (to === "top") {
      newDeliveryList.unshift(movedDelivery);
    }

    if (to === "bottom") {
      newDeliveryList.push(movedDelivery);
    }

    setLocalStorageItem("deliveryList", newDeliveryList);
    setDeliveryList(newDeliveryList);
  };

  /* Function to reset the delivery list */
  const resetDeliveryList = useCallback(() => {
    setDeliveryList(null);
    setRouteDetails(null);
    setFranchise(null);
    removeAllLocalStorageItems([
      "deliveryList",
      "routeDetails",
      "listId",
      "franchise",
    ]);
  }, []);

  // Check if lat lng is from Brazil
  const verificarCoordenadas = ( lat: number,  long: number) => {
    const latitudeMinima = -33.750666;
    const latitudeMaxima = -5.264877;
    const longitudeMinima = -73.965370;
    const longitudeMaxima = -34.793361;
  
    if (lat >= latitudeMinima && lat <= latitudeMaxima &&
        long >= longitudeMinima && long <= longitudeMaxima) {
      return true;
    } else {
      return false;
    }
  }

  // Function to save the reordered delivery list on
  // the pegasus backend
  const saveReorderedList = async () => {
    try {
      setIsLoading(true);
      const listId = getLocalStorageItem("listId");
 
      let latvalue = 0;
      let lngvalue = 0;
      const reorderedList = deliveryList!.map((delivery, index) => {
        let position = index + 1;
        let distance = 0;
 
        console.log(position, '<', deliveryList!.length);
        if(position < deliveryList!.length ){
          
          if(delivery.lat && delivery.lng && deliveryList![position].lat && deliveryList![position].lng)
           if( verificarCoordenadas(Number(delivery.lat),Number(delivery.lng)) && verificarCoordenadas(Number(deliveryList![position].lat),Number(deliveryList![position].lng))){
            distance = calculateDistanceBetweenTwoPoints(
              {
                lat: Number(delivery.lat),
                lng: Number(delivery.lng),
              },
              { lat: Number(deliveryList![position].lat), lng: Number(deliveryList![position].lng) },
              "K"
            );
            distance = parseFloat(distance.toFixed(8))
           }
              
              console.log('Distancia Job Antes: ',delivery.lat,delivery.lng)
              console.log('Distancia Job Atual: ',deliveryList![position].lat,deliveryList![position].lng)
              console.log('Distancia Job : ',distance)
              // if(delivery.lng && delivery.lat){
                console.log('Setei latvalue e lngvalue')
                latvalue = Number(delivery.lat);
                lngvalue = Number(delivery.lng);
              // }
              

        }else{
          const franchise = getLocalStorageItem("franchise");
          if(latvalue && lngvalue && franchise.lat && franchise.lng)
            if( verificarCoordenadas(Number(franchise.lat),Number(franchise.lng)) && verificarCoordenadas(latvalue,lngvalue)){
              distance = calculateDistanceBetweenTwoPoints(
                {
                  lat: Number(latvalue),
                  lng: Number(lngvalue),
                },
                { lat: Number(franchise.lat), lng: Number(franchise.lng) },
                "K"
              );
              distance = parseFloat(distance.toFixed(8))
            }
              
            console.log('Distancia Franquia Último Job: ',latvalue,lngvalue)
            console.log('Distancia Franquia Atual: ',franchise.lat, franchise.lng)
            console.log('Distancia Franquia : ',distance)
        }
          
 
        if (delivery.isRemoved) {
          position = 0;
        }

        return {
          hawb_completa: delivery.hawb_completa,
          distancia_km: distance,
          position,
        };
      });

      
      const response = await makeRequest({
        url: `${process.env.REACT_APP_ROTAS_PEGASUS_BASE_URL}lista-entrega/${listId}/order`,
        method: "post",
        options: {
          params: { list: reorderedList },
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        },
      });

      if (response.hasOwnProperty("error")) {
        const errorMessage = response.error.response.data[0]?.mensagemUsuario;

        if (errorMessage) {
          throw new Error(errorMessage);
        }

        throw new Error("Não foi possível salvar a nova reordenação da lista!");
      }

      setError(null);
      setDeliveryList(null);
      setRouteDetails(null);
      setFranchise(null);

      removeAllLocalStorageItems([
        "deliveryList",
        "routeDetails",
        "listId",
        "franchise",
      ]);
      toast.dismiss();
      toast.success("Lista reordenada salva com sucesso!", {
        autoClose: false,
      });
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <deliveryListContext.Provider
      value={{
        franchise,
        routeDetails,
        deliveryList,
        updateDeliveryList,
        isLoading,
        error,
        fetchDeliveryList,
        toggleIsRemoved,
        resetDeliveryList,
        routeDeliveryList,
        moveDelivery,
        saveReorderedList,
      }}
    >
      {children}
    </deliveryListContext.Provider>
  );
};

export default DeliveryListProvider;
