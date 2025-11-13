/* eslint-disable prettier/prettier */
import Podcast from "../src/features/Podcast";
import SEOContainer from "../src/features/SEOContainer";
import strapi from "../src/queries/strapi";
import { fetchPaginatedResults } from "../src/queries/strapiQueries";
import {
  apiNames,
  podCastData,
  populatePodcastData,
} from "../src/services/fetchApIDataSchema";
// const Podcast = dynamic(() => import("../src/features/Podcast"), {
//   ssr: false,
// });

const PodcastPage = ({ podcasts }) => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard Podcast",
      description:
        "Listen to personal stories of impact entrepreneurs that are shaping the future of travel.",
      url: "https://www.postcard.travel/podcast",
      image: "/assets/images/p_stamp.png",
      keywords: "Postcard Podcast, travel talks, travel expert talks"
    };
    return seoData;
  };
  return (
    <div>
      <SEOContainer seoData={getSeoValues()} />
      <Podcast podcasts={podcasts} />
    </div>
  );
};
export async function getStaticProps({ params }) {
  const podcasts = await fetchPaginatedResults(
    apiNames.podcast,
    {},
    populatePodcastData,
    "pubDate:DESC"
  );
  return {
    props: {
      podcasts,
    },
    revalidate: 600,
  };
}

export default PodcastPage;
