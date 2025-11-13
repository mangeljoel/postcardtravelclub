import { useEffect, useCallback, useState, useContext } from "react";
import {
    Box,
    Text,
    Flex,
    Img,
    Image,
    AspectRatio,
    Icon,
    VStack,
    Avatar,
    StatGroup, Button
} from "@chakra-ui/react";
import { FlexBox } from "../../styles/Layout/FlexBox";
import { AiFillCamera } from "react-icons/ai";

import DotsDivider from "../DotsDivider";

import TravelPostcardList from "./TravelPostcardList";
import strapi from "../../queries/strapi.js";
import {
    cacheBurstStory,
    updateStoryState,
    getAlbumbySlug,
    createDBEntry,
    updateStory,
    fetchPaginatedResults,
    deleteDBEntry
} from "../../queries/strapiQueries";
import { FaRegFolderOpen } from "react-icons/fa";

import AppContext from "../AppContext";
import ImageCrop from "../ImageCrop";
import PostcardModal from "../PostcardModal";
// import ModalSignupLogin from "../ModalSignupLogin";
import PageEditForm from "../TravelGuide/NewStoryList/DraftStoryCard/PageEditForm";

import ModalShare from "../ModalShare";
import { useDropzone } from "react-dropzone";

import { uploadfile, ApiUpload, addAlbumEvent } from "../../services/utilities";
import * as ga from "../../services/googleAnalytics";

// import ContactUsForm from "../ContactUsForm";
import { joinTribeBtnText } from "../../constants/stringConstants";

import { useRouter } from "next/router";
import CollectionList from "../CollectionList";
import TabsPart from "../TabsPart";
import SignUpInModal from "../HomePage1/SignUpInModal.jsx";
import SignUpInfoModal from "../HomePage1/SignUpInfoModal.jsx";

const newMarkDownTheme = {
    p: (props) => {
        const { children } = props;
        return <>{children} </>;
    }
};

const TravelExplore = ({ slug }) => {
    const router = useRouter();

    const {
        isActiveProfile,
        isFollowing,
        isTablet,
        profile,
        // FollowOrUnFollow,
        logOut,
        isTabletOrMobile
    } = useContext(AppContext);
    const [editMode, setEditMode] = useState(false);
    /* Edit Level:
    1- initial
    2- ready to submit for review
    3- submitted for review
    4- approved and the state says whether the page belongs to logged in profile or not
    */
    const [editLevel, setEditLevel] = useState({
        allow: false,
        state: false,
        level: 1
    });
    const [isFounder, setIsFounder] = useState(false);
    const [followInProgress, setFollowInProgress] = useState(false);
    const [isStoryDataLoading, setStoryDataLoading] = useState(true);
    const [storyData, setStoryData] = useState([]);
    const [showCrop, setShowCrop] = useState(false);
    const [cropFile, setCropFile] = useState(null);
    const [uploadImg, setUpImg] = useState();
    const [isCoverImage, setIsCoverImage] = useState(false);
    const [modalSize, setModalSize] = useState("xl");
    const [scrollbehav, setscrollBehaviour] = useState("outside");
    const [showModal, setShowModal] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const [showSubmitModal, setShowSubmitModal] = useState({
        mode: "",
        isShow: false,
        message: ""
    });
    const [showEditModal, setShowEditModal] = useState({
        section: 1,
        show: false
    });
    const [showContact, setShowContact] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [displayPostcards, setDisplayPostcards] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [start, setStart] = useState(0);
    const [isCreate, setIsCreate] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState();
    const [uploadCounter, setUploadCounter] = useState(0);
    const [followerData, setFollowerData] = useState([]);
    const [profileIsFollower, setProfileIsFollower] = useState(false);
    const [showCollectedPopup, setShowCollectedPopup] = useState(false);

    useEffect(() => {
        if (slug) {
            refetchStoryData();
        }
    }, [slug]);
    useEffect(() => {
        if (storyData) getFollowerData(storyData);
    }, [storyData, profile]);

    useEffect(() => {
        if (storyData) {
            addAlbumEvent(profile?.id, `/${storyData?.slug}`, storyData?.id, null)
        }
    }, [storyData])

    const refetchStoryData = async () => {
        setStoryDataLoading(true);
        let res = await getAlbumbySlug(slug);
        if (res && res.data[0]) {
            setStoryData(res.data[0]);

            setStoryDataLoading(false);
        } else logOut();
    };

    const getFollowerData = async (storyData) => {
        if (storyData && storyData.id) {
            let data = await fetchPaginatedResults(
                "follow-albums",
                {
                    album: { id: storyData.id }
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
                    showModal.doFollow &&
                    followDetails.filter(
                        (follow) => follow?.follower?.id === profile?.id
                    ).length <= 0
                ) {
                    setShowModal({ isShow: false, doFollow: false });
                    followUnFollowProfile();
                } else setShowModal(false);
            }
        }
    };
    const followUnFollowProfile = () => {
        if (profileIsFollower) {
            let follow = followerData.filter(
                (follow) => follow?.follower?.id === profile?.id
            );
            deleteDBEntry("follow-albums", follow[0].id).then((resp) =>
                getFollowerData(storyData)
            );
        } else {
            if (
                followerData.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length === 0 &&
                storyData
            )
                ga.event({
                    action: "click",
                    category: "album_collected",
                    label: "album_add_collection_click",
                    value: 3
                });
            createDBEntry("follow-albums", {
                follower: profile.id,
                album: storyData.id
            }).then((resp) => getFollowerData(storyData));
        }
    };

    const processStateLevel = async () => {
        let activeProfile = await isActiveProfile(storyData.user);
        if (!activeProfile) {
            setEditMode(false);
            setEditLevel({ allow: false, state: false, level: 0 });
        } else {
            if (
                storyData?.on_boarding?.state === "postcard-titles-review" ||
                storyData?.on_boarding?.state === "postcard-stories-review"
            )
                setEditLevel({ allow: false, state: true, level: 3 });
            else if (
                storyData?.on_boarding?.state === "postcard-stories-upload"
            )
                setEditLevel({ allow: false, state: true, level: 2 });
            else if (storyData?.on_boarding?.state === "approved")
                setEditLevel({ allow: false, state: true, level: 4 });
        }
    };

    useEffect(() => {
        if (storyData && !isStoryDataLoading) {
            processStateLevel();
            let pcs = storyData?.postcards?.sort((a, b) =>
                a.createdAt > b.createdAt
                    ? -1
                    : a.createdAt < b.createdAt
                        ? 1
                        : 0
            );
            if (
                pcs &&
                pcs.length &&
                pcs.filter((item) => item.isFounderStory).length > 0
            ) {
                let temp = pcs.filter((item) => item.isFounderStory);
                pcs.splice(pcs.indexOf(temp[0]), 1);
                pcs.unshift(temp[0]);
                setDisplayPostcards(pcs);
            } else setDisplayPostcards(pcs);
        }
    }, [storyData, profile]);
    const checkValidity = () => {
        if (storyData?.name?.length > 60) return false;
        if (storyData?.story?.match(/\S+/g)?.length > 300) return false;
        if (storyData?.intro?.match(/\S+/g)?.length > 60) return false;
        // if (!storyData?.coverImage?.url) return false;
        if (storyData?.postcards?.length <= 0) return false;
        // if (
        //     !storyData?.pricesStartingAt &&
        //     !storyData?.numberOfNights &&
        //     !storyData?.bestTimetoTravel
        // )
        //     return false;

        return true;
    };

    const approveStory = (story) => {
        let data = {
            state:
                story.on_boarding?.state === "postcard-titles-review"
                    ? "postcard-stories-upload"
                    : "approved"
        };
        updateStoryState(story.on_boarding?.id, data).then(() => {
            updateStory(story.id, { isActive: true, isFeatured: true });
            refetchStoryData();
            if (window) window.scrollTo(0, 0);
        });
    };
    const revokeApprovalSubmission = (story) => {
        let data = {
            state:
                story.on_boarding?.state === "postcard-stories-review"
                    ? "postcard-stories-upload"
                    : "postcard-stories-review"
        };
        updateStoryState(story.on_boarding?.id, data).then(() => {
            refetchStoryData();
            if (window) window.scrollTo(0, 0);
        });
    };

    useEffect(() => {
        if (filesToUpload && uploadCounter < 0) {
            setFilesToUpload(null);
            let data = {
                user: profile.id,
                album: storyData.id,
                isFounderStory: isFounder
            };
            let count = 0;
            setUploadCounter(count);
            filesToUpload.forEach((file) => {
                uploadfile(
                    file,
                    null,
                    "postcards",
                    "coverImage",
                    data,

                    async () => {
                        //console.log("file uploded", result);
                        count++;
                        setIsFounder(false);
                        setUploadCounter(count);
                        if (count == filesToUpload.length) {
                            refetchStoryData();
                            // refetchDraftsCount();
                            // categoryToggle("9999");
                            setIsCreate(true);
                            setUploadingImages(false);
                            refetchStoryData();
                            // setShowCrop(false);
                        }
                    }
                );
            });
        }
    }, [filesToUpload]);

    const onDrop = useCallback((acceptedFiles) => {
        setIsCoverImage(false);
        setUploadingImages(true);
        setUploadCounter(-1);
        setFilesToUpload(acceptedFiles);
    }, []);
    const onDropCoverImage = useCallback((acceptedFile) => {
        setIsCoverImage(true);
        // setNewFile(acceptedFile[0]);
        setUpImg(acceptedFile[0]);
        setShowCrop(true);
    }, []);

    const {
        getRootProps: getCreatePostcardRootProps,
        getInputProps: getCreatePostcardInputProps
    } = useDropzone({
        onDrop,
        multiple: false
    });
    const {
        getRootProps: getFounderPostcardRootProps,
        getInputProps: getFounderPostcardInputProps
    } = useDropzone({
        onDrop,
        multiple: false
    });

    const {
        getRootProps: getCoverImageRootProps,
        getInputProps: getCoverImageInputProps,
        open
    } = useDropzone({
        onDrop: onDropCoverImage,
        multiple: false
    });
    const fetchMoreData = () => {
        hasMore && setStart(start + 30);
    };
    const handlePublish = () => {
        refetchStoryData();
        setStart(0);
    };
    const checkUploadedData = (api) => {
        if (api === "postcard-titles-upload") {
            if (
                displayPostcards.filter((item) => item.name === null).length ===
                0
            )
                return true;
            else return false;
        } else if (api === "postcard-stories-upload") {
            if (
                displayPostcards.filter(
                    (item) =>
                        item.name !== null &&
                        item.intro !== null &&
                        item.coverImage !== null &&
                        item.country !== null
                ).length > 0
            )
                return true;
            else return false;
        }
    };
    const hasFounderStory = (postcards) => {
        if (postcards && postcards.length > 0) {
            if (postcards.filter((item) => item.isFounderStory).length)
                return true;
            else return false;
        } else return false;
    };
    const SubmitForReview = async (api) => {
        if (
            displayPostcards &&
            (displayPostcards.length > (api === "postcard-titles-upload")
                ? 11
                : 0) &&
            checkUploadedData(api)
        ) {
            const data = await strapi.find(
                "album-stages-" +
                (api === "postcard-titles-upload"
                    ? "images-upload"
                    : "content-upload") +
                "?albumId=" +
                storyData.id
            );
            if (data?.error) {
                setShowSubmitModal({
                    isShow: true,
                    mode: "error",
                    message: data?.error
                });
            } else {
                setShowSubmitModal({
                    isShow: true,
                    mode: "success",
                    message:
                        "Your submission is under review. we will notify you soon!"
                });
                refetchStoryData();
            }
        } else if (!checkUploadedData(api)) {
            if (api === "postcard-titles-upload") {
                setShowSubmitModal({
                    isShow: true,
                    mode: "error",
                    message: "Please add title for all postcards."
                });
            } else {
                setShowSubmitModal({
                    isShow: true,
                    mode: "error",
                    message:
                        "You need atleast 1 or more postcards to be successfully saved before submitting the album for review."
                });
            }
        } else {
            setShowSubmitModal({
                isShow: true,
                mode: "error",
                message: "Please add atleast 12 postcards."
            });
        }
    };

    const ActionButtons = ({ stage }) => {
        return (
            <>
                {stage === 1 && followerData && followerData.length > 0 && (
                    <>
                        {" "}
                        <Text
                            fontSize={["16px", "18px"]}
                            mt={"3em"}
                            //mb={"2em"}
                            color="primary_1"
                            fontWeight={"bold"}
                            cursor={"pointer"}
                            fontStyle={"italic"}
                            onClick={() => setShowCollectedPopup(true)}
                        >
                            Collected by {followerData.length}{" "}
                            {followerData.length > 1 ? "members" : "member "}
                        </Text>
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
                    </>
                )}
                <Flex
                    textAlign="center"
                    width={["100%", "40%"]}
                    margin="auto"
                    mt={["15%", "5%"]}
                    mb={["15%", "2%"]}
                    justifyContent={["space-between", "space-evenly"]}
                >
                    {/*show Edit Page button only when the album is not submitted for review */}
                    {
                        !editLevel.state && (
                            // (stage === 1 ? (
                            //     <Button
                            //         width="35%"
                            //         height={["40px", "48px"]}
                            //         isLoading={followInProgress}
                            //         onClick={() => {
                            //             if (profile) {
                            //                 setFollowInProgress(true);
                            //                 FollowOrUnFollow(
                            //                     storyData?.user?.id,
                            //                     resp => {
                            //                         if (resp) {
                            //                             setFollowInProgress(false);
                            //                         }
                            //                     }
                            //                 );
                            //             } else
                            //                 setShowModal({
                            //                     isShow: true,
                            //                     mode: "login"
                            //                 });
                            //         }}
                            //     >
                            //         {isFollowing(storyData?.user?.id)
                            //             ? "Unfollow"
                            //             : " Follow"}
                            //     </Button>
                            // ) : (

                            <Button
                                width={["48%", "45%"]}
                                variant={
                                    profileIsFollower
                                        ? "disabledButton"
                                        : "solid"
                                }
                                height={["40px", "48px"]}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (profile) {
                                        followUnFollowProfile();
                                    } else {
                                        setShowModal({
                                            isShow: true,
                                            mode:
                                                showModal.mode === "login"
                                                    ? "signup"
                                                    : "login",
                                            doFollow: true
                                        });
                                        // setInProgress(false);
                                    }
                                }}
                            >
                                {profileIsFollower
                                    ? "Added to Diary"
                                    : "Add to Diary"}
                            </Button>
                        )
                        // ))
                    }
                    {editLevel.state &&
                        editLevel.level !== 3 &&
                        stage === 1 && (
                            <Button
                                width="45%"
                                height={["40px", "48px"]}
                                // variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (stage === 1)
                                        setShowEditModal({
                                            level: stage,
                                            show: true
                                        });
                                }}
                            >
                                {stage === 1
                                    ? "Edit Page Info"
                                    : "Add Additional Info"}{" "}
                            </Button>
                        )}
                    {editLevel.state &&
                        editLevel.level === 2 &&
                        stage === 2 && (
                            <Button
                                width="45%"
                                height={["40px", "48px"]}
                                isDisabled={!checkValidity()}
                                onClick={() =>
                                    SubmitForReview("postcard-stories-upload")
                                }
                            >
                                Submit for Review
                            </Button>
                        )}
                    {editLevel.state && editLevel.level === 3 && (
                        <Button
                            width="45%"
                            height={["40px", "48px"]}
                            onClick={() => revokeApprovalSubmission(storyData)}
                        >
                            Revoke Submission
                        </Button>
                    )}
                    {storyData?.on_boarding?.state === "approved" &&
                        (storyData.website ||
                            storyData?.user?.social?.blogURL) && (
                            <Button
                                width={["48%", "45%"]}
                                height={["40px", "48px"]}
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // ga.event({
                                    //     action: "click",
                                    //     category: " share_business_page",
                                    //     label: " share_business_page",
                                    //     value: 3
                                    // });
                                    // setShareData({
                                    //     title: storyData?.name,
                                    //     description: storyData?.intro,
                                    //     // eslint-disable-next-line no-restricted-globals
                                    //     url: `https://postcard.travel${location.pathname}`

                                    //     // hashtags: `#travel #postcardguide #${story.rcity?.Name} #${story.rcountry?.Name}`
                                    // });
                                    // setShowShareModal(true);
                                    // // else
                                    // //     setShowModal({
                                    // //         isShow: true,
                                    // //         mode: "login"
                                    // //     });
                                    ga.event({
                                        action: "click",
                                        category: "partner_website_visits",
                                        label: "partner_website_clicks",
                                        value: 3
                                    });
                                    window.open(
                                        storyData.website
                                            ? storyData.website
                                            : storyData?.user?.social?.blogURL,
                                        "_blank"
                                    );
                                }}
                            >
                                Visit Website
                            </Button>
                        )}
                    {/* {!editLevel.state && <FollowFeature children={<Button
                                    width="35%" height={["40px", "48px"]}> </Button>} />} */}
                </Flex>
            </>
        );
    };
    const tabData = [
        {
            name: "Experiences",
            childComp: (
                <Box w="100%">
                    {(profile?.user_type?.name === "SuperAdmin" ||
                        profile?.user_type?.name === "Admin" ||
                        storyData.on_boarding?.state === "approved" ||
                        profile?.user_type?.name === "EditorialAdmin" ||
                        editLevel.state) &&
                        displayPostcards?.length ? (
                        <TravelPostcardList
                            postcards={displayPostcards ? displayPostcards : []}
                            isMobile={isTabletOrMobile}
                            canEdit={editLevel.state && editLevel.level !== 3}
                            isTab={isTablet}
                            story={storyData}
                            isCreate={isCreate}
                            onShareClick={(shareData) => {
                                setShareData({
                                    ...shareData,
                                    url: `https://postcard.travel${location.pathname}`
                                });
                                setShowShareModal(true);
                            }}
                            // isPostcardsLoading={isPostcardsLoading}
                            hasMore={hasMore}
                            refetch={() => {
                                refetchStoryData();
                            }}
                            // refetchDraftsCount={() => {
                            //     // refetchDraftsCount();
                            // }}
                            handlePublish={() => {
                                handlePublish();
                            }}
                            fetchMoreData={fetchMoreData}
                            from={"toursPage"}
                        />
                    ) : (
                        !editLevel.state && (
                            <Box>
                                <Text
                                    my={["10%", "2%"]}
                                    mx="auto"
                                    variant={"aboutTitles"}
                                    fontWeight="bold"
                                    color="primary_3"
                                    textAlign={"center"}
                                    fontSize={["18px", "24px"]}
                                >
                                    Postcard stories coming soon...
                                </Text>
                            </Box>
                        )
                    )}
                    {editLevel.state && editLevel.level !== 3 && (
                        <Box
                            {...getCreatePostcardRootProps({
                                className: "dropzone"
                            })}
                            w={["100%", "50%"]}
                            mx="auto"
                            mb={20}
                        >
                            <VStack
                                bgColor="color-card-background"
                                color="primary_3"
                                border="2px"
                                borderRadius={5}
                                p="10"
                            >
                                <Box>
                                    <Text
                                        mb="5"
                                        color="primary_3"
                                        fontSize={"1.5rem"}
                                        align={"center"}
                                    >
                                        Create Postcards
                                    </Text>
                                    <Text
                                        mb="30"
                                        fontSize={"1.2rem"}
                                        align={"center"}
                                        color="primary_2"
                                    >
                                        Showcase local stories of people,
                                        culture, history, <br /> food, nature
                                        and wildlife.
                                    </Text>
                                </Box>
                                <Button
                                    height={["40px", "48px"]}
                                    mt={20}
                                    mb={20}
                                    zIndex={"99"}
                                >
                                    Upload images to start creating postcards
                                    <input {...getCreatePostcardInputProps()} />
                                </Button>
                            </VStack>
                        </Box>
                    )}
                    <ActionButtons stage={2} />
                    {(profile?.user_type?.name === "SuperAdmin" ||
                        profile?.user_type?.name === "Admin" ||
                        profile?.user_type?.name === "EditorialAdmin") &&
                        (storyData.on_boarding?.state ===
                            "postcard-titles-review" ||
                            storyData.on_boarding?.state ===
                            "postcard-stories-review") && (
                            <Button
                                height={["40px", "48px"]}
                                my="2%"
                                onClick={() => approveStory(storyData)}
                            >
                                Approve
                            </Button>
                        )}
                </Box>
            )
        },
        // {
        //     name: "Articles",
        //     childComp: (
        //         <Box w="100%" textAlign={"center"}>
        //             <Text
        //                 my={["10%", "2%"]}
        //                 mx="auto"
        //                 variant={"aboutTitles"}
        //                 fontWeight="bold"
        //                 color="primary_3"
        //                 textAlign={"center"}
        //                 fontSize={["18px", "24px"]}
        //             >
        //                 Articles coming soon...
        //             </Text>
        //         </Box>
        //     )
        // },
        {
            name: "Tours",
            childComp: (
                <Box w="100%" textAlign={"center"}>
                    <Text
                        my={["10%", "2%"]}
                        mx="auto"
                        variant={"aboutTitles"}
                        fontWeight="bold"
                        color="primary_3"
                        textAlign={"center"}
                        fontSize={["18px", "24px"]}
                    >
                        Tours coming soon...
                    </Text>
                </Box>
            )
        }
    ];
    return (
        <Box>
            {isStoryDataLoading && (
                <Img
                    loading="lazy"
                    src={"../../assets/balloon.gif"}
                    alt="loading"
                    textAlign="center"
                    margin="auto"
                />
            )}
            {storyData && !isStoryDataLoading && (
                <FlexBox variant="homePage">
                    <Box textAlign="center" w="100%">
                        <Box mt={10} mb={5}>
                            <AspectRatio
                                w={["100%", "500px"]}
                                maxW={["100%", "500px"]}
                                ratio={1}
                                borderRadius="8px"
                                padding={["5%", "0px"]}
                                pos="relative"
                                margin="auto"
                            >
                                <Box
                                    pos="relative"
                                    borderRadius="8px"
                                    padding={["0px", "0px"]}
                                    boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                                >
                                    <Image
                                        loading="lazy"
                                        w="100%"
                                        h="100%"
                                        borderRadius="8px"
                                        boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                                        src={
                                            storyData.coverImage?.url ||
                                            "/assets/images/p_stamp.png"
                                        }
                                        fallbackSrc="/assets/images/p_stamp.png"
                                        objectFit="cover"
                                        alt={"coverImage"}
                                    ></Image>
                                    {editLevel.state &&
                                        editLevel.level === 2 && (
                                            <Box
                                                cursor="pointer"
                                                pos="absolute"
                                                top="10px"
                                                right="5px"
                                                {...getCoverImageRootProps()}
                                                my="auto"
                                            >
                                                <Icon
                                                    as={AiFillCamera}
                                                    color="primary_1"
                                                    background="white"
                                                    padding="2px"
                                                    borderRadius="full"
                                                    boxSize="25px"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        open();
                                                    }}
                                                />
                                                <input
                                                    {...getCoverImageInputProps()}
                                                />
                                            </Box>
                                        )}
                                </Box>
                            </AspectRatio>
                        </Box>

                        {storyData.name && (
                            <Text px={["5%", "0%"]} variant="profileName">
                                {storyData.name}
                            </Text>
                        )}
                        {/* <Flex
                            mx="auto"
                            w="16%"
                            mt={10}
                            justifyContent={"center"}
                        > */}
                        {/* {storyData?.company?.name && (
                            <Text
                                variant="storyProfileName"
                                color={
                                    storyData?.user?.slug
                                        ? "primary_1"
                                        : "primary_3"
                                }
                                my={2}
                                cursor={"pointer"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (storyData?.user?.slug)
                                        router.push(
                                            "/" + storyData?.user?.slug
                                        );
                                }}
                                // my="auto"
                                fontSize={"16px"}
                                textAlign="center"
                            >
                                {storyData.company.name}
                            </Text>
                        )} */}
                        {displayPostcards && displayPostcards?.length > 0 && (
                            <Text
                                variant="storyProfileName"
                                color={"black"}
                                mt={1}
                                // my="auto"
                                fontSize={"16px"}
                                textAlign="center"
                            >
                                <Icon
                                    as={FaRegFolderOpen}
                                    color="primary_1"
                                    verticalAlign={"middle"}
                                    width="22px!important"
                                    height="22px"
                                    my="auto"
                                //bgColor="primary_15"
                                // paddingTop={"0px!important"}
                                />
                                &nbsp; {displayPostcards?.length}{" "}
                                &nbsp;postcards
                            </Text>
                        )}
                        {storyData?.company && storyData?.company?.name && <Text
                            variant="storyProfileName"
                            color={"black"}
                            my={5}
                            // my="auto"
                            fontSize={"16px"}
                            textAlign="center"
                        >

                            {storyData?.user?.name},    {storyData?.company?.name}
                        </Text>}

                        {storyData.intro && (
                            <Text
                                mt={10}
                                variant="storyDescription"
                                whiteSpace={"pre-line"}
                            >
                                {storyData.intro}
                            </Text>
                        )}
                    </Box>

                    <DotsDivider />

                    <Box mt={6} width="100%">
                        <Box textAlign="center" mb={["0px", "4em"]}>
                            {storyData.story && (
                                <Text
                                    variant="storyDescription"
                                    whiteSpace={"pre-line"}
                                >
                                    {storyData.story}
                                </Text>
                            )}

                            <ActionButtons stage={1} />
                        </Box>
                        <TabsPart tabData={tabData} />
                    </Box>

                    <DotsDivider />

                    {storyData?.company?.affiliations[0]?.logo &&
                        (!isActiveProfile(storyData.user) || !editMode) && (
                            <Box w="100%" m="auto" textAlign={"center"}>
                                <Box
                                    pos="relative"
                                    // h="300px"
                                    width={["50%", "25%"]}
                                    my={"2%"}
                                    cursor={"pointer"}
                                    mx="auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            storyData.company?.affiliations[0]
                                                ?.slug
                                        )
                                            router.push(
                                                "/affiliations/" +
                                                storyData.company
                                                    ?.affiliations[0]?.slug
                                            );
                                    }}
                                >
                                    <Image
                                        borderRadius="8px"
                                        loading="lazy"
                                        m="auto"
                                        src={
                                            storyData?.company?.affiliations[0]
                                                ?.logo
                                                ? storyData?.company
                                                    ?.affiliations[0]?.logo
                                                    ?.url
                                                : "/assets/postcard_stories.jpg"
                                        }
                                        fallbackSrc="/assets/postcard_stories.jpg"
                                        objectFit="contain"
                                        alt={"affiliation"}
                                    ></Image>
                                </Box>
                            </Box>
                        )}
                    <PostcardModal
                        isShow={uploadingImages}
                        headerText="Upload"
                        size={modalSize}
                        children={<Text m="auto">{"uploading images..."}</Text>}
                    />
                    <PostcardModal
                        isShow={showEditModal.show}
                        headerText="Edit Page Details"
                        size={modalSize}
                        style={{ width: "100%", padding: "5%" }}
                        children={
                            showEditModal.level === 1 ? (
                                <PageEditForm
                                    page={storyData}
                                    refetch={refetchStoryData}
                                    handleClose={() => {
                                        setShowEditModal({ show: false });
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        }
                        handleClose={() => setShowEditModal({ show: false })}
                    />
                    <PostcardModal
                        isShow={showSubmitModal.isShow}
                        headerText={
                            showSubmitModal.mode === "error"
                                ? "Error"
                                : "Success"
                        }
                        size={modalSize}
                        scrollBehavior={scrollbehav}
                        children={<Text>{showSubmitModal.message}</Text>}
                        handleClose={() => setShowSubmitModal(false)}
                    />
                    <PostcardModal
                        isShow={uploadingImages}
                        headerText="Upload"
                        size={modalSize}
                        children={<Text m="auto">{"uploading images..."}</Text>}
                    />
                    <PostcardModal
                        isShow={showContact}
                        headerText={"Contact " + storyData?.company?.name}
                        size={modalSize}
                        scrollBehavior={scrollbehav}
                        children={
                            <></>
                            // <ContactUsForm
                            //     story={storyData}
                            //     profile={profile}
                            //     onClose={() => {
                            //         setShowContact(false);
                            //         setShowModal(false);
                            //     }}
                            // />
                        }
                        handleClose={() => {
                            setShowContact(false);
                            setShowModal(false);
                        }}
                    />

                    <PostcardModal
                        isShow={showShareModal}
                        headerText="Share"
                        children={
                            <ModalShare
                                handleClose={() => setShowShareModal(false)}
                                {...shareData}
                            />
                        }
                        handleClose={() => setShowShareModal(false)}
                    />
                    {/* <PostcardModal
                        isShow={showModal.isShow}
                        headerText={
                            showModal.mode === "login"
                                ? "Sign in"
                                : "Free Sign Up!"
                        }
                        size={showModal.mode === "login" ? "xl" : "sm"}
                        scrollBehavior={scrollbehav}
                        style={profile ? { padding: "0px" } : {}}
                        children={
                            <ModalSignupLogin
                                mode={showModal.mode}
                                isSchedulerOpen={true}
                                toggleMode={() =>
                                    setShowModal({
                                        isShow: true,
                                        mode:
                                            showModal.mode === "login"
                                                ? "signup"
                                                : "login"
                                    })
                                }
                                handleClose={() => {
                                    if (showModal.isContact)
                                        setShowContact(true);
                                    else if (!showModal.doFollow)
                                        setShowModal(false);
                                }}
                            />
                        }
                        handleClose={() => setShowModal(false)}
                    /> */}
                    <SignUpInModal
                        isShow={showModal.isShow}
                        mode={showModal.mode}
                        setShowModal={setShowModal}
                        setShowSignModal={setShowSignModal}
                    />
                    <SignUpInfoModal
                        state={showSignModal}
                        setShowSignModal={setShowSignModal}
                    />
                </FlexBox>
            )}
        </Box>
    );
};

export default TravelExplore;

// popup
//This Postcard cannot be saved as it has some errors. Please correct the form and hit save again.
