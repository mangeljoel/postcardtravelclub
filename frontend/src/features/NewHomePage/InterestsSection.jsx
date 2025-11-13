import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
import SectionHeader from './SectionHeader';
import MasonryGrid from './MasonryGrid';
const InterestsSection = ({ interests, interestsRef }) => {
    return (
        <Box
            ref={interestsRef}
            bgGradient="linear(to-br, #111111, #3a3a3a, #888888)"
            py={{ base: 12, md: 16, lg: 20 }}
            px={{ base: 4, md: 6 }}
            minHeight="100vh"
            position="relative"
            zIndex="30"
            display="flex"
            alignItems="center"
            boxShadow="0 -10px 30px rgba(0,0,0,0.3)"
        >
            <Container maxW="100%" maxH="100%" px={{ base: 2, md: 12 }}>
                <HStack
                    px={[2, 6]}
                    spacing={{ base: 4, lg: 16 }}
                    align="center"
                    flexDirection={{ base: 'column', lg: 'row' }}
                    width="100%"
                >
                    <SectionHeader title="EXPLORE BY INTERESTS" />
                    <MasonryGrid items={interests} />
                </HStack>
            </Container>
        </Box>
    );
};

export default InterestsSection