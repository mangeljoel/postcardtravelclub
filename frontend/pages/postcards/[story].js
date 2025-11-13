import TravelStoryPage from "../../src/features/TravelStoryPage";
import { getPostcardByFilter } from "../../src/queries/strapiQueries";
import strapi from "../../src/queries/strapi";
import { getTravelStorySeoValues } from "../../src/services/defaultSEO";
import SEOContainer from "../../src/features/SEOContainer";
import LoadingGif from "../../src/patterns/LoadingGif";

const StoryPage = ({ post }) => {
  if (!post) {
    return <LoadingGif />;
  }

  return (
    <>
      <SEOContainer seoData={getTravelStorySeoValues(post)} />
      <TravelStoryPage postcard={post} />
    </>
  );
};
export default StoryPage;
export async function getStaticProps({ params, preview = null }) {
  let data = null;

  try {
    data = await getPostcardByFilter({ slug: params.story });
  } catch (err) {
    console.error("Error fetching postcard data:", err);
  }

  return {
    props: {
      preview,
      post: data?.data?.[0] || null,
    },
    revalidate: 300,
  };
}

export async function getStaticPaths() {
  const { data, error } = await strapi.find("postcards", {
    sort: "id",
    filters: { slug: { $notNull: true } },
  });

  if (error) {
    console.error("Error fetching postcard data:", error);
    return {
      paths: [],
      fallback: true,
    };
  }

  const paths = data?.map((page) => ({
    params: { story: page.slug.toString() },
  }));

  return { paths, fallback: true };
}
