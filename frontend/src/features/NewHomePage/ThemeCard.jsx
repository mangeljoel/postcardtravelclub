import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
const ThemeCard = ({ theme, isVisible }) => {
    return (
        <Box
            cursor="pointer"
            transition="all 0.3s ease"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            sx={{
                transition: `all 0.8s ease-out ${theme.delay}s`,
            }}
            _hover={{
                transform: 'scale(1.08)',
            }}
        >
            <HStack spacing={3} align="center">
                <Text fontSize={{ base: '3xl', lg: '4xl' }}>{theme.icon}</Text>
                <VStack align="start" spacing={0}>
                    <Heading
                        fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                        fontWeight="600"
                        color="white"
                        fontFamily="'Playfair Display', serif"
                        lineHeight="1.2"
                    >
                        {theme.name}
                    </Heading>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color="whiteAlpha.900" fontWeight="500">
                        {theme.items} experiences
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};
export default ThemeCard;