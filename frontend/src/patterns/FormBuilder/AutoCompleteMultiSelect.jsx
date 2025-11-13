import {
    Button,
    Box,
    FormControl,
    FormHelperText,
    InputGroup,
    FormLabel,
    InputRightElement,
    useDisclosure
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteTag
} from "@choc-ui/chakra-autocomplete";
import { TagIcon } from "../../styles/ChakraUI/icons";

const AutoCompleteMultiSelect = ({
    component,
    defaultIsOpen,
    value,
    onChange,
    btnRef,
    showOptions,
    setShowSelectedTags,
    showSelectedTags
}) => {
    const handleSelectOption = (selectedValues) => {
        onChange(selectedValues);
        component.onSelectOption(selectedValues);
    };
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [readOnly, setReadOnly] = useState(true);

    const ref = useRef(null);
    return (
        component && (
            <AutoComplete
                defaultIsOpen={defaultIsOpen}
                multiple
                w="100%"
                closeOnBlur={false}
                emphasize
                openOnFocus={true}
                restoreOnBlurIfEmpty={false}
                emptyState={<div>Start typing to see results </div>}
                value={value}
                ref={ref}
                onSelectOption={(e) => {
                    if (value && value?.indexOf(e?.item?.value) !== -1) {
                        ref?.current?.removeItem(e.item.value, false);
                    }
                }}
                onChange={(selectedValues) =>
                    handleSelectOption(selectedValues)
                }
                suggestWhenEmpty={true}
            >
                {({ isOpen, onClose }) => (
                    <>
                        <InputGroup
                            mt={"1em"}
                            w="100%"
                            borderColor={"primary_1"}
                            borderWidth="1px"
                            borderRadius={"md"}
                            _focus={{ bg: "white" }}
                            _hover={{ bg: "white" }}
                            // _first={{ ul: { display: "none" } }}
                        >
                            <AutoCompleteInput
                                bg="white"
                                variant="filled"
                                onBlur={() => setReadOnly(true)}
                                readOnly={readOnly}
                                _focus={{ bg: "white" }}
                                _hover={{ bg: "white" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setReadOnly(false);
                                    if (showSelectedTags)
                                        setShowSelectedTags(false);
                                }}
                                // my="1em"
                                {...component.fieldStyle}
                                placeholder={component.placeholder}
                            />
                            <InputRightElement
                                //   my="1em"
                                width={["25%", "20%"]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (showSelectedTags)
                                        setShowSelectedTags(false);
                                    else setShowSelectedTags(true);
                                }}
                                children={
                                    <Button
                                        w="100%"
                                        isDisabled={
                                            value === undefined ||
                                            value?.length === 0
                                        }
                                    >
                                        <TagIcon
                                            color="white"
                                            w="20px"
                                            h="20px"
                                            mt="2px"
                                            mx={1}
                                        />{" "}
                                        {value?.length}
                                    </Button>
                                }
                            />
                        </InputGroup>
                        {showOptions && !showSelectedTags && (
                            <AutoCompleteList
                                placement="auto"
                                display="grid"
                                maxHeight={["250px", ""]}
                                style={{ minWidth: "100%", top: "0px" }}
                                onBlur={(e) => {
                                    // e.stopPropagation();
                                    if (!isOpen) {
                                        if (showSelectedTags) return;
                                        else btnRef?.current?.click();
                                    }
                                }}
                                initialFocusRef={btnRef}
                                pos="relative"
                                gridGap={["5px", "10px"]}
                                //  fontSize={["20px", "16px"]}
                                gridTemplateColumns={[
                                    "repeat(1, 1fr)",
                                    "repeat(3, 1fr)"
                                ]}
                            >
                                {component.options &&
                                    component.options.length > 0 &&
                                    component.options.map((option, cid) => (
                                        <AutoCompleteItem
                                            key={
                                                component.optionType ===
                                                "object"
                                                    ? option[component.valueKey]
                                                    : option
                                            }
                                            value={option}
                                            getValue={(value) =>
                                                component.optionType ===
                                                "object"
                                                    ? value[
                                                          component.displayKey
                                                      ]
                                                    : value
                                            }
                                            _selected={{
                                                bg: "primary_1",
                                                color: "white"
                                            }}
                                            _focus={{
                                                bg: "whiteAlpha.100"
                                            }}
                                        >
                                            {component.optionType === "object"
                                                ? option[component.displayKey]
                                                : option}
                                        </AutoCompleteItem>
                                    ))}
                            </AutoCompleteList>
                        )}
                    </>
                )}
            </AutoComplete>
        )
    );
};
export default AutoCompleteMultiSelect;
