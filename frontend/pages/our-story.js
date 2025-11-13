import Aboutus from "../src/features/AboutUs";
import OurStory from "../src/features/OurStory";
import SEOContainer from "../src/features/SEOContainer";
import strapi from "../src/queries/strapi";
const StoryAbout = ({ aboutUsSections, config }) => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard - Our Story",
      description:
        "Join an inclusive community of conscious travellers, travel designers, storytellers, and boutique stays that are shaping the furure of travel.",
      url: "https://postcard.travel/our-story",
      image: "/assets/new_cover_image.png",
      keywords: "About Postcard, Postcard Story, story"
    };
    return seoData;
  };

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <OurStory aboutUsSections={aboutUsSections} config={config}></OurStory> */}
      <Aboutus />
    </>
  );
};

export default StoryAbout;
export async function getStaticProps({ params, preview = null }) {
  let data = null;
  let config = null;

  try {
    data = await strapi.find("about-us-sections", {
      populate: {
        about_us_profiles: {
          populate: {
            frontImage: {
              fields: ["url"],
            },
            backImage: {
              fields: ["url"],
            },
            country: {
              fields: ["name"],
            },
          },
        },
      },
      sort: "priority",
    });
    config = await strapi.find("config");
    // Pass data to the page via props
  } catch (err) { }
  return {
    props: {
      preview,
      aboutUsSections: data?.data,
      config: config.data,
    },
    revalidate: 300,
  };
}
