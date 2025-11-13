import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const RenderMarkdown = ({ content,color }) => {
    return (
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
                p: ({ node, ...props }) => (
                    <p style={{ color: color }} {...props} />
                ),
            }}>
            {content}
        </Markdown>
    );
};
export default RenderMarkdown;
