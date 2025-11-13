import { chakra, Box, Flex, Text, useCheckbox } from "@chakra-ui/react";
export const CustomCheckbox = (props) => {
    const { state, getInputProps, getCheckboxProps } = useCheckbox(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();
    return (
        <Box as="label" style={{ marginRight: "1%", marginTop: "1%" }}>
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                bg="white"
                borderWidth="1px"
                borderRadius="43px"
                borderColor="primary_1"
                _checked={{
                    bg: "primary_1",
                    color: "white",
                    borderColor: "primary_1"
                }}
                padding="3px 12px"
                fontSize={"12px!important"}
            >
                {props.children}
            </Box>
        </Box>
    );
};
