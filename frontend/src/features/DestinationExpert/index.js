import { Button, Flex } from "@chakra-ui/react"
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import ActionItemsDestinationExpert from "./ActionItemsDestinationExpert";
import ExpertPage from "./About/ExpertPage";
import EditExpertPage from "./EditExpertPage";
import { createDBEntry, deleteDBEntry, fetchPaginatedResults, updateDBValue } from "../../queries/strapiQueries";
import { Formik } from "formik";
import * as Yup from 'yup';
import NotPrivileged from "../../patterns/NotPrivileged";
import LoadingGif from "../../patterns/LoadingGif";
import { useRouter } from "next/router";

// Validation schema moved outside component to prevent recreation
const validationSchema = Yup.object().shape({
    title: Yup.string().required('Tour title is required'),
    name: Yup.string().required('Name is required'),
    country: Yup.number().required('Country is required').nullable(),
    coverImage: Yup.number().required('Cover image is required'),
    coverImageUrl: Yup.string(),
    tagLine: Yup.string().required('Tag Line is required'),
    quotes: Yup.object().shape({
        quoteText: Yup.string().required('Quote text is required'),
        quoteAuthor: Yup.string().required('Quote author is required'),
    }),
    founderMessage: Yup.object().shape({
        founderBrief: Yup.string().required('Founder Brief is required'),
        founderImage: Yup.number().required('Founder Image is required').nullable(),
        founderImageUrl: Yup.string(),
    }),
    dxSections: Yup.array().of(
        Yup.object().shape({
            content: Yup.string().required('Section Content is required'),
            media: Yup.array()
        })
    ),
    testimonials: Yup.array().of(
        Yup.object().shape({
            title: Yup.string().required('Testimonial Title is required'),
            message: Yup.string().required('Testimonial Message is required'),
            name: Yup.string().required('Testimonial Name is required'),
            location: Yup.string().required('Testimonial Location is required'),
        })
    ),
});

const DestinationExpert = ({ slug, isEdit, expertData }) => {
    const { profile } = useContext(AppContext);
    const router = useRouter();
    const formikRef = useRef();
    const [data, setData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showActionButton, setShowActionButton] = useState(false);
    const [isFooterInView, setIsFooterInView] = useState(false);
    const [initialValues, setInitialValues] = useState({
        title: '',
        coverImage: null,
        coverImageUrl: '',
        name: profile?.fullName || '',
        country: '',
        tagLine: '',
        quotes: {
            quoteText: '',
            quoteAuthor: '',
        },
        founderMessage: {
            founderBrief: '',
            founderImage: null,
            founderImageUrl: '',
        },
        sections: [],
        testimonials: [],
    });

    const triggerRevalidation = async () => {
        const res = await fetch(`/api/revalidate?slug=${slug}`);
        const data = await res.json();
        console.log('Revalidation response:', data);
    };

    const fetchData = async (onlyFetchAndSet = false) => {
        setIsLoading(true)
        const data = await fetchPaginatedResults('destination-experts', { user: { slug } }, {
            user: true, country: true,
            coverImage: true,
            quotes: true,
            founderMessage: {
                populate: {
                    select: ["id", "url"],
                    founderImage: true,
                },
            },
            dxSections: {
                populate: {
                    dx_section: true,
                    media: {
                        select: ["id", "url"]
                    }
                }
            },
            testimonials: {
                fields: ["name", "title", "message", "location"],
            }
        })

        if (data) {
            setData(data)
            if (!onlyFetchAndSet) {
                const hasAccess = ["Admin", "SuperAdmin", "EditorInChief"].includes(profile?.user_type?.name) || data?.user?.id == profile?.id
                if (hasAccess) {
                    setShowActionButton(true)
                }
                else setShowActionButton(false)

                if (hasAccess && (data.status !== "published" || isEdit)) {
                    setEditMode(true)

                    if (isEdit) {
                        const { isEdit, ...queryWithoutIsEdit } = router.query;
                        router.replace(
                            {
                                pathname: router.pathname,
                                query: { ...queryWithoutIsEdit }, // Ensure slug is retained
                            },
                            undefined,
                            { shallow: true }
                        );
                    }
                }
            }
        }
        setIsLoading(false)
    }

    const intializeValues = async () => {
        const dxSecs = await fetchPaginatedResults('dx-sections', {}, undefined, 'priority:ASC');
        // console.log(data)
        setInitialValues((prev) => ({
            ...prev,
            title: data?.title || '',
            coverImage: data?.coverImage?.id || null,
            coverImageUrl: data?.coverImage?.url || '',
            name: data?.name || profile?.fullName || '',
            country: data?.country?.id || '',
            tagLine: data?.tagLine || '',
            quotes: data?.quotes || {
                quoteText: '',
                quoteAuthor: '',
            },
            founderMessage: data?.founderMessage ? {
                founderBrief: data.founderMessage.founderBrief,
                founderImage: data.founderMessage.founderImage?.id,
                founderImageUrl: data.founderMessage.founderImage?.url,
            } : {
                founderBrief: '',
                founderImage: null,
                founderImageUrl: '',
            },
            dxSections: data?.dxSections?.length > 0
                ? data.dxSections.map((section) => ({
                    question: section?.dx_section?.title || '',
                    dx_section: section?.dx_section?.id,
                    content: section?.content || '',
                    media: section?.media || [],
                    order: section?.dx_section?.priority || 0,
                }))
                : dxSecs.map((section) => ({
                    question: section.title || '',
                    dx_section: section.id,
                    content: section.content || '',
                    media: section.media || [],
                    order: section.priority || 0,
                })),
            testimonials: data?.testimonials || [],
        }));

    }

    const handleSubmit = async (values, actions, shouldValidate = true, shouldPublish = false) => {
        try {
            // console.log(values)
            // if (shouldValidate) {
            //     // Validate all fields before submission
            //     const errors = await validationSchema.validate(values, { abortEarly: false })
            //         .catch(err => {
            //             // console.log('Validation errors:', err.errors);
            //             return err.errors;
            //         });

            //     if (Array.isArray(errors)) {
            //         console.log(errors)
            //         // If there are validation errors, don't proceed
            //         // console.log('Validation failed');
            //         return false;
            //     }
            // }

            // Separate logic for testimonials
            const initialTestimonials = data?.testimonials || [];
            const currentTestimonials = values.testimonials || [];

            // 1. Identify testimonials to create
            const testimonialsToCreate = currentTestimonials.filter(t => !t.id);

            // 2. Identify testimonials to update
            const testimonialsToUpdate = currentTestimonials.filter(t => t.id);

            // 3. Identify testimonials to delete
            const testimonialsToDelete = initialTestimonials.filter(
                initialTestimonial => !currentTestimonials.some(currentTestimonial => currentTestimonial.id === initialTestimonial.id)
            );

            // Create new testimonials and collect their IDs
            const createdTestimonialsIds = await Promise.all(
                testimonialsToCreate.map(async (testimonial) => {
                    const created = await createDBEntry('testimonials', testimonial); // Adjust API for creating testimonials
                    return created?.data?.id;
                })
            );


            // Update existing testimonials
            await Promise.all(
                testimonialsToUpdate.map(async (testimonial) => {
                    await updateDBValue('testimonials', testimonial.id, testimonial);
                })
            );

            // Delete removed testimonials
            await Promise.all(
                testimonialsToDelete.map(async (testimonial) => {
                    await deleteDBEntry('testimonials', testimonial.id); // Adjust API for deletion
                })
            );

            // Add new testimonial IDs to values
            values = {
                ...values,
                testimonials: [...testimonialsToUpdate.map(t => t.id), ...createdTestimonialsIds]
            }

            // Your submission logic here
            if (shouldPublish) values["status"] = "published"
            // console.log('Form submitted:', values);
            await updateDBValue('destination-experts', data?.id, values)
            await fetchData(true)
            return true;
        } catch (error) {
            console.error('Submission error:', error);
            return false;
        }
    };

    useEffect(() => {
        intializeValues();
    }, [data]);

    // useEffect(() => console.log("hello", data), [data])

    useEffect(() => {
        fetchData()
    }, [profile, slug])

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
    });

    if (isLoading) return <LoadingGif />

    if (
        !data ||
        data?.length === 0 ||
        (data.status === "draft" &&
            (
                profile?.id !== data?.user?.id &&
                !["Admin", "SuperAdmin"].includes(profile?.user_type?.name)
            ))
    ) {
        return <NotPrivileged />;
    }


    return (
        <Flex
            flexDirection={"column"}
            w={"100%"}
            alignItems={"center"}
            pos="relative"
            pb={editMode ? 4 : 0}
        >

            {!editMode
                ? <ExpertPage data={data} expertData={expertData} triggerRevalidation={triggerRevalidation} showActionButton={showActionButton} isFooterInView={isFooterInView} editMode={editMode} setEditMode={setEditMode} formikRef={formikRef} handleSubmit={handleSubmit} />
                : <Formik
                    w={"100%"}
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    //validationSchema={validationSchema}
                    onSubmit={(values, actions) => handleSubmit(values, actions)}
                >
                    {({ values, setFieldValue, setFieldTouched }) => (
                        <>{
                profile && showActionButton && (
                    <Flex
                        id="ActionItemsDestinationExpert"
                        w="15%"
                        // h="15%"
                        right={0}
                        bottom={!isFooterInView ? 8 : 8}
                        pos={!isFooterInView ? "fixed" : "absolute"}
                        zIndex={102}
                        justifyContent={"center"}
                        alignItems={!isFooterInView ? "center" : "flex-end"}
                    >
                        <ActionItemsDestinationExpert status={data?.status} editMode={editMode} setEditMode={setEditMode} formikRef={formikRef} handleSubmit={handleSubmit}
                            handleUnpublish={async () => {
                                await updateDBValue('destination-experts', data?.id, { status: "draft" })
                                setEditMode(true)
                            }} />
                    </Flex>
                )
            }
                        <EditExpertPage
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            />
                                </>
                    )}

                </Formik>
            }
        </Flex>
    )
}

export default DestinationExpert