import {
    Flex,
    Text,
    Box,
    useCheckboxGroup,
    useCheckbox
} from "@chakra-ui/react";

export const CheckBoxField = ({
    component,
    value: defaultValue,
    onChange: componentOnChange
}) => {
    const { value, getCheckboxProps } = useCheckboxGroup({
        defaultValue:
            component.optionType === "object"
                ? defaultValue.map((item) => item[component.valueKey])
                : defaultValue,
        onChange: (value) => {
            let returnValue =
                component.optionType === "object"
                    ? component.options.filter((option) => {
                          return value.some((selected) => {
                              return (
                                  selected.toString() === option.id.toString()
                              );
                          });
                      })
                    : value;
            componentOnChange(returnValue);
        }
    });

    return (
        <Flex flexWrap={"wrap"}>
            {component.options &&
                component.options.map((option) => {
                    return (
                        <CustomCheckBox
                            {...getCheckboxProps({
                                value: option[component.valueKey]
                            })}
                        >
                            {option[component.displayKey]}
                        </CustomCheckBox>
                    );
                })}
        </Flex>
    );
};
const CustomCheckBox = (props) => {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
        useCheckbox(props);
    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label" mr={["3%", "1%"]} mb="2%">
            <input {...input} />
            <Flex
                cursor="pointer"
                borderWidth="1px"
                borderRadius="43px"
                borderColor="primary_1"
                color={state.isChecked ? "primary_15" : "primary_2"}
                bg={state.isChecked ? "primary_1" : "transparent"}
                padding="6px 12px"
                fontSize={"15px!important"}
                {...checkbox}
            >
                {props.children}
                {/* {state.isChecked && <Box w={2} h={2} bg="green.500" />} */}
            </Flex>
        </Box>
    );
};
