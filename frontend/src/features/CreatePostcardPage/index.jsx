import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    Divider,
    Textarea,
    VStack,
    Link,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import React, { useContext, useEffect, useState, useRef } from "react";
import AddImage from "./Properties/AddImage";
import LoadingGif from "../../patterns/LoadingGif";
import MainSection from "./Patterns/MainSection";
import {
    fetchPaginatedResults,
    getCountries,
    updateDBValue,
} from "../../queries/strapiQueries";
import AppContext from "../AppContext";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { getUrlOfUploadImage } from "../../services/utilities";
import AlbumDetailsSection from "./Patterns/AlbumDetailsSection";
import { apiNames, populateNewsArticles } from "../../services/fetchApIDataSchema";
import IndexSection from "./Patterns/IndexSection";
import ActionItems from "./Patterns/ActionItems";
import BlogPage from "../BlogPage";
import * as Yup from "yup";
import { useCountries } from "../../hooks/useCountriesHook";

const CreatePostcardPage = ({ blogPost, album, showActionButton }) => {
    const { profile } = useContext(AppContext);

    // newsArticle will represent either an article OR an album-backed object.
    // If article exists it will be the article. If not, we store an object
    // that uses album data (so child components can remain mostly unchanged).
    const [newsArticle, setNewsArticle] = useState(null);
    const [pageSections, setPageSections] = useState([]);
    const formikRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false);
    const [pageSubSections, setPageSubSections] = useState(null);
    const [loading, setLoading] = useState(true);
    const countryList = useCountries();
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isFooterInView, setIsFooterInView] = useState(false);
    const [actionItemHandler, setActionItemHandler] = useState({
        showCommentBox: false,
        statusToUpdate: "draft",
        btnText: "",
    });
    const [shouldShowCommentBox, setShouldShowCommentBox] = useState(false);
    const [coverImage, setCoverImage] = useState("");

    // When parent passes blogPost (article) or album — normalize into newsArticle
    useEffect(() => {
        setLoading(true);

        // if article (blogPost) is available, prefer that and try to refetch article
        if (blogPost) {
            // If blogPost might be array or object elsewhere, ensure normalized at parent.
            refetchNewsArticle(blogPost?.id, "article").finally(() => setLoading(false));
            return;
        }

        // If no blogPost but album is provided, set newsArticle from album
        if (album) {
            // Create a "article-like" shape so CreatePostcardPage and children can use the same fields:
            const albumAsArticleLike = {
                // No newsArticle id means it's album-only mode
                id: null,
                title: album.name ?? "",
                description: album.description ?? "",
                image: album.coverImage ?? null, // if album has image field - keep it
                album: album, // keep full album
                block: [], // empty by default
                status: album.status ?? null,
                creator: album.creator ?? null,
                region: album.region ?? null,
                country: album.country ?? null
            };
            setNewsArticle(albumAsArticleLike);
            setLoading(false);
            return;
        }

        // neither present
        setNewsArticle(null);
        setLoading(false);
    }, [blogPost, album]);

    useEffect(() => {
        // load page sections once
        setInitialPage();
    }, []);

    const setInitialPage = async () => {
        try {
            const sections = await fetchPaginatedResults("album-sections", {}, {}, "order:ASC");
            setPageSections(sections || []);
        } catch (error) {
            // console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update handler: will update article if article id exists; otherwise update album record
    const updateArticle = async (values, status) => {
        setSubmitting(true);

        try {
            // Build common objects
            const articleData = {
                title: values.title ?? "",
                description: values.subTitle ?? "",
                image: values.coverImageId || null,
                block: values.block ?? [],
            };

            const albumData = {
                name: values.name ?? "",
                country: values.country?.id ?? null,
                pricesStartingAt: values.startingprice ?? null,
                lat: values.lat ?? null,
                long: values.long ?? null,
                website: values.website ?? "",
                numberOfNights: values?.rooms?.toString() ?? null,
            };

            // If newsArticle has an id and was originally an article, update the article and its album
            if (newsArticle?.id) {
                await updateDBValue(apiNames.newsArticles, newsArticle.id, {
                    ...articleData,
                    ...(status ? { status } : {}),
                });

                // If article has an album id, update album too
                if (newsArticle?.album?.id) {
                    await updateDBValue(apiNames.album, newsArticle.album.id, albumData);
                }
            } else if (newsArticle?.album?.id) {
                // album-only mode: update album record
                await updateDBValue(apiNames.album, newsArticle.album.id, albumData);

                // If you want to keep an article object in cms, create one here (optional)
            } else if (album?.id) {
                // fallback: update album from top-level album prop
                await updateDBValue(apiNames.album, album.id, albumData);
            }

            // refetch appropriate resource
            if (newsArticle?.id) {
                await refetchNewsArticle(newsArticle.id, "article");
            } else if (newsArticle?.album?.id) {
                await refetchNewsArticle(newsArticle.album.id, "album");
            } else if (album?.id) {
                await refetchNewsArticle(album.id, "album");
            }
        } catch (err) {
            // console.error("updateArticle error", err);
        } finally {
            setSubmitting(false);
            if (shouldShowCommentBox)
                setActionItemHandler((prev) => ({ ...prev, showCommentBox: true }));
        }
    };

    // refetch either article or album depending on type param
    const refetchNewsArticle = async (id, type = "article") => {
        try {
            // Use the type parameter to determine what to fetch
            if (type === "article") {
                // Fetch article by id
                const res = await fetchPaginatedResults(
                    apiNames.newsArticles,
                    { id },
                    populateNewsArticles
                );

                // fetchPaginatedResults might return array — normalize
                const normalized = Array.isArray(res) ? (res.length ? res[0] : null) : res ?? null;

                if (normalized) {
                    setNewsArticle(normalized);
                } else {
                    // if no article found, optionally try album as fallback
                    if (album?.id) {
                        const aRes = await fetchPaginatedResults(
                            apiNames.album,
                            { id: album.id },
                            {
                                coverImage: { fields: ["url"] },
                                country: true,
                                region: true,
                                postcards: {
                                    populate: {
                                        coverImage: { fields: ["url"] },
                                        tags: {
                                            fields: ["name"],
                                            populate: ["tag_group"],
                                        },
                                    },
                                },
                            }
                        );
                        const normalizedAlbum = Array.isArray(aRes) ? aRes[0] : aRes;
                        if (normalizedAlbum) {
                            setNewsArticle({
                                id: null,
                                title: normalizedAlbum.name ?? "",
                                description: normalizedAlbum.description ?? "",
                                image: normalizedAlbum.coverImage ?? null,
                                album: normalizedAlbum,
                                block: [],
                                status: normalizedAlbum.status ?? null,
                                creator: normalizedAlbum.creator ?? null,
                                region: normalizedAlbum.region ?? null,
                                country: normalizedAlbum.country ?? null
                            });
                        }
                    }
                }
            } else {
                // type === 'album' - fetch album by id
                const aRes = await fetchPaginatedResults(
                    apiNames.album,
                    { id },
                    {
                        coverImage: { fields: ["url"] },
                        country: true,
                        region: true,
                        postcards: {
                            populate: {
                                coverImage: { fields: ["url"] },
                                tags: {
                                    fields: ["name"],
                                    populate: ["tag_group"],
                                },
                            },
                        },
                    }
                );
                const normalizedAlbum = Array.isArray(aRes) ? aRes[0] : aRes ?? null;
                if (normalizedAlbum) {
                    setNewsArticle({
                        id: null,
                        title: normalizedAlbum.name ?? "",
                        description: normalizedAlbum.description ?? "",
                        image: normalizedAlbum.coverImage ?? null,
                        album: normalizedAlbum,
                        block: [],
                        status: normalizedAlbum.status ?? null,
                        creator: normalizedAlbum.creator ?? null,
                        region: normalizedAlbum.region ?? null,
                        country: normalizedAlbum.country ?? null
                    });
                }
                console.log(normalizedAlbum.coverImage)
            }
        } catch (err) {
            console.error("refetchNewsArticle error", err);
        }
    };

    // IntersectionObserver: add dependency array to avoid recreating observer each render
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsFooterInView(entry.isIntersecting),
            { rootMargin: "0px" }
        );

        const footerElement = document.getElementById("AppFooter");
        if (footerElement) observer.observe(footerElement);

        return () => {
            if (footerElement) observer.unobserve(footerElement);
        };
    }, []);

    const PostcardSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        subTitle: Yup.string().required("Subtitle is required"),
        coverImageId: Yup.number().nullable().required("Cover image is required"),
    });

    // While loading, show loader
    if (loading) return <LoadingGif />;

    // If nothing to show, friendly fallback
    if (!newsArticle) {
        return <LoadingGif />
    }

    return (
        <Formik
            initialValues={{
                title: newsArticle?.title ?? "",
                subTitle: newsArticle?.description ?? "",
                coverImageUrl: newsArticle?.image?.url || "",
                coverImageId: newsArticle?.image?.id || null,
                name: newsArticle?.album?.name ?? "",
                country: newsArticle?.album?.country ?? null,
                rooms: newsArticle?.album?.numberOfNights ?? null,
                website: newsArticle?.album?.website ?? "",
                lat: newsArticle?.album?.lat ?? null,
                long: newsArticle?.album?.long ?? null,
                startingprice: newsArticle?.album?.pricesStartingAt ?? null,
                block: newsArticle?.block ?? [],
            }}
            enableReinitialize={true}
            validationSchema={PostcardSchema}
            validateOnMount={true}
            onSubmit={(values) => {
                updateArticle(values);
            }}
        >
            {(formikProps) => (
                <>
                    <Flex
                        id="WanderlustPage"
                        w="100%"
                        gap="10px"
                        pos={"relative"}
                        justifyContent="left"
                        zIndex={2}
                    >
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
                                            _focusVisible={{ borderColor: "transparent" }}
                                            onBlur={(e) => {
                                                if (e?.target?.value && newsArticle?.id) {
                                                    updateDBValue(apiNames.newsArticles, newsArticle.id, {
                                                        title: e.target.value,
                                                    });
                                                } else if (e?.target?.value && newsArticle?.album?.id) {
                                                    // update album title (name) on blur if album-only mode
                                                    updateDBValue(apiNames.album, newsArticle.album.id, {
                                                        name: e.target.value,
                                                    });
                                                }
                                            }}
                                        />
                                        {formikProps.errors.title && <Text color="red">*{formikProps.errors.title}</Text>}
                                    </Box>

                                    <Box my={"1em"}>
                                        <Field
                                            as={Textarea}
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
                                            _focusVisible={{ borderColor: "transparent" }}
                                            onBlur={(e) => {
                                                if (e?.target?.value && newsArticle?.id) {
                                                    updateDBValue(apiNames.newsArticles, newsArticle.id, {
                                                        description: e.target.value,
                                                    });
                                                } else if (e?.target?.value && newsArticle?.album?.id) {
                                                    updateDBValue(apiNames.album, newsArticle.album.id, {
                                                        description: e.target.value,
                                                    });
                                                }
                                            }}
                                        />
                                        {formikProps.errors.subTitle && <Text color="red">*{formikProps.errors.subTitle}</Text>}
                                    </Box>

                                    <Divider mb="1em" borderBottomWidth="1.5px" borderColor="#5A5A5A" />

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
                                                        document.getElementById("coverImageInput").click();
                                                    }}
                                                >
                                                    Change
                                                </Text>

                                                <ChakraNextImage
                                                    mt="1em"
                                                    src={formikProps.values.coverImageUrl || ""}
                                                    w="100%"
                                                    display={formikProps.values.coverImageUrl ? "block" : "none"}
                                                    ratio={4 / 3}
                                                    objectFit="cover"
                                                    boxShadow="3px 3px 6px rgba(0, 0, 0, 0.16)"
                                                    alt={formikProps.values.coverImageUrl ?? ""}
                                                    borderRadius={"md"}
                                                    overflow="hidden"
                                                />
                                            </Box>
                                        ) : (
                                            <AddImage
                                                mt="1em"
                                                mb="2em"
                                                onClick={() => document.getElementById("coverImageInput").click()}
                                                text={formikProps.values.coverImageUrl ? "Change Cover Image" : "Add Cover Image"}
                                            />
                                        )}
                                        {formikProps.errors.coverImageId && <Text color="red">*{formikProps.errors.coverImageId}</Text>}
                                    </>

                                    <Input
                                        type={"file"}
                                        display="none"
                                        id="coverImageInput"
                                        name="coverImageInput"
                                        onChange={async (event) => {
                                            await getUrlOfUploadImage(event.target.files[0], (result) => {
                                                if (result && result.url) {
                                                    formikProps.setFieldValue("coverImageUrl", result.url, true);
                                                    formikProps.setFieldValue("coverImageId", result.id, true);
                                                }
                                            });
                                        }}
                                    />

                                    {/* Album details — pass albumId from newsArticle.album (works for album-only and article modes) */}
                                    {newsArticle?.album && (
                                        <AlbumDetailsSection
                                            countryList={countryList}
                                            formikProps={formikProps}
                                            albumId={newsArticle.album.id}
                                            isDisabled={true}
                                        />
                                    )}
                                </Box>

                                <Divider my="3em" width="80%" borderBottomWidth="1.5px" borderColor="#5A5A5A" />

                                {pageSections &&
                                    pageSections.map((item, index) => {
                                        if (item.id === 7) return null;
                                        return (
                                            <MainSection
                                                key={"mainsection" + index}
                                                index={index}
                                                {...item}
                                                blogPost={newsArticle}
                                                refetchNewsArticle={refetchNewsArticle}
                                                formikProps={formikProps}
                                            />
                                        );
                                    })}
                            </Box>
                        ) : (
                            <BlogPage
                                my="1em"
                                w={["100%", "100%"]}
                                blogPost={newsArticle}
                                pageSections={pageSections}
                                refetchNewsArticle={refetchNewsArticle}
                                setActiveTab={setActiveTab}
                                showActionButton={showActionButton}
                                isAlbumOnly={!newsArticle?.id && !!newsArticle?.album}
                            />

                        )}

                        {profile && showActionButton && activeTab === 1 && (
                            <Flex
                                w="15%"
                                right={0}
                                bottom={0}
                                pos={!isFooterInView ? "fixed" : "absolute"}
                                zIndex={102}
                                justifyContent={"center"}
                                alignItems={"center"}
                                display={["none", "flex"]}
                            >
                                <ActionItems
                                    profile={profile}
                                    newsArticle={newsArticle}
                                    formikProps={formikProps}
                                    editMode={isEdit}
                                    isSubmitting={isSubmitting}
                                    setEditMode={(value) => setIsEdit(value)}
                                    isCreator={profile?.id === newsArticle?.creator?.id}
                                    status={newsArticle?.status}
                                    setIsFooterInView={setIsFooterInView}
                                    onApprovalSubmit={(status) => {
                                        updateArticle(formikProps.values, status);
                                    }}
                                    updateArticle={updateArticle}
                                    refetchNewsArticle={refetchNewsArticle}
                                    actionItemHandler={actionItemHandler}
                                    setActionItemHandler={setActionItemHandler}
                                    setShouldShowCommentBox={setShouldShowCommentBox}
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
