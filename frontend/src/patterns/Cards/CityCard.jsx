import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { ChakraNextImage } from "../ChakraNextImage";
import { useRouter } from "next/router";
import { FaCalendarAlt, FaShoppingBag } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";



export const CityCard = ({ city }) => {
    const router = useRouter();

    const handleCityClick = (city) => {
        // Navigate to location page with city data
        router.push(`/cityguide/${city.slug}`);
    }
    return (

        <Box
            cursor="pointer"
            onClick={() => handleCityClick(city)}
            borderRadius={["4vw", "1.5vw"]}
            overflow="hidden"
            position="relative"
            h={["100vw", "35vw"]}
            minH={["297px"]}
            w={["85vw", "314px", "314px", "25vw"]}
            minW={["85vw", "314px", "314px", "25vw"]}
            // transition="all 0.3s ease"
            // _hover={{
            //     transform: "translateY(-8px)",
            //     boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
            // }}
            role="button"
            aria-label={`Explore ${city.name}`}
        >
            {/* City Image */}
            <Box w="100%" h="100%" position="relative">
                <ChakraNextImage
                    src={city.image}
                    alt={`${city.name} city view`}
                    h="100%"
                    w="100%"
                    objectFit="cover"

                />

                {/* Gradient Overlay */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    bg="linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
                />
            </Box>

            {/* City Info Overlay */}
            /* City Info Overlay */
            <Flex
                position="absolute"
                bottom={0}
                left={0}
                w="100%"
                p={["6vw", "2vw"]}
                flexDirection="column"
                color="white"
                zIndex={2}
            >
                <Text
                    fontSize={["6vw", "2.2vw"]}
                    fontFamily="lora"
                    fontStyle="italic"
                    fontWeight="600"
                    mb={["1vw", "0.5vw"]}
                >
                    {city.name}
                </Text>

                <Text
                    fontSize={["3.5vw", "1.2vw"]}
                    fontFamily="raleway"
                    opacity={0.9}
                    mb={["2vw", "0.8vw"]}
                >
                    {city.country}
                </Text>

                {/* ✅ Show tab-specific counts */}
                <Flex
                    gap={["3vw", "1.5vw"]}
                    flexWrap="wrap"
                    fontSize={["2.8vw", "0.9vw"]}
                    fontFamily="raleway"
                    opacity={0.85}
                    alignItems="center"
                >
                    {city.albumCounts?.shopping > 0 && (
                        <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
                            <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.shopping}</Text>
                            <Icon
                                as={FaShoppingBag}
                                width={["4vw", "1.2vw"]}
                                height={["4vw", "1.2vw"]}
                                fill="white"
                            />
                        </Flex>
                    )}
                    {city.albumCounts?.restaurants > 0 && (
                        <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
                            <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.restaurants}</Text>
                            <Icon
                                as={IoRestaurant}
                                width={["4vw", "1.2vw"]}
                                height={["4vw", "1.2vw"]}
                                fill="white"
                            />
                        </Flex>
                    )}
                    {!city.albumCounts?.events && (
                        <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
                            <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.events}</Text>
                            <Icon
                                as={FaCalendarAlt}
                                width={["4vw", "1.2vw"]}
                                height={["4vw", "1.2vw"]}
                                fill="white"
                            />
                        </Flex>
                    )}

                    {/* Fallback if no specific counts */}
                    {(!city.albumCounts || Object.values(city.albumCounts).every(count => count === 0)) && (
                        <Text>Explore experiences</Text>
                    )}
                </Flex>
            </Flex>

        </Box>
    )
};