import { Flex, Text } from "@chakra-ui/react";


const SelectedTagList = ({ filter, appliedTag, setAppliedTag }) => {
    return (
        filter?.selectedTags?.length > 0 && (
            <Flex mx={{ base: "-5%", sm: "-5%", md: "-5%", lg: "-12.5%" }}>
                <Flex overflowX={"auto"} px={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }} mt={["8.33vw", "4.44vw"]} gap={["2.5vw", "1.11vw"]} className='no-scrollbar'>
                    {filter?.selectedTags.map((tag) => {
                        return (
                            <Text
                                key={tag?.id || tag}
                                as={Flex}
                                px={["4vw", "2.67vw"]}
                                h={["8.33vw", "3.125vw"]}
                                fontSize={["3.33vw", "1.25vw"]}
                                borderRadius={["7.22vw", "2.78vw"]}
                                border={["1px", "2px"]}
                                w={"auto"}
                                whiteSpace={"nowrap"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                fontFamily={"raleway"}
                                fontWeight={500}
                                textTransform={"capitalize"}
                                cursor={"pointer"}
                                borderColor={(tag?.id ? appliedTag?.id == tag?.id : appliedTag == tag) || filter?.selectedTags?.length == 1 ? "primary_1!important" : "white"}
                                color={(tag?.id ? appliedTag?.id == tag?.id : appliedTag == tag) || filter?.selectedTags?.length == 1 ? "white" : "primary_1"}
                                bg={(tag?.id ? appliedTag?.id == tag?.id : appliedTag == tag) || filter?.selectedTags?.length == 1 ? "primary_1" : "white"}
                                onClick={() => {
                                    if (filter?.selectedTags?.length == 1) return
                                    setAppliedTag((prev) => {
                                        if ((tag?.id ? appliedTag?.id == tag?.id : appliedTag == tag)) return null
                                        else return tag
                                    })
                                }}
                            >
                                {tag.name || tag}
                            </Text>
                        )
                    })}
                </Flex>
            </Flex>
        )
    )
};
export default SelectedTagList;
