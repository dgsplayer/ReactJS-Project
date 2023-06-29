export default interface RoutedDeliveryList {
  code: number;
  summary: {
    cost: number;
    unassigned: number;
    delivery: number[];
    amount: number[];
    pickup: number[];
    service: number;
    duration: number;
    waiting_time: number;
    computing_times: {
      loading: number;
      solving: number;
    };
  };
  unassigned: never[];
  routes: [
    {
      vehicle: number;
      cost: number;
      delivery: number[];
      amount: number[];
      pickup: number[];
      service: number;
      duration: number;
      waiting_time: number;
      steps: {
        type: string;
        location: number[];
        load: number[];
        arrival: number;
        duration: number;
        job?: number;
        service?: number;
        waiting_time?: number;
      }[];
    }
  ];
}
