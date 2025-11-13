// pages/experiences/[tag]/index.js
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import InterestPage from "../../../src/features/InterestPage";
import CountriesPage from "../../../src/features/Experiences/CountriesPage";
import ThemesPage from "../../../src/features/Experiences/ThemesPage";
import SEOContainer from "../../../src/features/SEOContainer";
const PAGE_CONFIG = {
  interests: {
    component: InterestPage,
    seo: {
      title: "Postcard Travel Experiences by Interests",
      description: "Discover curated experiences by boutique hotels that advance conscious luxury travel.",
url:"https://postcard.travel/experiences/interests",
      image:"/assets/homepage/hero-section-mobile.jpeg"    },
  },
  countries: {
    component: CountriesPage,
    seo: {
      title: "Postcard Travel Experiences by Countries",
      description: "Discover curated experiences by boutique hotels that advance conscious luxury travel.",
      keywords: "travel by country, destination experiences, country travel guide",
      url: "https://postcard.travel/experiences/countries",
      image:"/assets/homepage/hero-section-mobile.jpeg"
    },
  },
  themes: {
    component: ThemesPage,
    seo: {
      title: "Postcard Travel Experiences by Themes",
      description: "Discover curated experiences by boutique hotels that advance conscious luxury travel.",
      keywords: "themed travel, adventure themes, cultural experiences, travel categories",
      url:"https://postcard.travel/experiences/themes",
      image:"/assets/homepage/hero-section-mobile.jpeg"
    },
  },
};

const TagIndexPage = () => {
  const router = useRouter();
  const { tag } = router.query;

  if (!tag) return null;

  const selectedPage = PAGE_CONFIG[tag.toLowerCase()];

  if (!selectedPage) return null;

  const SelectedComponent = selectedPage.component;

  return (
    <>

      <SEOContainer seoData={selectedPage.seo} />
      <SelectedComponent />
    </>
  );
};

export default TagIndexPage;
