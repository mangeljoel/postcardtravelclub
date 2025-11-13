import DestinationExpert from "../../src/features/DestinationExpert";
import SEOContainer from "../../src/features/SEOContainer";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getStaticPaths() {
    // Fetch all destination expert slugs
    const experts = await fetchPaginatedResults('destination-experts', {
        status: "published"
    }, {
        user: {
            fields: ["slug"]
        }
    });

    // Create paths with the slug parameter
    const paths = experts.map(expert => ({
        params: { slug: expert.user.slug }
    }));

    return {
        paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;

    const data = await fetchPaginatedResults('destination-experts', { user: { slug } }, {
        fields: ["id", "name", "title", "tagLine"],
        founderMessage: {
            fields: ["id", "founderImage"],
            populate: {
                founderImage: {
                    fields: ["id", "url"],
                },
            },
        },
        coverImage: {
            fields: ["url"]
        }
    });

    const expert = Array.isArray(data) ? data?.[0] : data;

    // If no expert is found, return notFound
    if (!expert) {
        return {
            notFound: true
        };
    }

    let expertData = null;
    try {
        const expertId = expert.id; // Use expert.id if available or fallback to 138
        // const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/destination-expert/getExpertData/${expertId}?cache=true&filter=true`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/destination-expert/getExpertData/${expertId}?cache=true&filter=true`);

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        expertData = await response.json();
        // console.log("Expert API data:", expertData);
    } catch (error) {
        console.error("Failed to fetch expert API data:", error);
        // Continue even if this API call fails
    }

    const seoData = {
        title: `Postcard Storyboard | ${expert?.name}${expert?.title ? ` | ${expert?.title}` : ''}`,
        description: expert?.tagLine ?? `${expert?.name}${expert?.title ? `, ${expert?.title}` : ''}`,
        url: `https://www.postcard.travel/destination-experts/${slug}`,
        image: expert?.founderMessage?.founderImage?.url ??
            expert?.coverImage?.url ??
            "/assets/images/p_stamp.png"
    };

    return {
        props: {
            slug,
            seoData,
            expertData: expertData ?? null,
        },
        revalidate: 60 * 60 * 24
    };
}

const DestinationExpertPage = ({ slug, seoData, expertData }) => {
    const router = useRouter();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        // Get the isEdit query parameter from the URL on the client side
        const { isEdit: isEditQuery } = router.query;
        setIsEdit(isEditQuery === "true");
    }, [router.query]);

    // Wait for router to be ready before rendering with query params
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <SEOContainer seoData={seoData} />
            <DestinationExpert slug={slug} isEdit={isEdit} expertData={expertData} />
        </>
    );
};

export default DestinationExpertPage;