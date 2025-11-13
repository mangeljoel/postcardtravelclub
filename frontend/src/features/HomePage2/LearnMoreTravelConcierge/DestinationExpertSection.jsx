import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useContext } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import DestinationExpertProfileCard from "../../DestinationExpert/DestinationExpertProfileCard";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import Link from "next/link";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import AlbumCard from "../CustomAlbumCard";

// Separate Text Card Component
const DestinationExpertsTextCard = () => {
    const router = useRouter();
    return (
        <Flex
            bg={"#111111"}
            w={["88.9vw", "37.45vw"]}
            h={["auto", "30.15vw"]}
            mx={["5.55vw", "1.56vw"]}
            mr={["5.55vw", "0"]}
            borderRadius={["3.611vw", "1.53vw"]}
            flexDirection={"column"}
            p={"5.56vw"}
            pl={["10vw", "5.56vw"]}
            py={["18.65vw", "0vw"]}
            justifyContent="center"
            gap={["7vw", "4vw"]}
            flexShrink={0}
        >
            <Text
                fontFamily="raleway"
                fontWeight={500}
                fontSize={["5.833vw", "2.25vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                color={"#EFE9E4"}
                textAlign={"left"}
            >
                <Text
                    as="span"
                    fontFamily="lora"
                    fontStyle="italic"
                    fontSize={["6.38vw", "2.35vw"]}
                    lineHeight={["6.67vw", "2.65vw"]}
                >
                    Browse local experiences that match your personal interests and hobbies.
                </Text>
                {/* for custom itinerary design. */}
            </Text>
            <Button
                variant={"none"}
                color={"white"}
                borderColor={"white"}
                border={"2px"}
                w={["63.05vw", "24.08vw"]}
                h={["8.05vw", "3.06vw"]}
                textAlign={"center"}
                borderRadius={["5.55vw", "2.08vw"]}
                fontFamily={"raleway"}
                fontWeight={600}
                fontSize={["3.33vw", "1.22vw"]}
                lineHeight={["10vw", "3.77vw"]}
                _hover={{ background: "#EFE9E4", color: "#111111" }}
                onClick={() => window.open("/experiences/interests", "_blank")}
            >
                View All &nbsp;
                <RightArrowIcon
                    style={{ paddingTop: "1%" }}
                    h={["8.05vw", "3.06vw"]}
                    width={["2.77vw", "1.5vw"]}
                />
            </Button>
        </Flex>
    )
};

const DestinationExpertsSection = ({ destinationExperts }) => {
    const { profile } = useContext(AppContext);
    const scrollContainerRef = useRef(null);
    const router = useRouter();
    const interests = [
        { region: 'Hiking', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80', link: "/experiences/interests/Hiking" },
        { region: 'Botanical Art', imageUrl: 'https://thvnext.bing.com/th/id/OIP.1M1fgb-H6VYSuwFvL2FgHAHaJ1?w=208&h=276&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3&ucfimg=1', link: "/experiences/interests/Botanical%20Art" },
        { region: 'Birding', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', link: "/experiences/interests/Birding" },
        ,
    ];
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = scrollContainerRef.current.clientWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;

            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollContainerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });
            } else {
                scrollContainerRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth",
                });
            }
        }
    };

    const data = destinationExperts;

    return (
        <Flex
            width="100%"
            h={"auto"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
        // gap={["3.611vw", 0]}
        >
            {/* Text card outside scroll for mobile only */}
            <Box display={["block", "none"]}>
                <DestinationExpertsTextCard />
            </Box>

            <Box position={"relative"} w="100%" >
                {/* Scroll Right Button (desktop only) */}
                {/* <Box
                    width="fit-content"
                    position={"absolute"}
                    cursor={"pointer"}
                    overflowY={"hidden"}
                    top={"47%"}
                    right={"2%"}
                    zIndex={10}
                    onClick={scrollRight}
                    display={["none", "none", "block"]}
                >
                    <Box
                        opacity={1}
                        borderRadius={"50%"}
                        backdropFilter={"blur(5px)"}
                        cursor={"pointer"}
                        w={"4.167vw"}
                        h={"4.167vw"}
                        transition="transform 0.2s ease-in-out"
                    >
                        <BsArrowRightCircle size={"full"} color="white" />
                    </Box>
                </Box> */}

                <Flex
                    overflowX={"auto"}
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                // pl={["5.55vw", "0"]}
                // pr={["5.55vw", "1.56vw"]}
                // py={["4.44vw", "3.33vw"]}
                >

                    {/* Text card inside scroll for desktop */}
                    <Box display={["none", "block"]} py={["4.44vw", "3.33vw"]}>
                        <DestinationExpertsTextCard />
                    </Box>
                    <Flex
                        overflowX={"auto"} // hide horizontal scroll on mobile
                        className="no-scrollbar"
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["5vw", "1vw"]}
                        py={["8.5vw", "3.33vw"]}
                    >
                        {/* Cards */}
                        {interests.map((story, index) => (
                            <AlbumCard key={index} story={story} />
                        ))}
                        {/* <ChakraNextImage
                            src="/assets/homepage/cards/destination_experts.png"
                            h={["100vw", "30vw"]}
                            minH={["297px"]}
                            w={["100%", "314px", "314px", "25vw"]}
                            minW={["85vw", "35vw", "30vw", "25vw"]}
                            objectFit="cover"
                            borderRadius={["4.167vw", "1.597vw"]}
                            alt="View All Experts"
                            priority
                            noLazy
                            cursor="pointer"
                            onClick={() => {
                                window.open("/destination-experts", "_blank")
                            }}
                        /> */}
                        {/* Extra Card
                        <Flex
                            flexDirection={"column"}
                            h={["100vw", "30vw"]}
                            minH={["297px"]}
                            w={["100%", "314px", "314px", "25vw"]}
                            minW={["85vw", "35vw", "30vw", "25vw"]}
                            borderRadius={["4.167vw", "1.597vw"]}
                            bg={"#2c67b1"}
                            mx={"auto"}
                            position={"relative"}
                        >
                            <Box
                                borderRadius={["4.167vw", "1.597vw"]}
                                w="100%"
                                h="100%"
                                position="relative"
                            >
                                <Box
                                    w="100%"
                                    h="100%"
                                    position="relative"
                                    borderRadius={["4.167vw", "1.597vw"]}
                                >
                                    <ChakraNextImage
                                        src="/assets/landingpage/stays-3.png"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        borderRadius={["4.167vw", "1.597vw"]}
                                        alt="View All Experts"
                                        priority
                                        noLazy
                                    />

                                    <Box
                                        w="100%"
                                        h="35%"
                                        bottom={0}
                                        mt="auto"
                                        position="absolute"
                                        top={0}
                                        bg="linear-gradient(to top, #111111 2%, transparent)"
                                        borderRadius={["4.167vw", "1.597vw"]}
                                    />
                                </Box>

                                {/* Overlay Content */}
                        {/* <Flex
                            p={["7.8vw", "3.55vw"]}
                            flexDirection="column"
                            justifyContent="center"
                            alignItems={"center"}
                            zIndex={10}
                            position="absolute"
                            top={0}
                            left={0}
                            w="100%"
                            h="100%"
                        >
                            <Text
                                as="h1"
                                fontSize={["9.88vw", "3.44vw"]}
                                lineHeight={["10.88vw", "4.55vw"]}
                                fontFamily="lora"
                                fontStyle="italic"
                                color="white"
                            >
                                See All Destination Experts
                            </Text>

                            <Button
                                variant="none"
                                mt={["6vw", "2.22vw"]}
                                borderRadius="5.55vw"
                                h={["8.33vw", "2.5vw"]}
                                px={["10.167vw", "9.167vw"]}
                                w={["55vw", "3vw"]}
                                border="2px"
                                borderColor="white"
                                color="white"
                                fontFamily={"raleway"}
                                fontWeight={600}
                                fontSize={["3.05vw", "0.833vw"]}
                                lineHeight={["13.89vw", "3.82vw"]}
                                _hover={{ bg: "white", color: "#111111" }}
                                onClick={() => { router.push("/destination-experts") }}
                            >
                                View All
                            </Button>
                        </Flex>
                    </Box>
                </Flex> */}
                    </Flex>

                </Flex >
            </Box >
        </Flex >
    );
};

export default DestinationExpertsSection;
