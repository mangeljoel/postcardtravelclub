import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList
} from "@choc-ui/chakra-autocomplete";

export const AutoCompleteField = ({
    component,
    defaultIsOpen,
    optionPosition,
    value,
    onChange,
    isDisabled
}) => {
    const handleSelectOption = (value) => {
        if (value?.item?.originalValue) {
            onChange(value?.item?.originalValue);
            component.onSelectOption(value?.item?.originalValue);
        } else {
            onChange(value);
            component.onSelectOption(value);
        }
    };

    const defaultValue =
        component.optionType === "object"
            ? value
                ? value[component?.displayKey]?.toString()
                : null
            : value;
    const getDisplayData = (value) => {
        if (component.optionType === "object") {
            return value[component.displayKey];
        } else {
            return value;
        }
    };
    const getDisplayValue = (value) => {
        if (component.optionType === "object") {
            return value[component.valueKey];
        } else {
            return value;
        }
    };
    return (
        component && (
            <AutoComplete
                listAllValuesOnFocus
                openOnFocus
                emphasize
                defaultIsOpen={defaultIsOpen}
                restoreOnBlurIfEmpty={false}
                emptyState={<div>Start typing to see results </div>}
                defaultValue={defaultValue}
                selectOnFocus={false}
                onSelectOption={handleSelectOption}
                suggestWhenEmpty={true}
            >
                <AutoCompleteInput
                    variant="filled"
                    bg="white"
                    _focus={{ bg: "white", borderColor: "primary_1" }}
                    _hover={{ bg: "white" }}
                    borderWidth="1px"
                    borderColor="primary_1"
                    placeholder={component.placeholder}
                    mb="1em"
                    isDisabled={isDisabled || false}
                    {...component.fieldStyle}
                />
                <AutoCompleteList
                    // w="100%"

                    marginTop={"0px!important"}
                    top={optionPosition ? 0 : ""}
                    minWidth={optionPosition ? "100%" : "auto"}
                    placement={optionPosition ? "bottom-start" : "auto"}
                    pos={optionPosition ? optionPosition : "absolute"}
                >
                    {component.options &&
                        component.options.length &&
                        component.options.map((option) => (
                            <AutoCompleteItem
                                key={getDisplayValue(option)}
                                value={option}
                                getValue={(value) =>
                                    component.optionType === "object"
                                        ? value.name
                                        : value
                                }
                            >
                                {getDisplayData(option)}
                            </AutoCompleteItem>
                        ))}
                </AutoCompleteList>
            </AutoComplete>
        )
    );
};
