import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    // Auto-create guest user if not found
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: "Guest User",
          email: `${userId}@guest.local`,
          password: "guest-password", // placeholder to satisfy schema
        },
      });
    }

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        message: "Messages fetched successfully",
        data: messages,
        count: messages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/agents/inputData:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, content } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "UserId is missing" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ message: "Content is missing" }, { status: 400 });
    }

    // Auto-create guest user if not found
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: "Guest User",
          email: `${userId}@guest.local`,
          password: "guest-password",
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        userId,
        content,
      },
    });

    return NextResponse.json(
      { message: "Message created successfully", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/agents/inputData:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({ message: "messageId is required" }, { status: 400 });
    }

    const existMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existMessage) {
      return NextResponse.json({ message: "Message doesn't exist" }, { status: 404 });
    }

    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json(
      { message: "Deleted successfully!", data: deletedMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/agents/inputData:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
