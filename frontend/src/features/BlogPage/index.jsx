import {
    Box,
    Text,
    Flex,
    Button,
    Divider,
    Link,
    Image,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import RenderMarkdown from "../../patterns/RenderMarkdown";
import { markdownStyles, root, noMarginbottom } from "./index.module.scss";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import LoadingGif from "../../patterns/LoadingGif";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import IndexSection from "../CreatePostcardPage/Patterns/IndexSection";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import Postcard from "../TravelExplore/TravelPostcardList/Postcard";
import {
    BookmarkIcon,
    UpArrowIcon,
    WebsiteIcon
} from "../../styles/ChakraUI/icons";
import { addAlbumEvent, addBacklinkEvent, followUnfollowAlbum } from "../../services/utilities";
import AppContext from "../AppContext";
import { useSignupModal } from "../SignupModalContext";
import StayExperiences from "./StayExperiences";

const BlogPage = (props) => {

    const { profile, logOut, canCreatePostcard } = useContext(AppContext);
    const { openLoginModal } = useSignupModal()
    const { blogPost, pageSections, isAlbumOnly, refetchNewsArticle, setActiveTab, showActionButton, ...restProps } = props;

    const [newsArticle, setNewsArticle] = useState(null);
    const [renderSections, setRenderSections] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [followed, setFollowed] = useState(false);
    const [followId, setFollowId] = useState(null);

    const [isVisible, setIsVisible] = useState(false);
    const [scrollDirection, setScrollDirection] = useState(null);
    const [scrollCount, setScrollCount] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hideTimeout, setHideTimeout] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [postcards, setPostcards] = useState([]);

    // Use newsArticle if available, otherwise fallback to blogPost
    const displayData = newsArticle || blogPost;

    // Sync postcards when displayData changes
    useEffect(() => {
        if (displayData?.album?.postcards) {
            setPostcards(displayData.album.postcards);
        }
    }, [displayData?.album?.postcards]);

    const getTags = async () => {
        let tags = [];
        const albumSource = newsArticle?.album || blogPost?.album;
        if (albumSource && albumSource.id)
            tags = await fetchPaginatedResults(
                "albums/gettags?albumId=" + albumSource.id,
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

    const addAlbumEventOnPageLoad = () => {
        const albumSource = newsArticle || blogPost;
        if (albumSource) {
            addAlbumEvent(profile?.id, `/postcard-pages/${albumSource?.album?.slug}`, albumSource?.album?.id, null)
        }
    }

    const handleTagClick = (tagName) => {
        if (selectedTag != tagName) {
            setSelectedTag(tagName);
        } else if (selectedTag == tagName) {
            setSelectedTag("");
        }
    };

    const handleFollowUnfollowAlbum = async (e) => {
        const albumSource = newsArticle?.album || blogPost?.album;
        if (profile) {
            followUnfollowAlbum(
                followed,
                followId,
                profile.id,
                albumSource?.id,
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
                        openLoginModal()
                    } else {
                        setFollowId(response?.id || null);
                        setFollowed((prev) => !prev);
                    }
                }
            );
        } else
            openLoginModal()
    };

    useEffect(() => {
        if (blogPost) {
            setNewsArticle(blogPost);
            blogPost?.album?.follow_albums?.forEach((item) => {
                if (item?.follower?.id == profile?.id) {
                    setFollowId(item.id);
                    setFollowed(true);
                }
            });
        }
    }, [blogPost]);

    useEffect(() => {
        const result = [];
        if (pageSections?.length > 0 && newsArticle) {
            for (const pageSection of pageSections) {
                if (newsArticle?.block?.length > 0) {
                    const section = newsArticle?.block.filter(
                        (section) =>
                            pageSection.id === section.album_section?.id
                    );
                    if (section?.length > 0) {
                        result.push(section);
                    }
                }
            }

            if (
                result &&
                result[0]?.[0].album_section &&
                result[0]?.[0].album_section?.id === 1
            ) {
                const postcardSec = [
                    {
                        id: 99999999,
                        album_section: { id: 7, name: "Postcard Experience" }
                    }
                ];
                const createPostcardSec = [
                    {
                        id: 99999998,
                        album_section: { id: 8, name: "Create Postcards" }
                    }
                ];
                result.splice(1, 0, postcardSec, createPostcardSec);
            } else if (
                result &&
                result[0]?.[0].album_section &&
                result[0]?.[0].album_section?.id !== 1
            ) {
                const postcardSec = [
                    { id: 99999999, album_section: { id: 7, name: "Postcard Experience" } }
                ];
                const createPostcardSec = [
                    {
                        id: 99999998,
                        album_section: { id: 8, name: "Create Postcards" }
                    }
                ];
                result.splice(0, 0, postcardSec, createPostcardSec);
            }
        }
        setRenderSections(result);
    }, [pageSections, newsArticle]);

    useEffect(() => {
        getTags();
        addAlbumEventOnPageLoad()
    }, [newsArticle, blogPost]);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY === 0) {
            setScrollCount(0);
            setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
            setScrollDirection("up");
            setScrollCount((prev) => prev + 1);
        } else {
            setScrollDirection("down");
            setScrollCount(0);
        }

        setLastScrollY(currentScrollY);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setIsVisible(false);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        if (scrollCount > 1) {
            setIsVisible(true);

            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            setHideTimeout(timeout);
        } else if (scrollCount === 0) {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            setIsVisible(false);
        }
    }, [scrollCount]);

    // Updated setAlbum function to handle postcard updates properly
    const setAlbum = (albumUpdater) => {
        setNewsArticle(prev => {
            if (!prev) return prev;

            const updatedAlbum = typeof albumUpdater === 'function'
                ? albumUpdater(prev.album)
                : albumUpdater;

            // Update local postcards state
            if (updatedAlbum?.postcards) {
                setPostcards(updatedAlbum.postcards);
            }

            return {
                ...prev,
                album: updatedAlbum
            };
        });

        // Trigger refetch to get the latest data from the server
        if (refetchNewsArticle) {
            // Use setTimeout to ensure state updates have propagated
            setTimeout(() => {
                refetchNewsArticle();
            }, 0);
        }
    };

    return (
        <Flex
            flexDirection={"column"}
            w={"100%"}
            alignItems={"center"}
            pos="relative"
        >
            {isVisible && (
                <Button
                    variant="none"
                    px={0}
                    onClick={scrollToTop}
                    pos={"fixed"}
                    bg={"primary_3"}
                    borderRadius={"100%"}
                    zIndex={10}
                    w={["12.5vw", "4.3vw"]}
                    h={["12.5vw", "4.3vw"]}
                    bottom={"5vw"}
                    right={"5vw"}
                >
                    <UpArrowIcon
                        w={["5.55vw", "1.8vw"]}
                        h={["4.167vw", "2.5vw"]}
                    />
                </Button>
            )}
            <Box
                w={"100%"}
                minH={["181.11vw", "50.4vw"]}
                px={["5.56vw", "2.22vw"]}
                my={["6.94vw", "2.22vw"]}
                bg="#EFE9E4"
            >
                <Box
                    w={"100%"}
                    h={"100%"}
                    bg={"#111111"}
                    borderRadius={["4.167vw", "2.08vw"]}
                    position="relative"
                >
                    <ChakraNextImage
                        borderTopRadius={["4.167vw", "2.08vw"]}
                        noLazy={true}
                        priority={true}
                        src={displayData?.image?.url ?? ""}
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        objectFit="cover"
                        alt={displayData?.album?.name + " coverImage"}
                    />

                    <Box
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        position={"absolute"}
                        top={0}
                        left={0}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        bgGradient="linear(to-t, #111111 2%, transparent 50%)"
                        borderTopRadius={["4.167vw", "2.08vw"]}
                    >
                        <Flex
                            w={"100%"}
                            h={"100%"}
                            flexDirection={"column"}
                            justify={"flex-end"}
                            borderRadius={["4.167vw", "2.08vw"]}
                        >
                            <Flex
                                display={{ base: "none", sm: "flex" }}
                                h={"14.1vw"}
                                mt={"17.8vw"}
                                justifyContent={"space-between"}
                                alignItems={"flex-end"}
                            >
                                <Text
                                    maxW={"55.76vw"}
                                    fontSize={"4.58vw"}
                                    lineHeight={"4.72vw"}
                                    color={"white"}
                                    fontFamily={"raleway"}
                                >
                                    {isAlbumOnly ? (
                                        displayData?.album?.name
                                    ) : (
                                        displayData?.album?.name &&
                                            displayData?.title?.includes(
                                                displayData?.album?.name?.trim()
                                            ) ? (
                                            <>
                                                {
                                                    displayData?.title.split(
                                                        displayData?.album?.name
                                                    )[0]
                                                }
                                                <Text
                                                    as="span"
                                                    fontFamily={"lora"}
                                                    fontStyle={"italic"}
                                                >
                                                    {displayData?.album?.name?.trim()}
                                                </Text>
                                                {
                                                    displayData?.title.split(
                                                        displayData?.album?.name
                                                    )[1]
                                                }
                                            </>
                                        ) : (
                                            displayData?.title
                                        )
                                    )}
                                </Text>
                                <Box h={"3.47vw"}></Box>
                            </Flex>

                            <Flex
                                display={{ base: "flex", sm: "none" }}
                                flexDirection={"column"}
                                mt={"64.22vw"}
                                gap={"6.67vw"}
                            >
                                <Text
                                    w={"100%"}
                                    fontSize={"7.78vw"}
                                    lineHeight={"8.88vw"}
                                    color={"white"}
                                    fontFamily={"raleway"}
                                >
                                    {isAlbumOnly ? (
                                        displayData?.album?.name
                                    ) : (
                                        displayData?.album?.name &&
                                            displayData?.title?.includes(
                                                displayData?.album?.name?.trim()
                                            ) ? (
                                            <>
                                                {
                                                    displayData?.title.split(
                                                        displayData?.album?.name
                                                    )[0]
                                                }
                                                <Text
                                                    as="span"
                                                    fontFamily={"lora"}
                                                    fontStyle={"italic"}
                                                >
                                                    {displayData?.album?.name?.trim()}
                                                </Text>
                                                {
                                                    displayData?.title.split(
                                                        displayData?.album?.name
                                                    )[1]
                                                }
                                            </>
                                        ) : (
                                            displayData?.title
                                        )
                                    )}
                                </Text>
                                <Text
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                    fontWeight={400}
                                    fontSize={"3.89vw"}
                                    lineHeight={"5vw"}
                                >
                                    {isAlbumOnly ? (
                                        <>
                                            {displayData?.album?.region?.name && `${displayData?.album?.region?.name}, `}
                                            {displayData?.album?.country?.name}
                                        </>
                                    ) : (
                                        displayData?.description
                                    )}
                                </Text>
                            </Flex>

                            <Text
                                display={{ base: "none", sm: "flex" }}
                                color={"#EFE9E4"}
                                fontFamily={"raleway"}
                                fontWeight={400}
                                fontSize={"1.87vw"}
                                mt={"3.26vw"}
                            >
                                {isAlbumOnly ? (
                                    <>
                                        {displayData?.album?.region?.name && `${displayData?.album?.region?.name}, `}
                                        {displayData?.album?.country?.name}
                                    </>
                                ) : (
                                    displayData?.description
                                )}
                            </Text>

                            <Flex
                                w={"100%"}
                                justifyContent={"flex-start"}
                                mt={["5vw", "3vw"]}
                                mb={[0, , "1vw"]}
                                gap={[2, "2.083vw"]}
                            >
                                <Button
                                    variant="none"
                                    fontSize={["3.33vw", "1.6vw"]}
                                    w={["50%", "auto"]}
                                    borderRadius={["5.55vw", "2.64vw"]}
                                    h={["8.33vw", "3.96vw"]}
                                    px={["9.167vw", "4.375vw"]}
                                    border="2px"
                                    borderColor={"white"}
                                    bg={followed ? "white" : "transparent"}
                                    color={followed ? "#111111" : "white"}
                                    fontFamily={"raleway"} fontWeight={500}
                                    _hover={{ bg: "white", color: "#111111" }}
                                    onClick={handleFollowUnfollowAlbum}
                                >
                                    {followed ? "Added to Diary" : "Add to Diary"}
                                </Button>
                                <Button
                                    variant="none"
                                    fontSize={["3.33vw", "1.6vw"]}
                                    w={["50%", "auto"]}
                                    borderRadius={["5.55vw", "2.64vw"]}
                                    h={["8.33vw", "3.96vw"]}
                                    px={["9.167vw", "4.375vw"]}
                                    border="2px"
                                    borderColor={"white"}
                                    bg={"transparent"}
                                    color={"white"}
                                    fontFamily={"raleway"} fontWeight={500}
                                    _hover={{ bg: "white", color: "#111111" }}
                                    as={Link}
                                    href={displayData?.album?.website}
                                    target="_blank"
                                    onClick={() => addBacklinkEvent(profile?.id, displayData?.album?.website, displayData?.album?.id, null)}
                                >
                                    Visit Website
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>

                    <Box
                        h={"2px!important"}
                        mt={["4vw", "1.5vw"]}
                        bg={"#EFE9E4"}
                        ml={["8.33vw", "6.46vw"]}
                        mr={["6.67vw", "6.11vw"]}
                    ></Box>

                    <Box
                        pt={["5vw"]}
                        display={{ base: "none", sm: "block" }}
                        h={["calc(58.4vw - 46.74vw)"]}
                        color={"#EFE9E4"}
                    >
                        <Flex
                            justifyContent={"space-between"}
                            ml={["8.33vw", "6.46vw"]}
                            mr={["6.67vw", "6.11vw"]}
                            alignItems={"center"}
                            flexGrow={1}
                        >
                            {!isAlbumOnly && (
                                <Box maxW={["33.89vw", "16.94vw"]}>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.46vw"}
                                        lineHeight={"1.6vw"}
                                    >
                                        {displayData?.album?.name}
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.25vw"}
                                        lineHeight={"1.6vw"}
                                        color={"#9C9895"}
                                    >
                                        {displayData?.album?.region ? `${displayData?.album?.region?.name}, ` : ""}{displayData?.album?.country?.name}
                                    </Text>
                                </Box>
                            )}

                            <Box maxW={["33.89vw", "16.94vw"]}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.6vw"}
                                >
                                    Best Time To Visit
                                </Text>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.25vw"}
                                    lineHeight={"1.6vw"}
                                    color={"#9C9895"}
                                >
                                    {displayData?.album?.bestTimetoTravel ||
                                        "N/A"}
                                </Text>
                            </Box>

                            <Box maxW={["33.89vw", "16.94vw"]}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.6vw"}
                                >
                                    Prices Starting at
                                </Text>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.25vw"}
                                    lineHeight={"1.6vw"}
                                    color={"#9C9895"}
                                >
                                    {displayData?.album?.pricesStartingAt ||
                                        "N/A"}
                                </Text>
                            </Box>

                            <Box maxW={["33.89vw", "16.94vw"]}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.6vw"}
                                >
                                    No. of Rooms
                                </Text>
                                <Text
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    fontSize={"1.25vw"}
                                    lineHeight={"1.6vw"}
                                    color={"#9C9895"}
                                >
                                    {displayData?.album?.numberOfNights ||
                                        "N/A"}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <Box
                        display={{ base: "flex", sm: "none" }}
                        h={"calc(181.11vw - 143.33vw)"}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        alignItems={"center"}
                    >
                        <Flex
                            flexWrap={"wrap"}
                            gap={"5.83vw"}
                        >
                            <Box>
                                {!isAlbumOnly && (
                                    <Box
                                        maxW={"33.89vw"}
                                        minW={"33.89vw"}
                                        minH={"12.78vw"}
                                    >
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"3.33vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#EFE9E4"}
                                        >
                                            {displayData?.album?.name}
                                        </Text>
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"2.78vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#9C9895"}
                                        >
                                            {displayData?.album?.region ? `${displayData?.album?.region?.name}, ` : ""}{displayData?.album?.country?.name}
                                        </Text>
                                    </Box>
                                )}
                                <Box
                                    maxW={"33.89vw"}
                                    minW={"33.89vw"}
                                    minH={"12.78vw"}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"3.33vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#EFE9E4"}
                                    >
                                        Prices Starting at
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"2.78vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#9C9895"}
                                    >
                                        {displayData?.album
                                            ?.pricesStartingAt || "N/A"}
                                    </Text>
                                </Box>
                            </Box>

                            <Box>
                                <Box
                                    maxW={"33.89vw"}
                                    minW={"33.89vw"}
                                    minH={"12.78vw"}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"3.33vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#EFE9E4"}
                                    >
                                        Best Time To Visit
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"2.78vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#9C9895"}
                                    >
                                        {displayData?.album
                                            ?.bestTimetoTravel || "N/A"}
                                    </Text>
                                </Box>
                                <Box
                                    maxW={"33.89vw"}
                                    minW={"33.89vw"}
                                    minH={"12.78vw"}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"3.33vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#EFE9E4"}
                                    >
                                        No. of Rooms
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"2.78vw"}
                                        lineHeight={"3.61vw"}
                                        color={"#9C9895"}
                                    >
                                        {displayData?.album
                                            ?.numberOfNights || "N/A"}
                                    </Text>
                                </Box>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Box>

            <Box w={"100%"}>
                {isAlbumOnly ? (
                    <Box mt={12}>
                        <StayExperiences
                            postcards={postcards}
                            album={displayData?.album || null}
                            newsArticle={newsArticle}
                            refetchNewsArticle={refetchNewsArticle}
                            setAlbum={setAlbum}
                            tagList={tagList}
                            handleTagClick={handleTagClick}
                            showActionButton={showActionButton}
                        />
                    </Box>
                ) : (
                    <Tabs variant="categoryList" isLazy
                        onChange={(index) => {
                            console.log(index)
                            if (setActiveTab) {
                                setActiveTab(index);
                            }
                        }}
                    >
                        <TabList
                            justifyContent="center"
                            flexDirection="row"
                            mb={16}
                            mt={12}
                            gap={["0.5rem", "3.5rem"]}
                        >
                            <Tab fontSize={[16, 24]} px="1rem">Experiences</Tab>
                            <Tab fontSize={[16, 24]} px="1rem">About</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel mt={-12}>
                                <StayExperiences
                                    postcards={postcards}
                                    album={displayData?.album || null}
                                    newsArticle={newsArticle}
                                    refetchNewsArticle={refetchNewsArticle}
                                    setAlbum={setAlbum}
                                    tagList={tagList}
                                    handleTagClick={handleTagClick}
                                    showActionButton={showActionButton}
                                />
                            </TabPanel>

                            <TabPanel bg="white" pt="0">
                                <Flex direction="column" w="100%">
                                    {renderSections?.length > 0 &&
                                        renderSections?.map((pageSection, sectionIndex) => {
                                            const lenOfSection = pageSection?.length || 0;
                                            return (
                                                <Box
                                                    key={`section_${sectionIndex}`}
                                                    w={"100%"}
                                                    className="panel"
                                                    bg={
                                                        sectionIndex === 0
                                                            ? "#EFE9E4"
                                                            : "transparent!important"
                                                    }
                                                    mt={
                                                        sectionIndex === 1
                                                            ? ["-5%", "-2%"]
                                                            : "auto"
                                                    }
                                                >
                                                    {pageSection?.length > 0 &&
                                                        pageSection.map((section, index) => (
                                                            <Box
                                                                key={section?.id || index}
                                                            >
                                                                {section?.album_section?.id ==
                                                                    1 && (
                                                                        <Box
                                                                            id={
                                                                                section
                                                                                    .album_section
                                                                                    ?.name
                                                                            }
                                                                            w={"100%"}
                                                                            bg={"primary_1"}
                                                                            px={[
                                                                                "12.22vw",
                                                                                "8.5vw"
                                                                            ]}
                                                                            py={[
                                                                                "10.83vw",
                                                                                "6.875vw"
                                                                            ]}
                                                                            borderTopRadius={[
                                                                                "4.167vw",
                                                                                "2.08vw"
                                                                            ]}
                                                                        >
                                                                            <Flex
                                                                                flexDirection={
                                                                                    "column"
                                                                                }
                                                                            >
                                                                                <Text
                                                                                    color={
                                                                                        "#EFE9E4"
                                                                                    }
                                                                                    fontFamily={
                                                                                        "lora"
                                                                                    }
                                                                                    fontStyle={
                                                                                        "italic"
                                                                                    }
                                                                                    fontSize={[
                                                                                        "7.78vw",
                                                                                        "3.06vw"
                                                                                    ]}
                                                                                >
                                                                                    {
                                                                                        section
                                                                                            .album_section
                                                                                            ?.name
                                                                                    }
                                                                                </Text>

                                                                                <Box
                                                                                    h={[
                                                                                        "1px",
                                                                                        "2px"
                                                                                    ]}
                                                                                    mt={[
                                                                                        "6.94vw",
                                                                                        "3.125vw"
                                                                                    ]}
                                                                                    w={"100%"}
                                                                                    bg={"#EFE9E4"}
                                                                                ></Box>

                                                                                <Flex
                                                                                    mt={[
                                                                                        "0vw",
                                                                                        "2.57vw"
                                                                                    ]}
                                                                                    justifyContent={
                                                                                        "space-between"
                                                                                    }
                                                                                    flexDirection={[
                                                                                        "column",
                                                                                        "row"
                                                                                    ]}
                                                                                >
                                                                                    <Flex
                                                                                        flexDirection={
                                                                                            "column"
                                                                                        }
                                                                                        w={[
                                                                                            "100%",
                                                                                            "52.85vw"
                                                                                        ]}
                                                                                        className={
                                                                                            root
                                                                                        }
                                                                                    >
                                                                                        <RenderMarkdown
                                                                                            className={
                                                                                                markdownStyles
                                                                                            }
                                                                                            content={
                                                                                                section.content
                                                                                            }
                                                                                            color={
                                                                                                "#EFE9E4"
                                                                                            }
                                                                                        />
                                                                                    </Flex>

                                                                                    <Flex
                                                                                        flexDirection={
                                                                                            "column"
                                                                                        }
                                                                                        w={[
                                                                                            "100%",
                                                                                            "21.6vw"
                                                                                        ]}
                                                                                        gap={[
                                                                                            "3.06vw",
                                                                                            "1.04vw"
                                                                                        ]}
                                                                                        mb={[
                                                                                            "15vw",
                                                                                            "4vw"
                                                                                        ]}
                                                                                    >
                                                                                        <IndexSection
                                                                                            pageSections={
                                                                                                pageSections
                                                                                            }
                                                                                            newsArticle={
                                                                                                newsArticle
                                                                                            }
                                                                                        />
                                                                                    </Flex>
                                                                                </Flex>
                                                                            </Flex>
                                                                        </Box>
                                                                    )}

                                                                {section?.album_section?.id !==
                                                                    1 &&
                                                                    section?.album_section
                                                                        .id !== 2 &&
                                                                    section?.album_section
                                                                        .id !== 7 && section?.album_section
                                                                            .id !== 8 && (
                                                                        <Box
                                                                            id={
                                                                                section
                                                                                    .album_section
                                                                                    ?.name
                                                                            }
                                                                            w={"100%"}
                                                                            bg={"white"}
                                                                            borderTopRadius={[
                                                                                "4.167vw",
                                                                                "2.08vw"
                                                                            ]}
                                                                            mt={[
                                                                                "-4.167vw",
                                                                                "-2.08vw"
                                                                            ]}
                                                                            px={[
                                                                                "10.55vw",
                                                                                "18.54vw"
                                                                            ]}
                                                                            pt={[
                                                                                "13.33vw",
                                                                                "6.32vw"
                                                                            ]}
                                                                            pb={
                                                                                index ==
                                                                                lenOfSection -
                                                                                1 && [
                                                                                    "11.4vw",
                                                                                    "6.32vw"
                                                                                ]
                                                                            }
                                                                            boxShadow={
                                                                                index == 0 && [
                                                                                    "0px -20px 25px 0px rgba(0,0,0,0.2)",
                                                                                    "0px -35px 25px 0px rgba(0,0,0,0.2)"
                                                                                ]
                                                                            }
                                                                        >
                                                                            <Flex
                                                                                flexDirection={
                                                                                    "column"
                                                                                }
                                                                            >
                                                                                {index == 0 && (
                                                                                    <Text
                                                                                        color={
                                                                                            "primary_1"
                                                                                        }
                                                                                        fontFamily={
                                                                                            "lora"
                                                                                        }
                                                                                        fontStyle={
                                                                                            "italic"
                                                                                        }
                                                                                        fontSize={[
                                                                                            "6.4vw",
                                                                                            "3.06vw"
                                                                                        ]}
                                                                                    >
                                                                                        {
                                                                                            section
                                                                                                .album_section
                                                                                                ?.name
                                                                                        }
                                                                                    </Text>
                                                                                )}
                                                                                {index > 0 && (
                                                                                    <Box
                                                                                        h={[
                                                                                            "1px",
                                                                                            "2px"
                                                                                        ]}
                                                                                        mb={[
                                                                                            "8.88vw",
                                                                                            "4.9vw"
                                                                                        ]}
                                                                                        w={
                                                                                            "100%"
                                                                                        }
                                                                                        bg={
                                                                                            "#111111"
                                                                                        }
                                                                                    ></Box>
                                                                                )}

                                                                                <Box
                                                                                    mt={
                                                                                        index ==
                                                                                        0 &&
                                                                                        "2.5vw"
                                                                                    }
                                                                                    className={
                                                                                        root
                                                                                    }
                                                                                >
                                                                                    <Text
                                                                                        fontSize={[
                                                                                            "4.44vw!important",
                                                                                            "2.08vw!important"
                                                                                        ]}
                                                                                        lineHeight={[
                                                                                            "5.55vw!important",
                                                                                            "2.64vw!important"
                                                                                        ]}
                                                                                        fontFamily={
                                                                                            "raleway"
                                                                                        }
                                                                                        textAlign={
                                                                                            "left!important"
                                                                                        }
                                                                                        color={
                                                                                            "#111111"
                                                                                        }
                                                                                        fontWeight={
                                                                                            "500!important"
                                                                                        }
                                                                                    >
                                                                                        {section
                                                                                            .album_section
                                                                                            ?.name ===
                                                                                            "Impact Story" &&
                                                                                            section?.title !=
                                                                                            "Caring for People and the Planet"
                                                                                            ? "Caring for People and the Planet"
                                                                                            : section?.title}
                                                                                    </Text>

                                                                                    {section
                                                                                        ?.image
                                                                                        ?.url && (
                                                                                            <ChakraNextImage
                                                                                                src={
                                                                                                    section
                                                                                                        .image
                                                                                                        ?.url
                                                                                                }
                                                                                                w={["100%", "63.05vw"]}
                                                                                                h={["auto", "34.72vw"]}
                                                                                                objectFit={"cover"}
                                                                                                borderRadius={["3.611vw", "1.67vw"]}
                                                                                                alt={"section image"}
                                                                                            />
                                                                                        )}
                                                                                    {section
                                                                                        ?.image
                                                                                        ?.url &&
                                                                                        section?.imageCopyright && (
                                                                                            <Box
                                                                                                textAlign={
                                                                                                    "center"
                                                                                                }
                                                                                            >{`Photo Copyright: ${section.imageCopyright}`}</Box>
                                                                                        )}
                                                                                    <RenderMarkdown
                                                                                        className={
                                                                                            markdownStyles
                                                                                        }
                                                                                        content={
                                                                                            section.content
                                                                                        }
                                                                                    />
                                                                                </Box>
                                                                            </Flex>
                                                                        </Box>
                                                                    )}
                                                            </Box>
                                                        ))}
                                                </Box>
                                            );
                                        })}
                                    <Flex
                                        mt={["15px", "15px", "15px", "1.3vw"]}
                                        mb={["15%", "10%"]}
                                        mx={["auto", "18.54vw"]}
                                        justifyContent={["space-around", "space-between"]}
                                        gap={["12px", "12px", "12px", "0.9vw"]}
                                        bg="white"
                                        w={["80%", "40%"]}
                                    >
                                        <Button
                                            as={Link}
                                            variant={"none"}
                                            h={["8.33vw", "3.96vw"]}
                                            border={"2px"}
                                            borderRadius={["5.55vw", "2.64vw"]}
                                            borderColor={"primary_1"}
                                            bg={"primary_1"}
                                            color={"#EFE9E4"}
                                            w={"48%"}
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={["3.33vw", "1.6vw"]}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addBacklinkEvent(profile?.id, displayData?.album?.website, displayData?.album?.id, null)
                                            }}
                                            href={displayData?.album?.website}
                                            target="_blank"
                                            px={["9.167vw", "4.375vw"]}
                                        >
                                            Visit Website
                                        </Button>
                                        <Button
                                            variant="none"
                                            h={["8.33vw", "3.96vw"]}
                                            borderRadius={["5.55vw", "2.64vw"]}
                                            px={["9.167vw", "4.375vw"]}
                                            bg={"primary_1"}
                                            color={"#EFE9E4"}
                                            w={"48%"}
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={["3.33vw", "1.6vw"]}
                                            onClick={handleFollowUnfollowAlbum}
                                        >
                                            {followed
                                                ? "Added to Diary"
                                                : "Add to Diary"}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}
            </Box>
        </Flex>
    );
};

export default BlogPage;