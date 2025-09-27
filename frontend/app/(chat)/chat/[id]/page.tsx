import { CoreMessage } from "ai";

// Remove auth import
// import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
// Replace database query with utils function
// import { getChatById } from "@/db/queries";
import { getChatById, convertToUIMessages } from "@/lib/utils";
// Remove database schema import
// import { Chat } from "@/db/schema";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  // Get chat from localStorage instead of database
  const chatFromDb = getChatById(id);

  const initialMessages = chatFromDb
    ? convertToUIMessages(chatFromDb.messages as Array<CoreMessage>)
    : [];

  return <PreviewChat id={id} initialMessages={initialMessages} />;
}
