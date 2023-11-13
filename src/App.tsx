import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import NotFound from './pages/NotFound';
import Itineraries from './pages/Itineraries';
import Logout from './pages/Logout';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import GuestLayout from './components/GuestLayout';
import { AuthProvider } from './contexts/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import ItineraryView from './pages/ItineraryView';
import ItineraryNew from './pages/ItineraryNew';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<AuthenticatedLayout />}>
            <Route path="/itineraries/new" element={<ItineraryNew />} />
            <Route path="/itineraries/:itineraryId" element={<ItineraryView />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/logout" element={<Logout />} />
            {/* More authenticated routes here */}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
