import React, { useEffect, useState, useCallback, useContext } from 'react';
import { fetchPaginatedResults } from '../../queries/strapiQueries';
import { apiNames, populateAlbumData } from '../../services/fetchApIDataSchema';
import { Box, Flex, Link, Text } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingGif from '../../patterns/LoadingGif';
import NewStoryList from '../TravelGuide/NewStoryList';
import AppContext from '../AppContext';
import CountryFilter from '../TagResultPage/CountryFilter'

const UserTours = ({ slug }) => {
    const { isActiveProfile } = useContext(AppContext);
    const [tours, setTours] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filter, setFilter] = useState({});

    const fetchTours = useCallback(async () => {
        if (isFetching || !hasMore) return;

        setIsFetching(true);
        try {
            const queryFilters = {
                follow_albums: { follower: { slug } },
                isFeatured: true,
                isActive: true,

                directories: { slug: { $in: ['mindful-luxury-tours'] } },
            };

            const andConditions = [];
            if (filter?.country) {
                andConditions.push({ country: filter.country });
            }
            if (filter?.selectedTags?.length > 0) {
                andConditions.push({
                    postcards: {
                        tags: {
                            name: {
                                $in: filter.selectedTags.map((tag) => tag.name.toLowerCase()),
                            },
                        },
                    }
                });
            }

            if (andConditions.length > 0) {
                queryFilters.$and = andConditions;
            }

            const response = await fetchPaginatedResults(
                apiNames.album,
                queryFilters,
                populateAlbumData,
                undefined,
                page * 6, // Offset
                6 // Limit
            );

            if (response) {
                setTours((prev) => [...prev, ...(Array.isArray(response) ? response : [response])]);
                setPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        } finally {
            setIsFetching(false);
            setInitialLoading(false)
        }
    }, [slug, page, hasMore, isFetching, filter]);

    // Reset tours when slug or filter changes
    useEffect(() => {
        setTours([]);
        setPage(0);
        setHasMore(true);
        setInitialLoading(true)
    }, [slug, filter]);

    // Fetch stays whenever page resets to 0 after a filter or slug change
    useEffect(() => {
        if (page === 0 && hasMore) {
            fetchTours();
        }
    }, [page, hasMore]);

    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });
        return (
            <Flex
                w="100%"
                minH={["500px", "600px"]}
                py={["15%", 0]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                {isActive ? (
                    <Flex
                        h={["20vw", "8.75vw"]}
                        w="100%"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Text
                            maxW={["50vw", "27vw"]}
                            fontSize={["4vw", "1.67vw"]}
                            fontFamily="lora"
                            fontStyle="italic"
                            textAlign="center"
                        >
                            {'You have 0 Tours collected, Start Collecting now :)'}
                        </Text>
                        <Text
                            as={Link}
                            href={'/tours'}
                            fontSize={["4vw", "1.67vw"]}
                            fontFamily="raleway"
                            fontWeight={500}
                            textAlign="center"
                            textDecoration="underline"
                            color="primary_3"
                        >
                            Tours
                        </Text>
                    </Flex>
                ) : (
                    <Text
                        maxW={["50vw", "27vw"]}
                        fontSize={["4vw", "1.67vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                        textAlign="center"
                    >
                        No Tours Collected
                    </Text>
                )}
            </Flex>
        );
    };

    const renderContent = () => {
        if (initialLoading) {
            return <LoadingGif />;
        }
        return tours?.length > 0 ?
            <NewStoryList mt={3} stories={tours} isStoriesLoading={isFetching} hasMore={hasMore} fetchMoreData={fetchTours} dataLength={tours.length} />
            : renderEmptyState()
    };

    return (
        <Box
            w="100%"
            pl={{ base: "5%", lg: "10%" }}
            pr={{ base: "5%", lg: "10%" }}
        >
            <CountryFilter filter={filter} setFilter={setFilter} type="tours" forProfile={true} slug={slug} />
            {renderContent()}
        </Box>
    )
};

export default UserTours;