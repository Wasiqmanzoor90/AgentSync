import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export  async function POST(req: NextRequest)
{
if (req.method !== "POST")
{
 return NextResponse.json({ error: "Method not allowed" }, { status: 401 });
}
const body = await req.json();
const{name, email, password} = body;
if(!name || !email || !password)
{
    return NextResponse.json({error:"All credentials required"}, { status: 400 })
}
try {
    const existuser = await prisma.user.findUnique({
        where: {email},
    });
    if(existuser)
    {
        return NextResponse.json({error:"User Already exist"}, { status: 400 })
    }
const hashPass = await bcrypt.hash(password, 10);


    const newUser = await prisma.user.create({
        data:{name,email,password : hashPass},
    });
    
    return NextResponse.json({ message: "User created", user: newUser });
} catch (error) {
    
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
} 