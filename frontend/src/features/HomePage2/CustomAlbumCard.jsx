import { Flex, Box, Text, Button, Heading, Image, Link } from "@chakra-ui/react";
import React, { useContext, useEffect, useState, useRef } from "react";
import ReactCardFlip from "react-card-flip";
import { Waypoint } from "react-waypoint";
import { BookmarkIcon, WebsiteIcon } from "../../styles/ChakraUI/icons";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import DynamicTags from "../AlbumCard/DynamicTags";
import AppContext from "../AppContext";
import { addAlbumEvent, addBacklinkEvent, followUnfollowAlbum } from "../../services/utilities";
import { useSignupModal } from "../SignupModalContext";
import { StarIcon } from "@chakra-ui/icons";
import RenderMarkdown from "../../patterns/RenderMarkdown";
import { markdownStyles, root } from "../AlbumCard/index.module.scss";

const AlbumCard = ({ story, onClick, firstLoad = false, setFirstLoad = () => { } }) => {
    const { profile, logOut, featuredAlbums, updateFeaturedItems } = useContext(AppContext);
    const { openLoginModal } = useSignupModal();

    // Existing state
    const [tagList, setTagList] = useState(story?.tags?.map(t => t.name) || []);
    const [followed, setFollowed] = useState(false);
    const [followId, setFollowId] = useState(null);

    // Flip functionality state
    const [isFlipped, setIsFlipped] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: "auto",
        height: "auto"
    });
    const frontRef = useRef(null);

    useEffect(() => {
        !tagList?.length && getTags();

        if (profile) {
            story?.follow_albums?.forEach((item) => {
                if (item?.follower?.id == profile.id) {
                    setFollowId(item.id);
                    setFollowed(true);
                }
            });
        }
    }, [story]);

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

    const getTags = async () => {
        let tags = [];
        if (story && story.id)
            tags = await fetchPaginatedResults(
                "albums/gettags?albumId=" + story.id,
                {},
                {}
            );
        const capitalizedTags = tags.map((tag) =>
            tag?.name
                ?.split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        );
        setTagList(capitalizedTags);
    };

    const handleFollowUnfollowAlbum = async (e) => {
        e.stopPropagation(); // Prevent card flip when clicking button

        if (profile) {
            followUnfollowAlbum(
                followed,
                followId,
                profile.id,
                story.id,
                (response) => {
                    if (response.error) {
                        logOut();
                        toast({
                            title: "Session Expired",
                            description: "Login Again",
                            isClosable: true,
                            duration: 3000,
                            position: "top"
                        });
                        openLoginModal();
                    } else {
                        setFollowId(response?.id || null);
                        setFollowed((prev) => !prev);
                    }
                }
            );
        } else {
            openLoginModal();
        }
    };

    const handleCardClick = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleStarClick = (e) => {
        e.stopPropagation(); // Prevent card flip when clicking star
        !featuredAlbums.includes(story?.id) && updateFeaturedItems("albums", story.id);
    };

    // Filter blocks with album_section.id === 1
    const welcomeBlock = story?.news_article?.block?.filter(
        block => block?.album_section?.id === 1
    )[0] || [];

    const frontContent = (
        <Flex
            ref={frontRef}
            flexDirection={"column"}
            w={["100%", "314px", "314px", "25vw"]}
            minW={["85vw", "25vw"]}
            h={["0.525vw", "30.525vw"]}
            minH={["420px"]}
            borderRadius={["4.167vw", "1.597vw"]}
            bg={"#2c67b1"}
            backgroundImage={`linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${story?.imageUrl})`}
            backgroundSize="cover"
            backgroundPosition="center"
            mx={"auto"}
            position={"relative"}
            cursor="pointer"
        >
            {profile?.user_type?.name == "Admin" && (
                <StarIcon
                    w={"1.6em"}
                    h={"1.6em"}
                    position={"absolute"}
                    right={"5%"}
                    top={"2%"}
                    zIndex={10}
                    color={featuredAlbums.includes(story?.id) ? "primary_1" : "white"}
                    stroke="primary_1"
                    strokeWidth="1px"
                    onClick={handleStarClick}
                />
            )}

            <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p={6}
                color="white"
            >
                <Heading as="h3" size="lg" mb={1}>
                    {story?.region}
                </Heading>
                <Text fontSize="sm" opacity={0.9}>
                    {story?.location}
                </Text>
            </Box>
            {/* <Flex
                px={["5.55vw", "1.49vw"]}
                gap={["2vw", "1vw"]}
                w={"100%"}
                h={"1vw"}
                minH={"78px"}
                bg={"black"}
                borderRadius={["4.167vw", "1.597vw"]}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Button
                    variant={"none"}
                    border={"1px"}
                    borderColor={"#EFE9E4"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={followed ? "#111111" : "#EFE9E4"}
                    bg={followed ? "#EFE9E4" : "black"}
                    w={"100%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={handleFollowUnfollowAlbum}
                    _hover={{ bg: "white", color: "#111111" }}
                >
                    {followed ? "Added to Diary" : "Add to Diary"}
                </Button>
                <Button
                    variant={"none"}
                    as={Link}
                    href={story?.news_article ? `/postcard-pages/${story?.slug}` : `/${story?.slug}`}
                    target="_blank"
                    border={"1px"}
                    borderColor={"#EFE9E4"}
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={"#EFE9E4"}
                    w={"100%"}
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking button
                    _hover={{ bg: "white", color: "#111111" }}
                >
                    Discover More
                </Button>
            </Flex> */}
        </Flex >
    );

    const backContent = (
        <Flex
            pt={["10px", "23px", "23px", "1.67vw"]}
            bg="white"
            w={["100%", "314px", "314px", "25vw"]}
            minW={["85vw", "25vw"]}
            h={"30.525vw"}
            minH={["420px"]}
            borderRadius={["4.167vw", "1.597vw"]}
            flexDirection="column"
        >
            {/* Scrollable, centerable content */}
            <Box
                flex="1"
                px={["18px", "18px", "18px", "1.4vw"]}
                overflowY="auto"
                textAlign={"left"}
                pb={["48px", "48px", "48px", "4.17vw"]}
                className={
                    root
                }
            >
                {/* <Text
                    fontFamily={"raleway"}
                    fontSize={["13px", "13px", "13px", , "0.97vw"]}
                    lineHeight={["15px", "15px", "15px", "1.25vw"]}
                    color={"#111111"}
                    textAlign={"left"}
                    whiteSpace="pre-wrap"
                    dangerouslySetInnerHTML={{ __html: welcomeBlock.content }}
                /> */}
                <RenderMarkdown
                    className={
                        markdownStyles
                    }
                    content={
                        welcomeBlock.content
                    }
                />
            </Box>

            {/* Bottom buttons */}
            <Flex
                px={["5.55vw", "1.49vw"]}
                gap={["2vw", "1vw"]}
                w="100%"
                h={["6vw"]}
                minH="78px"
                borderBottomRadius={["4.167vw", "1.597vw"]}
                justifyContent="space-between"
                alignItems="center"
            >
                <Button
                    variant="none"
                    border="1px"
                    borderColor="#111111"
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color={followed ? "white" : "#111111"}
                    bg={followed ? "#111111" : "white"}
                    w="100%"
                    fontFamily="raleway"
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={handleFollowUnfollowAlbum}
                    _hover={{ bg: "#f0f0f0", color: "#111111" }}
                >
                    {followed ? "Added to Diary" : "Add to Diary"}
                </Button>

                <Button
                    variant="none"
                    as={Link}
                    href={story?.news_article ? `/postcard-pages/${story?.slug}` : `${story?.link}`}
                    target="_blank"
                    border="1px"
                    borderColor="#111111"
                    h={["8.33vw", "2.5vw"]}
                    borderRadius={["5.55vw", "1.56vw"]}
                    color="#111111"
                    bg="white"
                    w="100%"
                    fontFamily="raleway"
                    fontWeight={600}
                    fontSize={["3.05vw", "0.833vw"]}
                    lineHeight={["13.89vw", "3.82vw"]}
                    onClick={(e) => e.stopPropagation()}
                    _hover={{ bg: "#f0f0f0", color: "#111111" }}
                >
                    Discover More
                </Button>
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
                        cursor: "pointer",
                        width: dimensions.width,
                        height: dimensions.height,
                        boxSizing: "border-box",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                        transformStyle: "preserve-3d",
                        borderRadius: dimensions.width < 600 ? "4.167vw" : "1.597vw",
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

export default AlbumCard;