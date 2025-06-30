// API Route สำหรับอัพเดทสถานะคำสั่งซื้อ
import { type NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/order-service"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!body.status) {
      return NextResponse.json({ success: false, error: "สถานะใหม่จำเป็นต้องระบุ" }, { status: 400 })
    }

    // ตรวจสอบสถานะที่ถูกต้อง
    const validStatuses = ["New", "In Process", "Completed"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: "สถานะไม่ถูกต้อง" }, { status: 400 })
    }

    const updatedOrder = await updateOrderStatus(id, body.status)

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "ไม่พบคำสั่งซื้อ" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "อัพเดทสถานะเรียบร้อยแล้ว",
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาดในการอัพเดทสถานะ" }, { status: 500 })
  }
}
