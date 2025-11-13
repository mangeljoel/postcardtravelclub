import SEOContainer from "../src/features/SEOContainer";
import strapi from "../src/queries/strapi";
import Experiences from "../src/features/Experiences";
import RestrictToRead from "../src/patterns/RestrictToRead";

const HotelsPage = ({ post }) => {
  const getSeoValues = () => {
    let seoData = {
      title: post?.name
        ? post.name
        : "Postcard Stays | Conscious Luxury Travel ",
      description: post?.description
        ? post.description
        : "Find boutique properties that curate authentic experiences and advance conscious luxury travel.",
      url: "https://www.postcard.travel/stays",
      image: post?.logo?.url ? post?.logo?.url : "/assets/images/stays.jpg",
      keywords:
        "Postcard Stays, Conscious Luxury propertiesConscious Luxury hotels",
    };
    return seoData;
  };
  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <AllHotels isHotel={true} post={post}></AllHotels> */}
      {/* <RestrictToRead> */}
      <Experiences type="stays" filterType={null} initialFilter={null} />
      {/* </RestrictToRead> */}
    </>
  );
};

export default HotelsPage;
export async function getStaticProps({ params, preview = null }) {
  let data = null;
  try {
    data = await strapi.find("directories", {
      filters: { slug: "mindful-luxury-hotels" },
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
            // on_boarding: { fields: ["state"] },
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
