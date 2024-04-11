export class Merchant {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  pricing: number;
  contact: string;
  shortdes: string;
  status: boolean;

  constructor(
    id: number,
    name: string,
    longitude: number,
    latitude: number,
    pricing: number,
    contact: string,
    shortdes: string,
    status: boolean
  ) {
    this.id = id;
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.pricing = pricing;
    this.contact = contact;
    this.shortdes = shortdes;
    this.status = status;
  }
}