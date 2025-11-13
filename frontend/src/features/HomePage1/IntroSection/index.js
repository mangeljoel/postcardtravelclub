import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const IntroSection = () => {
    return (
        <Flex
            color={"#307FE2"}
            my={["7.24vw", 0, 0, "3vw"]}
            // ml="auto"
            // mr={["-5vw", "auto"]}
            //mt="3vw"
            width={["100%", "80%"]} // Adjust width as needed
            overflowX="scroll"
            className="no-scrollbar"
            justifyContent={["start", "center"]}
            px={["11.55vw", "0"]}
            pb={["2.55vw", "1vw"]}
        >
            <Box
                width={["100%", "50%"]}
                minW={["100%", "auto"]}
                position={"relative"}
            >
                <Text
                    fontFamily="raleway"
                    fontWeight={600}
                    // fontSize={["1.125rem", "1.68rem"]}
                    fontSize={["5vw", "1.667vw"]}
                >
                    Do you seek
                </Text>
                <Box
                    borderTop="2px"
                    position={"relative"}
                    borderStyle={"dashed"}
                    my={[6, 8]}
                >
                    <Box
                        position={"absolute"}
                        top={["-9px", "-12px"]}
                        width={["15px", "23px"]}
                        height={["15px", "23px"]}
                        borderColor={"primary_3"}
                        borderWidth={"2px"}
                        borderRadius={"50%"}
                        bg={"#efe9e4"}
                    ></Box>
                    {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                </Box>
                <Text
                    fontFamily="raleway"
                    fontWeight={500}
                    // fontSize={["0.875rem", "1.31rem"]}
                    // lineHeight={["1.06rem", "1.68rem"]}
                    fontSize={["3.75vw", "1.25vw"]}
                    lineHeight={["4.722vw", "1.563vw"]}
                    pr={["16", "6rem"]}
                >
                    <Text as="span" fontWeight={600}>
                        Luxury travel experiences
                    </Text>{" "}
                    that showcase{" "}
                    <Text as="span" fontWeight={600}>
                        community, culture, history, food, nature, and wildlife?
                    </Text>
                </Text>
            </Box>
            <Box
                width={["100%", "50%"]}
                minW={["100%", "auto"]}
                position={"relative"}
            >
                <Text
                    fontFamily="raleway"
                    fontWeight={600}
                    // fontSize={["1.125rem", "1.68rem"]}
                    fontSize={["5vw", "1.667vw"]}
                >
                    Do you want
                </Text>
                <Box
                    borderTop="2px"
                    position={"relative"}
                    borderStyle={"dashed"}
                    height={"1px"}
                    my={[6, 8]}
                >
                    <Box
                        position={"absolute"}
                        top={["-9px", "-12px"]}
                        width={["15px", "23px"]}
                        height={["15px", "23px"]}
                        borderColor={"primary_3"}
                        borderWidth={"2px"}
                        borderRadius={"50%"}
                        bg={"#efe9e4"}
                    ></Box>
                    {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                </Box>
                <Text
                    fontFamily="raleway"
                    fontWeight={500}
                    // fontSize={["0.875rem", "1.31rem"]}
                    // lineHeight={["1.06rem", "1.68rem"]}
                    fontSize={["3.75vw", "1.25vw"]}
                    lineHeight={["4.722vw", "1.563vw"]}
                    pr={["16", "6rem"]}
                >
                    To make{" "}
                    <Text as="span" fontWeight={600}>
                        {" "}
                        a positive impact{" "}
                    </Text>{" "}
                    in the{" "}
                    <Text as="span" fontWeight={600}>
                        places you visit{" "}
                    </Text>
                    and the{" "}
                    <Text as="span" fontWeight={600}>
                        people you meet?
                    </Text>{" "}
                </Text>
            </Box>
            <Box
                width={["100%", "40%"]}
                minW={["100%", "auto"]}
                position={"relative"}
            >
                <Text
                    fontFamily="raleway"
                    fontWeight={600}
                    // fontSize={["1.125rem", "1.68rem"]}
                    fontSize={["5vw", "1.667vw"]}
                >
                    Then you are
                </Text>
                <Box
                    borderTop="2px"
                    position={"relative"}
                    borderStyle={"dashed"}
                    my={[6, 8]}
                >
                    <Box
                        position={"absolute"}
                        top={["-9px", "-12px"]}
                        width={["15px", "23px"]}
                        height={["15px", "23px"]}
                        borderColor={"primary_3"}
                        borderWidth={"2px"}
                        borderRadius={"50%"}
                        bg={"#efe9e4"}
                    ></Box>
                    {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                </Box>
                <Text
                    fontFamily="lora"
                    fontStyle={"italic"}
                    fontWeight={400}
                    // fontSize={["2.18rem", "3.25rem"]} //35
                    // lineHeight={["2.37rem", "3.25rem"]} //38
                    fontSize={["9.72vw", "2.6vw"]}
                    lineHeight={["10.55vw", "3vw"]}
                >
                    a conscious
                </Text>
                <Text
                    fontFamily="raleway"
                    fontWeight={500}
                    // fontSize={["2rem", "3rem"]} //32
                    // lineHeight={["2.37rem", "3rem"]} //38
                    fontSize={["9.17vw", "2.6vw"]}
                    lineHeight={["10.55vw", "3vw"]}
                >
                    luxury traveller
                </Text>
            </Box>
        </Flex>
    );
};

export default IntroSection;
