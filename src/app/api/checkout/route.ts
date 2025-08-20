import { polar } from "../../../../lib/polar";
import { NextResponse } from "next/server";



export async function POST() {
  try {
    const checkout = await polar.checkouts.create({
  products: ["ec7e89bb-e449-4cb6-813b-1ec78a797ed0"], // array of strings
  successUrl: "http://localhost:3000/success",
});
    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Polar checkout creation failed:", error);
    return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
  }
}

