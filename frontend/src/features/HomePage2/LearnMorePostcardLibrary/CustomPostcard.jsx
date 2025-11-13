import React, { useContext, useEffect, useState, useMemo } from "react";
import FlipCard1 from "../../../patterns/FlipCard1";
import { Box, Button, Circle, Flex, Icon, Image, Link, Text } from "@chakra-ui/react";
import {
    BookmarkIcon,
    EditIcon,
    FlipIcon,
    WebsiteIcon
} from "../../../styles/ChakraUI/icons";
import { deleteDBEntry, fetchPaginatedResults } from "../../../queries/strapiQueries";
import AppContext from "../../AppContext";
import { addAlbumEvent, addBacklinkEvent, addRemoveLikeBookmark } from "../../../services/utilities";
import { MdDelete, MdEdit } from "react-icons/md";
import { apiNames } from "../../../services/fetchApIDataSchema";
import { StarIcon } from "@chakra-ui/icons";
import MemoriesUpload from "../../../patterns/MemoriesUpload";
import PostcardModal from "../../PostcardModal";
import CollectionList from "../../CollectionList";
import { useSignupModal } from "../../SignupModalContext";
import PostcardAlert from "../../PostcardAlert";

const CustomPostcard = ({
    postcard,
    from,
    setIsEdit,
    canEdit,
    refetch,
    // Optional props for auto-flip functionality - won't affect existing usage
    isFirstItem = false,
    firstLoad = false,
    setFirstLoad = () => { }
}) => {
    const { profile, canCreatePostcard, logOut, featuredPostcards, updateFeaturedItems } = useContext(AppContext);
    const memoizedProfile = useMemo(() => profile, [profile])
    const memoizedPostcard = useMemo(() => postcard, [postcard])
    const [showCollectedPopup, setShowCollectedPopup] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [pcBkms, setPcBkms] = useState(postcard.bookmarks);
    const [showCollectedBy, setShowCollectedBy] = useState({
        state: false,
        collectedUsers: []
    });
    const { openLoginModal } = useSignupModal()
    const [deleteAlert, setDeleteAlert] = useState({
        message: "Are your sure to delete this postcard?",
        mode: false
    });

    const capitalizeWords = (tag) =>
        tag
            ?.split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    useEffect(() => {
        if (postcard && profile) {
            if (pcBkms && pcBkms.length >= 1) {
                let liked = false;
                let likeId = null;

                pcBkms.forEach((i) => {
                    if (i.user) {
                        // Check if the current user's id matches the profile id
                        if (i.user.id === profile.id) {
                            liked = true;
                            likeId = i.id;
                        }
                    }
                });

                // Set liked state if profile.id is found in the users
                setLiked(liked);
                setLikeId(likeId);
            }
        }
    }, [memoizedProfile, memoizedPostcard]);

    // useEffect(() => console.log(liked, likeId), [likeId, liked]);

    const handleBookmark = (e) => {
        e.stopPropagation();
        if (profile) {
            addRemoveLikeBookmark(
                liked,
                likeId,
                profile.id,
                postcard,
                (like) => {
                    // console.log(like);
                    if (like.error) {
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
                        setLiked((prev) => !prev);
                        setLikeId(like?.id || null);

                        if (!liked) {
                            // Adding bookmark
                            setPcBkms([...pcBkms, { user: profile }]);
                        } else {
                            // Removing bookmark
                            const newList = pcBkms.filter(
                                (bkm) => bkm.user?.id !== profile.id
                            );
                            setPcBkms(newList);
                        }
                    }
                }
            );
        } else {
            openLoginModal()
        }
    }

    const handleDelete = (e) => {
        e?.stopPropagation()
        e?.preventDefault()
        if (canEdit && postcard?.id) {
            deleteDBEntry(apiNames.postcard, postcard.id).then((res) => {
                refetch()
                setDeleteAlert({ mode: false })
            })
        }
    }

    return (
        <FlipCard1
            // Only pass auto-flip props if this is the first item, otherwise use defaults
            firstLoad={isFirstItem && firstLoad}
            setFirstLoad={isFirstItem ? setFirstLoad : () => { }}
            frontContent={
                <>
                    <Flex
                        // w={"22.92vw"}
                        h={["530px", "530px", "530px", "38vw"]}
                        minH={["530px", "530px", "530px", "38vw"]}
                        w={["100%", "314px", "314px", "25vw"]}
                        minW={["85vw", "25vw"]}
                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        flexDirection={"column"}
                        bg={"white"}
                        position={"relative"}
                    >
                        {profile?.user_type?.name == "Admin" &&
                            <StarIcon
                                w={"1.6em"}
                                h={"1.6em"}
                                position={"absolute"}
                                right={"5%"}
                                top={"2%"}
                                color={featuredPostcards.includes(postcard?.id) ? "primary_1" : "white"}
                                stroke="primary_1" // Ensures outline is primary_1
                                strokeWidth="1px" // Adjust the outline thickness
                                onClick={(e) => {
                                    e.stopPropagation();
                                    !featuredPostcards.includes(postcard?.id) && updateFeaturedItems("postcards", postcard.id)
                                }}
                            />}
                        <PostcardModal
                            isShow={showCollectedPopup}
                            headerText={"Collected By"}
                            children={
                                <CollectionList
                                    list={showCollectedBy.collectedUsers}
                                    onClose={() => setShowCollectedPopup(false)}
                                />
                            }
                            handleClose={() => setShowCollectedPopup(false)}
                            style={{ padding: "20px", width: "100%" }}
                            size={"md"}
                        />
                        <Image
                            src={postcard?.coverImage?.url}
                            h={"21.53vw"}
                            minH={"295px"}
                            objectFit={"cover"}
                            borderTopRadius={[
                                "22.5px",
                                "22.5px",
                                "22.5px",
                                "1.563vw"
                            ]}
                            alt={"postcard"}
                        />
                        <Flex
                            flexDirection={"column"}
                            p={["20px", "20px", "20px", "1.53vw"]}
                            pb={["21px", "21px", "21px", "1vw"]}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontSize={["13px", "13px", "13px", "0.94vw"]}
                                lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                fontWeight={500}
                                color={"primary_3"}
                                textAlign={"left"}
                            >
                                {postcard?.album?.region ? `${postcard?.album?.region?.name}, ` : ""}{postcard?.country?.name}
                            </Text>
                            <Text
                                mt={["15px", "1vw"]}
                                fontFamily={"raleway"}
                                fontSize={["20px", "1.4vw"]}
                                lineHeight={["24px", "1.7vw"]}
                                fontWeight={500}
                                textAlign={"left"}
                            >
                                {postcard?.name?.trim()}
                            </Text>


                            {/*
                            <Text
                                mt={["14px", "14px", "14px", "0.7vw"]}
                                fontFamily={"raleway"}
                                fontSize={["13px", "13px", "13px", "0.97vw"]}
                                lineHeight={["15px", "15px", "15px", "1.25vw"]}
                                color={"black"}
                                textAlign={"left"}
                            >
                                {postcard?.intro}
                            </Text> */}

                            <Flex
                                wrap={"wrap"}
                                gap={["9px", "9px", "9px", "0.5vw"]}
                                mt={["17px", "17px", "17px", "1.25vw"]}
                            >
                                {postcard?.tags?.map((tag, index) => (
                                    <Flex
                                        as={Link}
                                        alignItems={"center"}
                                        key={index}
                                        h={"1.53vw"}
                                        minH={"20px"}
                                        borderWidth={"1px"}
                                        borderColor={"primary_3"}
                                        color={"primary_3"}
                                        borderRadius={[
                                            "22.5px",
                                            "22.5px",
                                            "22.5px",
                                            "1.563vw"
                                        ]}
                                        px={["10px", "10px", "10px", "0.7vw"]}
                                        fontFamily={"raleway"}
                                        fontSize={["10px", "10px", "10px", "12px"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        href={`/experiences/${tag.name?.toLowerCase()}`}
                                    >
                                        {capitalizeWords(tag?.name)}
                                    </Flex>
                                ))}
                            </Flex>

                            <Flex
                                mt={["27px", "27px", "27px", "2.08vw"]}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Flex
                                    gap={["10px", "10px", "10px", "0.83vw"]}
                                    maxW="min-content"
                                    alignItems={"center"}
                                >
                                    <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                    >
                                        <FlipIcon
                                            width={"100%"}
                                            height={[
                                                "24px",
                                                "24px",
                                                "24px",
                                                "1.80vw"
                                            ]}
                                            stroke={"primary_1"}
                                        />
                                    </Button>
                                    <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={handleBookmark}
                                    >
                                        <BookmarkIcon
                                            width={"100%"}
                                            height={[
                                                "24px",
                                                "24px",
                                                "24px",
                                                "1.80vw"
                                            ]}
                                            stroke={"primary_1"}
                                            fill={liked ? "primary_1" : "none"}
                                        />
                                    </Button>
                                    {liked && <MemoriesUpload type="postcard" data={postcard} profile={profile} />}
                                    {/* {canEdit && <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={(e) => { e.stopPropagation(); setIsEdit(true) }}
                                    >
                                        <Icon
                                            as={MdEdit}
                                            width={"100%"}
                                            height={[
                                                "24px",
                                                "24px",
                                                "24px",
                                                "1.80vw"
                                            ]}
                                            fill={"primary_1"}
                                        />
                                    </Button>}
                                    {canEdit && (from == "albumPage" || from == "toursPage") && <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteAlert({
                                                mode: true,
                                                message: "Are your sure to delete this postcard?"
                                            })
                                        }}
                                    >
                                        <Icon
                                            as={MdDelete}
                                            width={"100%"}
                                            height={[
                                                "24px",
                                                "24px",
                                                "24px",
                                                "1.80vw"
                                            ]}
                                            cursor={"pointer"}
                                            color={"primary_1"}
                                        />
                                    </Button>} */}
                                    {/* {showCollectedBy.state && CollectedByGroup} */}
                                </Flex>

                                <Text
                                    // w={"9.72vw"}
                                    w={"8vw"}
                                    minW={"128px"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    fontSize={["12px", "12px", "12px", "0.94vw"]}
                                    lineHeight={["15px", "15px", "15px", "1.11vw"]}
                                    color={"primary_3"}
                                    mb={0}
                                    // textAlign={"left"}
                                    textAlign={"right"}
                                >
                                    {postcard?.album?.signature}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <PostcardAlert
                        isCentered={true}
                        closeOnEsc={true}
                        closeOnOverlayClick={true}
                        show={deleteAlert}
                        closeAlert={() => setDeleteAlert({ mode: false })}
                        handleAction={handleDelete}
                        buttonText="DELETE"
                    />
                </>
            }
            backContent={
                <Flex
                    flexDirection={"column"}
                    // p={"1.4vw"}
                    pt={["23px", "23px", "23px", "1.67vw"]}
                    bg="white"
                    w={"100%"}
                    h={["530px", "530px", "530px", "39vw"]}
                    minH={["530px", "530px", "530px", "39vw"]}
                    borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                    position={"relative"}
                    justifyContent={"space-between"}
                >
                    <Box
                        pos="fixed"
                        bottom={["74px", "74px", "74px", "4.86vw"]}
                        left={0}
                        width="100%"
                        height="4vw"
                        minH={"48px"} // Adjust height based on the fading effect size
                        background="linear-gradient(to top, white 0%, transparent 100%)"
                        pointerEvents="none"
                        zIndex={10} // Ensure it stays above other content
                        opacity={1} // Optional: Adjust opacity if needed
                    />
                    <Box
                        px={["18px", "18px", "18px", "1.4vw"]}
                        overflowY={"scroll"}
                        pr={[2, 2]}
                        pb={["48px", "48px", "48px", "4.17vw"]}
                    // background={
                    //   "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,1) 6%)"
                    // }
                    >
                        <Text
                            fontFamily={"raleway"}
                            // fontSize={"0.833vw"}
                            // lineHeight={"1.11vw"}
                            pt="6%"
                            fontSize={["4vw", "1.2vw"]}
                            lineHeight={["6vw", "1.7vw"]}
                            color={"#111111"}
                            textAlign={"left"}
                            whiteSpace="pre-wrap" // This preserves spaces and line breaks
                        >
                            {postcard?.intro}
                        </Text>
                    </Box>

                    <Flex
                        mt={["32px", "32px", "32px", "2.08vw"]}
                        mb={0}
                        px={["18px", "18px", "18px", "1.4vw"]}
                        pb={["18px", "18px", "18px", "1.4vw"]}
                        justifyContent={"space-between"}
                    >
                        <Flex
                            gap={["10px", "10px", "10px", "0.83vw"]}
                            alignItems={"center"}
                        >
                            <Button
                                variant="none"
                                p={0}
                                m={0}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                                height={["24px", "24px", "24px", "1.80vw"]}
                                minH={["24px", "24px", "24px", "1.80vw"]}
                            >
                                <FlipIcon
                                    width={["19px", "19px", "19px", "1.46vw"]}
                                    height={["24px", "24px", "24px", "1.80vw"]}
                                    stroke={"primary_1"}
                                />
                            </Button>
                            <Button
                                variant="none"
                                p={0}
                                m={0}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                                height={["24px", "24px", "24px", "1.80vw"]}
                                minH={["24px", "24px", "24px", "1.80vw"]}
                                onClick={handleBookmark}
                            >
                                <BookmarkIcon
                                    width={["19px", "19px", "19px", "1.46vw"]}
                                    height={["24px", "24px", "24px", "1.80vw"]}
                                    stroke={"primary_1"}
                                    fill={liked ? "primary_1" : "none"}
                                />
                            </Button>
                            {canEdit && <Button
                                variant="none"
                                p={0}
                                m={0}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                                onClick={(e) => { e.stopPropagation(); setIsEdit(true) }}
                            >
                                <Icon
                                    as={MdEdit}
                                    width={"100%"}
                                    height={[
                                        "24px",
                                        "24px",
                                        "24px",
                                        "1.80vw"
                                    ]}
                                    fill={"primary_1"}
                                />
                            </Button>}
                            {canEdit && (from == "albumPage" || from == "toursPage") && <Button
                                variant="none"
                                p={0}
                                m={0}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteAlert({
                                        mode: true,
                                        message: "Are your sure to delete this postcard?"
                                    })
                                }}
                            >
                                <Icon
                                    as={MdDelete}
                                    width={"100%"}
                                    height={[
                                        "24px",
                                        "24px",
                                        "24px",
                                        "1.80vw"
                                    ]}
                                    cursor={"pointer"}
                                    color={"primary_1"}
                                />
                            </Button>}
                            {/* {showCollectedBy.state && CollectedByGroup} */}
                        </Flex>

                        <Flex
                            gap={["10px", "10px", "10px", "0.8vw"]}
                            alignItems={"center"}
                        >
                            {(from !== "albumPage" && from !== "toursPage") && (
                                <Button
                                    as={Link}
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    minH={["23px", "23px", "23px", "1.7vw"]}
                                    href={
                                        postcard?.album?.news_article
                                            ? `/postcard-pages/${postcard?.album?.slug}`
                                            : postcard?.album?.slug
                                    }
                                    target="_blank"
                                >
                                    <Image
                                        src="/assets/folder_icon.png"
                                        alt="Folder"
                                        width={["27px", "27px", "27px", "2.1vw"]}
                                        height={["23px", "23px", "23px", "1.7vw"]}
                                    />
                                </Button>

                            )}
                            <Button
                                as={Link}
                                variant="none"
                                p={0}
                                m={0}
                                minW={["23px", "23px", "23px", "1.74vw"]}
                                height={["23px", "23px", "23px", "1.74vw"]}
                                minH={["23px", "23px", "23px", "1.74vw"]}
                                href={postcard?.album?.website}
                                target={"_blank"}
                                onClick={(e) => { e.stopPropagation(); addBacklinkEvent(profile?.id, postcard?.album?.website, postcard?.album?.id, postcard?.id) }}
                            >
                                <WebsiteIcon
                                    width={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    stroke={"primary_1"}
                                />
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            }
            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
        />
    );
};

export default CustomPostcard;