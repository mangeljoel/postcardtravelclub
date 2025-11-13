import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { createDBEntry, deleteDBEntry, fetchPaginatedResults } from '../../../queries/strapiQueries';
import InfiniteMasonry from '../../../patterns/InfiniteMasonry'
import DxCard from '../DxCard';
import DxForm from '../FormComponents/DxForm';
import GuidedSearchDxExps from '../../GuidedSearch/GuidedSearchDxExps';
import LoadingGif from '../../../patterns/LoadingGif';
import SelectedTagList from '../../Experiences/SelectedTagList';

const DxExperiences = ({ data, hasAccess, expertData, showFilter, triggerRevalidation, openAiDetails, isDx, AddCardOnOpen, RemoveCardOnOpen, canSelect, selectedCards, firstLoad = false, setFirstLoad = () => { } }) => {
    const { isOpen: createIsOpen, onOpen: createOnOpen, onClose: createOnClose } = useDisclosure();
    const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure();
    const [allCards, setAllCards] = useState([])
    const [dxCards, setDxCards] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState({})
    const [appliedTag, setAppliedTag] = useState(null)
    const [editCard, setEditCard] = useState(null)

    const handleDeleteDxCard = async (id) => {
        await deleteDBEntry('dx-cards', id);
        setDxCards(prev => prev.filter(card => card.id !== id));
        triggerRevalidation() // triggering revalidation after delete
    };

    const handleEditDxCard = (id) => {
        const card = dxCards.find(c => c.id === id);
        if (card) {
            setEditCard(card);
            editOnOpen();
        }
    };

    const handleReset = (mode, newCardData) => {
        if (mode === "create") {
            setDxCards(prev => [...prev, newCardData]);
        }
        else {
            setDxCards(prev => prev.map(card => card.id === newCardData.id ? newCardData : card));
        }
        triggerRevalidation() // triggering
    }

    const sortSelectedCards = (a, b) => {
        const aSelected = selectedCards?.hasOwnProperty(a?.id);
        const bSelected = selectedCards?.hasOwnProperty(b?.id);
        return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    }

    useEffect(() => {
        const filtered = allCards.filter((card) => {
            const matchRegion = filter.region ? card.region?.name === filter.region?.name : true;
            const matchCountry = filter.country ? card.country?.name === filter.country?.name : true;
            const matchTagGroup = filter.tagGroup ? card.tag_group?.name === filter.tagGroup?.name : true;

            const matchTags = appliedTag
                ? card.tags?.some(tag => tag?.name === appliedTag)
                : filter.tags?.length
                    ? card.tags?.some(tag => filter.selectedTags.includes(tag?.name))
                    : true;

            return matchRegion && matchCountry && matchTagGroup && matchTags;
        });

        setDxCards(filtered)
    }, [filter, appliedTag, allCards])

    useEffect(() => {
        setAllCards(expertData?.dxExperiences?.values)
    }, [expertData?.dxExperiences?.values]);

    useEffect(() => setAppliedTag(null), [filter]);

    useEffect(() => {
        !showFilter && setFilter({})
    }, [showFilter])

    return (
        <Box
            w="100%"
            px={{ base: "5%", lg: "10%" }}
            pb={{ base: "5%", lg: "10%" }}
            textAlign={"center"}
        // flexDirection={"column"}
        // alignItems={"center"}
        >

            <DxForm type="postcard" isOpen={createIsOpen} headerText={'Create new Experience'} onClose={createOnClose} mode={"create"} handleReset={handleReset} dxId={data?.id} />
            <DxForm type="postcard" isOpen={editIsOpen} headerText={'Edit Experience'} onClose={editOnClose} mode={"edit"} handleReset={handleReset} dxId={data?.id} initialFormValues={editCard} />

            < GuidedSearchDxExps
                type="postcard"
                filter={filter}
                setFilter={setFilter}
                hasAccess={hasAccess}
                filterData={expertData?.dxExperiences?.filterData}
            />

            <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

            {hasAccess && (
                <Button onClick={createOnOpen} mt={[10, 12]} mb={[6, 8]} display="inline-block"><AddIcon mx={2} /> Add Experience</Button>
            )}

            {/* <Flex minW={"100%"} flexDirection={"column"} justify={"center"} alignItems={"center"} gap={"2"}> */}
            <Flex
                padding={["0px", "12px"]}
                width="100%"
                id="dxcard-list"
                justifyContent="center"
                textAlign="center"
                transition={"0.5s ease"}
                overflow="hidden"
            >
                <div
                    id="scrollableDiv"
                    style={{
                        width: "100%",
                        height: "100%",
                        // overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                        overflow: "hidden",
                    }}
                >
                    {loading ? <LoadingGif /> :
                        <InfiniteMasonry
                            masonryItems={dxCards?.sort(sortSelectedCards)?.map((card, index) =>
                                <DxCard
                                    key={card.id}
                                    data={card}
                                    canEdit={hasAccess}
                                    handleDelete={handleDeleteDxCard}
                                    openEditForm={handleEditDxCard}
                                    openAiDetails={openAiDetails}
                                    canSelect={canSelect}
                                    isSelected={
                                        selectedCards?.[card?.id]
                                            ? selectedCards?.[card?.id]
                                            : selectedCards?.hasOwnProperty(card?.id)
                                    }
                                    checkboxClick={AddCardOnOpen}
                                    unselectCard={RemoveCardOnOpen}
                                    firstLoad={index == 0 ? firstLoad : false}
                                    setFirstLoad={index == 0 ? setFirstLoad : undefined}
                                />)}
                            hasMore={false}
                            fetchMoreData={() => { }}
                            dataLength={dxCards.length}
                            loading={false}
                        />
                    }
                </div>
            </Flex>


        </Box>
    );
};

export default DxExperiences;
