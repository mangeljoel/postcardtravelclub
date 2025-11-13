import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import SearchResultCards from "./SearchResultCards";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import LandingHeroSection from "../../patterns/LandingHeroSection";
import GuidedSearchPostcard from "../GuidedSearch/GuidedSearchPostcard";
import GuidedSearchAlbum from "../GuidedSearch/GuidedSearchAlbum";
// import useDebouncedInput from "../../hooks/useDebouncedInput";
import PostcardModal from "../PostcardModal";
import DxStaysForm from "../DestinationExpert/Stays/DxStaysForm";
import GuidedSearchShopping from "./GuidedSearchShopping";
// import SelectedTagList from "./SelectedTagList";

const Shopping = ({ type, isDiary, slug }) => {
    const { profile } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const baseFilter = {
        directories: { slug: { $in: ["shopping-conscious-luxury-travel"] } }
    };
    const [filter, setFilter] = useState(baseFilter)
    const [appliedTag, setAppliedTag] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => setAppliedTag(null), [filter]);

    return (
        <Flex w={"100%"} flexDirection={"column"}>
            {!isDiary && <LandingHeroSection type={type} />}
            <Box
                pos="relative"
                // mt={["12%", "3%"]}
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                {/* <DebouncedAutoCompleteInput inputValue={inputValue} handleInputChange={handleInputChange} resetInput={resetDebouncedInput} autoCompleteItems={autoCompleteItems} loading={searchLoading} handleAutoCompleteSelect={handleAutoCompleteSelect} loadMoreItems={loadMoreItems} hasMore={hasMore} /> */}

                {/* {type == "experiences" ? <GuidedSearchPostcard filter={filter} setFilter={setFilter} callBeforeApply={() => resetInput()} /> :
                    <GuidedSearchAlbum filter={filter} setFilter={setFilter} callBeforeApply={() => resetInput()} />} */}

                {/* <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} /> */}
                <GuidedSearchShopping filter={filter} isDiary={isDiary} slug={slug} setFilter={setFilter} callBeforeApply={() => { }} />
                {filter?.searchText && <Text
                    fontSize={["3vw", "1.46vw"]}
                    textAlign={"start"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    color={"#111111"}
                    mt={10}
                    mb={6}
                    px={["0%", "10%"]}
                >
                    Showing results for "<Text as={"span"} fontWeight={"600"}>{inputValue}...</Text>"
                </Text>}

                <Box w="100%" mb="1em" mt={["0", "1em"]}>
                    <SearchResultCards
                        searchFilter={filter}
                        type={type}
                        profile={profile}
                        isDiary={isDiary}
                        slug={slug}
                        canEdit={profile && ["Admin", "SuperAdmin", "EditorInChief", "EditorialAdmin"].includes(profile?.user_type?.name)}
                        loading={loading}
                        setLoading={setLoading}
                        appliedTag={appliedTag}

                    />

                </Box>



            </Box>
        </Flex>
    );
};
export default Shopping;
