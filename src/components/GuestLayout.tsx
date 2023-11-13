import { Navigate, Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const GuestLayout = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/itineraries" />;
  }

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">Itinerary Planner</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Sign up</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container style={{ marginTop: '20px',}}>
        <Outlet />
      </Container>
    </>
  );
};

export default GuestLayout