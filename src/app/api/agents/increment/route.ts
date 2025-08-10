import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    const now = new Date();
    const startOfDay = new Date(now.toISOString().split('T')[0]);

    // ✅ Ensure the user exists — create guest if missing
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          name: 'Guest User',
            email: `${userId}@guest.local`,
    password: 'guest-password', // dummy value, won't be used for login
        },
      });
    }

    // Check today's usage
    const dailyUsage = await prisma.usage.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: new Date(startOfDay.getTime() + 86400000),
        },
      },
    });

    if (dailyUsage >= 10) {
      return NextResponse.json(
        { error: 'Daily usage limit of 10 reached' },
        { status: 429 }
      );
    }

    // Increment usage
    await prisma.usage.create({
      data: {
        userId,
        date: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Usage incremented',
      date: now.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    return NextResponse.json(
      { error: 'Failed to increment usage' },
      { status: 500 }
    );
  }
}
