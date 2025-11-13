import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    useBreakpointValue
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CloseIcon } from "../../../styles/ChakraUI/icons";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import VideoPlayer from "./VideoPlayer";
import AutoSlideshow from "./AutoSlideshow";
import Marquee from "react-fast-marquee";

const HeroSection = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const imageSrc = "/assets/homepage/background.webp"
    return (
        <>
            <Modal
                isOpen={isVideoModalOpen}
                size="full" // Set size to full for full-screen modal
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    background={"#307FE2"}
                    // background={"transparent"}
                    // backdropFilter={"blur(10px)"}
                    borderRadius={0} // Remove border radius if needed
                >
                    <Box
                        onClick={() => setIsVideoModalOpen(false)}
                        position={"absolute"}
                        top={"2%"}
                        right={"2%"}
                        width={["40px", "50px", "60px"]}
                        _hover={{
                            cursor: "pointer",
                            "svg .outer-rect": {
                                // Target only the specific rect element with the class
                                stroke: "#111111"
                            },
                            svg: {
                                fill: "#111111" // Change fill color on hover
                            }
                        }}
                    >
                        <CloseIcon width={"100%"} height={"100%"} />
                    </Box>
                    <ModalBody
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <VideoPlayer
                            boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                            width={["100%", "85%"]} // Ensure video takes up full width
                            height={["100%", "85%"]} // Ensure video takes up full height
                            // url="https://images.postcard.travel/postcardv2/pc_video_63146e5d5e.mp4"
                            url="https://www.youtube.com/watch?v=CucfpZnTKvw"
                            // customPlay={true}
                            customPlay={false}
                            autoPlay={true}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Box  pos="relative"mx={["5.55vw", "1.56vw"]}>
                <Flex
                    direction="column"
                    position={"relative"}
                    overflow="hidden"
                    // width="100%"
                    width={["88.9vw", "96.88vw"]}
                    borderRadius={["15px", "15px", "30px"]}
                    justifyContent={["space-between", "flex-end"]}
                    height={["70vh", "70vh", "80vh", "80vh", "80vh"]}
                >
                    <ChakraNextImage
                        rel={"preload"}
                        src={imageSrc}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        alt="Background Image"
                        noLazy={true}
                        priority={true}
                    />
                    <Flex
                        w="100%"
                        direction={"column"}
                        justifyContent={["space-around", "auto"]}
                        pos="absolute"
                        h="100%"
                    >
                        <Flex
                            w="100%"
                            h="100%"
                            direction={["column", "row"]}
                            justifyContent={["center", "space-between"]}
                            alignItems="center"
                            textAlign="center"
                            mx="auto"
                        >
                            {/* Wrapper to keep text + button together on mobile */}
                            <Box
                                display="flex"
                                flexDirection={["column", "row"]}
                                alignItems={["flex-start"]} // center on mobile, left on desktop
                                my="auto"
                                mx={["6vw"]}
                                textAlign={["left"]}
                                gap={["4vw", "0"]} // space only on mobile if needed
                            >
                                <Text
                                    as="h1"
                                    fontFamily="raleway"
                                    fontWeight={600}
                                    fontSize={["28px", "4vw"]}
                                    lineHeight={["32px", "5vw"]}
                                    color="#EFE9E4"
                                >
                                    India's first Concierge Club for{" "}
                                    <Text
                                        as="span"
                                        fontFamily="lora"
                                        fontStyle="italic"
                                        fontWeight={400}
                                        fontSize={["32px", "4.6vw"]}
                                        lineHeight={["32px", "4.6vw"]}
                                    >
                                        conscious luxury travellers.
                                    </Text>
                                </Text>

                                <Button
                                    mt={["6vw", "4vw"]}
                                    variant="none"
                                    color="white"
                                    borderColor="white"
                                    border="2px"
                                    py={[3, 6]}
                                    px={[6, 10, 15]}
                                    borderRadius={["24px", "32px", "40px"]}
                                    height={["40px", "50px"]}
                                    width={["160px", "25vw"]}
                                    fontFamily="raleway"
                                    fontWeight={600}
                                    fontSize={["14px", "18px", "21px"]}
                                    backdropFilter="blur(5px)"
                                    _hover={{
                                        background: "#EFE9E4",
                                        color: "#111111",
                                        borderColor: "white"
                                    }}
                                    onClick={() => setIsVideoModalOpen(true)}
                                >
                                    Play Video
                                </Button>
                            </Box>
                        </Flex>

                        <Box zIndex="999" width={"100%"} mb={["6vw", "4vw"]}>
                            {/* <Text
                                color={"#EFE9E4"}
                                fontWeight={600}
                                fontFamily="raleway"
                                fontSize={["12px", "16px", "20px", "21px"]}
                                lineHeight={["13px", "17px", "21px", "27px"]}
                                // pl={["7%", "7%", "5%", "7%"]}
                            >
                                As seen in
                            </Text> */}
                            {/* <AutoSlideshow text={["Fixed Annual Fees","Commission-Free Rates"," Direct Bookings","No Hidden Costs "]} speed={12000} /> */}
                            <Marquee autoFill={true}><Text fontSize={["4vw", "1.4vw"]} color="white">Fixed Annual Fees&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Commission-Free&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Direct Bookings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No Hidden Costs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text></Marquee>
                        </Box>
                    </Flex>
                </Flex>
                <Box w={"100%"} h={"20%"} bottom={0} mt={"auto"} position={"absolute"} borderRadius={["4.167vw", "2.083vw"]} top={0} bg={"linear-gradient(to top, #111111 2%, transparent)"}></Box>
            </Box>
        </>
    );
};

export default HeroSection;
