import { useRef, useContext, useState, useMemo, useEffect } from "react";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import {
    Box,
    AspectRatio,
    Link,
    Flex,
    Button,
    Text,
    Heading
} from "@chakra-ui/react";
import Image from "next/image";
import { Waypoint } from "react-waypoint";
import AppContext from "../../AppContext";
import {
    des,
    description,
    flipperContainer,
    is_bottom_overflowing,
    is_top_overflowing
} from "./index.module.scss";
import { debounce } from "lodash";
import classes from "./index.module.scss";

const FlipTile = ({ profile, indexId, onlyImage }) => {
    const ref = useRef();
    const { firstLoad, setFirstLoad } = useContext(AppContext);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [isScroll, setscroll] = useState(true);
    const [isFlipped, setFlipped] = useState(false);
    const [checkmargin, setcheckMargin] = useState(profile.subTitle);

    function setMyScroll() {
        setscroll(true);
    }

    const debouncedScrollHandler = useMemo(
        () => debounce(setMyScroll, 1000),
        []
    );

    const handleScroll = (el) => {
        const isScrollable = el.scrollHeight > el.clientHeight;

        if (!isScrollable) {
            el.classList.remove("is-bottom-overflowing", "is-top-overflowing");
            return;
        }

        const isScrolledToBottom =
            el.scrollHeight <= Math.ceil(el.clientHeight + el.scrollTop);
        const isScroledlToTop = el.scrollTop === 0;
        el.classList.toggle(is_bottom_overflowing, !isScrolledToBottom);
        el.classList.toggle(is_top_overflowing, !isScroledlToTop);
        //console.log(e);

        //debouncedScrollHandler();
    };
    // console.log(profile);

    return (
        <Box
            onClick={(e) => {
                e.preventDefault();
                setFlipped(!isFlipped);
                if (!isFlipped) {
                    let el = document.getElementById(
                        "contentscroll" + profile.id
                    );
                    if (el) {
                        const isScrollable = el.scrollHeight > el.clientHeight;
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
            <Flippy
                flipDirection="horizontal"
                flipOnHover={false}
                ref={ref}
                flipOnClick={true}
                style={{
                    width: onlyImage ? "auto" : ["100%", "50%"],
                    cursor: "pointer"
                }}
            >
                <FrontSide
                    animationDuration={1500}
                    style={{
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.16)",
                        padding: "0em",
                        backgroundColor: "#fbf8f5",
                        borderRadius: "8px"
                    }}
                >
                    <Box
                        w="100%"
                        pos="relative"
                        borderRadius="8px"
                        ref={(ref) => setCardFrontRef(ref)}
                    >
                        <AspectRatio
                            ratio={1}
                            pos="relative"
                            overflow="hidden"
                            borderTopRadius={onlyImage ? "" : "8px!important"}
                            borderRadius={onlyImage ? "8px" : ""}
                            w="100%"
                            h="100%"
                            margin="auto"
                        >
                            <Image
                                src={profile?.frontImage?.url}
                                layout="fill"
                                fallbackSrc="/assets/images/p_stamp.png"
                                objectFit="cover"
                                alt={"profile image"}
                            ></Image>
                        </AspectRatio>
                        {!onlyImage && (
                            <Box
                                pt="6"
                                // height="40"
                                borderRadius="8px"
                                bg="cardBackground"
                                textAlign="center"
                            >
                                <Text fontSize="1.6rem" fontWeight={"bold"}>
                                    {profile?.name}
                                </Text>
                            </Box>
                        )}
                        {/* {!onlyImage && (
                            <Box py="5" borderRadius="8px" textAlign="center" bg="cardBackground">
                                <Text>{profile?.country?profile?.country?.name:"India"}</Text>
                            </Box>
                        )} */}
                        {!onlyImage && (
                            <Box
                                py="6"
                                textAlign="center"
                                borderRadius="8px"
                                bg="cardBackground"
                            >
                                <Text fontSize="1.2rem">
                                    {profile?.postcardRole}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </FrontSide>
                <BackSide
                    animationDuration={1500}
                    style={{
                        boxShadow: "none",
                        padding: "0em",

                        borderRadius: "8px"
                    }}
                >
                    {onlyImage ? (
                        <AspectRatio ratio={1} pos="relative" margin="auto">
                            <Box pos="relative">
                                <AspectRatio
                                    ratio={1}
                                    pos="relative"
                                    overflow="hidden"
                                    borderRadius="8px"
                                    w="100%"
                                    h="100%"
                                    margin="auto"
                                >
                                    <Image
                                        src={profile?.backImage?.url}
                                        layout="fill"
                                        fallbackSrc="/assets/images/p_stamp.png"
                                        objectFit="cover"
                                        alt={"profile image"}
                                    ></Image>
                                </AspectRatio>
                                <Link
                                    rel="noreferrer noopener"
                                    href={profile?.link ? profile.link : null}
                                    target={"_blank"}
                                >
                                    <Box
                                        pos="absolute"
                                        top="40%"
                                        left="20%"
                                        width="60%"
                                        height="50%"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    ></Box>
                                </Link>
                            </Box>
                        </AspectRatio>
                    ) : (
                        <Box
                            borderRadius="8px"
                            pb={3}
                            height={
                                cardFrontRef
                                    ? cardFrontRef.clientHeight
                                    : "auto"
                            }
                            bg="cardBackground"
                            className={flipperContainer}
                        >
                            <Box
                                height="7px"
                                width="100%"
                                mb="3%"
                                pos={"absolute"}
                                top="2vh"
                            >
                                <Image
                                    layout="fill"
                                    src={"/assets/new_ui/icons/pc_lines.svg"}
                                    alt="postalstripes"
                                    objectFit="cover"
                                />
                            </Box>
                            <Flex
                                w="100%"
                                pos="relative"
                                px="1"
                                py="2"
                                direction="column"
                                height="100%"
                                m="auto"
                                textAlign={"center"}
                                justifyContent="center"
                            >
                                <div
                                    className={`${description} ${isScroll ? des : ""
                                        }`}
                                    id={"contentscroll" + profile.id}
                                    onScroll={(e) => {
                                        let el = e.currentTarget;
                                        handleScroll(el);
                                    }}
                                    style={{
                                        whiteSpace: "pre-line",
                                        overflow: isFlipped ? "" : "hidden",
                                        marginTop: "25px",
                                        marginBottom: "13px"
                                    }}
                                >
                                    {profile.subTitle && (
                                        <Text
                                            as="b"
                                            color="primary_6"
                                            fontFamily="raleway"
                                            whiteSpace="pre-line"
                                            fontSize="1rem"
                                            textAlign="justify"
                                            overflowY={"auto"}
                                        >
                                            {profile.subTitle}
                                        </Text>
                                    )}
                                    <Text
                                        color="primary_6"
                                        fontFamily="raleway"
                                        // maxH="70%"
                                        // overflow={"scroll"}
                                        whiteSpace="pre-line"
                                        fontSize="1rem"
                                        textAlign="justify"
                                        overflowY={"auto"}
                                        mt={checkmargin ? "30px" : ""}
                                    >
                                        {profile.about}
                                    </Text>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (profile.link)
                                                window.open(
                                                    profile.link,
                                                    "_blank"
                                                );
                                        }}
                                        left="30%"
                                        w="40%"
                                        mx="auto"
                                        mt={6}
                                    >
                                        LinkedIn
                                    </Button>
                                </div>
                            </Flex>
                        </Box>
                    )}
                </BackSide>
            </Flippy>
        </Box>
    );
};
export default FlipTile;
