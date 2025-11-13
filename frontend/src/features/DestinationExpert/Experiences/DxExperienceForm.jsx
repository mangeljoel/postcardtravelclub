import React, { useEffect, useRef, useState } from 'react'
import PostcardModal from '../../PostcardModal';
import { Field, Form, Formik } from 'formik';
import { createDBEntry, fetchPaginatedResults, updateDBValue } from '../../../queries/strapiQueries';
import { Box, Button, Flex, FormControl, FormLabel, Input, ModalBody, ModalFooter, Select, Textarea, useToast } from '@chakra-ui/react';
import { ChakraNextImage } from '../../../patterns/ChakraNextImage';
import { CameraIcon } from '../../../styles/ChakraUI/icons';
import { useCountries } from '../../../hooks/useCountriesHook';
import { debounce } from 'lodash';
import MarkdownEditor from '../../CreatePostcardPage/Properties/MarkdownEditor';
import { getUrlOfUploadImage } from '../../../services/utilities';

const DxExperienceForm = ({ isOpen, headerText, onClose, mode = 'create', initialFormValues = null, handleReset, dxId }) => {
    const countries = useCountries() || [];
    const [tagGroups, setTagGroups] = useState([])
    const [postcardSuggestions, setPostcardSuggestions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const postcardDropdownRef = useRef(null);
    const [regionSuggestions, setRegionSuggestions] = useState([]);
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState([])
    const regionDropdownRef = useRef(null)
    const [tagSuggestions, setTagSuggestions] = useState([])
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
    const tagsDropdownRef = useRef(null)
    const toast = useToast()

    const fetchPostcards = async (query) => {
        if (query.length < 3) return;
        const response = await fetchPaginatedResults('postcards', {
            name: { $containsi: query },
            isComplete: true
        }, {
            fields: ['id', 'name', 'intro', 'story'],
            coverImage: {
                fields: ["url"]
            },
            country: {
                fields: ["id", "name"]
            },
            album: {
                fields: ["region"],
                populate: {
                    region: {
                        fields: ["id", "name"]
                    }
                }
            },
            tags: {
                fields: ["id", "name"],
                populate: {
                    tag_group: {
                        fields: ["id", "name"],
                    }
                }
            }
        })
        return Array.isArray(response) ? response : [response];
    }

    const fetchRegions = async (country) => {
        if (!country) return
        const response = await fetchPaginatedResults('regions', {
            country
        }, {
            fields: ['id', 'name'],
        })
        setRegionSuggestions(Array.isArray(response) ? response : [response]);
    }

    const fetchTagGroups = async () => {
        const response = await fetchPaginatedResults('tag-groups', {}, {
            fields: ['id', 'name'],
        })
        setTagGroups(Array.isArray(response) ? response : [response]);
    }

    const fetchTags = async (tag_group) => {
        const response = await fetchPaginatedResults('tags', {
            tag_group
        }, {
            fields: ['id', 'name'],
        })
        setTagSuggestions(Array.isArray(response) ? response : [response]);
    }

    const handlePostcardSearchDebounced = debounce(async (query) => {
        if (!query) {
            setPostcardSuggestions([]);
            setIsDropdownOpen(false);
            return;
        }
        const results = await fetchPostcards(query);
        setPostcardSuggestions(results || []);
        setIsDropdownOpen(results?.length > 0); // Open only if results exist
    }, 2000); // 2-second debounce

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

    useEffect(() => {
        fetchTagGroups()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (postcardDropdownRef.current && !postcardDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
                setIsRegionDropdownOpen(false);
            }
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const createSubmitForm = async (values, { setSubmitting }) => {
        try {
            let regionId = values.region?.id || null;

            // If the region has no ID, create it first
            if (!regionId && values.region?.name) {
                const newRegion = await createDBEntry('regions', {
                    name: values?.region.name,
                    country: values?.country || null,
                });

                regionId = newRegion?.data?.id; // Get the created region's ID
            }

            // Handle tags: Create missing ones first
            const tagIds = await Promise.all(values.tags.map(async (tag) => {
                if (!tag.id) {
                    const newTag = await createDBEntry('tags', {
                        name: tag.name,
                        tag_group: Number(values?.tag_group) || null,
                    });

                    return newTag?.data?.id; // Get the created tag's ID
                }
                return tag.id; // Use existing tag ID
            }));

            // Now create the dx-card using the resolved region ID and tag IDs
            await createDBEntry('dx-cards', {
                name: values?.name,
                intro: values?.intro || '',
                coverImage: values?.coverImage || '',
                story: values?.story || '',
                country: values?.country || null,
                region: regionId, // Use the resolved region ID
                postcard: values?.postcard?.id || null,
                dx_card_type: values?.dx_card_type?.id,
                destination_expert: dxId,
                tag_group: Number(values?.tag_group) || null,
                tags: tagIds, // Use the resolved tag IDs
            });

            // Optionally reset the form or close modal
            // onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
            handleReset()
            onClose()
        }
    }

    const editSubmitForm = async (values, { setSubmitting }) => {
        try {
            let regionId = values.region?.id || null;

            // If the region has no ID, create it first
            if (!regionId && values.region?.name) {
                const newRegion = await createDBEntry('regions', {
                    name: values?.region.name,
                    country: values?.country || null,
                });

                regionId = newRegion?.data?.id; // Get the created region's ID
            }

            // Handle tags: Create missing ones first
            const tagIds = await Promise.all(values.tags.map(async (tag) => {
                if (!tag.id) {
                    const newTag = await createDBEntry('tags', {
                        name: tag.name,
                        tag_group: Number(values?.tag_group) || null,
                    });

                    return newTag?.data?.id; // Get the created tag's ID
                }
                return tag.id; // Use existing tag ID
            }));

            // Now create the dx-card using the resolved region ID and tag IDs
            await updateDBValue('dx-cards', initialFormValues?.id, {
                name: values?.name,
                intro: values?.intro || '',
                coverImage: values?.coverImage || '',
                story: values?.story || '',
                country: values?.country || null,
                region: regionId, // Use the resolved region ID
                postcard: values?.postcard?.id || null,
                dx_card_type: values?.dx_card_type?.id,
                destination_expert: dxId,
                tag_group: Number(values?.tag_group) || null,
                tags: tagIds, // Use the resolved tag IDs
            });

            // Optionally reset the form or close modal
            // onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
            handleReset()
            onClose()
        }
    }

    return (
        <PostcardModal isShow={isOpen} headerText={headerText} handleClose={onClose} children={
            <Formik
                initialValues={mode == 'create' ? ({
                    dx_card_type: { id: 1, name: 'postcard' },
                    postcard: '',
                    coverImage: '',
                    coverImageUrl: '',
                    name: '',
                    country: '',
                    region: '',
                    tag_group: '',
                    tags: [],
                    intro: '',
                    story: ''
                }) : ({
                    dx_card_type: { id: 1, name: 'postcard' },
                    postcard: initialFormValues?.postcard || '',
                    coverImage: initialFormValues?.coverImage?.id || '',
                    coverImageUrl: initialFormValues?.coverImage?.url || '',
                    name: initialFormValues?.name || '',
                    country: initialFormValues?.country?.id || '',
                    region: initialFormValues?.region || '',
                    tag_group: initialFormValues?.tags?.length ? initialFormValues?.tags[0].tag_group?.id : '',
                    tags: initialFormValues?.tags?.slice(0, 2) || [],
                    intro: initialFormValues?.intro || '',
                    story: initialFormValues?.story || ''
                })}
                enableReinitialize={true}
                onSubmit={mode == 'create' ? createSubmitForm : editSubmitForm}
            >
                {({ values, handleChange, setFieldValue }) => {
                    useEffect(() => {
                        if (values.country) {
                            fetchRegions(values.country);
                        }
                    }, [values.country]); // Calls fetchRegions when country changes

                    useEffect(() => {
                        if (values.tag_group) {
                            fetchTags(Number(values.tag_group));
                        }
                    }, [values.tag_group]);
                    return (
                        <Form>
                            <ModalBody>
                                <FormControl mb={4} isReadOnly>
                                    <FormLabel>Type</FormLabel>
                                    <Field as={Input} bg="white" name="dx_card_type" value={values.dx_card_type?.name} isDisabled />
                                </FormControl>

                                <FormControl mb={4} position="relative" zIndex={5} ref={postcardDropdownRef}>
                                    <FormLabel>Postcard (Optional)</FormLabel>
                                    <Field
                                        as={Input}
                                        bg="white"
                                        name="postcard.name"
                                        value={values.postcard?.name || ''}
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setFieldValue('postcard.name', e.target.value);
                                            handlePostcardSearchDebounced(e.target.value);
                                        }}
                                        onFocus={() => setIsDropdownOpen(postcardSuggestions.length > 0)} // Open dropdown on focus
                                    />
                                    {isDropdownOpen && (
                                        <Box
                                            border="1px solid"
                                            bg="white"
                                            mt={8}
                                            p={2}
                                            borderRadius="md"
                                            position="absolute"
                                            top={12}
                                            width="100%"
                                            maxH="150px"
                                            overflowY="auto"
                                            boxShadow="md"
                                        >
                                            {postcardSuggestions.map(({ id, name, coverImage, country, album, intro, story, tags }) => (
                                                <Box
                                                    key={id}
                                                    p={2}
                                                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevents input blur

                                                        setFieldValue('postcard', { id, name });
                                                        setFieldValue('coverImage', coverImage?.id || '');
                                                        setFieldValue('coverImageUrl', coverImage?.url || '');
                                                        setFieldValue('name', name);
                                                        setFieldValue('country', country?.id || '');
                                                        setFieldValue('region', album?.region || { name: '' });
                                                        setFieldValue('intro', intro || '');
                                                        setFieldValue('tag_group', tags?.length ? tags[0].tag_group?.id : '');
                                                        setFieldValue('tags', tags?.slice(0, 2) || []);

                                                        setIsDropdownOpen(false);
                                                        setPostcardSuggestions([]); // Clear suggestions
                                                    }}
                                                >
                                                    {name}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </FormControl>

                                <FormControl mb={2}>
                                    <FormLabel>Cover Image</FormLabel>
                                    {values?.coverImage ? <Box position={"relative"}>
                                        <ChakraNextImage src={values.coverImageUrl} objectFit={"cover"} borderRadius={"xl"} alt={"New Dx Experience Image"} />
                                        <Button
                                            variant="none"
                                            position="absolute"
                                            top={1}
                                            right={1}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById('file-input-coverImage').click();
                                            }}
                                            bg="white"
                                            borderRadius="full"
                                            p={1}
                                        >
                                            <CameraIcon w="100%" h="100%" display="flex" justifyContent="center" alignItems="center" mx="auto" viewBox="0 0 14 14" />
                                        </Button>
                                    </Box>
                                        :
                                        <Button onClick={(e) => {
                                            e.stopPropagation();
                                            document.getElementById('file-input-coverImage').click();
                                        }}>
                                            Upload Image
                                        </Button>
                                    }
                                    <Input
                                        id="file-input-coverImage"
                                        type="file"
                                        accept="image/*"
                                        display="none"
                                        onChange={(event) => handleImageUpload(event, setFieldValue, 'coverImage')}
                                    />
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Title</FormLabel>
                                    <Field as={Input} bg="white" name="name" autoComplete="off" required />
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Country</FormLabel>
                                    <Field
                                        as={Select}
                                        name="country"
                                        bg="white"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            const selectedValue = e.target.value; // Extract value from event
                                            setFieldValue('country', selectedValue);
                                            setFieldValue('region', '');
                                            // fetchRegions(selectedValue);
                                        }}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Field>
                                </FormControl>


                                <FormControl mb={4} position="relative" zIndex={5} ref={regionDropdownRef} isDisabled={!values?.country}>
                                    <FormLabel>Region</FormLabel>
                                    <Field
                                        as={Input}
                                        bg="white"
                                        type="text"
                                        name="region.name"
                                        autoComplete="off"
                                        value={values.region?.name || ''}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setFieldValue('region', { name: inputValue }); // Store as { name }
                                            setIsRegionDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsRegionDropdownOpen(regionSuggestions.length > 0)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && values.region?.name?.trim() !== '') {
                                                e.preventDefault(); // Prevent form submission
                                                setFieldValue('region', { name: values.region?.name, country: values?.country?.id });
                                                setIsTagDropdownOpen(false);
                                                e.target.blur();
                                            }
                                        }}
                                    />
                                    {isRegionDropdownOpen && regionSuggestions.filter((item) => item.name.toLowerCase().includes(values.region?.name?.toLowerCase() ?? '')).length > 0 && (
                                        <Box
                                            border="1px solid"
                                            bg="white"
                                            mt={1}
                                            p={2}
                                            borderRadius="md"
                                            position="absolute"
                                            width="100%"
                                            maxH="200px"
                                            overflowY="auto"
                                            boxShadow="md"
                                        >
                                            {regionSuggestions
                                                .filter((item) => item.name.toLowerCase().includes(values.region?.name?.toLowerCase() ?? ''))
                                                .map((item) => (
                                                    <Box
                                                        key={item.id}
                                                        p={2}
                                                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                        onClick={() => {
                                                            setFieldValue('region', item); // Store as { id, name }
                                                            setIsRegionDropdownOpen(false);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Box>
                                                ))
                                            }
                                        </Box>
                                    )}
                                </FormControl>

                                <FormControl mb={4}>
                                    <FormLabel>Tag Group</FormLabel>
                                    <Field
                                        as={Select}
                                        name="tag_group"
                                        bg="white"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            const selectedValue = e.target.value; // Extract value from event
                                            setFieldValue('tag_group', selectedValue);
                                            setFieldValue('tags', [])
                                            setFieldValue('tagsInput', '')
                                            // fetchTags(selectedValue);
                                        }}
                                    >
                                        <option value="">Select Tag Group</option>
                                        {tagGroups?.map((tg) => (
                                            <option key={tg.id} value={tg.id}>
                                                {tg.name}
                                            </option>
                                        ))}
                                    </Field>
                                </FormControl>

                                <FormControl mb={4} position="relative" isDisabled={!values?.tag_group || values.tags.length >= 2} ref={tagsDropdownRef}>
                                    <FormLabel>Tags (Max 2)</FormLabel>
                                    <Field
                                        as={Input}
                                        bg="white"
                                        name="tagsInput"
                                        autoComplete="off"
                                        value={values.tagsInput || ''}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setFieldValue('tagsInput', inputValue); // Store input value separately
                                            setIsTagDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsTagDropdownOpen(tagSuggestions.length > 0)}
                                        placeholder="Search for tags..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && values.tagsInput.trim() !== '') {
                                                e.preventDefault(); // Prevent form submission
                                                if (values.tags.length < 2) {
                                                    fetchPaginatedResults('tags', {
                                                        name: { $containsi: values.tagsInput.trim() }
                                                    }, {
                                                        tag_group: true
                                                    }).then((response) => {
                                                        const oldTag = Array.isArray(response) ? response[0] : response
                                                        // console.log(oldTag)
                                                        if (!oldTag) {
                                                            const newTag = {
                                                                name: values.tagsInput.trim(),
                                                                tag_group: { id: Number(values.tag_group) } || null, // Ensure tag_group is included
                                                            };
                                                            setFieldValue('tags', [...values.tags, newTag]); // Add the new tag
                                                            setFieldValue('tagsInput', ''); // Clear input
                                                            setIsTagDropdownOpen(false);
                                                        } else {
                                                            toast({
                                                                title: "Tag Conflict",
                                                                description: `${values.tagsInput.trim()} is present in ${oldTag.tag_group.name}`,
                                                                status: "warning",
                                                                duration: 5000,
                                                                isClosable: true,
                                                                position: "top",
                                                            });
                                                        }
                                                    })
                                                }
                                            }
                                        }}
                                    />
                                    {isTagDropdownOpen && tagSuggestions
                                        .filter((item) =>
                                            item.name.toLowerCase().includes(values.tagsInput?.toLowerCase() ?? '') &&
                                            !values.tags?.some(tag => tag.id === item.id) // Prevent duplicate selection
                                        ).length > 0 && (
                                            <Box
                                                border="1px solid"
                                                bg="white"
                                                mt={1}
                                                p={2}
                                                zIndex={5}
                                                borderRadius="md"
                                                position="absolute"
                                                width="100%"
                                                maxH="200px"
                                                overflowY="auto"
                                                boxShadow="md"
                                            >
                                                {tagSuggestions
                                                    .filter((item) =>
                                                        item.name.toLowerCase().includes(values.tagsInput?.toLowerCase() ?? '') &&
                                                        !values.tags?.some(tag => tag.id === item.id) // Prevent duplicate selection
                                                    )
                                                    ?.map((item) => (
                                                        <Box
                                                            key={item.id}
                                                            p={2}
                                                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                            onClick={() => {
                                                                if (values.tags.length < 2) {
                                                                    setFieldValue('tags', [...values.tags, item]); // Add tag
                                                                    setFieldValue('tagsInput', ''); // Clear input
                                                                    setIsTagDropdownOpen(false);
                                                                }
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Box>
                                                    ))
                                                }
                                            </Box>
                                        )}

                                    {/* Display Selected Tags */}
                                    <Flex mt={2} flexWrap="wrap">
                                        {values.tags.map((tag, index) => (
                                            <Box key={tag.id} bg="blue.500" color="white" px={3} py={1} borderRadius="md" mr={2} mb={2}>
                                                {tag.name}
                                                <Button
                                                    size="xs"
                                                    ml={2}
                                                    variant="unstyled"
                                                    onClick={() => setFieldValue('tags', values.tags.filter((_, i) => i !== index))} // Remove tag
                                                >
                                                    ✕
                                                </Button>
                                            </Box>
                                        ))}
                                    </Flex>
                                </FormControl>


                                <FormControl mb={4}>
                                    <FormLabel>Intro</FormLabel>
                                    <Field as={Textarea} bg="white" name="intro" autoComplete="off" whiteSpace={"pre-line"} required />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Story</FormLabel>
                                    <MarkdownEditor
                                        value={values.story}
                                        onChange={(e) => setFieldValue('story', e)}
                                        display="flex"
                                        style={{ flex: 1, flexDirection: "column", width: "100%", background: "white" }}
                                    />
                                </FormControl>


                            </ModalBody>

                            <ModalFooter>
                                <Button type="submit" colorScheme="blue">Submit</Button>
                                <Button onClick={onClose} ml={2}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    )
                }}
            </Formik>
        } />
    )
}

export default DxExperienceForm