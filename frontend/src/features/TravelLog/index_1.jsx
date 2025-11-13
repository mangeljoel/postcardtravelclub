import { Box, Button, Flex, FormControl, FormLabel, Input, Link, ModalBody, ModalFooter, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ChakraNextImage } from '../../../src/patterns/ChakraNextImage'
import { fetchPaginatedResults, updateDBValue } from '../../../src/queries/strapiQueries'
import Experiences from '../../../src/features/TravelLog/Experiences'
import Stays from '../../../src/features/TravelLog/Stays'
import AppContext from '../AppContext'
import PostcardAlert from '../PostcardAlert'
import PostcardModal from '../PostcardModal'
import { Field, Form, Formik } from 'formik'
import NotPrivileged from '../../patterns/NotPrivileged'
import StaticImageCropModal from '../../patterns/ImageCropModal/StaticImageCropModal'
import { getUrlOfUploadImage } from '../../services/utilities'
import { Calendar, DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TravelLoguePage = ({ deckDetails: defaultDeckDetails, blocks: defaultBlocks }) => {
    const { profile } = useContext(AppContext);
    const [deckDetails, setDeckDetails] = useState(defaultDeckDetails || {});
    const [blocks, setBlocks] = useState(defaultBlocks || []);
    const [currentCardId, setCurrentCardId] = useState(null);
    const [blockId, setBlockId] = useState(null);
    const [note, setNote] = useState('');
    const [blockImageEdit, setBlockImageEdit] = useState({ mode: null, index: null })
    const [newDate, setNewDate] = useState(null);
    const isDx = deckDetails?.destination_expert?.user?.id == profile?.id
    const isDeckUser = deckDetails?.user?.id == profile?.id;
    const isMobile = useBreakpointValue({ base: true, md: false });
    const removeCardModal = useDisclosure();
    const changeDateModal = useDisclosure();
    const publishModal = useDisclosure();
    const toast = useToast()
    const fileInputRef = useRef();
    const image = ''
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [isFooterInView, setIsFooterInView] = useState(true);

    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const maxImages = 6;
    const showActionButton = deckDetails?.status == "deckBuild" && isDx

    const handleRemoveCard = useCallback((id) => {
        removeCardModal.onOpen();
        setCurrentCardId(id);
    }, [removeCardModal.onOpen]);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        // If mobile and navigator.share is supported, use the native share API
        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
        } else {
            // For desktop or when share is unavailable, copy the URL to clipboard
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        })
                    })
                    .catch((err) => {
                        // console.log('Error copying URL:', err);
                    });
            } catch (err) {
                // console.log('Error:', err);
            }
        }
    };

    const handleSave = async (tabBlocks) => {
        try {
            // Create a map of updated orders from tabBlocks
            const updatedOrderMap = new Map(
                tabBlocks.map((block, index) => [block.id, index])
            );

            // Merge new orders into full blocks array (only affected blocks get updated)
            const updatedBlocks = blocks.map((block) => {
                if (updatedOrderMap.has(block.dx_card?.id)) {
                    return {
                        ...block,
                        order: updatedOrderMap.get(block.dx_card.id),
                    };
                }
                return block; // unchanged
            });

            // Only patch the full array if deckDetails.id exists
            if (deckDetails?.id) {
                await updateDBValue("travelogues", deckDetails.id, {
                    itinerary_block: updatedBlocks,
                });
                toast({
                    title: "Postcard Deck saved successfully",
                    status: "success",
                    isClosable: true,
                    position: 'top',
                    variant: "subtle",
                });
            }

            setBlocks(updatedBlocks);
        } catch (error) {
            console.error("Failed to save reordered blocks:", error);
        }
    };

    const handleComplete = async () => {
        try {
            const allDatesAvailable = blocks.every(block => block.date);
            if (!allDatesAvailable) {
                toast({
                    title: "Please ensure all cards have a date before publishing the deck.",
                    status: "warning",
                    isClosable: true,
                    position: 'top',
                    variant: "subtle"
                });
                return;
            }
            publishModal.onOpen();
        } catch (error) {
            console.error("Error completing travelogue:", error);
        }
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const block = blocks.find((b) => b.id === blockId);
        if (!block) return;

        const currentGallery = block.gallery ? [...block.gallery] : [];

        // Calculate available space (max 6 images per block)
        const remainingSlots = 6 - currentGallery.length;
        // const validFiles = files
        //     .filter((file) => file && file.type.startsWith('image/'))
        //     .slice(0, remainingSlots);

        if (files.length > remainingSlots) {
            toast({
                title: `You can add upto ${remainingSlots} images`,
                status: "warning",
                isClosable: true,
                position: 'top',
                variant: "subtle"
            });
            return;
        }

        try {
            // Upload all files first
            const uploadedImages = await Promise.all(
                files.map(file => new Promise((resolve, reject) => {
                    getUrlOfUploadImage(file, resolve, '');
                }))
            );
            console.log(uploadedImages)

            const newGallery = [...currentGallery, ...uploadedImages].slice(0, 6);

            const updatedBlocks = blocks.map((b) =>
                b.id === blockId ? { ...b, gallery: newGallery } : b
            );

            setBlocks(updatedBlocks);

            if (deckDetails?.id) {
                await updateDBValue("travelogues", deckDetails.id, {
                    itinerary_block: updatedBlocks,
                });
            }

            toast({
                title: "Images uploaded successfully",
                status: "success",
                isClosable: true,
                position: 'top',
                variant: "subtle"
            });
        } catch (error) {
            console.error("Image upload failed", error);
            toast({
                title: "Failed to upload images",
                status: "error",
                isClosable: true,
                position: 'top',
                variant: "subtle"
            });
        }

        // Reset input and state
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null);
        setBlockImageEdit({ mode: null, index: null });
        setNote(null);
    };

    const handleCroppedFile = async (croppedFile, note = '') => {
        const { mode, index } = blockImageEdit;

        await getUrlOfUploadImage(croppedFile, async (image) => {
            const updatedBlocks = blocks.map((block) => {
                if (block.id === blockId) {
                    let newGallery = block.gallery ? [...block.gallery] : [];

                    if (mode === "crop" && index != null) {
                        newGallery[index] = image; // Replace at index
                    } else {
                        newGallery.push(image); // Append image
                    }

                    return {
                        ...block,
                        gallery: newGallery
                    };
                }
                return block;
            });

            setBlocks(updatedBlocks);
            await updateDBValue("travelogues", deckDetails.id, {
                itinerary_block: updatedBlocks,
            });
        }, note);

        // Reset
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFile(null);
        setBlockImageEdit({ mode: null, index: null });
        setNote(null);
    };

    const handleCloseCropModal = () => {
        setCropModalOpen(false);
        setSelectedFile(null);
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageUpload = (blockId, mode, index) => {
        setBlockId(blockId);
        if (mode == "crop") {
            setBlockImageEdit({ mode, index })
            const block = blocks.find((b) => b.id == blockId)
            if (index < block?.gallery?.length) {
                setSelectedFile({ isUrl: true, ...block?.gallery[index] })
                setNote(block?.gallery[index]?.caption)
                setCropModalOpen(true)
            }
        } else if (mode == "delete") {
            setBlockImageEdit({ mode, index })
        } else {
            setBlockImageEdit({ mode: null, index: null })
            fileInputRef.current.click();
        }
    }

    const tabs = ["Experiences", "Stays"];
    const tabContent = {
        "Stays": <Stays
            cards={blocks
                .filter((b) => b?.dx_card?.dx_card_type?.name == "album")
                .sort((a, b) => a.order - b.order)
                .map((b) => ({ ...b?.dx_card, date: b?.date, gallery: b?.gallery, blockId: b?.id }))
            }
            isDx={isDx}
            handleRemoveCard={handleRemoveCard}
            handleChangeDate={(id) => {
                setCurrentCardId(id);
                changeDateModal.onOpen();
                setNewDate(blocks.find((block) => block?.dx_card?.id == id)?.date || "");
            }}
            handleSave={handleSave}
            actionItemProps={{
                showActionButton,
                isFooterInView,
                profile,
                onComplete: handleComplete
            }}
            allowImageUpload={isDeckUser && deckDetails?.status == "onTrip"}
            onImageUpload={handleImageUpload}
        />,
        "Experiences": <Experiences
            cards={blocks
                .filter((b) => b?.dx_card?.dx_card_type?.name == "postcard")
                .sort((a, b) => a.order - b.order)
                .map((b) => ({ ...b?.dx_card, date: b?.date, gallery: b?.gallery, blockId: b?.id }))
            }
            isDx={isDx}
            handleRemoveCard={handleRemoveCard}
            handleChangeDate={(id) => {
                setCurrentCardId(id);
                changeDateModal.onOpen();
                setNewDate(blocks.find((block) => block?.dx_card?.id == id)?.date || "");
            }}
            handleSave={handleSave}
            actionItemProps={{
                showActionButton,
                isFooterInView,
                profile,
                onComplete: handleComplete
            }}
            allowImageUpload={isDeckUser && deckDetails?.status == "onTrip"}
            onImageUpload={handleImageUpload}
        />
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update the state only when the footer's intersection status changes
                setIsFooterInView(entry.isIntersecting);
            },
            {
                // Adjust the rootMargin if needed to trigger the event earlier or later
                rootMargin: "0px"
            }
        );

        const footerElement = document.getElementById("AppFooter");
        if (footerElement) {
            observer.observe(footerElement);
        }

        // Clean up the observer on component unmount
        return () => {
            if (footerElement) {
                observer.unobserve(footerElement);
            }
        };
    });

    if (
        !["deckFreeze", "onTrip"].includes(deckDetails?.status) &&
        !(
            ["Admin", "SuperAdmin", "DestinationExpert"].includes(profile?.user_type?.name) &&
            deckDetails?.destination_expert?.user?.id === profile?.id
        )
    ) {
        return <NotPrivileged />;
    }

    return (
        <Flex flexDirection={"column"}>
            <Flex flexDirection={"column"} w={"100%"} mb={["10vw", "3vw"]}>
                <Box p={["5.55vw", "2.083vw"]} borderRadius={["4.167vw", "2.083vw"]} w={"100%"} height={["70vh", "70vh", "85vh"]} position={"relative"}>
                    {!image ?
                        <Box w={"100%"} h={"100%"} bg={"black"} borderRadius={["4.167vw", "2.083vw"]}></Box>
                        : (
                            <Box w={"100%"} h={"100%"} position={"relative"} borderRadius={["4.167vw", "2.083vw"]}>
                                <ChakraNextImage
                                    src={image}
                                    h={"100%"}
                                    objectFit={"cover"}
                                    borderRadius={["4.167vw", "2.083vw"]}
                                    alt="Landing Section Media"
                                    priority={true}
                                    noLazy={true}
                                />
                                <Box w={"100%"} h={"35%"} bottom={0} mt={"auto"} position={"absolute"} borderRadius={["4.167vw", "2.083vw"]} top={0} bg={"linear-gradient(to top, #111111 2%, transparent)"}></Box>
                            </Box>
                        )}

                    <Flex p={["5.55vw", "2.083vw"]} flexDirection={"column"} justifyContent={"flex-end"} zIndex={10} position={"absolute"} top={0} left={0} w={"100%"} h={"100%"}>

                        {/* Desktop */}
                        <Flex display={{ base: "none", sm: "flex" }} flexDirection={"column"} w={"100%"} h={"100%"} py={["9.167vw", "6.25vw"]} px={["8.33vw", "5.83vw"]} justifyContent={"flex-end"}>

                            <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
                                <Text as="h1" fontSize={"5.14vw"} lineHeight={"5.14vw"} fontFamily={"lora"} fontStyle={"italic"} color={"white"} maxW={"60%"} >{"Postcard Deck"}</Text>
                                <Button variant="none" fontSize={"1.6vw"} borderRadius={"2.64vw"} h={"3.96vw"} px={"4.375vw"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>Share Deck</Button>
                            </Flex>

                            <Box w={"100%"} bg={"white"} h={"3px"} mt={"3.61vw"}></Box>

                            <Flex justify={"space-between"}>
                                <Text as="h2" fontSize={"1.875vw"} mt={"2.29vw"} color={"#EFE9E4"} fontFamily={"raleway"} >{deckDetails?.title}</Text>
                                <Text as="h2" fontSize={"1.875vw"} mt={"2.29vw"} textAlign={"right"} color={"#EFE9E4"} fontFamily={"raleway"} >- Curated by <Text as={Link} href={`/destination-experts/${deckDetails?.destination_expert?.user?.slug}`}>{deckDetails?.destination_expert?.name}</Text></Text>
                            </Flex>
                        </Flex>

                        {/* Mobile */}
                        <Flex display={{ base: "flex", sm: "none" }} py={["9.167vw", "6.25vw"]} px={["8.33vw", "5.83vw"]} flexDirection={"column"}>
                            <Text as="h1" fontSize={"9.44vw"} lineHeight={"10.55vw"} fontFamily={"lora"} fontStyle={"italic"} color={"white"} >{"Postcard Deck"}</Text>

                            <Box w={"100%"} bg={"white"} h={"2px"} mt={"8.05vw"}></Box>

                            <Flex justify={"space-between"} flexDirection={"column"}>
                                <Text as="h2" fontSize={"3.61vw"} lineHeight={"4.72vw"} mt={"5.55vw"} color={"#EFE9E4"} fontFamily={"raleway"} >{deckDetails?.title}</Text>
                                <Text as="h2" fontSize={"3.61vw"} textAlign={"right"} lineHeight={"4.72vw"} mt={"5.55vw"} color={"#EFE9E4"} fontFamily={"raleway"} >- Curated by <Text as={Link} href={`/destination-experts/${deckDetails?.destination_expert?.user?.slug}`}>{deckDetails?.destination_expert?.name}</Text></Text>
                            </Flex>

                            <Button variant="none" mt={"7.22vw"} fontSize={"3.33vw"} borderRadius={"5.55vw"} h={"8.33vw"} px={"9.167vw"} w={"fit-content"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>Share Deck</Button>
                        </Flex>

                    </Flex>

                </Box>
            </Flex>

            <Flex w={"100%"} flexDirection="column">
                <Tabs
                    variant={"categoryList"}
                    defaultIndex={selectedTab}
                    index={selectedTab}
                    onChange={(index) => setSelectedTab(index)}
                >
                    <TabList justifyContent={"center"} ml={["5.56vw", "2.22vw"]} mb={10}>
                        {tabs.map(
                            (tab, index) =>
                                tab && (
                                    <Box
                                        key={"tab_data_" + tab}
                                        paddingLeft="1rem"
                                        paddingRight="1rem"
                                    >
                                        <Tab id={index} fontSize={[16, 24]}>{tab}</Tab>
                                    </Box>
                                )
                        )}
                    </TabList>

                    <TabPanels>
                        {tabs.map(
                            (tab, index) => (
                                <TabPanel key={`tab_panel_${index}_${selectedTab}`}>
                                    {/* For re-mount component to reset the filters state */}
                                    {React.cloneElement(tabContent[tab], {
                                        key: `tab_content_${index}_${selectedTab}`
                                    })}
                                </TabPanel>
                            )
                        )}
                    </TabPanels>
                </Tabs>
            </Flex>

            {isDx && (
                <PostcardAlert
                    show={{
                        mode: removeCardModal.isOpen,
                        message: `Are you sure you want to remove this card from the deck?`
                    }}
                    handleAction={async () => {
                        try {
                            const updatedBlocks = blocks.filter(
                                block => block?.dx_card?.id !== currentCardId
                            );
                            await updateDBValue("travelogues", deckDetails?.id, {
                                itinerary_block: updatedBlocks,
                                ...(updatedBlocks?.length == 0 ? { status: "draft" } : {}),
                            });
                            setBlocks(updatedBlocks);
                            removeCardModal.onClose();
                        } catch (error) {
                            console.error('Error removing card:', error);
                        }
                    }}
                    closeAlert={removeCardModal.onClose}
                    buttonText="REMOVE"
                />
            )}

            {/* {isDx && (
                <PostcardModal
                    size="xl"
                    isShow={changeDateModal.isOpen}
                    headerText="Change Date of Card from Postcard Deck"
                    handleClose={changeDateModal.onClose}
                >
                    {currentCardId && <Formik
                        enableReinitialize
                        initialValues={{
                            cardId: currentCardId || "",
                            date: newDate ? new Date(newDate).toISOString().split('T')[0] : ""
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            try {
                                if (!values.date) {
                                    toast({
                                        title: "Please select a date",
                                        status: "warning",
                                        position: "top",
                                        isClosable: true,
                                        variant: "subtle"
                                    });
                                    setSubmitting(false);
                                    return;
                                }
                                const updatedBlocks = blocks.map((block) => {
                                    if (block?.dx_card?.id === currentCardId) {
                                        return {
                                            ...block,
                                            date: new Date(values.date).toISOString()
                                        };
                                    }
                                    return block;
                                }).sort((a, b) => new Date(a.date) - new Date(b.date)).map((block, index) => ({
                                    ...block,
                                    order: index
                                }));

                                await updateDBValue("travelogues", deckDetails?.id, {
                                    itinerary_block: updatedBlocks
                                });

                                setBlocks(updatedBlocks);
                                changeDateModal.onClose();
                            } catch (error) {
                                console.error("Error updating card date:", error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Field name="date">
                                    {({ field, form }) => (
                                        <FormControl mt={4}>
                                            <Flex direction="column" align="center">
                                                <FormLabel textAlign="center" mb={4}>
                                                    Date
                                                </FormLabel>
                                                <Box>
                                                    <Calendar
                                                        date={field.value ? new Date(field.value) : new Date()}
                                                        onChange={(date) => {
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                                            const day = String(date.getDate()).padStart(2, '0');
                                                            const formatted = `${year}-${month}-${day}`;
                                                            form.setFieldValue("date", formatted);
                                                        }}
                                                        color="#3182ce"
                                                    />
                                                </Box>
                                            </Flex>
                                        </FormControl>
                                    )}
                                </Field>

                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" colorScheme="blue" mr={3}>
                                    Submit
                                </Button>
                                <Button onClick={changeDateModal.onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    </Formik>}
                </PostcardModal>
            )} */}

            {isDx && changeDateModal.isOpen && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    bg="rgba(0, 0, 0, 0.4)" // blackish transparent overlay
                    zIndex="1400"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={changeDateModal.onClose} // close on outside click
                >
                    <Box
                        onClick={(e) => e.stopPropagation()} // prevent modal from closing when calendar is clicked
                        boxShadow="md"
                        borderRadius="md"
                        bg="transparent"
                    >
                        <Calendar
                            date={newDate ? new Date(newDate) : new Date()}
                            onChange={async (date) => {
                                try {
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const formatted = `${year}-${month}-${day}`;
                                    setNewDate(formatted);
                                    if (!formatted) {
                                        toast({
                                            title: "Please select a date",
                                            status: "warning",
                                            position: "top",
                                            isClosable: true,
                                            variant: "subtle"
                                        });
                                        return;
                                    }
                                    const updatedBlocks = blocks.map((block) => {
                                        if (block?.dx_card?.id === currentCardId) {
                                            return {
                                                ...block,
                                                date: new Date(formatted).toISOString()
                                            };
                                        }
                                        return block;
                                    }).sort((a, b) => new Date(a.date) - new Date(b.date)).map((block, index) => ({
                                        ...block,
                                        order: index
                                    }));

                                    await updateDBValue("travelogues", deckDetails?.id, {
                                        itinerary_block: updatedBlocks
                                    });

                                    setBlocks(updatedBlocks);
                                } catch (e) {
                                    console.log("Error Changing date: ", e)
                                } finally {
                                    changeDateModal.onClose();
                                }
                            }}
                            color="#3182ce"
                        />
                    </Box>
                </Box>
            )}

            {isDx && (
                <PostcardModal
                    size="xl"
                    isShow={publishModal.isOpen}
                    headerText="Select Postcard Deck Dates"
                    handleClose={publishModal.onClose}
                >
                    <Formik
                        enableReinitialize
                        initialValues={{
                            startDate: "",
                            endDate: "",
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            try {
                                const { startDate, endDate } = values;
                                if (!startDate || !endDate) {
                                    toast({
                                        title: "Both start and end dates are required",
                                        status: "warning",
                                        position: "top",
                                        isClosable: true,
                                        variant: "subtle",
                                    });
                                    setSubmitting(false);
                                    return;
                                }

                                const start = new Date(startDate);
                                const end = new Date(endDate);

                                // Check if all blocks with a valid date fall within the selected range
                                const invalidBlocks = blocks.filter(
                                    block =>
                                        block?.date &&
                                        (new Date(block.date) < start || new Date(block.date) > end)
                                );

                                if (invalidBlocks.length > 0) {
                                    toast({
                                        title: "Some cards in the deck have dates outside the selected range.",
                                        status: "error",
                                        position: "top",
                                        isClosable: true,
                                        variant: "subtle",
                                    });
                                    setSubmitting(false);
                                    return;
                                }
                                // TODO: perform action with values.startDate and values.endDate
                                // console.log("Publishing with:", values);
                                await updateDBValue("travelogues", deckDetails?.id, {
                                    status: "deckFreeze",
                                    startDate: new Date(values.startDate).toISOString(),
                                    endDate: new Date(values.endDate).toISOString(),
                                })
                                setDeckDetails((prev) => ({
                                    ...prev, status: "deckFreeze",
                                    startDate: new Date(values.startDate).toISOString(),
                                    endDate: new Date(values.endDate).toISOString()
                                }));

                                publishModal.onClose();
                            } catch (error) {
                                console.error("Error setting publish dates:", error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                {/* <Field name="startDate">
                                    {({ field }) => (
                                        <FormControl mt={4}>
                                            <FormLabel>Start Date</FormLabel>
                                            <Input {...field} type="date" bg="white" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="endDate">
                                    {({ field }) => (
                                        <FormControl mt={4}>
                                            <FormLabel>End Date</FormLabel>
                                            <Input {...field} type="date" bg="white" />
                                        </FormControl>
                                    )}
                                </Field> */}

                                <Field name="dateRange">
                                    {({ form }) => (
                                        <FormControl mt={4}>
                                            <Flex direction="column" align="center">
                                                <FormLabel textAlign="center" mb={4}>
                                                    Select Date Range
                                                </FormLabel>
                                                <Box>
                                                    <DateRange
                                                        ranges={[
                                                            {
                                                                startDate: form.values.startDate
                                                                    ? new Date(form.values.startDate)
                                                                    : new Date(),
                                                                endDate: form.values.endDate
                                                                    ? new Date(form.values.endDate)
                                                                    : new Date(),
                                                                key: 'selection',
                                                            },
                                                        ]}
                                                        onChange={(ranges) => {
                                                            const { startDate, endDate } = ranges.selection;
                                                            const toFormatted = (d) => {
                                                                const year = d.getFullYear();
                                                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                                                const day = String(d.getDate()).padStart(2, '0');
                                                                return `${year}-${month}-${day}`;
                                                            };

                                                            form.setFieldValue(
                                                                'startDate',
                                                                startDate ? toFormatted(startDate) : ''
                                                            );
                                                            form.setFieldValue(
                                                                'endDate',
                                                                endDate ? toFormatted(endDate) : ''
                                                            );
                                                        }}
                                                        moveRangeOnFirstSelection={false}
                                                        color="#3182ce"
                                                        editableDateInputs={true}
                                                    />
                                                </Box>
                                            </Flex>
                                        </FormControl>
                                    )}
                                </Field>

                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" colorScheme="blue" mr={3}>
                                    Submit
                                </Button>
                                <Button onClick={publishModal.onClose}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </Formik>
                </PostcardModal>
            )
            }

            {isDeckUser && (
                <>
                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {/* Crop Modal */}
                    {cropModalOpen && selectedFile && (
                        <StaticImageCropModal
                            aspectRatio={5 / 6}
                            file={selectedFile}
                            isOpen={cropModalOpen}
                            onClose={handleCloseCropModal}
                            onCropComplete={handleCroppedFile}
                            note={note}
                            setNote={setNote}
                        />
                    )}
                </>
            )}

            {isDeckUser && (
                <PostcardAlert
                    show={{
                        mode: blockImageEdit?.mode == "delete",
                        message: `Are you sure you want to remove this image from the card gallery?`
                    }}
                    handleAction={async () => {
                        try {
                            const { index } = blockImageEdit;

                            const updatedBlocks = blocks.map((block) => {
                                if (block.id === blockId) {
                                    let newGallery = [...(block.gallery || [])];
                                    if (index != null) {
                                        newGallery.splice(index, 1);
                                    }
                                    return {
                                        ...block,
                                        gallery: newGallery
                                    };
                                }
                                return block;
                            });

                            await updateDBValue("travelogues", deckDetails.id, {
                                itinerary_block: updatedBlocks,
                            });
                            setBlocks(updatedBlocks);

                            setBlockImageEdit({ mode: null, index: null })
                        } catch (error) {
                            console.error('Error removing card:', error);
                        }
                    }}
                    closeAlert={() => {
                        setBlockImageEdit({ mode: null, index: null })
                    }}
                    buttonText="REMOVE"
                />
            )}

        </Flex >
    )
}

export default TravelLoguePage