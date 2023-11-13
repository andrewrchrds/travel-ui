import { useState } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { Itinerary } from '../types';
import { useAxios } from '../axiosClient';
import axios from 'axios';

interface EditModalProps {
  show: boolean;
  onHide: () => void;
  itinerary: Itinerary;
  onSave: (updatedItinerary: Itinerary) => void;
}

const EditModal = ({ show, onHide, itinerary, onSave }: EditModalProps) => {
  const axiosInstance = useAxios();
  
  const [updatedItinerary, setUpdatedItinerary] = useState(itinerary);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedItinerary({ ...updatedItinerary, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      const body = {
        title: updatedItinerary.title,
      }
      await axiosInstance.patch(`/itineraries/${itinerary.id}`, body);
      onSave(updatedItinerary);
      onHide();

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // HTTP errors
        console.log(error.response.data);
      } else {
        // Non-Axios errors
        console.log(error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Itinerary</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={updatedItinerary.title}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;