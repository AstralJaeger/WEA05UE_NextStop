export interface Coordinates {
  latitude: number;
  longitude: number
}

export interface StopPoint {
  id: number;
  name: string;
  shortName: string
  location: Coordinates
}

export interface StopPointForUpdate {
  name: string;
  shortName: string
  location: Coordinates
}
