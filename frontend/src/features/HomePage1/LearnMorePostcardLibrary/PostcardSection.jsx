import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useContext, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import Postcard from "../../TravelExplore/TravelPostcardList/Postcard";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import CustomPostcard from './CustomPostcard';
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";

// Reusable text card component
const PostcardTextCard = () => {
    const router = useRouter();
    return (
        <Flex
            bg={"primary_3"}
            w={["88.9vw", "37.45vw"]}
            h={["auto", "36.5vw"]}
            minH={["10px", "518px"]}
            mx={["5.55vw", "1.56vw"]}
            mr={["5.55vw", "0"]}
            borderRadius={["3.611vw", "1.53vw"]}
            flexDirection={"column"}
            p={"5.56vw"}
            pl={["10vw", "5.56vw"]}
            py={["18.65vw", "0vw"]}
            justifyContent="center"
            gap={["7vw", "4vw"]}
            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
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
                    Collect postcards{" "}
                </Text>
                and build your wish-list for conscious luxury travel.
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
                _hover={{ background: "#EFE9E4", color: "primary_1" }}
                onClick={() => window.open("/experiences", "_blank")}
            >
                Postcard Experiences &nbsp;
                <RightArrowIcon
                    style={{ paddingTop: "1%" }}
                    h={["8.05vw", "3.06vw"]}
                    width={["2.77vw", "1.5vw"]}
                />
            </Button>
        </Flex>
    )
};

const PostcardSection = ({ featuredPostcards }) => {
    console.log("featured postcards", featuredPostcards)
    const { profile } = useContext(AppContext);
    const scrollContainerRef = useRef(null);
    const router = useRouter();
    const [firstLoad, setFirstLoad] = useState(true);


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

    const data = featuredPostcards;

    return (
        <Flex
            width="100%"
            h={"auto"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
        // gap={["3.611vw", 0]}
        >
            {/* ---------- MOBILE VIEW: Text card on top ---------- */}
            <Box display={["block", "none"]}>
                <PostcardTextCard />
            </Box>

            {/* ---------- ALL VIEWS: Scrollable postcard row ---------- */}
            <Box position={"relative"} w={"100%"}>
                {/* Scroll Button (desktop only) */}
                {/* <Box
                    width="fit-content"
                    position={"absolute"}
                    top="47%"
                    right="2%"
                    zIndex={10}
                    display={["none", "none", "block"]}
                    onClick={scrollRight}
                    cursor="pointer"
                >
                    <Box
                        opacity={1}
                        borderRadius={"50%"}
                        backdropFilter={"blur(5px)"}
                        w={"4.167vw"}
                        h={"4.167vw"}
                        transition="transform 0.2s ease-in-out"
                    >
                        <BsArrowRightCircle size="100%" color="white" />
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

                    {/* Desktop only: show text card inside scroll */}
                    <Box display={["none", "block"]} py={["4.44vw", "3.33vw"]}>
                        <PostcardTextCard />
                    </Box>
                    <Flex
                        overflowX={"auto"} // hide horizontal scroll on mobile
                        className="no-scrollbar"
                        overflowY={"hidden"}
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["5vw", "1vw"]}
                        py={["8.5vw", "3.33vw"]}
                    >

                        {data.map((story, index) => (
                            <Postcard
                                postcard={story}
                                isFirstItem={index === 0}
                                firstLoad={index === 0 ? firstLoad : false}
                                setFirstLoad={index === 0 ? setFirstLoad : () => { }}
                            />
                        ))}

                        <ChakraNextImage
                            src="/assets/homepage/cards/postcard_experiences.png"
                            h={["518px", "530px", "530px", "36.5vw"]}
                            minH={["500px", "530px", "530px", "36.5vw"]}
                            w={["100%", "314px", "25vw", "25vw"]}
                            minW={["85vw", "25vw"]}
                            borderRadius={["4.167vw", "1.597vw"]}
                            alt="View All Experiences"
                            priority
                            noLazy
                            cursor="pointer"
                            objectFit="cover"
                            onClick={() => {
                                window.open("/experiences", "_blank")
                            }}
                        />



                        {/* <Flex flexDirection={"column"}
                            w={["100%", "314px", "314px", "25vw"]}
                            minW={["85vw", "35vw", "30vw", "25vw"]}
                            h={["auto", "36vw"]}
                            minH={["10px", "518px"]}
                            borderRadius={["4.167vw", "1.597vw"]}
                            bg={"#2c67b1"}
                            mx={"auto"}
                            position={"relative"}>
                            <Box
                                // p="5.55vw"
                                borderRadius={["4.167vw", "1.597vw"]}
                                w="100%"
                                height="100%"
                                position="relative"
                            >
                                <Box
                                    w="100%"
                                    h="100%"
                                    position="relative"
                                    borderRadius={["4.167vw", "1.597vw"]}
                                >
                                    <ChakraNextImage
                                        src="/assets/landingpage/expe_4.jpg"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        borderRadius={["4.167vw", "1.597vw"]}
                                        alt="Landing Section Media"
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

                                <Flex
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
                                        Postcard Experiences
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
                                        onClick={() => { router.push("/food-and-beverages") }}
                                    >
                                        View All
                                    </Button>
                                </Flex>
                            </Box>
                        </Flex> */}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default PostcardSection;
