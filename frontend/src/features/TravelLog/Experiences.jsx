import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import DxCard from '../DestinationExpert/DxCard'
import LoadingGif from '../../patterns/LoadingGif'
import InfiniteMasonry from '../../patterns/InfiniteMasonry'
import FilterTravelogueExps from '../GuidedSearch/FilterTravelogueExps'
import SelectedTagList from '../Experiences/SelectedTagList'
import DraggableCardList from './DraggableCardList'
import ActionItemPostcardDeck from './ActionItemPostcardDeck'

const Experiences = ({ cards = [], isDx = false, setDxCardMemory, handleRemoveCard, handleChangeDate, handleSave, actionItemProps, allowImageUpload, onImageUpload }) => {
    const [filter, setFilter] = React.useState({})
    const [dxCards, setDxCards] = React.useState([])
    const [appliedTag, setAppliedTag] = React.useState([])

    useEffect(() => {
        const filtered = cards.filter((card) => {
            const matchRegion = filter.region && filter?.region?.id !== -1 ? card.region?.id === filter.region?.id : true;
            const matchCountry = filter.country && filter?.country?.id !== -1 ? card.country?.id === filter.country?.id : true;
            const matchTagGroup = filter.tagGroup && filter?.tagGroup?.id !== -1 ? card.tag_group?.id === filter.tagGroup?.id : true;

            // const matchTags = appliedTag?.id
            //     ? card.tags?.some(tag => tag.id === appliedTag.id)
            //     : filter.tags?.length
            //         ? card.tags?.some(tag => filter.tags.includes(tag.id))
            //         : true;
            const matchTags = appliedTag?.id
                ? card.tags?.some(tag => tag.id === appliedTag.id)
                : filter.selectedTags?.length
                    ? card.tags?.some(tag =>
                        filter.selectedTags.some(selected => selected.id === tag.id)
                    )
                    : true;

            return matchRegion && matchCountry && matchTagGroup && matchTags;
        }).sort((a, b) => a.order - b.order);

        setDxCards(filtered);
    }, [cards, filter, appliedTag]);

    return (
        <Box
            w="100%"
            px={{ base: "5%", lg: "10%" }}
            pb={{ base: "5%", lg: "10%" }}
            textAlign={"center"}
        >
            <FilterTravelogueExps
                type="postcard"
                filter={filter}
                setFilter={setFilter}
                cards={cards}
            />

            <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

            <Flex
                padding={["0px", "12px"]}
                width="100%"
                id="travel-log-dxcard-list"
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
                    <Flex style={{
                        paddingBottom: "60px",
                        paddingTop: "60px"
                    }}>
                        {dxCards?.length > 0
                            ? <DraggableCardList setDxCardMemory={setDxCardMemory} blocks={dxCards} onOrderChange={(blocks) => setDxCards(blocks)} cardProps={{ isDx, allowImageUpload, onImageUpload, canRemove: isDx, unselectCard: handleRemoveCard, changeDateCard: handleChangeDate }} />
                            : <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"} mx={"auto"}>No Experiences Selected</Text>
                        }
                    </Flex>
                </div>
            </Flex>

            <ActionItemPostcardDeck {...actionItemProps} onSave={() => handleSave(dxCards)} />
        </Box>
    )
}

export default Experiences