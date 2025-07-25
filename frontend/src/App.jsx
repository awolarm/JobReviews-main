import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'; 
import SignupPage from './pages/SignupPage';
import NavBar from './components/Navbar';
import Reviews from './pages/Reviews';
import Review from './pages/Review';

const App = () => {
    return (
        <Box minH={"100wh"}>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/> 
                <Route path="/login" element={<LoginPage/>}/> 
                <Route path="/signup" element={<SignupPage/>}/> 
                <Route path="/reviews/:companyName" element={<Reviews/>}/>
                <Route path="/review" element={<Review/>}/>
            </Routes>
        </Box>
    );
}

export default App; 