import { Input, Box, Text, InputGroup, InputLeftElement, Link } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import deskImage from '../pages/images/desk.jpg'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react';

const HomePage = () => {
    const [companyName, setCompanyName] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(companyName.trim()){
            navigate(`/reviews/${encodeURIComponent(companyName)}`)
        }
    }

    const handleClick = () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            localStorage.setItem('intendedRoute', '/review');
            navigate('/login');
            console.log('No token found, redirecting to login');
            return;
        } else {
            navigate('/review', { replace: true });
        }
    }

    return(
        <Box
            backgroundImage={deskImage}
            backgroundSize="cover"
            backgroundPosition="center"
            height="100vh"
            width="100%"
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            {/* Overlay to darken the image and make text more readable */}
            <Box 
                position="absolute"
                top="400"
                left="0"
                width="100%"
                height="49%"
                backgroundColor="rgba(0, 0, 0, 0.5)"
            />
            
            {/* Logo */}
            <Box 
                zIndex="1" 
                mb="8"
            >
                <Text
                    fontSize="6xl"
                    fontWeight="bold"
                    color="white"
                    textAlign="center"
                >
                    UNRESTRICTED COMPANY REVIEWS
                </Text>
            </Box>
            
            {/* Search prompt */}
            <Text
                zIndex="1"
                fontSize="3xl"
                fontWeight="medium"
                color="white"
                mb="6"
            >
                Enter your <Text as="span" fontWeight="bold">company</Text> to get started
            </Text>
            
            {/* Search input */}
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '700px', zIndex: '1'}}> 
                <InputGroup 
                    maxW="700px"  
                    zIndex="1"
                    size="lg"     
                >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.300" fontSize="20px" />} 
                        h="full"  
                    />
                    <Input
                        bg="black !important"
                        color="white !important"
                        placeholder="Company Name"
                        size="lg"
                        height="70px" 
                        fontSize="3xl" 
                        borderRadius="full"
                        paddingLeft="50px"  
                        _placeholder={{ color: "gray.400", fontSize: "2xl" }}
                        borderColor="white !important"
                        _hover={{ borderColor: "orange.500 !important"}}
                        _focus={{
                            borderColor: "orange.500 !important",
                            boxShadow: "none !important"
                        }}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </InputGroup>
            </form>
            <Text
                zIndex="1"
                fontSize="2xl"
                color="white"
                mt="6"
                textAlign="center"
                maxWidth="600px"
            >
                Create your own review <Link onClick = {handleClick} color = 'blue.400'>here</Link>
            </Text>
        </Box>
    )
}

export default HomePage;