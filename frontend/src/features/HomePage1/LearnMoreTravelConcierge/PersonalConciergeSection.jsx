import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import LogoGallery from "../ConciergeSection/LogoGallery";
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
                Save hours of research{" "}

            </Text>
            with your personal concierge manager.
        </Text>

        {/* <Button
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
            onClick={() => router.push("/stays")}
        >
            Postcard Stays &nbsp;
            <RightArrowIcon
                style={{ paddingTop: "1%" }}
                h={["8.05vw", "3.06vw"]}
                width={["2.77vw", "1.5vw"]}
            />
        </Button> */}
    </Flex>
);

const PersonalConciergeSection = () => {
    const scrollContainerRef = useRef(null);

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
                    <LogoGallery />
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
                        <LogoGallery />
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default PersonalConciergeSection;
