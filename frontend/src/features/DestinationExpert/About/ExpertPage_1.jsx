import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FormControl, FormLabel, Grid, GridItem, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { ChakraNextImage } from '../../../patterns/ChakraNextImage'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'
import DxAbout from './DxAbout';
import DxExperiences from '../Experiences/DxExperiences';
import DxStays from '../Stays/DxStays';
import AppContext from '../../AppContext';
import { useRouter } from 'next/router';
import RouteFilterExps from '../Filters/RouteFilterExps';
import DxRestaurants from '../Restaurants/DxRestaurants';
import { motion } from 'framer-motion';
import LoadingGif from '../../../patterns/LoadingGif';
import RenderMarkdown from '../../../patterns/RenderMarkdown';
import PostcardModal from '../../PostcardModal';
import { Field, Form, Formik } from 'formik';
import { fetchPaginatedResults, updateDBValue } from '../../../queries/strapiQueries';
import CreateEditTravelogue from '../../PostcardDeck/CreateEditTravelogue';
import { create } from 'lodash';
import PostcardAlert from '../../PostcardAlert';

const MotionBox = motion(Box);

const ExpertPage = ({ data, expertData, triggerRevalidation, showActionButton, isFooterInView, editMode, setEditMode, formikRef, handleSubmit }) => {
    const { profile } = useContext(AppContext)
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [isChecked, setIsChecked] = React.useState(true);
    const [firstLoad, setFirstLoad] = React.useState(true)
    const [aiInfo, setAiInfo] = React.useState(null);
    const [currentCardId, setCurrentCardId] = React.useState(null);
    const [selectedCards, setSelectedCards] = React.useState({});
    const [decks, setDecks] = React.useState([]);
    const [selectedDeck, setSelectedDeck] = React.useState(null);
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: AddCardIsOpen, onOpen: AddCardOnOpen, onClose: AddCardOnClose } = useDisclosure();
    const { isOpen: RemoveCardIsOpen, onOpen: RemoveCardOnOpen, onClose: RemoveCardOnClose } = useDisclosure();
    const { isOpen: createDeckIsOpen, onOpen: createDeckOnOpen, onClose: createDeckonClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const tabs = ["Experiences", "Stays", "Restaurants", "About"]
    const hasAccess = ["Admin", "SuperAdmin", "EditorInChief"].includes(profile?.user_type?.name) || data?.user?.id == profile?.id
    const isDx = data?.user?.id == profile?.id // pass as prop
    const switchFilter = () => {
        setIsChecked((prev) => !prev)
    }

    const firstTab = tabs[0];
    const commonProps = {
        data,
        hasAccess,
        expertData,
        showFilter: isChecked,
        switchFilter,
        triggerRevalidation,
        openAiDetails,
        isDx,
        canSelect: isDx && selectedDeck ? true : false,
        AddCardOnOpen: (id) => { AddCardOnOpen(); setCurrentCardId(id) },
        RemoveCardOnOpen: (id) => { RemoveCardOnOpen(); setCurrentCardId(id) },
        selectedCards
    };
    const tabContent = {
        "About": <DxAbout data={data} showActionButton={showActionButton} isFooterInView={isFooterInView} editMode={editMode} setEditMode={setEditMode} formikRef={formikRef} handleSubmit={handleSubmit} />,
        "Stays": <DxStays {...commonProps} {...(firstTab === "Stays" && { firstLoad, setFirstLoad })} />,
        "Experiences": <DxExperiences {...commonProps} {...(firstTab === "Experiences" && { firstLoad, setFirstLoad })} />,
        "Restaurants": <DxRestaurants {...commonProps} {...(firstTab === "Restaurants" && { firstLoad, setFirstLoad })} />,
    }

    async function fetchDxCardDataFromAI(dxcardId) {
        setAiInfo((prev) => ({ ...prev, loading: true }))
        const res = await fetch(`/api/dxcard/details/${dxcardId}`)
        if (!res.ok) throw new Error('Failed to fetch postcard details')
        const data = await res.json()
        console.log(data)
        setAiInfo((prev) => ({ ...prev, loading: false, message: data?.detailedInfo }))
    }

    function openAiDetails(dxcardId, title) {
        onOpen()
        fetchDxCardDataFromAI(dxcardId)
        setAiInfo((prev) => ({ ...prev, title }))
    }

    const modalClose = () => {
        onClose()
        setAiInfo((prev) => ({ ...prev, loading: false, title: '', message: '' }))
    }

    const fetchDxDecks = () => {
        fetchPaginatedResults(
            "travelogues",
            {
                destination_expert: { user: { id: profile.id } },
                status: { $not: "completed" }
            },
            {
                destination_expert: {
                    fields: ['id', 'name', 'slug'],
                },
                user: {
                    fields: ['id', 'fullName', 'username', "email", 'slug',],
                }
            },
            undefined
        ).then((response) => {
            const data = Array.isArray(response) ? response : [response];
            setDecks(data);
        });
    };

    const fetchSelectedCards = async (deckId) => {
        const deck = await fetchPaginatedResults("travelogues", { id: deckId }, {
            itinerary_block: {
                fields: ["order", "date"],
                populate: {
                    dx_card: {
                        fields: ['id', 'name'],
                    }
                }
            },
        })
        if (deck || deck?.length > 0) {
            const blocks = deck?.itinerary_block || [];

            const cardMap = blocks.reduce((acc, block) => {
                const cardId = block?.dx_card?.id;
                const date = block?.date;
                if (cardId) {
                    acc[cardId] = date;
                }
                return acc;
            }, {});
            setSelectedCards(cardMap);
        } else {
            setSelectedCards({});
        }
    }

    useEffect(() => { isDx && fetchDxDecks() }, [isDx]);

    return (
        <>
            <Box
                w={"100%"}
                minH={["181.11vw", "50.4vw"]}
                px={["5.56vw", "2.22vw"]}
                mt={["6.94vw", "2.22vw"]}
                mb={["15.55vw", "5vw"]}
            // bg="#EFE9E4"
            >
                {/* <Button onClick={() => openAiDetails()}>Open</Button> */}
                <Box
                    w={"100%"}
                    h={"100%"}
                    bg={"#111111"}
                    borderRadius={["4.167vw", "2.08vw"]}
                    position="relative"
                >
                    <ChakraNextImage
                        borderTopRadius={["4.167vw", "2.08vw"]}
                        noLazy={true}
                        priority
                        src={data?.coverImage?.url}
                        // src={"https://images.postcard.travel/postcardv2/IMG_7498_e73766238e.png"}
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        objectFit="cover"
                        alt={`${data?.user?.fullName} coverImage`}
                    />

                    <Box
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        position={"absolute"}
                        top={0}
                        left={0}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        // bg={"rgba(0,0,0,0.4)"}
                        bgGradient="linear(to-t, #111111 2%, transparent 50%)"
                        borderTopRadius={["4.167vw", "2.08vw"]}
                    >
                        <Flex
                            w={"100%"}
                            h={"100%"}
                            flexDirection={"column"}
                            justify={"flex-end"}
                            borderRadius={["4.167vw", "2.08vw"]}
                        >
                            <Flex
                                display={{ base: "none", sm: "flex" }}
                                // h={"14.1vw"}
                                // mt={"17.8vw"}
                                flexDirection={"column"}
                                gap={"1vw"}
                            >
                                <Text
                                    maxW={"55.76vw"}
                                    fontSize={"5vw"}
                                    lineHeight={"4.72vw"}
                                    color={"white"}
                                    fontFamily={"lora"}
                                    fontStyle={"italic"}
                                >
                                    {data?.name}
                                </Text>
                                <Text
                                    maxW={"55.76vw"}
                                    fontSize={"4.58vw"}
                                    lineHeight={"4.72vw"}
                                    color={"white"}
                                    fontFamily={"raleway"}
                                >
                                    {`${data?.title}, ${data?.country?.name}`}
                                </Text>
                                {/* <Box h={"3.47vw"}></Box> */}
                            </Flex>

                            <Flex
                                display={{ base: "flex", sm: "none" }}
                                flexDirection={"column"}
                                mt={"auto"}
                                gap={"6.67vw"}
                            >
                                <Flex flexDirection={"column"} gap={"1vw"}>
                                    <Text
                                        w={"100%"}
                                        fontSize={"8.2vw"}
                                        lineHeight={"8.88vw"}
                                        color={"white"}
                                        fontFamily={"lora"}
                                        fontStyle={"italic"}
                                    >
                                        {data?.name}
                                    </Text>
                                    <Text
                                        w={"100%"}
                                        fontSize={"7.78vw"}
                                        lineHeight={"8.88vw"}
                                        color={"white"}
                                        fontFamily={"raleway"}
                                    >
                                        {`${data?.title} ,${data?.country?.name}`}
                                    </Text>
                                </Flex>
                                <Text
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                    fontWeight={400}
                                    fontSize={"3.89vw"}
                                    lineHeight={"5vw"}
                                >
                                    {data?.tagLine}
                                </Text>
                                <Box h={"2.33vw"}></Box>
                            </Flex>

                            <Text
                                display={{ base: "none", sm: "flex" }}
                                color={"#EFE9E4"}
                                fontFamily={"raleway"}
                                fontWeight={400}
                                fontSize={"1.87vw"}
                                mt={"3.26vw"}
                            >
                                {data?.tagLine}
                            </Text>

                            <Box
                                h={"2px"}
                                mt={["2vw", "1.5vw"]}
                                w={"100%"}
                                bg={"#EFE9E4"}
                            ></Box>
                        </Flex>
                    </Box>

                    <Flex
                        flexDirection={"column"}
                        w={"100%"}
                        color={"#EFE9E4"}
                        alignItems={"center"}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        py={["6.67vw", "4vw"]}
                    >
                        <Text
                            w={"100%"}
                            mb={["4vw", "2vw"]}
                            textAlign={"left"}
                            color={"#EFE9E4"}
                            fontFamily={"raleway"}
                            fontWeight={400}
                            fontSize={["3.89vw", "1.87vw"]}
                        >
                            <Text as="span"><Icon as={RiDoubleQuotesL} /></Text> {data?.quotes?.quoteText} <Text as="span"><Icon as={RiDoubleQuotesR} /></Text>
                        </Text>
                        <Text color={"#EFE9E4"}
                            fontFamily={"lora"}
                            fontStyle={"italic"}
                            fontWeight={400}
                            fontSize={["3.89vw", "1.87vw"]}
                            w={"100%"}
                            textAlign={"right"}
                        >
                            - {data?.quotes?.quoteAuthor}
                        </Text>
                    </Flex>

                </Box>
            </Box>

            {isDx && (
                <Select
                    w={"30%"}
                    bg={"white"}
                    mb={6}
                    placeholder="Select a deck"
                    value={selectedDeck?.id || ""}
                    onChange={(e) => {
                        const selectedId = e.target.value;

                        if (selectedId === "__create__") {
                            createDeckOnOpen(); // Replace this with your actual modal open handler
                            return;
                        }

                        const selected = decks.find(deck => deck.id === Number(selectedId));
                        setSelectedDeck(selected || null);
                        fetchSelectedCards(selectedId);
                    }}
                >
                    {decks.map((deck) => (
                        <option key={deck.id} value={deck.id}>
                            {deck.title}
                        </option>
                    ))}
                    <option value="__create__" style={{ fontWeight: 'bold' }}>
                        + Create New Deck
                    </option>
                </Select>
            )}

            <Flex w={"100%"} flexDirection="column" alignItems={"center"}>
                {/* {hasAccess && <Switch size={"lg"} colorScheme="teal" mb={4} isChecked={isChecked} onChange={() => {
                    if (isChecked) {
                        const { country, region, ...remainingQuery } = router.query;
                        router.replace(
                            {
                                pathname: router.pathname,
                                query: remainingQuery, // removes country and region
                            },
                            undefined,
                            { shallow: true }
                        );
                    }
                    setIsChecked((prev) => !prev);
                }} />} */}
                {/* {isChecked ? */}
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
                {/* :
                    <RouteFilterExps
                        type="postcard"
                        // filter={filter}
                        // setFilter={setFilter}
                        filterData={expertData?.dxExperiences?.filterData}
                        switchFilter={switchFilter}
                    />
                } */}
            </Flex>

            {isMobile ? (
                <Drawer isOpen={isOpen} placement="bottom" onClose={modalClose}>
                    <DrawerOverlay />
                    <DrawerContent
                        borderTopRadius="5vw"
                        // bg="#D9D9D9"
                        bg={"#efe9e4 !important"}
                        as={MotionBox}
                        minW="100vw"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => info.offset.y > window.innerHeight * 0.2 && modalClose()}
                        py={8} px={4}
                    >
                        <DrawerHeader>
                            <Box w="23.6vw" h="5px" bg="#111111" opacity="0.25" borderRadius="2vw" mx="auto" />
                        </DrawerHeader>
                        <DrawerBody p={0} h={"100%"} display="flex" flexDirection={"column"} gap={4}>
                            <Text fontSize={"large"} fontWeight={"bold"}>{aiInfo?.title || "AI Response"}</Text>
                            {!aiInfo?.loading && aiInfo?.message ? <Flex
                                flex={1}
                                flexDirection={"column"}
                                // maxH="calc(80vh - 160px)" // Adjust depending on your header/footer size
                                overflowY="auto"
                                px={6}
                            // pb={4}
                            >
                                <RenderMarkdown content={aiInfo?.message} />
                                <Button mx={"auto"} py={2} mt={6} onClick={modalClose}>
                                    Close
                                </Button>
                            </Flex> : <Flex
                                flex={1}
                                flexDirection={"column"}
                                justifyContent={"center"}
                            >
                                <LoadingGif />
                                <Text fontFamily={"lora"} fontStyle={"italic"} align={"center"}>Fetching more information for you...</Text>
                            </Flex>}
                        </DrawerBody>
                        {/* <DrawerFooter justifyContent={"center"} h={12}>
                        </DrawerFooter> */}
                    </DrawerContent>
                </Drawer >
            ) : (
                <Modal isOpen={isOpen} onClose={modalClose} size="lg" isCentered>
                    <ModalOverlay />
                    <ModalContent borderRadius={["15px", "30px"]} py={8} px={4}>
                        <ModalHeader>{aiInfo?.title || "AI Response"}</ModalHeader>

                        <ModalBody p={0}>
                            {/* Scrollable and padded body content */}
                            {!aiInfo?.loading && aiInfo?.message ? <Flex
                                flexDirection={"column"}
                                maxH="calc(80vh - 160px)" // Adjust depending on your header/footer size
                                overflowY="auto"
                                px={6}
                                pb={4}
                            >
                                <RenderMarkdown content={aiInfo?.message} />
                                <Button mx={"auto"} py={2} mt={6} onClick={modalClose}>
                                    Close
                                </Button>
                            </Flex> : <Box>
                                <LoadingGif />
                                <Text fontFamily={"lora"} fontStyle={"italic"} align={"center"}>Fetching more information for you...</Text>
                            </Box>}
                        </ModalBody>

                        {/* <ModalFooter justifyContent="center"> */}
                        {/* </ModalFooter> */}
                    </ModalContent>
                </Modal>

            )}

            {isDx && selectedDeck && <PostcardModal
                size="xl"
                isShow={AddCardIsOpen}
                headerText={"Add Card to Postcard Deck"}
                children={
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            deckId: selectedDeck?.id || "",
                            date: ""
                        }}
                        onSubmit={async (values, { isSubmitting, setSubmitting }) => {
                            if (isSubmitting) return;
                            setSubmitting(true);
                            const { deckId, date } = values;
                            const deck = await fetchPaginatedResults("travelogues", { id: deckId }, {
                                itinerary_block: {
                                    fields: ["order", "date"],
                                    populate: {
                                        dx_card: {
                                            fields: ['id', 'name'],
                                        }
                                    }
                                },
                            })
                            // console.log(deck)
                            if (deck || deck?.length > 0) {
                                const blocks = deck?.itinerary_block || [];
                                const newBlock = {
                                    order: blocks.length + 1,
                                    date: date,
                                    dx_card: currentCardId
                                };
                                blocks.push(newBlock);
                                await updateDBValue(
                                    "travelogues",
                                    deckId,
                                    { itinerary_block: blocks },
                                ).then(({ data }) => data?.id && setSelectedCards((prev) => ({
                                    ...prev,
                                    [currentCardId]: date
                                })
                                ));
                            }
                            AddCardOnClose();
                            setSubmitting(false);
                        }}
                    >
                        {({ setFieldValue, values }) => (
                            <Form>
                                <ModalBody pb={6}>
                                    <Field name="date">
                                        {({ field }) => (
                                            <FormControl mt={4}>
                                                <FormLabel>Date</FormLabel>
                                                <Input {...field} type="date" bg="white" />
                                            </FormControl>
                                        )}
                                    </Field>

                                </ModalBody>

                                <ModalFooter>
                                    <Button type="submit" colorScheme="blue" mr={3}>
                                        Submit
                                    </Button>
                                    <Button onClick={() => {
                                        AddCardOnClose();
                                    }}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                }
                handleClose={() => {
                    AddCardOnClose();
                }}
            />}

            {isDx && <PostcardAlert
                show={{ mode: RemoveCardIsOpen, message: `Are you sure you want to delete this card from Postcard Deck: ${selectedDeck?.title}?` }}
                handleAction={async () => {
                    const deck = await fetchPaginatedResults("travelogues", { id: selectedDeck?.id }, {
                        itinerary_block: {
                            fields: ["order", "date"],
                            populate: {
                                dx_card: {
                                    fields: ['id', 'name'],
                                }
                            }
                        },
                    })
                    // console.log(deck)
                    if (deck || deck?.length > 0) {
                        const blocks = deck?.itinerary_block || [];
                        const updatedBlocks = blocks.filter(block => block?.dx_card?.id !== currentCardId);
                        await updateDBValue("travelogues", selectedDeck?.id, {
                            itinerary_block: updatedBlocks,
                        });
                        setSelectedCards((prev) => {
                            const updated = { ...prev };
                            delete updated[currentCardId];
                            return updated;
                        });
                    }
                    RemoveCardOnClose();
                }}
                closeAlert={RemoveCardOnClose}
                buttonText="REMOVE"
            />}

            {isDx && <PostcardModal
                size="xl"
                isShow={createDeckIsOpen}
                headerText={"Create New Postcard Deck"}
                handleClose={createDeckonClose}
            >
                <CreateEditTravelogue
                    isDx={isDx}
                    profile={profile}
                    dxs={isDx ? [data] : []}
                    users={[]}
                    isOpen={createDeckIsOpen}
                    onClose={createDeckonClose}
                    editMode={false}
                    selectedDeck={null}
                    refreshDecks={() => { }}
                    onComplete={(newDeck) => {
                        setSelectedDeck(newDeck);
                        fetchSelectedCards(newDeck.id);
                        setDecks((prev) => [...prev, newDeck]);
                    }}
                />
            </PostcardModal>}

            {isDx && selectedDeck?.slug && tabs[selectedTab] != "About" && <Flex
                id="ActionItemsDestinationExpertPostcardDeck"
                w="15%"
                // h="15%"
                right={0}
                bottom={!isFooterInView ? 8 : 8}
                pos={!isFooterInView ? "fixed" : "absolute"}
                zIndex={102}
                justifyContent={"center"}
                alignItems={!isFooterInView ? "center" : "flex-end"}
            >
                <Button
                    as="a"
                    href={`/postcard-deck/${selectedDeck?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="none"
                    bg="white"
                    color="primary_1"
                    borderColor="primary_1!important"
                    border="2px"
                >
                    Preview
                </Button>
            </Flex>}
        </>
    )
}

export default ExpertPage