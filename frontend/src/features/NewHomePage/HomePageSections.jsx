import {
    Box, Container, Heading, Text, Image,
    VStack, HStack, Center
} from '@chakra-ui/react';

const HomePageSections = () => {
    const countries = [
        { name: 'India', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80', description: 'Ancient temples & modern cities' },
        { name: 'Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80', description: 'Renaissance art & cuisine' },
        { name: 'Iceland', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80', description: 'Northern lights & glaciers' },
        { name: 'Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', description: 'Ancient ruins & adventure' },
        { name: 'Morocco', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80', description: 'Sahara desert & markets' },
        { name: 'New Zealand', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80', description: 'Stunning landscapes' },
    ];

    return (
        <Box
            bgGradient="linear(to-br, #111111, #3a3a3a, #888888)"
            py={{ base: 8, md: 8, lg: 8 }}
            px={{ base: 2, md: 6 }}
            height="100vh"
            display="flex"
            alignItems="center"
            boxShadow="0 -10px 30px rgba(0,0,0,0.3)"
        >
            <Container maxW="100%" maxH="100%" px={{ base: 2, md: 12 }}>
                <HStack px={[2, 6]} spacing={{ base: 4, lg: 16 }} align="center" flexDirection={{ base: 'column', lg: 'row' }} width="100%">
                    <VStack
                        align="start"
                        spacing={6}
                        width={{ base: '100%', lg: '300px' }}
                        flexShrink={0}
                        mb={{ base: 4, lg: 0 }}
                        order={{ base: 0, lg: 0 }}
                    >
                        <Box width="60px" height="2px" bg="white" />
                        <Heading
                            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                            fontWeight="400"
                            color="white"
                            letterSpacing="tight"
                            fontFamily="'Playfair Display', serif"
                            lineHeight="1.1"
                        >
                            EXPLORE BY DESTINATION
                        </Heading>
                    </VStack>

                    <Box
                        order={{ base: 1, lg: 1 }}
                        py={{ base: 2, md: 6 }}
                        width="100%"
                        sx={{
                            columnCount: { base: 2, md: 3, lg: 4 },
                            columnGap: { base: "0.5rem", md: "1rem" },
                        }}
                    >
                        {countries.map((country, i) => (
                            <Box
                                key={i}
                                mb={{ base: "0.5rem", md: "1rem" }}
                                borderRadius="2xl"
                                overflow="hidden"
                                position="relative"
                                transition="all 0.3s ease"
                                _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
                                sx={{
                                    breakInside: "avoid",
                                    WebkitColumnBreakInside: "avoid",
                                }}
                            >
                                <Image
                                    src={country.image}
                                    alt={country.name}
                                    w="100%"
                                    h="auto"
                                    objectFit="cover"
                                    filter="brightness(85%)"
                                />
                                <Box
                                    position="absolute"
                                    bottom="0"
                                    left="0"
                                    w="100%"
                                    bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
                                    p={3}
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color="white"
                                        textShadow="0 2px 4px rgba(0,0,0,0.6)"
                                    >
                                        {country.name}
                                    </Text>
                                </Box>
                            </Box>
                        ))}

                        <Box
                            mb={{ base: "0.5rem", md: "1rem" }}
                            borderRadius="2xl"
                            height={{ base: "180px", md: "220px" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bgGradient="linear(to-br, teal.400, blue.500)"
                            cursor="pointer"
                            transition="all 0.3s ease"
                            _hover={{
                                transform: "scale(1.03)",
                                boxShadow: "xl",
                                bgGradient: "linear(to-br, teal.500, blue.600)",
                            }}
                            sx={{
                                breakInside: "avoid",
                                WebkitColumnBreakInside: "avoid",
                            }}
                        >
                            <Center>
                                <Text
                                    fontSize={{ base: "lg", md: "2xl" }}
                                    fontWeight="bold"
                                    color="white"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                >
                                    View All →
                                </Text>
                            </Center>
                        </Box>
                    </Box>
                </HStack>
            </Container>
        </Box>
    )
}

export default HomePageSections;