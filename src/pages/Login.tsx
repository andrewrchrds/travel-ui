// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useAxios } from '../axiosClient';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setToken, setCurrentUser } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('your-password');
  const [error, setError] = useState({});

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Logging in...');
    setError({}); // Clear any existing errors

    try {
      const response = await axiosInstance.post('/login', { email, password });
      const token = response.data.token;

      
      const userResponse = await axiosInstance.get('/user', { headers: { 'Authorization': 'Bearer ' + token} });
      const userData = userResponse.data;
      
      setToken(token);
      setCurrentUser(userData);

      navigate('/itineraries')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // HTTP errors
        setError(error.response.data.errors || {error: ['Login failed']});
      } else {
        // Non-Axios errors
        setError({error: ['An unexpected error occurred']});
      }
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="mb-3">Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        </Form.Group>

        {error && <div className="text-danger mb-3 mt-3">
          {Object.keys(error).map(key => (
            <p key={key}>{error[key][0]}</p>
          ))}
        </div>}

        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
    </Container>
  );
};

export default Login;




// <div>
// <h1>Login</h1>
// <form >
//   <input
//     type="text"
//     value={email}
//     onChange={(e) => setEmail(e.target.value)}
//     placeholder="email"
//   />
//   <input
//     type="password"
//     value={password}
//     onChange={(e) => setPassword(e.target.value)}
//     placeholder="Password"
//   />

//   {error && <div className="error">{error}</div>}

//   <button type="submit">Log In</button>
// </form>
// </div>
// );