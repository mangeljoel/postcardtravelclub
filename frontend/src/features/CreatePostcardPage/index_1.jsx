import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    Divider,
    Textarea,
    VStack,
    Link
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import React, { useContext, useEffect, useState, useRef } from "react";
import AddImage from "./Properties/AddImage";
import LoadingGif from "../../patterns/LoadingGif";
import MainSection from "./Patterns/MainSection";
import {
    fetchPaginatedResults,
    getCountries,
    updateDBValue
} from "../../queries/strapiQueries";
import AppContext from "../AppContext";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { getUrlOfUploadImage } from "../../services/utilities";
import AlbumDetailsSection from "./Patterns/AlbumDetailsSection";
import {
    apiNames,
    populateNewsArticles
} from "../../services/fetchApIDataSchema";
import IndexSection from "./Patterns/IndexSection";
import ActionItems from "./Patterns/ActionItems";
import BlogPage from "../BlogPage";
import * as Yup from "yup";

const CreatePostcardPage = ({ blogPost, showActionButton }) => {
    const { profile } = useContext(AppContext);
    const [newsArticle, setNewsArticle] = useState(null);
    const [pageSections, setPageSections] = useState([]);
    const formikRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false);
    const [pageSubSections, setPageSubSections] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countryList, setCountryList] = useState([]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isFooterInView, setIsFooterInView] = useState(false);
    const [actionItemHandler, setActionItemHandler] = useState({
        showCommentBox: false,
        statusToUpdate: "draft",
        btnText: ""
    });
    const [shouldShowCommentBox, setShouldShowCommentBox] = useState(false);
    // useEffect(() => console.log("newsArticle", newsArticle), [newsArticle]);
    const [coverImage, setCoverImage] = useState("");
    useEffect(() => {
        setLoading(true);
        if (blogPost) refetchNewsArticle(blogPost?.id);
        else setNewsArticle(null);
    }, [blogPost]);
    useEffect(() => {
        setInitialPage();
    }, [newsArticle]);
    const setInitialPage = async () => {
        try {
            const sections = await fetchPaginatedResults(
                "album-sections",
                {},
                {},
                "order:ASC"
            );
            setPageSections(sections);

            let countries = await getCountries();
            setCountryList(countries);
            // setIsEdit(editMode);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const updateArticle = async (values) => {
        setSubmitting(true);
        if (values) {
            let articleData = {
                title: values.title ?? "",
                description: values.subTitle ?? "",
                image: values.coverImageId ?? null,
                block: values.block ?? []
            };
            let albumData = {
                name: values.name ?? "",
                country: values.country?.id ?? null,
                pricesStartingAt: values.startingprice ?? null,
                lat: values.lat ?? null,
                long: values.long ?? null,
                website: values.website ?? "",
                numberOfNights: values?.rooms?.toString() ?? null
            };
            await updateDBValue(apiNames.newsArticles, newsArticle.id, {
                ...articleData
            });
            await updateDBValue(
                apiNames.album,
                newsArticle?.album?.id,
                albumData
            );
            setSubmitting(false);
            refetchNewsArticle(newsArticle.id);
            if (shouldShowCommentBox)
                setActionItemHandler((prevValue) => {
                    return { ...prevValue, showCommentBox: true };
                });
        }
    };
    const refetchNewsArticle = async (id) => {
        await fetchPaginatedResults(
            apiNames.newsArticles,
            { id: id ? id : newsArticle?.id },
            populateNewsArticles
        ).then((res) => {
            if (res) setNewsArticle(res);
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update the state only when the footer's intersection status changes
                setIsFooterInView(entry.isIntersecting);
            },
            {
                // Adjust the rootMargin if needed to trigger the event earlier or later
                rootMargin: "0px"
            }
        );

        const footerElement = document.getElementById("AppFooter");
        if (footerElement) {
            observer.observe(footerElement);
        }

        // Clean up the observer on component unmount
        return () => {
            if (footerElement) {
                observer.unobserve(footerElement);
            }
        };
    }, []);

    const PostcardSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        subTitle: Yup.string().required("Subtitle is required"),
        // coverImageUrl: Yup.string().required("Cover image URL is required"),
        coverImageId: Yup.number()
            .nullable()
            .required("Cover image is required")
    });

    return loading ? (
        <LoadingGif />
    ) : (
        <Formik
            initialValues={{
                title: newsArticle?.title ?? "", //*
                subTitle: newsArticle?.description ?? "", //*
                coverImageUrl: newsArticle?.image?.url ?? "", //*
                coverImageId: newsArticle?.image?.id ?? null,
                name: newsArticle?.album?.name ?? "",
                country: newsArticle?.album?.country ?? null,
                rooms: newsArticle?.album?.numberOfNights ?? null,
                website: newsArticle?.album?.website ?? "",
                lat: newsArticle?.album?.lat ?? null,
                long: newsArticle?.album?.long ?? null,
                startingprice: newsArticle?.album?.pricesStartingAt ?? null,
                block: newsArticle?.block ?? []
            }}
            validationSchema={PostcardSchema}
            validateOnMount={true}
            onSubmit={(values) => {
                // console.log(JSON.stringify(values, null, 2), pageSubSections);
                updateArticle(values);
            }}
        >
            {(formikProps) => (
                <>
                    <Flex
                        id="WanderlustPage"
                        w="100%"
                        mt="3em"
                        gap="10px"
                        pos={"relative"}
                        justifyContent="left"
                        zIndex={2}
                    >
                        <IndexSection
                            newsArticle={newsArticle}
                            pageSections={pageSections}
                        />
                        {isEdit ? (
                            <Box w={["100%", "80%"]} mx="auto">
                                <Box mr="20%">
                                    <Box>
                                        <Field
                                            as={Textarea}
                                            id="title"
                                            px={0}
                                            name="title"
                                            height="fitContent"
                                            type="textarea"
                                            fontSize="50px"
                                            color="#5A5A5A"
                                            fontWeight={700}
                                            placeholder="Enter Title..."
                                            border="none"
                                            _focusVisible={{
                                                borderColor: "transparent"
                                            }}
                                            onBlur={(e) => {
                                                if (
                                                    e &&
                                                    e.target.value &&
                                                    newsArticle?.id
                                                )
                                                    updateDBValue(
                                                        apiNames.newsArticles,
                                                        newsArticle?.id,
                                                        {
                                                            title: e.target
                                                                .value
                                                        }
                                                    );
                                            }}
                                            //variant="filled"
                                        />
                                        {formikProps.errors.title && (
                                            <Text color="red">
                                                *{formikProps.errors.title}
                                            </Text>
                                        )}
                                    </Box>
                                    <Box my={"1em"}>
                                        <Field
                                            as={Textarea}
                                            // my="1em"
                                            px={0}
                                            id="subTitle"
                                            name="subTitle"
                                            height="fitContent"
                                            type="text"
                                            fontSize="32px"
                                            color="#5A5A5A"
                                            fontWeight={600}
                                            placeholder="Enter Subtitle..."
                                            border="none"
                                            _focusVisible={{
                                                borderColor: "transparent"
                                            }}
                                            onBlur={(e) => {
                                                if (
                                                    e &&
                                                    e.target.value &&
                                                    newsArticle?.id
                                                )
                                                    updateDBValue(
                                                        apiNames.newsArticles,
                                                        newsArticle?.id,
                                                        {
                                                            description:
                                                                e.target.value
                                                        }
                                                    );
                                            }}
                                            //variant="filled"
                                        />
                                        {formikProps.errors.subTitle && (
                                            <Text color="red">
                                                *{formikProps.errors.subTitle}
                                            </Text>
                                        )}
                                    </Box>
                                    <Divider
                                        mb="1em"
                                        borderBottomWidth="1.5px"
                                        borderColor="#5A5A5A"
                                    />
                                    <>
                                        {formikProps.values.coverImageUrl ? (
                                            <Box my="1em" pos="relative">
                                                <Text
                                                    pos="absolute"
                                                    mx="auto"
                                                    textAlign={"center"}
                                                    zIndex={999}
                                                    top="8px"
                                                    right="8px"
                                                    color="primary_1"
                                                    fontWeight={700}
                                                    fontSize={"md"}
                                                    bg="white"
                                                    px="5px"
                                                    cursor="pointer"
                                                    borderColor={"primary_1"}
                                                    borderWidth={"2px"}
                                                    borderRadius={"20px"}
                                                    onClick={() => {
                                                        document
                                                            .getElementById(
                                                                "coverImageInput"
                                                            )
                                                            .click();
                                                    }}
                                                >
                                                    Change
                                                </Text>

                                                <ChakraNextImage
                                                    mt="1em"
                                                    src={
                                                        formikProps.values
                                                            .coverImageUrl ?? ""
                                                    }
                                                    w="100%"
                                                    display={
                                                        formikProps.values
                                                            .coverImageUrl
                                                            ? "block"
                                                            : "none"
                                                    }
                                                    ratio={4 / 3}
                                                    objectFit="cover"
                                                    boxShadow="3px 3px 6px rgba(0, 0, 0, 0.16)"
                                                    alt={
                                                        formikProps.values
                                                            .coverImageUrl ?? ""
                                                    }
                                                    borderRadius={"md"}
                                                    overflow="hidden"
                                                />
                                            </Box>
                                        ) : (
                                            <AddImage
                                                mt="1em"
                                                mb="2em"
                                                onClick={() => {
                                                    document
                                                        .getElementById(
                                                            "coverImageInput"
                                                        )
                                                        .click();
                                                }}
                                                text={
                                                    formikProps.values
                                                        .coverImageUrl
                                                        ? "Change Cover Image"
                                                        : "Add Cover Image"
                                                }
                                                // htmlFor="coverImage"
                                            />
                                        )}
                                        {formikProps.errors.coverImageUrl && (
                                            <Text color="red">
                                                *
                                                {
                                                    formikProps.errors
                                                        .coverImageUrl
                                                }
                                            </Text>
                                        )}
                                    </>

                                    <Field
                                        as={Input}
                                        type={"file"}
                                        display="none"
                                        id="coverImageInput"
                                        name="coverImageInput"
                                        onChange={async (event) => {
                                            await getUrlOfUploadImage(
                                                event.target.files[0],
                                                async (result) => {
                                                    if (result && result.url)
                                                        await formikProps.setFieldValue(
                                                            "coverImageUrl",
                                                            result.url,
                                                            true
                                                        );
                                                    formikProps.setFieldValue(
                                                        "coverImageId",
                                                        result.id
                                                    );

                                                    setTimeout(() =>
                                                        formikProps.setFieldTouched(
                                                            "coverImageUrl",
                                                            true
                                                        )
                                                    );
                                                    updateDBValue(
                                                        apiNames.newsArticles,
                                                        newsArticle?.id,
                                                        {
                                                            image: result.id
                                                        }
                                                    );
                                                }
                                            );
                                        }}
                                    />

                                    {newsArticle?.album && (
                                        <AlbumDetailsSection
                                            countryList={countryList}
                                            formikProps={formikProps}
                                            albumId={newsArticle?.album?.id}
                                            isDisabled={true}
                                        />
                                    )}
                                </Box>
                                <Divider
                                    my="3em"
                                    width="80%"
                                    borderBottomWidth="1.5px"
                                    borderColor="#5A5A5A"
                                />
                                {pageSections &&
                                    pageSections.map((item, index) => {
                                        return (
                                            <MainSection
                                                key={"mainsection" + index}
                                                index={index}
                                                {...item}
                                                blogPost={newsArticle}
                                                refetchNewsArticle={
                                                    refetchNewsArticle
                                                }
                                                formikProps={formikProps}
                                            />
                                        );
                                    })}
                            </Box>
                        ) : (
                            <BlogPage
                                my="1em"
                                // pr="10%"
                                w={["100%", "100%"]}
                                blogPost={newsArticle}
                                pageSections={pageSections}
                            />
                        )}
                        {profile && showActionButton && (
                            <Flex
                                w="15%"
                                right={0}
                                bottom={0}
                                // marginY={"auto"}
                                pos={!isFooterInView ? "fixed" : "absolute"}
                                zIndex={2}
                                justifyContent={"center"}
                                alignItems={"center"}
                                display={["none", "flex"]}
                                // top={!isFooterInView ? "50%" : "auto"} // Adjust this value as needed
                                // transform={
                                //     !isFooterInView
                                //         ? "translateY(-50%)"
                                //         : "none"
                                // }
                            >
                                <ActionItems
                                    profile={profile}
                                    newsArticle={newsArticle}
                                    formikProps={formikProps}
                                    editMode={isEdit}
                                    isSubmitting={isSubmitting}
                                    setEditMode={(value) => setIsEdit(value)}
                                    isCreator={
                                        profile?.id === newsArticle?.creator?.id
                                    }
                                    status={newsArticle?.status}
                                    setIsFooterInView={setIsFooterInView}
                                    onApprovalSubmit={(status) => {
                                        updateArticle(
                                            formikProps.values,
                                            status
                                        );
                                    }}
                                    updateArticle={updateArticle}
                                    refetchNewsArticle={refetchNewsArticle}
                                    actionItemHandler={actionItemHandler}
                                    setActionItemHandler={setActionItemHandler}
                                    setShouldShowCommentBox={
                                        setShouldShowCommentBox
                                    }
                                />
                            </Flex>
                        )}
                    </Flex>
                </>
            )}
        </Formik>
    );
};
export default CreatePostcardPage;
