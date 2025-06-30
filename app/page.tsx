"use client"
import Link from "next/link"
import React from "react"
import { Search, Plus, Filter, Download } from "lucide-react"
import { useState, useEffect } from "react"

// Mock data for demonstration
const mockOrders = [
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
  },
]

function getStatusBadge(status) {
  var className = ""
  var text = ""

  if (status === "New") {
    className = "legacy-badge-new"
    text = "ใหม่"
  } else if (status === "In Process") {
    className = "legacy-badge-process"
    text = "กำลังดำเนินการ"
  } else if (status === "Completed") {
    className = "legacy-badge-completed"
    text = "เสร็จสิ้น"
  } else {
    className = "legacy-badge-new"
    text = status
  }

  return React.createElement("span", { className: className }, text)
}

export default function Dashboard() {
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {
    var filtered = orders.slice() // สร้าง copy ของ array

    if (searchTerm) {
      filtered = filtered.filter((order) => {
        var customerMatch = order.customer.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        var idMatch = order.id.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        return customerMatch || idMatch
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter)
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((order) => order.department.toLowerCase() === departmentFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, departmentFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ระบบจัดการคำสั่งซื้อ</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-blue-600 font-medium">
                หน้าหลัก
              </Link>
              <Link href="/submit-order" className="text-gray-600 hover:text-gray-900">
                สร้างคำสั่งซื้อ
              </Link>
              <Link href="/fish-orders" className="text-gray-600 hover:text-gray-900">
                แผนกปลา
              </Link>
              <Link href="/pork-orders" className="text-gray-600 hover:text-gray-900">
                แผนกหมู
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">หน้าหลัก</h2>
          <p className="text-gray-600">ภาพรวมคำสั่งซื้อทั้งหมดจากทุกแผนก</p>
        </div>

        {/* Stats Cards */}
        <div className="legacy-grid mb-8">
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">คำสั่งซื้อทั้งหมด</div>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500">+2 จากเมื่อวาน</p>
          </div>
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">คำสั่งซื้อใหม่</div>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-gray-500">รอดำเนินการ</p>
          </div>
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">กำลังดำเนินการ</div>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-gray-500">กำลังเตรียม</p>
          </div>
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">เสร็จสิ้น</div>
            <div className="text-2xl font-bold text-green-600">4</div>
            <p className="text-xs text-gray-500">พร้อมรับ</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="legacy-card mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ค้นหาคำสั่งซื้อ..."
                    className="legacy-input pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <select
                  className="legacy-select"
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value)
                  }}
                >
                  <option value="all">ทุกแผนก</option>
                  <option value="fish">แผนกปลา</option>
                  <option value="pork">แผนกหมู</option>
                </select>
                <select
                  className="legacy-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                  }}
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="new">ใหม่</option>
                  <option value="in process">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="legacy-button">
                  <Filter className="h-4 w-4 mr-2" />
                  กรอง
                </button>
                <button className="legacy-button">
                  <Download className="h-4 w-4 mr-2" />
                  ส่งออก
                </button>
                <Link href="/submit-order">
                  <button className="legacy-button">
                    <Plus className="h-4 w-4 mr-2" />
                    คำสั่งซื้อใหม่
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="legacy-card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">คำสั่งซื้อล่าสุด</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="legacy-table">
              <thead>
                <tr>
                  <th>รหัสคำสั่งซื้อ</th>
                  <th>ลูกค้า</th>
                  <th>แผนก</th>
                  <th>รายการสินค้า</th>
                  <th>สถานะ</th>
                  <th>วันที่รับ</th>
                  <th>เวลารับ</th>
                  <th>ผู้ส่ง</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-blue-600">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={order.department === "Fish" ? "legacy-badge-new" : "legacy-badge-process"}>
                        {order.department === "Fish" ? "แผนกปลา" : "แผนกหมู"}
                      </span>
                    </td>
                    <td className="max-w-xs truncate" title={order.items}>
                      {order.items}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{order.pickupDate}</td>
                    <td>{order.pickupTime}</td>
                    <td className="text-gray-600">{order.submittedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
