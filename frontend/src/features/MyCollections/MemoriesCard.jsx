import React, { useState, useEffect, useContext } from "react";
import FlipCard1 from '../../patterns/FlipCard1';
import { Box, Button, Link, Flex, Icon, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, FlipIcon, WebsiteIcon } from '../../styles/ChakraUI/icons';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PostcardAlert from '../PostcardAlert';
import { IoMdCheckmark, IoIosCheckboxOutline, IoMdClose, IoIosAdd } from "react-icons/io";
import GalleryView from '../DestinationExpert/GalleryView';
import UserMemoriesForm from "./UserMemoriesForm";
import { useRouter } from "next/router";
import AppContext from "../AppContext";
import axios from 'axios';
import { useToast } from "@chakra-ui/react";
import { deleteDBEntry, fetchPaginatedResults } from "../../queries/strapiQueries";
import MemoriesUpload from "../../patterns/MemoriesUpload";
import DxCard from "../DestinationExpert/DxCard";
import { updateDBValue } from "../../queries/strapiQueries";

const MemoriesCard = ({ memories, setMemories, isOwner,
    card, firstLoad = false, setFirstLoad = () => { }, refreshMemories = () => { }
}) => {
    const { profile } = useContext(AppContext);


    const galleryMode = useDisclosure();
    const truncateCount = 57;
    const [isGalleryOpen, setIsGalleryOpen] = useState({ state: "close" });
    const [editingCard, setEditingCard] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [data, setData] = useState(null);
    const [resolvedUrls, setResolvedUrls] = useState({});

    // Utils to handle image fallbacks
    const getImageVariants = (url) => {
        if (!url) return [];
        const parts = url.split("/");
        const filename = parts.pop(); // e.g., fashion_collection_hanging_3be6c6f572.jpg
        const base = parts.join("/");

        return [
            `${base}/small_${filename}`,
            `${base}/medium_${filename}`,
            url, // original fallback
        ];
    };

    const getBestImageUrl = (url) => {
        const variants = getImageVariants(url);

        return new Promise((resolve) => {
            if (typeof window === "undefined") {
                // On server: just return original (or first variant)
                resolve(variants[variants.length - 1]);
                return;
            }

            const tryNext = (i) => {
                if (i >= variants.length) {
                    resolve(url);
                    return;
                }

                const img = new window.Image();
                img.src = variants[i];
                img.onload = () => resolve(variants[i]);
                img.onerror = () => tryNext(i + 1);
            };

            tryNext(0);
        });
    };




    useEffect(() => {
        if (card) setData(card);
    }
        , [card])

    useEffect(() => {
        if (data?.gallery) {
            data.gallery.forEach((img) => {
                if (!resolvedUrls[img.url]) {
                    getBestImageUrl(img.url).then((bestUrl) => {
                        setResolvedUrls((prev) => ({ ...prev, [img.url]: bestUrl }));
                    });
                }
            });
        }
    }, [data?.gallery]);


    const fetchCardData = async (id) => {
        let res = await fetchPaginatedResults("memories", { id: id }, { gallery: true, country: true, region: true, postcard: { album: true }, album: true, dx_card: true });
        setData(res);
    }

    useEffect(() => { }, [data])


    const [deleteAlert, setDeleteAlert] = useState({
        message: "Are your sure to delete this card?",
        mode: false,
    });

    const calculateFolderUrl = () => {
        if (card?.internalUrl) return card?.internalUrl;
        else if (card?.postcard)
            return card?.postcard?.album?.slug;
        else if (card?.album) return card?.album?.slug;


    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteDBEntry("memories", id);
            if (response) {
                setDeleteAlert({ mode: false });
                setMemories((prev) => prev.filter((memory) => memory.id !== id));
            }
        } catch (error) {
            console.error("Error deleting memory:", error);
        }
    };

    const toast = useToast();

    const [privacyAlert, setPrivacyAlert] = useState({
        message: "",
        mode: false,
    });

    const togglePrivacy = async (e) => {
        e.stopPropagation();


        // Treat anything that's not 'private' as public (including 'public', 'Selected', or undefined)
        const isCurrentlyPrivate = data?.shareType === 'private';
        const newShareType = isCurrentlyPrivate ? 'public' : 'private';


        // If making private to public, show confirmation
        if (isCurrentlyPrivate && newShareType === 'public') {
            setPrivacyAlert({
                mode: true,
                message: "Are you sure you want to make this memory public?"
            });
            return;
        }


        await updatePrivacy(newShareType);
    };

    const updatePrivacy = async (newShareType) => {
        try {
            console.log("Updating shareType to:", newShareType); // Debug log

            await updateDBValue("memories", data?.id, {
                shareType: newShareType
            });

            setData(prev => ({
                ...prev,
                shareType: newShareType
            }));

            setMemories(prev =>
                prev.map(memory =>
                    memory.id === data?.id
                        ? { ...memory, shareType: newShareType }
                        : memory
                )
            );

            toast({
                title: `Memory is now ${newShareType}`,
                description: newShareType === 'private'
                    ? "Only you can see this memory"
                    : "This memory is now visible to everyone",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Close alert if open
            setPrivacyAlert({ mode: false });

        } catch (error) {
            console.error("Error updating privacy:", error);

            toast({
                title: "Error updating privacy",
                description: "Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <FlipCard1
            frontContent={
                <>
                    <Flex
                        w={["full", "314px", "314px", "100%"]}
                        minW={["85vw", "25vw"]}
                        h={["505px", "505px", "505px", "36vw"]}
                        minH={["430px", "514px", "514px", "36vw"]}
                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        flexDirection={"column"}
                        bg={"white"}
                        position={"relative"}
                    >



                        {data?.gallery?.length > 0 ? (
                            <Flex
                                width="100%"
                                h={"21.53vw"}
                                minH={"295px"}
                                overflow="hidden"
                                borderTopRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                flexWrap="wrap"

                                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen({ state: "open" }) }}

                            >
                                {data.gallery
                                    .filter((img) => img.url !== data?.coverImage?.url)
                                    .slice(0, 6).map((img, index) => {
                                        const count = data?.gallery?.length;
                                        let width = "100%";
                                        let height = "100%";
                                        let borderRadius = "0";

                                        if (count === 1) {
                                            width = "100%"; height = "100%";
                                            borderRadius = "1.563vw 1.563vw 0 0";
                                        } else if (count === 2) {
                                            width = "50%"; height = "100%";
                                            borderRadius = index === 0 ? "1.563vw 0 0 0" : "0 1.563vw 0 0";
                                        } else if (count === 3) {
                                            width = index < 2 ? "50%" : "100%";
                                            height = "50%";
                                            borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 1 ? "0 1.563vw 0 0" : "0";
                                        } else if (count === 4) {
                                            width = "50%"; height = "50%";
                                            borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 1 ? "0 1.563vw 0 0" : "0";
                                        } else if (count === 5) {
                                            width = index < 3 ? "33.33%" : "50%";
                                            height = "50%";
                                            borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 2 ? "0 1.563vw 0 0" : "0";
                                        } else if (count === 6) {
                                            width = "33.33%"; height = "50%";
                                            borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 2 ? "0 1.563vw 0 0" : "0";
                                        }

                                        return (
                                            <Box
                                                key={index}
                                                width={width}
                                                height={height}
                                                overflow="hidden"
                                                flexShrink={0}
                                            // padding="1px"
                                            >
                                                {/* <motion.div whileHover={{ scale: 1.03 }}> */}

                                                <Box
                                                    as="figure"
                                                    width="100%"
                                                    height="100%"
                                                    overflow="hidden"
                                                    border="1px solid #eaeaea"
                                                    borderRadius="6px"
                                                >
                                                    <Box
                                                        as="img"
                                                        src={resolvedUrls[img.url] || img.url}
                                                        alt={`gallery-${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            transition: "transform 0.3s ease",
                                                        }}
                                                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                    />
                                                </Box>



                                                {/* </motion.div> */}

                                            </Box>
                                        );
                                    })}
                            </Flex>
                        ) : (
                            isOwner ? <Flex
                                width="100%"
                                h={"21.53vw"}
                                minH={"295px"}
                                borderTopRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                bg="rgba(17,17,17,0.5)"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                            >
                                <Box
                                    bg="white"
                                    borderRadius="lg"
                                    w="2em"
                                    h="2em"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    cursor="pointer"
                                    transition="transform 0.2s ease"
                                    _hover={{
                                        transform: "scale(1.05)"
                                    }}
                                    onClick={(e) => { e.stopPropagation(); setIsGalleryOpen({ state: "open" }) }}
                                >
                                    <Icon as={IoIosAdd} w="1.5em" h="1.5em" color="primary_3" />
                                </Box>
                                <Text
                                    color="white"
                                    mt={3}
                                    fontSize={["12px", "12px", "12px", "14px"]}
                                    fontFamily="raleway"
                                    textAlign="center"
                                    px={4}
                                >
                                    You can add {6 - (data?.gallery?.length || 0)} more image{6 - (data?.gallery?.length || 0) !== 1 ? 's' : ''}.
                                </Text>
                            </Flex> : <Image
                                src={data?.coverImage?.url ?? "/assets/default-fallback-image.png"}
                                h={"21.53vw"}
                                minH={"295px"}
                                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen({ state: "open" }) }}
                                objectFit="cover"
                                borderTopRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                width="100%"
                                alt="dx card"
                                loading="lazy"
                            />
                        )}

                        <Flex
                            flexDirection={"column"}
                            flex={1}
                            px={["20px", "20px", "20px", "1.53vw"]}
                            pt={["20px", "20px", "20px", "1vw"]}
                            pb={["21px", "21px", "21px", "1vw"]}
                        >
                            <Flex mb={["20px", "20px", "20px", "0.5vw"]}>
                                {data?.signature && <Text
                                    // w={"9.72vw"}
                                    // w={"8vw"}
                                    // minW={"128px"}
                                    fontFamily={"raleway"}
                                    fontWeight={600}
                                    textTransform={"uppercase"}
                                    fontSize={["12px", "12px", "12px", "0.7vw"]}
                                    lineHeight={["15px", "15px", "15px", "1vw"]}
                                    color={"gray"}
                                    textAlign={"right"}
                                >
                                    {data?.signature}
                                </Text>}
                            </Flex>
                            <Flex gap={2} justify={"space-between"}>
                                <Text
                                    fontFamily={"raleway"}
                                    fontSize={["17px", "17px", "17px", "1.25vw"]}
                                    lineHeight={["22px", "22px", "22px", "1.67vw"]}
                                    fontWeight={500}
                                    textAlign={"left"}
                                >
                                    {data?.name?.trim()}
                                </Text>
                                {data?.date && (
                                    <Box w={"fit-content"} h={"fit-content"} position={"relative"}>
                                        <CalendarIcon
                                            width={{ base: "3.7rem", lg: "4.5rem" }}
                                            height={{ base: "3.7rem", lg: "4.5rem" }}
                                        />

                                        {/* Year in the orange header area */}
                                        <Flex
                                            w={"100%"}
                                            position={"absolute"}
                                            top={{ base: 3, lg: 3.5 }}
                                            textAlign={"center"}
                                            justify={"center"}
                                            fontWeight={700}
                                            fontFamily={"arial"}
                                        >
                                            <Text
                                                fontSize={{ base: "10px", lg: "12px" }}
                                                fontWeight={"bold"}
                                                color={"white"}
                                            >
                                                {new Date(data.date).getFullYear()}
                                            </Text>
                                        </Flex>

                                        {/* Month and Day in the white area */}
                                        <Flex
                                            w={"100%"}
                                            h={"35%"}
                                            mt={["2%", "5%"]}
                                            flexDirection={"column"}
                                            color={"primary_3"}
                                            position={"absolute"}
                                            top={{ base: 7, lg: 8 }}
                                            textAlign={"center"}
                                            justify={"center"}
                                            fontWeight={400}
                                        >
                                            <Text fontSize={{ base: "9px", lg: "11px" }} fontWeight={"bold"}>
                                                {new Date(data.date)
                                                    .toLocaleString("en-US", { month: "short" })
                                                    .toUpperCase()}
                                            </Text>
                                            <Text
                                                lineHeight={{ base: "7px", lg: "9px" }}
                                                fontSize={{ base: "15px", lg: "18px" }}
                                                fontWeight={700}
                                            >
                                                {new Date(data.date).toLocaleString("en-US", { day: "2-digit" })}
                                            </Text>
                                        </Flex>
                                    </Box>


                                )}
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

                            </Flex>

                            <Flex
                                wrap={"wrap"}
                                gap={["9px", "9px", "9px", "0.5vw"]}
                                mt={["17px", "17px", "17px", "1.25vw"]}
                            >
                                {data?.tags?.map((tag, index) => (
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

                                    {isOwner && (
                                        <Button
                                            variant="none"
                                            p={0}
                                            m={0}
                                            minW={["19px", "19px", "19px", "1.46vw"]}
                                            height={["24px", "24px", "24px", "1.80vw"]}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePrivacy(e);
                                            }}
                                            title={data?.shareType === 'private' ? "Click to make Public" : "Click to make Private"}
                                            cursor="pointer"
                                            transition="transform 0.2s ease"
                                            _hover={{ transform: "scale(1.05)" }}
                                        >
                                            <Icon
                                                as={data?.shareType === 'private' ? FaEyeSlash : FaEye}
                                                width={"100%"}
                                                height={[
                                                    "24px",
                                                    "24px",
                                                    "24px",
                                                    "1.80vw"
                                                ]}
                                                color={data?.shareType === 'private' ? "#999999" : "#EA6146"}
                                                transition="color 0.2s ease"
                                            />
                                        </Button>
                                    )}




                                </Flex>
                                <MemoriesUpload type={"personal"} isOwner={isOwner} triggerUpload={isGalleryOpen} data={data} profile={profile} onChange={() => {
                                    fetchCardData(data?.id)
                                }
                                } />


                            </Flex>
                        </Flex>
                    </Flex>
                    <PostcardAlert
                        isCentered={true}
                        closeOnEsc={true}
                        closeOnOverlayClick={true}
                        show={deleteAlert}
                        closeAlert={() => setDeleteAlert({ mode: false })}
                        handleAction={() => handleDelete(data?.id)}
                        buttonText="DELETE"
                    />
                    <Box
                        sx={{
                            '.chakra-modal__content': {
                                maxWidth: '380px !important',
                                fontSize: '14px !important'
                            },
                            '.chakra-button': {
                                height: '3px !important',
                                fontSize: '13px !important',
                                minWidth: '90px !important',
                                fontWeight: '600 !important'
                            },
                            '.chakra-modal__body': {
                                fontSize: '10px !important',
                                lineHeight: '1.5 !important'
                            }
                        }}
                    >
                        <PostcardAlert
                            isCentered={true}
                            closeOnEsc={true}
                            closeOnOverlayClick={true}
                            show={privacyAlert}
                            closeAlert={() => setPrivacyAlert({ mode: false })}
                            handleAction={() => updatePrivacy('public')}
                            buttonText="OK"
                            buttonColorScheme="orange"
                        />
                    </Box>
                </>
            }
            {... {
                backContent: (
                    <Flex
                        flexDirection={"column"}
                        pt={["23px", "23px", "23px", "1.67vw"]}
                        bg="white"
                        w={"100%"}
                        minW={["90vw", "25vw"]}
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
                                // whiteSpace="pre-wrap"
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
                                gap={["10px", "10px", "10px", "0.8vw"]}
                                alignItems={"center"}
                            >
                                {/* <Button
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
                                </Button> */}
                                {card?.internalUrl && <Button
                                    as={Link}
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    minH={["23px", "23px", "23px", "1.74vw"]}
                                    href={card?.internalUrl}
                                    target={"_blank"}
                                >
                                    <Image
                                        src="/assets/folder_icon.png"
                                        alt="Folder"
                                        width={["27px", "27px", "27px", "2.1vw"]}
                                        height={["23px", "23px", "23px", "1.7vw"]}
                                    />
                                </Button>}
                                {data?.externalUrl && <Button
                                    as={Link}
                                    variant="none"
                                    p={0}
                                    m={0}
                                    minW={["23px", "23px", "23px", "1.74vw"]}
                                    height={["23px", "23px", "23px", "1.74vw"]}
                                    minH={["23px", "23px", "23px", "1.74vw"]}
                                    href={data?.externalUrl}
                                    target={"_blank"}
                                    onClick={(e) => { e.stopPropagation(); }}
                                >
                                    <WebsiteIcon
                                        width={["23px", "23px", "23px", "1.74vw"]}
                                        height={["23px", "23px", "23px", "1.74vw"]}
                                        stroke={"primary_1"}
                                    />
                                </Button>}




                            </Flex>

                            {isOwner && (
                                <Flex
                                    gap={["10px", "10px", "10px", "0.3vw"]}
                                    alignItems={"center"}>
                                    <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW="24px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditOpen(true);
                                        }}
                                    >
                                        <Icon as={MdEdit} width={["24px", "1.75vw"]} height={["24px", "1.75vw"]} color="primary_1" />
                                    </Button>

                                    {isEditOpen && data?.id && (
                                        <Box mt={4}>
                                            <UserMemoriesForm
                                                isOpen={true}
                                                onClose={() => setIsEditOpen(false)}
                                                initialData={data}
                                                setIsGalleryOpen={setIsGalleryOpen}
                                                userId={data?.user?.id}
                                                onSuccess={() => {
                                                    setIsEditOpen(false);
                                                    refreshMemories();// Refetch memories after adding/updating


                                                    // Optional: refetch memories or pass callback
                                                }}
                                            />
                                        </Box>
                                    )}


                                    <Button
                                        variant="none"
                                        p={0}
                                        m={0}
                                        minW="24px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteAlert({
                                                mode: true,
                                                message: "Are you sure you want to delete this card?",
                                            });
                                        }}
                                    >
                                        <Icon as={MdDelete} width={["24px", "1.75vw"]} height={["24px", "1.75vw"]} color="primary_1" />
                                    </Button>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                )
            }
            }
            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
        />
    )
}

export default MemoriesCard