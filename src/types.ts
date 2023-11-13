import { calculateDuration } from "./utils";

export type APIResponse<T> = {
    data: T[]
};

export type Itinerary = {
    id: number;
    title: string;
    destination: string;
    enriched_info: string|null;
    enriched_image: string|null; 
    trip_start: Date;
    trip_end: Date;
    items: ItineraryItem[];
    // added on client side
    duration: number,
    time_to_departure: number, 
};
  
export type ItineraryItem = {
    id: number,
    description: string
};


export type RawItinerary = {
    id: number;
    title: string;
    destination: string;
    enriched_info: string|null;
    enriched_image: string|null; 
    trip_start: string;
    trip_end: string;
    items: ItineraryItem[];
};
  

export const transformItinerary = (rawItinerary: RawItinerary): Itinerary => {
    const tripStart = new Date(rawItinerary.trip_start);
    const tripEnd = new Date(rawItinerary.trip_end);
    const today = new Date();
    const timeToDeparture = calculateDuration(today, tripStart);
    
    return {
      ...rawItinerary,
      trip_start: tripStart,
      trip_end: tripEnd,
      duration: calculateDuration(tripStart, tripEnd),
      time_to_departure: timeToDeparture,
    };
  };
  