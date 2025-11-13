import SEOContainer from "../../src/features/SEOContainer";
import strapi from "../../src/queries/strapi";
import Experiences from "../../src/features/Experiences";
import RestrictToRead from "../../src/patterns/RestrictToRead";
import FoodAndDrinks from "../../src/features/FoodAndDrinks";

const RestaurantsPage = ({ post }) => {
    const getSeoValues = () => {
        let seoData = {
            title: post?.name ? post.name : "Postcard Food and Beverages | Conscious Luxury Travel ",
            description: post?.description
                ? post.description
                : "Discover conscious culinary experiences around the world",
            url: "https://www.postcard.travel/food-and-beverages",
            image: post?.logo?.url ? post?.logo?.url : "/assets/images/stays.jpg",
            keywords: "Postcard Food and Beverages, Conscious Luxury properties,Conscious Luxury hotels",
        };
        return seoData;
    };
    return (
        <>
            <SEOContainer seoData={getSeoValues()} />
            {/* <AllHotels isHotel={true} post={post}></AllHotels> */}

            <FoodAndDrinks
                type="restaurant"
                title={post?.name}
                description={post?.description}
            />

        </>
    );
};

export default RestaurantsPage;
export async function getStaticProps({ params, preview = null }) {
    let data = null;
    try {
        data = await strapi.find("directories", {
            filters: { slug: "food-and-beverages" },
            populate: {
                logo: {
                    fields: ["url"],
                },

                albums: {
                    //  filters: { on_boarding: { state: "approved" } },
                    populate: {
                        country: {
                            fields: ["name"],
                        },
                        company: {
                            fields: ["name"],
                        },
                        news_article: {
                            fields: ["id", "status"],
                            populate: {
                                blog: { fields: ["content"] },
                            },
                        },
                        coverImage: { fields: ["url"] },
                        on_boarding: { fields: ["state"] },
                        postcards: {
                            populate: {
                                coverImage: { fields: ["url"] },
                                user: {
                                    fields: ["fullName", "slug"],
                                    populate: ["company", "social"],
                                },
                                country: { fileds: ["name"] },
                                tags: { fields: ["name"] },
                            },
                        },
                        user: { fields: ["slug", "fullName"], populate: ["social"] },
                    },
                    sort: "updatedAt:DESC",
                },
            },
        });

        // Pass data to the page via props
    } catch (err) {
        //console.log(err);
    }
    return {
        props: {
            preview,
            post: {
                ...data?.data?.[0],
            },
        },
        revalidate: 300,
    };
}
