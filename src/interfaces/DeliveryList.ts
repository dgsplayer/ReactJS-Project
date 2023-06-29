export interface DeliveryItem {
  hawb_completa: string;
  num_enc_cli: string;
  lat: string;
  lng: string;
  endereco: string;
  isRemoved: boolean;
}

export type DeliveryList = DeliveryItem[];
