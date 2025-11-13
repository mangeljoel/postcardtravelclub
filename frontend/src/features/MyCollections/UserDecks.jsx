import { useContext, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import InfiniteGrid from "../../patterns/InfiniteGrid";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import DeckCard from "./DeckCard";
import { RightArrowIcon } from "../../styles/ChakraUI/icons";

const UserDecks = ({ slug, decks, header }) => {
    const { isActiveProfile } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });
        return isActive ? (
            <Flex
                w="100%"
                //minH={"500px"}
                mb={["7%", "0%"]}
                py={["10%", "0%"]}
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
                        maxW={["70vw", "27vw"]}
                        fontSize={["4vw", "1.67vw"]}
                        fontFamily="lora"
                        fontStyle="italic"
                        textAlign="center"
                    >
                        Get curated itineraries designed by our destination experts
                    </Text>

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
                        href="/destination-experts"
                        bg="primary_1"
                    >
                        View Destination Experts &nbsp;
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
                minH={["500px", "600px"]}
                py={["15%", 0]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Text
                    maxW={["70vw", "27vw"]}
                    fontSize={["4vw", "1.67vw"]}
                    fontFamily="lora"
                    fontStyle="italic"
                    textAlign="center"
                >
                    No Decks Created
                </Text>
            </Flex>
        );
    };

    const renderContent = () => {
        if (loading) {
            return <LoadingGif />;
        }
        return <Box
            w="100%"
            px={{ base: "5%", lg: "10%" }}
            pb={{ base: "5%", lg: "10%" }}
            textAlign={"center"}
        >
            {header && <Box mb={["1em", "3em"]} textAlign={"center"}><Heading>{header.title}</Heading>
                {/* <Text my="1em" fontFamily={"raleway"} fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">{header.subtitle}</Text> */}
            </Box>}
            {decks?.length > 0 ? <InfiniteGrid gridItems={decks?.map((deck) => (
                <DeckCard key={deck.id} data={deck} />
            ))} />

                : renderEmptyState()}
        </Box>
    };

    return renderContent()
}

export default UserDecks