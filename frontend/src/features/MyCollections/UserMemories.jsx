import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { createDBEntry, fetchPaginatedResults, updateDBValue } from "../../queries/strapiQueries";
import { Box, Flex, Heading, Text, Button, useToast, Link } from "@chakra-ui/react";
import MemoriesCard from "./MemoriesCard";
import InfiniteGrid from "../../patterns/InfiniteGrid";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import UserMemoriesForm from "./UserMemoriesForm";
import CountryFilter from "../AllTours/CountryFilter"
import { useCountries } from "../../hooks/useCountriesHook";
import GuidedSearchMemories from "../GuidedSearch/GuidedSearchMemories";
import FloatingAddButton from "../../patterns/AddButton";

const PAGE_SIZE = 6;

const UserMemories = ({ slug, dxCardMaps = {}, dxCardIds = [], header }) => {
    const fileInputRef = useRef();
    const { isActiveProfile } = useContext(AppContext);
    const { profile } = useContext(AppContext);

    const isOwner = isActiveProfile({ slug });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const countries = useCountries('memories', slug, null, [slug, data])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // Simplified state for selected files
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const toast = useToast();

    const containerRef = useRef(null);
    const filtersRef = useRef(null);

    const MAX_IMAGES = 6;

    const handleAddNew = () => {
        fileInputRef.current?.click(); // open native picker first
    }

    const handleFilesSelected = async (e) => {
        let files = Array.from(e.target.files);
        if (!files.length) return;

        if (files.length > MAX_IMAGES) {
            toast({
                title: `You can only add up to ${MAX_IMAGES} images.`,
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            files = files.slice(0, MAX_IMAGES);
        }

        // Convert files to the format expected by UserMemoriesForm
        const imageObjects = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file,
            needsUpload: true
        }));

        // Set up initial memory data with selected images
        const memoryForForm = {
            name: '',
            date: null,
            intro: '',
            country: null,
            region: null,
            signature: '',
            externalUrl: '',
            shareType: 'private',
            gallery: imageObjects
        };

        setSelectedMemory(memoryForForm);
        setSelectedFiles(files);
        setShowForm(true);

        // Clear the file input
        e.target.value = "";
    };

    const fetchMemories = useCallback(
        async (pageNumber = 1) => {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setIsFetching(true);
            }

            try {
                const filters = { user: { slug } };

                if (filter?.country) {
                    const countryId =
                        typeof filter.country === "number"
                            ? filter.country
                            : filter.country?.id;
                    if (countryId && countryId !== -1) filters.country = countryId;
                }

                if (filter?.region) {
                    const regionId =
                        typeof filter.region === "number"
                            ? filter.region
                            : filter.region?.id;
                    if (regionId && regionId !== -1) filters.region = regionId;
                }

                if (filter?.year) {
                    const yearValue =
                        typeof filter.year === "number"
                            ? filter.year
                            : filter.year?.id || filter.year?.name;
                    if (yearValue && yearValue !== -1) {
                        filters.date = {
                            $gte: `${yearValue}-01-01`,
                            $lte: `${yearValue}-12-31`
                        };
                    }
                }

                const populate = {
                    gallery: true,
                    country: true,
                    region: true,
                    postcard: { album: true },
                    album: true,
                    dx_card: true,
                };

                const res = await fetchPaginatedResults(
                    "memories",
                    filters,
                    populate,
                    "date:DESC",
                    PAGE_SIZE,
                    (pageNumber - 1) * PAGE_SIZE
                );

                const resData = Array.isArray(res) ? res : res ? [res] : [];

                const filteredData = isOwner
                    ? resData
                    : resData.filter(
                        (memory) =>
                            memory.shareType === 'public' &&
                            memory.gallery?.length > 0
                    );
                setData((prev) => {
                    if (pageNumber === 1) return filteredData;
                    // Prevent duplicates by ID
                    const prevIds = new Set(prev.map((m) => m.id));
                    const newItems = filteredData.filter((m) => !prevIds.has(m.id));
                    return [...prev, ...newItems];
                });

                setHasMore(filteredData.length >= PAGE_SIZE);
                setPage(pageNumber);
            } catch (err) {
                console.error("Manual fetch failed", err);
                setHasMore(false);
            } finally {
                if (pageNumber === 1) {
                    setLoading(false);
                } else {
                    setIsFetching(false);
                }
            }
        },
        [slug, filter, isOwner]
    );

    const fetchMore = () => {
        if (!hasMore || isFetching) return;
        fetchMemories(page + 1);
    };

    // Fetch first page when filter or owner status changes
    useEffect(() => {
        if (filter) {
            setHasMore(true);
            fetchMemories(1);
        }
    }, [filter, isOwner, fetchMemories]);

    // Initialize filter when slug changes
    useEffect(() => {
        if (slug) {
            setFilter({ user: { slug }, country: null, region: null, year: null });
        }
    }, [slug]);

    const addNewMemoryToFirst = (newMemoryResult) => {
        try {
            const newMemory = newMemoryResult?.data || newMemoryResult;

            if (newMemory && newMemory.id) {
                setData((prev) => {
                    const updatedData = prev.map((memory) =>
                        memory.id === newMemory.id ? newMemory : memory
                    );

                    const memoryExists = prev.some((memory) => memory.id === newMemory.id);
                    if (!memoryExists) {
                        return [newMemory, ...prev];
                    }

                    return updatedData;
                });
            } else {
                console.warn("Invalid memory result, refetching...");
                fetchMemories(1);
            }
        } catch (error) {
            console.error("Error in addNewMemoryToFirst:", error);
            fetchMemories(1);
        }
    };

    const renderEmptyState = () => {
        return isOwner ? (
            <Flex
                w="100%"
                mb={["10%", "0%"]}
                py={["10%", "3%"]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Flex
                    // h={["20vw", "8.75vw"]}
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
                        Remember your best moments on the Postcard memory time line
                    </Text>

                    {/* <Button
                        as={Link}
                        href="/experiences"
                        fontSize={["4vw", "1.67vw"]}
                        fontFamily="raleway"
                        fontWeight={500}
                        textAlign="center"
                        // textDecoration="underline"
                        color="white"
                    >
                        Discover Experiences
                    </Button> */}

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
                    maxW={["70vw", "27vw"]}
                    fontSize={["4vw", "1.67vw"]}
                    my={[5, 10]}
                    fontFamily="lora"
                    fontStyle="italic"
                    textAlign="center"
                >
                    No Public Memories Available
                </Text>
            </Flex>
        );
    };

    const renderContent = () => {
        return (
            <Box ref={containerRef} w="100%" px={{ base: "5%", lg: "10%" }} pb={{ base: "5%", lg: "10%" }} textAlign="center" position={"relative"}>
                {header && (
                    <Box mb={["1em", "3em"]}>
                        <Heading>{header.title}</Heading>
                        {/* <Text my="1em" fontFamily="raleway" fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">
                            {header.subtitle}
                        </Text> */}
                    </Box>
                )}
                {data?.length > 0 &&
                    <GuidedSearchMemories filter={filter} setFilter={setFilter} slug={slug} form="diary" />}

                {/*  Add Memory Button - Only show to owner */}
                {isOwner && (
                    <FloatingAddButton
                        onClick={handleAddNew}
                        isVisible={!showForm}
                        containerRef={containerRef}
                        startFromFilters={data?.length > 0}
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFilesSelected}
                />

                {/* Conditional Form Display - Only show to owner */}
                {showForm && isOwner && (
                    <UserMemoriesForm
                        isOpen={showForm}
                        onClose={() => {
                            setShowForm(false);
                            setSelectedMemory(null);
                            setSelectedFiles([]);
                        }}
                        onRefresh={fetchMemories}
                        initialData={selectedMemory}
                        onSuccess={(newMemoryResult) => {
                            setShowForm(false);
                            setSelectedMemory(null);
                            setSelectedFiles([]);

                            if (selectedMemory?.id) {
                                fetchMemories(1);
                            } else {
                                // For new memories, use the add function
                                if (newMemoryResult) {
                                    addNewMemoryToFirst(newMemoryResult);
                                } else {
                                    fetchMemories(1);
                                }
                            }
                        }}
                    />
                )}

                {data?.length > 0 ? (
                    <>
                        {!loading ? <InfiniteGrid
                            gridItems={data
                                .map((memory) => (
                                    <MemoriesCard
                                        key={memory.id}
                                        card={memory}
                                        user={profile}
                                        isOwner={isOwner}
                                        memories={data}
                                        setMemories={setData}
                                        refreshMemories={fetchMemories}
                                    />
                                ))
                            }
                            hasMore={hasMore}
                            fetchMoreData={fetchMore}
                            dataLength={data.length}
                            isLoading={isFetching}
                        /> : <LoadingGif />}
                    </>
                ) : (
                    renderEmptyState()
                )}
            </Box>
        );
    };

    return renderContent();
};

export default UserMemories;