// pages/experiences/[tag]/[filterValue].js
import { useRouter } from "next/router";
import SEOContainer from "../../../src/features/SEOContainer";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import FilteredExperiencesLanding from "../../../src/features/Experiences/FilteredExperiencesLanding";
import RestrictToRead from "../../../src/patterns/RestrictToRead";

/** Normalize for robust comparison */
const normalizeForCompare = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/_/g, " ")
    .replace(/[.,\/#!$%\^*;:{}=\_`~()"''<>?+\[\]]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const decodeSlugToDisplay = (slug, { useAmpersand = true } = {}) => {
  if (!slug) return "";

  let str = String(slug).replace(/-/g, " ");
  str = str.replace(/_/g, ", ");
  if (useAmpersand) {
    str = str.replace(/\band\b/g, "&");
  }
  str = str
    .split(" ")
    .map((w) => {
      if (!w) return "";
      if (w.endsWith(",")) {
        return w.slice(0, -1).charAt(0).toUpperCase() + w.slice(1);
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
  return str.replace(/\s+/g, " ").trim();
};

const FilteredExperiencesPage = () => {
  const router = useRouter();
  const { tag, filterValue, search, region } = router.query;
  const [initialFilter, setInitialFilter] = useState(null);
  const [filterId, setFilterId] = useState(null); // NEW: Store the filter ID
  const [isLoading, setIsLoading] = useState(true);
   const  seoData = {
            title: "Postcard Travel Experience - " + filterValue.charAt(0).toUpperCase() + filterValue.slice(1),
            description: "Discover curated experiences by boutique hotels that advance conscious luxury travel.",
            image: "https://www.postcard.travel/assets/images/experiences.jpg",
            url:"https://postcard.travel/"+tag+"/"+filterValue
          }

  // Use ref to track if we're already fetching to prevent duplicate calls
  const isFetchingRef = useRef(false);
  // Use ref to track the last fetched params to avoid redundant fetches
  const lastFetchedParamsRef = useRef(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      // Wait for router to be ready
      if (!router.isReady) return;

      // Create a unique key for current params
      const currentParamsKey = JSON.stringify({
        tag,
        filterValue,
        search,
        region,
      });

      // Skip if already fetching or if params haven't changed
      if (
        isFetchingRef.current ||
        lastFetchedParamsRef.current === currentParamsKey
      ) {
        return;
      }

      // Handle search-only case
      if (!tag && !filterValue && search) {
        setInitialFilter({
          searchText: decodeURIComponent(search),
        });
        setIsLoading(false);
        lastFetchedParamsRef.current = currentParamsKey;
        return;
      }

      // Must have both tag and filterValue
      if (!tag || !filterValue) {
        setIsLoading(false);
        return;
      }

      // Mark as fetching
      isFetchingRef.current = true;
      lastFetchedParamsRef.current = currentParamsKey;
      setIsLoading(true);

      try {
        const formattedValue = decodeSlugToDisplay(
          decodeURIComponent(filterValue)
        );

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getFilters`,
          { tags: [] }
        );

        let filterData = null;
        let regionData = null;

        // Compare normalized names and extract ID
        if (tag === "countries" && response.data.country) {
          filterData = response.data.country.find(
            (item) =>
              normalizeForCompare(item.name) ===
              normalizeForCompare(formattedValue)
          );

          if (filterData) {
            setFilterId(filterData.id); // NEW: Set the country ID
          }

          if (region && response.data.region) {
            const formattedRegion = decodeSlugToDisplay(
              decodeURIComponent(region)
            );
            regionData = response.data.region.find(
              (item) =>
                normalizeForCompare(item.name) ===
                normalizeForCompare(formattedRegion)
            );
          }

        } else if (tag === "region" && response.data.region) {
          filterData = response.data.region.find(
            (item) =>
              normalizeForCompare(item.name) ===
              normalizeForCompare(formattedValue)
          );
          if (filterData) {
            setFilterId(filterData.id); // NEW: Set the region ID
          }
        } else if (tag === "themes" && response.data.tagGroup) {
          filterData = response.data.tagGroup.find(
            (item) =>
              normalizeForCompare(item.name) ===
              normalizeForCompare(formattedValue)
          );
          if (filterData) {
            setFilterId(filterData.id); // NEW: Set the theme ID
          }
        } else if (tag === "interests" && response.data.tags) {
          filterData = response.data.tags.find(
            (item) =>
              normalizeForCompare(item.name) ===
              normalizeForCompare(formattedValue)
          );
          if (filterData) {
            setFilterId(filterData.id); // NEW: Set the interest ID
          }
        }

        const baseFilter = {};
        if (search) baseFilter.searchText = decodeURIComponent(search);

        if (filterData) {
          if (tag === "interests") {
            setInitialFilter({ ...baseFilter, selectedTags: [filterData] });
          } else if (tag === "themes") {
            setInitialFilter({ ...baseFilter, tagGroup: filterData });
          } else if (tag === "countries") {
            setInitialFilter({
              ...baseFilter,
              country: filterData,
              ...(regionData && { region: regionData }),
            });
          } else {
            setInitialFilter({ ...baseFilter, [tag]: filterData });
          }
        } else {
          // Fallback when no data found - clear filterId
          setFilterId(null);

          if (tag === "interests") {
            setInitialFilter({
              ...baseFilter,
              selectedTags: [{ name: formattedValue }],
            });
          } else if (tag === "themes") {
            setInitialFilter({
              ...baseFilter,
              tagGroup: { name: formattedValue },
            });
          } else if (tag === "countries") {
            const fallback = {
              ...baseFilter,
              country: { name: formattedValue },
            };
            if (region) {
              const formattedRegion = decodeSlugToDisplay(
                decodeURIComponent(region)
              );
              fallback.region = { name: formattedRegion };
            }
            setInitialFilter(fallback);
          } else {
            setInitialFilter({
              ...baseFilter,
              [tag]: { name: formattedValue },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
        // Clear filterId on error
        setFilterId(null);

        // Set a fallback filter even on error
        const formattedValue = decodeSlugToDisplay(
          decodeURIComponent(filterValue)
        );
        const baseFilter = {};
        if (search) baseFilter.searchText = decodeURIComponent(search);

        if (tag === "interests") {
          setInitialFilter({
            ...baseFilter,
            selectedTags: [{ name: formattedValue }],
          });
        } else if (tag === "themes") {
          setInitialFilter({
            ...baseFilter,
            tagGroup: { name: formattedValue },
          });
        } else {
          setInitialFilter({
            ...baseFilter,
            [tag]: { name: formattedValue },
          });
        }
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchFilterData();
  }, [router.isReady, tag, filterValue, search, region]);



  if (!router.isReady || isLoading) return null;

  return (
    <>
      <SEOContainer seoData={seoData} />
      {/* <RestrictToRead> */}
      <FilteredExperiencesLanding
        filterType={tag === "themes" ? "theme" : tag}
        filterValue={filterValue}
        filterId={filterId} // NEW: Pass the filter ID
        initialFilter={initialFilter}
      />
      {/* </RestrictToRead> */}
    </>
  );
};

export async function getServerSideProps({ params, query }) {
  const { tag, filterValue } = params;
  const { search, region } = query;

  const validTags = ["countries", "themes", "interests", "region"];
  if (!validTags.includes(tag.toLowerCase())) {
    return { notFound: true };
  }

  return {
    props: { tag, filterValue, search: search || null, region: region || null },
  };
}

export default FilteredExperiencesPage;
