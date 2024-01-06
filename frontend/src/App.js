
import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/home";
import Login from "./pages/login"; 
import Register from "./pages/register";
import StudentRecords from './pages/userDashboard';
import AdminDashboard from './pages/adminDashboard';
import InstitutionDashboard from "./pages/institutionDashboard";
import Guest from "./pages/guest";

import { ResponsiveAppBar } from './components/navbar';
import PrivateRouteAdmin from './privateRoutes/privateRouteAdmin';
import PrivateRouteInstitution from './privateRoutes/privateRouteInstitution';
import PrivateRouteStudent from './privateRoutes/privateRouteStudent';
import StudentRecordRequest from './pages/studentRecordRequest';

function App() {
  return (
    <Router>
      
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recordRequest" element={<Guest />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />


          <Route 
            path="/adminDashboard" 
            element={
              <PrivateRouteAdmin>
                <AdminDashboard />
              </PrivateRouteAdmin>
            } 
          />
          <Route 
            path="/institutionDashboard" 
            element={
              <PrivateRouteInstitution>
                <InstitutionDashboard />
              </PrivateRouteInstitution>
            } 
          />
          <Route 
            path="/userDashboard" 
            element={
              <PrivateRouteStudent>
                <StudentRecords/>
              </PrivateRouteStudent>
            } 
          />
           <Route 
            path="/studentRecordRequest" 
            element={
              <PrivateRouteStudent>
                <StudentRecordRequest/>
              </PrivateRouteStudent>
            } 
          />


            
        </Routes>
    </Router>  
  );
}

export default App;
