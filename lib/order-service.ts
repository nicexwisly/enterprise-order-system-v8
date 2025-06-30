// Service สำหรับจัดการข้อมูลคำสั่งซื้อ
export interface Order {
  id: string
  customer: string
  department: "Fish" | "Pork"
  items: string
  status: "New" | "In Process" | "Completed"
  pickupDate: string
  pickupTime: string
  submittedBy: string
  submittedAt: string
  notes?: string
  priority?: "low" | "normal" | "high" | "urgent"
}

// Mock database - ในการใช้งานจริงจะเชื่อมต่อกับ database
const ordersDatabase: Order[] = [
  {
    id: "ORD-001",
    customer: "Restaurant ABC",
    department: "Fish",
    items: "Salmon 10kg, Tuna 5kg",
    status: "New",
    pickupDate: "2024-01-15",
    pickupTime: "10:00",
    submittedBy: "John Doe",
    submittedAt: "2024-01-10 09:30",
    notes: "Fresh fish required, premium quality",
    priority: "high",
  },
  {
    id: "ORD-002",
    customer: "Hotel XYZ",
    department: "Pork",
    items: "Pork Belly 15kg, Ribs 8kg",
    status: "In Process",
    pickupDate: "2024-01-16",
    pickupTime: "14:00",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-10 11:15",
    notes: "Premium cuts required for special event",
    priority: "normal",
  },
  {
    id: "ORD-003",
    customer: "Catering Co",
    department: "Fish",
    items: "Cod 12kg, Shrimp 3kg",
    status: "Completed",
    pickupDate: "2024-01-14",
    pickupTime: "08:00",
    submittedBy: "Mike Johnson",
    submittedAt: "2024-01-09 16:45",
    notes: "For wedding event",
    priority: "normal",
  },
]

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อทั้งหมด
export async function getAllOrders(): Promise<Order[]> {
  // จำลองการเรียก API
  await new Promise((resolve) => setTimeout(resolve, 100))
  return [...ordersDatabase]
}

// ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อตาม department
export async function getOrdersByDepartment(department: "Fish" | "Pork"): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return ordersDatabase.filter((order) => order.department === department)
}

// ฟังก์ชันสำหรับสร้างคำสั่งซื้อใหม่
export async function createOrder(orderData: Omit<Order, "id" | "submittedAt" | "status">): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newOrder: Order = {
    ...orderData,
    id: `ORD-${String(ordersDatabase.length + 1).padStart(3, "0")}`,
    status: "New",
    submittedAt: new Date().toLocaleString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }

  ordersDatabase.push(newOrder)
  return newOrder
}

// ฟังก์ชันสำหรับอัพเดทสถานะคำสั่งซื้อ
export async function updateOrderStatus(orderId: string, newStatus: Order["status"]): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  const orderIndex = ordersDatabase.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return null

  ordersDatabase[orderIndex].status = newStatus
  return ordersDatabase[orderIndex]
}

// ฟังก์ชันสำหรับดึงข้อมูลสถิติ
export async function getOrderStats() {
  await new Promise((resolve) => setTimeout(resolve, 50))

  const stats = {
    total: ordersDatabase.length,
    new: ordersDatabase.filter((order) => order.status === "New").length,
    inProcess: ordersDatabase.filter((order) => order.status === "In Process").length,
    completed: ordersDatabase.filter((order) => order.status === "Completed").length,
    fish: ordersDatabase.filter((order) => order.department === "Fish").length,
    pork: ordersDatabase.filter((order) => order.department === "Pork").length,
  }

  return stats
}

// ฟังก์ชันสำหรับค้นหาคำสั่งซื้อ
export async function searchOrders(searchTerm: string): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const term = searchTerm.toLowerCase()
  return ordersDatabase.filter(
    (order) =>
      order.customer.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term) ||
      order.items.toLowerCase().includes(term),
  )
}

// ฟังก์ชันสำหรับกรองคำสั่งซื้อ
export async function filterOrders(filters: {
  department?: "Fish" | "Pork" | "all"
  status?: "New" | "In Process" | "Completed" | "all"
  priority?: "low" | "normal" | "high" | "urgent" | "all"
}): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  let filtered = [...ordersDatabase]

  if (filters.department && filters.department !== "all") {
    filtered = filtered.filter((order) => order.department === filters.department)
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((order) => order.status === filters.status)
  }

  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter((order) => order.priority === filters.priority)
  }

  return filtered
}

// ฟังก์ชันสำหรับ export ข้อมูล
export async function exportOrdersToCSV(orders: Order[]): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const headers = [
    "Order ID",
    "Customer",
    "Department",
    "Items",
    "Status",
    "Pickup Date",
    "Pickup Time",
    "Submitted By",
    "Notes",
  ]
  const csvContent = [
    headers.join(","),
    ...orders.map((order) =>
      [
        order.id,
        `"${order.customer}"`,
        order.department,
        `"${order.items}"`,
        order.status,
        order.pickupDate,
        order.pickupTime,
        `"${order.submittedBy}"`,
        `"${order.notes || ""}"`,
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}
