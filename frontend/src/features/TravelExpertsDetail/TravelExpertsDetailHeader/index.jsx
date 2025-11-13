import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Text,
    Image,
    Flex,
    Avatar,
    AspectRatio,
    Center,
    Link
} from "@chakra-ui/react";
import PostcardModal from "../../PostcardModal";
import ModalShare from "../../ModalShare";
import { FlexBox } from "../../../styles/Layout/FlexBox";
import { Router } from "next/router";
import {
    createDBEntry,
    deleteDBEntry,
    fetchPaginatedResults
} from "../../../queries/strapiQueries";
import CollectionList from "../../CollectionList";
import SignUpInModal from "../../HomePage1/SignUpInModal";
import SignUpInfoModal from "../../HomePage1/SignUpInfoModal";
// import ModalSignupLogin from "../../ModalSignupLogin";

const TravelExpertsDetailHeader = ({ expert, profile, refetch }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [followerData, setFollowerData] = useState([]);
    const [profileIsFollower, setProfileIsFollower] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [showCollectedPopup, setShowCollectedPopup] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    useEffect(() => {
        getFollowerData();
    }, [profile]);

    const getFollowerData = async () => {
        if (expert.company) {
            let data = await fetchPaginatedResults(
                "follow-companies",
                {
                    company: { id: expert.company.id }
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
                    followUnFollowProfile();
                } else setShowLoginModal(false);
            }
        }
    };
    const followUnFollowProfile = () => {
        // console.log(profileIsFollower, showLoginModal);
        if (profileIsFollower) {
            let follow = followerData.filter(
                (follow) => follow?.follower?.id === profile?.id
            );
            deleteDBEntry("follow-companies", follow[0].id).then((resp) =>
                getFollowerData()
            );
        } else {
            if (
                followerData.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length === 0 &&
                expert.company
            )
                createDBEntry("follow-companies", {
                    follower: profile.id,
                    company: expert.company.id
                }).then((resp) => getFollowerData());
        }
        setTimeout(() => {
            setInProgress(false);
        }, 50);
    };
    return (
        <>
            {" "}
            <Flex
                justify={"center"}
                // pos="absolute"
                //zIndex={999}
                mx="auto"
                mt={["0em", "1em"]}
                width="100%"

            //bottom={-20}
            >
                <AspectRatio
                    w={["100%", "500px"]}
                    maxW={["100%", "500px"]}
                    ratio={1}
                    pos="relative"
                    margin="auto"
                >
                    <Box
                        pos="relative"
                        borderRadius="8px"
                        padding={["5%", "0px"]}
                    //  boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                    >
                        <Image
                            loading="lazy"
                            w="100%"
                            h="100%"
                            borderRadius="8px"
                            boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                            objectFit="cover"
                            src={
                                expert?.profilePic?.url
                                    ? expert?.profilePic?.url
                                    : "/assets/images/p_stamp.png"
                            }
                            fallbackSrc={"/assets/images/p_stamp.png"}
                            alt={"profile"}
                        ></Image>
                    </Box>
                </AspectRatio>
            </Flex>
            <FlexBox variant="homePage">
                {/* <Box pos="relative" w="100%" minH="60vh">
                <Box
                    w={"full"}
                    bg={"white"}
                    boxShadow={"2xl"}
                    rounded={"md"}
                    pos="relative"
                >
                    <Image
                        h={"50vh"}
                        w={"full"}
                        src={
                            "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                        }
                        objectFit={"cover"}
                    />
                </Box>
            </Box> */}
                <Box mt="1em" width="100%">
                    <Box pos="relative" textAlign={"center"} px={["3%", "0%"]}>
                        {expert?.company?.name && (
                            <Text
                                mt={["10%", "3%"]}
                                //mb={["10%", "1%"]}
                                variant="profileName"
                            >
                                {expert?.company?.name}
                            </Text>
                        )}
                        {expert?.company?.icon?.url && (
                            <AspectRatio
                                w={["33%", "20%"]}
                                my={["4em", "2em"]}
                                maxW={["33%", "20%"]}
                                ratio={1}
                                pos="relative"
                                margin="auto"
                            >
                                <Box
                                    pos="relative"
                                    borderRadius="8px"
                                    padding={["5%", "0px"]}
                                //  boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                                >
                                    <Image
                                        loading="lazy"
                                        w="100%"
                                        h="100%"
                                        borderRadius="8px"
                                        // boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                                        objectFit="cover"
                                        src={
                                            expert?.company?.icon
                                                ? expert?.company?.icon?.url
                                                : "/assets/images/p_stamp.png"
                                        }
                                        fallbackSrc={
                                            "/assets/images/p_stamp.png"
                                        }
                                        alt={"profile"}
                                    ></Image>
                                </Box>
                            </AspectRatio>
                        )}
                        <Text
                            mx="auto"
                            mt="3%"
                            variant="storyDescription"
                            whiteSpace={"pre-line"}
                            textAlign={"justify"}
                        >
                            {expert.bio}
                        </Text>
                    </Box>
                    {followerData && followerData.length > 0 && (
                        <Text
                            fontSize={"18px"}
                            mt={"2em"}
                            color="primary_1"
                            fontWeight={"bold"}
                            cursor={"pointer"}
                            fontStyle={"italic"}
                            onClick={() => setShowCollectedPopup(true)}
                        >
                            {followerData.length}{" "}
                            {followerData.length > 1
                                ? "followers"
                                : "follower "}
                        </Text>
                    )}

                    <PostcardModal
                        isShow={showCollectedPopup}
                        headerText={"Followers"}
                        children={
                            <CollectionList
                                list={followerData.map((follow) => {
                                    return follow.follower;
                                })}
                                onClose={() => setShowCollectedPopup(false)}
                            />
                        }
                        handleClose={() => setShowCollectedPopup(false)}
                        style={{ padding: "20px", width: "100%" }}
                        size={"md"}
                    />
                    <Flex
                        textAlign="center"
                        width={["100%", "30%"]}
                        mx="auto"
                        my={["15%", "4%"]}
                        justifyContent="space-evenly"
                    >
                        <Button
                            //width="35%"
                            height={["40px", "48px"]}
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                setInProgress(true);
                                if (profile) {
                                    followUnFollowProfile();
                                } else {
                                    setShowLoginModal({
                                        isShow: true,
                                        mode:
                                            showLoginModal.mode === "login"
                                                ? "signup"
                                                : "login",
                                        doFollow: true
                                    });
                                    setInProgress(false);
                                }
                            }}
                        >
                            {profileIsFollower
                                ? "Following Profile"
                                : "Follow Profile"}
                        </Button>

                        <Button
                            // width="35%"
                            height={["40px", "48px"]}
                            onClick={() => {
                                setShareData({
                                    title: expert?.fullName,
                                    description: expert?.fullName,
                                    // eslint-disable-next-line no-restricted-globals
                                    url: `https://postcard.travel${location.pathname}`
                                });
                                setShowShareModal(true);
                            }}
                        >
                            Share Profile
                        </Button>
                    </Flex>
                </Box>

                <PostcardModal
                    isShow={showModal || showShareModal}
                    headerText={showModal ? "Edit Profile" : "Share"}
                    children={
                        showModal ? (
                            <EditProfile
                                onClose={() => {
                                    refetch();
                                    setShowModal(false);
                                }}
                                profile={expert}
                            ></EditProfile>
                        ) : (
                            <ModalShare
                                handleClose={() => setShowShareModal(false)}
                                {...shareData}
                            />
                        )
                    }
                    handleClose={() =>
                        showModal
                            ? setShowModal(false)
                            : setShowShareModal(false)
                    }
                    style={{ padding: "0px" }}
                    size={"xl"}
                />
                {/* <PostcardModal
                    isShow={showLoginModal.isShow}
                    headerText={
                        showLoginModal.mode === "login"
                            ? "Sign in"
                            : "Free Sign Up!"
                    }
                    size={showLoginModal.mode === "login" ? "xl" : "sm"}
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
                                        showLoginModal.mode === "login"
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
            </FlexBox>
        </>
    );
};

export default TravelExpertsDetailHeader;
