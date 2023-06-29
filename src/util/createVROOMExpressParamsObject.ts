import { DeliveryItem, DeliveryList } from "../interfaces/DeliveryList";
import { Franchise } from "../interfaces/Franchise";

/* Function to create and format the params object required
by the VROOM Express API to route the deliveries */
const createVROOMExpressParamsObject = (
  franchise: Franchise,
  deliveryList: DeliveryList,
  listId?: number
) => {
  const vehicles = [
    {
      id: 1,
      start: [Number(franchise.lng), Number(franchise.lat)],
      end: [Number(franchise.lng), Number(franchise.lat)],
      capacity: [1000],
      skills: [1, 14],
    },
  ];

  const jobs = [
    ...deliveryList.map((delivery: DeliveryItem, index: number) => ({
      id: index + 1,
      delivery: [1],
      location: [Number(delivery.lng), Number(delivery.lat)],
      skills: [1],
      description: delivery.endereco,
    })),
  ];

  return { lista_id: listId, vehicles, jobs };
};

export default createVROOMExpressParamsObject;
