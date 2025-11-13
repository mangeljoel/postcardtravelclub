import strapi from "../../src/queries/strapi";
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  const FetchData = async (api) => {
    let pageNo = 1;
    let pageCount = 1;
    let data = [];
    try {
      do {
        const res = await strapi.find(api, {
          sort: "id",
          fields: ["slug"],
          pagination: {
            page: pageNo,
            pageSize: 100,
          },
        });
        if (res?.meta) {
          data.push(res.data);
          if (pageCount === 1) {
            pageCount = res.meta.pagination.pageCount;
          }
        }
        pageNo++;
      } while (pageNo <= pageCount);
      data = data.flat();
      return data;
    } catch (error) {
      return [];
    }
  };
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await res.revalidate("/");
    await res.revalidate("/our-story");
    // await res.revalidate("/tours");
    // await res.revalidate("/hotels");
    await res.revalidate("/storytellers");
    await res.revalidate("/experiences");
    await res.revalidate("/storyteller-application");

    const allTours = await FetchData("albums");
    allTours?.map(async (album) => {
      if (album.slug) res.revalidate("/" + album.slug);
    });
    const allUsers = await FetchData("users");
    allUsers?.map(async (user) => {
      if (user.slug) res.revalidate("/" + user.slug);
    });
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
