import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import CustomCard from "../CustomCard";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import { createDBEntry } from "../../../queries/strapiQueries";

const TextCard = ({ profile }) => (
    <Flex
        bg={"primary_3"}
        w={["88.9vw", "37.45vw"]}
        // h={["auto", "30vw"]}
        h={["auto", "460px"]}
        mx={["5.55vw", "1.56vw"]}
        mr={["5.55vw", "0"]}
        borderRadius={["3.611vw", "1.53vw"]}
        flexDirection={"column"}
        p={"5.56vw"}
        pl={["10vw", "5.56vw"]}
        py={["25.65vw", "0vw"]}
        justifyContent="center"
        gap={["4vw", "2vw"]}
        style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        flexShrink={0}
    >
        <Text
            fontFamily={"raleway"}
            fontWeight={500}
            fontSize={["5.833vw", "2.25vw"]}
            lineHeight={["6.67vw", "2.65vw"]}
            color={"#EFE9E4"}
        >
            <Text
                as="span"
                fontSize={["6.38vw", "2.35vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                fontFamily="lora"
                fontStyle="italic"
            >
                Discover Postcard Experiences by popular regions in INDIA.
            </Text>
        </Text>
    </Flex>
);

const FeaturedRegionsSection = ({ regionStats = [], loading = false }) => {
    const scrollContainerRef = useRef(null);
    const router = useRouter();
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

            scrollContainerRef.current.scrollTo({
                left: atEnd ? 0 : scrollLeft + 300,
                behavior: "smooth",
            });
        }
    };
    const { profile } = useContext(AppContext)

    // Show loading state
    if (loading) {
        return (
            <Flex
                flexDirection="column"
                gap={["12.22vw", "4.42vw"]}
                mb={["14.16vw", "0vw"]}
                w="100%"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">Loading regions...</Text>
            </Flex>
        );
    }

    // Show empty state
    if (!regionStats || regionStats.length === 0) {
        return (
            <Flex
                flexDirection="column"
                gap={["12.22vw", "4.42vw"]}
                mb={["14.16vw", "0vw"]}
                w="100%"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">No regions available</Text>
            </Flex>
        );
    }

    // Transform region stats to match CustomCard format and limit to 6
    // Transform region stats to match CustomCard format and limit to 6
    const formattedRegions = regionStats
        .filter(region => region.country === "India") // ✅ only include Indian regions
        .slice(0, 6) // ✅ take first 6
        .map(region => ({
            name: region.name,
            slug: region.slug,
            imageUrl: region.coverImage?.url || "/assets/default-region.jpg",
            stats: region.stats,
            country: region.country || null,
            link: `/experiences/countries/India?region=${region.name}`,
        }));


    return (
        <Flex
            flexDirection="column"
            gap={["12.22vw", "4.42vw"]}
            mb={["14.16vw", "0vw"]}
            w="100%"
        >
            {/* ---------- MOBILE VIEW (STACKED) ---------- */}
            <Box display={["block", "none"]}>
                <TextCard profile={profile} />
                <Flex
                    flexDirection="column"
                    mt="6vw"
                >
                    <Flex
                        overflowX="auto"
                        className="no-scrollbar"
                        gap={["3.88vw", "1.56vw"]}
                        px={["5.55vw", "0"]}
                        py={["4.44vw", "0"]}
                    >
                        {formattedRegions.map((region, index) => (
                            <Box
                                key={region.slug || index}
                                cursor="pointer"
                                onClick={async () => {
                                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: region?.name, type: "region", searchFor: "experience" } });
                                    router.push(region.link)
                                }}
                            >
                                <CustomCard story={region} />
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Box>

            {/* ---------- DESKTOP/TABLET VIEW (HORIZONTAL SCROLL) ---------- */}
            <Box position="relative" w="100%" display={["none", "block"]}>
                <Flex
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                    py={["4.44vw", "3.33vw"]}
                >
                    {/* Text card inside scroll for tablet/desktop only */}
                    <Box display={["none", "block"]}>
                        <TextCard profile={profile} />
                    </Box>

                    <Flex
                        overflowX={"auto"}
                        className="no-scrollbar"
                        pl={["5.55vw", "0vw"]}
                        ref={scrollContainerRef}
                    >
                        <Flex
                            overflowX={"auto"}
                            className="no-scrollbar"
                            gap={["3.88vw", "1.56vw"]}
                            pr={["5.55vw", "1.56vw"]}
                            pl={["5.55vw", "0.56vw"]}
                            alignItems="stretch"
                            pb={["5vw", "1vw"]}
                        >
                            {/* Region Cards */}
                            {formattedRegions.map((region, index) => (
                                <Box
                                    key={region.slug || index}
                                    cursor="pointer"
                                    onClick={async () => {
                                        await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: region?.name, type: "region", searchFor: "experience" } });
                                        router.push(region.link)
                                    }}
                                    transition="transform 0.2s"
                                    _hover={{ transform: "scale(1.02)" }}
                                >
                                    <CustomCard story={region} />
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default FeaturedRegionsSection;