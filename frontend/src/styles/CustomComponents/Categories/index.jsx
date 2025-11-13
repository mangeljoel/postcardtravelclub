import { Box, useRadio } from "@chakra-ui/react";

export const Categories = (props) => {
    const { ...radioProps } = props;

    const { getInputProps, getCheckboxProps, state } = useRadio(radioProps);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label" mr={["3%", "1%"]} mb="2%">
            <input
                {...input}
                onClick={() => {
                    props.onClick(input.value);
                }}
            />
            <Box
                {...checkbox}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="43px"
                borderColor="primary_1"
                color={state.isChecked ? "primary_15" : "primary_2"}
                bg={state.isChecked ? "primary_1" : "transparent"}
                padding="3px 12px"
                fontSize={"15px!important"}
            >
                {props.children}
            </Box>
        </Box>
    );
};
