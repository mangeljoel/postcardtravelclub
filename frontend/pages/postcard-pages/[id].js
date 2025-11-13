import React from "react";
import { useRouter } from "next/router";
import { fetchPaginatedResults } from "../../src/queries/strapiQueries";
import {
  apiNames,
  populateNewsArticles,
} from "../../src/services/fetchApIDataSchema";
import SEOContainer from "../../src/features/SEOContainer";
import StorytellerPages from "../../src/features/StorytellerPages";

const EditPostcardPage = ({ article, album }) => {
  const router = useRouter();

  // show fallback while Next is building the page
  if (router.isFallback) {
    return <div>Loading…</div>; // or your LoadingGif
  }

  const getKeyword = () => {
    const list = [];
    const source = article || album;
    source?.postcards?.forEach((postcard) => {
      postcard?.tags?.forEach((tag) => list.push(tag.name));
    });
    if (source?.title) list.push(source.title);
    if (album?.name) list.push(album.name);
    return list.join(", ");
  };

  const getSeoValues = () => {
    const source = article || album;
    return {
      title: source ? source.title || album?.name : "Postcard Page",
      description:
        (source && (source.description || album?.description)) ||
        "Join an inclusive community...",
      url: `https://www.postcard.travel/postcard-pages/${
        album?.slug ?? article?.album?.slug
      }`,
      image: (source && source.image?.url) || "/assets/images/p_stamp.png",
      keywords: getKeyword(),
    };
  };

  return (
    <div>
      <SEOContainer seoData={getSeoValues()} />
      <StorytellerPages article={article} album={album} />
    </div>
  );
};

const populateAlbumFields = {
  populate: ["region", "country"],
};

export async function getStaticProps({ params }) {
  let article = null;
  let album = null;

  // if numeric id redirect to slug-based URL (keeps existing behavior)
  if (!isNaN(params.id)) {
    const albumData = await fetchPaginatedResults(
      apiNames.album,
      { id: Number(params.id) },
      {
        coverImage: { fields: ["url"] },
        country: true,
        region: true,
        postcards: {
          populate: {
            coverImage: { fields: ["url"] },
            tags: {
              fields: ["name"],
              populate: ["tag_group"],
            },
          },
        },
      }
    );

    // albumData might be array or object
    const normalizedAlbum = Array.isArray(albumData) ? albumData[0] : albumData;

    if (normalizedAlbum?.slug) {
      return {
        redirect: {
          destination: `/postcard-pages/${normalizedAlbum.slug}`,
          permanent: true,
        },
      };
    }
  } else {
    // 1) Try to fetch newsArticle by album slug (may return array)
    const result = await fetchPaginatedResults(
      apiNames.newsArticles,
      { album: { slug: params.id } },
      populateNewsArticles
    );

    if (Array.isArray(result)) {
      article = result.length ? result[0] : null;
    } else {
      article = result ?? null;
    }

    // 2) If no article found, fetch album details so we can render album page
    if (!article) {
      const populateAlbumFields = {
        populate: ["region", "country"],
      };
      const albumResult = await fetchPaginatedResults(
        apiNames.album,
        { slug: params.id },
        {
          coverImage: { fields: ["url"] },
          country: true,
          region: true,
          postcards: {
            populate: {
              coverImage: { fields: ["url"] },
              tags: {
                fields: ["name"],
                populate: ["tag_group"],
              },
            },
          },
        }
      );

      album = Array.isArray(albumResult) ? albumResult[0] : albumResult ?? null;
    } else {
      // article found — make sure album is available for SEO/slug
      album = article?.album ?? null;
    }
  }

  // If both are null you can return notFound or show a friendly page
  if (!article && !album) {
    return {
      notFound: true, // or return props: { article: null, album: null } to keep route
    };
  }

  return {
    props: {
      article,
      album,
    },
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  const albums = await fetchPaginatedResults(
    apiNames.album,
    { isFeatured: true, isActive: true },
    {
      coverImage: true,
      country: true,
      region: true,
      postcards: {
        populate: {
          coverImage: { fields: ["url"] },
          tags: {
            fields: ["name"],
            populate: ["tag_group"],
          },
        },
      },
    }
  );

  const paths = (albums || []).map((a) => `/postcard-pages/${a?.slug}`);

  return {
    paths,
    fallback: true, // or 'blocking' if you prefer Next to wait
  };
}

export default EditPostcardPage;
