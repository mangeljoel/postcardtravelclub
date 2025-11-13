import { Text, Flex, Box, Button } from "@chakra-ui/react";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { useRouter } from "next/router";
import { useState } from "react";
const GuidedSearch = (props) => {
    const { showHeading } = props;
    const countryList = [
        "India",
        "Kenya",
        "Costa Rica",
        "Peru",
        "Italy",
        "Namibia"
    ];
    const interests = [
        "Wellness Experience",
        "Local Food",
        "Wildlife",
        "Mountain Adventure",
        "Birding"
    ];
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    return (
        <Box mx="auto" my={["1em", "3em"]} textAlign={"center"} w="100%">
            <Box mx="auto">
                <Text
                    fontSize={["28px", "30px"]}
                    fontWeight={700}
                    textAlign={["center", "center"]}
                    color="white"
                    my="1em"
                // px="5%"
                >
                    Let's explore...
                </Text>
                <Flex wrap={"wrap"} justify={"center"}>
                    {/* {countryList?.length > 0 &&
                        countryList.map((count, index) => {
                            return (
                                <Text
                                    mr="0.5em"
                                    pb="2px!important"
                                    mb="1em"
                                    cursor="pointer"
                                    bg={
                                        index === selectedIndex
                                            ? "primary_1"
                                            : "white"
                                    }
                                    color={
                                        index === selectedIndex
                                            ? "white"
                                            : "primary_1"
                                    }
                                    borderColor="primary_1"
                                    borderWidth={"2px"}
                                    borderRadius="43px"
                                    padding="1px 18px"
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        router.push(
                                            "/immersive-experiences?country=" +
                                                count
                                        );
                                    }}
                                    fontSize={["14", "18px"]}
                                    fontWeight={500}
                                    key={"countryList" + index}
                                >
                                    {count}
                                </Text>
                            );
                        })} */}
                    {interests?.length > 0 &&
                        interests.map((interest, index) => {
                            return (
                                <Text
                                    mr="0.5em"
                                    pb="2px!important"
                                    mb="1em"
                                    cursor="pointer"
                                    bg={
                                        index === selectedIndex
                                            ? "primary_1"
                                            : "white"
                                    }
                                    color={
                                        index === selectedIndex
                                            ? "white"
                                            : "primary_1"
                                    }
                                    borderColor="primary_1"
                                    borderWidth={"2px"}
                                    borderRadius="43px"
                                    padding="1px 18px"
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        router.push(
                                            "/immersive-experiences?interest=" +
                                            interest
                                        );
                                    }}
                                    fontSize={["14", "18px"]}
                                    fontWeight={500}
                                    key={"interestList" + index}
                                >
                                    {interest}
                                </Text>
                            );
                        })}
                </Flex>
                <Button
                    mt="2em"
                    onClick={() => router.push("/immersive-experiences")}
                >
                    Try Postcard Search!
                </Button>
            </Box>
        </Box>
    );
};
export default GuidedSearch;
