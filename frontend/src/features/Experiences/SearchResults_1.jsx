import { Box, Button, Checkbox, Flex, Text } from "@chakra-ui/react";
import SelectedTagList from "./SelectedTagList";
import { useState, useEffect, useRef } from "react";
import {
    createDBEntry,
    fetchPaginatedResults,
    getTotalRecords
} from "../../queries/strapiQueries";
import {
    apiNames,
    populateAlbumData,
    populatePostcardData
} from "../../services/fetchApIDataSchema";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import NewStoryList from "../TravelGuide/NewStoryList";
import PostcardModal from "../PostcardModal";
import TagSelection from "../GuidedSearch/TagSelection";
import LoadingGif from "../../patterns/LoadingGif";
const SearchResults = ({ searchFilter, type, appliedTag, loading, setLoading, setAppliedTag, searchText, setSearchText, resetInput, setAutoCompleteItems, isSearchActive, setSearchLoading }) => {
    const [appliedFilter, setAppliedFilter] = useState();
    const [totalPostcards, setTotalPostcards] = useState();
    const [hasMore, setHasMore] = useState(true);
    const [appliedTags, setAppliedTags] = useState(0);
    const [start, setStart] = useState(0);
    const [appliedTagsData, setAppliedTagsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const tagsBatchSize = 10;

    const btnRef = useRef(null);

    useEffect(() => {
        buildInitialData();
    }, [searchFilter, appliedTag]);

    useEffect(() => {
        buildInitialData(true);
    }, [searchText, isSearchActive]);

    useEffect(() => {
        if (setAppliedTag) setAppliedTag(null)
        if (setSearchText) {
            setSearchText('')
            resetInput()
        }
    }, [searchFilter])

    const updateAutoCompleteItems = (data) => {
        if (!setAutoCompleteItems || !searchText) {
            setAutoCompleteItems?.([]);
            return;
        }

        const searchLower = searchText.toLowerCase();
        const tags = new Set();
        const names = new Set();

        for (const item of data) {
            if (item?.tags) {
                for (const tag of item.tags) {
                    if (tag?.name.toLowerCase().includes(searchLower)) {
                        tags.add(tag.name);
                    }
                }
            }
            if (item?.name.toLowerCase().includes(searchLower)) {
                names.add(item.name);
            }
        }
        setAutoCompleteItems([...tags, ...names]);
    };

    useEffect(() => {
        if (appliedFilter) {
            getFilteredData(0, 6);
        }
    }, [appliedFilter]);

    useEffect(() => {
        const tagCheck =
            type === "experiences"
                ? appliedFilter?.tags?.name?.$in
                : appliedFilter?.postcards?.tags?.name?.$in;
        if (appliedTagsData.length >= totalPostcards) {
            if (tagCheck?.length > 50) {
                if (appliedTags >= tagCheck?.length) setHasMore(false);
                else {
                    setAppliedTags((prev) => prev + tagsBatchSize);
                    setStart(0);
                    setAppliedTagsData([]);
                    setTotalPostcardsValue(appliedTags + tagsBatchSize);
                    setHasMore(true);
                }
            } else setHasMore(false);
        } else {
            setStart(appliedTagsData.length);
            setHasMore(true);
        }
    }, [filteredData]);

    const setTotalPostcardsValue = async (appliedTags) => {
        if (appliedFilter) {
            const tagCheck =
                type === "experiences"
                    ? appliedFilter?.tags?.name?.$in
                    : appliedFilter?.postcards?.tags?.name?.$in;

            let filter = { ...appliedFilter };

            // Modify the filter if tagCheck length is greater than 50
            if (tagCheck?.length > 50) {
                const slicedTags = tagCheck.slice(
                    appliedTags,
                    appliedTags + tagsBatchSize
                );
                const tagFilter = { name: { $in: slicedTags } };

                // Apply the appropriate filter based on the type
                filter = {
                    ...filter,
                    ...(type === "experiences"
                        ? { tags: tagFilter }
                        : { postcards: { tags: tagFilter } })
                };
            }

            let total = await getTotalRecords(
                type === "experiences" ? apiNames.postcard : apiNames.album,
                filter
            );
            setTotalPostcards(total);
        }
    };

    const getFilteredData = async (start, limit) => {
        if (appliedFilter) {
            const tagCheck = getTagCheck();

            let filter = { ...appliedFilter };

            if (tagCheck?.length > 50) {
                const slicedTags = tagCheck.slice(
                    appliedTags,
                    appliedTags + tagsBatchSize
                );
                filter = applyTagFilter(filter, slicedTags);
            }

            let data = await fetchPaginatedResults(
                type === "experiences" ? apiNames.postcard : apiNames.album,
                filter,
                type === "experiences"
                    ? populatePostcardData
                    : populateAlbumData,
                "createdAt:DESC",
                start,
                limit
            );
            let total = await getTotalRecords(
                type === "experiences" ? apiNames.postcard : apiNames.album,
                filter
            );

            setTotalPostcards(total);
            const newData = Array.isArray(data) ? data : [data];

            updateAutoCompleteItems(newData)
            if (!searchText) setDisplayData(newData);
            else
                if (searchText && !isSearchActive) setDisplayData(newData);

            setLoading(false);
            setSearchLoading(false);
        }
    };
    const setDisplayData = (newData) => {
        setAppliedTagsData((prev) => [...prev, ...newData]);
        setFilteredData((prev) => {
            const existingIds = new Set(prev.map((item) => item.id)); // Assuming `id` is unique
            return [...prev, ...newData.filter((item) => !existingIds.has(item.id))];
        });

    }

    const buildInitialData = (useSearchText = false) => {
        if (!isSearchActive) setLoading(true);
        else setSearchLoading(true);
        if (!isSearchActive) setFilteredData([]);
        setStart(0);
        setAppliedTags(0);
        setAppliedTagsData([]);
        let filter = {
            ...(type === "experiences"
                ? {
                    album: {

                        isActive: true,

                        directories: {
                            slug: { $in: ["mindful-luxury-hotels"] }
                        }
                    },
                    isComplete: true,
                    ...(searchText && useSearchText ? {
                        $or: [{ name: { $containsi: searchText } }, { tags: { name: { $containsi: searchText } } }]
                    } : {})
                }
                : {
                    isFeatured: true,
                    isActive: true,

                    directories: {
                        slug: {
                            $in: ["mindful-luxury-hotels"]
                        }
                    },
                    ...(searchText && useSearchText ? {
                        $or: [{
                            name: { $containsi: searchText }
                        }]
                    } : {})
                })
        };
        if (searchFilter?.country?.id)
            filter = {
                ...filter,
                country: { id: searchFilter.country.id }
            };

        if (searchFilter?.selectedTags?.length > 0) {
            const tags = searchFilter.selectedTags.map((tag) =>
                tag.name.toLowerCase()
            );
            filter = {
                ...filter,
                ...(type === "experiences"
                    ? { tags: { name: { $in: appliedTag ? [appliedTag.name.toLowerCase()] : tags } } }
                    : { postcards: { tags: { name: { $in: appliedTag ? [appliedTag.name.toLowerCase()] : tags } } } })
            };
        } else if (searchFilter?.tagGroups) {
            filter = {
                ...filter,
                ...(type === "experiences"
                    ? { tags: { tag_group: searchFilter?.tagGroups } }
                    : { postcards: { tags: { tag_group: searchFilter?.tagGroups } } })
            };
        }
        if (searchFilter?.category) {
            filter = {
                ...filter,
                ...(type === "experiences"
                    ? { album: { category: { id: searchFilter.category.id } } }
                    : { category: { id: searchFilter.category.id } })
            }
        }
        setAppliedFilter(filter);
    };

    const getTagCheck = () => {
        return type === "experiences"
            ? appliedFilter?.tags?.name?.$in
            : appliedFilter?.postcards?.tags?.name?.$in;
    };
    const applyTagFilter = (filter, slicedTags) => {
        const tagFilter = { name: { $in: slicedTags } };
        return {
            ...filter,
            ...(type === "experiences"
                ? { tags: tagFilter }
                : { postcards: { tags: tagFilter } })
        };
    };

    const fetchMore = async () => {
        // let start = filteredData.length;
        let limit = 6;
        const tagCheck = getTagCheck();
        let filter = {
            ...appliedFilter,
        };
        if (tagCheck?.length > 50) {
            const slicedTags = tagCheck.slice(appliedTags, appliedTags + tagsBatchSize);
            filter = applyTagFilter(filter, slicedTags);
        }

        let moreData = await fetchPaginatedResults(
            type === "experiences" ? apiNames.postcard : apiNames.album,
            filter,
            type === "experiences" ? populatePostcardData : populateAlbumData,
            "createdAt:DESC",
            start,
            limit
        );
        // Ensure moreData is an array
        const newData = Array.isArray(moreData) ? moreData : [moreData];
        setAppliedTagsData(appliedTagsData?.concat(moreData));
        setFilteredData((prev) => {
            const existingIds = new Set(prev.map((item) => item.id)); // Assuming `id` is unique
            return [...prev, ...newData.filter((item) => !existingIds.has(item.id))];
        });
    };

    return (
        <Box mb="2em" mt={["0", "2em"]}>

            {type === "experiences" ? (
                loading ? (
                    <LoadingGif />
                ) : (
                    <TravelPostcardList
                        // canEdit={true}
                        postcards={
                            filteredData
                                ? Array.isArray(filteredData)
                                    ? filteredData
                                    : [filteredData]
                                : []
                        }
                        // isHomePage={true}
                        isPostcardsLoading={false}
                        mb="1em"
                        mt={["0", "1em"]}
                        hasMore={hasMore}
                        fetchMoreData={() => fetchMore()}
                        dataLength={filteredData?.length}
                    />
                )
            ) : loading ? (
                <LoadingGif />
            ) : (
                <NewStoryList
                    stories={
                        filteredData
                            ? Array.isArray(filteredData)
                                ? filteredData
                                : [filteredData]
                            : []
                    }
                    isStoriesLoading={false}
                    hasMore={hasMore}
                    fetchMoreData={() => fetchMore()}
                    // isHotel={true}
                    dataLength={filteredData?.length}
                />
            )}
        </Box>
    );
};
export default SearchResults;