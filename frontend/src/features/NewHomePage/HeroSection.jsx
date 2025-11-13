import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
    return (
        <Box
            position="fixed"
            width="100%"
            height="100vh"
            top="0"
            left="0"
            zIndex="0"
            pointerEvents="none"
        >
            {/* Video Background */}
            <Box position="absolute" top="0" left="0" width="100%" height="100%" overflow="hidden">
                <Box
                    as="video"
                    src="https://images.postcard.travel/postcardv2/pc_video_63146e5d5e.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    sx={{ pointerEvents: 'none' }}
                />
                <Box position="absolute" top="0" left="0" width="100%" height="100%" bg="blackAlpha.600" />
            </Box>

            {/* Main Content */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex="5"
                width="100%"
                maxW="900px"
                px={6}
            >
                <VStack spacing={8} align="center">
                    <VStack spacing={4}>
                        <Heading
                            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                            fontWeight="700"
                            color="white"
                            textAlign="center"
                            letterSpacing="tight"
                            textShadow="0 4px 20px rgba(0,0,0,0.5)"
                            lineHeight="1.2"
                            maxW={{ base: "95%", md: "85%", lg: "80%" }}
                        >
                            Discover immersive experiences curated by boutique hotels that advance conscious luxury travel
                        </Heading>
                    </VStack>

                    <Box width="100%" maxW="600px" pointerEvents="auto">
                        <InputGroup size="lg">
                            <Input
                                placeholder="Search destinations or experiences..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                bg="whiteAlpha.200"
                                backdropFilter="blur(20px)"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                color="white"
                                fontSize={["sm", "md"]}
                                height="60px"
                                borderRadius="full"
                                pl={[6, 12]}
                                _placeholder={{ color: 'whiteAlpha.700' }}
                                _hover={{ bg: 'whiteAlpha.300', borderColor: 'whiteAlpha.400' }}
                                _focus={{
                                    bg: 'whiteAlpha.300',
                                    borderColor: 'purple.400',
                                    boxShadow: '0 0 0 1px rgba(159, 122, 234, 0.6)',
                                }}
                            />
                            <Button
                                position="absolute"
                                right="4px"
                                top="50%"
                                transform="translateY(-50%)"
                                colorScheme="purple"
                                size="md"
                                borderRadius="full"
                                width="52px"
                                height="52px"
                                minW="52px"
                                p={0}
                                onClick={onSearch}
                                bgGradient="linear(to-r, #EA6146, #307FE2)"
                                _hover={{
                                    bgGradient: 'linear(to-r, #d55540, #2a6fc9)',
                                    transform: 'translateY(-50%) scale(1.05)',
                                }}
                                transition="all 0.3s"
                            >
                                <Icon as={SearchIcon} boxSize={5} color="white" />
                            </Button>
                        </InputGroup>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};
export default HeroSection;