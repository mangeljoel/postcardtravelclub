import React from "react";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";
import {
  apiNames,
  populateNewsArticles,
} from "../../src/services/fetchApIDataSchema";
import SEOContainer from "../../src/features/SEOContainer";
import NewsLetterLayout from "../../src/features/NewsLetterLayout";
import RestrictToRead from "../../src/patterns/RestrictToRead";

const newsletter = ({ newsData }) => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard Wanderlust ",
      description:
        "Discover inspiration for your next adventure with boutique brands that offer immersive experiences and advance responsible tourism.",
      url: "https://www.postcard.travel/postcard-pages",
      image: "/assets/images/wanderlust.jpg",
    };
    return seoData;
  };

  return (
    <div>
      <SEOContainer seoData={getSeoValues()} />
      {/* <RestrictToRead /> */}
      <NewsLetterLayout newsData={newsData} />
    </div>
  );
};

export async function getStaticProps({ params }) {
  const newsData = await fetchPaginatedResults(
    apiNames.newsArticles,
    { status: "published" },
    populateNewsArticles,
    "createdAt:DESC"
  );
  return {
    props: {
      newsData,
    },
    revalidate: 600,
  };
}
export default newsletter;
