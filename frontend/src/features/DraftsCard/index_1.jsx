import React, { useState, useCallback, useEffect, useContext } from "react";
import {
    Box,
    Flex,
    Image,
    AspectRatio,
    Skeleton,
    Heading,
    Button,
    Text,
    Input,
    List,
    ListItem,
    VStack,
    HStack,
    Textarea,
    Divider,
    RadioGroup,
    Radio,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormErrorMessage,
    Spacer,
    Icon
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import * as _ from "lodash";
import { slugify, uploadfile } from "../../services/utilities";

import { root, action_icons, title } from "./index.module.scss";
import Autocomplete from "react-autocomplete";
import PostcardAlert from "../PostcardAlert";
import debounce from "lodash.debounce";
import ImageCrop from "../ImageCrop";
import { Formik, Form, Field, FieldArray } from "formik";
import * as moment from "moment";
import AppContext from "../AppContext";
import {
    getorCreateTagsByName,
    updatePostCard,
    deletePostcard,
    getCountryByWord,
    getTagsByWord,
    getAlbumThemes
} from "../../queries/strapiQueries";
import * as yup from "yup";

import { useQueryClient } from "react-query";
import strapi from "../../queries/strapi";
import RadioGroupField from "../../patterns/FormBuilder/RadioGroupField";

const DraftsCard = ({
    postcard,
    story,
    onDeletecard,
    refetch,
    isEdit,
    isCreate,
    editCard,
    handlePublish,
    handleDelete
}) => {
    const { logOut, profile } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(isEdit ? isEdit : false);

    const [album_themes, setAlbumThemes] = useState([]);
    const [isPublished, setPublish] = useState(false);
    const [cardFrontRef, setCardFrontRef] = useState(null);
    const [deleteAlert, showAlert] = useState({
        message: "delete",
        mode: false
    });
    const [inCompleteAlert, showIncompleteAlert] = useState({
        message: "Error",
        mode: false
    });
    const [uploadImg, setUpImg] = useState();
    const [showCrop, setShowCrop] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);
    const now = moment();

    const checkWordCount = (value, limit) => {
        if (value && value.length >= 1) {
            return value.match(/\S+/g).length <= limit;
        }
    };

    const DraftValidation = yup.object().shape({
        story: yup
            .string()
            .required("story is required")
            .typeError("Please add a short story or anecdote")
            .test(
                "Check word count",
                "Word count exceeds the limit 300",
                (value) => {
                    return checkWordCount(value, 300);
                }
            ),
        intro: yup
            .string()
            .required("intro is required")
            .typeError("Please add a short intro to the story")
            .test(
                "Check word count",
                "Word count exceeds the limit 60",
                (value) => {
                    return checkWordCount(value, 60);
                }
            ),
        // category: yup.string().required("category is required"),
        name: yup
            .string()
            .min(1)
            .max(60)
            .required("title is required")
            .typeError("Please add a title for the story"),

        country: yup
            .string()
            .min(1)
            .required("country is required")
            .typeError("Please add a country")
        // city: yup.string().min(1).required("city required"),
        // location: yup.string().required("Location required")
    });

    const Phase1DraftValidation = yup.object().shape({
        name: yup
            .string()
            .min(1)
            .max(60)
            .required("title is required")
            .typeError("Please enter a title")

        // country: yup.string().min(1).required("country required")
        // city: yup.string().min(1).required("city required"),
        // location: yup.string().required("Location required")
    });
    const debouncedSave = useCallback(
        debounce((newValue, type) => {
            if (type === "isTag") handleTagInput(encodeURIComponent(newValue));
            // else if (type === "isCity") handleCityInput(newValue);
            else if (type === "isCountry") handleCountryInput(newValue);
        }, 500),

        []
    );

    const [newPostcard, setNewPostcard] = useState(postcard);
    const [tagList, setTagList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [selectedTagsList, setSelectedTagsList] = useState([]);
    const [isSaveNow, setIsSaveNow] = useState(false);

    const handleEdit = (event) => {
        event.stopPropagation();
        if (!isEditing) {
            setIsEditing(true);
        }
    };

    const handleSave = (e) => {
        if (e) e.stopPropagation();
        if (isEdit && !isCreate) {
            editCard(newPostcard);
        } else if (isEditing) {
            setIsEditing(false);
        } else {
            //delete card
            showAlert({
                message: " Are you sure to delete the postcard?",
                mode: true
            });
        }
    };

    // let handleDescriptionChange = (e) => {
    //     let inputValue = e.target.value;
    //     let np = newPostcard;
    //     np.description = inputValue;
    //     setNewPostcard(np);
    // };

    const handleTagInput = async (e) => {
        const hashtaglist = await getTagsByWord(e);
        if (hashtaglist?.data?.length) setTagList(hashtaglist.data);
        else setTagList([]);
    };
    // const handleCityInput = async (e) => {
    //     const cityList = await getCityByWord(e);
    //     setCityList(cityList);
    // };
    const handleCountryInput = async (e) => {
        const countryList = await getCountryByWord(
            e.charAt(0).toUpperCase() + e.slice(1)
        );
        if (countryList?.data) setCountryList(countryList.data);
        else setCountryList([]);
    };
    const onTagChange = (word, isTag) => {
        debouncedSave(word, "isTag");
    };
    // const onCityChange = (word, country) => {
    //     debouncedSave(country ? country + "*" + word : word, "isCity");
    // };
    const onCountryChange = (word) => {
        debouncedSave(word, "isCountry");
    };
    // const handleTagSelected = (item) => {
    //     setSelectedHashList((prev) => [...prev, item]);
    // };
    // const onFormKeyDown = (keyEvent) => {
    //     if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    //         keyEvent.preventDefault();
    //     }
    // };
    const checkIsAvailableToPublish = () => {
        return (
            !_.isEmpty(newPostcard.coverImage) &&
            !_.isEmpty(newPostcard.country) &&
            !_.isEmpty(newPostcard.name)
        );
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
        if (postcard) {
            setNewPostcard(postcard);
            fetchAlbumTheme();
        }
    }, [postcard]);
    const fetchAlbumTheme = async () => {
        let themes = await getAlbumThemes();
        if (themes && themes.data) setAlbumThemes(themes.data);
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
                    // borderRadius="8px"
                    boxShadow="lg"
                    boxSizing="border-box"
                    p="0px"
                    height="auto"
                    ref={(ref) => setCardFrontRef(ref)}
                >
                    <Skeleton width="100%" isLoaded={true}>
                        <Box pos="relative">
                            <AspectRatio maxW="100%" ratio={1}>
                                <Image
                                    loading="lazy"
                                    width="100%"
                                    borderTopLeftRadius="8px"
                                    borderTopRightRadius="8px"
                                    src={
                                        newPostcard.coverImage?.url ||
                                        "/assets/images/p_stamp.png"
                                    }
                                    alt="img"
                                ></Image>
                            </AspectRatio>
                            <Box
                                pos="absolute"
                                top="8px"
                                right="8px"
                                {...getRootProps()}
                            >
                                <Image
                                    loading="lazy"
                                    background="white"
                                    borderRadius="full"
                                    width="30px"
                                    height="30px"
                                    padding="5px"
                                    src={"/assets/creator/camera.svg"}
                                    alt={"camera"}
                                ></Image>
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
                                    if (newPostcard.coverImage?.id) {
                                        await strapi.delete(
                                            "upload/files",
                                            newPostcard.coverImage.id
                                        );
                                    }
                                    uploadfile(
                                        croppedFile,
                                        newPostcard.id,
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
                        validationSchema={
                            story?.on_boarding?.state ==
                                "postcard-titles-upload" ||
                                story?.on_boarding?.state ==
                                "postcard-titles-review"
                                ? Phase1DraftValidation
                                : DraftValidation
                        }
                        initialValues={{
                            intro: newPostcard.intro,
                            story: newPostcard.story,
                            // category: newPostcard.category?.id
                            //     ? newPostcard.category.id.toString()
                            //     : newPostcard.category
                            //     ? newPostcard.category.toString()
                            //     : "1",
                            tags: [
                                newPostcard.tags && newPostcard.tags[0]
                                    ? newPostcard.tags[0]
                                    : "",
                                newPostcard.tags && newPostcard.tags[1]
                                    ? newPostcard.tags[1]
                                    : "",
                                newPostcard.tags && newPostcard.tags[2]
                                    ? newPostcard.tags[2]
                                    : ""
                            ],
                            name: newPostcard.name,
                            country: story?.country
                                ? story.country.name
                                : newPostcard?.country?.name || "",
                            // city: selectedLocation.city,
                            // externallink: newPostcard.articleURL,
                            copyright: newPostcard.copyright
                            // location: selectedLocation.name,
                        }}
                        onSubmit={async (values, actions) => {
                            if (!values) return;
                            // let sl = selectedLocation;
                            // if (values.country) sl.country = values.country;
                            // if (values.city) sl.city = values.city;
                            // setSelectedLocation(sl);
                            let newTagList = [];
                            if (values.tags && values.tags.length > 0) {
                                let namelist = [];
                                values.tags.map((ele) => {
                                    let name = encodeURIComponent(
                                        ele.name
                                    ).toLowerCase();

                                    namelist.push(name);
                                });
                                if (namelist.length > 0) {
                                    newTagList = await getorCreateTagsByName(
                                        namelist
                                    );
                                    setSelectedTagsList(newTagList);
                                } else {
                                    let np = newPostcard;
                                    np.tags = [];
                                    setNewPostcard(np);
                                    setSelectedTagsList([]);
                                }
                            }

                            let updatePostcard = {
                                intro: values.intro,
                                story: values.story,
                                // poi: newPostcard.poi,
                                name: values.name,

                                country: story?.country?.id,
                                // articleURL: values.externallink,
                                // visibility: newPostcard.visibility,
                                // coverImage: newPostcard.imageUrl || "",
                                copyright: values.copyright,
                                //user: profile.id,
                                tags: newTagList,
                                isComplete:
                                    !values.name ||
                                        !values.intro ||
                                        !values.country ||
                                        !values.story
                                        ? false
                                        : true
                                // category: values.category,
                                // rcity: rcity,
                                // country: values.country.id
                                // updated_at: now,
                                // published_at: postcard.published_at
                            };
                            if (countryList?.length) {
                                updatePostcard["country"] = countryList.find(
                                    (cnt) => cnt.name == values.country
                                )?.id;
                            }

                            if (isSaveNow) {
                                await updatePostCard(
                                    postcard.id,
                                    postcard.slug
                                        ? updatePostcard
                                        : {
                                            ...updatePostcard,
                                            slug: slugify(
                                                postcard.name
                                                    ? postcard.name
                                                    : values.name
                                            )
                                        }
                                ).then((response) => {
                                    if (response) {
                                        setNewPostcard(response);
                                        handleSave();
                                    }
                                });
                            } else {
                                if (isPublished) return;
                                updatePostcard.visibility = true;

                                // if (!newPostcard.published_at)
                                //     updatePostcard.published_at = new Date();
                                await updatePostCard(
                                    postcard.id,
                                    updatePostcard
                                ).then((response) => {
                                    if (response) {
                                        setNewPostcard(response);
                                        setPublish(true);
                                        handlePublish();
                                    }
                                });
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
                                        <Text
                                            mt="5%"
                                            mb="8px"
                                            variant="formLabel"
                                        >
                                            Add upto 3 keywords that best
                                            highlight this postcard experience
                                        </Text>
                                        <br />
                                        <FieldArray
                                            name="tags"
                                            render={(arrayHelpers) => (
                                                <VStack width="100%">
                                                    {props.values.tags &&
                                                        props.values.tags
                                                            .length > 0 &&
                                                        props.values.tags.map(
                                                            (tag, index) => (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        width: "100%"
                                                                    }}
                                                                >
                                                                    <Field
                                                                        name={`tags.${index}.name`}
                                                                    >
                                                                        {({
                                                                            field,
                                                                            form
                                                                        }) => (
                                                                            <Autocomplete
                                                                                menuStyle={{
                                                                                    zIndex: "9999",
                                                                                    borderWidth:
                                                                                        "1px",
                                                                                    marginTop:
                                                                                        "2px",
                                                                                    padding:
                                                                                        "3px",
                                                                                    width: "100%",
                                                                                    borderColor:
                                                                                        countryList &&
                                                                                            countryList.length >
                                                                                            0
                                                                                            ? "#f8b09d"
                                                                                            : "transparent",
                                                                                    borderRadius:
                                                                                        "8px"
                                                                                }}
                                                                                {...field}
                                                                                wrapperStyle={{
                                                                                    width: "100%"
                                                                                }}
                                                                                inputProps={{
                                                                                    id: `tags.${index}.name`,
                                                                                    style: {
                                                                                        borderWidth:
                                                                                            "1px",
                                                                                        height: "38px",
                                                                                        borderRadius:
                                                                                            "8px",
                                                                                        padding:
                                                                                            "8px",
                                                                                        //  marginBottom: "2%",
                                                                                        width: "100%"
                                                                                    },
                                                                                    onKeyUp:
                                                                                        (
                                                                                            e
                                                                                        ) => {
                                                                                            field.onChange(
                                                                                                e
                                                                                            );
                                                                                        }
                                                                                }}
                                                                                getItemValue={(
                                                                                    item
                                                                                ) =>
                                                                                    item.name
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase() +
                                                                                    item.name.slice(
                                                                                        1
                                                                                    )
                                                                                }
                                                                                items={
                                                                                    tagList
                                                                                }
                                                                                renderItem={(
                                                                                    item,
                                                                                    isHighlighted
                                                                                ) => (
                                                                                    <div
                                                                                        style={{
                                                                                            borderWidth:
                                                                                                "0px",
                                                                                            background:
                                                                                                isHighlighted
                                                                                                    ? "#f8b09d"
                                                                                                    : "white",
                                                                                            zIndex: "9999",
                                                                                            padding:
                                                                                                "2px"
                                                                                        }}
                                                                                    >
                                                                                        {item.name
                                                                                            .charAt(
                                                                                                0
                                                                                            )
                                                                                            .toUpperCase() +
                                                                                            item.name.slice(
                                                                                                1
                                                                                            )}
                                                                                    </div>
                                                                                )}
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    field.onChange(
                                                                                        e
                                                                                    );
                                                                                    if (
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                        onTagChange(
                                                                                            e.target.value.toLowerCase(),
                                                                                            true
                                                                                        );
                                                                                }}
                                                                                onSelect={(
                                                                                    val,
                                                                                    item
                                                                                ) => {
                                                                                    form.setFieldValue(
                                                                                        `tags.${index}.name`,
                                                                                        val
                                                                                            .charAt(
                                                                                                0
                                                                                            )
                                                                                            .toUpperCase() +
                                                                                        val.slice(
                                                                                            1
                                                                                        )
                                                                                    );
                                                                                    form.setFieldValue(
                                                                                        `tags.${index}.id`,
                                                                                        item.id
                                                                                    );
                                                                                    setTagList(
                                                                                        []
                                                                                    );
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </div>
                                                            )
                                                        )}
                                                </VStack>
                                            )}
                                        />
                                    </Box>

                                    <Box mt="2%">
                                        <Field name="name" key="name">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.name ||
                                                        form.touched.name
                                                    }
                                                >
                                                    <Flex
                                                        mt="5%"
                                                        mb="8px"
                                                        w="100%"
                                                    >
                                                        <Text variant="formLabel">
                                                            Title of the story
                                                            &nbsp;
                                                            <Text variant="formReq">
                                                                (required)
                                                            </Text>
                                                        </Text>
                                                        <Spacer></Spacer>
                                                        <Text
                                                            variant={
                                                                field?.value
                                                                    ?.length >=
                                                                    60
                                                                    ? "textExceed"
                                                                    : "formReq"
                                                            }
                                                        >
                                                            {field.value
                                                                ? field.value
                                                                    .length
                                                                : "0"}
                                                            &nbsp;/ 60 chars
                                                        </Text>
                                                    </Flex>

                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        placeholder="Enter a title for the story"
                                                        borderColor={
                                                            form.errors.name &&
                                                                form.touched.name
                                                                ? "#EA6147!important"
                                                                : ""
                                                        }
                                                        boxShadow={
                                                            form.errors.name &&
                                                                form.touched.name
                                                                ? "0 0 0 1px #EA6147!important"
                                                                : ""
                                                        }
                                                        onChange={(evt) => {
                                                            field.onChange(evt);
                                                        }}
                                                        onBlur={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                story
                                                                    ?.on_boarding
                                                                    ?.state ===
                                                                "postcard-titles-upload"
                                                            ) {
                                                                setIsSaveNow(
                                                                    true
                                                                );
                                                                props.handleSubmit();
                                                            } else {
                                                                if (
                                                                    e.target.value.toString()
                                                                        .length >
                                                                    60
                                                                )
                                                                    return;
                                                                let updateData =
                                                                {
                                                                    name: e.target.value.toString()
                                                                };

                                                                updatePostCard(
                                                                    postcard.id,
                                                                    updateData
                                                                );
                                                            }
                                                        }}
                                                    />

                                                    <FormErrorMessage color="primary_1">
                                                        {form.errors.name}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </Box>

                                    {story?.on_boarding?.state !==
                                        "postcard-titles-upload" &&
                                        story?.on_boarding?.state !==
                                        "postcard-titles-review" && (
                                            <Box>
                                                <Text
                                                    mt="5%"
                                                    mb="8px"
                                                    variant="formLabel"
                                                >
                                                    Country &nbsp;
                                                    <Text variant="formReq">
                                                        (required)
                                                    </Text>
                                                </Text>
                                                <br />
                                                <Field name="country">
                                                    {({ field, form }) => (
                                                        <FormControl
                                                            isInvalid={
                                                                form.errors
                                                                    .country ||
                                                                form.touched
                                                                    .country
                                                            }
                                                        >
                                                            <Autocomplete
                                                                {...field}
                                                                menuStyle={{
                                                                    zIndex: "9999",
                                                                    borderWidth:
                                                                        "1px",
                                                                    marginTop:
                                                                        "2px",
                                                                    padding:
                                                                        "3px",
                                                                    width: "100%",
                                                                    borderColor:
                                                                        countryList &&
                                                                            countryList.length >
                                                                            0
                                                                            ? "#f8b09d"
                                                                            : "transparent",
                                                                    borderRadius:
                                                                        "8px"
                                                                }}
                                                                wrapperStyle={{
                                                                    width: "100%"
                                                                }}
                                                                inputProps={{
                                                                    id: "country",
                                                                    style: {
                                                                        borderWidth:
                                                                            "1px",

                                                                        height: "38px",
                                                                        borderRadius:
                                                                            "8px",
                                                                        padding:
                                                                            "8px",
                                                                        width: "100%",
                                                                        borderColor:
                                                                            form
                                                                                .errors
                                                                                .country &&
                                                                                form
                                                                                    .touched
                                                                                    .country
                                                                                ? "#EA6147"
                                                                                : "",
                                                                        borderShadow:
                                                                            form
                                                                                .errors
                                                                                .country &&
                                                                                form
                                                                                    .touched
                                                                                    .country
                                                                                ? "0 0 0 1px #EA6147"
                                                                                : ""
                                                                    },
                                                                    placeholder:
                                                                        "Enter Country"
                                                                }}
                                                                getItemValue={(
                                                                    item
                                                                ) => item.name}
                                                                items={
                                                                    countryList
                                                                }
                                                                renderItem={(
                                                                    item,
                                                                    isHighlighted
                                                                ) => (
                                                                    <div
                                                                        style={{
                                                                            borderWidth:
                                                                                "0px",
                                                                            background:
                                                                                isHighlighted
                                                                                    ? "#f8b09d"
                                                                                    : "white",
                                                                            zIndex: "9999",
                                                                            padding:
                                                                                "2px"
                                                                        }}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </div>
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    field.onChange(
                                                                        e
                                                                    );

                                                                    if (
                                                                        e.target
                                                                            .value
                                                                    )
                                                                        onCountryChange(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                }}
                                                                onSelect={(
                                                                    val,
                                                                    item
                                                                ) => {
                                                                    props.setFieldValue(
                                                                        "country",
                                                                        val
                                                                    );
                                                                    if (
                                                                        countryList?.length
                                                                    ) {
                                                                        let updateData =
                                                                        {
                                                                            country:
                                                                                countryList.find(
                                                                                    (
                                                                                        cnt
                                                                                    ) =>
                                                                                        cnt.name ===
                                                                                        val.toString()
                                                                                )
                                                                                    ?.id
                                                                        };
                                                                        updatePostCard(
                                                                            postcard.id,
                                                                            updateData
                                                                        );
                                                                    }
                                                                    // props.setFieldValue(
                                                                    //     "city",
                                                                    //     ""
                                                                    // );
                                                                    // setCityList([]);
                                                                }}
                                                            />
                                                            <FormErrorMessage color="primary_1">
                                                                {
                                                                    form.errors
                                                                        .country
                                                                }
                                                            </FormErrorMessage>
                                                        </FormControl>
                                                    )}
                                                </Field>
                                            </Box>
                                        )}

                                    {story?.on_boarding?.state !==
                                        "postcard-titles-upload" &&
                                        story?.on_boarding?.state !==
                                        "postcard-titles-review" && (
                                            <>
                                                <Box>
                                                    <Field name="intro">
                                                        {({ field, form }) => (
                                                            <FormControl
                                                                isInvalid={
                                                                    form.errors
                                                                        .intro ||
                                                                    form.touched
                                                                        .intro
                                                                }
                                                            >
                                                                <Flex
                                                                    mt="5%"
                                                                    mb="8px"
                                                                    justifyContent="space-between"
                                                                >
                                                                    <Text variant="formLabel">
                                                                        Introduction
                                                                        &nbsp;
                                                                        <Text variant="formReq">
                                                                            (required)
                                                                        </Text>
                                                                    </Text>
                                                                    <Text variant="formReq">
                                                                        {field.value
                                                                            ? field.value.match(
                                                                                /\S+/g
                                                                            )
                                                                                ?.length
                                                                            : "0"}{" "}
                                                                        / 60
                                                                        words
                                                                    </Text>
                                                                </Flex>

                                                                <Textarea
                                                                    {...field}
                                                                    borderColor={
                                                                        form
                                                                            .errors
                                                                            .name &&
                                                                            form
                                                                                .touched
                                                                                .name
                                                                            ? "#EA6147!important"
                                                                            : ""
                                                                    }
                                                                    boxShadow={
                                                                        form
                                                                            .errors
                                                                            .name &&
                                                                            form
                                                                                .touched
                                                                                .name
                                                                            ? "0 0 0 1px #EA6147!important"
                                                                            : ""
                                                                    }
                                                                    rows="6"
                                                                    placeholder="Add a compelling highlight in 60 words or less that serves as a hook for this postcard and inspires the reader to flip the Postcard. (This is visible on the front-side of the postcard)"
                                                                    // onChange={(e) => {
                                                                    //     field.onChange(e);
                                                                    //     // form.setFieldValue(
                                                                    //     //     e.target.value
                                                                    //     // );
                                                                    // }}
                                                                    onBlur={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        if (
                                                                            !checkWordCount(
                                                                                e.target.value.toString(),
                                                                                60
                                                                            )
                                                                        )
                                                                            return;
                                                                        let updateData =
                                                                        {
                                                                            intro: e.target.value.toString()
                                                                        };
                                                                        updatePostCard(
                                                                            postcard.id,
                                                                            updateData
                                                                        );
                                                                    }}
                                                                />
                                                                <FormErrorMessage color="primary_1">
                                                                    {
                                                                        form
                                                                            .errors
                                                                            .intro
                                                                    }
                                                                </FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </Box>
                                                <Box>
                                                    <Field name="story">
                                                        {({ field, form }) => (
                                                            <FormControl
                                                                isInvalid={
                                                                    form.errors
                                                                        .story ||
                                                                    form.touched
                                                                        .story
                                                                }
                                                            >
                                                                <Flex
                                                                    mt="5%"
                                                                    mb="8px"
                                                                    justifyContent="space-between"
                                                                >
                                                                    <Text variant="formLabel">
                                                                        Story
                                                                        &nbsp;
                                                                        <Text variant="formReq">
                                                                            (required)
                                                                        </Text>
                                                                    </Text>
                                                                    <Text variant="formReq">
                                                                        {field.value
                                                                            ? field.value.match(
                                                                                /\S+/g
                                                                            )
                                                                                ?.length
                                                                            : "0"}{" "}
                                                                        / 300
                                                                        words
                                                                    </Text>
                                                                </Flex>

                                                                <Textarea
                                                                    {...field}
                                                                    rows="10"
                                                                    borderColor={
                                                                        form
                                                                            .errors
                                                                            .story &&
                                                                            form
                                                                                .touched
                                                                                .story
                                                                            ? "#EA6147!important"
                                                                            : ""
                                                                    }
                                                                    boxShadow={
                                                                        form
                                                                            .errors
                                                                            .story &&
                                                                            form
                                                                                .touched
                                                                                .story
                                                                            ? "0 0 0 1px #EA6147!important"
                                                                            : ""
                                                                    }
                                                                    // onChange={(e) => {
                                                                    //     field.onChange(e);
                                                                    //     // //console.log(e);
                                                                    //     // form.setFieldValue(
                                                                    //     //     e.target.value
                                                                    //     // );
                                                                    // }}
                                                                    placeholder="Add a story within 300 words that is inspiring and impactful and focuses on telling the story of the land that is the highlight of this postcard. (This is visible on the reverse side of the postcard)"
                                                                    onBlur={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        if (
                                                                            !checkWordCount(
                                                                                e.target.value.toString(),
                                                                                300
                                                                            )
                                                                        )
                                                                            return;
                                                                        let updateData =
                                                                        {
                                                                            story: e.target.value.toString()
                                                                        };
                                                                        updatePostCard(
                                                                            postcard.id,
                                                                            updateData
                                                                        );
                                                                    }}
                                                                />
                                                                <FormErrorMessage color="primary_1">
                                                                    {
                                                                        form
                                                                            .errors
                                                                            .story
                                                                    }
                                                                </FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </Box>
                                                {/* <Box
                                                    mt="3%"
                                                    float="left"
                                                    width="100%"
                                                >
                                                    <Divider mt="2%" />

                                                    <Text
                                                        mt="5%"
                                                        mb="8px"
                                                        variant="formLabel"
                                                    >
                                                        Select a theme for this
                                                        Postcard story
                                                    </Text>
                                                    <Text
                                                        fontSize="20px"
                                                        variant="formReq"
                                                    >
                                                        (required)
                                                    </Text>

                                                    <br />
                                                    <RadioGroupField
                                                        options={album_themes}
                                                        type={"object"}
                                                    />
                                                </Box> */}
                                            </>
                                        )}

                                    {/* <Box float="left" width="100%">
                                        <Divider mt="3%" />
                                        <Text
                                            mt="5%"
                                            mb="8px"
                                            variant="formLabel"
                                        >
                                            Add a link
                                        </Text>
                                        <Field name="externallink">
                                            {({ field, form }) => (
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={
                                                            <LinkIcon color="gray.300" />
                                                        }
                                                    />
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        id="externallink"
                                                        placeholder="Add a link"
                                                    />
                                                </InputGroup>
                                            )}
                                        </Field>
                                    </Box> */}
                                    {story?.on_boarding?.state !=
                                        "postcard-titles-upload" &&
                                        story?.on_boarding?.state !=
                                        "postcard-titles-review" && (
                                            <Box float="left" width="100%">
                                                <Divider mt="3%" />
                                                <Text
                                                    mt="5%"
                                                    mb="8px"
                                                    variant="formLabel"
                                                >
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
                                                                onBlur={(e) => {
                                                                    e.stopPropagation();

                                                                    let updateData =
                                                                    {
                                                                        copyright:
                                                                            e.target.value.toString()
                                                                    };
                                                                    updatePostCard(
                                                                        postcard.id,
                                                                        updateData
                                                                    );
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    )}
                                                </Field>
                                            </Box>
                                        )}
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
                                        {story?.on_boarding?.state ===
                                            "approved" && (
                                                <Button
                                                    isLoading={props.isSubmitting}
                                                    onClick={() => {
                                                        setIsSaveNow(false);
                                                        props.handleSubmit();
                                                    }}
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                        {story?.on_boarding?.state !==
                                            "approved" && (
                                                <>
                                                    <Button
                                                        isLoading={
                                                            props.isSubmitting
                                                        }
                                                        onClick={() => {
                                                            setIsSaveNow(true);

                                                            props
                                                                .validateForm()
                                                                .then(
                                                                    (response) => {
                                                                        if (
                                                                            !_.isEmpty(
                                                                                response
                                                                            )
                                                                        )
                                                                            if (
                                                                                !_.isEmpty(
                                                                                    response
                                                                                )
                                                                            ) {
                                                                                setIsSaveNow(
                                                                                    true
                                                                                );
                                                                                // handleSave();
                                                                            }
                                                                    }
                                                                );

                                                            props.handleSubmit();
                                                        }}
                                                        variant="outline"
                                                    >
                                                        Save &amp; Close
                                                    </Button>
                                                    {story?.on_boarding?.state ===
                                                        "postcard-titles-upload" && (
                                                            <Button
                                                                isLoading={
                                                                    props.isSubmitting
                                                                }
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    showAlert({
                                                                        message:
                                                                            " Are you sure to delete the postcard?",
                                                                        mode: true
                                                                    });
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    {/* {story?.on_boarding?.state !=
                                                    "postcard-titles-upload" &&
                                                    story?.on_boarding?.state !=
                                                        "postcard-titles-review" && (
                                                        <Button
                                                            isLoading={
                                                                props.isSubmitting
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                showAlert({
                                                                    message:
                                                                        " Are you sure to delete the postcard?",
                                                                    mode: true
                                                                });
                                                            }}
                                                            variant="outline"
                                                        >
                                                            Delete
                                                        </Button>
                                                    )} */}
                                                </>
                                            )}
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
                        handleAction={() => {
                            deletePostcard(postcard.id).then((response) => {
                                handleDelete();
                                showAlert({ mode: false });
                            });

                            //  window.location.reload();
                        }}
                        buttonText="DELETE"
                    />
                    <PostcardAlert
                        isCentered={true}
                        closeOnEsc={true}
                        // isSuccess={true}
                        buttonText="OK"
                        closeOnOverlayClick={true}
                        show={inCompleteAlert}
                        handleAction={() =>
                            showIncompleteAlert({ mode: false })
                        }
                    />
                </Box>
            )}
        </>
    );
};

export default DraftsCard;
