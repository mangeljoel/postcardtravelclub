import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { apiNames, populatePostcardData } from "../../services/fetchApIDataSchema";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import GuidedSearchPostcard from "../GuidedSearch/GuidedSearchPostcard";
import axios from "axios";
import SelectedTagList from "../Experiences/SelectedTagList";
import { RightArrowIcon } from "../../styles/ChakraUI/icons";

const UserPostcards = ({ slug, header }) => {
    const { isActiveProfile } = useContext(AppContext);
    const [postcards, setPostcards] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [appliedTag, setAppliedTag] = useState(null);

    // --- NEW: refs + helpers for cancellation / deduplication / auth
    const fetchingRef = useRef(false);
    const abortControllerRef = useRef(null);

    const getAuthToken = useCallback(() => {
        try {
            return sessionStorage.getItem('strapi_jwt');
        } catch (e) {
            return null;
        }
    }, []);

    const getUserId = useCallback(() => {
        // Try to get from local storage or fallback to profile inside filter
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return parsed?.id || parsed?.user?.id || null;
            }
        } catch (e) {
            // ignore
        }
        return null;
    }, []);

    // Helper: map filter names -> IDs using /api/albums/getFilters (same approach as SearchResults)
    const fetchFilterIds = useCallback(async (f) => {
        if (!f || Object.keys(f).length === 0) return {};
        try {
            const token = getAuthToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getFilters`,
                { tags: [] },
                { headers }
            );

            const getId = (name, list) => {
                const match = list?.find((item) => item.name.toLowerCase() === name.toLowerCase());
                return match?.id || null;
            };

            const result = { ...f };

            if (f.country?.name && !f.country?.id) {
                const id = getId(f.country.name, response.data.country);
                if (id) result.country = { ...f.country, id };
            }
            if (f.region?.name && !f.region?.id) {
                const id = getId(f.region.name, response.data.region);
                if (id) result.region = { ...f.region, id };
            }
            if (f.category?.name && !f.category?.id) {
                const id = getId(f.category.name, response.data.category);
                if (id) result.category = { ...f.category, id };
            }
            if (f.tagGroup?.name && !f.tagGroup?.id) {
                const id = getId(f.tagGroup.name, response.data.tagGroup);
                if (id) result.tagGroup = { ...f.tagGroup, id };
            }
            if (f.selectedTags?.length > 0) {
                result.selectedTags = f.selectedTags.map((tag) => {
                    if (tag.id) return tag;
                    const id = getId(tag.name, response.data.tags);
                    return id ? { ...tag, id } : tag;
                });
            }

            return result;
        } catch (error) {
            console.error("Error fetching filter IDs:", error);
            return f;
        }
    }, [getAuthToken]);

    // --- UPDATED fetchPostcards
    const fetchPostcards = useCallback(async () => {
        if (fetchingRef.current) {
            console.log("Request already in progress, skipping");
            return;
        }

        // If no more items, skip
        if (!hasMore) return;

        // Setup abort controller
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        fetchingRef.current = true;

        // UI state
        if (page === 1) setInitialLoading(true);
        setIsFetching(true);

        try {
            // Ensure filter names -> ids
            const filterWithIds = await fetchFilterIds(filter || {});

            const queryParts = [];
            queryParts.push(`page=${page}`);
            queryParts.push(`pageSize=6`);
            if (filterWithIds?.country && filterWithIds.country?.id !== -1) queryParts.push(`country=${filterWithIds.country.id}`);
            if (filterWithIds?.environment && filterWithIds.environment?.id !== -1) queryParts.push(`environment=${filterWithIds.environment.id}`);
            if (filterWithIds?.category && filterWithIds.category?.id !== -1) queryParts.push(`category=${filterWithIds.category.id}`);
            if (filterWithIds?.tagGroup && filterWithIds.tagGroup?.id !== -1) queryParts.push(`tagGroup=${filterWithIds.tagGroup.id}`);
            if (slug) queryParts.push(`slug=${slug}`);
            if (appliedTag) queryParts.push(`selectedTag=${appliedTag?.id}`);

            const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getPostcards${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`;

            // Build request body
            const requestBody = {
                tags: filterWithIds?.selectedTags?.map(t => t.id).filter(Boolean) || [],
            };

            // Add userId if available
            const userId = getUserId();
            if (userId) requestBody.userId = userId;

            const headers = {};
            const token = getAuthToken();
            if (token) headers.Authorization = `Bearer ${token}`;

            console.log("Fetching postcards URL:", url, "body:", requestBody, "headers present:", !!token);

            const res = await axios.post(url, requestBody, {
                signal: abortControllerRef.current.signal,
                headers
            });

            // Accept both new and legacy response formats
            let items = [];
            const data = res?.data;
            if (data?.data && data?.meta) {
                // new secure format
                items = Array.isArray(data.data) ? data.data : [];
                // option: extract meta.userRole if you need to
            } else {
                // legacy
                items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (Array.isArray(data?.items) ? data.items : []));
            }

            console.log("Fetched postcards count:", items.length, "page:", page);

            if (items.length > 0) {
                setPostcards(prev => page === 1 ? items : [...prev, ...items]);
                setPage(prev => prev + 1);
                setHasMore(items.length >= 6);
            } else {
                // no items returned
                if (page === 1) setPostcards([]);
                setHasMore(false);
            }
        } catch (error) {
            if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
                console.log("Postcards fetch cancelled");
            } else {
                console.error("Failed to fetch postcards:", error);
                if (error?.response) {
                    console.error("Response status:", error.response.status, error.response.data);
                }
                setHasMore(false);
            }
        } finally {
            fetchingRef.current = false;
            setIsFetching(false);
            setInitialLoading(false);
        }
    }, [page, filter, appliedTag, slug, fetchFilterIds, getAuthToken, getUserId, hasMore]);

    // Reset postcards when slug or filter changes
    useEffect(() => {
        // Cancel any in-flight fetch
        if (abortControllerRef.current) abortControllerRef.current.abort();
        fetchingRef.current = false;

        setPostcards([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);

        // trigger fresh fetch for page 1
        // fetchPostcards will execute because page === 1 in effect below
    }, [slug, filter, appliedTag]);

    useEffect(() => setAppliedTag(null), [filter]);

    // Fetch postcards whenever page changes and hasMore is true
    useEffect(() => {
        if (!hasMore) return;
        fetchPostcards();
        // cleanup on unmount
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            fetchingRef.current = false;
        };
    }, [page]); // intentionally only depend on page so increment triggers fetch

    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });
        return isActive ? (
            <Flex
                w="100%"
                mb={["10%", "3%"]}
                py={["10%", "3%"]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Flex
                    // h={["auto", "8.75vw"]}
                    w="100%"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text
                        maxW={["70vw", "40vw"]}
                        fontSize={["4vw", "1.67vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                        textAlign="center"
                    >
                        {"Start building your travel wish-list by collecting Postcard experiences"}
                    </Text>

                    <Button
                        variant={"none"}
                        color={"white"}
                        borderColor={"primary_1"}
                        my={8}
                        border={"2px"}
                        w={["63.05vw", "24.08vw"]}
                        h={["8.05vw", "3.06vw"]}
                        textAlign={"center"}
                        borderRadius={["5.55vw", "2.08vw"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["3.33vw", "1.22vw"]}
                        lineHeight={["10vw", "3.77vw"]}
                        _hover={{ background: "#EFE9E4", color: "primary_1" }}
                        as={Link}
                        href="/experiences"
                        bg="primary_1"
                    >
                        Try Postcard Search &nbsp;
                        <RightArrowIcon
                            style={{ paddingTop: "1%" }}
                            h={["8.05vw", "3.06vw"]}
                            width={["2.77vw", "1.5vw"]}
                        />
                    </Button>
                </Flex>
            </Flex>
        ) : (
            <Flex
                w="100%"
                py={["15%", 0]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Text
                    maxW={["50vw", "27vw"]}
                    fontSize={["4vw", "1.67vw"]}
                    fontFamily="lora"
                    fontStyle="italic"
                    textAlign="center"
                >
                    No Postcards Collected
                </Text>
            </Flex>
        );
    };

    const renderContent = () => {
        if (initialLoading) {
            return <LoadingGif />;
        }
        return postcards?.length > 0 ?
            <TravelPostcardList
                mt={6}
                canEdit
                postcards={postcards}
                hasMore={hasMore}
                fetchMoreData={() => {
                    if (!isFetching && hasMore && !fetchingRef.current) {
                        // increment page to trigger useEffect fetch
                        setPage(prev => prev + 1);
                    }
                }}
                isPostcardsLoading={isFetching}
                dataLength={postcards?.length}
            />
            : renderEmptyState()
    };

    return (
        <Box
            w="100%"
            pl={{ base: "5%", lg: "10%" }}
            pr={{ base: "5%", lg: "10%" }}
        >
            {header && <Box mb={["1em", "3em"]} textAlign={"center"}><Heading>{header.title}</Heading>
                {/* <Text my="1em" fontFamily={"raleway"} fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">{header.subtitle}</Text> */}
            </Box>}
            {
                postcards.length > 0 && <GuidedSearchPostcard type={"profile-postcards"} filter={filter} setFilter={setFilter} slug={slug} form="diary" />
            }

            <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

            {renderContent()}
        </Box >
    )
};

export default UserPostcards;
