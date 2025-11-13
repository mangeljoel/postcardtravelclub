import { useContext } from "react";
import AppContext from "../AppContext";
import { Flex, Text, Link, Box, Heading } from "@chakra-ui/react";
import FoodAndDrinks from "../FoodAndDrinks";

const UserRestaurants = ({ slug, header }) => {
    const { isActiveProfile } = useContext(AppContext)
    const renderEmptyState = () => {
        const isActive = isActiveProfile({ slug });

        return (
            <Flex

                w="100%"
                // minH={["500px", "600px"]}
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
                        {isActive ? "You have 0 Stays collected, Start Collecting now :)" : "No Stays Collected"}
                    </Text>
                    {isActive && (
                        <Text
                            as={Link}
                            href={"/food-and-beverages"}
                            fontSize={["4vw", "1.67vw"]}
                            fontFamily="raleway"
                            fontWeight={500}
                            textAlign="center"
                            textDecoration="underline"
                            color="primary_3"
                        >
                            {"Food And Beverages"}
                        </Text>
                    )}
                </Flex>
            </Flex>
        );
    };
    return (
        <Box
            w="100%"

        >
            {header && <Box mb={["1em", "3em"]} w="100%"
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }} textAlign={"center"}><Heading>{header.title}</Heading>
                <Text my="1em" fontFamily={"raleway"} fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">{header.subtitle}</Text>
            </Box>}
            <FoodAndDrinks type="restaurant"
                isDiary={true}
                slug={slug}
            />

        </Box>
    )

}
export default UserRestaurants