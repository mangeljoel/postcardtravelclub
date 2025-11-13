import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Grid } from '@chakra-ui/react';
// import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useBreakpointValue,
    Box,
    Flex,
    Icon,
    IconButton,
    Image,
    Text,
    Button,
    Spinner,
    ModalCloseButton,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { FlipIcon, TrashIcon } from "../../styles/ChakraUI/icons";
import FlipCard1 from "../../patterns/FlipCard1";
import DxCard from "./DxCard";
import { scale } from "blueimp-load-image";

const MotionBox = motion(Box);
const MotionModalContent = motion(ModalContent);

const getImageVariants = (url) => {
    if (!url) return [];
    const parts = url.split("/");
    const filename = parts.pop();
    const base = parts.join("/");

    return [
        `${base}/large_${filename}`,
        url, // fallback to original
    ];
};

const getBestImageUrl = (url) => {
    const variants = getImageVariants(url);

    return new Promise((resolve) => {
        if (typeof window === "undefined") {
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

const GalleryCards = ({ images, allowImageUpload, onImageUpload, remainingSlots }) => {
    const [resolvedUrls, setResolvedUrls] = useState({});

    useEffect(() => {
        if (images?.length) {
            images.forEach((img) => {
                if (img?.url && !resolvedUrls[img.url]) {
                    getBestImageUrl(img.url).then((bestUrl) => {
                        setResolvedUrls((prev) => ({ ...prev, [img.url]: bestUrl }));
                    });
                }
            });
        }
    }, [images]);

    return (
        <>
            {images?.map((img, index) => (
                <FlipCard1
                    key={index}
                    frontContent={
                        <Box
                            w={["83.33vw", "314px", "314px", "100%"]}
                            h={["118.33vw", "514px", "514px", "36vw"]}
                            minW={["300px", "314px", "314px", "100%"]}
                            minH={["426px", "514px", "514px", "36vw"]}
                            position="relative"
                            overflow="hidden"
                            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        >
                            <Box w="100%" h="100%" position="relative" borderRadius="inherit">
                                {img?.isAddSlide ? (
                                    <Flex
                                        w="100%"
                                        h="100%"
                                        flexDirection="column"
                                        alignItems="center"
                                        justify="center"
                                        bg="rgba(17,17,17,0.5)"
                                        position="absolute"
                                        borderRadius="inherit"
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onImageUpload();
                                            }}
                                        >
                                            <Icon as={IoIosAdd} w="1.5em" h="1.5em" color="primary_3" />
                                        </Box>
                                        <Text color="white" mt={3}>
                                            You can add {remainingSlots} more image{remainingSlots > 1 ? "s" : ""}.
                                        </Text>
                                    </Flex>
                                ) : img?.isLoading ? (
                                    <Flex
                                        w="100%"
                                        h="100%"
                                        flexDirection="column"
                                        alignItems="center"
                                        justify="center"
                                        bg="rgba(17,17,17,0.5)"
                                        position="absolute"
                                        borderRadius="inherit"
                                    >
                                        <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                                        <Text color="white" mt={3}>
                                            Uploading...
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Image
                                        src={resolvedUrls[img.url] || img.url}
                                        alt={`carousel - ${index}`}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        borderRadius="inherit"
                                        loading="lazy"
                                    />
                                )}
                            </Box>
                        </Box>
                    }
                    backContent={
                        img?.isAddSlide
                            ? null
                            : (
                                <Flex
                                    flexDirection="column"
                                    pt={["23px", "23px", "23px", "1.67vw"]}
                                    bg="white"
                                    w="100%"
                                    h="100%"
                                    borderRadius="inherit"
                                    position="relative"
                                    justifyContent="space-between"
                                >
                                    <Flex
                                        dir="column"
                                        height="100%"
                                        alignItems="center"
                                        px={["18px", "18px", "18px", "1.4vw"]}
                                        overflowY="scroll"
                                        pr={[2, 2]}
                                        pb={["48px", "48px", "48px", "4.17vw"]}
                                    >
                                        <Text
                                            fontFamily="raleway"
                                            fontSize={["13px", "13px", "13px", "0.97vw"]}
                                            lineHeight={["15px", "15px", "15px", "1.25vw"]}
                                            color="#111111"
                                            textAlign="left"
                                            whiteSpace="pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: img?.caption || "" }}
                                        />
                                    </Flex>
                                    <Flex
                                        position="absolute"
                                        w="100%"
                                        bottom={["3vw", "1vw"]}
                                        px={["3vw", "1.5vw"]}
                                        align="center"
                                        justify="space-between"
                                    >
                                        {images.length > 1 ? (
                                            <Flex gap={["8px", "0.5vw"]} align="center">
                                                <Button variant="none" p={0} m={0} minW={["19px", "1.46vw"]} onClick={(e) => e.stopPropagation()}>
                                                    <FlipIcon width="100%" height={["24px", "1.80vw"]} stroke="primary_1" />
                                                </Button>

                                                <Button
                                                    variant="none"
                                                    p={0}
                                                    m={0}
                                                    minW="24px"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onImageUpload("crop", index);
                                                    }}
                                                >
                                                    <Icon as={MdEdit} width="24px" height="24px" color="primary_1" />
                                                </Button>

                                                <Button
                                                    variant="none"
                                                    p={0}
                                                    m={0}
                                                    minW="24px"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onImageUpload("delete", index);
                                                    }}
                                                >
                                                    <Icon as={MdDelete} width="24px" height="24px" color="primary_1" />
                                                </Button>
                                            </Flex>
                                        ) : (
                                            <Box />
                                        )}
                                    </Flex>
                                </Flex>
                            )
                    }
                />
            ))}
        </>
    );
};

const GalleryView = ({ isOpen, onClose, postcardData, carouselMedia, allowImageUpload, onImageUpload }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const maxImages = 6;
    const shouldShowAddSlide = allowImageUpload && carouselMedia.length < maxImages;
    const remainingSlots = maxImages - carouselMedia.length;
    const images = shouldShowAddSlide
        ? [...carouselMedia, { isAddSlide: true }]
        : [...carouselMedia];

    if (isMobile) {
        return (
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} closeOnOverlayClick={false}>
                <DrawerOverlay />
                <DrawerContent
                    borderTopRadius="5vw"
                    bg={"#efe9e4 !important"}
                    as={MotionBox}
                    width="100%" // changed from minW="100vw"
                    left={0}     // ensure left alignment
                    position="fixed" // fixed is more reliable for mobile overlays
                    bottom="0"
                    h={postcardData?.name?.length > 32 ? "85vh" : "80vh"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) => info.offset.y > window.innerHeight * 0.2 && onClose()}
                    style={{
                        width: "100vw", // ensure full viewport width
                        left: 0,
                        maxWidth: "100vw",
                        WebkitOverflowScrolling: "touch", // smooth scroll on iOS
                    }}
                >
                    <DrawerHeader>
                        <Box
                            w="23.6vw"
                            h="5px"
                            bg="#111111"
                            opacity="0.25"
                            borderRadius="2vw"
                            mx="auto"
                        />
                    </DrawerHeader>
                    <DrawerBody
                        p={0}
                        // mt="1em"
                        display="flex"
                        flexDirection={"column"}
                    // alignItems="center"
                    // justifyContent="center"
                    >
                        <Text fontFamily={"lora"} fontStyle={"italic"} fontWeight={600} fontSize={20} mt={4} textAlign={"center"} px={6}>{postcardData?.name}</Text>
                        <Flex overflowX={"auto"} flexWrap={"nowrap"} p={6} gap={4} className="no-scrollbar" flex={1} align={"center"}>
                            <GalleryCards images={images} allowImageUpload={allowImageUpload} onImageUpload={onImageUpload} remainingSlots={remainingSlots} />
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <AnimatePresence>
            <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="none"
                trapFocus={false}
                blockScrollOnMount={false}>
                <ModalOverlay />
                <MotionModalContent
                    bg="#efe9e4"

                    // Add width and left for Safari
                    width="100vw"
                    maxWidth="100vw"
                    left={0}
                    height="90vh"
                    borderTopRadius="2xl"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    display="flex"
                    flexDirection="column"
                    style={{
                        willChange: "transform",
                        width: "100vw",
                        maxWidth: "100vw",
                        left: 0,
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <ModalHeader textAlign="center" fontFamily={"lora"} fontStyle={"italic"} fontWeight="700">
                        {postcardData?.name}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody
                        px={{ base: "5%", lg: "10%" }}
                        // pb={{ base: "5%", lg: "10%" }}
                        overflowY="auto"
                        flex="1"
                    >
                        <Grid
                            templateColumns={[
                                "repeat(1, auto)",
                                "repeat(2, 1fr)",
                                "repeat(3, 1fr)",
                                "repeat(3, 1fr)",
                            ]}
                            gap={6}
                            justifyItems="center"
                            alignItems="center"
                            justifyContent="center"
                            {...(carouselMedia?.length > 2 ? { pb: "60px" } : {})}
                            pt={"60px"}
                        >
                            {/* <DxCard data={(() => {
                                const { gallery, ...rest } = postcardData || {};
                                return rest;
                            })()} /> */}
                            <GalleryCards images={images} allowImageUpload={allowImageUpload} onImageUpload={onImageUpload} remainingSlots={remainingSlots} />
                        </Grid>
                    </ModalBody>
                </MotionModalContent>
            </Modal >
        </AnimatePresence>

    );
};

export default GalleryView;
