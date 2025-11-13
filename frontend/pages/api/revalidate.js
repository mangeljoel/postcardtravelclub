
export default async function handler(req, res) {
    const { slug, secret } = req.query;

    // Security check (optional but recommended)
    // if (secret !== process.env.REVALIDATE_SECRET) {
    //     return res.status(401).json({ message: 'Invalid secret' });
    // }

    if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
    }

    try {
        // Revalidate the specific page
        await res.revalidate(`/destination-experts/${slug}`);
        return res.json({ revalidated: true });
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error revalidating');
    }
}
