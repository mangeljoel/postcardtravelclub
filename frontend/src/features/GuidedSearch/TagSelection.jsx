import { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { AutoCompleteField } from "../../patterns/FormBuilder/AutoCompleteField";
import AutoCompleteMultiSelect from "../../patterns/FormBuilder/AutoCompleteMultiSelect";
import { AutoCompleteTag } from "@choc-ui/chakra-autocomplete";
import { TagIcon } from "../../styles/ChakraUI/icons";

const TagSelection = (props) => {
    const {
        tagList,
        showOptions,
        btnRef,
        hideTitle,
        setSelectedTags,
        selectedValues
    } = props;
    const [showSelectedTags, setShowSelectedTags] = useState(false);

    return (
        <Box mb="1em" w={"100%"} mx="auto">
            {!hideTitle && (
                <Text
                    fontSize={"24px"}
                    fontWeight={700}
                    textAlign="center"
                    color="#5A5A5A"
                    lineHeight={1.1}
                >
                    Select personal interests
                </Text>
            )}
            <AutoCompleteMultiSelect
                defaultIsOpen={true}
                btnRef={btnRef}
                showOptions={showOptions}
                component={{
                    label: "Experiences",
                    isVisible: true,
                    name: "Experiences",
                    fieldStyle: {},
                    placeholder:
                        selectedValues?.length > 0
                            ? "Selected " +
                              selectedValues?.length +
                              " experience" +
                              (selectedValues?.length > 1 ? "s" : "")
                            : "",
                    options: tagList,
                    optionType: "value",
                    displayKey: "name",
                    valueKey: "id",

                    onChange: (e) => {},
                    onSelectOption: (e) => {
                        // console.log(e, "select");
                    }
                }}
                setShowSelectedTags={(e) => setShowSelectedTags(e)}
                showSelectedTags={showSelectedTags}
                value={selectedValues}
                onChange={(e) => {
                    setSelectedTags(e);
                }}
            />
            {showSelectedTags &&
                selectedValues &&
                selectedValues.length > 0 && (
                    <Box bg="primary_1" borderRadius={"md"} my={2} padding={2}>
                        {selectedValues &&
                            selectedValues.map((tag, tid) => (
                                <Flex
                                    key={tid}
                                    mb="0.5em"
                                    alignItems={"center"}
                                >
                                    <TagIcon
                                        color="white"
                                        w="20px"
                                        h="20px"
                                        mt="5px"
                                        mr="2px"
                                    />
                                    <AutoCompleteTag
                                        color="white"
                                        fontSize="20px"
                                        label={tag}
                                        onRemove={(e) => {
                                            const updatedSelectedValues =
                                                selectedValues.filter(
                                                    (value) => value !== tag
                                                );
                                            setSelectedTags(
                                                updatedSelectedValues
                                            );
                                        }}
                                    />
                                </Flex>
                            ))}
                    </Box>
                )}
        </Box>
    );
};
export default TagSelection;
