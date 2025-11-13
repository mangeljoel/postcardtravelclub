import React, { useContext, useEffect, useRef, useState } from 'react';
import { Flex, Box, Input, Button, FormControl, FormLabel, Text, VStack, HStack, Select, Textarea, Divider, FormErrorMessage } from '@chakra-ui/react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { getUrlOfUploadImage } from '../../services/utilities';
import { fetchPaginatedResults } from '../../queries/strapiQueries';
import AppContext from '../AppContext';
import MarkdownEditor from '../CreatePostcardPage/Properties/MarkdownEditor';
import AddImage from '../CreatePostcardPage/Properties/AddImage';
import { useCountries } from '../../hooks/useCountriesHook';
import CoverImageSection from './FormComponents/CoverImageSection';
import FormField from './FormComponents/FormField';
import Section from './FormComponents/Section';
import Testimonial from './FormComponents/Testimonial';
import ImagePreview from './FormComponents/ImagePreview';

const EditExpertPage = ({ values, setFieldValue, setFieldTouched }) => {
    const countries = useCountries()

    const handleImageUpload = (event, setFieldValue, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            getUrlOfUploadImage(file, (result) => {
                if (fieldName === 'coverImage') {
                    setFieldValue(fieldName, result.id);
                    setFieldValue('coverImageUrl', result.url);
                }
                else {
                    setFieldValue({ id: result.id, url: result.url });
                }
            });
        }
    };

    return (
        <Form style={{ width: "100%" }}>
            <Flex w="80%" mx={"auto"} flexDirection="column" gap={10} >
                <Field name="title">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.title}>
                            <Textarea
                                {...field}
                                px={2}
                                height="fitContent"
                                fontSize="50px"
                                color="#5A5A5A"
                                fontWeight={700}
                                placeholder="Enter Tour Title..."
                                border="none"
                            />
                            <FormErrorMessage fontFamily={"raleway"} fontSize={20}>{form.errors.title}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>

                {/* Cover Image Upload */}
                <CoverImageSection
                    values={values}
                    onImageClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('file-input-coverImage').click();
                    }}
                />

                <Input
                    id="file-input-coverImage"
                    type="file"
                    accept="image/*"
                    display="none"
                    onChange={(event) => handleImageUpload(event, setFieldValue, 'coverImage')}
                />

                {/* Other Fields */}
                <VStack spacing={4} mt={4} align="stretch">
                    {/* <Field name="tourTitle">
                                {({ field }) => (
                                    <FormControl>
                                        <HStack >
                                            <FormLabel w={"35%"} my={"auto"} mr={"1em"} fontSize={"18px"} fontWeight={400} fontFamily={"cabin"} color={"primary_1"} minWidth="120px">Tour Title</FormLabel>
                                            <Input {...field} _hover={{ borderColor: "gray.400" }} borderColor={"gray.400"} placeholder="Tour Title" />
                                        </HStack>
                                    </FormControl>
                                )}
                            </Field> */}
                    <FormField label="Name" name="name" component={Input} placeholder="Name" />

                    <Field name="country">
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors.country}>
                                <HStack>
                                    <FormLabel w={"35%"} my={"auto"} mr={"1em"} fontSize={"18px"} fontWeight={400} fontFamily={"cabin"} color={"primary_1"} minWidth="120px">Country</FormLabel>
                                    <VStack w={"100%"}>
                                        <FormErrorMessage fontFamily={"raleway"} fontSize={14} w={"100%"}>{form.errors.country}</FormErrorMessage>
                                        <Select
                                            {...field}
                                            // bg={"white"}
                                            placeholder="Select a country"
                                            _hover={{ borderColor: "gray.400" }} borderColor={"gray.400"}
                                            onChange={(event) => {
                                                const selectedCountryId = event.target.value;
                                                setFieldValue("country", +selectedCountryId); // Set the id in Formik
                                            }}
                                        >
                                            {countries.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country?.name} {/* Display the name */}
                                                </option>
                                            ))}
                                        </Select>
                                    </VStack>
                                </HStack>
                            </FormControl>
                        )}
                    </Field>

                    <FormField label="Tag Line" name="tagLine" component={Input} placeholder="Tag Line" />
                    <Field>
                        {({ field, form }) => (
                            <FormControl>
                                <HStack alignItems={"flex-start"}>
                                    <FormLabel
                                        w="35%"
                                        // my="auto"
                                        mr="1em"
                                        fontSize="18px"
                                        fontWeight={400}
                                        fontFamily="cabin"
                                        color="primary_1"
                                        minWidth="120px"
                                    >
                                        Quotes
                                    </FormLabel>
                                    <VStack w={"100%"}>
                                        <FormField
                                            label="Text"
                                            name="quotes.quoteText"
                                            component={Input}
                                            placeholder="Enter the quote..."
                                            stackType="VStack"
                                        />
                                        <FormField
                                            label="Author"
                                            name="quotes.quoteAuthor"
                                            component={Input}
                                            placeholder="Enter the author..."
                                            stackType="VStack"
                                        />
                                    </VStack>
                                </HStack>
                            </FormControl>
                        )
                        }
                    </Field>

                    <Divider
                        my="3em"
                        borderBottomWidth="3px"
                        borderColor="#111111"
                    />

                    <Box
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
                        mb={4}
                        align="stretch"
                    >
                        <Text h="fit-content"
                            fontWeight={700}
                            fontSize="50px"
                            color="#8F8F8F">Founder's Message</Text>

                        <>
                            {values?.founderMessage?.founderImage ? <Box my={8}>
                                <ImagePreview image={{ url: values.founderMessage.founderImageUrl }} onRemove={() => {
                                    setFieldValue('founderMessage.founderImage', null);
                                    setFieldValue('founderMessage.founderImageUrl', null);
                                }} /></Box> :
                                <Field name={`founderMessage.founderImage`} >
                                    {({ field, form }) => (<FormControl isInvalid={form.errors.founderMessage?.founderBrief} my="8">
                                        <AddImage
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById(`founder-image-input`).click();
                                            }}
                                            text="Add Image"
                                        />
                                        <Input
                                            id={`founder-image-input`}
                                            type="file"
                                            accept="image/*"
                                            display="none"
                                            mt={2}
                                            onChange={(event) => {
                                                const file = event.target.files[0];
                                                if (file) {
                                                    getUrlOfUploadImage(file, (result) => {
                                                        setFieldValue('founderMessage.founderImage', result.id);
                                                        setFieldValue('founderMessage.founderImageUrl', result.url);

                                                    });
                                                }
                                            }
                                            }
                                        />
                                        <FormErrorMessage fontFamily={"raleway"} fontSize={14}>
                                            {form.errors.founderMessage?.founderImage}
                                        </FormErrorMessage>
                                    </FormControl>)}
                                </Field>}
                        </>

                        <Field name={`founderMessage.founderBrief`}>
                            {({ field, form }) => (<FormControl isInvalid={form.errors.founderMessage?.founderBrief}>
                                <MarkdownEditor
                                    {...field}
                                    onChange={(e) => setFieldValue(`founderMessage.founderBrief`, e)}
                                    onBlur={() => setFieldTouched(field.name, true)}
                                    display="flex"
                                    style={{ flex: 1, flexDirection: "column", width: "100%" }}
                                />
                                <FormErrorMessage fontFamily={"raleway"} fontSize={14}>
                                    {form.errors.founderMessage?.founderBrief}
                                </FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>

                        <Divider
                            my="3em"
                            borderBottomWidth="1px"
                            borderColor="#111111"
                        />
                    </Box>

                    {/* Sections */}
                    <FieldArray name="dxSections">
                        {() => (
                            <Box>
                                {values.dxSections?.map((section, index) => (
                                    <Section key={index} section={section} index={index} lenOfSections={values.sections.length}
                                        onImageUpload={(event, pushImage) => {
                                            handleImageUpload(event, (image) =>
                                                pushImage(image), `dxSections.${index}.media`)
                                        }}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                    />
                                ))}
                            </Box>
                        )}
                    </FieldArray>

                    <Divider
                        my="3em"
                        borderBottomWidth="3px"
                        borderColor="#111111"
                    />

                    {/* Testimonials */}
                    <FieldArray name="testimonials">
                        {({ remove, push }) => (
                            <Box>
                                {values.testimonials.map((testimonial, index) => (
                                    <Testimonial key={index} index={index} onRemove={() => remove(index)} />
                                ))}
                                <Button
                                    mt={2}
                                    variant={"outline"}
                                    colorScheme="blue"
                                    onClick={() =>
                                        push({
                                            title: '',
                                            message: '',
                                            name: '',
                                            location: '',
                                        })
                                    }
                                >
                                    Add Testimonial
                                </Button>
                            </Box>
                        )}
                    </FieldArray>
                </VStack>
            </Flex>
        </Form >
    );
};

export default EditExpertPage;
