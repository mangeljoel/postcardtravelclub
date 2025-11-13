import SEOContainer from "../../src/features/SEOContainer";
import TravelLoguePage from "../../src/features/TravelLog";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";

export async function getServerSideProps({ params, query }) {
    const { slug } = params;

    const data = await fetchPaginatedResults('travelogues', {
        slug
    }, {
        destination_expert: {
            fields: ['name', 'title'],
            populate: {
                user: {
                    fields: ['id', 'slug']
                }
            }
        },
        itinerary_block: {
            fields: ["order", "date"],
            populate: {
                dx_card: {
                    fields: ['id', 'name', 'intro', 'story'],
                    populate: {
                        dx_card_type: { fields: ['id', 'name'] },
                        coverImage: { fields: ['url'] },
                        country: { fields: ['id', 'name'] },
                        region: {
                            fields: ['id', 'name'],
                            populate: {
                                country: { fields: ['id', 'name'] }
                            }
                        },
                        environment: { fields: ['id', 'name'] },
                        category: { fields: ['id', 'name'] },
                        tags: {
                            fields: ['id', 'name'],
                            populate: { tag_group: { fields: ['id', 'name'] } }
                        },
                        tag_group: {
                            fields: ['id', 'name'],
                        },
                        destination_expert: {
                            fields: ['name', 'title'],
                            populate: {
                                user: {
                                    fields: ['id', 'company']
                                }
                            }
                        },
                        postcard: { fields: ['name'] }
                    },
                },
                gallery: {
                    fields: ['id', 'url', "caption"],
                }
            }
        },
        user: true
    }, undefined);

    if (!data || (Array.isArray(data) && data.length === 0)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { itinerary_block, ...rest } = Array.isArray(data) ? data?.[0] : data; // adjust depending on your data structure

    const seoData = {
        title: `Postcard Deck - ${rest?.title}`,
        description: rest?.title || '',
        url: `https://www.postcard.travel/postcard-deck/${rest?.slug}`,
        image: itinerary_block?.length > 0 ? itinerary_block[0]?.dx_card?.coverImage?.url :
            "/assets/images/p_stamp.png"
    };

    return {
        props: {
            deckDetails: rest,
            blocks: itinerary_block,
            seoData
        }
    };
}

const DestinationExpertPage = ({ seoData, deckDetails, blocks }) => {
    return (
        <>
            <SEOContainer seoData={seoData} />
            <TravelLoguePage deckDetails={deckDetails} blocks={blocks} />
        </>
    );
};

export default DestinationExpertPage;
