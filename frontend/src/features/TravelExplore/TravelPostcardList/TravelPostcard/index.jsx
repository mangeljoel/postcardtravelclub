import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
    Avatar,
    AvatarGroup,
    Img,
    Circle,
    useFormControlStyles,
    useToast
} from "@chakra-ui/react";

import { debounce } from "lodash";
import { Waypoint } from "react-waypoint";

import {
    Box,
    Text,
    Flex,
    Icon,
    AspectRatio,
    Textarea,
    Button
} from "@chakra-ui/react";
import { BiEditAlt, BiExit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegFolderOpen } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoShareOutline } from "react-icons/io5";

import AppContext from "../../../AppContext";
import PostcardModal from "../../../PostcardModal";
// import ModalSignupLogin from "../../../ModalSignupLogin";
import PostcardAlert from "../../../PostcardAlert";

import { Label } from "../../../../patterns/Typography";
import classes from "./index.module.scss";

import Flippy, { FrontSide, BackSide } from "react-flippy";
import {
    des,
    root,
    content,
    description,
    is_top_overflowing,
    is_bottom_overflowing,
    scrollbar,
    title,
    img_main,
    action_icons,
    flipperContainer
} from "./index.module.scss";
import {
    createDBEntry,
    deletePostcard
} from "../../../../queries/strapiQueries";

import * as ga from "../../../../services/googleAnalytics";
import CollectionList from "../../../CollectionList";
import PreviewCard from "../PreviewCard";
import { ChevronDownIcon } from "@chakra-ui/icons";
import FeedSection from "../FeedSection";
import ModalShare from "../../../ModalShare";
import { useSignupModal } from "../../../SignupModalContext";

const TravelPostcard = ({
    indexId,
    postcard,
    story,
    id,
    canEdit,
    style,
    handleEdit,
    handleDelete,
    isHomePage,
    showPreview,
    togglePreview
}) => {
    const [visibilityChange, setvisibilityChange] = useState(false);
    const ref = useRef();
    const {
        profile,
        // AddRemoveLikes,
        isActiveProfile,
        profileLikes,
        profileLikesLoading,
        firstLoad,
        setFirstLoad,
        logOut,
        refetchProfileLike
    } = useContext(AppContext);
    const { openLoginModal } = useSignupModal()
    const toast = useToast();

    const Country = postcard.country?.name || "";

    const [isFlipped, setFlipped] = useState(false);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [flagModal, setFlagModal] = useState(false);
    const [deleteAlert, showAlert] = useState({
        message: "delete",
        mode: false
    });
    const [showCollectedPopup, setShowCollectedPopup] = useState(false);
    const [pcBkms, setPcBkms] = useState(postcard.bookmarks);
    const [showCollectedBy, setShowCollectedBy] = useState({
        state: false,
        collectedUsers: []
    });

    const [showShareModal, setShowShareModal] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollRef = useRef(null);

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        const el = scrollRef.current;
        if (expanded) {
            el.scrollTo(0, scrollPosition);
        } else {
            setScrollPosition(el.scrollTop);
            const scrollDistance = el.scrollHeight - el.clientHeight;
            el.scrollTo(0, scrollDistance);
        }
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const isParagraphScrollable = () => {
        const el = document.getElementById("contentscroll" + postcard.id);
        return el && el.scrollHeight > el.clientHeight;
    };

    const showScroll = () => {
        if (scrollRef.current) {
            const isAtEnd =
                scrollRef.current.scrollHeight - scrollRef.current.scrollTop ===
                scrollRef.current.clientHeight;
            setscroll(isAtEnd);
        }
    };

    // const loginModal = (
    //     <ModalSignupLogin
    //         mode={showModal.mode}
    //         toggleMode={() =>
    //             setShowModal({
    //                 isShow: true,
    //                 mode: showModal.mode === "login" ? "signup" : "login"
    //             })
    //         }
    //         handleClose={() => setShowModal({ isShow: false })}
    //     />
    // );
    const flagChild = <></>;

    const getStyle = () =>
        style
            ? {
                ...style,
                padding: 16
            }
            : null;

    useEffect(() => { }, [visibilityChange]);

    useEffect(() => {
        if (postcard) {
            let likeExists = false;
            if (profileLikes && profileLikes.length > 0) {
                profileLikes.map((like) => {
                    if (
                        like?.postcard?.id.toString() ===
                        postcard.id?.toString()
                    ) {
                        likeExists = true;
                        postcard.likeId = like.id;
                    }
                    if (likeExists) {
                        postcard.like = true;
                    } else postcard.like = false;
                });
            }
            if (pcBkms && pcBkms.length >= 1) {
                setShowCollectedBy({
                    state: true,
                    collectedUsers: pcBkms
                        .filter((i) => i.user)
                        .map((i) => i.user)
                });
            }
        }
    }, [profile, profileLikes]);

    const [isScroll, setscroll] = useState(true);

    function setMyScroll() {
        setscroll(true);
    }

    const handleScroll = (el) => {
        const isScrollable = el?.scrollHeight > el?.clientHeight;
        if (!isScrollable) {
            el?.classList.remove("is-bottom-overflowing", "is-top-overflowing");
            return;
        }
        const isScrolledToBottom =
            el?.scrollHeight <= Math.ceil(el?.clientHeight + el?.scrollTop);
        const isScroledlToTop = el?.scrollTop === 0;
        el?.classList.toggle(is_bottom_overflowing, !isScrolledToBottom);
        el?.classList.toggle(is_top_overflowing, !isScroledlToTop);
        //console.log(e);

        //debouncedScrollHandler();
    };
    const CollectedByGroup = useMemo(() => {
        return (
            // <AvatarGroup
            //     size="sm"
            //     max={1}
            //     spacing={-1}
            //     my="auto"
            //     // paddingBlock={3}
            //     onClick={(e) => {
            //         e.stopPropagation();
            //         setShowCollectedPopup(true);
            //     }}
            // >
            //     {showCollectedBy.collectedUsers.map((user) => {
            //         return (
            //             <Avatar
            //                 bgColor="primary_1"
            //                 color="white"
            //                 name={user.fullName}
            //                 src={
            //                     user.profilePic
            //                         ? user.profilePic?.url
            //                         : "default"
            //                 }
            //             />
            //         );
            //     })}
            // </AvatarGroup>

            showCollectedBy.collectedUsers && (
                <Circle
                    bg="white"
                    ml={3}
                    borderColor="primary_1"
                    borderWidth="2px"
                    color="primary_1"
                    size="25px"
                    fontSize={"14px"}
                    fontWeight={"bold"}
                    px={2}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowCollectedPopup(true);
                    }}
                >
                    {showCollectedBy?.collectedUsers?.length > 99 ? (
                        <p>99</p>
                    ) : (
                        showCollectedBy?.collectedUsers?.length
                    )}
                </Circle>
            )
        );
    }, [showCollectedBy.collectedUsers, profileLikes]);
    const PostcardActionButtons = ({ pos, textData }) => {
        return (
            <Flex
                w="100%"
                mt="18px"
                paddingRight={pos === "back" ? "16px" : ""}
                justify={"space-between"}
            >
                <Flex
                    //minWidth={"33%"}
                    alignItems={"center"}
                    my="auto"
                    justify={"space-between"}
                >
                    <Img
                        alt="flip"
                        width="25px!important"
                        height="23px"
                        src={"../../../../assets/flip-icon.svg"}
                        onClick={(e) => {
                            if (pos === "front")
                                createDBEntry("events", {
                                    event_master: 4,
                                    user: profile ? profile.id : null,
                                    postcard: postcard ? postcard.id : null,
                                    album: postcard.album.id,
                                    url: "/" + textData.albumslug
                                });
                        }}
                    />
                    {!isActiveProfile(postcard.user) &&
                        !(
                            profile?.user_type?.name === "SuperAdmin" ||
                            profile?.user_type.name === "Admin" ||
                            profile?.user_type?.name == "EditorialAdmin" ||
                            profile?.user_type?.name == "EditorInChief"
                        ) ? (
                        <>
                            {postcard.like && (
                                <Img
                                    loading="lazy"
                                    alt="unselected"
                                    src={"../../../../assets/bkm-selected.svg"}
                                    width="25px"
                                    ml={3}
                                    height="23px"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // ga.event({
                                        //     action: "click",
                                        //     category: "postcard_collected",
                                        //     label: "postcard_add_bookmark_click",
                                        //     value: 3
                                        // });
                                        if (profile) {
                                            AddRemoveLikes(
                                                postcard,
                                                postcard.likeId,
                                                (like) => {
                                                    if (like.error) {
                                                        logOut();
                                                        toast({
                                                            title: "Session Expired",
                                                            description:
                                                                "Login Again",
                                                            isClosable: true,
                                                            duration: 3000,
                                                            position: "top"
                                                        });
                                                        openLoginModal()
                                                    } else {
                                                        postcard.like =
                                                            !postcard.like;
                                                        postcard.likeId =
                                                            like.id;
                                                        if (
                                                            pcBkms.length === 1
                                                        ) {
                                                            setPcBkms([]);
                                                            setShowCollectedBy({
                                                                state: false
                                                            });
                                                        } else {
                                                            let newList = [];
                                                            newList =
                                                                pcBkms.filter(
                                                                    (bkm) =>
                                                                        bkm.user
                                                                            ?.id !==
                                                                        profile.id
                                                                );

                                                            setPcBkms(newList);
                                                        }

                                                        setvisibilityChange(
                                                            !visibilityChange
                                                        );
                                                        refetchProfileLike();
                                                    }
                                                }
                                            );
                                        } else
                                            openLoginModal()
                                    }}
                                />
                            )}
                            {!postcard.like && (
                                <Img
                                    loading="lazy"
                                    alt="unselected"
                                    src={
                                        "../../../../assets/bkm-unselected.svg"
                                    }
                                    ml={3}
                                    width="25px"
                                    height="23px"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (profile) {
                                            AddRemoveLikes(
                                                postcard,
                                                postcard.likeId,
                                                (like) => {
                                                    if (like.error) {
                                                        logOut();
                                                        toast({
                                                            title: "Session Expired",
                                                            description:
                                                                "Login Again",
                                                            isClosable: true,
                                                            duration: 3000,
                                                            position: "top"
                                                        });
                                                        openLoginModal()
                                                    } else {
                                                        postcard.like =
                                                            !postcard.like;
                                                        postcard.likeId =
                                                            like?.id;
                                                        if (
                                                            showCollectedBy.length ===
                                                            0
                                                        )
                                                            setShowCollectedBy({
                                                                state: true
                                                            });

                                                        setPcBkms([
                                                            ...pcBkms,
                                                            {
                                                                ...like,
                                                                user: {
                                                                    ...profile
                                                                }
                                                            }
                                                        ]);
                                                        setvisibilityChange(
                                                            !visibilityChange
                                                        );
                                                        refetchProfileLike();
                                                    }
                                                }
                                            );
                                        } else
                                            openLoginModal()
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        (canEdit ||
                            profile?.user_type.name === "SuperAdmin" ||
                            profile.user_type?.name === "EditorialAdmin" ||
                            profile?.user_type?.name == "EditorInChief") && (
                            <>
                                <Icon
                                    as={BiEditAlt}
                                    ml={3}
                                    color="primary_1"
                                    width="25px"
                                    height="23px"
                                    bgColor="cardBackground"
                                    paddingTop={"0px!important"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit();
                                    }}
                                />
                                <Icon
                                    as={RiDeleteBin6Line}
                                    color="primary_1"
                                    ml={3}
                                    width="25px"
                                    height="23px"
                                    bgColor="cardBackground"
                                    paddingTop={"0px!important"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAlert({
                                            message:
                                                " Are you sure to delete the postcard?",
                                            mode: true
                                        });
                                    }}
                                />
                            </>
                        )
                    )}
                    {showCollectedBy.state && CollectedByGroup}
                    {pos === "back" && postcard.slug && (
                        <Icon
                            as={IoShareOutline}
                            color="primary_1"
                            ml={3}
                            width="25px"
                            height="36px"
                            bgColor="cardBackground"
                            paddingTop={"0px!important"}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (postcard.slug) {
                                    setShareData({
                                        title: postcard.name,
                                        description: postcard?.story,
                                        // eslint-disable-next-line no-restricted-globals
                                        url: `https://postcard.travel/postcards/${postcard.slug}`
                                    });
                                    setShowShareModal(true);
                                }
                            }}
                        />
                    )}
                </Flex>
                {textData && pos === "front" && (
                    <Text
                        cursor={textData.slug ? "pointer" : "auto"}
                        fontWeight={600}
                        alignSelf={"end"}
                        justifyContent="flex-end"
                        textAlign={"right"}
                        fontSize={"12px"}
                        color="primary_3"
                    >
                        {textData.name}
                    </Text>
                )}
                {textData && pos === "back" && (
                    <Flex alignItems={"center"} my="auto" justify={"flex-end"}>
                        {textData.albumLink && isHomePage && (
                            <Icon
                                as={FaRegFolderOpen}
                                color="primary_1"
                                width="28px!important"
                                height="28px"
                                mx={3}
                                bgColor="cardBackground"
                                paddingTop={"0px!important"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (textData?.albumLink) {
                                        window.open(
                                            textData?.albumLink,
                                            "_blank"
                                        );
                                        ga.event({
                                            action: "click",
                                            category: "album_page_visits",
                                            label: "album_page_clicks",
                                            value: 3
                                        });

                                        createDBEntry("events", {
                                            event_master: 2,
                                            user: profile ? profile.id : null,
                                            postcard: postcard
                                                ? postcard.id
                                                : null,
                                            album: postcard.album.id,
                                            url: "/" + textData.albumslug
                                        });
                                    }
                                }}
                            />
                        )}
                        {textData.website && (
                            <Icon
                                as={BsGlobe}
                                color="primary_1"
                                boxSize="25px"
                                bgColor="cardBackground"
                                paddingTop={"0px!important"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (textData.website) {
                                        window.open(textData.website, "_blank");
                                        ga.event({
                                            action: "click",
                                            category: "partner_website_visits",
                                            label: "partner_website_clicks",
                                            value: 3
                                        });

                                        createDBEntry("events", {
                                            event_master: 1,
                                            user: profile ? profile.id : null,
                                            postcard: postcard
                                                ? postcard.id
                                                : null,
                                            url: textData.website
                                        });
                                    }
                                }}
                            />
                        )}
                    </Flex>
                )}
            </Flex>
        );
    };
    return (
        !profileLikesLoading &&
        (showPreview ? (
            <PreviewCard
                indexId={indexId}
                postcard={postcard}
                togglePreview={togglePreview}
            />
        ) : (
            <Box
                className={root}
                transition="top 0.2s ease-out"
                key={id}
                id={postcard.id}
                style={getStyle()}
                onClick={(e) => {
                    e.preventDefault();
                    setFlipped(!isFlipped);
                    if (!isFlipped) {
                        let el = document.getElementById(
                            "contentscroll" + postcard.id
                        );
                        if (el) {
                            const isScrollable =
                                el.scrollHeight > el.clientHeight;
                            el.classList.toggle(
                                is_bottom_overflowing,
                                isScrollable
                            );
                            const isScrolledToBottom =
                                el.scrollHeight <=
                                Math.ceil(el.clientHeight + el.scrollTop);
                            if (isScrolledToBottom) {
                                el.classList.remove(is_bottom_overflowing);
                            }
                        }
                    }
                }}
            >
                {/* <FeedSection /> */}
                <Flippy
                    flipOnHover={false} // default false
                    flipOnClick={true} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    ref={ref} // to use toggle method like ref.curret.toggle()
                // if you pass isFlipped prop component will be controlled component.
                // and other props, which will go to div
                >
                    <FrontSide
                        animationDuration={1500}
                        style={{ padding: "0px", boxShadow: "none" }}
                    >
                        <Box
                            background="primary_15"
                            boxSizing="border-box"
                            boxShadow="3px 3px 6px rgba(0, 0, 0, 0.16)"
                            borderRadius="8px"
                            pos="relative"
                        >
                            {postcard && (
                                <div
                                    style={{ position: "relative" }}
                                    ref={(ref) => setCardFrontRef(ref)}
                                >
                                    <AspectRatio
                                        pos="relative"
                                        className={img_main}
                                        overflow="hidden"
                                        ratio={1}
                                    >
                                        <>
                                            {" "}
                                            <Image
                                                src={
                                                    postcard.coverImage?.url ||
                                                    global.$defaultProfile
                                                }
                                                // layout="fill"
                                                fill={true}
                                                // objectFit="cover"
                                                style={{ objectFit: "cover" }}
                                                // placeholder="blur"
                                                loading="lazy"
                                                alt="pc_img"
                                                sizes={
                                                    "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                }
                                            // blurDataURL={
                                            //     imageToShow
                                            //         ? imageToShow.replace(
                                            //               "/origin/small",
                                            //               "/thumbnail/thumbnail"
                                            //           )
                                            //         : "/assets/images/p_stamp.png"
                                            // }
                                            />
                                        </>
                                    </AspectRatio>

                                    <Box
                                        p="16px"
                                        cursor="pointer"
                                        textAlign={"left"}
                                        m="auto"
                                    >
                                        <Flex
                                            textAlign="left"
                                            direction="column"
                                        >
                                            <Text
                                                fontSize="24px"
                                                mt="6%"
                                                // px={[1, 3]}
                                                lineHeight="32px"
                                                textAlign={"left"}
                                                color="primary_16"
                                                fontWeight={700}
                                                fontFamily="raleway"
                                            >
                                                {postcard.name}
                                            </Text>
                                            {/* <Label
                                                color="primary-2"
                                                fontFamily="raleway"
                                                size="md"
                                                style={{
                                                    fontSize: "18px",
                                                    lineHeight: "24px"
                                                }}
                                                copy={postcard.name || ""}
                                                fontStyle="bold"
                                            /> */}
                                            <Text
                                                color="primary_3"
                                                mt="1em"
                                                fontSize={"14px"}
                                                fontFamily="raleway"
                                                fontWeight="bold"
                                            >
                                                {Country}
                                            </Text>
                                        </Flex>
                                        {(story?.on_boarding?.state ===
                                            "postcard-stories-upload" ||
                                            story?.on_boarding?.state ===
                                            "postcard-stories-review") &&
                                            (!postcard.name ||
                                                !postcard.intro ||
                                                !postcard.country) &&
                                            isActiveProfile(postcard?.user) &&
                                            canEdit && (
                                                <Box>
                                                    <Flex
                                                        mt="5%"
                                                        mb="8px"
                                                        justifyContent="space-between"
                                                    >
                                                        <Text variant="formLabel">
                                                            Add an Introduction
                                                            &nbsp;
                                                            <Text variant="formReq">
                                                                (required)
                                                            </Text>
                                                        </Text>
                                                    </Flex>
                                                    <Textarea
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit();
                                                        }}
                                                        placeholder="Add a compelling highlight in 60 words or less that serves as a hook for this postcard and inspires the reader to flip the Postcard.
                                                    (This is visible on the front-side of the postcard)"
                                                    />
                                                </Box>
                                            )}

                                        <div className={title}>
                                            <Text variant="postcardDesc">
                                                {postcard.intro}
                                            </Text>
                                        </div>

                                        {postcard.tags && (
                                            <Flex
                                                w="100%"
                                                flexWrap={"wrap"}
                                                my={"1em"}
                                            >
                                                {postcard.tags.map(
                                                    (tag, index) => (
                                                        <Text
                                                            key={index}
                                                            borderWidth="1px"
                                                            borderColor={
                                                                "primary_3"
                                                            }
                                                            borderRadius="43px"
                                                            fontSize={"12px"}
                                                            mr="0.5em"
                                                            mt="0.5em"
                                                            color="primary_4"
                                                            padding="3px 6px"
                                                            fontWeight={600}
                                                        >
                                                            {tag.name
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                tag.name.slice(
                                                                    1
                                                                )}
                                                        </Text>
                                                    )
                                                )}
                                            </Flex>
                                        )}
                                        <PostcardActionButtons
                                            pos="front"
                                            textData={
                                                postcard?.album?.signature
                                                    ? {
                                                        name: postcard?.album
                                                            ?.signature
                                                    }
                                                    : postcard?.album
                                                        ?.company ||
                                                    postcard?.user?.company
                                            }
                                        />
                                    </Box>
                                </div>
                            )}
                        </Box>
                    </FrontSide>
                    <BackSide
                        animationDuration={1500}
                        style={{
                            padding: "0px",
                            boxShadow: "none",
                            pointerEvents: isFlipped ? "all" : "none",

                            height: cardFrontRef
                                ? cardFrontRef.clientHeight
                                : "auto",
                            overflow: "hidden"

                            // transform: "translateZ(1px)"
                        }}
                    >
                        <Box
                            background="primary_15"
                            boxSizing="border-box"
                            boxShadow="3px 3px 6px rgba(0, 0, 0, 0.16)"
                            borderRadius="8px"
                            className={flipperContainer}
                        >
                            <div
                                className={content}
                                style={{
                                    height: cardFrontRef
                                        ? cardFrontRef.clientHeight
                                        : "auto",
                                    overflowX: "auto",
                                    boxSizing: "border-box",
                                    borderRadius: "8px",
                                    paddingLeft: "16px",
                                    paddingTop: "16px",
                                    paddingBottom: "16px"
                                }}
                            >
                                <Img
                                    loading="lazy"
                                    h="7px"
                                    paddingRight={"16px"}
                                    w="100%"
                                    src={"/assets/new_ui/icons/pc_lines.svg"}
                                    alt="postalstripes"
                                    mb="3%"
                                    objectFit="contain"
                                    borderRadius="8px"
                                />

                                <PostcardAlert
                                    isCentered={true}
                                    closeOnEsc={true}
                                    closeOnOverlayClick={true}
                                    show={deleteAlert}
                                    buttonText={"DELETE"}
                                    closeAlert={() =>
                                        showAlert({ mode: false })
                                    }
                                    handleAction={() => {
                                        deletePostcard(postcard.id)
                                            .then(() => {
                                                handleDelete();
                                                showAlert({ mode: false });
                                            })
                                            .catch((error) => {
                                                if (
                                                    error.error.status.toString() ===
                                                    "403" ||
                                                    "401"
                                                ) {
                                                    logOut();
                                                }
                                            });

                                        //  window.location.reload();
                                    }}
                                />

                                {/* {`${description} ${isScroll ? des : ""}`} id={classes.des} onScroll={handleScroll} */}
                                <div
                                    className={description}
                                    id={"contentscroll" + postcard.id}
                                    // onScroll={(e) => {
                                    //     let el = e.currentTarget;
                                    //     handleScroll(el);
                                    // }}
                                    ref={scrollRef}
                                    style={{
                                        whiteSpace: "pre-line",
                                        overflow: "",
                                        marginBottom: "2%",
                                        paddingRight: "8px"
                                    }}
                                >
                                    <Label
                                        color="primary-4"
                                        fontFamily="raleway"
                                        size="md"
                                        style={{
                                            fontSize: "16px",
                                            textAlign: "left"
                                        }}
                                        copy={postcard.story ?? ""}
                                    />
                                </div>

                                {/* {isParagraphScrollable() && (
                                    <Button
                                        onClick={handleToggleExpand}
                                        size="sm"
                                        variant="link"
                                        color="primary_1"
                                        alignSelf="center"
                                        mb="16px"
                                    >
                                        {expanded ? "Read Less" : "Read More"}
                                    </Button>
                                )} */}

                                <PostcardActionButtons
                                    pos="back"
                                    textData={{
                                        albumname: postcard?.album?.name,
                                        albumslug: postcard?.album?.slug,
                                        albumLink:
                                            postcard?.album?.news_article &&
                                                postcard?.album?.news_article
                                                    ?.status === "published"
                                                ? "/postcard-pages/" +
                                                postcard?.album?.slug
                                                : "/" + postcard?.album?.slug,
                                        companyname: postcard?.company?.name,
                                        website: postcard?.album?.website
                                            ? postcard?.album?.website
                                            : postcard?.user?.social?.blogURL
                                    }}
                                />
                            </div>
                        </Box>
                    </BackSide>
                </Flippy>

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
                    isShow={showModal.isShow || flagModal}
                    headerText={
                        flagModal
                            ? "Flag this location"
                            : showModal.mode === "login"
                            ? "SignIn"
                            : "Free Sign Up!"
                    }
                    size={
                        flagModal
                            ? "xl"
                            : showModal.mode === "login"
                            ? "xl"
                            : "sm"
                    }
                    children={showModal.isShow ? loginModal : flagChild}
                    handleClose={() => {
                        if (showModal.isShow) setShowModal({ isShow: false });
                        else setFlagModal(false);
                    }}
                /> */}
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
                {isActiveProfile(postcard.user) &&
                    !(
                        !postcard.name ||
                        !postcard.intro ||
                        !postcard.country
                    ) &&
                    canEdit &&
                    story?.on_boarding?.state === "postcard-stories-upload" && (
                        <Text mt={5} mb={5} variant="formLabel">
                            This Postcard is complete and ready to submit
                        </Text>
                    )}
                {isActiveProfile(postcard.user) &&
                    canEdit &&
                    (!postcard.name ||
                        !postcard.intro ||
                        !postcard.country) &&
                    story?.on_boarding?.state === "postcard-stories-upload" && (
                        <Text
                            mt={5}
                            mb={5}
                            cursor="pointer"
                            variant="formReq"
                            onClick={handleEdit}
                        >
                            This Postcard has some entries pending ..{" "}
                            <u>edit</u>
                        </Text>
                    )}
            </Box>
        ))
    );
};

export default TravelPostcard;
