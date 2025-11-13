import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import FlipTile from "../FlipTile";
const FlipGridImage = ({ profiles, columnLimit, onlyImage }) => {
    return profiles?.length ? (
        <SimpleGrid
            columns={columnLimit}
            spacing={[6, 10]}
            width={profiles?.length === 1 && profiles[0]?.name === "Pledge" ? ["100%", "24%"] : ["100%", "80%"]}
            mx="auto"
            textAlign={"center"}
            mt={["6%", "3%"]}
            mb={["12%", "6%"]}
        >
            {profiles &&
                profiles
                    .sort((a, b) =>
                        a.priority < b.priority
                            ? -1
                            : a.priority > b.priority
                                ? 1
                                : 0
                    )
                    .map((profile, index) => {
                        return (
                            <Box
                                borderRadius="8px"
                                key={index + "_grid_item"}
                                width={profiles?.length === 1 ? "auto" : "auto"}
                                height={onlyImage ? "auto" : "auto"}
                            //m="auto"
                            >
                                <FlipTile
                                    profile={profile}
                                    indexId={index}
                                    onlyImage={onlyImage}
                                />
                            </Box>
                        );
                    })}
        </SimpleGrid>
    ) : (
        <Text
            mx="auto"
            my={["6%", "3%"]}
            variant={"aboutTitles"}
            fontWeight="bold"
            color="primary_3"
            textAlign={"center"}
            fontSize={["18px", "24px"]}
        >
            {/* Coming Soon... */}
        </Text>
    );
};
export default FlipGridImage;
