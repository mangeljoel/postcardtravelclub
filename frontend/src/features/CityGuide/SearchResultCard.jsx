import { Box, Button, Flex, Text, Link } from "@chakra-ui/react";
import { useState, useEffect, useRef, useContext } from "react";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import NewStoryList from "../TravelGuide/NewStoryList";
import LoadingGif from "../../patterns/LoadingGif";
import strapi from "../../queries/strapi";
import axios from "axios";
import InfiniteMasonry from "../../patterns/InfiniteMasonry";
import FNDCard from "../../patterns/Cards/FNDCard";
import { deleteDBEntry } from "../../queries/strapiQueries";
import DxStaysForm from "../DestinationExpert/Stays/DxStaysForm";
import AppContext from "../AppContext";
import InfiniteGrid from "../../patterns/InfiniteGrid";
import FloatingAddButton from "../../patterns/AddButton";
import { useCallback } from "react";

const SearchResultCard = ({ searchFilter, slug, isDiary, type, appliedTag, loading, canEdit, openEditForm, setLoading, useUniformGrid = false, blocking = false }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { profile, isActiveProfile } = useContext(AppContext);
    const [createModal, setOpenCreateModal] = useState({ show: false, mode: "create" });
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const apiPath = type === "experiences" ? "/postcards/getPostcards" : "/albums/getAlbums";

    const containerRef = useRef(null);

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

    const fetchData = async (pageNumber = 1) => {
        if (pageNumber === 1) setLoading(true);
        else setIsFetching(true)
        try {
            const queryParts = [];
            queryParts.push(`page=${pageNumber}`);
            queryParts.push(`pageSize=6`);


            if (type === "shopping") queryParts.push(`type=shopping-conscious-luxury-travel`);
            if (type === "restaurant") queryParts.push(`type=food-and-beverages`);
            if (type === "events") queryParts.push(`type=events`);
            if (isDiary && slug) queryParts.push(`slug=${slug}`);
            if (searchFilter?.searchText) queryParts.push(`searchText=${searchFilter?.searchText}`);
            if (searchFilter?.country && searchFilter?.country?.id !== -1) queryParts.push(`country=${searchFilter?.country?.id}`);
            if (searchFilter?.region && searchFilter?.region?.id !== -1) queryParts.push(`region=${searchFilter?.region?.id}`);
            if (searchFilter?.environment && searchFilter?.environment?.id !== -1) queryParts.push(`environment=${searchFilter?.environment?.id}`);
            if (searchFilter?.category && searchFilter?.category?.id !== -1) queryParts.push(`category=${searchFilter?.category?.id}`);
            if (searchFilter?.tagGroup && searchFilter?.tagGroup?.id !== -1) queryParts.push(`tagGroup=${searchFilter?.tagGroup?.id}`);
            if (appliedTag) queryParts.push(`selectedTag=${appliedTag?.id}`);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api${apiPath}${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`,
                {
                    cuisines: searchFilter?.selectedCategory?.map(cat => cat.id) || []
                },
            );

            // console.log('🛍️ Shopping API response:', data);

            if (data) {
                if (data?.data) setFilteredData((prev) => [...prev, ...data?.data]);
                else setFilteredData((prev) => [...prev, ...data]);
                setHasMore(data.length >= 6);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching shopping data:", error);
        }
        if (pageNumber === 1) setLoading(false);
        else setIsFetching(false);
    };

    useEffect(() => {
        fetchInitialData();
    }, [searchFilter, appliedTag]);

    const fetchInitialData = () => {
        setFilteredData([]);
        setPage(1);
        fetchData(1);
    }

    const fetchMore = () => {
        if (!hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
    };

    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });
        return (
            <Flex
                w="100%"
                my="5%"
                py={["15%", 0]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Flex
                    h={["20vw", "8.75vw"]}
                    w="100%"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text
                        maxW={["70vw", "27vw"]}
                        fontSize={["4vw", "1.67vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                        textAlign="center"
                    >
                        {isActive ? "You have 0 Shopping collected, Start Collecting now :)" : "No Shopping Collected"}
                    </Text>
                    {isActive && (
                        <Text
                            as={Link}
                            href={"/shopping"}
                            fontSize={["4vw", "1.67vw"]}
                            fontFamily="raleway"
                            fontWeight={500}
                            textAlign="center"
                            textDecoration="underline"
                            color="primary_3"
                        >
                            {"Shopping"}
                        </Text>
                    )}
                </Flex>
            </Flex>
        );
    };

    return (
        <Box mb="2em" mt={["0", "2em"]} ref={containerRef}>
            {profile && !isDiary && ["Admin", "SuperAdmin", "EditorInChief", "EditorialAdmin"].includes(profile?.user_type?.name) &&
                // <Button mb="2em" onClick={() => setOpenCreateModal({ show: true, mode: "create" })}>
                //     {type === "shopping"
                //         ? "Add new Shopping Item"
                //         : type === "events"
                //             ? "Add new Event"
                //             : "Add new Restaurant"}


                // </Button>
                <FloatingAddButton
                    onClick={() => setOpenCreateModal({ show: true, mode: "create" })}
                    containerRef={containerRef}        // keeps it visible only in section
                    type={type}
                    blocking
                />
            }

            {loading ? (
                <LoadingGif />
            ) : (
                <>
                    {useUniformGrid ? (
                        // Use InfiniteGrid for uniform layout (like other tabs)
                        <InfiniteGrid
                            gridItems={filteredData?.map((card, index) =>
                                <FNDCard
                                    key={card.id}
                                    data={card}
                                    canEdit={canEdit}
                                    handleDelete={async (id) => { await deleteDBEntry("albums", id); fetchInitialData(); }}
                                    openEditForm={(e) => setOpenCreateModal({ show: true, mode: "edit", data: e })}
                                />)}
                            hasMore={hasMore}
                            fetchMoreData={() => fetchMore()}
                            loading={loading}
                            emptyState={isDiary ? renderEmptyState() : null}
                        />
                    ) : (

                        <InfiniteMasonry
                            masonryItems={filteredData?.map((card, index) =>
                                <FNDCard
                                    key={card.id}
                                    data={card}
                                    canEdit={canEdit}
                                    handleDelete={async (id) => { await deleteDBEntry("albums", id); fetchInitialData(); }}
                                    openEditForm={(e) => setOpenCreateModal({ show: true, mode: "edit", data: e })}
                                />)}
                            emptyState={isDiary ? renderEmptyState : null}
                            hasMore={hasMore}
                            fetchMoreData={() => fetchMore()}
                            dataLength={filteredData.length}
                            loading={loading}
                        />
                    )}
                </>
            )}

            {profile && !isDiary && filteredData?.length > 6 && ["Admin", "SuperAdmin", "EditorInChief", "EditorialAdmin"].includes(profile?.user_type?.name) &&
                <Button mb="2em" onClick={() => setOpenCreateModal({ show: true, mode: "create" })}>
                    {type === "shopping" ? "Add new Shopping Item" : "Add new Restaurant"}
                </Button>
            }

            {/* ✅ Shopping-specific form modal */}
            <DxStaysForm
                isOpen={createModal.show}
                headerText={
                    createModal.mode === "create"
                        ? type === "shopping"
                            ? "Create Shopping Item"
                            : type === "restaurant"
                                ? "Create Restaurant"
                                : type === "events"
                                    ? "Create Event"
                                    : "Create Item"
                        : type === "shopping"
                            ? "Edit Shopping Item"
                            : type === "restaurant"
                                ? "Edit Restaurant"
                                : type === "events"
                                    ? "Edit Event"
                                    : "Edit Item"
                }

                onClose={() => {
                    setOpenCreateModal(false);
                    fetchInitialData();
                }}
                mode={createModal.mode}
                type={type}
                initialFormValues={createModal.data}
            />
        </Box>
    );
};

export default SearchResultCard;