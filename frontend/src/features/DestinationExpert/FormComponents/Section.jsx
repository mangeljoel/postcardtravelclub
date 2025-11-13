import { Box, Divider, FormControl, FormErrorMessage, Text } from "@chakra-ui/react";
import { Field } from "formik";
import { memo } from "react";
import SectionImages from "./SectionImages";
import MarkdownEditor from "../../CreatePostcardPage/Properties/MarkdownEditor";

const Section = memo(({ section, index, onImageUpload, lenOfSections, setFieldValue, setFieldTouched }) => (
    <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        mb={4}
        align="stretch"
        order={section.order}
    >
        <Field name={`dxSections.${index}.question`}>
            {({ field, form }) => (
                <FormControl isInvalid={form.errors.dxSections?.[index]?.question}>
                    <Text h="fit-content"
                        fontWeight={700}
                        fontSize="50px"
                        color="#8F8F8F">{section?.question}</Text>
                    <FormErrorMessage fontFamily={"raleway"} fontSize={14}>
                        {form.errors.dxSections?.[index]?.question}
                    </FormErrorMessage>
                </FormControl>
            )}
        </Field>

        <SectionImages
            section={section}
            index={index}
            onImageUpload={onImageUpload}
        />
        <Field name={`dxSections.${index}.content`}>
            {({ field, form }) => (<FormControl isInvalid={form.errors.dxSections?.[index]?.content}>
                <MarkdownEditor
                    {...field}
                    onChange={(e) => setFieldValue(`dxSections.${index}.content`, e)}
                    onBlur={() => setFieldTouched(field.name, true)}
                    display="flex"
                    style={{ flex: 1, flexDirection: "column", width: "100%" }}
                />
                <FormErrorMessage fontFamily={"raleway"} fontSize={14}>
                    {form.errors.dxSections?.[index]?.content}
                </FormErrorMessage>
            </FormControl>
            )}
        </Field>
        {index <= lenOfSections - 2 && <Divider
            my="3em"
            borderBottomWidth="1px"
            borderColor="#111111"
        />}
    </Box>
));

export default Section;