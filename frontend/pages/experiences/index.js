import { useRouter } from "next/router";
import RestrictToRead from "../../src/patterns/RestrictToRead";
import SEOContainer from "../../src/features/SEOContainer";
import Experiences from "../../src/features/Experiences";
import { useEffect, useState } from "react";

const FilteredExperiencesPage = () => {
  const router = useRouter();
  const { search } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady]);

  const getSeoValues = () => {
    const searchText = search ? decodeURIComponent(search) : "";

    let seoData =  {
      title: "Postcard Travel Experiences",
      description:  "Find authentic experiences by boutique properties that advance conscious luxury travel.",
      url: "https://www.postcard.travel/experiences",
      image: "/assets/images/experiences.jpg",
      keywords: searchText
        ? `${searchText}, Postcard Experiences, Conscious Luxury Travel`
        : "Postcard Experiences, Conscious Luxury Travel",
    };
    return seoData;
  };

  if (!router.isReady || isLoading) {
    return null;
  }

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <RestrictToRead> */}
      <Experiences
        type="experiences"
        filterType={null}
        initialFilter={
          search ? { searchText: decodeURIComponent(search) } : null
        }
        searchQuery={search ? decodeURIComponent(search) : null}
      />
      {/* </RestrictToRead> */}
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

export default FilteredExperiencesPage;
