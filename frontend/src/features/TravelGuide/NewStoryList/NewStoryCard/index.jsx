import Flippy, { FrontSide, BackSide } from "react-flippy";
import React, { useState, useRef, useContext, useEffect } from "react";
import AppContext from "../../../AppContext";
import PostcardAlert from "../../../PostcardAlert";
import Image from "next/image";
import borderRadius from "./index.module.scss";
import {
    Box,
    AspectRatio,
    Text,
    Flex,
    Button,
    Icon,
    Link
} from "@chakra-ui/react";
import { Waypoint } from "react-waypoint";
import { useRouter } from "next/router";
import { isOwnStory } from "../../../../services/utilities";
import * as ga from "../../../../services/googleAnalytics";
import {
    createDBEntry,
    deleteDBEntry,
    deleteStory,
    fetchPaginatedResults,
    updateStory
} from "../../../../queries/strapiQueries";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import PostcardModal from "../../../PostcardModal";
import SignUpInModal from "../../../HomePage1/SignUpInModal";
import SignUpInfoModal from "../../../HomePage1/SignUpInfoModal";
// import ModalSignupLogin from "../../../ModalSignupLogin";

const NewStoryCard = (props) => {
    const { indexId, story, refetch, handleEdit, isHotel, ...restProps } =
        props;
    const { firstLoad, setFirstLoad, profile } = useContext(AppContext);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [tagList, setTagList] = useState([]);
    const [deleteAlert, showAlert] = useState({
        message: "Are you sure to delete the story?",
        mode: false
    });
    const [isFeatured, setFeatured] = useState(
        story ? story?.isFeatured : false
    );
    const [showLoginModal, setShowLoginModal] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const router = useRouter();
    const [followerData, setFollowerData] = useState([]);
    const [profileIsFollower, setProfileIsFollower] = useState(false);
    const ref = useRef();
    useEffect(() => {
        getFollowerData();
    }, [profile]);
    useEffect(() => {
        getTags();
    }, [story]);
    const getTags = async () => {
        let tags = [];
        if (story && story.id)
            tags = await fetchPaginatedResults(
                "albums/gettags?albumId=" + story.id,
                {},
                {}
            );
        setTagList(tags);
    };

    const getFollowerData = async () => {
        if (story) {
            let data = await fetchPaginatedResults(
                "follow-albums",
                {
                    album: { id: story.id }
                },
                {
                    follower: {
                        fields: ["fullName", "slug"],
                        populate: {
                            profilePic: {
                                fields: ["url"]
                            }
                        }
                    }
                }
            );
            let followDetails = Array.isArray(data) ? data : [data];
            setFollowerData(followDetails);
            if (profile) {
                setProfileIsFollower(
                    followDetails.filter(
                        (follow) => follow?.follower?.id === profile?.id
                    ).length > 0
                        ? true
                        : false
                );
                if (
                    showLoginModal.doFollow &&
                    followDetails.filter(
                        (follow) => follow?.follower?.id === profile?.id
                    ).length <= 0
                ) {
                    setShowLoginModal({ isShow: false, doFollow: false });
                    followUnFollowAlbum();
                } else setShowLoginModal(false);
            }
        }
    };
    const followUnFollowAlbum = () => {
        // console.log(profileIsFollower, showLoginModal);
        if (profileIsFollower) {
            let follow = followerData.filter(
                (follow) => follow?.follower?.id === profile?.id
            );
            deleteDBEntry("follow-albums", follow[0].id).then((resp) =>
                getFollowerData()
            );
        } else {
            if (
                followerData.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length === 0
            )
                createDBEntry("follow-albums", {
                    follower: profile.id,
                    album: story.id
                }).then((resp) => getFollowerData());
        }
    };

    return (
        story && (
            <Box
                w="100%"
                {...restProps}
                style={{ minWidth: "300px", cursor: "pointer", padding: "0px" }}
                boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
                borderRadius={"8px"}
                //ref={(ref) => setCardFrontRef(ref)}
            >
                <AspectRatio borderTopRadius="8px" ratio={1} overflow="hidden">
                    <Image
                        src={story?.coverImage?.url || global.$defaultProfile}
                        // objectFit="cover"
                        // layout="fill"
                        style={{ objectFit: "cover" }}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`Story Image ${indexId + 1}`}
                        priority={indexId < 2 ? true : false} // first two images load with priority
                    ></Image>
                </AspectRatio>
                {/* <Waypoint
                            scrollableAncestor="window"
                            onEnter={() => {
                                if (
                                    indexId === 0 &&
                                    !firstLoad?.includes(ref)
                                ) {
                                    ref.current.toggle();
                                    setTimeout(
                                        () => ref.current?.toggle(),
                                        2000
                                    );
                                    setFirstLoad([...firstLoad, ref]);
                                }
                            }}
                        > */}
                <Box bg="cardBackground" borderBottomRadius="8px" p="3%">
                    <Text
                        fontSize="24px"
                        mt="6%"
                        px={[1, 3]}
                        lineHeight={1.2}
                        textAlign={"left"}
                        color="primary_16"
                        fontWeight={700}
                        fontFamily="raleway"
                    >
                        {" "}
                        {story.name}
                    </Text>
                    {story.country && (
                        <Text
                            color="primary_3"
                            fontSize="16px"
                            textAlign={"left"}
                            fontFamily="raleway"
                            fontWeight={700}
                            marginTop="10px"
                            px={[1, 3]}
                        >
                            {story?.country?.name}
                        </Text>
                    )}
                    {/* {story.company?.name && (
                                <Text
                                    color={
                                        story.user?.slug
                                            ? "primary_1"
                                            : "primary_3"
                                    }
                                    marginTop="10px"
                                    fontSize="14px"
                                    textAlign={"center"}
                                    fontFamily="raleway"
                                    fontWeight={700}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (story.user?.slug)
                                            window.open(
                                                "/" + story.user.slug,
                                                "_blank"
                                            );
                                    }}
                                >
                                    {story.company.name}
                                </Text>
                            )} */}
                    {/* {story.country && (
                                <Text
                                    color="primary_4"
                                    fontSize="12px"
                                    mb={6}
                                    mt={3}
                                    fontFamily="raleway"
                                    fontWeight={700}
                                >
                                    {story?.country?.name}
                                </Text>
                            )} */}
                    <Text
                        color="primary_6"
                        fontFamily="raleway"
                        my={4}
                        // maxH="70%"
                        px={[1, 3]}
                        // overflow={"scroll"}
                        whiteSpace="pre-line"
                        fontSize="1rem"
                        noOfLines={10}
                        textAlign="left"
                    >
                        {story.intro}
                    </Text>
                    {tagList && tagList.length > 0 && (
                        <Text
                            color="primary_6"
                            fontFamily="raleway"
                            my={3}
                            // maxH="70%"
                            px={[1, 3]}
                            // overflow={"scroll"}
                            whiteSpace="pre-line"
                            fontWeight={500}
                            fontSize="0.8rem"
                            noOfLines={10}
                            textAlign="justify"
                        >
                            <b>Experiences:</b>
                            <br />
                            {tagList.join(" / ")} / and more...
                        </Text>
                    )}
                    {/* {tagList && tagList.length > 0 && (
                                <Flex
                                    w="100%"
                                    px={[1, 3]}
                                    flexWrap={"wrap"}
                                    //  justifyContent={"center"}
                                    my={"1em"}
                                >
                                    {tagList.map((tag) => (
                                        <Text
                                            borderWidth="1px"
                                            borderColor={"primary_3"}
                                            borderRadius="43px"
                                            fontSize={"12px"}
                                            mr="0.5em"
                                            mt="0.5em"
                                            color="primary_4"
                                            padding="3px 6px"
                                            fontWeight={600}
                                        >
                                            {tag}
                                        </Text>
                                    ))}
                                </Flex>
                            )} */}
                    <Flex w="100%" mt="4%" mb="6%" justifyContent={"center"}>
                        {/* {isOwnStory(profile, story?.user) &&
                                    !story?.isBkmCollection && (
                                        <Box mt="3%">
                                            {" "}
                                            <Icon
                                                as={BiEditAlt}
                                                color="primary_1"
                                                mr="16px"
                                                boxSize="25px"
                                                bgColor="primary_15"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit();
                                                }}
                                            />
                                            <Icon
                                                as={RiDeleteBin6Line}
                                                color="primary_1"
                                                boxSize="25px"
                                                bgColor="primary_15"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showAlert({
                                                        message:
                                                            " Are you sure to delete the story?",
                                                        mode: true
                                                    });
                                                }}
                                            />
                                        </Box>
                                    )} */}

                        <Flex
                            // bottom="3vh"
                            mt="6%"
                            w={"100%"}
                            justifyContent="space-evenly"
                        >
                            <>
                                {((story.isFeatured && story.isActive) ||
                                    isOwnStory(profile, story?.user)) && (
                                    <Button
                                        fontSize={"14px"}
                                        w={["45%", "40%"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            let link =
                                                story.news_article &&
                                                story.news_article?.status ===
                                                    "published"
                                                    ? "/postcard-pages/" +
                                                      story?.slug
                                                    : "/" + story?.slug;
                                            // router.push(link);
                                            window.open(link, "_blank");
                                            ga.event({
                                                action: "click",
                                                category: "album_page_visits",
                                                label: "album_page_clicks",
                                                value: 3
                                            });

                                            createDBEntry("events", {
                                                event_master: 2,
                                                user: profile
                                                    ? profile.id
                                                    : null,
                                                album: story?.id,
                                                url: "/" + story.slug
                                            });
                                        }}
                                        //p="10px"
                                        //borderRadius={"8px"}
                                    >
                                        {" "}
                                        Discover More
                                    </Button>
                                )}
                                {story.isFeatured &&
                                    !story.isActive &&
                                    !isOwnStory(profile, story?.user) && (
                                        <Text
                                            variant="readMore_notClickable"
                                            border={"none"}
                                            p="10px"
                                            borderRadius={"8px"}
                                        >
                                            Coming Soon
                                        </Text>
                                    )}

                                {story &&
                                    (story?.website ||
                                        story?.user?.social?.blogURL) && (
                                        <Button
                                            fontSize={"14px"}
                                            //fontWeight={"normal"}

                                            w={["45%", "40%"]}
                                            variant={"outline"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                ga.event({
                                                    action: "click",
                                                    category:
                                                        "partner_website_visits",
                                                    label: "partner_website_clicks",
                                                    value: 3
                                                });
                                                createDBEntry("events", {
                                                    event_master: 1,
                                                    user: profile
                                                        ? profile.id
                                                        : null,
                                                    album: story?.id,
                                                    url: story.website
                                                        ? story.website
                                                        : story?.user?.social
                                                              ?.blogURL
                                                });
                                                window.open(
                                                    story.website
                                                        ? story.website
                                                        : story?.user?.social
                                                              ?.blogURL,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            Visit Website
                                        </Button>
                                    )}

                                {/* <PostcardModal
                                    isShow={showLoginModal.isShow}
                                    headerText={
                                        showLoginModal.mode === "login"
                                            ? "Sign in"
                                            : "Free Sign Up!"
                                    }
                                    size={
                                        showLoginModal.mode === "login"
                                            ? "xl"
                                            : "sm"
                                    }
                                    // scrollBehavior={scrollbehav}
                                    style={profile ? { padding: "0px" } : {}}
                                    children={
                                        <ModalSignupLogin
                                            mode={showLoginModal.mode}
                                            isSchedulerOpen={true}
                                            toggleMode={() =>
                                                setShowLoginModal({
                                                    isShow: true,
                                                    mode:
                                                        showLoginModal.mode ===
                                                        "login"
                                                            ? "signup"
                                                            : "login"
                                                })
                                            }
                                            handleClose={() => {
                                                if (!showLoginModal.doFollow)
                                                    setShowLoginModal(false);
                                            }}
                                        />
                                    }
                                    handleClose={() => setShowLoginModal(false)}
                                /> */}
                                <SignUpInModal
                                    isShow={showLoginModal.isShow}
                                    mode={showLoginModal.mode}
                                    setShowModal={setShowLoginModal}
                                    setShowSignModal={setShowSignModal}
                                />
                                <SignUpInfoModal
                                    state={showSignModal}
                                    setShowSignModal={setShowSignModal}
                                />
                                {/* {profile &&
                                        (profile?.user_type?.name ===
                                            "SuperAdmin" ||
                                            profile?.user_type?.name ===
                                                "Admin") &&
                                        !story?.isBkmCollection && (
                                            <Button
                                                fontSize={["16px", "18px"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    let data = {
                                                        isFeatured: !isFeatured
                                                    };
                                                    updateStory(
                                                        story?.id,
                                                        data
                                                    ).then((response) => {
                                                        if (response)
                                                            setFeatured(
                                                                response?.data
                                                                    ?.isFeatured
                                                            );
                                                    });
                                                }}
                                            >
                                                {" "}
                                                {isFeatured
                                                    ? "Un Feature"
                                                    : "Feature it"}

                                        )} */}
                            </>
                        </Flex>
                    </Flex>
                    {/* {story.company?.name && (
                                <Text
                                    color="primary_3"
                                    fontSize="16px"
                                    fontFamily="raleway"
                                    fontWeight={700}
                                    marginTop="10px"
                                >
                                    {story?.company?.name}
                                </Text>
                            )} */}
                </Box>
                {/* </Waypoint> */}
            </Box>
        )
    );
};

export default NewStoryCard;
