import ChatWithPDFClient from "./chat-with-pdf-client";

export const metadata = {
  title: "Chat with PDF Example",
  description:
    "Upload a PDF document to chat with it and get instant answers powered by Supavec RAG.",
  alternates: {
    canonical: "/examples/chat-with-pdf",
  },
};

export default function ChatWithPDFExample() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat with PDF Example</h1>
        <p className="text-muted-foreground">
          Upload a PDF document to chat with it and get instant answers powered
          by Supavec RAG.
        </p>
      </div>

      <ChatWithPDFClient />
    </div>
  );
}
