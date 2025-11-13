import React, { useState, useCallback } from "react";
import { H1, H2, Paragraph, Bold, Italic } from "tiptap-extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
    Button,
    Flex,
    Spacer,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@chakra-ui/react";
import "./drafteditor.scss";
const DraftEditor = ({ initialContent, onContentChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true
            })
        ],
        content: "<p>Hello, world!</p>" // Initial content
    });
    const handleImageUpload = () => {
        // Simulated image upload
        setImageUrl("https://via.placeholder.com/150");
        setIsModalOpen(false);
    };
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    }, [editor]);

    const handleHeading = (level) => {
        if (editor) {
            switch (level) {
                case 1:
                    editor.chain().focus().setHeading({ level: 1 }).run();
                    break;
                case 2:
                    editor.chain().focus().setHeading({ level: 2 }).run();
                    break;
                default:
                    break;
            }
        }
    };

    const handleInsertParagraph = () => {
        editor.chain().focus().setParagraph().run();
    };

    const handleBold = () => {
        editor.chain().focus().toggleBold().run();
    };

    const handleItalic = () => {
        editor.chain().focus().toggleItalic().run();
    };

    return (
        <div className="App">
            <Flex alignItems="center" marginBottom="1rem">
                <Button onClick={() => setIsModalOpen(true)}>
                    Upload Image
                </Button>
                <Spacer />
                <Button onClick={() => handleHeading(1)}>H1</Button>
                <Button onClick={() => handleHeading(2)}>H2</Button>
                <Button onClick={handleInsertParagraph}>P</Button>
                <Button onClick={handleBold}>Bold</Button>
                <Button onClick={handleItalic}>Italic</Button>
                <Button onClick={setLink}>Insert Link</Button>
            </Flex>
            {editor && <EditorContent editor={editor} />}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Image</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleImageUpload}>Upload</Button>
                        <Button onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default DraftEditor;
