import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useContext, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
// import FNDCard from "../../../patterns/Cards/FNDCard";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { CityCard } from "../../../patterns/Cards/CityCard";

const CityGuideTextCard = () => {
    const router = useRouter();
    return (<Flex
        bg={"#111111"}
        w={["88.9vw", "37.45vw"]}
        h={["auto", "30.525vw"]}
        minH={["280px", "420px"]}
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
            Explore{" "}
            <Text
                as="span"
                fontFamily="lora"
                fontStyle="italic"
                fontSize={["6.38vw", "2.35vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
            >
                curated city-guides{" "}
            </Text>
            for places to eat, shop and things to do.
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
        // _hover={{ background: "#EFE9E4", color: "primary_3" }}
        // onClick={() => router.push("/cityguide")}
        >
            Coming Soon&nbsp;
            {/* <RightArrowIcon
                style={{ paddingTop: "1%" }}
                h={["8.05vw", "3.06vw"]}
                width={["2.77vw", "1.5vw"]}
            /> */}
        </Button>
    </Flex>
    )
};

const ComingSoonCard = ({ city }) => {
    return (
        <Box
            cursor="default"
            borderRadius={["4vw", "1.5vw"]}
            overflow="hidden"
            position="relative"
            h={["auto", "30.525vw"]}
            minH={["280px", "420px"]}
            w={["85vw", "314px", "314px", "25vw"]}
            minW={["85vw", "314px", "314px", "25vw"]}
            role="presentation"
            aria-label={`Coming soon: ${city.name}`}
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

                {/* ✅ Coming Soon label */}
                <Text
                    fontSize={["4vw", "1.5vw"]}
                    fontWeight="600"
                    fontFamily="raleway"
                    opacity={0.9}
                >
                    Coming Soon
                </Text>
            </Flex>
        </Box>
    );
};


const CityGuideSection = ({ featuredCityGuides }) => {
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

    const data = featuredCityGuides;

    return (
        <Flex
            width="100%"
            h={"auto"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
        // gap={["3.611vw", 0]}
        >
            {/* ---------- MOBILE VIEW (VERTICAL) ---------- */}
            <Box display={["block", "none"]}>
                <CityGuideTextCard />
            </Box>

            {/* ---------- DESKTOP/TABLET VIEW (HORIZONTAL) ---------- */}
            <Box position={"relative"} w={["100%"]}>
                {/* Scroll button */}
                <Box
                    width="fit-content"
                    position={"absolute"}
                    cursor={"pointer"}
                    overflowY={"hidden"}
                    top={["47%"]}
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
                        overflowY={"hidden"}
                        w={"4.167vw"}
                        h={"4.167vw"}
                        transition="transform 0.2s ease-in-out"
                    >
                        <BsArrowRightCircle size={"full"} color="white" />
                    </Box>
                </Box>

                <Flex
                    overflowX={"auto"}
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                // pl={["5.55vw", "0"]}
                // pr={["5.55vw", "1.56vw"]}
                // py={["4.44vw", "3.33vw"]}
                >


                    {/* Text card appears first in scroll */}
                    <Box display={["none", "block"]} py={["4.44vw", "3.33vw"]}>
                        <CityGuideTextCard />
                    </Box>

                    <Flex
                        h="100%"
                        overflowX={"auto"} // hide horizontal scroll on mobile
                        className="no-scrollbar"
                        overflowY={"hidden"}
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["0vw", "1vw"]}
                        pt={["8.5vw", "3.33vw"]}
                    >

                        {data.map((city, index) => (
                            <CityCard
                                key={index}
                                city={city}
                            />
                        ))}
                        <ComingSoonCard
                            city={{
                                name: "Bengaluru",
                                country: "India",
                                image: "/assets/cities/banglore.jpg", // replace with your dummy img
                            }}
                        />

                        <ComingSoonCard
                            city={{
                                name: "Mumbai",
                                country: "India",
                                image: "/assets/cities/mumbai.jpg", // replace with your dummy img
                            }}
                        />
                        <ComingSoonCard
                            city={{
                                name: "Delhi",
                                country: "India",
                                image: "/assets/cities/delhi.jpg", // replace with your dummy img
                            }}
                        />


                        <Flex flexDirection={"column"}
                            w={["100%", "314px", "314px", "25vw"]}
                            minW={["85vw", "35vw", "30vw", "25vw"]}
                            h={["auto", "30.525vw"]}
                            minH={["280px", "420px"]}
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
                                        src="/assets/landingpage/restaurant_cover.jpeg"
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
                                        Postcard City-Guides
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
                                    // _hover={{ bg: "white", color: "#111111" }}
                                    // onClick={() => { router.push("/food-and-beverages") }}
                                    >
                                        Coming Soon
                                    </Button>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default CityGuideSection;
