import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAxios } from '../axiosClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItineraryNew = () => {
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [itinerary, setItinerary] = useState({
        title: '' as string,
        destination: '' as string,
        trip_start: '' as string,
        trip_end: '' as string,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setItinerary(prevItinerary => ({
            ...prevItinerary,
            [name]: value
        }));
    };      
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError
            
        try {
            await axiosInstance.post('/itineraries', itinerary);
            navigate('/itineraries')
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // HTTP errors
                console.log(error.response.data);
                setError(error.response.data.errors || {error: ['Login failed']});
            } else {
                // Non-Axios errors
                console.log(error);
                setError({error: ['An unexpected error occurred']});
            }
        }
    };

    return (
        <div>
            <h2>Create New Itinerary</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={itinerary.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                    type="text"
                    name="destination"
                    value={itinerary.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Trip Start Date</Form.Label>
                    <Form.Control
                    type="date"
                    name="trip_start"
                    value={itinerary.trip_start}
                    onChange={handleChange}
                />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Trip End Date</Form.Label>
                    <Form.Control
                    type="date"
                    name="trip_end"
                    value={itinerary.trip_end}
                    onChange={handleChange}
                />
                </Form.Group>
                
                {error && <div className="text-danger mb-3 mt-3">
                {Object.keys(error).map(key => (
                    <p key={key}>{error[key][0]}</p>
                ))}
                </div>}

                <Button variant="primary" type="submit">
                    Create Itinerary
                </Button>
            </Form>
        </div>
    );
};

export default ItineraryNew;    