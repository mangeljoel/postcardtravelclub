import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
const MasonryGrid = ({ items, showViewAll = true, columns }) => {
    return (
        <SimpleGrid
            columns={columns}  // Now uses the columns prop instead of hardcoded values
            spacing={{ base: 2, md: 3, lg: 4 }}
            py={{ base: 2, md: 2 }}
            width="100%"
        >
            {items.map((item, i) => (
                <Box
                    key={i}
                    borderRadius="xl"
                    overflow="hidden"
                    position="relative"
                    height={{ base: "120px", md: "140px", lg: "160px" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                    _hover={{ transform: "scale(1.03)", boxShadow: "xl" }}
                >
                    <Image
                        src={item.image}
                        alt={item.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        filter="brightness(85%)"
                    />
                    <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        w="100%"
                        bgGradient="linear(to-t, rgba(0,0,0,0.7), transparent)"
                        p={3}
                    >
                        <Text
                            fontSize={{ base: "sm", md: "md", lg: "lg" }}
                            fontWeight="bold"
                            color="white"
                            textShadow="0 2px 4px rgba(0,0,0,0.6)"
                        >
                            {item.name}
                        </Text>
                    </Box>
                </Box>
            ))}

            {showViewAll && (
                <Box
                    borderRadius="2xl"
                    height={{ base: "120px", md: "140px", lg: "160px" }}
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
                >
                    <Center>
                        <Text
                            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                            fontWeight="bold"
                            color="white"
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            View All →
                        </Text>
                    </Center>
                </Box>
            )}
        </SimpleGrid>
    );
};
export default MasonryGrid;