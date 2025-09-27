import { redirect } from "next/navigation";

import { generateUUID } from "@/lib/utils";

export default function ChatPage() {
  const id = generateUUID();
  redirect(`/chat/${id}`);
}
