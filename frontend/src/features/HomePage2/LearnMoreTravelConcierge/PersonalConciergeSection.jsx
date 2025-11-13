import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useRef } from "react";
import LogoGallery from "../ConciergeSection/LogoGallery";
import AlbumCard from "../CustomAlbumCard";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";

const TextCard = () => (
    <Flex
        bg={"primary_1"}
        w={["88.9vw", "37.45vw"]}
        h={["auto", "30vw"]}
        mx={["5.55vw", "1.56vw"]}
        mr={["5.55vw", "0"]}
        borderRadius={["3.611vw", "1.53vw"]}
        flexDirection={"column"}
        p={"5.56vw"}
        pl={["10vw", "5.56vw"]}
        py={["25.65vw", "0vw"]}
        justifyContent="center"
        gap={["4vw", "2vw"]}
        flexShrink={0}
    >
        <Text
            fontFamily={"raleway"}
            fontWeight={500}
            fontSize={["5.833vw", "2.25vw"]}
            lineHeight={["6.67vw", "2.65vw"]}
            color={"#EFE9E4"}
        >

            <Text
                as="span"
                fontSize={["6.38vw", "2.35vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                fontFamily="lora"
                fontStyle="italic"
            >
                Explore immersive experiences that showcase local stories.
            </Text>
            {/* with your personal concierge manager. */}
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
            _hover={{ background: "#EFE9E4", color: "primary_3" }}
            onClick={() => window.open("/experiences/countries", "_blank")}
        >
            View All &nbsp;

            <RightArrowIcon
                style={{ paddingTop: "1%" }}
                h={["8.05vw", "3.06vw"]}
                width={["2.77vw", "1.5vw"]}
            />
        </Button>

    </Flex>
);

const PersonalConciergeSection = () => {
    const scrollContainerRef = useRef(null);
    const regions = [
        {
            region: "Rajasthan",
            location: "India",
            imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
            link: "/experiences/countries/India?region=Rajasthan"
        },
        {
            region: "Bali",
            location: "Indonesia",
            imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
            link: "/experiences/countries/Indonesia?region=Bali"
        },
        {
            region: "Peru",
            location: "Peru",
            imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
            link: "/experiences/countries/Peru"
        }
    ];


    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

            scrollContainerRef.current.scrollTo({
                left: atEnd ? 0 : scrollLeft + 300,
                behavior: "smooth",
            });
        }
    };

    return (
        <Flex
            flexDirection="column"
            gap={["12.22vw", "4.42vw"]}
            // mt="20px"
            mb={["14.16vw", "0vw"]}
            w="100%"
        >
            {/* ---------- MOBILE VIEW (STACKED) ---------- */}
            <Box display={["block", "none"]}>
                <TextCard />
                <Flex
                    flexDirection="column"
                    // gap="4vw"
                    // alignItems="center"
                    // justifyContent="center"
                    mt="6vw"
                >
                    <Flex
                        overflowX={"auto"} // hide horizontal scroll on mobile
                        className="no-scrollbar"
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["5vw", "1vw"]}
                    // py={["8.5vw", "3.33vw"]}
                    >
                        {/* Cards */}
                        {regions.map((story, index) => (
                            <AlbumCard key={index} story={story} />

                        ))}
                    </Flex>
                </Flex>
            </Box>

            {/* ---------- DESKTOP/TABLET VIEW (HORIZONTAL SCROLL) ---------- */}
            <Box position="relative" w="100%" display={["none", "block"]}>
                {/* Scroll Right Button */}
                {/* <Box
                    width="fit-content"
                    position="absolute"
                    top="47%"
                    right="2%"
                    zIndex={10}
                    cursor="pointer"
                    onClick={scrollRight}
                >
                    <Box
                        borderRadius="50%"
                        backdropFilter="blur(5px)"
                        w="4.167vw"
                        h="4.167vw"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <BsArrowRightCircle size="100%" color="white" />
                    </Box>
                </Box> */}

                {/* Entire section scrolls: text card + logo gallery */}
                <Flex
                    // overflowX={"auto"}
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1.56vw"]}
                    // pl={["5.55vw", "0"]}
                    // pr={["5.55vw", "1.56vw"]}
                    py={["4.44vw", "3.33vw"]}
                >

                    {/* Text card inside scroll for tablet/desktop only */}
                    <Box display={["none", "block"]}>
                        <TextCard />
                    </Box>
                    <Flex
                        overflowX={"auto"} // hide horizontal scroll on mobile
                        className="no-scrollbar"
                        // overflowY={"hidden"}
                        // gap={["3.88vw", "1.56vw"]}
                        // pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0vw"]}
                        ref={scrollContainerRef}
                    >
                        <Flex
                            overflowX={"auto"} // hide horizontal scroll on mobile
                            className="no-scrollbar"
                            gap={["3.88vw", "1.56vw"]}
                            pr={["5.55vw", "1.56vw"]}
                            pl={["5.55vw", "0.56vw"]}
                            ref={scrollContainerRef}
                            alignItems="stretch"
                            pb={["5vw", "1vw"]}
                        // py={["8.5vw", "3.33vw"]}
                        >
                            {/* Cards */}
                            {regions.map((story, index) => (
                                <AlbumCard key={index} story={story} />

                            ))}

                            {/* <ChakraNextImage
                                src="/assets/homepage/cards/postcard_stays.png"
                                w={["100%", "314px", "314px", "25vw"]}
                                minW={["85vw", "35vw", "30vw", "25vw"]}
                                h={"30.525vw"}   // adjust based on AlbumCard height
                                minH={["420px"]}
                                objectFit="cover"
                                borderRadius={["4.167vw", "1.597vw"]}
                                alt="View All Stays"
                                priority
                                noLazy
                                cursor="pointer"
                                onClick={() => { window.open("/stays", "_blank"); }}
                            /> */}


                            {/* <Flex
                            flexDirection={"column"}
                            w={["100%", "314px", "314px", "25vw"]}
                            minW={["85vw", "35vw", "30vw", "25vw"]}
                            h={"30.525vw"}   // adjust based on AlbumCard height
                            minH={["420px"]}
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
                                        alt="View All Albums"
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
                                        Explore All Stays
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
                                        onClick={() => { router.push("/stays") }}
                                    >
                                        View All
                                    </Button>
                                </Flex>
                            </Box>
                        </Flex> */}
                        </Flex>  {/* <LogoGallery /> */}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default PersonalConciergeSection;