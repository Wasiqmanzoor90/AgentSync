import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ error: "User ID missing" }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: {
                userId: userId,

            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json({ message: "Message fetched sucessfullt", data: messages, count: messages.length }, { status: 200 })

    } catch (error) {
        console.error("Error in usage route:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


//Get
export async function POST(request: NextRequest) {
    try {
        const { userId, content } = await request.json();
        if (!userId) {
            return NextResponse.json({ message: "UserId is missing" }, { status: 404 })
        }
        if (!content) {
            return NextResponse.json({ message: "content is missing" }, { status: 404 })
        }
        const message = await prisma.message.create({
            data: {
                userId,
                content
            }
        });
        return NextResponse.json({
            message: "Message created successfully",
            data: message
        }, { status: 201 });
    } catch (error) {
        console.error("Error in usage route:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}



//Delete
export async function DELETE(request: NextRequest) {
    try {
        const { messageId } = await request.json();
        if (!messageId) {
            return NextResponse.json({ message: "messageId is required" }, { status: 401 })
        }
        const existMessage = prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!existMessage) {
            return NextResponse.json({ message: "Message Doens't exist" }, { status: 400 })
        }
        const DeleteMessage = await prisma.message.delete({
            where: { id: messageId },
        });
        return NextResponse.json({ message: "Deleted Sucessfully!", DeleteMessage }, { status: 201 })
    } catch (error) {
        console.error("Error in usage route:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}