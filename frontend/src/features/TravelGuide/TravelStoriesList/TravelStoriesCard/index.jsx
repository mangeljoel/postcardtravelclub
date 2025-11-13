import React, {
    useState,
    useRef,
    useCallback,
    useEffect,
    useContext,
    useMemo
} from "react";
import Image from "next/image";
import { debounce } from "lodash";
import { Flex, Box, Icon, Img, Text, AspectRatio } from "@chakra-ui/react";
// import { BiEditAlt } from "react-icons/bi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { AiFillCamera } from "react-icons/ai";
import { useRouter } from "next/router";
import { Label } from "../../../../patterns/Typography";
import { useDropzone } from "react-dropzone";
import { isOwnStory, uploadfile } from "../../../../services/utilities";
import {
    updateStory,
    deleteStory,
    cacheBurstStory,
    getCountryById,
    getAlbumbyId
} from "../../../../queries/strapiQueries";
import strapi from "../../../../queries/strapi";
import classes from "./index.module.scss";

import AppContext from "../../../AppContext";
import PostcardAlert from "../../../PostcardAlert";
import PostcardModal from "../../../PostcardModal";
// import ModalSignupLogin from "../../../ModalSignupLogin";
import ModalShare from "../../../ModalShare";
// import CollectionForm from "../../../CollectionForm";
import ImageCrop from "../../../ImageCrop";
import Flippy, { FrontSide, BackSide } from "react-flippy";

import {
    root,
    content,
    chips,
    des,
    borderRadius,
    description,
    action_icons,
    flipperContainer
} from "./index.module.scss";
// import { FaLessThanEqual } from "react-icons/fa";
import { Waypoint } from "react-waypoint";
import SignUpInModal from "../../../HomePage1/SignUpInModal";
import SignUpInfoModal from "../../../HomePage1/SignUpInfoModal";

const TravelStoriesCard = ({ indexId, story, refetch, isHotel }) => {
    const [updatedStory, setStory] = useState(story);
    const [uploadImg, setUpImg] = useState();
    const [visibilityChange, setvisibilityChange] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [isFlipped, setFlipped] = useState(false);
    const {
        profile,
        AddRemoveTourBkms,
        tourBkms,
        tourBkmLoading,
        tourBkmIdle,
        firstLoad,
        setFirstLoad
    } = useContext(AppContext);
    const [showModal, setShowModal] = useState({
        mode: "",
        isShow: false
    });
    const [showLoginModal, setLoginModal] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const onDrop = useCallback((acceptedFile) => {
        setUpImg(acceptedFile[0]);
        setImage(true);
        setShowCrop(true);
    }, []);
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        multiple: false
    });
    const [shareData, setShareData] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);

    const [isImage, setImage] = useState(false);
    const [deleteAlert, showAlert] = useState({
        message: "Are you sure to delete the story?",
        mode: false
    });
    useEffect(() => { }, [visibilityChange]);
    const [isScroll, setscroll] = useState(true);
    function setMyScroll() {
        setscroll(true);
    }

    const debouncedScrollHandler = useMemo(
        () => debounce(setMyScroll, 1000),
        []
    );

    const handleScroll = () => {
        if (isScroll) {
            //console.log("scroll detected");
            setscroll(false);
        }

        debouncedScrollHandler();
    };
    const router = useRouter();
    const ref = useRef();
    const getThemeId = (array) => {
        if (array && array.length >= 1) {
            let data = array.map((item) => {
                return { id: Number(item) };
            });
            return data;
        } else return [];
    };
    const getMonths = (array) => {
        if (array && array.length >= 1) {
            let data = array.map((item) => {
                return { month: item };
            });
            return data;
        } else return [];
    };
    useEffect(() => {
        if (story) {
            setStory(story);
        }
    }, [story]);

    return (
        <div
            className={root}
            key={story.id}
            onClick={(e) => {
                e.preventDefault();
                setFlipped(!isFlipped);
            }}
        >
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
                        boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
                        borderRadius="8px"
                        pos="relative"
                        borderBottomWidth="6px"
                        borderBottomColor="primary_3"
                        cursor="pointer"
                    >
                        <div
                            style={{ position: "relative" }}
                            ref={(ref) => setCardFrontRef(ref)}
                        >
                            <Box pos="relative" borderRadius="8px">
                                <Box
                                    pos="relative"
                                    w="100%"
                                    h="auto"
                                    maxH="100%"
                                    borderTopLeftRadius={"8px"}
                                    borderTopRightRadius={"8px"}
                                >
                                    <AspectRatio ratio={1}>
                                        <Image
                                            className={borderRadius}
                                            src={
                                                updatedStory?.coverImage?.url ||
                                                global.$defaultProfile
                                            }
                                            layout="fill"
                                            // placeholder="blur"
                                            lazyBoundary="500px"
                                            objectFit="cover"
                                            alt={"cover"}
                                        ></Image>
                                    </AspectRatio>
                                </Box>
                                {/* <Box
                                    pos="absolute"
                                    top="15px"
                                    width="100%"
                                    height={["13px", "15px"]}
                                    zIndex={99999}
                                >
                                    <Image
                                        src={
                                            "/assets/popup-postal-stripes-white.svg"
                                        }
                                        layout="fill"
                                        // placeholder="blur"

                                        objectFit="cover"
                                    ></Image>
                                </Box> */}

                                {showCrop && (
                                    <ImageCrop
                                        selectedImage={uploadImg}
                                        cropType={{
                                            unit: "%",
                                            width: 100,
                                            height: "370px",
                                            aspect: 1
                                        }}
                                        locked={false}
                                        resetCrop={() => {
                                            setShowCrop(false);
                                        }}
                                        callUploadFile={async (croppedFile) => {
                                            if (updatedStory.coverImage?.id) {
                                                await strapi.delete(
                                                    "upload/files",
                                                    updatedStory.coverImage?.id
                                                );
                                            }
                                            cacheBurstStory(story.id);
                                            uploadfile(
                                                croppedFile,
                                                story.id,
                                                "albums",
                                                "coverImage",
                                                {},
                                                async (result) => {
                                                    getAlbumbyId(
                                                        result?.data?.id
                                                    ).then((story) => {
                                                        setStory(story?.data);
                                                    });

                                                    setvisibilityChange(
                                                        !visibilityChange
                                                    );

                                                    setImage(false);
                                                    setShowCrop(false);
                                                }
                                            );
                                        }}
                                    />
                                )}
                            </Box>
                            <PostcardAlert
                                isCentered={true}
                                closeOnEsc={true}
                                closeOnOverlayClick={true}
                                show={deleteAlert}
                                buttonText={"DELETE"}
                                closeAlert={() => showAlert({ mode: false })}
                                handleAction={() => {
                                    deleteStory(updatedStory.id).then(
                                        (response) => {
                                            if (response) {
                                                if (refetch) refetch();
                                                showAlert({ mode: false });
                                            }
                                        }
                                    );
                                    //  window.location.reload();
                                }}
                            />

                            <div className={content}>
                                <Label
                                    style={{
                                        fontSize: "18px",
                                        lineHeight: "24px",
                                        marginTop: "3%"
                                    }}
                                    color="primary_14"
                                    fontStyle="bold"
                                    copy={updatedStory.name}
                                    fontFamily="raleway"
                                />
                                <Flex
                                    w="100%"
                                    my="2%"
                                    justifyContent={"space-between"}
                                >
                                    <Flex direction="column">
                                        {updatedStory?.user &&
                                            !updatedStory?.company && (
                                                <Label
                                                    color="primary_14"
                                                    size="sm"
                                                    fontFamily="raleway"
                                                    fontStyle="bold"
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                    copy={`${updatedStory.user?.fullName} `}
                                                />
                                            )}
                                        {updatedStory?.user &&
                                            updatedStory?.company &&
                                            updatedStory?.company.name && (
                                                <Label
                                                    color="primary_14"
                                                    size="sm"
                                                    fontFamily="raleway"
                                                    fontStyle="bold"
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                    copy={`${updatedStory.company?.name} `}
                                                />
                                            )}
                                        {!updatedStory?.user &&
                                            updatedStory?.company &&
                                            updatedStory?.company.name && (
                                                <Label
                                                    color="primary_14"
                                                    size="sm"
                                                    fontFamily="raleway"
                                                    fontStyle="bold"
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                    copy={`${updatedStory.company?.name} `}
                                                />
                                            )}
                                        <Label
                                            color="primary-4"
                                            size="sm"
                                            fontFamily="raleway"
                                            fontStyle="bold"
                                            copy={`${updatedStory.postcards
                                                    ?.length || "0"
                                                } postcards`}
                                        />
                                    </Flex>
                                    <Flex direction="column" mt="10px">
                                        {story.pricesStartingAt && (
                                            <Label
                                                color="primary-14"
                                                size="sm"
                                                fontFamily="raleway"
                                                fontStyle="bold"
                                                style={{
                                                    textAlign: "right"
                                                }}
                                                copy={`Starting at ${story.pricesStartingAt.includes(
                                                    "USD"
                                                )
                                                        ? ""
                                                        : "USD"
                                                    } ${story.pricesStartingAt} `}
                                            />
                                        )}
                                        {story.numberOfNights && (
                                            <Label
                                                color="primary-4"
                                                size="sm"
                                                fontFamily="raleway"
                                                fontStyle="bold"
                                                style={{
                                                    textAlign: "right"
                                                }}
                                                copy={`${story.numberOfNights
                                                    } ${story.numberOfNights > 1
                                                        ? isHotel
                                                            ? "rooms"
                                                            : "nights"
                                                        : isHotel
                                                            ? "room"
                                                            : "night"
                                                    }`}
                                            />
                                        )}
                                    </Flex>
                                </Flex>

                                <div className={description}>
                                    <Label
                                        color="primary-6"
                                        fontFamily="raleway"
                                        size="md"
                                        style={{
                                            whiteSpace: "pre-line",
                                            fontSize: "1rem",
                                            textAlign: "justify"
                                        }}
                                        copy={updatedStory.intro}
                                    />
                                </div>

                                {/* <div
                                    style={{
                                        width: "100%",
                                        display: "flex"
                                    }}
                                >
                                    <div className={chips}>
                                        {updatedStory.hashtags &&
                                            updatedStory.hashtags.map(
                                                (hashtag, index) => (
                                                    <div
                                                        key={
                                                            index +
                                                            "tscdiv" +
                                                            hashtag
                                                        }
                                                    >
                                                        <Label
                                                            color="primary-6"
                                                            size="sm"
                                                            copy={hashtag}
                                                        />
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </div> */}
                                <div className={action_icons}>
                                    <Img
                                        alt="flip"
                                        width="25px!important"
                                        height="22px"
                                        src={"../../../../assets/flip-icon.svg"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            ref.current.toggle();
                                        }}
                                    />
                                    {/* {updatedStory.like && (
                                        <Img
                                            loading="lazy"
                                            alt="unselected"
                                            src={
                                                "../../../../assets/bkm-selected.svg"
                                            }
                                            width="20px"
                                            height="22px"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (profile) {
                                                    AddRemoveTourBkms(
                                                        updatedStory,
                                                        updatedStory.likeId,
                                                        (like) => {
                                                            updatedStory.like =
                                                                !updatedStory.like;
                                                            setvisibilityChange(
                                                                !visibilityChange
                                                            );
                                                        }
                                                    );
                                                } else
                                                    setLoginModal({
                                                        mode: "login",
                                                        isShow: true
                                                    });
                                            }}
                                        />
                                    )} */}
                                    {/* {!updatedStory.like && (
                                        <Img
                                            loading="lazy"
                                            alt="unselected"
                                            src={
                                                "../../../../assets/bkm-unselected.svg"
                                            }
                                            width="20px"
                                            height="22px"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (profile) {
                                                    AddRemoveTourBkms(
                                                        updatedStory,
                                                        updatedStory.likeId,
                                                        (like) => {
                                                            updatedStory.like =
                                                                !updatedStory.like;
                                                            updatedStory.likeId =
                                                                like.id;
                                                            setvisibilityChange(
                                                                !visibilityChange
                                                            );
                                                        }
                                                    );
                                                } else
                                                    setLoginModal({
                                                        mode: "login",
                                                        isShow: true
                                                    });
                                            }}
                                        />
                                    )} */}
                                    <Img
                                        loading="lazy"
                                        alt="share"
                                        width="20px"
                                        height="22px"
                                        src={"../../../../assets/send.svg"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShareData({
                                                title: story?.name,
                                                description: story?.intro,
                                                // eslint-disable-next-line no-restricted-globals
                                                url:
                                                    `https://postcard.travel/` +
                                                    story.slug,
                                                hashtags: `#travel #postcardguide`,
                                                postcardDesc: story.intro,
                                                postcardTitle: story.name

                                                // hashtags: `#travel #postcardguide #${story.rcity?.Name} #${story.rcountry?.Name}`
                                            });
                                            setShowShareModal(true);
                                        }}
                                    />
                                    <Text
                                        variant={
                                            !updatedStory.isActive
                                                ? "readMore_notClickable"
                                                : "readMore"
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // if (
                                            //     story.id === 117384 ||
                                            //     story.id === 117383 ||
                                            //     story.id == 117388
                                            // )
                                            //     return;
                                            if (
                                                updatedStory.isActive ||
                                                isOwnStory(
                                                    profile,
                                                    updatedStory?.user
                                                )
                                            )
                                                router.push("/" + story.slug);
                                        }}
                                    >
                                        {!updatedStory.isActive &&
                                            !isOwnStory(profile, updatedStory?.user)
                                            ? "Coming Soon"
                                            : "View Stories"}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Box>
                    {isOwnStory(profile, updatedStory?.user) && (
                        <Flex
                            pos="relative"
                            justifyContent="center"
                            padding="8px"
                            top="8px"
                            w="100%"
                        >
                            <Flex width="20%" justifyContent="space-between">
                                {/* <Icon
                                    as={BiEditAlt}
                                    color="primary_1"
                                    padding="2px"
                                    boxSize="25px"
                                    background="white"
                                    borderRadius="full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal({
                                            mode: "edit",
                                            isShow: true
                                        });
                                    }}
                                /> */}
                                <Text
                                    //padding="2px"
                                    cursor="pointer"
                                    variant="readMore"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push("/" + updatedStory?.slug);
                                    }}
                                >
                                    edit
                                </Text>
                                <Text
                                    mx={2}
                                    cursor="pointer"
                                    variant="readMore"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAlert({
                                            message:
                                                " Are you sure to delete the story?",
                                            mode: true
                                        });
                                    }}
                                >
                                    delete
                                </Text>

                                {/* <Icon
                                    as={RiDeleteBin6Line}
                                    color="primary_1"
                                    background="white"
                                    padding="2px"
                                    borderRadius="full"
                                    boxSize="25px"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAlert({
                                            message:
                                                " Are you sure to delete the story?",
                                            mode: true
                                        });
                                    }}
                                /> */}
                            </Flex>
                            {/* <Box {...getRootProps()}>
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
                                <input {...getInputProps()} />
                            </Box> */}
                        </Flex>
                    )}
                    {/* <PostcardModal
                        size="lg"
                        isShow={showModal.isShow}
                        headerText={
                            showModal.mode === "create"
                                ? "New Tour"
                                : "Edit Tour"
                        }
                        children={
                            <CollectionForm
                                collection={updatedStory}
                                onClose={() => {
                                    refetch();
                                    setShowModal(false);
                                }}
                                mode={showModal.mode}
                            ></CollectionForm>
                        }
                        handleClose={() => setShowModal(false)}
                    /> */}
                </FrontSide>
                <BackSide
                    animationDuration={1500}
                    style={{
                        padding: "0px",
                        borderRadius: "8px",
                        boxShadow: "none"
                    }}
                >
                    <Box
                        background="cardBackground"
                        boxSizing="border-box"
                        boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
                        borderRadius="8px"
                        borderBottomWidth="6px"
                        borderBottomColor="primary_3"
                        cursor="pointer"
                        className={flipperContainer}
                    >
                        <Box
                            borderRadius="8px"
                            height={
                                cardFrontRef
                                    ? cardFrontRef.clientHeight
                                    : "auto"
                            }
                            className={content}
                            padding="12px 5px"
                            cursor="pointer"
                        >
                            <Img
                                loading="lazy"
                                h="5px"
                                w="100%"
                                src={"/assets/new_ui/icons/pc_lines.svg"}
                                alt="postalstripes"
                                mb="3%"
                                objectFit="cover"
                                borderRadius="8px"
                            />
                            {/* <div
                                style={{
                                    width: "100%",
                                    display: "flex"
                                }}
                            >
                                <div className={chips}>
                                    {updatedStory.hashtags &&
                                        updatedStory.hashtags.map(
                                            (hashtag, index) => (
                                                <div
                                                    key={
                                                        index +
                                                        "tscdiv" +
                                                        hashtag
                                                    }
                                                >
                                                    <Label
                                                        color="primary-6"
                                                        size="sm"
                                                        copy={hashtag}
                                                    />
                                                </div>
                                            )
                                        )}
                                </div>
                            </div> */}
                            <div
                                className={`${description} ${isScroll ? des : ""
                                    }`}
                                id={classes.des}
                                onScroll={handleScroll}
                                style={{
                                    paddingLeft: "15px",
                                    paddingRight: "15px",
                                    overflow: isFlipped ? "" : "hidden"
                                }}
                            >
                                <Label
                                    color="primary-6"
                                    fontFamily="raleway"
                                    size="md"
                                    style={{
                                        whiteSpace: "pre-line",
                                        fontSize: "15px",
                                        textAlign: "justify"
                                    }}
                                    copy={updatedStory.story}
                                />
                            </div>
                            <div
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px"
                                }}
                                className={action_icons}
                            >
                                <Img
                                    alt="flip"
                                    width="25px!important"
                                    height="22px"
                                    src={"../../../../assets/flip-icon.svg"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        ref.current.toggle();
                                    }}
                                />
                                {/* {updatedStory.like && (
                                    <Img
                                        loading="lazy"
                                        alt="unselected"
                                        src={
                                            "../../../../assets/bkm-selected.svg"
                                        }
                                        width="20px"
                                        height="22px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (profile) {
                                                AddRemoveTourBkms(
                                                    updatedStory,
                                                    updatedStory.likeId,
                                                    (like) => {
                                                        updatedStory.like =
                                                            !updatedStory.like;
                                                        setvisibilityChange(
                                                            !visibilityChange
                                                        );
                                                    }
                                                );
                                            } else
                                                setLoginModal({
                                                    mode: "login",
                                                    isShow: true
                                                });
                                        }}
                                    />
                                )}
                                {!updatedStory.like && (
                                    <Img
                                        loading="lazy"
                                        alt="unselected"
                                        src={
                                            "../../../../assets/bkm-unselected.svg"
                                        }
                                        width="20px"
                                        height="22px"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (profile) {
                                                AddRemoveTourBkms(
                                                    updatedStory,
                                                    updatedStory.likeId,
                                                    (like) => {
                                                        updatedStory.like =
                                                            !updatedStory.like;
                                                        updatedStory.likeId =
                                                            like.id;
                                                        setvisibilityChange(
                                                            !visibilityChange
                                                        );
                                                    }
                                                );
                                            } else
                                                setLoginModal({
                                                    mode: "login",
                                                    isShow: true
                                                });
                                        }}
                                    />
                                )} */}
                                <Img
                                    loading="lazy"
                                    alt="share"
                                    width="20px"
                                    height="22px"
                                    src={"../../../../assets/send.svg"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShareData({
                                            title: story?.name,
                                            description: story?.intro,
                                            // eslint-disable-next-line no-restricted-globals
                                            url:
                                                `https://postcard.travel/` +
                                                story.slug,
                                            hashtags: `#travel #postcardguide`,
                                            postcardDesc: story.intro,
                                            postcardTitle: story.name

                                            // hashtags: `#travel #postcardguide #${story.rcity?.Name} #${story.rcountry?.Name}`
                                        });
                                        setShowShareModal(true);
                                    }}
                                />
                                <Text
                                    variant={
                                        !story.isActive
                                            ? "readMore_notClickable"
                                            : "readMore"
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            story.isActive ||
                                            isOwnStory(
                                                profile,
                                                updatedStory?.user
                                            )
                                        )
                                            router.push("/" + story.slug);
                                    }}
                                >
                                    {!story.isActive &&
                                        !isOwnStory(profile, updatedStory?.user)
                                        ? "Coming Soon"
                                        : "View Stories"}
                                </Text>
                            </div>
                        </Box>
                    </Box>
                    {isOwnStory(profile, updatedStory?.user) && (
                        <Flex
                            pos="relative"
                            justifyContent="center"
                            padding="8px"
                            top="8px"
                            w="100%"
                        >
                            <Flex width="20%" justifyContent="space-between">
                                {/* <Icon
                                    as={BiEditAlt}
                                    color="primary_1"
                                    padding="2px"
                                    boxSize="25px"
                                    background="white"
                                    borderRadius="full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal({
                                            mode: "edit",
                                            isShow: true
                                        });
                                    }}
                                /> */}
                                <Text
                                    //padding="2px"
                                    cursor="pointer"
                                    variant="readMore"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push("/" + updatedStory?.slug);
                                    }}
                                >
                                    edit
                                </Text>
                                <Text
                                    mx={2}
                                    cursor="pointer"
                                    variant="readMore"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAlert({
                                            message:
                                                " Are you sure to delete the story?",
                                            mode: true
                                        });
                                    }}
                                >
                                    delete
                                </Text>

                                {/* <Icon
                                    as={RiDeleteBin6Line}
                                    color="primary_1"
                                    background="white"
                                    padding="2px"
                                    borderRadius="full"
                                    boxSize="25px"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showAlert({
                                            message:
                                                " Are you sure to delete the story?",
                                            mode: true
                                        });
                                    }}
                                /> */}
                            </Flex>
                            {/* <Box {...getRootProps()}>
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
                                <input {...getInputProps()} />
                            </Box> */}
                        </Flex>
                    )}
                </BackSide>
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
                    isShow={showLoginModal.isShow}
                    headerText={
                        showModal.mode === "login" ? "Sign in" : "Free Sign Up!"
                    }
                    size={showModal.mode === "login" ? "xl" : "sm"}
                    children={
                        <ModalSignupLogin
                            mode={showLoginModal.mode}
                            toggleMode={() =>
                                setLoginModal({
                                    isShow: true,
                                    mode:
                                        showLoginModal.mode === "login"
                                            ? "signup"
                                            : "login"
                                })
                            }
                            handleClose={() => setLoginModal({ isShow: false })}
                        />
                    }
                    handleClose={() => setLoginModal({ isShow: false })}
                /> */}
                <SignUpInModal
                    isShow={showLoginModal.isShow}
                    mode={showLoginModal.mode}
                    setShowModal={setLoginModal}
                    setShowSignModal={setShowSignModal}
                />
                <SignUpInfoModal
                    state={showSignModal}
                    setShowSignModal={setShowSignModal}
                />
            </Flippy>
        </div>
    );
};

export default TravelStoriesCard;
