import {
    Box, Button, Flex, FormControl, FormLabel, Input, Link, ModalBody, ModalFooter,
    Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue, useDisclosure, useToast
} from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useRef, useState, useMemo } from 'react'
import { ChakraNextImage } from '../../../src/patterns/ChakraNextImage'
import { createDBEntry, fetchPaginatedResults, updateDBValue } from '../../../src/queries/strapiQueries'
import Experiences from '../../../src/features/TravelLog/Experiences'
import Stays from '../../../src/features/TravelLog/Stays'
import AppContext from '../AppContext'
import PostcardAlert from '../PostcardAlert'
import PostcardModal from '../PostcardModal'
import { Field, Form, Formik } from 'formik'
import NotPrivileged from '../../patterns/NotPrivileged'
import StaticImageCropModal from '../../patterns/ImageCropModal/StaticImageCropModal'
import { getUrlOfUploadImage } from '../../services/utilities'
import { Calendar, DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import Restaurants from './Restaurants'
import loadImage from 'blueimp-load-image'

// Constants
const MAX_IMAGES_PER_BLOCK = 6
const TABS = ["Experiences", "Stays", "Restaurants"]
const CARD_TYPES = {
    ALBUM: "album",
    POSTCARD: "postcard",
    RESTAURANT: "restaurant"
}

// Custom hooks
const useIntersectionObserver = (targetId, options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(true)


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { rootMargin: "0px", ...options }
        )

        const element = document.getElementById(targetId)
        if (element) {
            observer.observe(element)
            return () => observer.unobserve(element)
        }
    }, [targetId, options])

    return isIntersecting
}

// Utility functions
const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const sortBlocksByDate = (blocks) =>
    [...blocks].sort((a, b) => new Date(a.date) - new Date(b.date))

const reorderBlocks = (blocks) =>
    sortBlocksByDate(blocks).map((block, index) => ({ ...block, order: index }))

// Component
const TravelLoguePage = ({ deckDetails: defaultDeckDetails, blocks: defaultBlocks }) => {
    const { profile } = useContext(AppContext)
    const [deckDetails, setDeckDetails] = useState(defaultDeckDetails || {})
    const [blocks, setBlocks] = useState(defaultBlocks || [])
    const [currentCardId, setCurrentCardId] = useState(null)
    const [blockId, setBlockId] = useState(null)
    const [note, setNote] = useState('')
    const [blockImageEdit, setBlockImageEdit] = useState({ mode: null, index: null })
    const [newDate, setNewDate] = useState(null)
    const [selectedTab, setSelectedTab] = useState(0)
    const [cropModalOpen, setCropModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const isMobile = useBreakpointValue({ base: true, md: false })
    const isFooterInView = useIntersectionObserver("AppFooter")
    const toast = useToast()
    const fileInputRef = useRef()
    const [dxCardMemory,setDxCardMemory] = useState(null);

    // Modals
    const removeCardModal = useDisclosure()
    const changeDateModal = useDisclosure()
    const publishModal = useDisclosure()

    // Memoized computed values
    const { isDx, isDeckUser, showActionButton } = useMemo(() => ({
        isDx: profile && deckDetails?.destination_expert?.user?.id === profile?.id,
        isDeckUser: profile && deckDetails?.user?.id === profile?.id,
        showActionButton: profile && deckDetails?.status === "deckBuild" && deckDetails?.destination_expert?.user?.id === profile?.id
    }), [deckDetails, profile])

    const filteredBlocks = useMemo(() => ({
        experiences: blocks
            .filter(b => b?.dx_card?.dx_card_type?.name === CARD_TYPES.POSTCARD)
            .sort((a, b) => a.order - b.order)
            .map(b => ({ ...b?.dx_card, date: b?.date, gallery: b?.gallery, blockId: b?.id })),
        stays: blocks
            .filter(b => b?.dx_card?.dx_card_type?.name === CARD_TYPES.ALBUM)
            .sort((a, b) => a.order - b.order)
            .map(b => ({ ...b?.dx_card, date: b?.date, gallery: b?.gallery, blockId: b?.id })),
        restaurants: blocks
            .filter(b => b?.dx_card?.dx_card_type?.name === CARD_TYPES.RESTAURANT)
            .sort((a, b) => a.order - b.order)
            .map(b => ({ ...b?.dx_card, date: b?.date, gallery: b?.gallery, blockId: b?.id }))
    }), [blocks])

    const allowImageUpload = isDeckUser && deckDetails?.status === "onTrip"


    // Toast configurations
    const showToast = useCallback((title, status = 'info', variant = 'subtle') => {
        toast({ title, status, isClosable: true, position: 'top', variant })
    }, [toast])

    const fixImageOrientation = (file) => {
        return new Promise((resolve, reject) => {
            loadImage(
                file,
                (canvas) => {
                    if (canvas.type === "error") {
                        reject("Failed to fix orientation")
                    } else {
                        canvas.toBlob((blob) => {
                            const correctedFile = new File([blob], file.name, {
                                type: blob.type,
                                lastModified: Date.now(),
                            })
                            resolve(correctedFile)
                        }, file.type)
                    }
                },
                { orientation: true, canvas: true }
            )
        })
    }

    // File upload handlers
    const handleFileChange = useCallback(async (e) => {

        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const block = blocks.find(b => b.id === blockId)
        if (!block) return

        const currentGallery = block.gallery ? [...block.gallery] : []
        const remainingSlots = MAX_IMAGES_PER_BLOCK - currentGallery.length

        if (files.length > remainingSlots) {
            showToast(`You can add up to ${remainingSlots} images`, 'warning')
            return
        }

        const loadingGallery = [
            ...currentGallery,
            ...Array.from({ length: files.length }, () => ({ isLoading: true }))
        ].slice(0, MAX_IMAGES_PER_BLOCK)

        setBlocks((prevBlocks) => prevBlocks.map(b =>
            b.id === blockId ? { ...b, gallery: loadingGallery } : b
        ))

        try {
            // Step 1: Fix orientation of each image
            const correctedFiles = await Promise.all(
                files.map(file => fixImageOrientation(file))
            )

            // Step 2: Upload images using corrected files
            const uploadedImages = await Promise.all(
                correctedFiles.map(file =>
                    new Promise(resolve => {
                        getUrlOfUploadImage(file, resolve, '')
                    })
                )
            )

            const newGallery = [...currentGallery, ...uploadedImages].slice(0, MAX_IMAGES_PER_BLOCK)

            setBlocks((prevBlocks) => {
                const updatedBlocks = prevBlocks.map(b =>
                    b.id === blockId ? { ...b, gallery: newGallery } : b
                )

                // Save to DB here using updatedBlocks
                if (deckDetails?.id) {
                    updateDBValue("travelogues", deckDetails.id, {
                        itinerary_block: updatedBlocks,
                    });
                    if (dxCardMemory?.id) updateDBValue("memories", dxCardMemory?.id, { gallery: newGallery });
                }

                return updatedBlocks
            })

            showToast("Images uploaded successfully", 'success')
        } catch (error) {
            console.error("Image upload failed", error)
            showToast("Failed to upload images", 'error')
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ''
            setSelectedFile(null)
            setBlockImageEdit({ mode: null, index: null })
            setNote('')
        }
    }, [blocks, blockId, deckDetails?.id, showToast])

    const handleCroppedFile = useCallback(async (croppedFile, note = '') => {
        const { mode, index } = blockImageEdit;

        // Step 1: Set loading placeholder using prevBlocks
        setBlocks(prevBlocks => {
            const updated = prevBlocks.map(block => {
                if (block.id === blockId) {
                    let newGallery = block.gallery ? [...block.gallery] : []
                    const loadingPlaceholder = { isLoading: true }

                    if (mode === "crop" && index != null) {
                        newGallery[index] = loadingPlaceholder
                    } else {
                        newGallery.push(loadingPlaceholder)
                    }

                    return { ...block, gallery: newGallery }
                }
                return block
            })

            return updated
        })

        // Step 2: Upload image and replace loading placeholder
        await getUrlOfUploadImage(croppedFile, async (image) => {
            setBlocks(prevBlocks => {
                const updated = prevBlocks.map(block => {
                    if (block.id === blockId) {
                        let newGallery = block.gallery ? [...block.gallery] : []

                        if (mode === "crop" && index != null) {
                            newGallery[index] = image
                        } else {
                            const firstLoadingIndex = newGallery.findIndex(img => img?.isLoading)
                            if (firstLoadingIndex !== -1) {
                                newGallery[firstLoadingIndex] = image
                            } else {
                                newGallery.push(image)
                            }
                        }

                          if (dxCardMemory?.id) updateDBValue("memories", dxCardMemory?.id, { gallery: newGallery });
                        return { ...block, gallery: newGallery }
                    }
                    return block
                })

                // Also persist to DB after state update
                if (deckDetails?.id) {
                    updateDBValue("travelogues", deckDetails.id, {
                        itinerary_block: updated,
                    })

                }

                return updated
            })
        }, note)

        // Step 3: Reset state
        if (fileInputRef.current) fileInputRef.current.value = ''
        setSelectedFile(null)
        setBlockImageEdit({ mode: null, index: null })
        setNote('')
    }, [blockImageEdit, blockId, deckDetails?.id])

    // Action handlers
    const handleRemoveCard = useCallback((id) => {
        removeCardModal.onOpen()
        setCurrentCardId(id)
    }, [removeCardModal])

    const handleShareClick = useCallback(() => {
        const currentUrl = window.location.href

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
        } else {
            navigator.clipboard.writeText(currentUrl)
                .then(() => showToast('URL Copied', 'success'))
                .catch(err => console.error('Error copying URL:', err))
        }
    }, [isMobile, showToast])

    const handleSave = useCallback(async (tabBlocks) => {
        try {
            const updatedOrderMap = new Map(
                tabBlocks.map((block, index) => [block.id, index])
            )

            const updatedBlocks = blocks.map(block => {
                if (updatedOrderMap.has(block.dx_card?.id)) {
                    return { ...block, order: updatedOrderMap.get(block.dx_card.id) }
                }
                return block
            })

            if (deckDetails?.id) {
                await updateDBValue("travelogues", deckDetails.id, {
                    itinerary_block: updatedBlocks,
                })
                showToast("Postcard Deck saved successfully", 'success')
            }

            setBlocks(updatedBlocks)
        } catch (error) {
            console.error("Failed to save reordered blocks:", error)
        }
    }, [blocks, deckDetails?.id, showToast])

    const handleComplete = useCallback(async () => {
        try {
            // const allDatesAvailable = blocks.every(block => block.date)
            // if (!allDatesAvailable) {
            //     showToast("Please ensure all cards have a date before publishing the deck.", 'warning')
            //     return
            // }
            const typeTabMap = {
                "album": "Stays",
                "postcard": "Experiences",
                "restaurant": "Restaurant"
            }
            const missingDateBlock = blocks.find((block) => !block?.date);

            if (missingDateBlock) {
                const cardType = missingDateBlock?.dx_card?.dx_card_type?.name || 'a card';
                showToast(`Please ensure all the cards in ${typeTabMap[cardType]} has a date before publishing the deck.`, 'warning');
                return;
            }

            publishModal.onOpen()
        } catch (error) {
            console.error("Error completing travelogue:", error)
        }
    }, [blocks, publishModal, showToast])

    const handleChangeDate = useCallback((id) => {
        setCurrentCardId(id)
        changeDateModal.onOpen()
        setNewDate(blocks.find(block => block?.dx_card?.id === id)?.date || "")
    }, [blocks, changeDateModal])
    const fetchMemoryDetails = async (blockId) => {
        const dxCardBloc = blocks.find(b => b.id === blockId);
        if (dxCardBloc && dxCardBloc?.dx_card) {
            let dxCardMem = await fetchPaginatedResults("memories", { dx_card: dxCardBloc?.dx_card?.id, user: profile?.id }, {});
            if (Array.isArray(dxCardMem) ? dxCardMem.length > 0 : dxCardMem) {
                setDxCardMemory(Array.isArray(dxCardMem) ? dxCardMem[0] : dxCardMem);
            } else {
                await createDBEntry("memories",
                    {
                        dx_card: dxCardBloc?.dx_card?.id,
                        name: dxCardBloc?.dx_card?.name,
                        country: dxCardBloc?.dx_card?.country?.id,
                        region: dxCardBloc?.dx_card?.region?.id,
                        user: profile?.id,
                        date: new Date()
                    });
                fetchMemoryDetails(blockId);
            }

        }


    }

    const handleImageUpload = useCallback((blockId, mode, index) => {

       if(!dxCardMemory) fetchMemoryDetails(blockId);
        setBlockId(blockId)

        if (mode === "crop") {
            setBlockImageEdit({ mode, index })
            const block = blocks.find(b => b.id === blockId)
            if (index < block?.gallery?.length) {
                setSelectedFile({ isUrl: true, ...block?.gallery[index] })
                setNote(block?.gallery[index]?.caption || '')
                setCropModalOpen(true)
            }
        } else if (mode === "delete") {
            setBlockImageEdit({ mode, index })
        } else {
            setBlockImageEdit({ mode: null, index: null })
            fileInputRef.current?.click()
        }
    }, [blocks])

    // Date change handler
    const handleDateChange = useCallback(async (date) => {
        try {
            const formatted = formatDate(date)
            setNewDate(formatted)

            if (!formatted) {
                showToast("Please select a date", 'warning')
                return
            }

            const updatedBlocks = blocks.map(block => {
                if (block?.dx_card?.id === currentCardId) {
                    return { ...block, date: new Date(formatted).toISOString() }
                }
                return block
            })

            const reorderedBlocks = reorderBlocks(updatedBlocks)

            await updateDBValue("travelogues", deckDetails?.id, {
                itinerary_block: reorderedBlocks
            })

            setBlocks(reorderedBlocks)
        } catch (error) {
            console.error("Error changing date: ", error)
        } finally {
            changeDateModal.onClose()
        }
    }, [blocks, currentCardId, deckDetails?.id, changeDateModal, showToast])

    // Tab content configuration
    const tabContent = useMemo(() => {
        const commonProps = {
            isDx,
            handleRemoveCard,
            handleChangeDate,
            handleSave,
            actionItemProps: {
                showActionButton,
                isFooterInView,
                profile,
                onComplete: handleComplete
            },
            allowImageUpload,
            onImageUpload: handleImageUpload,
        }

        return {
            "Stays": <Stays setDxCardMemory={setDxCardMemory} cards={filteredBlocks.stays} {...commonProps} />,
            "Experiences": <Experiences setDxCardMemory={setDxCardMemory} cards={filteredBlocks.experiences} {...commonProps} />,
            "Restaurants": <Restaurants setDxCardMemory={setDxCardMemory} cards={filteredBlocks.restaurants} {...commonProps} />
        }
    }, [
        filteredBlocks, isDx, handleRemoveCard, handleChangeDate, handleSave,
        showActionButton, isFooterInView, profile, handleComplete,
        allowImageUpload, handleImageUpload
    ])

    // Access control check
    if (
        !["deckFreeze", "onTrip"].includes(deckDetails?.status) &&
        !(
            ["Admin", "SuperAdmin", "DestinationExpert"].includes(profile?.user_type?.name) &&
            deckDetails?.destination_expert?.user?.id === profile?.id
        )
    ) {
        return <NotPrivileged />
    }
    const commonProps = {
            isDx,
            handleRemoveCard,
            handleChangeDate,
            handleSave,
            actionItemProps: {
                showActionButton,
                isFooterInView,
                profile,
                onComplete: handleComplete
            },
            allowImageUpload,
            onImageUpload: handleImageUpload,
        }
    return (
        <Flex flexDirection="column">
            {/* Hero Section */}
            <Flex flexDirection="column" w="100%" mb={["10vw", "3vw"]}>
                <Box
                    p={["5.55vw", "2.083vw"]}
                    borderRadius={["4.167vw", "2.083vw"]}
                    w="100%"
                    height={["70vh", "70vh", "85vh"]}
                    position="relative"
                >
                    <Box
                        w="100%"
                        h="100%"
                        bg="black"
                        borderRadius={["4.167vw", "2.083vw"]}
                    />

                    <Flex
                        p={["5.55vw", "2.083vw"]}
                        flexDirection="column"
                        justifyContent="flex-end"
                        zIndex={10}
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                    >
                        {/* Desktop Header */}
                        <Flex
                            display={{ base: "none", sm: "flex" }}
                            flexDirection="column"
                            w="100%"
                            h="100%"
                            py={["9.167vw", "6.25vw"]}
                            px={["8.33vw", "5.83vw"]}
                            justifyContent="flex-end"
                        >
                            <Flex alignItems="flex-end" justifyContent="space-between">
                                <Text
                                    as="h1"
                                    fontSize="5.14vw"
                                    lineHeight="5.14vw"
                                    fontFamily="lora"
                                    fontStyle="italic"
                                    color="white"
                                    maxW="60%"
                                >
                                    Postcard Deck
                                </Text>
                                <Button
                                    variant="none"
                                    fontSize="1.6vw"
                                    borderRadius="2.64vw"
                                    h="3.96vw"
                                    px="4.375vw"
                                    border="2px"
                                    borderColor="white"
                                    color="white"
                                    fontFamily="raleway"
                                    fontWeight={500}
                                    _hover={{ bg: "white", color: "#111111" }}
                                    onClick={handleShareClick}
                                >
                                    Share Deck
                                </Button>
                            </Flex>

                            <Box w="100%" bg="white" h="3px" mt="3.61vw" />

                            <Flex justify="space-between">
                                <Text
                                    as="h2"
                                    fontSize="1.875vw"
                                    mt="2.29vw"
                                    color="#EFE9E4"
                                    fontFamily="raleway"
                                >
                                    {deckDetails?.title}
                                </Text>
                                <Text
                                    as="h2"
                                    fontSize="1.875vw"
                                    mt="2.29vw"
                                    textAlign="right"
                                    color="#EFE9E4"
                                    fontFamily="raleway"
                                >
                                    - Curated by{' '}
                                    <Text
                                        as={Link}
                                        href={`/destination-experts/${deckDetails?.destination_expert?.user?.slug}`}
                                    >
                                        {deckDetails?.destination_expert?.name}
                                    </Text>
                                </Text>
                            </Flex>
                        </Flex>

                        {/* Mobile Header */}
                        <Flex
                            display={{ base: "flex", sm: "none" }}
                            py={["9.167vw", "6.25vw"]}
                            px={["8.33vw", "5.83vw"]}
                            flexDirection="column"
                        >
                            <Text
                                as="h1"
                                fontSize="9.44vw"
                                lineHeight="10.55vw"
                                fontFamily="lora"
                                fontStyle="italic"
                                color="white"
                            >
                                Postcard Deck
                            </Text>

                            <Box w="100%" bg="white" h="2px" mt="8.05vw" />

                            <Flex justify="space-between" flexDirection="column">
                                <Text
                                    as="h2"
                                    fontSize="3.61vw"
                                    lineHeight="4.72vw"
                                    mt="5.55vw"
                                    color="#EFE9E4"
                                    fontFamily="raleway"
                                >
                                    {deckDetails?.title}
                                </Text>
                                <Text
                                    as="h2"
                                    fontSize="3.61vw"
                                    textAlign="right"
                                    lineHeight="4.72vw"
                                    mt="5.55vw"
                                    color="#EFE9E4"
                                    fontFamily="raleway"
                                >
                                    - Curated by{' '}
                                    <Text
                                        as={Link}
                                        href={`/destination-experts/${deckDetails?.destination_expert?.user?.slug}`}
                                    >
                                        {deckDetails?.destination_expert?.name}
                                    </Text>
                                </Text>
                            </Flex>

                            <Button
                                variant="none"
                                mt="7.22vw"
                                fontSize="3.33vw"
                                borderRadius="5.55vw"
                                h="8.33vw"
                                px="9.167vw"
                                w="fit-content"
                                border="2px"
                                borderColor="white"
                                color="white"
                                fontFamily="raleway"
                                fontWeight={500}
                                _hover={{ bg: "white", color: "#111111" }}
                                onClick={handleShareClick}
                            >
                                Share Deck
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>

            {/* Tabs Section */}
            <Flex w="100%" flexDirection="column">
                <Experiences setDxCardMemory={setDxCardMemory} cards={filteredBlocks.experiences} {...commonProps}/>
                {/* <Tabs
                    variant="categoryList"
                    defaultIndex={selectedTab}
                    index={selectedTab}
                    onChange={setSelectedTab}
                >
                    <TabList justifyContent="center" ml={["5.56vw", "2.22vw"]} mb={10}>
                        {TABS.map((tab, index) => (
                            <Box
                                key={`tab_${tab}`}
                                paddingLeft="1rem"
                                paddingRight="1rem"
                            >
                                <Tab id={index} fontSize={[16, 24]}>
                                    {tab}
                                </Tab>
                            </Box>
                        ))}
                    </TabList>

                    <TabPanels>
                        {TABS.map((tab, index) => (
                            <TabPanel key={`tab_panel_${index}_${selectedTab}`}>
                                {React.cloneElement(tabContent[tab], {
                                    key: `tab_content_${index}_${selectedTab}`
                                })}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs> */}
            </Flex>

            {/* Modals and Alerts */}
            {isDx && (
                <PostcardModal
                    size="md"
                    isShow={changeDateModal.isOpen}
                    headerText="Select Date"
                    handleClose={changeDateModal.onClose}
                    ModalContentW={"100vw"}
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
                            <ModalBody pb={[2, 4]}>
                                <Field name="date">
                                    {({ field, form }) => (
                                        <FormControl mt={2}>
                                            <Flex direction="column" align="center">
                                                {/* <FormLabel textAlign="center" mb={4}>
                                                    Date
                                                </FormLabel> */}
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
            )}

            {/* Date Change Modal */}
            {isDx && changeDateModal.isOpen && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    bg="rgba(0, 0, 0, 0.4)"
                    zIndex="1400"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={changeDateModal.onClose}
                >
                    <Box
                        onClick={e => e.stopPropagation()}
                        boxShadow="md"
                        borderRadius="md"
                        bg="transparent"
                    >
                        <Calendar
                            date={newDate ? new Date(newDate) : new Date()}
                            onChange={handleDateChange}
                            color="#3182ce"
                        />
                    </Box>
                </Box>
            )}

            {/* Publish Modal */}
            {isDx && (
                <PostcardModal
                    size="xl"
                    isShow={publishModal.isOpen}
                    headerText="Select Postcard Deck Dates"
                    handleClose={publishModal.onClose}
                >
                    <Formik
                        enableReinitialize
                        initialValues={{ startDate: "", endDate: "" }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true)
                            try {
                                const { startDate, endDate } = values
                                if (!startDate || !endDate) {
                                    showToast("Both start and end dates are required", 'warning')
                                    return
                                }

                                const start = new Date(startDate)
                                const end = new Date(endDate)

                                const invalidBlocks = blocks.filter(
                                    block =>
                                        block?.date &&
                                        (new Date(block.date) < start || new Date(block.date) > end)
                                )

                                if (invalidBlocks.length > 0) {
                                    showToast("Some cards in the deck have dates outside the selected range.", 'error')
                                    return
                                }

                                await updateDBValue("travelogues", deckDetails?.id, {
                                    status: "deckFreeze",
                                    startDate: new Date(startDate).toISOString(),
                                    endDate: new Date(endDate).toISOString(),
                                })

                                setDeckDetails(prev => ({
                                    ...prev,
                                    status: "deckFreeze",
                                    startDate: new Date(startDate).toISOString(),
                                    endDate: new Date(endDate).toISOString()
                                }))

                                publishModal.onClose()
                            } catch (error) {
                                console.error("Error setting publish dates:", error)
                            } finally {
                                setSubmitting(false)
                            }
                        }}
                    >
                        <Form>
                            <ModalBody pb={6}>
                                <Field name="dateRange">
                                    {({ form }) => (
                                        <FormControl mt={4}>
                                            <Flex direction="column" align="center">
                                                <FormLabel textAlign="center" mb={4}>
                                                    Select Date Range
                                                </FormLabel>
                                                <Box>
                                                    <DateRange
                                                        ranges={[{
                                                            startDate: form.values.startDate
                                                                ? new Date(form.values.startDate)
                                                                : new Date(),
                                                            endDate: form.values.endDate
                                                                ? new Date(form.values.endDate)
                                                                : new Date(),
                                                            key: 'selection',
                                                        }]}
                                                        onChange={(ranges) => {
                                                            const { startDate, endDate } = ranges.selection
                                                            form.setFieldValue('startDate', startDate ? formatDate(startDate) : '')
                                                            form.setFieldValue('endDate', endDate ? formatDate(endDate) : '')
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
            )}

            {/* File Input and Crop Modal */}
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
                    {cropModalOpen && selectedFile && (
                        <StaticImageCropModal
                            aspectRatio={5 / 6}
                            file={selectedFile}
                            isOpen={cropModalOpen}
                            onClose={() => {
                                setCropModalOpen(false)
                                setSelectedFile(null)
                                if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            onCropComplete={handleCroppedFile}
                            note={note}
                            setNote={setNote}
                        />
                    )}
                </>
            )}

            {/* Image Delete Alert */}
            {isDeckUser && (
                <PostcardAlert
                    show={{
                        mode: blockImageEdit?.mode === "delete",
                        message: "Are you sure you want to remove this image from the card gallery?"
                    }}
                    handleAction={async () => {
                        try {
                            const { index } = blockImageEdit
                            const updatedBlocks = blocks.map(block => {
                                if (block.id === blockId) {
                                    let newGallery = [...(block.gallery || [])]
                                    if (index != null) {
                                        newGallery.splice(index, 1)
                                    }
                                      if (dxCardMemory?.id) updateDBValue("memories", dxCardMemory?.id, { gallery: newGallery });
                                    return { ...block, gallery: newGallery }
                                }
                                return block
                            })

                            await updateDBValue("travelogues", deckDetails.id, {
                                itinerary_block: updatedBlocks,
                            })

                            setBlocks(updatedBlocks)
                            setBlockImageEdit({ mode: null, index: null })
                        } catch (error) {
                            console.error('Error removing image:', error)
                        }
                    }}
                    closeAlert={() => setBlockImageEdit({ mode: null, index: null })}
                    buttonText="REMOVE"
                />
            )}
        </Flex>
    )
}

export default TravelLoguePage