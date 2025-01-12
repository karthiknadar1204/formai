import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chat-service";
import { createLogger } from "@/lib/logger";

const logger = createLogger("chat-api");
const chatService = new ChatService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, message } = body;

    if (!formId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await chatService.queryFormResponses(formId, message);
    return NextResponse.json({ response });

  } catch (error) {
    logger.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

