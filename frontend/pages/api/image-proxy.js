export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing image URL" });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch image" });
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS
        res.status(200).send(Buffer.from(buffer));
    } catch (error) {
        console.error("Image proxy error:", error);
        res.status(500).json({ error: "Image proxy error" });
    }
}
