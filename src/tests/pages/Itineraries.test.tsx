import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Itineraries from '../../pages/Itineraries';
import { Itinerary } from '../../types';
import { calculateDuration } from '../../utils';

// Mock Itineraries


// export type Itinerary = {
//   id: number;
//   title: string;
//   destination: string;
//   enriched_info: string|null;
//   enriched_image: string|null; 
//   trip_start: Date;
//   trip_end: Date;
//   items: ItineraryItem[];
//   // added on client side
//   duration: number,
//   time_to_departure: number, 
// };
const t = new Date();
const itineraries = [
  { id: 1, title: 'Trip 1', trip_start: new Date('2023-01-10'), trip_end: new Date('2023-01-15'), duration: 5, items: [], time_to_departure: calculateDuration(t, new Date('2023-01-10')), destination: '', enriched_image: null, enriched_info: null }, // 5 days
  { id: 2, title: 'Trip 2', trip_start: new Date('2023-02-05'), trip_end: new Date('2023-02-11'), duration: 6, items: [], time_to_departure: calculateDuration(t, new Date('2023-02-05')), destination: '', enriched_image: null, enriched_info: null }, // 6 days
  { id: 3, title: 'Trip 3', trip_start: new Date('2023-01-20'), trip_end: new Date('2023-01-27'), duration: 7, items: [], time_to_departure: calculateDuration(t, new Date('2023-01-20')), destination: '', enriched_image: null, enriched_info: null }, // 7 days
  { id: 4, title: 'Trip 4', trip_start: new Date('2023-01-01'), trip_end: new Date('2023-01-12'), duration: 11, items: [], time_to_departure: calculateDuration(t, new Date('2023-01-01')), destination: '', enriched_image: null, enriched_info: null }, // 11 days
] as Itinerary[];

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
 useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ token: 'fake-token' }),
}));

describe('ItinerariesListView', () => {
  test('it sorts itineraries by trip duration', () => {
    render(
      <MemoryRouter>
        <Itineraries itineraries={itineraries} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'duration' } });

    const sortedItems = screen.getAllByTestId('trip-card');
    expect(sortedItems[0]).toHaveTextContent('Trip 4'); 
    expect(sortedItems[1]).toHaveTextContent('Trip 3'); 
    expect(sortedItems[2]).toHaveTextContent('Trip 2'); 
    expect(sortedItems[3]).toHaveTextContent('Trip 1'); 
  });

  test('it sorts itineraries by time to departure', () => {
    render(
      <MemoryRouter>
        <Itineraries itineraries={itineraries} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'departure' } });

    const sortedItems = screen.getAllByTestId('trip-card');
    expect(sortedItems[0]).toHaveTextContent('Trip 4');
    expect(sortedItems[1]).toHaveTextContent('Trip 1');
    expect(sortedItems[2]).toHaveTextContent('Trip 3');
    expect(sortedItems[3]).toHaveTextContent('Trip 2');
  });

  test('it sorts itineraries by both duration and departure', () => {
    render(
      <MemoryRouter>
        <Itineraries itineraries={itineraries} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'both' } });

    const sortedItems = screen.getAllByTestId('trip-card');
    expect(sortedItems[0]).toHaveTextContent('Trip 4'); 
    expect(sortedItems[1]).toHaveTextContent('Trip 3'); 
    expect(sortedItems[2]).toHaveTextContent('Trip 2'); 
    expect(sortedItems[3]).toHaveTextContent('Trip 1'); 
  });
});
