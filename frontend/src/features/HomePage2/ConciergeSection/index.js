import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import LogoGallery from "./LogoGallery";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";

const ConciergeSection = () => {
    return (
        <Flex
            flexDirection={"column"}
            gap={["12.22vw", "4.42vw"]}
            mt={"20px"}
            mb={["14.16vw", "6.5vw"]}
            // mx="auto"
            w="100%"
            // mr={["20px", "25px", "30px"]}
            // alignItems={{ base: "flex", xl: "center" }}
        >
            <Flex
                flexDirection={"column"}
                gap={[8, 10]}
                w={["100%", "82vw"]}
                // mx={["5vw", "auto"]}
                mx={["0", "8.65vw"]}
                px={["11.55vw", "0"]}
                // pr = 6.4 vw
            >
                <Text
                    fontFamily={"raleway"}
                    fontWeight={500}
                    // fontSize={["21px", "48px"]}
                    // lineHeight={["24px", "56px"]}
                    fontSize={["5.83vw", "2.81vw"]}
                    lineHeight={["6.67vw", "3.33vw"]}
                    color={"#307FE2"}
                >
                    Learn more about{" "}
                    <Text
                        as="span"
                        // fontSize={["23px", "52px"]}
                        // lineHeight={["24px", "58px"]}
                        fontSize={["6.4vw", "3.02vw"]}
                        lineHeight={["6.67vw", "3.33vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                    >
                        Postcard Travel Concierge
                    </Text>
                </Text>
                {/* <Button
                    variant={"none"}
                    borderColor={"#307FE2"}
                    color={"#307FE2"}
                    textAlign={"center"}
                    border={"2px"}
                    height={["30px", "50px"]}
                    width={["238px", "475px"]}
                    borderRadius={["20px", "40px"]}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["12px", "20px"]}
                    lineHeight={["37px", "20px"]}
                    //  gap={5}
                    _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                >
                    Postcard Concierge - Coming Soon!
                </Button> */}
            </Flex>

            {/* <LogoGallery /> */}
        </Flex>
    );
};

export default ConciergeSection;
