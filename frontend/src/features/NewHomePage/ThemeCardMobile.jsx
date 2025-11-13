import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
const ThemeCardMobile = ({ theme, isVisible }) => {
    return (
        <Box
            cursor="pointer"
            transition="all 0.3s ease"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(30px)'}
            sx={{
                transition: `all 0.8s ease-out ${theme.delay}s`,
            }}
            p={4}
            borderRadius="xl"
            bg="whiteAlpha.100"
            _hover={{
                transform: 'scale(1.05)',
                bg: 'whiteAlpha.200',
            }}
        >
            <VStack spacing={2} align="center">
                <Text fontSize="3xl">{theme.icon}</Text>
                <VStack spacing={0} align="center">
                    <Heading
                        fontSize="sm"
                        fontWeight="600"
                        color="white"
                        fontFamily="'Playfair Display', serif"
                        lineHeight="1.2"
                        textAlign="center"
                    >
                        {theme.name}
                    </Heading>
                    <Text fontSize="xs" color="whiteAlpha.900" fontWeight="500">
                        {theme.items} experiences
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );
};
export default ThemeCardMobile;