import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";



export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is missing", data: null },
        { status: 401 }
      );
    }

    //  Verify JWT using secret from .env
    const verify = Jwt.verify(token,  process.env.JWT_SECRET!);

    return NextResponse.json(
      { message: "Token is valid", data: verify },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token", data: null },
      { status: 403 }
    );
  }
}
