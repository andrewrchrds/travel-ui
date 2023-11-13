import { Navigate, Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '..//contexts/AuthContext';
import { Link } from 'react-router-dom';

const AuthenticatedLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/itineraries">Itinerary Planner</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/logout">
              Logout ({currentUser.email})
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container style={{ marginTop: '20px', }}>
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthenticatedLayout