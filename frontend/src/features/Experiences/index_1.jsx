import { Box, Text, Flex } from "@chakra-ui/react";
import { useState, useContext } from "react";
import SearchResults from "./SearchResults";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import LandingHeroSection from "../../patterns/LandingHeroSection";
import GuidedSearchPostcard from "../GuidedSearch/GuidedSearchPostcard";
import GuidedSearchAlbum from "../GuidedSearch/GuidedSearchAlbum";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import DebouncedAutoCompleteInput from "../../patterns/DebouncedAutoCompleteInput";

const Experiences = ({ type, title, description, isSearch }) => {
    const { profile } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [filter, setFilter] = useState(null)
    const [appliedTag, setAppliedTag] = useState(null);
    const [searchText, setSearchText] = useState('')
    const [inputValue, handleInputChange, resetInput] = useDebouncedInput(
        1000, // Debounce time
        setSearchText // Callback function
    );
    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    return (
        <Flex w={"100%"} flexDirection={"column"}>
            <LandingHeroSection type={type} />
            <Box
                pos="relative"
                // mt={["12%", "3%"]}
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                <DebouncedAutoCompleteInput inputValue={inputValue} handleInputChange={handleInputChange} resetInput={resetInput} autoCompleteItems={autoCompleteItems} loading={searchLoading} setIsSearchActive={setIsSearchActive} />

                {type == "experiences" ? <GuidedSearchPostcard filter={filter} setFilter={setFilter} /> :
                    <GuidedSearchAlbum filter={filter} setFilter={setFilter} />}

                {filter?.selectedTags?.length > 0 && (
                    <Flex mx={{ base: "-5%", sm: "-5%", md: "-5%", lg: "-12.5%" }}>
                        <Flex overflowX={"auto"} px={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }} mt={["8.33vw", "4.44vw"]} gap={["2.5vw", "1.11vw"]} className='no-scrollbar'>
                            {filter?.selectedTags.map((tag) => {
                                return (
                                    <Text
                                        key={tag?.id}
                                        as={Flex}
                                        px={["4vw", "2.67vw"]}
                                        h={["8.33vw", "3.125vw"]}
                                        fontSize={["3.33vw", "1.25vw"]}
                                        borderRadius={["7.22vw", "2.78vw"]}
                                        border={["1px", "2px"]}
                                        w={"auto"}
                                        whiteSpace={"nowrap"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        fontFamily={"raleway"}
                                        fontWeight={500}
                                        cursor={"pointer"}
                                        borderColor={appliedTag?.id == tag?.id || filter?.selectedTags?.length == 1 ? "primary_1!important" : "white"}
                                        color={appliedTag?.id == tag?.id || filter?.selectedTags?.length == 1 ? "white" : "primary_1"}
                                        bg={appliedTag?.id == tag?.id || filter?.selectedTags?.length == 1 ? "primary_1" : "white"}
                                        onClick={() => {
                                            if (filter?.selectedTags?.length == 1) return
                                            setAppliedTag((prev) => {
                                                if (prev?.id == tag.id) return null
                                                else return tag
                                            })
                                        }}
                                    >
                                        {tag.name}
                                    </Text>
                                )
                            })}
                        </Flex>
                    </Flex>
                )}

                <Box w="100%" mb="1em" mt={["0", "1em"]}>
                    <SearchResults
                        searchFilter={filter}
                        type={type}
                        profile={profile}
                        loading={loading}
                        setLoading={setLoading}
                        appliedTag={appliedTag}
                        setAppliedTag={setAppliedTag}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        resetInput={resetInput}
                        setAutoCompleteItems={setAutoCompleteItems}
                        isSearchActive={isSearchActive}
                        setSearchLoading={setSearchLoading}
                    />
                </Box>

            </Box>
        </Flex>
    );
};
export default Experiences;
