import { Flex, Box, Text, Button, Image, Link } from "@chakra-ui/react";
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
    console.log(markdownStyles)
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
            mx={"auto"}
            position={"relative"}
            cursor="pointer"
        >
            {story.isActive && story.isFeatured && (
                <Flex position={"absolute"}
                    right={"0%"}
                    top={"0%"}
                    // w={"1.6em"}
                    h={["1.4em", "1.9em"]}
                    borderTopRightRadius={["4.167vw", "1.597vw"]}
                    borderBottomLeftRadius={["4.167vw", "1.597vw"]}
                    zIndex={20}
                    bg={"primary_3"}
                    color={"white"}
                    px={["8", "10"]}
                    py="2"
                    gap={["2"]}
                    alignItems={"center"}
                >
                    <StarIcon w={["0.8em", "1em"]} h={["0.8em", "1em"]} />
                    <Text fontSize={["3vw", "1vw"]}>STAR PARTNER</Text>
                </Flex>
            )}
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
            <Flex w={"100%"} flex={1} position={"relative"} overflow="hidden">
                <ChakraNextImage
                    src={story?.news_article?.image?.url || story?.coverImage?.url}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    alt={`${story?.name} coverImage`}
                    borderRadius={["4.167vw", "1.597vw"]}
                    sx={{
                        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "100% 100%",
                    }}
                />

                <Box
                    borderRadius={["4.167vw", "1.597vw"]}
                    w={"100%"}
                    h={"100%"}
                    bgGradient="linear(to-t, black 5%, transparent 50%)"
                    position={"absolute"}
                />
                <Box
                    borderRadius={["4.167vw", "1.597vw"]}
                    w={"100%"}
                    h={["25%", "23%"]}
                    bgGradient="linear(to-b,rgb(118, 121, 114) 0%, transparent 80%)"
                    position={"absolute"}
                />
                <Flex
                    px={["5.55vw", "1.49vw"]}
                    py={["6.11vw", "1.621vw"]}
                    position={"absolute"}
                    w={"100%"}
                    h={"100%"}
                    zIndex={5}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                >
                    <Flex w={"100%"} h={["11.4vw", "3vw"]} gap={["4.167vw", "1.076vw"]}>
                        {story?.company?.icon?.url ? (
                            <ChakraNextImage
                                src={story?.company?.icon?.url}
                                bg={"#EFE9E4"}
                                borderRadius={"100%"}
                                h={"100%"}
                                w={["11.4vw", "3vw"]}
                                objectFit={"cover"}
                                alt={`${story?.company?.name} logo`}
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
                                {story?.name}
                            </Text>
                            <Text
                                fontSize={["2.78vw", "0.743vw"]}
                                fontFamily={"raleway"}
                                fontWeight={500}
                                color={"white"}
                                textAlign={"left"}
                            >
                                {story?.region ? `${story?.region?.name}, ` : ""}{story?.country?.name}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex flexDirection={"column"}>
                        <Text
                            fontSize={["2.78vw", "0.743vw"]}
                            fontFamily={"raleway"}
                            fontWeight={500}
                            color={"white"}
                            textAlign={"left"}
                        >
                            {story?.category?.name}
                        </Text>
                        <Text
                            mt={["2.5vw", "0.2vw"]}
                            mb={["2.167vw", "0.6vw"]}
                            w={"100%"}
                            fontSize={["5.28vw", "1.42vw"]}
                            lineHeight={["6.67vw", "1.83vw"]}
                            color={"white"}
                            fontFamily={"raleway"}
                            textAlign={"left"}
                        >
                            {story?.name && story?.news_article?.title?.includes(story?.name?.trim()) ? (
                                <>
                                    {story?.news_article?.title.split(story?.name)[0]}
                                    <Text as="span" fontFamily={"lora"} fontStyle={"italic"}>
                                        {story?.name?.trim()}
                                    </Text>
                                    {story?.news_article?.title.split(story?.name)[1]}
                                </>
                            ) : (
                                story?.news_article?.title
                            )}
                        </Text>
                        {story?.pricesStartingAt && <Text
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["12px", "12px", "12px", "1vw"]}
                            lineHeight={["12px", "12px", "12px", "0.94vw"]}
                            //  mx={["14px", "14px", "14px", "0.97vw"]} // Responsive margin for larger screens
                            color={"primary_1"}
                            mb={["2.167vw", "0.6vw"]}
                            whiteSpace="nowrap"
                            textAlign={"left"}
                        //textTransform={"capitalize"}
                        >
                            Starting at USD {story.pricesStartingAt?.replace(/\$/g, '')} per night
                        </Text>}
                        <DynamicTags tagList={tagList} />
                    </Flex>
                </Flex>
            </Flex>
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
        </Flex>
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
                    href={story?.news_article ? `/postcard-pages/${story?.slug}` : `/${story?.slug}`}
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