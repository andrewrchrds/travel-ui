import React from 'react';
import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Itinerary, ItineraryItem } from '../types';
import { useAxios } from '../axiosClient';
import axios from 'axios';

interface AddItemFormProps {
  onAddItem: (item: ItineraryItem) => void;
  itinerary: Itinerary
}

const AddItemForm = ({ onAddItem, itinerary } : AddItemFormProps) => {
  const [itemValue, setItemValue] = useState('');
  const [error, setError] = useState('');
  const axiosInstance = useAxios();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const body = {
        description: itemValue,
      }
      const response = await axiosInstance.post(`/itineraries/${itinerary.id}/items`, body);
      const itemData = response.data;
      onAddItem(itemData);
      setItemValue(''); // Clear the input field after adding
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // HTTP errors
        setError(error.response.data.errors || {error: ['Add item failed']});
      } else {
        // Non-Axios errors
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="d-flex mt-4">
      <InputGroup>
          <Form.Control
            type="text"
            placeholder="Enter item"
            value={itemValue}
            onChange={(e) => setItemValue(e.target.value)}
          />
          <Button variant="primary" type="submit">
            Add Item
          </Button>
        </InputGroup>
      </Form>
      {error && <div className="text-danger mb-3 mt-3">
        {Object.keys(error).map(key => (
          <p key={key}>{error[key][0]}</p>
        ))}
      </div>}
    </>
  );
};

export default AddItemForm