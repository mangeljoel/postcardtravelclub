import React from "react";
import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import {
    Text,
    Flex,
    Button,
    Select,
    Input,
    Box,
    Textarea
} from "@chakra-ui/react";
import {
    createStory,
    updateStory,
    getCountries,
    fetchPaginatedResults,
    createDBEntry,
    updateDBValue
} from "../../queries/strapiQueries";

import AppContext from "../AppContext";
import { apiNames } from "../../services/fetchApIDataSchema";
import PostcardAlert from "../PostcardAlert";
import * as yup from "yup";
import { AutoCompleteField } from "../../patterns/FormBuilder/AutoCompleteField";
import { getUrlOfUploadImage } from "../../services/utilities";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";

const CollectionForm = ({
    mode,
    collection,
    onClose,
    postcard,
    tour,
    isPage,
    fetchSingleAlbum
}) => {
    const router = useRouter();
    const { profile } = useContext(AppContext);
    const [selectedCountry, setCountry] = useState(
        mode === "create" ? "" : collection.country ? collection.country.id : ""
    );
    const [countryList, setCountryList] = useState([]);
    const [directories, setDirectories] = useState([]);

    const [showEditConfirmationBox, setShowEditConfirmationBox] =
        useState(false);

    const getCountryList = async () => {
        let countries = await getCountries();
        setCountryList(countries);
    };

    const getDirectories = async () => {
        const response = await fetchPaginatedResults(apiNames.directory);
        setDirectories(response);
    };

    useEffect(() => {
        getCountryList();
        getDirectories();
    }, []);

    useEffect(() => {
        if (!profile) {
            router.push("/");
        }
    }, [profile]);

    const CollectionFormValidation = yup.object().shape({
        title: yup.string().required(" * "),
        country: yup.string().required(" * "),
        region: yup.string().required(" * "),
        website: yup.string().url(" Enter valid url ").required(" * "),
        locationLink: yup.string().url(" Enter valid url ").nullable(),
        signature: yup.string().required(" * "),
        directories: yup.string().required(" * "),
        coverImageId: yup.string().required(" * ")
    });

    const formik = useFormik({
        initialValues: {
            title: mode === "create" ? "" : collection?.name,
            country: selectedCountry,
            region: mode === "create" ? "" : collection?.region,
            numberOfNights: mode === "create" ? "" : collection?.numberOfNights,
            pricesStartingAt:
                mode === "create" ? "" : collection?.pricesStartingAt,
            website: mode === "create" ? "" : collection?.website,
            locationLink: mode === "create" ? "" : collection?.locationLink,
            signature: mode === "create" ? "" : collection?.signature,
            directories:
                mode === "create"
                    ? "2"
                    : collection?.directories?.length > 0
                        ? collection?.directories[0]?.id
                        : "2",
            coverImageUrl:
                mode === "create"
                    ? ""
                    : collection?.coverImage?.url
                        ? collection.coverImage.url
                        : "",
            coverImageId:
                mode === "create"
                    ? ""
                    : collection?.coverImage?.id
                        ? collection.coverImage.id
                        : ""
        },
        validationSchema: CollectionFormValidation,
        onSubmit: (story) => {
            console.log(story)
            if (mode === "create") {
                if (story) {
                    let data = {
                        name: story.title,
                        user: Number(profile?.id),
                        country: Number(story.country),
                        region: story.region,
                        website: story.website,
                        pricesStartingAt: story.pricesStartingAt,
                        numberOfNights: story.numberOfNights,
                        locationLink: story.locationLink,
                        signature: story.signature,
                        directories: story.directories,
                        coverImage: story.coverImageId
                    };
                    createStory(data)
                        .then(async (res) => {
                            if (
                                res.data &&
                                res.data.slug == null &&
                                res.data.name
                            ) {
                                //create an empty news_article and link with the created album
                                await createDBEntry(apiNames.newsArticles, {
                                    published_at: null,
                                    status: "draft",
                                    album: res?.data?.id
                                });
                                let data = {
                                    visibility: true,
                                    slug: (
                                        res.data.name +
                                        Math.floor(Math.random() * 1000)
                                    )
                                        .toLowerCase()
                                        .trim()
                                        .replace(/[^\w\-]+/g, " ")
                                        .replace(/\s+/g, "-")
                                };
                                updateStory(res.data.id, data).then(
                                    async (response) => {
                                        fetchSingleAlbum(res.data.id, "create");
                                        if (onClose) onClose();
                                    }
                                );
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            } else {
                if (story && profile) {
                    let data = {
                        name: story.title,
                        story: story.tourstory,
                        country: Number(story.country),
                        region: story.region,
                        bestTimetoTravel: story.bestTimetoTravel,
                        pricesStartingAt: story.pricesStartingAt,
                        additionalInfo: story.additionalInfo,
                        sustainability: story.sustainability,
                        numberOfNights: story.numberOfNights,
                        website: story.website,
                        locationLink: story.locationLink,
                        signature: story.signature,
                        directories: story.directories,
                        coverImage: story.coverImageId
                    };

                    updateStory(collection?.id, data).then(async (response) => {
                        if (response) {
                            fetchSingleAlbum(collection?.id, "edit");
                            if (onClose) onClose();
                        }
                    });
                }
            }
        }
    });

    return (
        <Box
            width={isPage ? ["80%", "60%"] : "100%"}
            mx="auto"
            my={isPage ? "3%" : "0%"}
        >
            {
                <PostcardAlert
                    show={{
                        mode: showEditConfirmationBox,
                        message: `Are you sure you want to save the change?`
                    }}
                    handleAction={formik.handleSubmit}
                    closeAlert={() => setShowEditConfirmationBox(false)}
                    buttonText="UPDATE"
                />
            }
            <form onSubmit={formik.handleSubmit}>
                <Flex
                    mt={["6%", "2%"]}
                    flexDirection={"column"}
                >
                    <Input
                        type={"file"}
                        display="none"
                        id="coverImageInput"
                        name="coverImageInput"
                        onChange={async (event) => {
                            await getUrlOfUploadImage(
                                event.target.files[0],
                                async (result) => {
                                    if (result && result.url)
                                        await formik.setFieldValue(
                                            "coverImageUrl",
                                            result.url,
                                            true
                                        );
                                    await formik.setFieldValue(
                                        "coverImageId",
                                        result.id,
                                        true
                                    );
                                }
                            );
                        }}
                    />
                    <Flex justifyContent={"center"}>
                        <Button
                            width="30%"
                            maxWidth={"300px"}
                            variant={"outline"}
                            onClick={() => {
                                document
                                    .getElementById("coverImageInput")
                                    .click();
                            }}
                        >
                            {`${formik.values.coverImageId ? "Change" : "Add"
                                } Cover Image`}
                        </Button>
                        {formik.errors.coverImageId && (
                            <Text variant="formReq">
                                &nbsp;{formik.errors.coverImageId}
                            </Text>
                        )}
                    </Flex>
                    {formik.values.coverImageUrl && (
                        <ChakraNextImage
                            src={formik.values.coverImageUrl}
                            alt="coverImage"
                        />
                    )}
                </Flex>

                <Flex mt={["6%", "2%"]} direction="row" justify="space-between">
                    <Box w="48%">
                        <Text
                            variant="collectionHead"
                            fontSize="1rem"
                            alignItems={"center"}
                            htmlFor="title"
                        >
                            {"Property Name"}&nbsp;
                            {formik.errors.title && (
                                <Text variant="formReq">
                                    {formik.errors.title}
                                </Text>
                            )}
                        </Text>

                        <Input
                            id="title"
                            name="title"
                            mt="1%"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                            variant="collectionTextArea"
                            placeholder={"Property Name"}
                        />
                    </Box>
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            Country &nbsp;
                            {formik.errors.country && (
                                <Text variant="formReq">
                                    {" "}
                                    {formik.errors.country}
                                </Text>
                            )}
                        </Text>

                        <Select
                            value={formik.values.country}
                            id="country"
                            name="country"
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                            placeholder="Select Country"
                            bg="white"
                            mt="1%"
                            focusBorderColor="none"
                        >
                            {countryList.map((e) => {
                                return <option value={e.id}>{e.name}</option>;
                            })}
                        </Select>
                    </Box>
                </Flex>

                <Flex mt={["6%", "2%"]} direction="row" justify="space-between">
                    <Box w="48%">
                        <Text
                            variant="collectionHead"
                            fontSize="1rem"
                            alignItems={"center"}
                            htmlFor="region"
                        >
                            {"Region"}&nbsp;
                            {formik.errors.region && (
                                <Text variant="formReq">
                                    {formik.errors.region}
                                </Text>
                            )}
                        </Text>

                        <Input
                            id="region"
                            name="region"
                            mt="1%"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.region}
                            variant="collectionTextArea"
                            placeholder={"Region"}
                        />
                    </Box>
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            Website&nbsp;
                            {formik.errors.website && (
                                <Text variant="formReq">
                                    {" "}
                                    {formik.errors.website}
                                </Text>
                            )}
                        </Text>
                        <Input
                            id="website"
                            name="website"
                            type="text"
                            mt="1%"
                            onChange={formik.handleChange}
                            value={formik.values.website}
                            variant="collectionTextArea"
                            placeholder={"Website Link"}
                        />
                    </Box>
                </Flex>

                <Flex mt={["6%", "2%"]} direction="row" justify="space-between">
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            No of Rooms &nbsp;
                        </Text>
                        <Input
                            id="numberOfNights"
                            name="numberOfNights"
                            type="text"
                            mt="1%"
                            onChange={formik.handleChange}
                            value={formik.values.numberOfNights}
                            variant="collectionTextArea"
                            placeholder={"Number of Rooms"}
                        />
                    </Box>
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            Prices Starting From &nbsp;
                        </Text>
                        <Input
                            id="pricesStartingAt"
                            name="pricesStartingAt"
                            type="text"
                            mt="1%"
                            onChange={formik.handleChange}
                            value={formik.values.pricesStartingAt}
                            variant="collectionTextArea"
                            placeholder={"Prices Starting From"}
                        />
                    </Box>
                </Flex>

                <Flex mt={["6%", "2%"]} direction="row" justify="space-between">
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            Location Link &nbsp;
                            {formik.errors.locationLink && (
                                <Text variant="formReq">
                                    {" "}
                                    {formik.errors.locationLink}
                                </Text>
                            )}
                        </Text>
                        <Input
                            id="locationLink"
                            name="locationLink"
                            type="text"
                            mt="1%"
                            onChange={formik.handleChange}
                            value={formik.values.locationLink}
                            variant="collectionTextArea"
                            placeholder={"Google Maps or Location Link"}
                        />
                    </Box>
                    <Box w="48%">
                        <Text
                            variant="collectionHead"
                            fontSize="1rem"
                            alignItems={"center"}
                            htmlFor="signature"
                        >
                            {"Signature"}&nbsp;
                            {formik.errors.signature && (
                                <Text variant="formReq">
                                    {formik.errors.signature}
                                </Text>
                            )}
                        </Text>

                        <Input
                            id="signature"
                            name="signature"
                            mt="1%"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.signature}
                            variant="collectionTextArea"
                            placeholder={"Signature"}
                        />
                    </Box>
                </Flex>

                <Flex mt={["6%", "2%"]} direction="row" justify="space-between">
                    <Box w="48%">
                        <Text variant="collectionHead" fontSize="1rem">
                            Directory &nbsp;
                            {formik.errors.directories && (
                                <Text variant="formReq">
                                    {" "}
                                    {formik.errors.directories}
                                </Text>
                            )}
                        </Text>

                        <Select
                            value={formik.values.directories}
                            id="directories"
                            name="directories"
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                            placeholder="Select Directory"
                            bg="white"
                            mt="1%"
                            focusBorderColor="none"
                        >
                            {directories.map((e) => {
                                return <option value={e.id}>{e.name}</option>;
                            })}
                        </Select>
                    </Box>
                </Flex>

                <Box my="30px" width="100%" mx="auto" textAlign={"center"}>
                    <Button
                        mt="20px"
                        type="submit"
                        onClick={() => {
                            console.log(formik.values)
                            console.log(mode)
                            if (mode == "create") formik.handleSubmit();
                            else setShowEditConfirmationBox(true);
                        }}
                        isLoading={formik.isSubmitting}
                    >
                        {mode === "create" ? "Create" : "Update"}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};
export default CollectionForm;