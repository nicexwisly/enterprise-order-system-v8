// API Route สำหรับจัดการคำสั่งซื้อ (สำหรับการใช้งานจริง)
import { type NextRequest, NextResponse } from "next/server"
import { getAllOrders, createOrder } from "@/lib/order-service"

// GET - ดึงข้อมูลคำสั่งซื้อทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department") as "Fish" | "Pork" | null

    const orders = await getAllOrders()

    // กรองตาม department ถ้ามีการระบุ
    const filteredOrders = department ? orders.filter((order) => order.department === department) : orders

    return NextResponse.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 })
  }
}

// POST - สร้างคำสั่งซื้อใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = ["customer", "department", "items", "pickupDate", "pickupTime", "submittedBy"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `ข้อมูล ${field} จำเป็นต้องระบุ` }, { status: 400 })
      }
    }

    // ตรวจสอบ department ที่ถูกต้อง
    if (!["Fish", "Pork"].includes(body.department)) {
      return NextResponse.json({ success: false, error: "แผนกไม่ถูกต้อง" }, { status: 400 })
    }

    const newOrder = await createOrder({
      customer: body.customer,
      department: body.department,
      items: body.items,
      pickupDate: body.pickupDate,
      pickupTime: body.pickupTime,
      notes: body.notes || "",
      priority: body.priority || "normal",
      submittedBy: body.submittedBy,
    })

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: "สร้างคำสั่งซื้อเรียบร้อยแล้ว",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ" }, { status: 500 })
  }
}
