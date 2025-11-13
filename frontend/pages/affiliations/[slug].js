import React from 'react'
import AffiliationPage from '../../src/features/AffiliationPage'
import strapi from '../../src/queries/strapi'
import { apiNames } from '../../src/services/fetchApIDataSchema'
import SEOContainer from '../../src/features/SEOContainer'

const index = ({ affiliation }) => {
    const getSeoValues = () => {
        let seoData = {
            title: affiliation?.name?affiliation.name+" Collection | Postcard Travel Club":"Affiliations",
            description:affiliation?.description?affiliation?.description:
                "Join an inclusive community of conscious travellers, travel designers, storytellers, and boutique stays that are shaping the furure of travel.",
            url: affiliation?.slug?"https://www.postcard.travel/affiliations/"+affiliation?.slug:"https://www.postcard.travel/affiliations/",
            image:affiliation?.logo?.url? affiliation?.logo?.url:"/assets/images/p_stamp.png",
            keywords:  affiliation?.name?"Postcard Affiliations, "+ affiliation?.name :"Postcard Affiliations",
        };
        return seoData;
    };
    return (
        <>
            <SEOContainer seoData={getSeoValues()}></SEOContainer>

            <AffiliationPage affiliation={affiliation} />
            </>
    )
}

export default index

export async function getStaticPaths() {
    const { data } = await strapi.find(apiNames.affiliation);
    let affilData = Array.isArray(data) ? data : [data];

    return {
        paths: affilData?.map((aff) => ({
            params: { slug: aff?.slug || "" }, // Ensure name is a string
        })) || [],
        fallback: true, // Enable ISR
    };
}

export async function getStaticProps({ params }) {
    const { slug } = params;

    try {
        const { data } = await strapi.find(apiNames.affiliation, {
            filters: {
                slug
            },
            populate: {
                follow_affiliates: {
                    fields: ["id"]
                },
                logo:true
            }
        });

        return {
            props: {
                affiliation: data?.length > 0 ? data[0] : null,
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error("Error fetching affiliation data:", error);
        return {
            notFound: true,
        };
    }
}