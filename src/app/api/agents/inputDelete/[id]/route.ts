import { PrismaClient } from "@prisma/client";
import { Params } from "next/dist/server/request/params";
import { NextRequest, NextResponse } from "next/server";

//Delete
export async function DELETE(request: NextRequest, { params }: { params: Params })
 {
    
    const prisma = new PrismaClient();
    try {
         const messageId =  params.id as string;
       
        if (!messageId) {
            return NextResponse.json({ message: "messageId is required" }, { status: 401 })
        }
        const existMessage = await prisma.message.findUnique({
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