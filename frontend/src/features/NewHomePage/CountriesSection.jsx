import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
import SectionHeader from './SectionHeader';
import MasonryGrid from './MasonryGrid';
// ==================== COUNTRIES SECTION COMPONENT ====================
const CountriesSection = ({ countries, title }) => {
    return (
        <Box position="sticky"
            top="0"

            bgGradient="linear(to-br, #111111, #3a3a3a, #888888)"
            minHeight="auto"   // changed from "auto"
            py={{ base: 8, md: 10, lg: 12 }}  // reduced from lg: 16
            px={{ base: 2, md: 6 }}
            display="flex"
            alignItems="center"
            zIndex="10"
            boxShadow="0 -10px 30px rgba(0,0,0,0.3)"
        >
            <Box
                position="sticky"
                top="0"
                minHeight="100vh"
                display="flex"
                alignItems="center"
            >
                <Container maxW="100%" px={{ base: 2, md: 12 }}>
                    <HStack
                        spacing={{ base: 8, md: 10, lg: 12 }}
                        align="center"
                        flexDirection={{ base: 'column', lg: 'row' }}
                        width="100%"
                    >
                        {/* Left Column - Title */}
                        <VStack align="start" spacing={6} width={{ base: '100%', lg: '350px' }} flexShrink={0}>
                            <Box width="60px" height="2px" bg="white" />
                            <Heading
                                fontSize={{ base: '2xl', md: '3xl', lg: '3.5xl' }}
                                fontWeight="400"
                                color="white"
                                letterSpacing="tight"
                                fontFamily="'Playfair Display', serif"
                                lineHeight="1.2"
                            >
                                {title}
                            </Heading>
                        </VStack>

                        {/* Right Column - Grid */}
                        <Box flex="1" width="100%">
                            <MasonryGrid items={countries} columns={{ base: 2, md: 3, lg: 4 }} />
                        </Box>
                    </HStack>
                </Container>
            </Box>
        </Box>
    );
};
export default CountriesSection;