import AllHotels from "../src/features/AllHotels";
import SEOContainer from "../src/features/SEOContainer";
import RestrictToRead from "../src/patterns/RestrictToRead";
import strapi from "../src/queries/strapi";

const ToursPage = ({ post }) => {
  const getSeoValues = () => {
    let seoData = {
      title: post.name ? post.name : "Postcard Designer Tours",
      description: post.description
        ? post.description
        : "Discover travel inspiration from designer tours that advance responsible tourism",
      url: "https://www.postcard.travel/tours",
      image: post?.logo?.url ? post?.logo?.url : "/assets/images/tours.jpg",
      keywords:
        "Postcard Tours, Conscious Luxury Tours,  Conscious Luxury Retreats",
    };
    return seoData;
  };
  //console.log(post);
  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <RestrictToRead> */}
      <AllHotels isHotel={false} post={post}></AllHotels>
      {/* </ RestrictToRead> */}
    </>
  );
};

export default ToursPage;
export async function getStaticProps({ params, preview = null }) {
  let data = null;
  try {
    data = await strapi.find("directories", {
      filters: { slug: "mindful-luxury-tours" },
      populate: {
        logo: {
          fields: ["url"],
        },

        albums: {
          // filters: { on_boarding: { state: "approved" } },
          populate: {
            country: {
              fields: ["name"],
            },
            company: {
              fields: ["name"],
              populate: {
                icon: {
                  fields: ["id", "url"],
                },
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
            news_article: {
              fields: ["id", "status", "title"],
              populate: {
                image: { fields: ["id", "url"] },
              },
            },
          },
          sort: "updatedAt:DESC",
        },
        sort: "priority",
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
