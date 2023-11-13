import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Modal, Button } from 'react-bootstrap';
import { useAxios } from '../axiosClient'; 
import { Itinerary, ItineraryItem, transformItinerary } from '../types';
import AddItemForm from '../components/AddItemForm';
import EditItineraryModal from '../components/EditItineraryModal';

const ItineraryView = () => {
  const { itineraryId } = useParams();
  const axiosInstance = useAxios();
  const [itinerary, setItinerary] = useState<Itinerary|null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItineraryItem, setSelectedItineraryItem] = useState<ItineraryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  /**
   * Gets called by the modal when the user clicks the save button
   * @param updatedItinerary 
   * @returns 
   */
  const handleSave = (updatedItinerary: Itinerary) => {
    if (itinerary === null)
      return;
    itinerary.title = updatedItinerary.title;
    setItinerary(itinerary);
  };

  /**
   * Gets called by the AddItemForm when the user clicks the save button
   * @param item 
   * @returns 
   */
  const addItemToItinerary = (item: ItineraryItem) => {
    if (itinerary === null) 
      return;

    const newItinerary = {
      ...itinerary,
      items: [...itinerary.items, item]
    };

    setItinerary(newItinerary);
  };

  /**
   * Fetches the itinerary from the API and sets the state
   */
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axiosInstance.get(`/itineraries/${itineraryId}`);
        setItinerary(transformItinerary(response.data));
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    };

    fetchItinerary();
  }, [itineraryId, axiosInstance]);


  /**
   * Gets called when the user clicks the delete button on an itinerary item, brings up the modal
   * @param itineraryItem 
   */
  const handleDeleteClick = (itineraryItem: ItineraryItem) => {
    setSelectedItineraryItem(itineraryItem);
    setShowDeleteModal(true);
  };
  
  /**
   * Gets called when the user clicks the cancel button on the modal
   */
  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };
  
  /**
   * Gets called when the user clicks the delete button on the modal
   * Sends a DELETE request to the API and updates the state
   * @returns 
   */
  const handleConfirmDelete = async () => {
    if  (selectedItineraryItem === null || itinerary === null) 
      return;

    try {
      await axiosInstance.delete(`/itineraries/${itinerary.id}/items/${selectedItineraryItem.id}`);
      itinerary.items = itinerary.items.filter(itin => itin.id !== selectedItineraryItem.id)
      setItinerary(itinerary);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting itinerary item:', error);
    }
  };

  if (!itinerary) {
    return <div>Loading...</div>;
  }
  
  return (
    <Container>
        <div className="d-flex justify-content-between">
          <div>
            <h2>{itinerary.title}</h2>
            <p className="lead text-muted">{itinerary.duration} days in {itinerary.destination}</p>
          </div>
          <div className="">
            <Button onClick={() => setShowEditModal(true)} variant="dark">Edit Itinerary</Button>
            <EditItineraryModal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              itinerary={itinerary}
              onSave={handleSave}
            />
          </div>
        </div>

      <Row>
        <Col>
          {itinerary.items.length === 0 && <p className="text-muted mb-5">No items in this itinerary yet &mdash; start adding now!</p>}
          <ListGroup>
          {itinerary.items.map((item: ItineraryItem) => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-start">
                  <div className="my-auto">{item.description}</div>
                  <div>
                      <Button variant="outline-danger btn-sm" onClick={() => handleDeleteClick(item)}>X</Button>
                  </div>
              </ListGroup.Item>
          ))}
          </ListGroup>

          <AddItemForm itinerary={itinerary} onAddItem={addItemToItinerary} />
        </Col>
        <Col xs={3}>
          {itinerary.enriched_image && <img src={itinerary.enriched_image} alt={itinerary.title} className="img-fluid" />}
          {itinerary.enriched_info && <p className="mt-3">{itinerary.enriched_info}</p>}
        </Col>
      </Row>
      
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>Are you sure you want to delete this item?</p>
              <figure>
                <blockquote className="blockquote">
                  <p>{selectedItineraryItem?.description}</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                  {itinerary.title}
                </figcaption>
              </figure>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                  Delete
              </Button>
          </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default ItineraryView;
