import { Box, useRadio, useRadioGroup, Flex } from "@chakra-ui/react";
const RadioGroupField = (props) => {
    const CustomRadioButton = (props) => {
        const { getInputProps, getCheckboxProps } = useRadio(props);

        const input = getInputProps();
        const checkbox = getCheckboxProps();

        return (
            <Box as="label">
                <input {...input} />
                <Box
                    {...checkbox}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="20px"
                    borderColor="primary_1"
                    //boxShadow="md"
                    my={2}
                    mx={1}
                    _checked={{
                        bg: "primary_1",
                        color: "white",
                        borderColor: "primary_1"
                    }}
                    _focus={{
                        boxShadow: "outline"
                    }}
                    px={2}
                    py={1}
                >
                    {props.children}
                </Box>
            </Box>
        );
    };
    const options = [
        "Community",
        "Culture",
        "History",
        "Food",
        "Nature",
        "Wildlife",
        "Others"
    ];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "framework",
        defaultValue: "Community",
        onChange: console.log
    });

    const group = getRootProps();

    return (
        <Flex {...group} flexWrap={"wrap"}>
            {props.options?.map((value) => {
                const radio = getRadioProps({ value });
                return (
                    <CustomRadioButton key={value} {...radio}>
                        {value}
                    </CustomRadioButton>
                );
            })}
        </Flex>
    );
};

export default RadioGroupField;
