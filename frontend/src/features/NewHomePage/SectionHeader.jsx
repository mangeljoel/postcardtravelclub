import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
const SectionHeader = ({ title, subtitle }) => {
    return (
        <VStack align="start" spacing={6} width={{ base: '100%', lg: '300px' }} flexShrink={0} mb={{ base: 4, lg: 0 }}>
            <Box width="60px" height="2px" bg="white" />
            <Heading
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="400"
                color="white"
                letterSpacing="tight"
                fontFamily="'Playfair Display', serif"
                lineHeight="1.1"
            >
                {title}
            </Heading>
            {subtitle && (
                <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.900">
                    {subtitle}
                </Text>
            )}
        </VStack>
    );
};
export default SectionHeader;