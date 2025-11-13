import LoadingGif from "../../src/patterns/LoadingGif";
import strapi from "../../src/queries/strapi";
import AnalyticsDashboard from "../../src/features/PostcardAnalytics/AnalyticsDashboard";
import { apiNames } from "../../src/services/fetchApIDataSchema";
import SEOContainer from "../../src/features/SEOContainer";

export default function PostcardPage({ company }) {
    const getSeoValues = () => {
        let seoData = {
            title: company && company.name ? "Postcard Analytics - " + company.name : "Postcard Analytics",
            description:
                "Discover inspiration for your next adventure with boutique brands that offer immersive experiences and advance responsible tourism.",
            url: company && company.name ? "https://www.postcard.travel/postcard-analytics/" + company?.name : "https://www.postcard.travel/postcard-analytics/",
            image: "/assets/images/p_stamp.png",
        };
        return seoData;
    };


    if (!company) {
        return (
            <div>
                <LoadingGif />
            </div>
        );
    }

    return (
        <>
            <SEOContainer seoData={getSeoValues()} />
            <AnalyticsDashboard company={company} />
        </>
    )
}

export async function getStaticPaths() {
    const { data: companies } = await strapi.find(apiNames.company, {
        filters: {
            users: {
                user_type: { name: "Hotels" },
            },
            name: { $notNull: true },
        },
    });

    return {
        paths: companies?.map((company) => ({
            params: { name: company?.name?.toString()?.toLowerCase() || "" }, // Ensure name is a string
        })) || [],
        fallback: true, // Enable ISR
    };
}

export async function getStaticProps({ params }) {
    const { name } = params;

    try {
        const { data } = await strapi.find(apiNames.company, {
            filters: {
                name: { $eqi: name },
                users: {
                    user_type: { name: "Hotels" },
                },
            },
            populate: {
                icon: {
                    fields: ["id", "url"]
                }
            }
        });

        return {
            props: {
                company: data?.length > 0 ? data[0] : null,
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error("Error fetching company data:", error);
        return {
            notFound: true,
        };
    }
}
