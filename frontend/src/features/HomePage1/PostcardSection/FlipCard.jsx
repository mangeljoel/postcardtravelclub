import { border, Box, Flex, Image, keyframes, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { Waypoint } from "react-waypoint";
import { FlipIcon } from "../../../styles/ChakraUI/icons";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";

const FlipCard = ({
    imageUrl,
    propertyName,
    postcardName,
    region,
    country,
    firstLoad,
    setFirstLoad
}) => {
    const ref = useRef();
    return (
        <Flippy
            flipDirection="horizontal"
            flipOnClick={true} // Disable default click-to-flip
            flipOnHover={false} // Disable hover-to-flip
            style={{
                height: "auto",
                flex: "0 0 auto"
            }}
            ref={ref}
        >
            <FrontSide
                animationDuration={1500}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    boxShadow: "none"
                }}
            >
                <Box position={"relative"}>
                    <ChakraNextImage
                        src={imageUrl}
                        objectFit={"cover"}
                        alt={`${propertyName} Postcard Image`}
                        w={["53.05vw", "22.95vw"]}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        h={["50vw", "29.65vw"]}
                        borderRadius={["3.611vw", "1.53vw"]}
                        priority={false}
                    />
                    {/* <ChakraNextImage
                        src={imageUrl}
                        objectFit={"cover"}
                        height={["272px", "300px", "560px"]}
                        width={["191px", "214px", "390px"]}
                        borderRadius={["13px", "13px", "30px"]}
                    /> */}
                    <Box
                        position={"absolute"}
                        bottom={"5%"}
                        left={"5%"}
                        width={["35px", "35px", "50px"]}
                        cursor={"pointer"}
                    // backdropFilter={"blur(5px)"}
                    >
                        <FlipIcon
                            width="100%"
                            height="100%"
                            stroke={"#EFE9E4"}
                        />
                    </Box>
                </Box>
            </FrontSide>

            <BackSide
                animationDuration={1500}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    boxShadow: "none"
                }}
            >
                <Flex
                    position={"relative"}
                    bg={"#EFE9E4"}
                    w={["53.05vw", "22.95vw"]}
                    h={["50vw", "29.65vw"]}
                    borderRadius={["3.611vw", "1.53vw"]}
                    px={5}
                    border={["2px solid #111111"]}
                    flexDirection={"column"}
                    justify={"space-between"}
                // py={10}
                >
                    <Box position={"absolute"} top={"5%"} right={"5%"}>
                        <ChakraNextImage
                            width={["11.11vw", "5vw"]}
                            src={"/assets/postcard-logo-black.png"}
                            alt={"Postcard Logo Black"}
                        />
                    </Box>
                    <Box mt={["25.27vw", "11.25vw"]}>
                        <Text
                            fontFamily={"raleway"}
                            fontSize={["2.717vw", "1.198vw"]}
                            fontWeight={"bold"}
                        >
                            {postcardName ||
                                "Uncover The Magic of Lost Wax Casting at Mantra Koodam"}
                        </Text>
                    </Box>
                    <Box mb={["9.167vw", "4.06vw"]}>
                        <Text
                            fontFamily={"raleway"}
                            fontSize={["2.5vw", "1.09vw"]}
                            fontWeight={600}
                        >
                            {propertyName || "Mantra Koodam"}
                        </Text>
                        <Text
                            fontFamily={"raleway"}
                            fontSize={["2.22vw", "0.99vw"]}
                        >
                            {`${region ? `${region}, ` : ''}${country}` || "INDIA"}
                        </Text>
                        <Box border={"1px"} mt={[2, 2, 4]}></Box>
                    </Box>
                </Flex>
            </BackSide>
            <Waypoint
                scrollableAncestor="window"
                onEnter={() => {
                    if (firstLoad && ref.current) {
                        ref.current.toggle();
                        setTimeout(() => ref.current?.toggle(), 2000);
                        setFirstLoad(false);
                    }
                }}
            ></Waypoint>
        </Flippy>
    );
};

export default FlipCard;
