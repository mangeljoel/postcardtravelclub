import SEOContainer from "../src/features/SEOContainer";
import HomePage2 from "../src/features/HomePage2"

const PostcardSearch = () => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard Travel Club",
      description:
        "Discover the world of conscious luxury travel.",
      url: "https://www.postcard.travel",
      image: "/assets/homepage/hero-section-mobile.jpeg",
      keywords: "Postcard Travel Club, Conscious Luxury Experiences"
    };
    return seoData;
  };

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
        <HomePage2 />
    </>
  );
};
export async function getStaticProps({ params, preview = null }) {
  return {
    props: {
      preview,
      revalidate: 60,
    },
  };
}

export default PostcardSearch;
