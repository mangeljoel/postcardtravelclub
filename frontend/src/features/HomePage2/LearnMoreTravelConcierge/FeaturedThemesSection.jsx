import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useContext } from "react";
import { useRouter } from "next/router";
import AppContext from "../../AppContext";
import CustomCard from "../CustomCard";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { createDBEntry } from "../../../queries/strapiQueries";

// Reusable text card component
const StayTextCard = ({ profile }) => {
    const router = useRouter();

    return (
        <Flex
            bg={"primary_2"}
            w={["88.9vw", "37.45vw"]}
            // h={["auto", "30.525vw"]}
            h={["auto", "460px"]}
            minH={["280px", "420px"]}
            mx={["5.55vw", "1.56vw"]}
            mr={["5.55vw", "0"]}
            borderRadius={["3.611vw", "1.53vw"]}
            flexDirection={"column"}
            p={"5.56vw"}
            pl={["10vw", "5.56vw"]}
            py={["18.65vw", "0vw"]}
            justifyContent="center"
            gap={["7vw", "4vw"]}
            flexShrink={0}
            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        >
            <Text
                fontFamily="raleway"
                fontWeight={500}
                fontSize={["5.833vw", "2.25vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                color={"#EFE9E4"}
                textAlign={"left"}
            >
                <Text
                    as="span"
                    fontFamily="lora"
                    fontStyle="italic"
                    fontSize={["6.38vw", "2.35vw"]}
                    lineHeight={["6.67vw", "2.65vw"]}
                >
                    Discover Postcard Experiences by popular travel themes.
                </Text>
            </Text>

            <Button
                variant={"none"}
                color={"white"}
                borderColor={"white"}
                border={"2px"}
                w={["63.05vw", "24.08vw"]}
                h={["8.05vw", "3.06vw"]}
                textAlign={"center"}
                borderRadius={["5.55vw", "2.08vw"]}
                fontFamily={"raleway"}
                fontWeight={600}
                fontSize={["3.33vw", "1.22vw"]}
                lineHeight={["10vw", "3.77vw"]}
                _hover={{ background: "#EFE9E4", color: "primary_3" }}
                onClick={async () => {
                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: "View All", type: "theme", searchFor: "experience" } });
                    router.push("/experiences/themes")
                }}
            >
                View All &nbsp;
                <RightArrowIcon
                    style={{ paddingTop: "1%" }}
                    h={["8.05vw", "3.06vw"]}
                    width={["2.77vw", "1.5vw"]}
                />
            </Button>
        </Flex>
    );
};

const FeaturedThemesSection = ({ themeStats = [], loading = false }) => {
    const { profile } = useContext(AppContext);
    const scrollContainerRef = useRef(null);
    const router = useRouter();

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = scrollContainerRef.current.clientWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;

            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollContainerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                scrollContainerRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth"
                });
            }
        }
    };

    // Show loading state
    if (loading) {
        return (
            <Flex
                width="100%"
                h={"auto"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">Loading themes...</Text>
            </Flex>
        );
    }

    // Show empty state
    if (!themeStats || themeStats.length === 0) {
        return (
            <Flex
                width="100%"
                h={"auto"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">No themes available</Text>
            </Flex>
        );
    }
    console.log(themeStats)

    // Transform theme stats to match CustomCard format and limit to 6
    const formattedThemes = themeStats.slice(0, 6).map(theme => ({
        name: theme.name,
        slug: theme.slug,
        imageUrl: theme.coverImage[0]?.url || "/assets/default-theme.jpg",
        stats: theme.stats,
        link: `/experiences/themes/${theme.name}`
    }));

    return (
        <Flex
            width="100%"
            h={"auto"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
        >
            {/* Text card outside scroll for mobile */}
            <Box display={["block", "none"]}>
                <StayTextCard profile={profile} />
            </Box>

            <Box position={"relative"} w="100%">
                <Flex
                    overflowX={"auto"}
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                >
                    {/* Text card inside scroll for tablet/desktop only */}
                    <Box display={["none", "block"]} py={["4.44vw", "3.33vw"]}>
                        <StayTextCard profile={profile} />
                    </Box>

                    <Flex
                        overflowX={"auto"}
                        className="no-scrollbar"
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["5vw", "1vw"]}
                        py={["8.5vw", "3.33vw"]}
                    >
                        {/* Theme Cards */}
                        {formattedThemes.map((theme, index) => (
                            <Box
                                key={theme.slug || index}
                                cursor="pointer"
                                onClick={async () => {
                                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: theme?.name, type: "theme", searchFor: "experience" } });
                                    router.push(theme.link)
                                }}
                                transition="transform 0.2s"
                                _hover={{ transform: "scale(1.02)" }}
                            >
                                <CustomCard story={theme} />
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default FeaturedThemesSection;