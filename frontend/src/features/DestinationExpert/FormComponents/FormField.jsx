import { FormControl, FormErrorMessage, FormLabel, HStack, VStack } from "@chakra-ui/react";
import { Field } from "formik";
import { get } from "lodash";
import { memo } from "react";

const FormField = memo(({ label, name, component: Component = Input, stackType = "HStack", ...props }) => {
    const Stack = stackType === "HStack" ? HStack : VStack;
    return (
        <Field name={name}>
            {({ field, form }) => {
                const error = get(form.errors, name);
                return (
                    <FormControl isInvalid={error}>
                        <Stack alignItems={stackType === "HStack" ? "center" : "flex-start"} gap={1} w="100%">
                            <FormLabel
                                w="35%"
                                my="auto"
                                mr="1em"
                                fontSize="18px"
                                fontWeight={400}
                                fontFamily="cabin"
                                color="primary_1"
                                minWidth="120px"
                            >
                                {label}
                            </FormLabel>
                            <VStack w={"100%"}>
                                <FormErrorMessage fontFamily={"raleway"} fontSize={14} w={"100%"}>{error}</FormErrorMessage>
                                <Component
                                    {...field}
                                    {...props}
                                    _hover={{ borderColor: "gray.400" }}
                                    borderColor="gray.400"
                                    autoComplete="off"
                                />
                            </VStack>
                        </Stack>
                    </FormControl>
                )
            }}
        </Field>
    )
});

export default FormField;