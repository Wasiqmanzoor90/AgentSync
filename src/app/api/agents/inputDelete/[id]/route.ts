import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = new PrismaClient();
  
  try {
    // In Next.js 15, params is a Promise - must await it
    const { id: messageId } = await params;
    
    if (!messageId) {
      return NextResponse.json({ message: "messageId is required" }, { status: 400 });
    }

    const existMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existMessage) {
      return NextResponse.json({ message: "Message Doesn't exist" }, { status: 404 });
    }

    const DeleteMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ message: "Deleted Successfully!", DeleteMessage }, { status: 200 });
    
  } catch (error) {
    console.error("Error in delete route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}