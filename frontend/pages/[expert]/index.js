/* eslint-disable prettier/prettier */
import { useRouter } from "next/router";
import TravelExplore from "../../src/features/TravelExplore";
import MyCollections from "../../src/features/MyCollections";
import SEOContainer from "../../src/features/SEOContainer";

import {
  getStartupDetail,
  getExpertsWithUserlink,
  fetchPaginatedResults,
} from "../../src/queries/strapiQueries";
import TravelExpertsDetail from "../../src/features/TravelExpertsDetail";
import strapi from "../../src/queries/strapi";
import RestrictToRead from "../../src/patterns/RestrictToRead";
import ProfilePage from "../../src/features/ProfilePage";

const StoryTellersDetailPage = ({ post }) => {
  const router = useRouter();
  const pid = router.query["expert"];
  global.$isTravelExpertsDetailPage = true;

  const getTourKeyword = () => {
    const list = []
    post?.postcards?.map((postcard) => {
      postcard?.tags?.map((tag) => {
        list.push(tag.name)
      })
    })
    post?.name && list.push(post?.name)
    post?.company?.name && list.push(post?.company?.name)
    return list.join(", ")
  }
  const getSeoValues = () => {
    let seoData = {};
    if (post.type === "profile") {
      // seoData = {
      //   title: post?.seo?.metaTitle ? post?.seo?.metaTitle : post?.fullName,
      //   description: post?.seo?.metaDescription
      //     ? post?.seo?.metaDescription
      //     : post?.bio
      //     ? post?.bio
      //     : "Postcard stories",
      //   url: "https://www.postcard.travel/" + post.slug,
      //   image: post?.seo?.metaImage
      //     ? post?.seo?.metaImage?.url
      //     : post.profilePic?.url || "/assets/images/p_stamp.png",
      // };
      seoData = {
        title: post?.fullName
          ? post?.fullName + "'s Postcard Travel Diary"
          : "Postcard Travel Diary",
        description: post?.bio
          ? post?.bio
          : "Explore my diary of Postcard stories from around the world",
        url: "https://www.postcard.travel/" + post?.slug,
        image: post?.profilePic
          ? post?.profilePic?.url
          : "/assets/images/p_stamp.png",
        keywords: "Postcard member, Conscious Luxury traveller"
      };
    } else if (post.type === "tour") {
      seoData = {
        title: post?.seo?.metaTitle ? post?.seo?.metaTitle : post.name,
        description: post?.seo?.metaDescription
          ? post?.seo?.metaDescription
          : post.intro,
        url: "https://www.postcard.travel/" + post.slug,
        image: post?.seo?.metaImage
          ? post?.seo?.metaImage?.url
          : post.coverImage?.url || "/assets/images/p_stamp.png",
        keywords: getTourKeyword(),
      };
    }
    return seoData;
  };
  if (!post && !pid) {
    return <></>;
  } else
    return (
      <>
        <SEOContainer seoData={getSeoValues()} />
        {
          post.type === "profile" &&


          <MyCollections expert={post} />

          // <AllTours type="affiliations" post={post} />
        }
        {post?.type === "tour" && <TravelExplore slug={pid}></TravelExplore>}
      </>
    );
};

export async function getStaticProps({ params, preview = null }) {
  let data = null;
  try {
    data = await getStartupDetail(params.expert);
    if (!data || data?.length === 0) {
      return {
        redirect: {
          destination: '/',
          permanent: false, // Use `false` for temporary redirect, `true` for permanent
        },
      };
    }
  } catch (err) {
    // console.log(err);
  }
  return {
    props: {
      preview,
      post: {
        ...data[0],
      },
      revalidate: 300,
    },
  };
}

export async function getStaticPaths() {
  // const allPosts = await getExpertsWithUserlink();
  // let pageNo = 1;
  // let pageCount = 1;
  let data = [];
  const response = await fetchPaginatedResults("albums", {
    slug: { $notNull: true },
    directories: {
      slug: { $in: ["mindful-luxury-tours"] }
    }
  }, undefined, "id");
  data = Array.isArray(response) ? response : [response];

  let expertData = [];
  const res = await fetchPaginatedResults("users",
    { slug: { $notNull: true, user_type: { slug: { $not: 'hotels' } } } }, undefined, "id");
  expertData = Array.isArray(res) ? res : [res];

  // data = data.flat();
  // expertData = expertData.flat();

  let pathData = data.concat(expertData);
  const paths = pathData?.map((page) => ({
    params: { expert: page.slug.toString() },
  }));

  return { paths, fallback: true };
}

export default StoryTellersDetailPage;
