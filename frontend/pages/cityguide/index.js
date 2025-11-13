import SEOContainer from "../../src/features/SEOContainer";
import CityGuide from "../../src/features/CityGuide/CityGuidePage";
import RestrictToRead from "../../src/patterns/RestrictToRead";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";

const CityGuidePage = ({ cities }) => {
  const getSeoValues = () => ({
    title: "Postcard City Guide | Conscious Luxury Travel Destinations",
    description:
      "Discover curated collections of conscious luxury experiences, stays, and local gems in incredible destinations around the world.",
    url: "https://www.postcard.travel/cityguide",
    image: "/assets/landingpage/cityguide.png",
    keywords: "City Guide, Travel Destinations, Conscious Luxury Travel",
  });

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      {/* <RestrictToRead> */}
      <CityGuide initialCities={cities} />
      {/* </RestrictToRead> */}
    </>
  );
};

export default CityGuidePage;
export async function getStaticProps() {
  let cities = [];

  try {
    console.log("Fetching from city-guides API using fetchPaginatedResults...");

    // ✅ Use fetchPaginatedResults instead of fetch
    const cityGuidesData = await fetchPaginatedResults(
      "city-guides",
      {}, // No filters - get all city guides
      {
        region: {
          fields: ["id", "name"],
        },
        country: {
          fields: ["id", "name"],
        },
        image: {
          fields: ["url"],
        },
      }
    );

    console.log("City guides response:", cityGuidesData);

    // ✅ Handle response format
    const cityGuidesArray = Array.isArray(cityGuidesData)
      ? cityGuidesData
      : cityGuidesData
      ? [cityGuidesData]
      : [];

    // ✅ For each city guide, fetch album counts by directory using fetchPaginatedResults
    const citiesWithCounts = await Promise.all(
      cityGuidesArray.map(async (guide) => {
        console.log("Processing guide:", guide);

        let albumCounts = { shopping: 0, restaurants: 0, events: 0 };

        try {
          // ✅ Fetch albums for this region using fetchPaginatedResults
          const albumsData = await fetchPaginatedResults(
            "albums",
            {
              region: guide.region?.id, // Filter by region ID
              isActive: true,
            },
            {
              directories: {
                fields: ["id", "name"],
              },
            }
          );

          const albumsArray = Array.isArray(albumsData)
            ? albumsData
            : albumsData
            ? [albumsData]
            : [];
          console.log(`Albums for ${guide.region?.name}:`, albumsArray.length);

          // Count albums by directory
          albumsArray.forEach((album) => {
            const directoryIds = album.directories?.map((dir) => dir.id) || [];

            if (directoryIds.includes(8)) albumCounts.shopping++; // Shopping directory
            if (directoryIds.includes(6)) albumCounts.restaurants++; // Restaurant directory
            if (directoryIds.includes(0)) albumCounts.events++; // Events directory
          });

          console.log(
            `Directory counts for ${guide.region?.name}:`,
            albumCounts
          );
        } catch (albumError) {
          console.error("Error fetching albums for region:", albumError);
        }

        return {
          id: guide.id,
          regionId: guide.region?.id,
          name: guide.region?.name,
          country: guide.country?.name,
          slug:
            `${guide.region?.name}`.toLowerCase().replace(/\s+/g, "-") +
            "-" +
            `${guide.country?.name}`.toLowerCase().replace(/\s+/g, "-"),
          image: guide.image?.url || "/assets/cities/bengaluru.jpg",
          albumCounts: albumCounts, // ✅ Store counts object
          description: guide.description || `Discover ${guide.region?.name}`,
        };
      })
    );

    cities = citiesWithCounts.filter((city) => city.name);
    console.log("Transformed cities with counts:", cities);
  } catch (error) {
    console.error("Error fetching city guides:", error);
    cities = [];
  }

  return {
    props: { cities },
    revalidate: 300,
  };
}
