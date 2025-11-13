import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import PostcardModal from '../../PostcardModal';
import { Field, Form, Formik } from 'formik';
import { createDBEntry, fetchPaginatedResults, updateDBValue } from '../../../queries/strapiQueries';
import { Box, Button, Flex, FormControl, FormLabel, Input, ModalBody, ModalFooter, Select, Textarea, useToast } from '@chakra-ui/react';
import { ChakraNextImage } from '../../../patterns/ChakraNextImage';
import { CameraIcon } from '../../../styles/ChakraUI/icons';
import { useCountries } from '../../../hooks/useCountriesHook';
import MarkdownEditor from '../../CreatePostcardPage/Properties/MarkdownEditor';
import { getUrlOfUploadImage } from '../../../services/utilities';
import SearchableDropdown from '../FormComponents/SearchableDropdown';
import strapi from '../../../queries/strapi';
import AppContext from '../../AppContext';

// Default initial values
const DEFAULT_FORM_VALUES = {
    dx_card_type: { id: 2, name: 'album' },
    album: '',
    coverImage: '',
    coverImageUrl: '',
    name: '',
    country: '',
    region: '',
    environment: '',
    cuisines: '',
    tag_group: '',
    tags: [],
    intro: '',
    story: '',
    lat: null,
    long: null,
    website: '',
    signature: '',
    date: ''
};

const DIRECTORY_IDS = {
    restaurant: 6,
    shopping: 8,
    events: 9
};

const isDirectoryScopedType = (type) => ['restaurant', 'shopping', 'events'].includes(type);
const getDirectoryId = (type) => DIRECTORY_IDS[type];

const DxStaysForm = ({ isOpen, headerText, onClose, mode = 'create', type = "stays", initialFormValues = null, handleReset, dxId }) => {
    const countries = useCountries() || [];
    const toast = useToast();
    const { profile } = useContext(AppContext)

    // State for various dropdown suggestions
    const [tagGroups, setTagGroups] = useState([]);
    const [albumSuggestions, setAlbumSuggestions] = useState([]);
    const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);
    const [regionSuggestions, setRegionSuggestions] = useState([]);
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
    const [isEnviornmentDropdownOpen, setIsEnvironmentDropdownOpen] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [environmentSuggestions, setEnvironmentSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    // Get initial form values based on mode
    const getInitialValues = () => {
        if (mode === 'create') {
            return DEFAULT_FORM_VALUES;
        }

        return {
            coverImage: initialFormValues?.coverImage?.id || '',
            coverImageUrl: initialFormValues?.coverImage?.url || null,
            lat: initialFormValues?.lat || null,
            long: initialFormValues?.long || null,
            website: initialFormValues?.website || '',
            signature: initialFormValues?.signature || null,
            name: initialFormValues?.name || '',
            country: initialFormValues?.country?.id || '',
            region: initialFormValues?.region || '',
            environment: initialFormValues?.environment || '',
            // category: initialFormValues?.category?.id || '',
            tags: initialFormValues?.cuisines || [],
            intro: initialFormValues?.intro || '',
            story: initialFormValues?.story || '',
            date: initialFormValues?.date || ''
        };
    };



    // Data fetching functions
    const fetchData = useCallback(async () => {
        try {
            const [environmentResponse, categoryResponse, tagGroupResponse] = await Promise.all([
                fetchPaginatedResults('environments', isDirectoryScopedType(type) ? { directory: { id: getDirectoryId(type) } } : {}, { fields: ['id', 'name'] }),
                fetchPaginatedResults('categories', isDirectoryScopedType(type) ? { directory: { id: getDirectoryId(type) } } : {}, { fields: ['id', 'name'] }),
                fetchPaginatedResults('tag-groups', {}, { fields: ['id', 'name'] })
            ]);
            setEnvironmentSuggestions(Array.isArray(environmentResponse) ? environmentResponse : [environmentResponse]);
            setCategorySuggestions(Array.isArray(categoryResponse) ? categoryResponse : [categoryResponse]);
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
    }, [toast]);

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

            let environmentId = values?.environment?.id || null;
            if (!environmentId && values.environment?.name) {
                const checkEnv = await checkEnvExistAlready(values.environment?.name, type);
                if (!checkEnv) {
                    try {
                        console.log(type);
                        console.log(isDirectoryScopedType(type));
                        console.log(getDirectoryId(type));
                        // return;
                        const newEnvironment = await createDBEntry('environments', {
                            name: values.environment.name,
                            directory: isDirectoryScopedType(type) ? getDirectoryId(type) : null
                        });
                        console.log(newEnvironment)
                        environmentId = newEnvironment?.data?.id;
                    } catch (err) {
                        console.log(err);
                    }

                } else environmentId = checkEnv?.id
            }

            const tagIds = await Promise.all(values.tags.map(async (tag) => {
                if (!tag.id) {

                    const newTag = await createDBEntry('categories', {
                        name: tag.name,
                        directory: isDirectoryScopedType(type) ? getDirectoryId(type) : null
                    });
                    return newTag?.data?.id;

                }
                return tag.id;

            }));

            // Prepare the payload
            const payload = {
                name: values.name,
                intro: values.intro || '',
                coverImage: values.coverImage || null,
                lat: values.lat || null,
                long: values.long || null,
                website: values.website || '',
                signature: values.signature || '',
                story: values.story || '',
                country: values.country || null,
                region: regionId,
                environment: environmentId || null,
                cuisines: tagIds,
                directories: [getDirectoryId(type)],
                isFeatured: true,
                isActive: true,
                user: profile?.id,
                date: values.date || null
            };

            // Create or update based on mode
            if (mode === 'create') {
                await createDBEntry('albums', payload).then(async (res) => {
                    if (res) {
                        let status = await fetchPaginatedResults("album-stages", { album: res?.data?.id }, {});
                        if (status) {
                            await updateDBValue("album-stages", status?.id, { state: "approved" });
                            // if (payload?.cuisines && payload?.cuisines?.length) {
                            //     payload?.cuisines?.map(async (cusId) => {
                            //         if (cusId) await updateDBValue("categories", cusId, { albums: [status?.id] })
                            //     })
                            // }
                        }

                    }
                })
            } else {
                await updateDBValue('albums', initialFormValues?.id, payload);
                // if (payload?.cuisines && payload?.cuisines?.length) {
                //     payload?.cuisines?.map(async (cusId) => {
                //         if (cusId) await updateDBValue("categories", cusId, { albums: initialFormValues?.id })
                //     })
                // }
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
            // handleReset();
            onClose();
        }
    };

    // Load initial data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const checkCuisineExistAlready = async (cuisineName) => {
        const response = await fetchPaginatedResults('categories', {
            name: { $containsi: cuisineName?.trim() },
            directory: 6
        }, {

        });
        const existingCusine = Array.isArray(response) ? response[0] : response;

        if (!existingCusine) {
            return false;
        }

        return true;
    }
    const checkEnvExistAlready = async (envName, type) => {
        const response = await fetchPaginatedResults(
            'environments',
            {
                name: { $containsi: envName?.trim() },
                directory: getDirectoryId(type)
            },
            {}
        );

        const existingEnv = Array.isArray(response) ? response[0] : response;

        if (!existingEnv) {
            return false;
        }
        return existingEnv;
    };

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
                    }, [values.country, fetchRegions]);

                    // Fetch tags when tag group changes
                    useEffect(() => {
                        if (values.tag_group) {
                            fetchTags(Number(values.tag_group));
                        }
                    }, [values.tag_group, fetchTags]);

                    // Check if selected tag already exists in another group
                    const checkCuisineExist = async (cusinieName) => {
                        try {
                            const response = await fetchPaginatedResults('categories', {
                                name: { $containsi: cusinieName.trim() },
                                directory: 6
                            }, {

                            });

                            const existingCusine = Array.isArray(response) ? response[0] : response;

                            if (!existingCusine) {
                                return false;
                            }
                            if (existingCusine?.name === cusinieName)

                                return existingCusine;
                            else return false;
                        } catch (error) {
                            console.error("Error checking tag existence:", error);
                            return false;
                        }
                    };

                    // Handle tag addition
                    const handleAddTag = () => {
                        const trimmed = values.tagsInput.trim();
                        if (!trimmed) return;

                        const newTag = {
                            name: trimmed,
                            directory: isDirectoryScopedType(type) ? getDirectoryId(type) : null
                        };

                        setFieldValue('tags', [...values.tags, newTag]);
                        setFieldValue('tagsInput', '');
                        setIsTagDropdownOpen(false);
                    };


                    return (
                        <Form>
                            <ModalBody>
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
                                    <FormLabel>{type === "events" ? "Event Name" : "Title"}</FormLabel>
                                    <Field as={Input} bg="white" name="name" autoComplete="off" required />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>{type == "shopping" ? "Shop Name" : type == "events" ? "Organiser" : "Restaurant Name"}</FormLabel>
                                    <Field as={Input} bg="white" name="signature" autoComplete="off" />
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
                                <Flex gap={3}>
                                    <FormControl mb={4}>
                                        <FormLabel>Latitude</FormLabel>
                                        <Field as={Input} bg="white" name="lat" autoComplete="off" />
                                    </FormControl>
                                    <FormControl mb={4}>
                                        <FormLabel>Longitude</FormLabel>
                                        <Field as={Input} bg="white" name="long" autoComplete="off" />
                                    </FormControl>
                                </Flex>
                                <FormControl mb={4}>
                                    <FormLabel>Website</FormLabel>
                                    <Field as={Input} bg="white" name="website" autoComplete="off" />
                                </FormControl>
                                {type === "events" &&
                                    (<FormControl mb={2}>
                                        <FormLabel>Date</FormLabel>
                                        <Field as={Input} bg="white" type="date" name="date" required />
                                    </FormControl>)
                                }
                                <FormControl mb={4}>
                                    <FormLabel>Type</FormLabel>
                                    <SearchableDropdown
                                        inputValue={values.environment?.name}
                                        placeholder="Enter Type name..."
                                        suggestions={environmentSuggestions}
                                        isOpen={isEnviornmentDropdownOpen}
                                        setIsOpen={setIsEnvironmentDropdownOpen}
                                        onInputChange={(e) => {
                                            setFieldValue('environment', { name: e.target.value });
                                            setIsEnvironmentDropdownOpen(true);
                                        }}
                                        onItemSelect={(type) => {
                                            setFieldValue('environment', type);
                                            setIsEnvironmentDropdownOpen(false);
                                        }}

                                    />
                                </FormControl>
                                {/* Environment Select */}
                                {/* <FormControl mb={4}>
                                    <FormLabel>{type == "restaurant" ? "Type" : "Environment"}</FormLabel>
                                    <Field
                                        as={Select}
                                        name="environment"
                                        bg="white"
                                        autoComplete="off"
                                    >
                                        <option value="">{type == "restaurant" ? "Select Type" : "Select Environment"}</option>
                                        {environmentSuggestions.map((env) => (
                                            <option key={env.id} value={env.id}>
                                                {env.name}
                                            </option>
                                        ))}
                                    </Field>
                                </FormControl> */}

                                {/* Category Select */}
                                {/* <FormControl mb={4}>
                                    <FormLabel>{type == "restaurant" ? "Cusines" : "Type"}</FormLabel>
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
                                </FormControl> */}

                                {/* Tag Group Select */}
                                {/* <FormControl mb={4}>
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
                                </FormControl> */}

                                {/* Tags Dropdown and Selection */}
                                <FormControl mb={4} isDisabled={!values.environment}>
                                    <FormLabel>
                                        {type === 'restaurant' ? 'Cuisines' : 'Tags'}
                                    </FormLabel>

                                    <SearchableDropdown
                                        inputValue={values.tagsInput}
                                        placeholder={`Search for ${type === 'restaurant' ? 'Cuisines' : 'Tags'}...`}
                                        suggestions={categorySuggestions}
                                        isOpen={isTagDropdownOpen}
                                        setIsOpen={setIsTagDropdownOpen}
                                        onInputChange={(e) => {
                                            setFieldValue('tagsInput', e.target.value);
                                            setIsTagDropdownOpen(true);
                                        }}
                                        onItemSelect={(tag) => {
                                            if (!values.tags.some(t => t.id === tag.id)) {
                                                setFieldValue('tags', [...values.tags, tag]);
                                                setFieldValue('tagsInput', '');
                                                setIsTagDropdownOpen(false);
                                            }
                                        }}
                                        filterFn={(item, value) => (
                                            item.name.toLowerCase().includes(value?.toLowerCase() ?? '') &&
                                            !values.tags?.some(tag => tag.id === item.id)
                                        )}
                                        disabled={!values.environment}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && values.tagsInput.trim() !== '') {
                                                e.preventDefault();
                                                handleAddTag();  // You should define this function
                                            }
                                        }}
                                    />

                                    {/* Dummy hidden input to manage form state */}
                                    <Input
                                        type="text"
                                        value={values.tagsInput || ''}
                                        display="none"
                                    />

                                    {/* Display Selected Tags */}
                                    <Flex mt={2} flexWrap="wrap">
                                        {values.tags.map((tag, index) => (
                                            <Box
                                                key={index}
                                                bg="blue.500"
                                                color="white"
                                                px={3}
                                                py={1}
                                                borderRadius="md"
                                                mr={2}
                                                mb={2}
                                            >
                                                {tag.name}
                                                <Button
                                                    size="xs"
                                                    ml={2}
                                                    variant="unstyled"
                                                    onClick={() =>
                                                        setFieldValue('tags', values.tags.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    ✕
                                                </Button>
                                            </Box>
                                        ))}
                                    </Flex>
                                </FormControl>


                                {/* Intro */}
                                <FormControl mb={4}>
                                    <FormLabel>Intro</FormLabel>
                                    <Field as={Textarea} bg="white" name="intro" autoComplete="off" whiteSpace="pre-line" required />
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

export default DxStaysForm;