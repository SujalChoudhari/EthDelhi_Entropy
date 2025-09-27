// import { auth } from "@/app/(auth)/auth";
// import { getChatsByUserId } from "@/db/queries";
import { getChats } from "@/lib/utils";

export async function GET() {
  // Remove authentication check
  // const session = await auth();
  // if (!session || !session.user) {
  //   return Response.json("Unauthorized!", { status: 401 });
  // }

  // Get chats from localStorage instead of database
  const chats = getChats();
  return Response.json(chats);
}
