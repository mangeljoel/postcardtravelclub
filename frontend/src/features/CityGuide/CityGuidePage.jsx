import { Box, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import LandingHeroSection from "../../patterns/LandingHeroSection";
import { useRouter } from 'next/router';
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { FaShoppingBag, FaCalendarAlt } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { Icon } from "@chakra-ui/icons";
import { CityCard } from "../../patterns/Cards/CityCard";

const CityGuide = ({ initialCities = [] }) => {
    const { profile } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCityClick = (city) => {
        // Navigate to location page with city data
        router.push(`/cityguide/${city.slug}`);
    };

    // const CityCard = ({ city }) => (
    //     <Box
    //         cursor="pointer"
    //         onClick={() => handleCityClick(city)}
    //         borderRadius={["4vw", "1.5vw"]}
    //         overflow="hidden"
    //         position="relative"
    //         h={["60vw", "35vw"]}
    //         w={["100%", "314px", "314px", "25vw"]}
    //         transition="all 0.3s ease"
    //         _hover={{
    //             transform: "translateY(-8px)",
    //             boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
    //         }}
    //         role="button"
    //         aria-label={`Explore ${city.name}`}
    //     >
    //         {/* City Image */}
    //         <Box w="100%" h="100%" position="relative">
    //             <ChakraNextImage
    //                 src={city.image}
    //                 alt={`${city.name} city view`}
    //                 h="100%"
    //                 w="100%"
    //                 objectFit="cover"

    //             />

    //             {/* Gradient Overlay */}
    //             <Box
    //                 position="absolute"
    //                 top={0}
    //                 left={0}
    //                 w="100%"
    //                 h="100%"
    //                 bg="linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
    //             />
    //         </Box>

    //         {/* City Info Overlay */}
    //         /* City Info Overlay */
    //         <Flex
    //             position="absolute"
    //             bottom={0}
    //             left={0}
    //             w="100%"
    //             p={["6vw", "2vw"]}
    //             flexDirection="column"
    //             color="white"
    //             zIndex={2}
    //         >
    //             <Text
    //                 fontSize={["6vw", "2.2vw"]}
    //                 fontFamily="lora"
    //                 fontStyle="italic"
    //                 fontWeight="600"
    //                 mb={["1vw", "0.5vw"]}
    //             >
    //                 {city.name}
    //             </Text>

    //             <Text
    //                 fontSize={["3.5vw", "1.2vw"]}
    //                 fontFamily="raleway"
    //                 opacity={0.9}
    //                 mb={["2vw", "0.8vw"]}
    //             >
    //                 {city.country}
    //             </Text>

    //             {/* ✅ Show tab-specific counts */}
    //             <Flex
    //                 gap={["3vw", "1.5vw"]}
    //                 flexWrap="wrap"
    //                 fontSize={["2.8vw", "0.9vw"]}
    //                 fontFamily="raleway"
    //                 opacity={0.85}
    //                 alignItems="center"
    //             >
    //                 {city.albumCounts?.shopping > 0 && (
    //                     <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
    //                         <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.shopping}</Text>
    //                         <Icon
    //                             as={FaShoppingBag}
    //                             width={["4vw", "1.2vw"]}
    //                             height={["4vw", "1.2vw"]}
    //                             fill="white"
    //                         />
    //                     </Flex>
    //                 )}
    //                 {city.albumCounts?.restaurants > 0 && (
    //                     <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
    //                         <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.restaurants}</Text>
    //                         <Icon
    //                             as={IoRestaurant}
    //                             width={["4vw", "1.2vw"]}
    //                             height={["4vw", "1.2vw"]}
    //                             fill="white"
    //                         />
    //                     </Flex>
    //                 )}
    //                 {!city.albumCounts?.events && (
    //                     <Flex alignItems="center" gap={["1vw", "0.6vw"]}>
    //                         <Text fontSize={["3.5vw", "1.5vw"]} >{city.albumCounts.events}</Text>
    //                         <Icon
    //                             as={FaCalendarAlt}
    //                             width={["4vw", "1.2vw"]}
    //                             height={["4vw", "1.2vw"]}
    //                             fill="white"
    //                         />
    //                     </Flex>
    //                 )}

    //                 {/* Fallback if no specific counts */}
    //                 {(!city.albumCounts || Object.values(city.albumCounts).every(count => count === 0)) && (
    //                     <Text>Explore experiences</Text>
    //                 )}
    //             </Flex>
    //         </Flex>

    //     </Box>
    // );

    if (loading) return <LoadingGif />;

    return (
        <Flex w="100%" flexDirection="column">
            {/* Hero Section */}
            <LandingHeroSection type="cityguide" />

            {/* Cities Section */}
            <Box
                w="100%"
                px={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}

                mx="auto"
            >
                {/* Section Header */}
                <Box textAlign="center" mb={["8vw", "3vw"]}>
                    <Text
                        fontSize={["6vw", "2.5vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                        color="#111111"
                        mb={["2vw", "1vw"]}
                    >
                        Explore Destinations
                    </Text>

                </Box>

                {/* Cities Grid */}
                {initialCities.length > 0 ? (
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 3 }}
                        spacing={["6vw", "2vw"]}
                        w="100%"
                    >
                        {initialCities.map((city) => (
                            <Box key={city.id} role="group">
                                <CityCard city={city} />
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Box textAlign="center" py="20">
                        <Text fontSize="lg" color="gray.500" fontFamily="lora">
                            No destinations available at the moment
                        </Text>
                        <Text fontSize="sm" color="gray.400" mt={2} fontFamily="raleway">
                            Please check back later or contact support
                        </Text>
                    </Box>
                )}

                {/* Coming Soon Section */}
                <Box textAlign="center" mt={["12vw", "4vw"]}>
                    <Text
                        fontSize={["4vw", "1.4vw"]}
                        fontFamily="raleway"
                        color="gray.500"
                        mb={["2vw", "1vw"]}
                    >
                        More destinations coming soon...
                    </Text>
                    <Text
                        fontSize={["3vw", "1vw"]}
                        fontFamily="raleway"
                        color="gray.400"
                    >
                        We're expanding our curated collection to more incredible destinations
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
};

export default CityGuide;