import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import AnimatedNumbersSection from "./AnimatedNumbersSection";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import { useSignupModal } from "../../SignupModalContext";

const WishListSection = () => {
    const { profile } = useContext(AppContext);
    const { openLoginModal } = useSignupModal()
    const router = useRouter();
    return (
        <Flex
            mx={["5.55vw", "1.56vw"]}
            w={["88.9vw", "96.88vw"]}
            h={["128.611vw", "41.67vw"]}
            borderRadius={["4.167vw", "1.56vw"]}
            bg={"primary_1"}
            px={["10.556vw", "7.188vw"]}
            pt={["10.556vw", "6.719vw"]}
            pb={["10.83vw", "5.26vw"]}
            justify={["", "space-between"]}
            gap={["10vw", "0"]}
            flexDirection={["column", "row"]}
        >
            <Flex
                flexDirection={"column"}
                alignItems={"flex-start"}
                w={["100%", "38.02vw"]}
            >
                 <Text
                    as="span"
                     color={"#EFE9E4"}
                        fontFamily="lora"
                        fontStyle="italic"
                        fontWeight={500}
                        fontSize={["6.38vw", "2.95vw"]}
                        lineHeight={["6.67vw", "3.265vw"]}
                    >
                     Collect Postcards
                    </Text>{" "}
                <Text
                    color={"#EFE9E4"}
                    fontFamily="raleway"
                    fontWeight={500}
                    fontSize={["5.83vw", "2.75vw"]}
                    lineHeight={["6.67vw", "3.265vw"]}
                >
                    and build your{" "}
                    <Text
                        as="span"
                        fontFamily="lora"
                        fontStyle="italic"
                        fontWeight={500}
                        fontSize={["6.38vw", "2.95vw"]}
                        lineHeight={["6.67vw", "3.265vw"]}
                    >
                        wish-list
                    </Text>{" "}
                    for conscious luxury travel.
                </Text>

                <Button
                    variant={"none"}
                    color={"white"}
                    borderColor={"white"}
                    border={"2px"}
                    w={["63.05vw", "24.08vw"]}
                    h={["8.05vw", "3.06vw"]}
                    mt={["7.22vw", "3.69vw"]}
                    textAlign={"center"}
                    borderRadius={["5.55vw", "2.08vw"]}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.33vw", "1.22vw"]}
                    lineHeight={["10vw", "3.77vw"]}
                    _hover={{ background: "#EFE9E4", color: "#EA6146" }}
                    onClick={() => {
                        if (profile) {
                            router.push(`/${profile?.slug}`);
                        } else {
                            openLoginModal()
                        }
                    }}
                >
                    Start your collection &nbsp;
                    <RightArrowIcon
                        style={{ paddingTop: "1%" }}
                        h={["8.05vw", "3.06vw"]}
                        width={["2.77vw", "1.5vw"]}
                    />
                </Button>
            </Flex>

            <AnimatedNumbersSection />
        </Flex>
    );
};

export default WishListSection;
