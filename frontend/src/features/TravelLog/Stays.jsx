import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import DxCard from '../DestinationExpert/DxCard'
import LoadingGif from '../../patterns/LoadingGif'
import InfiniteMasonry from '../../patterns/InfiniteMasonry'
import FilterTravelogueExps from '../GuidedSearch/FilterTravelogueExps'
import SelectedTagList from '../Experiences/SelectedTagList'
import FilterTravelogueStays from '../GuidedSearch/FilterTravelogueStays'
import DraggableCardList from './DraggableCardList'
import ActionItemPostcardDeck from './ActionItemPostcardDeck'

const Stays = ({ cards = [], isDx = false, handleRemoveCard, handleChangeDate, handleSave, actionItemProps, setDxCardMemory, allowImageUpload, onImageUpload }) => {
    const [filter, setFilter] = React.useState({})
    const [dxCards, setDxCards] = React.useState([])
    // console.log("cards", cards)

    useEffect(() => {
        const filtered = cards.filter((card) => {
            const matchRegion = filter.region && filter?.region?.id !== -1 ? card.region?.id === filter.region?.id : true;
            const matchCountry = filter.country && filter?.country?.id !== -1 ? card.country?.id === filter.country?.id : true;
            const matchEnv = filter.environment && filter?.environment?.id !== -1 ? card.environment?.id === filter.environment?.id : true;
            const matchCategory = filter.category && filter?.category?.id !== -1 ? card.category?.id === filter.category?.id : true;

            return matchRegion && matchCountry && matchEnv && matchCategory;
        });

        setDxCards(filtered);
    }, [cards, filter]);

    return (
        <Box
            w="100%"
            px={{ base: "5%", lg: "10%" }}
            pb={{ base: "5%", lg: "10%" }}
            textAlign={"center"}
        >
            <FilterTravelogueStays
                type="album"
                filter={filter}
                setFilter={setFilter}
                cards={cards}
            />

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
                            : <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"} mx={"auto"}>No Stays Selected</Text>
                        }
                    </Flex>
                </div>
            </Flex>

            <ActionItemPostcardDeck {...actionItemProps} onSave={() => handleSave(dxCards)} />
        </Box>
    )
}

export default Stays