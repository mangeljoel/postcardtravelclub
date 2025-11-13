import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Button,
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import AppContext from '../../AppContext';
import PostcardAlert from '../../PostcardAlert';
import PostcardModal from '../../PostcardModal';
import CreateEditTravelogue from '../../PostcardDeck/CreateEditTravelogue';
import { fetchPaginatedResults, updateDBValue } from '../../../queries/strapiQueries';
import DxAbout from './DxAbout';
import DxExperiences from '../Experiences/DxExperiences';
import DxRestaurants from '../Restaurants/DxRestaurants';
import DxStays from '../Stays/DxStays';
import { useAIInfo } from './hooks/useAIInfo';
import { useDecksManagement } from './hooks/useDecksManagement';
import { CoverSection } from './CoverSection';
import { DeckSelector } from './DeckSelector';
import { AIInfoModal } from './AIInfoModal';

// Constants
const TABS = ["Experiences", "About"];
const PRIVILEGED_USER_TYPES = ["Admin", "SuperAdmin", "EditorInChief"];

const PreviewButton = React.memo(({ selectedDeck, isFooterInView }) => {
    if (!selectedDeck?.slug) return null;

    return (
        <Flex
            id="ActionItemsDestinationExpertPostcardDeck"
            w="15%"
            right={0}
            bottom={8}
            pos={!isFooterInView ? "fixed" : "absolute"}
            zIndex={102}
            justifyContent="center"
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
        </Flex>
    );
});

// Main component
const ExpertPage = ({
    data,
    expertData,
    triggerRevalidation,
    showActionButton,
    isFooterInView,
    editMode,
    setEditMode,
    formikRef,
    handleSubmit
}) => {
    const { profile } = useContext(AppContext);
    const router = useRouter();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // State
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [currentCardId, setCurrentCardId] = React.useState(null);
    const [firstLoad, setFirstLoad] = React.useState(true);

    // Custom hooks
    const { aiInfo, fetchAIInfo, resetAIInfo, setTitle } = useAIInfo();
    const {
        decks,
        selectedDeck,
        selectedCards,
        setSelectedCards,
        setSelectedDeck,
        fetchDecks,
        fetchSelectedCards,
        addDeck,
        updateSelectedCards,
        removeSelectedCard
    } = useDecksManagement(data?.user?.id === profile?.id, profile);

    // Modals
    const aiModal = useDisclosure();
    const removeCardModal = useDisclosure();
    const createDeckModal = useDisclosure();

    // Computed values
    const hasAccess = useMemo(() =>
        PRIVILEGED_USER_TYPES.includes(profile?.user_type?.name) ||
        data?.user?.id === profile?.id,
        [profile?.user_type?.name, data?.user?.id, profile?.id]
    );

    const isDx = useMemo(() =>
        data?.user?.id === profile?.id,
        [data?.user?.id, profile?.id]
    );

    // Callbacks
    const openAiDetails = useCallback((dxcardId, title) => {
        aiModal.onOpen();
        fetchAIInfo(dxcardId);
        setTitle(title);
    }, [aiModal.onOpen, fetchAIInfo, setTitle]);

    const handleAiModalClose = useCallback(() => {
        aiModal.onClose();
        resetAIInfo();
    }, [aiModal.onClose, resetAIInfo]);

    const handleDeckChange = useCallback((selectedId) => {
        const selected = decks.find(deck => deck.id === Number(selectedId));
        setSelectedDeck(selected || null);
        if (selectedId) {
            fetchSelectedCards(selectedId);
        } else {
            setSelectedCards({});
        }
    }, [decks, setSelectedDeck, fetchSelectedCards]);

    const handleAddCard = useCallback(async (cardId) => {
        try {
            const deck = await fetchPaginatedResults("travelogues", { id: selectedDeck?.id }, {
                itinerary_block: {
                    fields: ["order", "date"],
                    populate: {
                        dx_card: {
                            fields: ['id', 'name'],
                        }
                    }
                },
            });

            if (deck?.itinerary_block) {
                const blocks = [...deck.itinerary_block]; // clone to avoid mutation

                const newBlock = {
                    order: blocks.length + 1,
                    date: null,
                    dx_card: cardId,
                };

                blocks.push(newBlock);

                // Sort by date ascending
                blocks.sort((a, b) => {
                    const aHasDate = !!a.date;
                    const bHasDate = !!b.date;

                    if (!aHasDate && !bHasDate) return 0;      // both don't have date — keep order
                    if (!aHasDate) return -1;                  // a has no date — comes first
                    if (!bHasDate) return 1;                   // b has no date — comes first

                    return new Date(a.date) - new Date(b.date); // both have date — sort ascending
                });

                // Reassign correct order values after sorting
                const sortedBlocks = blocks.map((block, index) => ({
                    ...block,
                    order: index + 1,
                }));

                const isFirstBlock = deck.itinerary_block.length === 0;

                const { data: updatedData } = await updateDBValue("travelogues", selectedDeck?.id, {
                    itinerary_block: sortedBlocks,
                    ...(isFirstBlock ? { status: "deckBuild" } : {}),
                });

                if (updatedData?.id) {
                    updateSelectedCards(cardId, null);
                }
            }
        } catch (error) {
            console.error('Error adding card:', error);
        }
    }, [selectedDeck, updateSelectedCards]);

    const handleRemoveCard = useCallback((id) => {
        removeCardModal.onOpen();
        setCurrentCardId(id);
    }, [removeCardModal.onOpen]);

    const handleCreateDeckComplete = useCallback((newDeck) => {
        setSelectedDeck(newDeck);
        fetchSelectedCards(newDeck.id);
        addDeck(newDeck);
    }, [setSelectedDeck, fetchSelectedCards, addDeck]);

    // Tab content configuration
    const commonProps = useMemo(() => ({
        data,
        hasAccess,
        expertData,
        showFilter: true,
        triggerRevalidation,
        openAiDetails,
        isDx,
        canSelect: isDx && selectedDeck ? true : false,
        AddCardOnOpen: handleAddCard,
        RemoveCardOnOpen: handleRemoveCard,
        selectedCards
    }), [
        data,
        hasAccess,
        expertData,
        triggerRevalidation,
        openAiDetails,
        isDx,
        selectedDeck,
        handleAddCard,
        handleRemoveCard,
        selectedCards
    ]);

    const tabContent = useMemo(() => ({
        "About": (
            <DxAbout
                data={data}
                showActionButton={showActionButton}
                isFooterInView={isFooterInView}
                editMode={editMode}
                setEditMode={setEditMode}
                formikRef={formikRef}
                handleSubmit={handleSubmit}
            />
        ),
        "Stays": (
            <DxStays
                {...commonProps}
                {...(TABS[0] === "Stays" && { firstLoad, setFirstLoad })}
            />
        ),
        "Experiences": (
            <DxExperiences
                {...commonProps}
                {...(TABS[0] === "Experiences" && { firstLoad, setFirstLoad })}
            />
        ),
        // "Restaurants": (
        //     <DxRestaurants
        //         {...commonProps}
        //         {...(TABS[0] === "Restaurants" && { firstLoad, setFirstLoad })}
        //     />
        // ),
    }), [
        data,
        showActionButton,
        isFooterInView,
        editMode,
        setEditMode,
        formikRef,
        handleSubmit,
        commonProps,
        firstLoad,
        setFirstLoad
    ]);

    // Effects
    useEffect(() => {
        if (isDx) {
            fetchDecks();
        }
    }, [isDx, fetchDecks]);

    return (
        <>
            <CoverSection data={data} />

            <DeckSelector
                isDx={isDx}
                decks={decks}
                selectedDeck={selectedDeck}
                onDeckChange={handleDeckChange}
                onCreateDeck={createDeckModal.onOpen}
            />

            <Flex w="100%" flexDirection="column" alignItems="center">
                <Tabs
                    variant="categoryList"
                    defaultIndex={selectedTab}
                    index={selectedTab}
                    onChange={setSelectedTab}
                >
                    <TabList justifyContent="center" ml={["5.56vw", "2.22vw"]} mb={10}>
                        {TABS.map((tab, index) => (
                            <Box
                                key={`tab_data_${tab}`}
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
                </Tabs>
            </Flex>

            {/* AI Info Modal */}
            <AIInfoModal
                isOpen={aiModal.isOpen}
                onClose={handleAiModalClose}
                aiInfo={aiInfo}
                isMobile={isMobile}
            />

            {/* Remove Card Alert */}
            {isDx && (
                <PostcardAlert
                    show={{
                        mode: removeCardModal.isOpen,
                        message: `Are you sure you want to remove this card from the deck?`
                    }}
                    handleAction={async () => {
                        try {
                            const deck = await fetchPaginatedResults("travelogues", { id: selectedDeck?.id }, {
                                itinerary_block: {
                                    fields: ["order", "date"],
                                    populate: {
                                        dx_card: {
                                            fields: ['id', 'name'],
                                        }
                                    }
                                },
                            });

                            if (deck?.itinerary_block) {
                                const updatedBlocks = deck.itinerary_block.filter(
                                    block => block?.dx_card?.id !== currentCardId
                                );
                                await updateDBValue("travelogues", selectedDeck?.id, {
                                    itinerary_block: updatedBlocks,
                                    ...(updatedBlocks?.length == 0 ? { status: "draft" } : {}),
                                });
                                removeSelectedCard(currentCardId);
                            }
                            removeCardModal.onClose();
                        } catch (error) {
                            console.error('Error removing card:', error);
                        }
                    }}
                    closeAlert={removeCardModal.onClose}
                    buttonText="REMOVE"
                />
            )}

            {/* Create Deck Modal */}
            {isDx && (
                <PostcardModal
                    size="xl"
                    isShow={createDeckModal.isOpen}
                    headerText="Create New Postcard Deck"
                    handleClose={createDeckModal.onClose}
                >
                    <CreateEditTravelogue
                        isDx={isDx}
                        profile={profile}
                        dxs={isDx ? [data] : []}
                        users={[]}
                        isOpen={createDeckModal.isOpen}
                        onClose={createDeckModal.onClose}
                        editMode={false}
                        selectedDeck={null}
                        refreshDecks={() => { }}
                        onComplete={handleCreateDeckComplete}
                    />
                </PostcardModal>
            )}

            {/* Preview Button */}
            {isDx && TABS[selectedTab] !== "About" && (
                <PreviewButton
                    selectedDeck={selectedDeck}
                    isFooterInView={isFooterInView}
                />
            )}
        </>
    );
};

export default ExpertPage;