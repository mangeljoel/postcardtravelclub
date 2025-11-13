import React, { useState, useEffect, useContext } from 'react'
import FlipCard1 from '../../patterns/FlipCard1';
import { Box, Button, Link, Flex, Icon, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import { BookmarkIcon, CalendarIcon, FlipIcon, WebsiteIcon } from '../../styles/ChakraUI/icons';
import { MdDelete, MdEdit } from 'react-icons/md';
import PostcardAlert from '../PostcardAlert';
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdCheckmark, IoIosCheckboxOutline, IoMdClose, IoIosAdd } from "react-icons/io";
import { CloseIcon, DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import GalleryView from '../DestinationExpert/GalleryView';
import AppContext from '../AppContext';
import { useSignupModal } from '../SignupModalContext';
import { followUnfollowAlbum } from '../../services/utilities';
import MemoriesUpload from '../../patterns/MemoriesUpload';

const FNDCard = ({ data, canEdit, handleDelete, openEditForm, canSelect = false, canRemove = false, isSelected = false, allowImageUpload = false, onImageUpload = () => { }, carouselMedia = [], dragHandleProps, isDragging, checkboxClick = () => { }, unselectCard = () => { }, changeDateCard = () => { }, openAiDetails = () => { }, firstLoad = false, setFirstLoad = () => { } }) => {
    // const [dxCardMode, setDxCardMode] = React.useState("normal")
    const [deleteAlert, setDeleteAlert] = useState({
        message: "Are your sure to delete this card?",
        mode: false
    });
    const { profile, logOut } = useContext(AppContext);
    const [followed, setFollowed] = useState(false);
    const [followId, setFollowId] = useState(null);
    const galleryMode = useDisclosure()
    const truncateCount = data?.date ? 57 : 70
    const { openLoginModal } = useSignupModal()

    // if (dxCardMode == "gallery") return <DxCardCarousel coverImage={data?.coverImage} intro={data?.intro} carouselMedia={data?.gallery || []} allowImageUpload={allowImageUpload} onImageUpload={(mode, index) => {
    //     onImageUpload(data?.blockId, mode, index)
    // }
    // } />
    useEffect(() => {
        if (profile) {
            data?.follow_albums?.forEach((item) => {
                if (item?.follower?.id == profile.id) {
                    setFollowId(item.id);
                    setFollowed(true);
                }
            });
        } else {
            setFollowed(false);
            setFollowId(null);
        }
    }, [profile, data])
    const handleFollowUnfollowAlbum = async (e) => {
        e.stopPropagation();
        if (profile) {

            followUnfollowAlbum(
                followed,
                followId,
                profile.id,
                data.id,
                (response) => {
                    // console.log(response)
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
        }
        else {
            openLoginModal()
        }
    };

    return (
        <FlipCard1
            frontContent={
                <>
                    <Flex
                        w={["100%", "314px", "314px", "25vw"]}
                        minW={["90vw", "314px", "314px", "25vw"]}
                        h={["514px", "514px", "514px", "36vw"]}
                        minH={["514px", "514px", "514px", "36vw"]}
                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        flexDirection={"column"}
                        bg={"white"}
                        position={"relative"}
                    >
                        {isSelected && <Flex flexDirection={"column"} bg={"rgba(17,17,17,0.5)"} pos={"absolute"} zIndex={10} w={"100%"} h={"100%"} borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]} justify={"center"} alignItems={"center"}
                            onClick={(e) => {
                                e.stopPropagation();
                                unselectCard(data?.id);
                            }}
                        >
                            <IconButton
                                variant={"none"}
                                as={IoMdCheckmark}
                                w={"2em"}
                                h={"2em"}
                                // position={"absolute"}
                                // zIndex={10}
                                // right={"5%"}
                                // top={"2%"}
                                color={"white"}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     // unselectCard(data?.id);
                            // }}
                            />

                            {typeof isSelected != "boolean" && <Text
                                fontFamily={"raleway"}
                                fontSize={["17px", "17px", "17px", "1.25vw"]}
                                lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                fontWeight={500}
                                mt={"2%"}
                                color={"white"}
                                textAlign={"left"}
                            >
                                {new Date(isSelected).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                })}
                            </Text>}
                        </Flex>}
                        {canSelect && !isSelected && (
                            <IconButton
                                variant={"none"}
                                as={isSelected ? MdCheckBox : IoIosCheckboxOutline}
                                w={"2em"}
                                h={"2em"}
                                position={"absolute"}
                                zIndex={10}
                                right={"5%"}
                                top={"2%"}
                                color={"primary_1"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    checkboxClick(data?.id);
                                }}
                            />
                        )}
                        {/* {canRemove && (
                            <Flex
                                position={"absolute"}
                                // w={"2em"}
                                h={"2em"}
                                zIndex={10}
                                right={"5%"}
                                top={"2%"}
                            >
                                <IconButton
                                    variant={"none"}
                                    h={"90%"}
                                    as={FaRegCalendarAlt}
                                    color={"primary_1"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unselectCard(data?.id);
                                    }}
                                />
                                <IconButton
                                    variant={"none"}
                                    h={"100%"}
                                    as={IoMdClose}
                                    color={"primary_1"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unselectCard(data?.id);
                                    }}
                                />
                            </Flex>
                        )} */}

                        <Image
                            src={data?.coverImage?.url ?? "/assets/default-fallback-image.png"}
                            h={"21.53vw"}
                            minH={"295px"}

                            objectFit={"cover"}
                            borderTopRadius={[
                                "22.5px",
                                "22.5px",
                                "22.5px",
                                "1.563vw"
                            ]}
                            alt={"dx card"}
                        />
                        {/* <DxCardCarousel coverImage={data?.coverImage} allowImageUpload={allowImageUpload} onImageUpload={() => onImageUpload(data?.blockId)} carouselMedia={carouselMedia} /> */}
                        <Flex
                            flexDirection={"column"}
                            flex={1}
                            p={["20px", "20px", "20px", "1.53vw"]}
                            pb={["21px", "21px", "21px", "0.7vw"]}
                        >
                            <Flex gap={2} justify={"space-between"}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontSize={["17px", "17px", "17px", "1.25vw"]}
                                    lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                    fontWeight={500}
                                    textAlign={"left"}
                                >
                                    {(data?.name?.trim()?.length > truncateCount
                                        ? data?.name?.trim().slice(0, truncateCount) + '...'
                                        : data?.name?.trim())}
                                </Text>
                                {data?.date && (<Box w={"fit-content"} h={"fit-content"} position={"relative"}>
                                    <CalendarIcon width="3.5rem" height="3.5rem" />
                                    <Flex w={"100%"} mt="3%" flexDirection={"column"} color={"primary_3"} position={"absolute"} top={5} textAlign={"center"} justify={"center"} fontWeight={400}>
                                        <Text fontSize={"10px"} fontWeight={"bold"}>{new Date(data.date).toLocaleString("en-US", { month: "short" }).toUpperCase()}</Text>
                                        <Text lineHeight={"10px"} fontSize={"18px"} fontWeight={700}>{new Date(data.date).toLocaleString("en-US", { day: "2-digit" })}</Text>
                                    </Flex>
                                </Box>)}
                            </Flex>

                            <Flex justify={"space-between"}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontSize={["12px", "13px", "13px", "14px"]}
                                    lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                    textTransform={"uppercase"}
                                    fontWeight={"600"}
                                    mt={"2%"}

                                    color={"primary_1"}
                                    textAlign={"left"}
                                >
                                    {data?.region ? `${data?.region?.name}, ` : ""}{data?.country?.name}
                                </Text>
                                {/* {data?.date && <Text
                                    fontFamily={"raleway"}
                                    fontSize={["14px", "13px", "13px", "0.94vw"]}
                                    lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                    fontWeight={500}
                                    mt={"2%"}
                                    color={"primary_3"}
                                    textAlign={"left"}
                                >
                                    {new Date(data?.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })}
                                </Text>} */}
                            </Flex>

                            {/* <Text
                                mt={["14px", "14px", "14px", "0.7vw"]}
                                fontFamily={"raleway"}
                                fontSize={["4vw", "13px", "13px", "0.97vw"]}
                                lineHeight={["5vw", "15px", "15px", "1.25vw"]}
                                color={"black"}
                                textAlign={"left"}
                            >
                                {data?.intro}
                            </Text> */}

                            <Flex
                                wrap={"wrap"}
                                gap={["9px", "9px", "9px", "0.5vw"]}
                                mt={["17px", "17px", "17px", "1.25vw"]}
                            >
                                {/* <Text h={"1.53vw"}
                                    minH={"20px"}

                                    borderColor={"primary_3"}
                                    color={"primary_3"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    fontSize={["20px", "20px", "20px", "18px"]}>{data?.environment?.name} - </Text> */}
                                {data?.cuisines?.map((tag, index) => (
                                    <Flex
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
                                        //href={`/experiences/${tag.name?.toLowerCase()}`}
                                        textTransform={"capitalize"}
                                    >
                                        {tag?.name}
                                    </Flex>
                                ))}
                            </Flex>

                            <Flex
                                mt="auto"
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Flex
                                    gap={["10px", "10px", "10px", "0.83vw"]}
                                    maxW={["12vw", "auto"]}
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
                                    {data && <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={handleFollowUnfollowAlbum}
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
                                            fill={followed ? "primary_1" : "none"}
                                        />
                                    </Button>}
                                    {followed && <MemoriesUpload type="restaurant" data={data} profile={profile} />}
                                    {/* {canEdit && <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={(e) => { e.stopPropagation(); openEditForm(data) }}
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
                                    {canEdit && <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW={["19px", "19px", "19px", "1.46vw"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteAlert({
                                                mode: true,
                                                message: "Are your sure to delete this card?"
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
                                    {canRemove && (
                                        <>
                                            <Button
                                                variant="none"
                                                p={0}
                                                m={0}
                                                minW={["19px", "19px", "19px", "1.46vw"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeDateCard(data?.id);
                                                }}
                                            >
                                                <Icon
                                                    as={FaRegCalendarAlt}
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
                                            </Button>
                                            <Button
                                                variant="none"
                                                p={0}
                                                m={0}
                                                minW={["19px", "19px", "19px", "1.46vw"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    unselectCard(data?.id);
                                                }}
                                            >
                                                <Icon
                                                    as={DeleteIcon}
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
                                            </Button>
                                        </>
                                    )}
                                    {canRemove && dragHandleProps && (
                                        <IconButton
                                            icon={<DragHandleIcon />}
                                            variant="none"
                                            p={0}
                                            m={0}
                                            minW={["19px", "19px", "19px", "1.46vw"]}
                                            cursor={"pointer"}
                                            color={"primary_1"}
                                            aria-label="Drag"
                                            {...dragHandleProps}
                                        />
                                    )}

                                </Flex>

                                {/* <Text
                                    // w={"9.72vw"}
                                    w={"8vw"}
                                    minW={"128px"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    fontSize={["12px", "12px", "12px", "0.94vw"]}
                                    lineHeight={["15px", "15px", "15px", "1.11vw"]}
                                    color={"primary_3"}
                                    mb={0}
                                    textAlign={"right"}
                                >
                                    {data?.destination_expert?.user?.company?.name || data?.destination_expert?.title}
                                </Text> */}
                                {data?.signature && <Text
                                    // w={"9.72vw"}
                                    w={"8vw"}
                                    minW={"128px"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    textTransform={"uppercase"}
                                    fontSize={["12px", "12px", "12px", "0.94vw"]}
                                    lineHeight={["15px", "15px", "15px", "1.11vw"]}
                                    color={"primary_3"}
                                    mb={0}
                                    textAlign={"right"}
                                >
                                    {data?.signature}
                                </Text>}
                            </Flex>
                        </Flex>
                    </Flex>
                    <PostcardAlert
                        isCentered={true}
                        closeOnEsc={true}
                        closeOnOverlayClick={true}
                        show={deleteAlert}
                        closeAlert={() => setDeleteAlert({ mode: false })}
                        handleAction={() => { handleDelete(data?.id); setDeleteAlert({ mode: false }); }}
                        buttonText="DELETE"
                    />
                </>
            }
            {...(!isSelected && {
                backContent: (
                    <Flex
                        flexDirection={"column"}
                        pt={["23px", "23px", "23px", "1.67vw"]}
                        bg="white"
                        w={"100%"}
                        h={"100%"}
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
                            minH={"48px"}
                            background="linear-gradient(to top, white 0%, transparent 100%)"
                            pointerEvents="none"
                            zIndex={10}
                            opacity={1}
                        />
                        <Box
                            px={["18px", "18px", "18px", "1.4vw"]}
                            overflowY={"scroll"}
                            pr={[2, 2]}
                            pb={["48px", "48px", "48px", "4.17vw"]}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontSize={["13px", "13px", "13px", , "0.97vw"]}
                                lineHeight={["15px", "15px", "15px", "1.25vw"]}
                                color={"#111111"}
                                textAlign={"left"}
                                whiteSpace="pre-wrap"
                                dangerouslySetInnerHTML={{ __html: data?.intro }}
                            />
                            {/* <ReactMarkdown>{data?.story}</ReactMarkdown>
                        </Text> */}
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
                                {canEdit && <Button
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["19px", "19px", "19px", "1.46vw"]}
                                    onClick={(e) => { e.stopPropagation(); openEditForm(data) }}
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
                                {canEdit && <Button
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["19px", "19px", "19px", "1.46vw"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteAlert({
                                            mode: true,
                                            message: "Are your sure to delete this card?"
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
                            </Flex>

                            <Flex
                                gap={["10px", "10px", "10px", "0.83vw"]}
                                alignItems={"center"}
                            >
                                {/* <Button
                                    variant="outline"
                                    // p={0}
                                    m={0}
                                    minW={["19px", "19px", "19px", "1.46vw"]}
                                    height={["24px", "24px", "24px", "1.80vw"]}
                                    minH={["24px", "24px", "24px", "1.80vw"]}
                                    fontSize={["14px", "13px", "13px", "0.94vw"]}
                                    lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openAiDetails(data?.id, data?.name)
                                    }}
                                >
                                    Know more
                                </Button> */}
                                {/* <Button
                                as={Link}
                                variant="none"
                                p={0}
                                m={0}
                                minW={["23px", "23px", "23px", "1.74vw"]}
                                height={["23px", "23px", "23px", "1.74vw"]}
                                minH={["23px", "23px", "23px", "1.74vw"]}
                                href={data?.album?.news_article ? `/postcard-pages/${data?.album?.slug}` : data?.album?.slug}
                                target={"_blank"}
                            >
                                <FolderIcon
                                    width={[
                                        "23px",
                                        "23px",
                                        "23px",
                                        "1.74vw"
                                    ]}
                                    height={[
                                        "23px",
                                        "23px",
                                        "23px",
                                        "1.74vw"
                                    ]}
                                    stroke={"primary_1"}
                                />
                            </Button>
                            <Button
                                as={Link}
                                variant="none"
                                p={0}
                                m={0}
                                minW={["23px", "23px", "23px", "1.74vw"]}
                                height={["23px", "23px", "23px", "1.74vw"]}
                                minH={["23px", "23px", "23px", "1.74vw"]}
                                href={data?.album?.website}
                                target={"_blank"}
                                onClick={(e) => { e.stopPropagation(); addBacklinkEvent(profile?.id, data?.album?.website, data?.album?.id, data?.id) }}
                            >
                                <WebsiteIcon
                                    width={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    stroke={"primary_1"}
                                />
                            </Button> */}
                                {data?.website && <Button
                                    as={Link}
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    minH={["23px", "23px", "23px", "1.74vw"]}
                                    href={data?.website}
                                    target={"_blank"}
                                // onClick={(e) => { e.stopPropagation(); addBacklinkEvent(profile?.id, data?.album?.website, data?.album?.id, data?.id) }}
                                >
                                    <WebsiteIcon
                                        width={["23px", "23px", "23px", "1.74vw"]}
                                        height={["23px", "23px", "23px", "1.74vw"]}
                                        stroke={"primary_1"}
                                    />
                                </Button>}
                            </Flex>
                        </Flex>
                    </Flex>
                )
            })
            }
            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
        />
    )
}

export default FNDCard;