import { Box, Button, Flex, Text, useBreakpointValue, useToast } from '@chakra-ui/react'
import React from 'react'
import BasicCarousel from '../BasicCarousel'
import { ExperiencesDesc, ExperiencesIntro, TagResultsIntro, StaysIntro, StaysDesc, ToursIntro, ToursDesc, ExperiencesImages, StaysImages, ToursImages, InterestsIntro, RestaurantIntro, ShoppingIntro, EventsIntro } from '../../constants/stringConstants';
import { ChakraNextImage } from '../ChakraNextImage';
import { el } from 'date-fns/locale';

const LandingHeroSection = ({ type, title, total, locationData, locationType }) => {
    const Title = () => {
        if (type == "experiences") return "Postcard Experiences"
        else if (type == "stays") return "Postcard Stays"
        else if (type == "tag-results") return title
        else if (type == "interests") return "Postcard Interests"
        else if (type == "affiliation") return title
        else if (type == "dXs") return "Destination Experts"
        else if (type == "restaurant") return "Food and Beverages"
        else if (type == "shopping") return "Shopping"
        else if (type == "events") return "Events"
        else if (type == "cityguide") {
            if (locationType === 'region') {
                return `${locationData?.name}, ${locationData?.country?.name}`
            } else {
                return locationData?.name || "Food and Beverages"
            }
        }
        else if (type == "themes") return "Postcard Themes"
        else return "Postcard Tours"
    }
    const Intro = () => {
        if (type == "experiences") return ExperiencesIntro
        else if (type == "stays") return StaysIntro
        else if (type == "tag-results") return total + " Postcard Experiences"
        else if (type == "interests") return InterestsIntro
        else if (type == "affiliation") return ""
        else if (type == "dXs") return StaysIntro
        else if (type == "restaurant") return RestaurantIntro
        else if (type == "shopping") return ShoppingIntro
        else if (type == "events") return EventsIntro
        else if (type == "cityguide") {

            if (locationData?.description) {
                return locationData.description;
            }
            // Fallback to album count description
            const albumCount = total || 0;
            const pluralText = albumCount === 1 ? "album" : "albums";
            return `Discover curated ${pluralText} of conscious luxury experiences, stays, and local gems`
        }
        else return ToursIntro
    }
    const Image = () => {
        if (type == "experiences") return "/assets/landingpage/expe_4.jpg"
        else if (type == "stays") return "/assets/landingpage/stays-3.png"
        else if (type == "tag-results") return null
        else if (type == "interests") return "/assets/landingpage/interest_5.jpeg"
        else if (type == "affiliation") return "/assets/landingpage/stays-2.png"
        else if (type == "dXs") return "/assets/landingpage/stays-3.png"
        else if (type == "restaurant") return "/assets/landingpage/restaurant_cover.jpeg"
        else if (type == "shopping") return "/assets/landingpage/tours-3.png"
        else if (type == "cityguide") {

            return locationData?.image || "/assets/landingpage/cityguide1.png"
        }
        else return "/assets/landingpage/tours-3.png"
    }
    // const Title = type == "experiences" ? "Postcard Experiences" : type == "stays" ? "Postcard Stays" : type == "tag-results" ? title : "Postcard Tours";
    // const intro = type == "experiences" ? ExperiencesIntro : type == "stays" ? StaysIntro : type == "tag-results" ? total + " Postcard Experiences" : ToursIntro;
    const desc = type == "experiences" ? ExperiencesDesc : type == "stays" ? StaysDesc : ToursDesc;
    // const image = type == "experiences" ? "/assets/landingpage/experience-3.png" : type == "stays" ? "/assets/landingpage/stays-3.png" : type == "tag-results" ? null : "/assets/landingpage/tours-3.png";
    const image = Image()
    const isVideo = /\.(mp4|webm|ogg)$/i.test(image);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast()

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        // If mobile and navigator.share is supported, use the native share API
        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
        } else {
            // For desktop or when share is unavailable, copy the URL to clipboard
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        })
                    })
                    .catch((err) => {
                        // console.log('Error copying URL:', err);
                    });
            } catch (err) {
                // console.log('Error:', err);
            }
        }
    };

    return (
        <Flex flexDirection={"column"} w={"100%"} mb={["10vw", "3vw"]}>
            <Box p={["5.55vw", "2.083vw"]} borderRadius={["4.167vw", "2.083vw"]} w={"100%"} height={["70vh", "70vh", "85vh"]} position={"relative"}>
                {/* <BasicCarousel
                    images={images}
                    useBlackOverlay={true}
                />  */}
                {!image ?
                    <Box w={"100%"} h={"100%"} bg={"black"} borderRadius={["4.167vw", "2.083vw"]}></Box>
                    : isVideo ? (
                        <video
                            src={image}
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: "inherit",
                            }}
                            autoPlay
                            muted
                            loop
                        />
                    ) : (
                        <Box w={"100%"} h={"100%"} position={"relative"} borderRadius={["4.167vw", "2.083vw"]}>
                            <ChakraNextImage
                                src={image}
                                h={"100%"}
                                objectFit={"cover"}
                                borderRadius={["4.167vw", "2.083vw"]}
                                alt={type === "cityguide" ? `${locationData?.name} hero image` : "Landing Section Media"}
                                priority={true}
                                noLazy={true}
                                fallbackSrc="/assets/landingpage/cityguide1.png" // Fallback if locationData image fails
                            />
                            <Box w={"100%"} h={"35%"} bottom={0} mt={"auto"} position={"absolute"} borderRadius={["4.167vw", "2.083vw"]} top={0} bg={"linear-gradient(to top, #111111 2%, transparent)"}></Box>
                        </Box>
                    )}

                <Flex p={["5.55vw", "2.083vw"]} flexDirection={"column"} justifyContent={"flex-end"} position={"absolute"} top={0} left={0} w={"100%"} h={"100%"}>

                    {/* Desktop */}
                    <Flex display={{ base: "none", sm: "flex" }} flexDirection={"column"} w={"100%"} h={"100%"} py={["9.167vw", "6.25vw"]} px={["8.33vw", "5.83vw"]} justifyContent={"flex-end"}>

                        <Flex alignItems={"center"} justifyContent={"space-between"}>
                            <Text as="h1" fontSize={"5.14vw"} fontFamily={"lora"} fontStyle={"italic"} color={"white"} >{Title()}</Text>
                            <Button variant="none" fontSize={"1.6vw"} borderRadius={"2.64vw"} h={"3.96vw"} px={"4.375vw"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>
                                {type === "cityguide" ? "Share" : "Share Directory"}
                            </Button>
                        </Flex>

                        <Box w={"100%"} bg={"white"} h={"3px"} mt={"3.61vw"}></Box>

                        <Text as="h2" fontSize={"1.875vw"} mt={"2.29vw"} color={"#EFE9E4"} fontFamily={"raleway"} >{Intro()}</Text>
                    </Flex>

                    {/* Mobile */}
                    <Flex display={{ base: "flex", sm: "none" }} py={["9.167vw", "6.25vw"]} px={["8.33vw", "5.83vw"]} flexDirection={"column"}>
                        <Text as="h1" fontSize={"9.44vw"} lineHeight={"10.55vw"} fontFamily={"lora"} fontStyle={"italic"} color={"white"} >{Title()}</Text>

                        <Box w={"100%"} bg={"white"} h={"2px"} mt={"8.05vw"}></Box>

                        <Text as="h2" fontSize={"3.61vw"} lineHeight={"4.72vw"} mt={"5.55vw"} color={"#EFE9E4"} fontFamily={"raleway"} >{Intro()}</Text>

                        <Button variant="none" mt={"7.22vw"} fontSize={"3.33vw"} borderRadius={"5.55vw"} h={"8.33vw"} px={"9.167vw"} w={"fit-content"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>
                            {type === "cityguide" ? "Share" : "Share Directory"}
                        </Button>
                    </Flex>

                </Flex>

            </Box>

            {/* <Box w={"100%"} px={["13.89vw", "18.26vw"]} py={["15.55vw", "8.33vw"]}>
                <Flex flexDirection={"column"} w={"100%"}>
                    <Text fontSize={["7.5vw", "3.33vw"]} fontFamily={"lora"} fontStyle={"italic"} color={"primary_3"} >Welcome</Text>

                    <Box w={"100%"} bg={"primary_3"} h={["1px", "3px"]} mt={["7.22vw", "3vw"]}></Box>

                    <Text fontSize={["3.33vw", "1.67vw"]} lineHeight={["4.72vw", "2.36vw"]} mt={["5.833vw", "3.75vw"]} color={"primary_3"} fontFamily={"raleway"} >
                        {desc}
                    </Text>
                </Flex>
            </Box> */}
        </Flex>
    )
}

export default LandingHeroSection