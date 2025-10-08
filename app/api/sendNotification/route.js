import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = await req.json();

    const { pushToken, title, subheading, QRInfo } = res;

    if (!pushToken && !title && !subheading && !QRInfo) {
      return NextResponse.json(
        { error: "Push token, title, subheading and QR Info are required" },
        { status: 400 }
      );
    }

    const notificationBody = {
      to: pushToken,
      sound: "default",
      title: title,
      body: subheading,
      data: { extraData: "Notification sent by School Admin", QRInfo: QRInfo },
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(notificationBody),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Notification sent!",
      result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
