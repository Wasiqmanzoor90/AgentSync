import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Delete
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = new PrismaClient();
  
  try {
    const { id: messageId } = await params;
    
    if (!messageId) {
      return NextResponse.json(
        { message: "messageId is required" }, 
        { status: 400 }
      );
    }

    const existMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existMessage) {
      return NextResponse.json(
        { message: "Message doesn't exist" }, 
        { status: 404 }
      );
    }

    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json(
      { 
        message: "Deleted successfully!", 
        deletedMessage 
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in delete route:", error);
    return NextResponse.json(
      { error: "Server error" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}