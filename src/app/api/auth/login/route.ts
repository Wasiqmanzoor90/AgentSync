import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: "Method not allowed" }, { status: 401 });
  }

  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ message: "All credentials required" }, { status: 400 })
  }

  try {
    const existuser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existuser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 })
    }

    const pass = await bcrypt.compare(password, existuser.password)
    if (!pass) {
      return NextResponse.json({ message: "Email or Password is incorrect" }, { status: 400 })
    }
    const token = Jwt.sign(
      
      { userId: existuser.id, email: existuser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "5h" }
     
    );
    return NextResponse.json({ token, existuser: { id: existuser.id, email: existuser.email, name: existuser.name } })

    
  } catch (error) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}