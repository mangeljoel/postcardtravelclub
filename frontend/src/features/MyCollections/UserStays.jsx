import React, { useEffect, useState, useCallback, useContext } from 'react';
import { fetchPaginatedResults } from '../../queries/strapiQueries';
import { apiNames, populateAlbumData } from '../../services/fetchApIDataSchema';
import { Box, Heading, Flex, Link, Text, Button } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingGif from '../../patterns/LoadingGif';
import NewStoryList from '../TravelGuide/NewStoryList';
import AppContext from '../AppContext';
import GuidedSearchAlbum from "../GuidedSearch/GuidedSearchAlbum";
import axios from 'axios';
import SelectedTagList from '../Experiences/SelectedTagList';
import { RightArrowIcon } from '../../styles/ChakraUI/icons';

const UserStays = ({ slug, header }) => {
    const { isActiveProfile } = useContext(AppContext);
    const [stays, setStays] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [appliedTag, setAppliedTag] = useState(null);

    const fetchStays = useCallback(async () => {
        if (isFetching || !hasMore) return;

        setIsFetching(true);
        try {
            const queryParts = [];
            queryParts.push(`page=${page}`);
            queryParts.push(`pageSize=6`);
            if (filter?.country && filter?.country?.id !== -1) queryParts.push(`country=${filter?.country?.id}`);
            if (filter?.environment && filter?.environment?.id !== -1) queryParts.push(`environment=${filter?.environment?.id}`);
            if (filter?.category && filter?.category?.id !== -1) queryParts.push(`category=${filter?.category?.id}`);
            if (filter?.tagGroup && filter?.tagGroup?.id !== -1) queryParts.push(`tagGroup=${filter?.tagGroup?.id}`);
            if (slug) queryParts.push(`slug=${slug}`);
            if (appliedTag) queryParts.push(`selectedTag=${appliedTag?.id}`);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAlbums${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`,
                {
                    tags: filter?.selectedTags?.map(tag => tag.id) || [],
                },
            );

            if (data?.length) {
                setStays((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch stays:", error);
        } finally {
            setIsFetching(false);
            setInitialLoading(false);  // Set initial loading to false after first fetch
        }
    }, [slug, page, hasMore, isFetching, filter]);

    // Reset stays when slug or filter changes
    useEffect(() => {
        setStays([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);  // Reset initial loading when filter/slug changes
    }, [slug, filter, appliedTag]);

    useEffect(() => setAppliedTag(null), [filter]);

    // Fetch stays whenever page resets to 0 after a filter or slug change
    useEffect(() => {
        if (page === 1 && hasMore) {
            fetchStays();
        }
    }, [page, hasMore]);

    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });
        return (
            <Flex
                w="100%"
                // minH={["500px", "600px"]}
                mb={["10%", "3%"]}
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
                        Start collecting your favourite properties from the Postcard stays directory
                    </Text>
                    {/* {isActive && ( */}
                    <Button
                        variant={"none"}
                        color={"white"}
                        borderColor={"primary_1"}
                        mt={8}
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
                        href={"/stays"}
                        bg="primary_1"
                    >
                        Try Postcard Search &nbsp;
                        <RightArrowIcon
                            style={{ paddingTop: "1%" }}
                            h={["8.05vw", "3.06vw"]}
                            width={["2.77vw", "1.5vw"]}
                        />
                    </Button>
                    {/* )} */}
                </Flex>
            </Flex>
        );
    };

    const renderContent = () => {
        if (initialLoading) {
            return <LoadingGif />;
        }
        return stays?.length > 0 ?
            <NewStoryList mt={3} stories={stays} hasMore={hasMore} fetchMoreData={fetchStays} dataLength={stays?.length} isStoriesLoading={isFetching} />
            : renderEmptyState()
    };

    return (
        <Box
            w="100%"
            pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
        >
            {header && <Box mb={["1em", "3em"]} textAlign={"center"}><Heading>{header.title}</Heading>
                {/* <Text my="1em" fontFamily={"raleway"} fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">{header.subtitle}</Text> */}
            </Box>}
            {
                stays?.length > 0 && <GuidedSearchAlbum filter={filter} setFilter={setFilter} type={"profile-stays"} slug={slug} form='diary' />
            }

            <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

            {renderContent()}
        </Box>
    );
};

export default UserStays;