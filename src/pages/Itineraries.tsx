import { useEffect, useState } from 'react';
import { Card, Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAxios } from '../axiosClient'; 
import { Itinerary, transformItinerary } from '../types';

interface ItinerariesListViewProps {
  itineraries?: Itinerary[];
}

const Itineraries: React.FC<ItinerariesListViewProps> = ({ itineraries: propItineraries }) => {
  const axiosInstance = useAxios();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary|null>(null);
  const [sortOption, setSortOption] = useState('departure'); // default sorting

  /**
   * Sort function for ordering the itineraries by duration 
   */
  const sortByDuration = (a: Itinerary, b: Itinerary) => {
    const durationA = a.trip_end.getTime() - a.trip_start.getTime();
    const durationB = b.trip_end.getTime() - b.trip_start.getTime();
    return durationB - durationA;
  };

  /**
   * Sort function for ordering the itineraries by how long until the trip starts 
   */
  const sortByTimeToDeparture = (a: Itinerary, b: Itinerary) => {
    const now = new Date();
    const departureA = a.trip_start.getTime() - now.getTime();
    const departureB = b.trip_start.getTime() - now.getTime();
    return departureA - departureB;
  };

  /**
   * Gets called when the user changes the sort option
   * @returns the itineraries sorted by the current sort option
   */
  const sortedItineraries = () => {
    if (sortOption === 'duration') {
      return [...itineraries].sort(sortByDuration);
    } else if (sortOption === 'departure') {
      return [...itineraries].sort(sortByTimeToDeparture);
    } else {
      // Combine both sorting criteria
      return [...itineraries].sort((a, b) => {
        return sortByDuration(a, b) || sortByTimeToDeparture(a, b);
      });
    }
  };



  /**
   * Fetches the itineraries from the API and sets the state
   */
  useEffect(() => {
    if (!propItineraries) {

      const fetchItineraries = async () => {
        try {
          const response = await axiosInstance.get('/itineraries');
          const itinerariesData = response.data.map(transformItinerary);
          setItineraries(itinerariesData);  
        } catch (error) {
          console.error('Error fetching itineraries:', error);
        }
        setLoading(false);
      };

      fetchItineraries();
    } else {
      setItineraries(propItineraries);
      setLoading(false);
    }
  }, []);

  /**
   * Gets called when the user clicks the delete button on an itinerary
   * Brings up a modal to confirm the delete
   * @param itinerary 
   */
  const handleDeleteClick = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setShowModal(true);
  };
  
  /**
   * Gets called when the user clicks the cancel button on the delete modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  /**
   * Gets called when the user clicks the confirm button on the delete modal
   * Deletes the itinerary from the API and removes it from the state
   */
  const handleConfirmDelete = async () => {
    if  (selectedItinerary === null) 
      return;

    try {
      await axiosInstance.delete(`/itineraries/${selectedItinerary.id}`);
      setItineraries(itineraries.filter(itin => itin.id !== selectedItinerary.id));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      // Handle error appropriately
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this itinerary?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <h2 className="mb-4">Your Trips</h2>



      <Row className="justify-content-between">
        <Col xs="3">
          <Link to="/itineraries/new" className="btn btn-primary mb-4">
            Add a new trip
          </Link>
        </Col>
        <Col xs="3">
          <Form.Select data-testid="sort-select" aria-label="Sort by" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="duration">Trip Duration</option>
            <option value="departure">Time to Departure</option>
            <option value="both">Both</option>
          </Form.Select>
        </Col>
      </Row>

      {itineraries.length === 0 && <div>No itineraries found</div>}
      <div className="row">
        {sortedItineraries().map(itinerary => (
            <div key={itinerary.id} className="col-4">
                <Card className="mb-3">
                    <Card.Body>            
                        <Card.Title data-testid="trip-card">{itinerary.title}</Card.Title>
                        <Card.Subtitle as="div" className="mb-3">
                            {itinerary.duration} days in {itinerary.destination}
                        </Card.Subtitle>
                        {itinerary.time_to_departure > 0 && (
                            <Card.Text>
                            Only {itinerary.time_to_departure} days to go!
                            </Card.Text>
                        )}
                        {itinerary.time_to_departure <= 0 && (
                            <Card.Text>
                            Already happened!
                            </Card.Text>
                        )}
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between"> 
                        <Button variant="outline-danger btn-sm" onClick={() => handleDeleteClick(itinerary)}>Delete</Button>
                        <Link className="btn btn-primary btn-sm" to={`/itineraries/${itinerary.id}`}>
                          View
                        </Link>
                    </Card.Footer>
                </Card>
            </div>
        ))}
        </div>
    </Container>
  );
};

export default Itineraries;
