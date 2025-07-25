import { useState, useEffect } from 'react';
import { Box, Button, Container, Input, VStack, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormLabel} from '@chakra-ui/form-control';
import { useNavigate } from 'react-router-dom';

const API_CONFIG = {
    BASE_URL: 'https://jobreviews-production.up.railway.app', 
    LOGIN_ENDPOINT: '/api/auth/login'
}

const LoginPage = () => {
    const navigate = useNavigate();
    const formBg = useColorModeValue("white", "gray.700"); 
    const inputBg = useColorModeValue("gray.50", "gray.600"); 
    const textColor = useColorModeValue("gray.800", "white"); 

    const [formData, setFormData] = useState ({
        email: '', 
        password: '', 
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastStatus, setToastStatus] = useState('');

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name] : e.target.value
        }); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);

        if(!formData.email || !formData.password){
            setToastMessage("All fields required");
            setToastStatus("error");
            setShowToast(true);
            setIsLoading(false); 
            return; 
        }
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.LOGIN_ENDPOINT}`, {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json', 
                }, 
                body : JSON.stringify({
                    email: formData.email, 
                    password: formData.password
                })
            }); 

            if(response.ok){
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token); 
                localStorage.setItem('user', JSON.stringify(responseData.user));    
                window.dispatchEvent(new Event('storage'));
                setToastMessage(responseData.message);
                setToastStatus("success");
                setShowToast(true);
                setTimeout(() => {
                    var intendedRoute = localStorage.getItem('intendedRoute');
                    navigate(intendedRoute || '/');
                    localStorage.removeItem('intendedRoute');
                }, 250);
            }else{
                const errorData = await response.json(); 
                throw new Error(errorData.message); 
            }
        }catch(error){
            setToastMessage(error.message); 
            setToastStatus("error"); 
            setShowToast(true);

        }finally{
            setIsLoading(false); 
        }
    }; 



    return(
        <Container maxW="container.sm" py={10} >
            {showToast &&(
                <Box
                    position="fixed"
                    top="4"
                    right="4"
                    p="4"
                    bg={toastStatus === 'error' ? 'red.500' : 'green.500'}
                    color="white"
                    borderRadius="md"
                    zIndex="toast"
                
                >
                    {toastMessage}
                </Box>
            )}
            <VStack spacing={8}>
                <Box
                    w="full"
                    bg={formBg}
                    p={8}
                    rounded="lg"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                >
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={6}>
                            <Text fontSize='50px' color={textColor}>
                                Log In
                            </Text>
                            <FormControl>
                                <FormLabel color={textColor}>Username</FormLabel>
                                <Input
                                    name="email"
                                    type="text"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    _placeholder={{color: "gray.500"}}
                                    
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={useColorModeValue("gray.300", "gray.500")}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Password</FormLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    _placeholder={{color : "gray.500"}}
                                    
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={useColorModeValue("gray.300", "gray.500")}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                            </FormControl>
                            <Button 
                                type="submit"
                                isLoading={isLoading}
                                colorScheme={ useColorModeValue("blue", "teal")}
                                size="lg"
                                width="full"
                                mt={4}
                            > 
                                Log in 
                            </Button> 
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default LoginPage; 