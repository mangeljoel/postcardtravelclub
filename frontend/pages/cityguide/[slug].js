import { useRouter } from "next/router";
import SEOContainer from "../../src/features/SEOContainer";
import LocationGuide from "../../src/features/CityGuide/LocationGuide";
import RestrictToRead from "../../src/patterns/RestrictToRead";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";

const CityLocationPage = ({ locationData, albums }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const getSeoValues = () => ({
    title: `${locationData.name} | Postcard Food and Beverages`,
    description: `Discover curated albums in ${locationData.name}`,
    url: `https://www.postcard.travel/food-and-beverages/${locationData.slug}`,
    image: locationData.image,
    keywords: `${locationData.name}, Food and Beverages`,
  });

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <RestrictToRead> */}
      <LocationGuide
        locationData={locationData}
        locationType="region"
        initialAlbums={albums}
      />
      {/* </RestrictToRead> */}
    </>
  );
};

export default CityLocationPage;

export async function getStaticPaths() {
  try {
    // ✅ Use fetchPaginatedResults to get paths
    const cityGuidesData = await fetchPaginatedResults(
      "city-guides",
      {},
      {
        region: { fields: ["name"] },
        country: { fields: ["name"] },
      }
    );

    const cityGuidesArray = Array.isArray(cityGuidesData) ? cityGuidesData : [cityGuidesData];

    const paths = cityGuidesArray.map(guide => ({
      params: {
        slug: `${guide.region?.name}`.toLowerCase().replace(/\s+/g, '-') + '-' + `${guide.country?.name}`.toLowerCase().replace(/\s+/g, '-')
      }
    })).filter(path => path.params.slug !== 'undefined-undefined');

    console.log('Generated paths:', paths);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths,
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    console.log('Fetching city guide for slug:', params.slug);

    // ✅ Get all city guides and find the matching one
    const cityGuidesData = await fetchPaginatedResults(
      "city-guides",
      {},
      {
        region: { fields: ["id", "name"] },
        country: { fields: ["id", "name"] },
        image: { fields: ["url"] },
      }
    );

    const cityGuidesArray = Array.isArray(cityGuidesData) ? cityGuidesData : [cityGuidesData];

    // Find matching city guide by slug
    const [regionName, countryName] = params.slug.split('-');

    const cityGuide = cityGuidesArray.find(guide => {
      const regionMatch = guide.region?.name?.toLowerCase().replace(/\s+/g, '-') === regionName;
      const countryMatch = guide.country?.name?.toLowerCase().replace(/\s+/g, '-') === countryName;
      return regionMatch && countryMatch;
    });

    if (!cityGuide) {
      console.log("No city guide found for slug:", params.slug);
      return { notFound: true };
    }

    console.log('Found city guide:', cityGuide);

    // ✅ Prepare location data for LocationPage
    const locationData = {
      id: cityGuide.region.id, // ✅ Region ID for fetching albums
      name: cityGuide.region.name,
      country: {
        id: cityGuide.country.id,
        name: cityGuide.country.name,
      },
      slug: params.slug,
      image: cityGuide.image?.url,
      description: cityGuide.description,
    };

    console.log('Location data for LocationPage:', locationData);

    return {
      props: {
        locationData,
        albums: [], // Empty - LocationPage will fetch albums using region ID
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error fetching city guide:", error);
    return { notFound: true };
  }
}
