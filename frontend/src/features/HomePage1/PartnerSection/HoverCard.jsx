import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsArrowRightCircle, BsArrowRightCircleFill } from "react-icons/bs";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";

const HoverCard = ({ child, height, loc, country, path }) => {
    const router = useRouter();
    const [showHoverCard, setShowHoverCard] = useState(0);
    const { isTabletOrMobile } = useContext(AppContext);

    return (
        <Box
            position="relative"
            borderRadius="30px"
            width={"100%"}
            height={"100%"}
            onClick={() => {
                // router.push(path);

                if (!isTabletOrMobile) window.open(path, "_blank");
                else {
                    if (showHoverCard === 0) {
                        setShowHoverCard(1);
                    } else {
                        setShowHoverCard(0);
                        window.open(path, "_blank");
                    }
                }
            }}
        >
            <Box
                position={"absolute"}
                width={"100%"}
                zIndex={10}
                height={"100%"}
                display={"block"}
                _hover={{
                    cursor: "pointer",
                    "& .hover-content": {
                        opacity: "1!important", // Make inner content visible on hover
                        transform: "translateY(0)" // Optionally, you can add some animation
                    },
                    "&::before": {
                        opacity: "1!important"
                    }
                }}
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                        "linear-gradient(to bottom, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 1) 100%)",
                    opacity: [showHoverCard + "!important", 0], // Hidden by default
                    transition: "opacity 0.3s ease-in-out", // Smooth transition on hover
                    borderRadius: "20px"
                }}
            >
                <Box
                    className="hover-content"
                    width="fit-content"
                    position={"absolute"}
                    bottom={["7%", "5%"]}
                    left={["3%", "4%", "4%", "5%"]}
                    pr={["3%", "4%", "4%", "5%"]}
                    opacity={[showHoverCard + "!important", 0]} // Hidden by default
                    transition="opacity 0.3s ease-in-out, transform 0.3s ease-in-out" // Smooth transition on hover
                    transform={["none", "translateY(10px)"]} // Optional animation for effect
                >
                    <Flex alignItems={"center"} gap={"10px"}>
                        <ChakraNextImage
                            // width={[
                            //     "60px",
                            //     "70px",
                            //     "80px",
                            //     "80px",
                            //     "100px",
                            //     "110px",
                            //     "120px"
                            // ]}
                            width={["16.67vw", "6.25vw"]}
                            maxW={["60px", "120px"]}
                            src={"/assets/postcard-logo-white.png"}
                            alt={"Property Card"}
                        />
                        <Box textAlign={"left"}>
                            <Text
                                fontFamily={"raleway"}
                                // fontSize={[
                                //     "16px",
                                //     "18px",
                                //     "20px",
                                //     "22px",
                                //     "24px"
                                // ]}
                                fontSize={["16px", "1.25vw"]}
                                fontWeight={"semibold"}
                                color={"white"}
                            >
                                {loc}
                            </Text>
                            <Text
                                fontFamily={"raleway"}
                                // fontSize={[
                                //     "14px",
                                //     "15px",
                                //     "16px",
                                //     "17px",
                                //     "18px"
                                // ]}
                                fontSize={["14px", "0.94vw"]}
                                color={"white"}
                                textAlign={"start"}
                            >
                                {country}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
            {child}
        </Box>
    );
};

export default HoverCard;
