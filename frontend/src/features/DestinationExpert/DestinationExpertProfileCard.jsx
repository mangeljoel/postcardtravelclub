import { Box, VStack, Heading, Text, Avatar, Link, Flex, Button, useToast, useBreakpointValue } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import { Waypoint } from "react-waypoint";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import RenderMarkdown from "../../patterns/RenderMarkdown";
import { markdownStyles, root } from "../AlbumCard/index.module.scss";

const DestinationExpertProfileCard = ({ index, card, firstLoad = false, setFirstLoad = () => { } }) => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Flip functionality state
    const [isFlipped, setIsFlipped] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: "auto",
        height: "auto"
    });
    const frontRef = useRef(null);

    // Update card dimensions using ResizeObserver
    useEffect(() => {
        const updateDimensions = (entries) => {
            for (let entry of entries) {
                if (entry.target) {
                    const { width, height } = entry.target.getBoundingClientRect();
                    setDimensions({ width, height });
                }
            }
        };

        const observer = new ResizeObserver(updateDimensions);
        if (frontRef.current) {
            observer.observe(frontRef.current);
        }

        return () => {
            if (frontRef.current) {
                observer.unobserve(frontRef.current);
            }
        };
    }, []);

    const handleShareClick = (urlToShare, e) => {
        e.stopPropagation(); // Prevent card flip when clicking share button

        const shareUrl = urlToShare || window.location.href;

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: shareUrl,
            });
        } else {
            try {
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        });
                    })
                    .catch((err) => {
                        console.error('Error copying URL:', err);
                    });
            } catch (err) {
                console.error('Error:', err);
            }
        }
    };

    const handleCardClick = () => {
        setIsFlipped((prev) => !prev);
    };

    const frontContent = (
        <Flex
            ref={frontRef}
            flexDirection={"column"}
            h={["100vw", "30vw"]}
            minH={["297px"]}
            w={["85vw", "314px", "314px", "25vw"]}
            minW={["85vw", "25vw"]}
            borderRadius={["4.167vw", "1.597vw"]}
            bg={"#2c67b1"}
            mx={"auto"}
            position={"relative"}
            cursor="pointer"
        >
            <Flex w={"100%"} flex={1} position={"relative"}>
                <Box
                    borderTopRadius={["4.167vw", "1.597vw"]}
                    w={"100%"}
                    h={"100%"}
                    bgImage={card?.founderMessage?.founderImage?.url || card?.coverImage?.url}
                    bgSize={"cover"}
                    bgRepeat={"no-repeat"}
                    bgPos={"top"}
                />
                <Box
                    borderTopRadius={["4.167vw", "1.597vw"]}
                    w={"100%"}
                    h={"100%"}
                    bgGradient="linear(to-t, black 5%, transparent 50%)"
                    position={"absolute"}
                />
                <Box
                    borderTopRadius={["4.167vw", "1.597vw"]}
                    w={"100%"}
                    h={["25%", "23%"]}
                    bgGradient="linear(to-b,rgb(118, 121, 114) 0%, transparent 80%)"
                    position={"absolute"}
                />
                <Flex
                    px={["5.55vw", "1.49vw"]}
                    pt={["6.11vw", "1.621vw"]}
                    position={"absolute"}
                    w={"100%"}
                    h={"100%"}
                    zIndex={5}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                >
                    <Flex w={"100%"} h={["11.4vw", "3vw"]} gap={["4.167vw", "1.076vw"]}>
                        {card?.user?.company?.icon?.url ? (
                            <ChakraNextImage
                                src={card?.user?.company?.icon?.url}
                                bg={"#EFE9E4"}
                                borderRadius={"100%"}
                                h={"100%"}
                                w={["11.4vw", "3vw"]}
                                objectFit={"cover"}
                                alt={`${card?.user?.company?.icon?.url} logo`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <Box bg={"#EFE9E4"} borderRadius={"100%"} h={"100%"} w={["11.4vw", "3vw"]} />
                        )}
                        <Flex flex={1} h={"100%"} justifyContent={"center"} flexDirection={"column"}>
                            <Text
                                fontSize={["3.33vw", "0.95vw"]}
                                textDecoration={"underline"}
                                fontFamily={"raleway"}
                                fontWeight={500}
                                color={"white"}
                                textAlign={"left"}
                            >
                                {card?.user?.company?.name || card?.title}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex flexDirection={"column"}>
                        <Text
                            mt={["2.5vw", "0.7vw"]}
                            mb={["2.5vw", "0.5vw"]}
                            w={"100%"}
                            fontSize={["7vw", "2vw"]}
                            lineHeight={["8.5vw", "2.4vw"]}
                            color={"white"}
                            fontFamily={"raleway"}
                            textAlign={"left"}
                        >
                            <Text
                                as="span"
                                fontFamily={"lora"}
                                fontStyle={"italic"}
                            >
                                {card?.name?.trim()}
                            </Text>
                        </Text>
                        <Text
                            fontSize={["3.5vw", "0.9vw"]}
                            fontFamily={"raleway"}
                            fontWeight={500}
                            color={"white"}
                            textAlign={"left"}
                        >
                            {card?.region ? `${card?.region?.name}, ` : ""}{card?.country?.name}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                px={["5.55vw", "1.49vw"]}
                gap={["2vw", "1vw"]}
                w={"100%"}
                h={"6vw"}
                minH={"78px"}
                bg={"black"}
                justifyContent="center"
                borderBottomRadius={["4.167vw", "1.597vw"]}
                alignItems={"center"}
            >
                <Button
                    variant={"none"}
                    as={Link}
                    href={`/destination-experts/${card?.user?.slug}`}
                    target="_blank"
                    border={"1px"}
                    borderColor={"#EFE9E4"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={"#EFE9E4"}
                    w={"80%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking button
                    _hover={{ bg: "white", color: "#111111" }}
                >
                    View Storyboard
                </Button>
                {/* <Button
                    variant={"none"}
                    border={"1px"}
                    borderColor={"#EFE9E4"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={"#EFE9E4"}
                    w={"50%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    _hover={{ bg: "white", color: "#111111" }}
                    onClick={(e) => handleShareClick(`${window.location.origin}/destination-experts/${card?.user?.slug}`, e)}
                >
                    Share
                </Button> */}
            </Flex>
        </Flex>
    );

    const backContent = (
        <Flex
            pt={["23px", "23px", "23px", "1.67vw"]}
            bg="white"
            w={dimensions.width}
            h={dimensions.height}
            borderRadius={["4.167vw", "1.597vw"]}
            justifyContent={"space-between"}
            flexDirection={"column"}
        >
            {/* Scrollable text area */}
            <Box
                px={["18px", "18px", "18px", "1.4vw"]}
                overflowY={"scroll"}
                pb={["48px", "48px", "48px", "4.17vw"]}
                className={
                    root
                }
            >
                <RenderMarkdown
                    className={
                        markdownStyles
                    }
                    content={
                        card?.founderMessage?.founderBrief
                    }
                />
            </Box>
            <Flex
                px={["5.55vw", "1.49vw"]}
                gap={["2vw", "1vw"]}
                w={"100%"}
                h={"6vw"}
                minH={"78px"}
                justifyContent="center"
                borderBottomRadius={["4.167vw", "1.597vw"]}
                alignItems={"center"}
            >
                <Button
                    variant={"none"}
                    as={Link}
                    href={`/destination-experts/${card?.user?.slug}`}
                    target="_blank"
                    border={"1px"}
                    borderColor={"#111111"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={"#111111"}
                    bg={"white"}
                    w={"80%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={(e) => e.stopPropagation()} // Prevent card flip
                    _hover={{ bg: "#f0f0f0", color: "#111111" }}
                >
                    View Storyboard
                </Button>

                {/* <Button
                    variant={"none"}
                    border={"1px"}
                    borderColor={"#111111"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={"#111111"}
                    bg={"white"}
                    w={"50%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    _hover={{ bg: "#f0f0f0", color: "#111111" }}
                    onClick={(e) =>
                        handleShareClick(
                            `${window.location.origin}/destination-experts/${card?.user?.slug}`,
                            e
                        )
                    }
                >
                    Share
                </Button> */}
            </Flex>

        </Flex>
    );

    return (
        <Box
            style={{
                height: dimensions.height,
                perspective: "1000px"
            }}
            mx="auto"
        >
            <ReactCardFlip
                isFlipped={isFlipped}
                flipDirection="horizontal"
                flipSpeedBackToFront={1}
                flipSpeedFrontToBack={1}
            >
                <Box
                    key="front"
                    onClick={handleCardClick}
                    style={{
                        width: "fit-content",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    }}
                >
                    {frontContent}
                </Box>

                <Box
                    key="back"
                    onClick={handleCardClick}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        width: dimensions.width,
                        height: dimensions.height,
                        boxSizing: "border-box",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                        transformStyle: "preserve-3d",
                        opacity: isFlipped ? 1 : 0,
                        transition: "opacity 0s ease",
                        transitionDelay: isFlipped ? "0.4s" : "0.4s",
                        borderRadius: dimensions.width < 600 ? "4.167vw" : "1.597vw"
                    }}
                >
                    {backContent}
                </Box>
            </ReactCardFlip>
            <Waypoint
                scrollableAncestor="window"
                onEnter={() => {
                    if (firstLoad && frontRef.current) {
                        handleCardClick();
                        setTimeout(() => handleCardClick(), 2000);
                        setFirstLoad(false);
                    }
                }}
            />
        </Box>
    );
};

export default DestinationExpertProfileCard;