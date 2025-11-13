import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import ImageGallery from "./ImageGallery";
import { useRouter } from "next/router";

const PartnerSection = ({ featuredAlbums = [] }) => {
    const router = useRouter();
    return (
        <Flex
            flexDirection={"column"}
            // width={"100%"}
            // ml={["35px", "138px"]}
            // mr={["20px", "25px", "30px"]}
            width={"100%"}
            mx="auto"
        >
            <Flex
                flexDirection={["column", "column", "row"]}
                w={["100%", "80%"]}
                mx={["0", "8.65vw"]}
                px={["11.55vw", "0"]}
                justify={"space-between"}
                gap={6}
            >
                <Text
                    fontFamily={"raleway"}
                    fontWeight={500}
                    fontSize={["5.83vw", "2.81vw"]}
                    lineHeight={["6.67vw", "3.54vw"]}
                    color={"#307FE2"}
                >
                    Discover boutique properties that{" "}
                    <Text
                        as="span"
                        fontSize={["6.4vw", "3.02vw"]}
                        fontFamily="lora"
                        fontWeight={400}
                        fontStyle="italic"
                    >
                        curate
                    </Text>{" "}
                    immersive experiences and{" "}
                    <Text
                        as="span"
                        fontSize={["6.4vw", "3.02vw"]}
                        fontFamily="lora"
                        fontWeight={400}
                        fontStyle="italic"
                    >
                        advance responsible tourism.
                    </Text>
                </Text>

                <Button
                    variant={"none"}
                    borderColor={"#307FE2"}
                    color={"#307FE2"}
                    border={"2px"}
                    width={["fit-content", "24.58vw"]}
                    minW={["256px", "300px"]}
                    height={["8.33vw", "3.125vw"]}
                    minH={["35px", "50px"]}
                    maxH={["40px", "60px"]}
                    my={[1, 3]}
                    borderRadius={["24px", "40px"]}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["14px", "21px"]}
                    lineHeight={["14px", "27px"]}
                    gap={5}
                    _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                    onClick={() => router.push("/stays")}
                >
                    Boutique Stays <RightArrowIcon width={22} />
                </Button>
                {/* <Button
                        variant={"none"}
                        borderColor={"#307FE2"}
                        color={"#307FE2"}
                        border={"2px"}
                        width={["100%", "24.58vw"]}
                        minW={["256px", "300px"]}
                        height={["8.33vw", "3.125vw"]}
                        minH={["35px", "50px"]}
                        maxH={["40px", "60px"]}
                        my={[1, 3]}
                        borderRadius={["24px", "40px"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["14px", "21px"]}
                        lineHeight={["14px", "27px"]}
                        gap={5}
                        _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                        onClick={() => router.push("/tours")}
                    >
                        Designer Tours <RightArrowIcon width={22} />
                    </Button> */}
            </Flex>

            <ImageGallery featuredAlbums={featuredAlbums} />
        </Flex>
    );
};

export default PartnerSection;
