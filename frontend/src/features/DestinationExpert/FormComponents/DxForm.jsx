import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import SearchableDropdown from '../FormComponents/SearchableDropdown';

const DxForm = ({ isOpen, headerText, onClose, mode = 'create', type = "stays", initialFormValues = null, handleReset, dxId }) => {
    const countries = useCountries() || [];
    const toast = useToast();

    // State for various dropdown suggestions
    const [tagGroups, setTagGroups] = useState([]);
    const [cardTypeSuggestions, setCardTypeSuggestions] = useState([]);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [regionSuggestions, setRegionSuggestions] = useState([]);
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [environmentSuggestions, setEnvironmentSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    const DEFAULT_FORM_VALUES = {
        dx_card_type: type == "stays" ? { id: 2, name: 'album' } : { id: 1, name: 'postcard' },
        album: '',
        postcard: '',
        coverImage: '',
        coverImageUrl: '',
        name: '',
        country: '',
        region: '',
        environment: '',
        category: '',
        tag_group: '',
        tags: [],
        intro: '',
        story: ''
    };
    // Get initial form values based on mode
    const getInitialValues = () => {
        if (mode === 'create') {
            return DEFAULT_FORM_VALUES;
        }

        return {
            dx_card_type: type == "stays" ? { id: 2, name: 'album' } : { id: 1, name: 'postcard' },
            album: initialFormValues?.album || '',
            postcard: initialFormValues?.postcard || '',
            coverImage: initialFormValues?.coverImage?.id || '',
            coverImageUrl: initialFormValues?.coverImage?.url || '',
            name: initialFormValues?.name || '',
            country: initialFormValues?.country?.id || '',
            region: initialFormValues?.region || '',
            environment: initialFormValues?.environment?.id || '',
            category: initialFormValues?.category?.id || '',
            tag_group: initialFormValues?.tag_group?.id || '',
            tags: initialFormValues?.tags?.slice(0, 2) || [],
            intro: initialFormValues?.intro || '',
            story: initialFormValues?.story || ''
        };
    };

    // Debounced album search function
    const handleTypeSearchDebounced = useCallback(
        debounce(async (query) => {
            if (!query || query.length < 3) {
                setCardTypeSuggestions([]);
                setIsTypeDropdownOpen(false);
                return;
            }

            try {
                let response
                if (type == "stays") {
                    response = await fetchPaginatedResults('albums', {
                        name: { $containsi: query },
                        directories: {
                            slug: { $in: ["mindful-luxury-hotels"] }
                        },
                        isFeatured: true,
                        isActive: true
                    }, {
                        fields: ['id', 'name', 'intro', 'story'],
                        coverImage: {
                            fields: ["url"]
                        },
                        country: {
                            fields: ["id", "name"]
                        },
                        region: {
                            fields: ["id", "name"]
                        },
                        environment: {
                            fields: ["id", "name"]
                        },
                        category: {
                            fields: ["id", "name"]
                        },
                    });
                } else {
                    response = await fetchPaginatedResults('postcards', {
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
                }

                const results = Array.isArray(response) ? response : [response];
                setCardTypeSuggestions(results);
                setIsTypeDropdownOpen(results.length > 0);
            } catch (error) {
                console.error("Error fetching album suggestions:", error);
                setCardTypeSuggestions([]);
                setIsTypeDropdownOpen(false);
            }
        }, 1000), // Reduced from 2000ms to 1000ms for better responsiveness
        []
    );

    // Data fetching functions
    const fetchData = useCallback(async () => {
        try {
            const fetchTagGroups = fetchPaginatedResults('tag-groups', {}, { fields: ['id', 'name'] });

            if (type === 'stays') {
                const [environmentResponse, categoryResponse, tagGroupResponse] = await Promise.all([
                    fetchPaginatedResults('environments', { directory: { id: 2 } }, { fields: ['id', 'name'] }),
                    fetchPaginatedResults('categories', { directory: { id: 2 } }, { fields: ['id', 'name'] }),
                    fetchTagGroups,
                ]);

                setEnvironmentSuggestions(Array.isArray(environmentResponse) ? environmentResponse : [environmentResponse]);
                setCategorySuggestions(Array.isArray(categoryResponse) ? categoryResponse : [categoryResponse]);
                setTagGroups(Array.isArray(tagGroupResponse) ? tagGroupResponse : [tagGroupResponse]);
            } else {
                const tagGroupResponse = await fetchTagGroups;
                setTagGroups(Array.isArray(tagGroupResponse) ? tagGroupResponse : [tagGroupResponse]);
                setEnvironmentSuggestions([]); // Optional: clear if previously set
                setCategorySuggestions([]);    // Optional: clear if previously set
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
            toast({
                title: "Error loading data",
                description: "Failed to load form data. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [type]);


    const fetchRegions = useCallback(async (countryId) => {
        if (!countryId) return;

        try {
            const response = await fetchPaginatedResults('regions', { country: countryId }, { fields: ['id', 'name'] });
            setRegionSuggestions(Array.isArray(response) ? response : [response]);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    }, []);

    const fetchTags = useCallback(async (tagGroupId) => {
        if (!tagGroupId) return;

        try {
            const response = await fetchPaginatedResults('tags', { tag_group: tagGroupId }, { fields: ['id', 'name'] });
            setTagSuggestions(Array.isArray(response) ? response : [response]);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }, []);

    // Handle image upload
    const handleImageUpload = (event, setFieldValue, fieldName) => {
        const file = event.target.files[0];
        if (!file) return;

        getUrlOfUploadImage(file, (result) => {
            if (fieldName === 'coverImage') {
                setFieldValue(fieldName, result.id);
                setFieldValue('coverImageUrl', result.url);
            } else {
                setFieldValue({ id: result.id, url: result.url });
            }
        });
    };

    // Unified submit function for both create and edit modes
    const handleSubmit = async (values, { setSubmitting }) => {
        let newCard;
        try {
            // Handle region creation if needed
            let regionId = values.region?.id || null;
            if (!regionId && values.region?.name) {
                const newRegion = await createDBEntry('regions', {
                    name: values.region.name,
                    country: values.country || null,
                });
                regionId = newRegion?.data?.id;
            }

            // Handle tags creation if needed
            const tagIds = await Promise.all(values.tags.map(async (tag) => {
                if (!tag.id) {
                    const newTag = await createDBEntry('tags', {
                        name: tag.name,
                        tag_group: Number(values.tag_group) || null,
                    });
                    return newTag?.data?.id;
                }
                return tag.id;
            }));

            // Prepare the payload
            const payload = {
                name: values.name,
                intro: values.intro || '',
                coverImage: values.coverImage || '',
                story: values.story || '',
                country: values.country || null,
                region: regionId,
                environment: values.environment || null,
                category: values.category || null,
                album: values.album?.id || null,
                postcard: values.postcard?.id || null,
                dx_card_type: values.dx_card_type?.id,
                destination_expert: dxId,
                tag_group: Number(values.tag_group) || null,
                tags: tagIds,
            };

            // Create or update based on mode
            if (mode === 'create') {
                newCard = await createDBEntry('dx-cards', payload);
            } else {
                newCard = await updateDBValue('dx-cards', initialFormValues?.id, payload);
            }

            toast({
                title: `${mode === 'create' ? 'Created' : 'Updated'} successfully`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

        } catch (error) {
            console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} dx-card:`, error);
            toast({
                title: "Error",
                description: `Failed to ${mode === 'create' ? 'create' : 'update'} entry. Please try again.`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
            const newCardId = newCard?.data?.id || null;
            if (newCardId) {
                const response = await fetchPaginatedResults('dx-cards', { id: newCardId }, {
                    destination_expert: { select: ["id"] },
                    dx_card_type: { select: ["id", "name"] },
                    coverImage: { select: ["id", "url"] },
                    country: { select: ["id", "name"] },
                    region: { select: ["id", "name"] },
                    environment: { select: ["id", "name"] },
                    category: { select: ["id", "name"] },
                    tags: { select: ["id", "name"] },
                    tag_group: { select: ["id", "name"] },
                    postcard: { select: ["id", "name"] },
                    album: { select: ["id", "name"] },
                });
                const newCardData = Array.isArray(response) ? response[0] : response;
                handleReset(mode, newCardData);
            }
            onClose();
        }
    };

    // Load initial data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <PostcardModal isShow={isOpen} headerText={headerText} handleClose={onClose}>
            <Formik
                initialValues={getInitialValues()}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => {
                    // Fetch regions when country changes
                    useEffect(() => {
                        if (values.country) {
                            fetchRegions(values.country);
                        }
                    }, [values.country]);

                    // Fetch tags when tag group changes
                    useEffect(() => {
                        if (values.tag_group) {
                            fetchTags(Number(values.tag_group));
                        }
                    }, [values.tag_group]);

                    // Check if selected tag already exists in another group
                    const checkTagExists = async (tagName) => {
                        try {
                            const response = await fetchPaginatedResults('tags', {
                                name: { $containsi: tagName.trim() }
                            }, {
                                tag_group: true
                            });

                            const existingTag = Array.isArray(response) ? response[0] : response;

                            if (!existingTag) {
                                return false;
                            }

                            toast({
                                title: "Tag Conflict",
                                description: `${tagName.trim()} is present in ${existingTag.tag_group.name}`,
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                                position: "top",
                            });

                            return true;
                        } catch (error) {
                            console.error("Error checking tag existence:", error);
                            return false;
                        }
                    };

                    // Handle tag addition
                    const handleAddTag = async () => {
                        if (!values.tagsInput || values.tags.length >= 2) return;

                        const tagExists = await checkTagExists(values.tagsInput);
                        if (!tagExists) {
                            const newTag = {
                                name: values.tagsInput.trim(),
                                tag_group: { id: Number(values.tag_group) }
                            };

                            setFieldValue('tags', [...values.tags, newTag]);
                            setFieldValue('tagsInput', '');
                            setIsTagDropdownOpen(false);
                        }
                    };

                    return (
                        <Form>
                            <ModalBody>
                                {/* Type Field (Read-only) */}
                                <FormControl mb={4} isReadOnly>
                                    <FormLabel>Type</FormLabel>
                                    <Field as={Input} bg="white" name="dx_card_type" value={values.dx_card_type?.name} isDisabled />
                                </FormControl>

                                {type == "stays" ? (
                                    <>
                                        {/* Album Search Dropdown */}
                                        <FormControl mb={4}>
                                            <FormLabel>Album (Optional)</FormLabel>
                                            <SearchableDropdown
                                                inputValue={values.album?.name}
                                                placeholder="Search for albums..."
                                                suggestions={cardTypeSuggestions}
                                                isOpen={isTypeDropdownOpen}
                                                setIsOpen={setIsTypeDropdownOpen}
                                                onInputChange={(e) => {
                                                    setFieldValue('album.name', e.target.value);
                                                    handleTypeSearchDebounced(e.target.value);
                                                }}
                                                onItemSelect={(album) => {
                                                    // Populate form with album data
                                                    setFieldValue('album', { id: album.id, name: album.name });
                                                    setFieldValue('coverImage', album.coverImage?.id || '');
                                                    setFieldValue('coverImageUrl', album.coverImage?.url || '');
                                                    setFieldValue('name', album.name);
                                                    setFieldValue('country', album.country?.id || '');
                                                    setFieldValue('region', album.region || { name: '' });
                                                    setFieldValue('environment', album.environment?.id || '');
                                                    setFieldValue('category', album.category?.id || '');
                                                    setFieldValue('intro', album.intro || '');
                                                    setIsTypeDropdownOpen(false);
                                                }}
                                            />
                                        </FormControl>
                                    </>
                                ) : (
                                    <>
                                        {/* Postcard Search Dropdown */}
                                        <FormControl mb={4}>
                                            <FormLabel>Postcard (Optional)</FormLabel>
                                            <SearchableDropdown
                                                inputValue={values.postcard?.name}
                                                placeholder="Search for postcards..."
                                                suggestions={cardTypeSuggestions}
                                                isOpen={isTypeDropdownOpen}
                                                setIsOpen={setIsTypeDropdownOpen}
                                                onInputChange={(e) => {
                                                    setFieldValue('postcard.name', e.target.value);
                                                    handleTypeSearchDebounced(e.target.value);
                                                }}
                                                onItemSelect={({ id, name, coverImage, country, album, intro, tags }) => {
                                                    // Populate form with album data
                                                    setFieldValue('postcard', { id, name });
                                                    setFieldValue('coverImage', coverImage?.id || '');
                                                    setFieldValue('coverImageUrl', coverImage?.url || '');
                                                    setFieldValue('name', name);
                                                    setFieldValue('country', country?.id || '');
                                                    setFieldValue('region', album?.region || { name: '' });
                                                    setFieldValue('intro', intro || '');
                                                    setFieldValue('tag_group', tags?.length ? tags[0].tag_group?.id : '');
                                                    setFieldValue('tags', tags?.slice(0, 2) || []);
                                                    setIsTypeDropdownOpen(false);
                                                }}
                                            />
                                        </FormControl>
                                    </>
                                )
                                }

                                {/* Cover Image */}
                                <FormControl mb={4}>
                                    <FormLabel>Cover Image</FormLabel>
                                    {values.coverImage ? (
                                        <Box position="relative">
                                            <ChakraNextImage
                                                src={values.coverImageUrl}
                                                objectFit="cover"
                                                borderRadius="xl"
                                                alt="DX Experience Image"
                                            />
                                            <Button
                                                variant="none"
                                                position="absolute"
                                                top={1}
                                                right={1}
                                                onClick={() => document.getElementById('file-input-coverImage').click()}
                                                bg="white"
                                                borderRadius="full"
                                                p={1}
                                            >
                                                <CameraIcon
                                                    w="100%"
                                                    h="100%"
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    mx="auto"
                                                    viewBox="0 0 14 14"
                                                />
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Button onClick={() => document.getElementById('file-input-coverImage').click()}>
                                            Upload Image
                                        </Button>
                                    )}
                                    <Input
                                        id="file-input-coverImage"
                                        type="file"
                                        accept="image/*"
                                        display="none"
                                        onChange={(event) => handleImageUpload(event, setFieldValue, 'coverImage')}
                                    />
                                </FormControl>

                                {/* Title */}
                                <FormControl mb={4}>
                                    <FormLabel>Title</FormLabel>
                                    <Field as={Input} bg="white" name="name" autoComplete="off" required />
                                </FormControl>

                                {/* Country Select */}
                                <FormControl mb={4}>
                                    <FormLabel>Country</FormLabel>
                                    <Field
                                        as={Select}
                                        name="country"
                                        bg="white"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            setFieldValue('country', e.target.value);
                                            setFieldValue('region', '');
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

                                {/* Region Dropdown */}
                                <FormControl mb={4} isDisabled={!values.country}>
                                    <FormLabel>Region</FormLabel>
                                    <SearchableDropdown
                                        inputValue={values.region?.name}
                                        placeholder="Enter region name..."
                                        suggestions={regionSuggestions}
                                        isOpen={isRegionDropdownOpen}
                                        setIsOpen={setIsRegionDropdownOpen}
                                        onInputChange={(e) => {
                                            setFieldValue('region', { name: e.target.value });
                                            setIsRegionDropdownOpen(true);
                                        }}
                                        onItemSelect={(region) => {
                                            setFieldValue('region', region);
                                            setIsRegionDropdownOpen(false);
                                        }}
                                        disabled={!values.country}
                                    />
                                </FormControl>

                                {/* Environment Select */} {/* Category Select */}
                                {type == "stays" && (
                                    <>
                                        <FormControl mb={4}>
                                            <FormLabel>Environment</FormLabel>
                                            <Field
                                                as={Select}
                                                name="environment"
                                                bg="white"
                                                autoComplete="off"
                                            >
                                                <option value="">Select Environment</option>
                                                {environmentSuggestions.map((env) => (
                                                    <option key={env.id} value={env.id}>
                                                        {env.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormControl>

                                        <FormControl mb={4}>
                                            <FormLabel>Type</FormLabel>
                                            <Field
                                                as={Select}
                                                name="category"
                                                bg="white"
                                                autoComplete="off"
                                            >
                                                <option value="">Select Type</option>
                                                {categorySuggestions.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </>
                                )}

                                {/* Tag Group Select */} {/* Tags Dropdown and Selection */}
                                {type !== "stays" && (
                                    <>
                                        <FormControl mb={4}>
                                            <FormLabel>Tag Group</FormLabel>
                                            <Field
                                                as={Select}
                                                name="tag_group"
                                                bg="white"
                                                autoComplete="off"
                                                onChange={(e) => {
                                                    setFieldValue('tag_group', e.target.value);
                                                    setFieldValue('tags', []);
                                                    setFieldValue('tagsInput', '');
                                                }}
                                            >
                                                <option value="">Select Tag Group</option>
                                                {tagGroups.map((tg) => (
                                                    <option key={tg.id} value={tg.id}>
                                                        {tg.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormControl>

                                        <FormControl mb={4} isDisabled={!values.tag_group || values.tags.length >= 2}>
                                            <FormLabel>Tags (Max 2)</FormLabel>
                                            <SearchableDropdown
                                                inputValue={values.tagsInput}
                                                placeholder="Search for tags..."
                                                suggestions={tagSuggestions}
                                                isOpen={isTagDropdownOpen}
                                                setIsOpen={setIsTagDropdownOpen}
                                                onInputChange={(e) => {
                                                    setFieldValue('tagsInput', e.target.value);
                                                    setIsTagDropdownOpen(true);
                                                }}
                                                onItemSelect={(tag) => {
                                                    if (values.tags.length < 2 && !values.tags.some(t => t.id === tag.id)) {
                                                        setFieldValue('tags', [...values.tags, tag]);
                                                        setFieldValue('tagsInput', '');
                                                        setIsTagDropdownOpen(false);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && values.tagsInput.trim() !== '') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                                filterFn={(item, value) => (
                                                    item.name.toLowerCase().includes(value?.toLowerCase() ?? '') &&
                                                    !values.tags?.some(tag => tag.id === item.id)
                                                )}
                                                disabled={!values.tag_group || values.tags.length >= 2}
                                            />

                                            {/* Display Selected Tags */}
                                            <Flex mt={2} flexWrap="wrap">
                                                {values.tags.map((tag, index) => (
                                                    <Box key={index} bg="blue.500" color="white" px={3} py={1} borderRadius="md" mr={2} mb={2}>
                                                        {tag.name}
                                                        <Button
                                                            size="xs"
                                                            ml={2}
                                                            variant="unstyled"
                                                            onClick={() => setFieldValue('tags', values.tags.filter((_, i) => i !== index))}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </Box>
                                                ))}
                                            </Flex>
                                        </FormControl>
                                    </>
                                )}

                                {/* Intro */}
                                <FormControl mb={4}>
                                    <FormLabel>Story</FormLabel>
                                    <Field as={Textarea} bg="white" name="intro" minH="180px" autoComplete="off" whiteSpace="pre-line" required />
                                </FormControl>

                                {/* Story Editor */}
                                {/* <FormControl>
                                    <FormLabel>Story</FormLabel>
                                    <MarkdownEditor
                                        value={values.story}
                                        onChange={(e) => setFieldValue('story', e)}
                                        display="flex"
                                        style={{ flex: 1, flexDirection: "column", width: "100%", background: "white" }}
                                    />
                                </FormControl> */}
                            </ModalBody>

                            <ModalFooter>
                                <Button type="submit" colorScheme="blue">
                                    {mode === 'create' ? 'Create' : 'Update'}
                                </Button>
                                <Button onClick={onClose} ml={2}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    );
                }}
            </Formik>
        </PostcardModal>
    );
};

export default DxForm;