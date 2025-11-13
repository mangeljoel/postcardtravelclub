import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
import ThemeCard from './ThemeCard';
import ThemeCardMobile from './ThemeCardMobile';

const ThemesSection = ({ themes, isVisible, themesRef }) => {
    const row1Themes = themes.slice(0, 3);
    const row2Themes = themes.slice(3, 7);
    const row3Themes = themes.slice(7, 10);

    return (
        <Box
            ref={themesRef}
            bgGradient="linear(to-br, #7a7575ff, #EA6146, #C84E38)"
            py={{ base: 12, md: 16, lg: 20 }}
            px={{ base: 4, md: 6 }}
            minHeight="100vh"
            position="sticky"
            top="0"
            zIndex="20"
            display="flex"
            alignItems="center"
            boxShadow="0 -10px 30px rgba(0,0,0,0.3)"
        >
            <Container maxW="container.xl" height="100%" display="flex" alignItems="center">
                <VStack spacing={{ base: 6, md: 8, lg: 10 }} align="stretch" width="100%">
                    {/* Centered Header */}
                    <VStack align="center" spacing={3}>
                        <Box width="60px" height="2px" bg="white" />
                        <Heading
                            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                            fontWeight="400"
                            color="white"
                            letterSpacing="tight"
                            fontFamily="'Playfair Display', serif"
                            lineHeight="1.1"
                            textAlign="center"
                        >
                            EXPLORE BY THEMES
                        </Heading>
                        <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.900" textAlign="center">
                            Discover experiences tailored to your interests
                        </Text>
                    </VStack>

                    {/* Desktop Layout - Asymmetric Rows */}
                    <Box display={{ base: 'none', md: 'block' }}>
                        <VStack spacing={6} align="stretch">
                            {/* Row 1 - 3 items */}
                            <HStack spacing={6} justify="space-around" flexWrap="wrap">
                                {row1Themes.map((theme, index) => (
                                    <ThemeCard key={index} theme={theme} isVisible={isVisible} />
                                ))}
                            </HStack>

                            {/* Row 2 - 4 items */}
                            <HStack spacing={4} justify="space-between" flexWrap="wrap" px={6}>
                                {row2Themes.map((theme, index) => (
                                    <ThemeCard key={index} theme={theme} isVisible={isVisible} />
                                ))}
                            </HStack>

                            {/* Row 3 - 3 items */}
                            <HStack spacing={6} justify="space-around" flexWrap="wrap">
                                {row3Themes.map((theme, index) => (
                                    <ThemeCard key={index} theme={theme} isVisible={isVisible} />
                                ))}
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Mobile Layout - Grid 2 columns */}
                    <SimpleGrid columns={2} spacing={4} display={{ base: 'grid', md: 'none' }} px={2}>
                        {themes.map((theme, index) => (
                            <ThemeCardMobile key={index} theme={theme} isVisible={isVisible} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};
export default ThemesSection;