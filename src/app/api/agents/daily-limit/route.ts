import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    const today = new Date();
    const startOfDay = new Date(today.toISOString().split("T")[0]);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyusage = await prisma.usage.count({
      where: {
        userId: userId,
        date: {
          gte: startOfDay,
          lt: new Date(startOfDay.getTime() + 86400000),
        },
      },
    });

    const monthlyusage = await prisma.usage.count({
      where: {
        userId: userId,
        date: {
          gte: startOfMonth,
          lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        },
      },
    });

    return NextResponse.json({
      date: today.toISOString().split("T")[0],
      dailyusage,
      monthlyusage,
    });
  } catch (error) {
    console.error("Error in usage route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
