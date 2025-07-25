import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Input, VStack, Text, Textarea} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormLabel} from '@chakra-ui/form-control';

const API_CONFIG = {
    BASE_URL: 'https://jobreviews-production.up.railway.app', 
    REVIEW_ENDPOINT: '/api/auth/review'
}

const Review = () => {
    const navigate = useNavigate(); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastStatus, setToastStatus] = useState('');

    const formBg = useColorModeValue("white", "gray.700");
    const inputBg = useColorModeValue("gray.50", "gray.600"); 
    const textColor = useColorModeValue("gray.800", "white"); 
    const bColor = useColorModeValue("gray.300", "gray.500");
    const hoverColor = useColorModeValue("gray.400", "gray.400"); 
    const buttonColor = useColorModeValue("blue", "teal"); 
    const [formData, setFormData] = useState ({
        company: '', 
        role: '',
        location: '', 
        title: '',
        description: '', 
    });
    
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    
    const handleSubmit = async(e) => {
        e.preventDefault();   
        
        try {

            const token = localStorage.getItem('authToken');
        
            if (!token) {
                setToastMessage('Please log in to create a review');
                setToastStatus('error');
                setShowToast(true);
                navigate('/login'); 
                return;
            }

            if(!formData.company || !formData.location || !formData.role || !formData.title || !formData.description){
                setToastMessage("All fields required");
                setToastStatus("error");
                setShowToast(true);
                setIsLoading(false); 
                return; 
            }


            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.REVIEW_ENDPOINT}`, {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json', 
                    'Authorization': `Bearer ${token}`
                }, 
                body : JSON.stringify({
                    company: formData.company, 
                    location: formData.location, 
                    role: formData.role, 
                    title: formData.title, 
                    description: formData.description,
                    createdAt: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                })
            }); 

            if(response.ok){
                const responseData = await response.json();
                setToastMessage(responseData.message);
                setToastStatus("Success");
                setShowToast(true);
                setTimeout(() => {
                    navigate(`/reviews/${formData.company}`);
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

    }

    const handleFormChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name] : e.target.value
        })
    }
    
    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }
    
    return (
        <Container maxW="container.sm" py={10}>
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

            <VStack spacing = {8}>
                <Box
                    w="full"
                    p={8}
                    rounded="lg"
                    shadow="lg"
                    borderWidth="1px"
                     bg={formBg}
                >
                    <form onSubmit = {handleSubmit}>
                        <VStack spacing={6}>
                            <Text fontSize='50px' color={textColor}>
                                Create a review
                            </Text>
                            <FormControl>
                                <FormLabel color={textColor}>Company</FormLabel>
                                <Input
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleFormChange}
                                    placeholder="Enter company name"
                                    _placeholder={{color: "gray.500"}}
                                    
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={bColor}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                                <FormLabel color={textColor}>Location</FormLabel>
                                <Input
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                    placeholder="Enter location"
                                    _placeholder={{color: "gray.500"}}
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={bColor}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                                <FormLabel color={textColor}>Role</FormLabel>
                                <Input
                                    name="role"
                                    type="text"
                                    value={formData.role}
                                    onChange={handleFormChange}
                                    placeholder="Enter role"
                                    _placeholder={{color: "gray.500"}}
                                    
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={bColor}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                                <FormLabel color={textColor}>Title</FormLabel>
                                <Input
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="Enter title"
                                    _placeholder={{color: "gray.500"}}
                                    
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={bColor}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                />
                                <FormLabel color={textColor}>Description</FormLabel>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Enter description"
                                    _placeholder={{color: "gray.500"}}
                                    height={'100px'}
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={bColor}
                                    _hover={{ borderColor: "orange.500 !important"}}
                                    _focus={{
                                        borderColor: "orange.500 !important",
                                        boxShadow: "none !important"
                                     }}
                                    resize="vertical"
                                />
                                <Text fontSize='50px' color={textColor}></Text>
                            </FormControl>
                            <Button 
                                type="submit"
                                isLoading={isLoading}
                                colorScheme={ buttonColor}
                                size="lg"
                                width="full"
                                mt={4}
                            > 
                                Submit Review
                            </Button> 
                        </VStack>
                    </form>
                
                
                
                </Box>
            </VStack>
        </Container>
    );
}

export default Review;