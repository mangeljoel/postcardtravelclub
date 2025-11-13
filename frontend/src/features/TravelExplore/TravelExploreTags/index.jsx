import { Flex, Text } from "@chakra-ui/react";

const TravelExploreTags = ({ tags, onClick }) => {
    //console.log(tags);
    return (
        <Flex w="100%" flexWrap="wrap" mt="3%">
            {tags.map(
                (tag) =>
                    tag.name &&
                    tags.length > 0 && (
                        <Text
                            mr={["2%", "1%"]}
                            mb={["3%", "1%"]}
                            key={"tag_" + tag.id}
                            onClick={() => onClick(tag.id)}
                            variant={
                                tag.isSelected ? "selectedTag" : "unselectedTag"
                            }
                            cursor="pointer"
                        >
                            {tag.name}
                        </Text>
                    )
            )}
        </Flex>
    );
};

export default TravelExploreTags;
