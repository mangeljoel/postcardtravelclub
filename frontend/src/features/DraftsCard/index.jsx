import React, { useState, useCallback, useEffect } from "react";
import {
    Box,
    Flex,
    AspectRatio,
    Skeleton,
    Button,
    Text,
    Input,
    VStack,
    Textarea,
    Divider,
    Select,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormErrorMessage,
    Spacer,
    useToast
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { slugify, uploadfile } from "../../services/utilities";
import Autocomplete from "react-autocomplete";
import PostcardAlert from "../PostcardAlert";
import debounce from "lodash.debounce";
import ImageCrop from "../ImageCrop";
import { Formik, Form, Field, FieldArray } from "formik";
import {
    getorCreateTagsByName,
    updatePostCard,
    getCountryByWord,
    getTagsByWord,
    fetchPaginatedResults,
    deleteDBEntry
} from "../../queries/strapiQueries";
import * as yup from "yup";
import { useQueryClient } from "react-query";
import strapi from "../../queries/strapi";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { apiNames } from "../../services/fetchApIDataSchema";

const DraftsCard = ({
    postcard,
    story,
    onDeletecard,
    refetch,
    isEdit,
    isCreate,
    editCard,
    handlePublish
}) => {
    const [isEditing, setIsEditing] = useState(isEdit ? isEdit : true);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [deleteAlert, showAlert] = useState({
        message: "delete",
        mode: false
    });
    const [uploadImg, setUpImg] = useState();
    const [showCrop, setShowCrop] = useState(false);
    const [tagList, setTagList] = useState([]);
    const [tagGroups, setTagGroups] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const toast = useToast();

    const DraftValidation = yup.object().shape({
        intro: yup
            .string()
            .required("Introduction is required")
            .typeError("Please add a short intro to the story"),
        name: yup
            .string()
            .min(1)
            .required("Title is required")
            .typeError("Please add a title for the story"),
        country: yup
            .string()
            .min(1)
            .required("Country is required")
            .typeError("Please add a country")
    });

    const debouncedSave = useCallback(
        debounce((newValue, type, tagGroup) => {
            if (type === "isTag") handleTagInput(encodeURIComponent(newValue), tagGroup);
            else if (type === "isCountry") handleCountryInput(newValue);
        }, 500),
        []
    );

    const handleDelete = async (e) => {
        e?.stopPropagation();
        e?.preventDefault();
        setDeleteLoading(true);

        try {
            if (postcard?.id) {
                await deleteDBEntry(apiNames.postcard, postcard.id);
                showAlert({ mode: false });
            }
        } catch (error) {
            console.error("Failed to delete postcard:", error);
            toast({
                title: "Error",
                description: "Failed to delete postcard. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } finally {
            setDeleteLoading(false);
            await refetch();
        }
    };

    const handleTagInput = async (e, tagGroup) => {
        const hashtaglist = await getTagsByWord(e, tagGroup);
        if (hashtaglist?.data?.length) setTagList(hashtaglist.data);
        else setTagList([]);
    };

    const handleCountryInput = async (e) => {
        const countryList = await getCountryByWord(
            e.charAt(0).toUpperCase() + e.slice(1)
        );
        if (countryList?.data) setCountryList(countryList.data);
        else setCountryList([]);
    };

    const onTagChange = (word, isTag, tagGroup) => {
        debouncedSave(word, "isTag", tagGroup);
    };

    const onCountryChange = (word) => {
        debouncedSave(word, "isCountry");
    };

    const onDrop = useCallback((acceptedFile) => {
        setUpImg(acceptedFile[0]);
        setShowCrop(true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false
    });

    useEffect(() => {
        fetchPaginatedResults('tag-groups').then((res) => setTagGroups(res));
    }, []);

    const getTagGroup = (postcard) => {
        const tags = postcard?.tags || [];
        const tagG = [];
        for (const t of tags) {
            tagG.push(t.tag_group);
        }
        return tagG?.length > 0 ? tagG[0] : null;
    };

    const checkTagsInTagGroups = async (tags, tagGroup) => {
        if (tags?.length < 1) {
            toast({
                title: "Tag Insufficient",
                description: "Enter at least 1 tag",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return false;
        }

        try {
            const res = await fetchPaginatedResults('tags', {
                name: {
                    $in: tags?.map((t) => t.name.toLowerCase()) || [],
                }
            }, { tag_group: true });
            const response = Array.isArray(res) ? res : [res];

            for (const tag of response) {
                if (tag?.tag_group?.id === tagGroup?.id || !tag?.tag_group) {
                    continue;
                } else {
                    toast({
                        title: "Tag Conflict",
                        description: `${tag.name} is present in ${tag.tag_group.name}`,
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                    });
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error("Error fetching tags:", error);
            toast({
                title: "Error",
                description: "There was an error fetching tags.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return false;
        }
    };

    const queryClient = useQueryClient();

    return (
        <>
            {isEditing && (
                <Box
                    bg="white"
                    w={["100%", "314px", "314px", "25vw"]}
                    minW={["314px", "314px", "314px", "25vw"]}
                    borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                    boxShadow="lg"
                    boxSizing="border-box"
                    p="0px"
                    height="auto"
                    ref={(ref) => setCardFrontRef(ref)}
                >
                    <Skeleton width="100%" isLoaded={true}>
                        <Box pos="relative">
                            <AspectRatio maxW="100%" ratio={1}>
                                <ChakraNextImage
                                    loading="lazy"
                                    width="100%"
                                    borderTopLeftRadius="8px"
                                    borderTopRightRadius="8px"
                                    src={
                                        postcard.coverImage?.url ||
                                        "/assets/images/p_stamp.png"
                                    }
                                    alt="img"
                                />
                            </AspectRatio>
                            <Box
                                pos="absolute"
                                top="8px"
                                right="8px"
                                {...getRootProps()}
                            >
                                <ChakraNextImage
                                    loading="lazy"
                                    background="white"
                                    borderRadius="full"
                                    width="30px"
                                    height="30px"
                                    padding="5px"
                                    src={"/assets/creator/camera.svg"}
                                    alt={"camera icon"}
                                />
                                <input {...getInputProps()} />
                            </Box>
                        </Box>
                        {showCrop && (
                            <ImageCrop
                                selectedImage={uploadImg}
                                cropType={{
                                    aspect: 1 / 1,
                                    width: 800,
                                    minHeight: 800
                                }}
                                locked={false}
                                resetCrop={() => {
                                    setShowCrop(false);
                                }}
                                callUploadFile={async (croppedFile) => {
                                    if (postcard.coverImage?.id) {
                                        await strapi.delete(
                                            "upload/files",
                                            postcard.coverImage.id
                                        );
                                    }
                                    uploadfile(
                                        croppedFile,
                                        postcard.id,
                                        "postcards",
                                        "coverImage",
                                        {},
                                        async (result) => {
                                            queryClient.invalidateQueries();
                                            if (refetch) refetch();
                                            setShowCrop(false);
                                        }
                                    );
                                }}
                            />
                        )}
                    </Skeleton>
                    <Formik
                        enableReinitialize={true}
                        validationSchema={DraftValidation}
                        initialValues={{
                            intro: postcard.intro || "",
                            tagGroup: getTagGroup(postcard) || null,
                            tags: [
                                postcard.tags?.length > 0 && postcard.tags[0]
                                    ? postcard.tags[0]
                                    : "",
                                postcard.tags?.length > 1 && postcard.tags[1]
                                    ? postcard.tags[1]
                                    : "",
                            ],
                            name: postcard.name || "",
                            country: story?.country?.name || postcard?.country?.name || "",
                            copyright: postcard.copyright || ""
                        }}
                        onSubmit={async (values, actions) => {
                            if (!values) return;

                            setSaveLoading(true);

                            const filteredTags = values.tags.filter((tag) => tag?.name?.trim() !== "" && tag != "");

                            if (!await checkTagsInTagGroups(filteredTags, values.tagGroup)) {
                                setSaveLoading(false);
                                return;
                            }

                            let newTagList = [];
                            if (filteredTags && filteredTags.length > 0) {
                                let namelist = [];
                                filteredTags.map((ele) => {
                                    let name = encodeURIComponent(ele.name).toLowerCase();
                                    namelist.push(name);
                                });

                                if (namelist.length > 0) {
                                    newTagList = await getorCreateTagsByName(namelist, values.tagGroup.id);
                                }
                            }

                            // Determine isComplete based on button clicked
                            const isComplete = postcard?.isComplete ? true : true; // Publishing makes it complete

                            let updatePostcard = {
                                intro: values.intro,
                                name: values.name,
                                country: story?.country?.id,
                                copyright: values.copyright,
                                tags: newTagList,
                                isComplete: isComplete,
                            };

                            try {
                                const response = await updatePostCard(
                                    postcard.id,
                                    postcard.slug
                                        ? updatePostcard
                                        : { ...updatePostcard, slug: slugify(postcard.name || values.name) }
                                );

                                if (response) {
                                    setIsEditing(false);

                                    toast({
                                        title: "Postcard Published!",
                                        description: "Your postcard has been published successfully.",
                                        status: "success",
                                        duration: 3000,
                                        isClosable: true,
                                        position: "top",
                                    });
                                }
                            } catch (err) {
                                console.error("Failed to update postcard:", err);
                                toast({
                                    title: "Error",
                                    description: "Failed to update postcard. Please try again.",
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                    position: "top",
                                });
                            } finally {
                                setSaveLoading(false);
                                refetch();
                            }
                        }}
                    >
                        {(props) => (
                            <Form>
                                <Box
                                    overflow="scroll"
                                    w="100%"
                                    textAlign="left"
                                    mt="2%"
                                    p={"12px"}
                                    pos="relative"
                                >
                                    <Box pos="relative">
                                        <Text mt="5%" mb="8px" variant="formLabel">
                                            Add a Tag Group
                                        </Text>
                                        <Field name="tagGroup">
                                            {({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder="Select a tag group"
                                                    onChange={(e) => {
                                                        const selected = tagGroups.find(
                                                            (group) => group.id === parseInt(e.target.value)
                                                        );
                                                        props.setFieldValue("tagGroup", selected);
                                                    }}
                                                    value={props.values.tagGroup?.id || ""}
                                                >
                                                    {tagGroups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Field>
                                    </Box>

                                    <Box pos="relative">
                                        <Text mt="5%" mb="8px" variant="formLabel">
                                            Add up to 2 keywords that best highlight this postcard experience
                                        </Text>
                                        <br />
                                        <FieldArray
                                            name="tags"
                                            render={(arrayHelpers) => (
                                                <VStack width="100%">
                                                    {props.values.tags &&
                                                        props.values.tags.length > 0 &&
                                                        props.values.tags.map((tag, index) => (
                                                            <div key={index} style={{ width: "100%" }}>
                                                                <Field name={`tags.${index}.name`}>
                                                                    {({ field, form }) => (
                                                                        <Autocomplete
                                                                            menuStyle={{
                                                                                zIndex: "9999",
                                                                                borderWidth: "1px",
                                                                                marginTop: "2px",
                                                                                padding: "3px",
                                                                                width: "100%",
                                                                                borderColor:
                                                                                    tagList && tagList.length > 0
                                                                                        ? "#f8b09d"
                                                                                        : "transparent",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                            {...field}
                                                                            wrapperStyle={{ width: "100%" }}
                                                                            inputProps={{
                                                                                id: `tags.${index}.name`,
                                                                                style: {
                                                                                    borderWidth: "1px",
                                                                                    height: "38px",
                                                                                    borderRadius: "8px",
                                                                                    padding: "8px",
                                                                                    width: "100%",
                                                                                    backgroundColor: props.values.tagGroup
                                                                                        ? "white"
                                                                                        : "#f0f0f0",
                                                                                    cursor: props.values.tagGroup
                                                                                        ? "text"
                                                                                        : "not-allowed",
                                                                                },
                                                                                disabled: !props.values.tagGroup,
                                                                                onKeyUp: (e) => {
                                                                                    if (props.values.tagGroup) {
                                                                                        field.onChange(e);
                                                                                    }
                                                                                },
                                                                                onFocus: (e) => {
                                                                                    if (props.values.tagGroup) {
                                                                                        onTagChange(
                                                                                            e.target.value.toLowerCase(),
                                                                                            true,
                                                                                            props.values.tagGroup
                                                                                        );
                                                                                    }
                                                                                }
                                                                            }}
                                                                            getItemValue={(item) =>
                                                                                item.name.charAt(0).toUpperCase() +
                                                                                item.name.slice(1)
                                                                            }
                                                                            items={tagList}
                                                                            renderItem={(item, isHighlighted) => (
                                                                                <div
                                                                                    style={{
                                                                                        borderWidth: "0px",
                                                                                        background: isHighlighted
                                                                                            ? "#f8b09d"
                                                                                            : "white",
                                                                                        zIndex: "9999",
                                                                                        padding: "2px",
                                                                                    }}
                                                                                >
                                                                                    {item.name.charAt(0).toUpperCase() +
                                                                                        item.name.slice(1)}
                                                                                </div>
                                                                            )}
                                                                            onChange={(e) => {
                                                                                if (props.values.tagGroup) {
                                                                                    field.onChange(e);
                                                                                    onTagChange(
                                                                                        e.target.value.toLowerCase(),
                                                                                        true,
                                                                                        props.values.tagGroup
                                                                                    );
                                                                                }
                                                                            }}
                                                                            onSelect={(val, item) => {
                                                                                if (props.values.tagGroup) {
                                                                                    form.setFieldValue(
                                                                                        `tags.${index}.name`,
                                                                                        val.charAt(0).toUpperCase() +
                                                                                        val.slice(1)
                                                                                    );
                                                                                    form.setFieldValue(
                                                                                        `tags.${index}.id`,
                                                                                        item.id
                                                                                    );
                                                                                    setTagList([]);
                                                                                }
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        ))}
                                                </VStack>
                                            )}
                                        />
                                    </Box>

                                    <Box mt="2%">
                                        <Field name="name" key="name">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={form.errors.name && form.touched.name}
                                                >
                                                    <Flex mt="5%" mb="8px" w="100%">
                                                        <Text variant="formLabel">
                                                            Title of the story &nbsp;
                                                            <Text variant="formReq">(required)</Text>
                                                        </Text>
                                                        <Spacer />
                                                    </Flex>

                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        placeholder="Enter a title for the story"
                                                        borderColor={
                                                            form.errors.name && form.touched.name
                                                                ? "#EA6147!important"
                                                                : ""
                                                        }
                                                        boxShadow={
                                                            form.errors.name && form.touched.name
                                                                ? "0 0 0 1px #EA6147!important"
                                                                : ""
                                                        }
                                                    />

                                                    <FormErrorMessage color="primary_1">
                                                        {form.errors.name}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </Box>

                                    <Box>
                                        <Text mt="5%" mb="8px" variant="formLabel">
                                            Country &nbsp;
                                            <Text variant="formReq">(required)</Text>
                                        </Text>
                                        <br />
                                        <Field name="country">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.country || form.touched.country
                                                    }
                                                >
                                                    <Autocomplete
                                                        {...field}
                                                        menuStyle={{
                                                            zIndex: "9999",
                                                            borderWidth: "1px",
                                                            marginTop: "2px",
                                                            padding: "3px",
                                                            width: "100%",
                                                            borderColor:
                                                                countryList && countryList.length > 0
                                                                    ? "#f8b09d"
                                                                    : "transparent",
                                                            borderRadius: "8px"
                                                        }}
                                                        wrapperStyle={{ width: "100%" }}
                                                        inputProps={{
                                                            id: "country",
                                                            style: {
                                                                borderWidth: "1px",
                                                                height: "38px",
                                                                borderRadius: "8px",
                                                                padding: "8px",
                                                                width: "100%",
                                                                borderColor:
                                                                    form.errors.country &&
                                                                        form.touched.country
                                                                        ? "#EA6147"
                                                                        : "",
                                                            },
                                                            placeholder: "Enter Country"
                                                        }}
                                                        getItemValue={(item) => item.name}
                                                        items={countryList}
                                                        renderItem={(item, isHighlighted) => (
                                                            <div
                                                                style={{
                                                                    borderWidth: "0px",
                                                                    background: isHighlighted
                                                                        ? "#f8b09d"
                                                                        : "white",
                                                                    zIndex: "9999",
                                                                    padding: "2px"
                                                                }}
                                                            >
                                                                {item.name}
                                                            </div>
                                                        )}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (e.target.value)
                                                                onCountryChange(e.target.value);
                                                        }}
                                                        onSelect={(val, item) => {
                                                            props.setFieldValue("country", val);
                                                        }}
                                                    />
                                                    <FormErrorMessage color="primary_1">
                                                        {form.errors.country}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </Box>

                                    <Box>
                                        <Field name="intro">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.intro || form.touched.intro
                                                    }
                                                >
                                                    <Flex
                                                        mt="5%"
                                                        mb="8px"
                                                        justifyContent="space-between"
                                                    >
                                                        <Text variant="formLabel">
                                                            Introduction &nbsp;
                                                            <Text variant="formReq">(required)</Text>
                                                        </Text>
                                                    </Flex>

                                                    <Textarea
                                                        {...field}
                                                        borderColor={
                                                            form.errors.intro && form.touched.intro
                                                                ? "#EA6147!important"
                                                                : ""
                                                        }
                                                        boxShadow={
                                                            form.errors.intro && form.touched.intro
                                                                ? "0 0 0 1px #EA6147!important"
                                                                : ""
                                                        }
                                                        rows="6"
                                                        placeholder="Add a compelling highlight in 60 words or less that serves as a hook for this postcard"
                                                    />
                                                    <FormErrorMessage color="primary_1">
                                                        {form.errors.intro}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </Box>

                                    <Box float="left" width="100%">
                                        <Divider mt="3%" />
                                        <Text mt="5%" mb="8px" variant="formLabel">
                                            Copyright (if any)
                                        </Text>
                                        <Field name="copyright">
                                            {({ field, form }) => (
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        color="gray.300"
                                                        fontSize="1.2em"
                                                        children="@"
                                                    />
                                                    <Input
                                                        {...field}
                                                        placeholder="Add image copyright info (if any)"
                                                    />
                                                </InputGroup>
                                            )}
                                        </Field>
                                    </Box>

                                    <Flex
                                        mt="10%"
                                        ml="auto"
                                        mr="auto"
                                        width="100%"
                                        float="left"
                                        textAlign="center"
                                        justifyContent="space-evenly"
                                        height="44px"
                                    >
                                        {!postcard?.isComplete ? (
                                            <Button
                                                isLoading={saveLoading}
                                                disabled={deleteLoading}
                                                onClick={(e) => {
                                                    e?.stopPropagation();
                                                    e?.preventDefault();
                                                    props.handleSubmit();
                                                }}
                                            >
                                                Publish
                                            </Button>
                                        ) : (
                                            <Button
                                                isLoading={saveLoading}
                                                disabled={deleteLoading}
                                                onClick={(e) => {
                                                    e?.stopPropagation();
                                                    e?.preventDefault();
                                                    props.handleSubmit();
                                                }}
                                            >
                                                Save
                                            </Button>
                                        )}

                                        <Button
                                            isLoading={deleteLoading}
                                            disabled={saveLoading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                showAlert({
                                                    message: " Are you sure to delete the postcard?",
                                                    mode: true
                                                });
                                            }}
                                            variant="outline"
                                            colorScheme="red"
                                        >
                                            Delete
                                        </Button>
                                    </Flex>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                    <PostcardAlert
                        isCentered={true}
                        closeOnEsc={true}
                        closeOnOverlayClick={true}
                        show={deleteAlert}
                        closeAlert={() => showAlert({ mode: false })}
                        handleAction={handleDelete}
                        buttonText="DELETE"
                    />
                </Box>
            )}
        </>
    );
};

export default DraftsCard;