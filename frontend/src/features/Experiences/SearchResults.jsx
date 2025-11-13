import { Box } from "@chakra-ui/react";
import { useState, useEffect, useCallback, useRef } from "react";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import NewStoryList from "../TravelGuide/NewStoryList";
import LoadingGif from "../../patterns/LoadingGif";
import axios from "axios";

const SearchResults = ({ searchFilter, type, profile, canCreatePostcard, appliedTag, loading, setLoading }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [userRole, setUserRole] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load
    const apiPath = type === "experiences" ? "/postcards/getPostcards" : "/albums/getAlbums";

    const fetchingRef = useRef(false);
    const abortControllerRef = useRef(null);

    const getAuthToken = useCallback(() => {
        return (
            sessionStorage.getItem('strapi_jwt')
        );
    }, []);

    // Helper to get user ID from profile or storage
    const getUserId = useCallback(() => {
        // Try to get from profile prop
        if (profile?.id) return profile.id;
        if (profile?.user?.id) return profile.user.id;

        // Try to get from localStorage
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                return parsed?.id || parsed?.user?.id || null;
            }
        } catch (e) {
            console.error('Error parsing stored user:', e);
        }

        return null;
    }, [profile]);

    const fetchFilterIds = useCallback(async (filter) => {
        if (!filter || Object.keys(filter).length === 0) return {};

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

            const result = { ...filter };

            if (filter.country?.name && !filter.country?.id) {
                const id = getId(filter.country.name, response.data.country);
                if (id) result.country = { ...filter.country, id };
            }
            if (filter.region?.name && !filter.region?.id) {
                const id = getId(filter.region.name, response.data.region);
                if (id) result.region = { ...filter.region, id };
            }
            if (filter.category?.name && !filter.category?.id) {
                const id = getId(filter.category.name, response.data.category);
                if (id) result.category = { ...filter.category, id };
            }
            if (filter.tagGroup?.name && !filter.tagGroup?.id) {
                const id = getId(filter.tagGroup.name, response.data.tagGroup);
                if (id) result.tagGroup = { ...filter.tagGroup, id };
            }
            if (filter.selectedTags?.length > 0) {
                result.selectedTags = filter.selectedTags.map((tag) => {
                    if (tag.id) return tag;
                    const id = getId(tag.name, response.data.tags);
                    return id ? { ...tag, id } : tag;
                });
            }

            return result;
        } catch (error) {
            console.error("Error fetching filter IDs:", error);
            return filter;
        }
    }, [getAuthToken]);

    const fetchData = useCallback(async (pageNumber = 1) => {
        if (fetchingRef.current) {
            console.log("Request already in progress, skipping");
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        fetchingRef.current = true;

        if (pageNumber === 1) {
            setLoading(true);
        } else {
            setIsFetching(true);
        }

        try {
            const filterWithIds = await fetchFilterIds(searchFilter || {});

            const queryParts = [];
            queryParts.push(`page=${pageNumber}`);
            queryParts.push(`pageSize=6`);

            if (filterWithIds.searchText) {
                queryParts.push(`searchText=${encodeURIComponent(filterWithIds.searchText)}`);
            }
            if (filterWithIds.country?.id) queryParts.push(`country=${filterWithIds.country.id}`);
            if (filterWithIds.region?.id) queryParts.push(`region=${filterWithIds.region.id}`);
            if (filterWithIds.category?.id) queryParts.push(`category=${filterWithIds.category.id}`);
            if (filterWithIds.tagGroup?.id) queryParts.push(`tagGroup=${filterWithIds.tagGroup.id}`);
            if (appliedTag?.id) queryParts.push(`selectedTag=${appliedTag.id}`);

            const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api${apiPath}${queryParts.length > 0 ? `?${queryParts.join("&")}` : ""}`;

            // Get authentication details
            const token = getAuthToken();
            const userId = getUserId();

            console.log("Fetching URL:", url);
            console.log("Auth token present:", !!token);
            console.log("User ID:", userId);

            // Prepare request body
            const requestBody = {
                tags: filterWithIds.selectedTags?.map(tag => tag.id).filter(id => id) || [],
            };

            // Only add userId if we have one (as fallback)
            if (userId) {
                requestBody.userId = userId;
            }

            // Prepare headers
            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const { data } = await axios.post(
                url,
                requestBody,
                {
                    signal: abortControllerRef.current.signal,
                    headers
                }
            );

            console.log("Response data:", data);

            // Handle both old and new response formats
            let items, meta;
            if (data.data && data.meta) {
                // New secure format
                items = Array.isArray(data.data) ? data.data : [];
                meta = data.meta;

                if (meta.userRole) {
                    setUserRole(meta.userRole);
                    console.log("User role from backend:", meta.userRole, "Is admin:", meta.isAdmin);
                }
            } else {
                // Legacy format
                items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (Array.isArray(data?.items) ? data.items : []));
            }

            console.log("Normalized items length:", items.length);

            if (items.length) {
                // Backend now handles filtering, so we trust the response
                setFilteredData((prev) => (pageNumber === 1 ? items : [...prev, ...items]));
                setHasMore(items.length >= 6);
            } else {
                setHasMore(false);
                if (pageNumber === 1) setFilteredData([]);
            }
        } catch (error) {
            if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
                console.log("Request cancelled");
            } else {
                console.error("Error fetching data:", error);
                if (error.response) {
                    console.error("Response status:", error.response.status);
                    console.error("Response data:", error.response.data);
                }
                setHasMore(false);
            }
        } finally {
            fetchingRef.current = false;
            if (pageNumber === 1) {
                setLoading(false);
                setIsInitialLoad(false); // Mark initial load as complete
            } else {
                setIsFetching(false);
            }
        }
    }, [searchFilter, appliedTag, apiPath, fetchFilterIds, setLoading, getAuthToken, getUserId]);

    useEffect(() => {
        setFilteredData([]);
        setPage(1);
        setIsInitialLoad(true); // Reset initial load flag
        fetchData(1);

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            fetchingRef.current = false;
        };
    }, [searchFilter, appliedTag, profile]);

    const fetchMore = () => {
        if (!hasMore || isFetching || fetchingRef.current) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
    };

    // Debug logging
    useEffect(() => {
        const token = getAuthToken();
        const userId = getUserId();
        console.log("SearchResults mounted/updated");
        console.log("Has auth token:", !!token);
        console.log("User ID:", userId);
        console.log("User role:", userRole);
        console.log("Profile prop:", profile);
    }, [getAuthToken, getUserId, userRole, profile]);

    // Show loading spinner on initial load only
    if (isInitialLoad && loading) {
        return (
            <Box mb="2em" mt={["0", "2em"]}>
                <LoadingGif />
            </Box>
        );
    }

    return (
        <Box mb="2em" mt={["0", "2em"]}>
            {type === "experiences" ? (
                <TravelPostcardList
                    postcards={filteredData}
                    isPostcardsLoading={isFetching}
                    mb="1em"
                    mt={["0", "1em"]}
                    hasMore={hasMore}
                    fetchMoreData={fetchMore}
                    dataLength={filteredData?.length}
                />
            ) : (
                <NewStoryList
                    stories={filteredData}
                    isStoriesLoading={isFetching}
                    hasMore={hasMore}
                    fetchMoreData={fetchMore}
                    dataLength={filteredData?.length}
                />
            )}
        </Box>
    );
};

export default SearchResults;