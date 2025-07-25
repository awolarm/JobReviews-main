import { useState, useEffect } from 'react';
import { Box, Button, Container, Input, VStack, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormLabel} from '@chakra-ui/form-control'; 
import { useNavigate } from 'react-router-dom';

const API_CONFIG = {
    BASE_URL: 'https://jobreviews-production.up.railway.app', 
    SIGNUP_ENDPOINT: '/api/auth/signup'
}

const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

const SignupPage = () => {
  const navigate = useNavigate(); 
  const formBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', 
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 

    if(!formData.username || !formData.email || !formData.password || !formData.confirmPassword){
            setToastMessage("All fields required");
            setToastStatus("error");
            setShowToast(true);
            setIsLoading(false); 
            return; 
        }

    if(!emailValidation(formData.email)){ 
      setToastMessage("Please enter a valid email");
      setToastStatus("error");
      setShowToast(true);
      setIsLoading(false); 
      return; 
    }     

    if(formData.password.length < 8){
        setToastMessage("Password needs to be 8 characters long");
        setToastStatus("error");
        setShowToast(true);
        setIsLoading(false); 
        return; 
    }
  
    if(formData.password !== formData.confirmPassword) {
        setToastMessage("Passwords do not match");
        setToastStatus("error");
        setShowToast(true);
        setIsLoading(false); 
        return; 
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SIGNUP_ENDPOINT}`, {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json', 
            },
            body : JSON.stringify({
                username: formData.username, 
                email: formData.email, 
                password: formData.password 
            })
        }); 

        if(!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || 'Failed to create account '); 
        }
        const responseData = await response.json(); 
        setToastMessage(responseData.message);
        setToastStatus("success");
        setShowToast(true);
    } catch(error) {
        setToastMessage(error.message || "Error creating account");
        setToastStatus("error");
        setShowToast(true);
    } finally {
        setIsLoading(false); 
        setTimeout(() => {
          navigate('/login');
        }, 250);
    }
  };

  return (
    <Container maxW="container.sm" py={10} >
      {showToast && (
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
                    Sign Up
                </Text>
                <FormControl>
                    <FormLabel color={textColor}>Username</FormLabel>
                    <Input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
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

                <FormControl>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input  
                      name="email"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
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

                <FormControl>
                    <FormLabel color={textColor}>Confirm Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
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
                  Sign Up 
                </Button> 
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default SignupPage;