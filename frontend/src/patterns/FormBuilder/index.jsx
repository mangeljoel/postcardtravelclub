import { Controller, useForm } from "react-hook-form";
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Text,
    SimpleGrid,
    Button,
    Box,
    Flex
} from "@chakra-ui/react";
import FormElement from "./FormElement";
const FormBuilder = (props) => {
    const {
        onSubmit,
        initialValues,
        formBaseStyle,
        formSectionStyle,
        formSectionTitleStyle
    } = props;
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: initialValues });

    return (
        <Box {...formBaseStyle}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {props.formSection?.map((section, index) => {
                    return (
                        <Box
                            key={"section" + index}
                            w="100%"
                            {...formSectionStyle}
                        >
                            {section.title && (
                                <Text {...formSectionTitleStyle}>
                                    {section.title}
                                </Text>
                            )}
                            <SimpleGrid
                                columns={section.numberOfColumns}
                                gap={6}
                            >
                                {section.formComponents.map(
                                    (component, index) => {
                                        return (
                                            <FormControl
                                                key={"control" + index}
                                                isInvalid={
                                                    errors[component.label]
                                                }
                                            >
                                                <Controller
                                                    name={component.label}
                                                    control={control}
                                                    rules={component.rules}
                                                    render={({ field }) => (
                                                        <>
                                                            <FormLabel
                                                                display="flex"
                                                                justifyContent={
                                                                    "space-between"
                                                                }
                                                                htmlFor="email"
                                                            >
                                                                <Text
                                                                    display="flex"
                                                                    variant="formLabel"
                                                                >
                                                                    {
                                                                        component.name
                                                                    }
                                                                    {component.required && (
                                                                        <Text variant="formReq">
                                                                            &nbsp;
                                                                            (required)
                                                                        </Text>
                                                                    )}
                                                                </Text>
                                                                {component.counter && (
                                                                    <Text variant="formReq">
                                                                        {component
                                                                            .counter
                                                                            ?.type ===
                                                                        "words"
                                                                            ? field.value
                                                                                ? field.value.match(
                                                                                      /\S+/g
                                                                                  )
                                                                                      ?.length
                                                                                : "0"
                                                                            : field.value
                                                                            ? field
                                                                                  .value
                                                                                  .length
                                                                            : 0}
                                                                        /
                                                                        {
                                                                            component
                                                                                .counter
                                                                                .limit
                                                                        }
                                                                    </Text>
                                                                )}
                                                            </FormLabel>
                                                            <FormElement
                                                                component={
                                                                    component
                                                                }
                                                                errors={errors}
                                                                field={field}
                                                            />
                                                        </>
                                                    )}
                                                />

                                                <FormErrorMessage>
                                                    {
                                                        errors[component.label]
                                                            ?.message
                                                    }
                                                </FormErrorMessage>
                                            </FormControl>
                                        );
                                    }
                                )}
                            </SimpleGrid>
                        </Box>
                    );
                })}
                <Box w="100%" textAlign={"center"}>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        mx="auto"
                        textAlign={"center"}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    );
};
export default FormBuilder;
