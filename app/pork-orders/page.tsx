"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"

// Mock data for Pork department orders
const porkOrders = [
  {
    id: "ORD-002",
    customer: "Hotel XYZ",
    items: "Pork Belly 15kg, Ribs 8kg",
    status: "In Process",
    pickupDate: "2024-01-16",
    pickupTime: "14:00",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-10 11:15",
    notes: "Premium cuts required for special event",
  },
  {
    id: "ORD-004",
    customer: "BBQ Restaurant",
    items: "Pork Shoulder 20kg, Bacon 5kg",
    status: "New",
    pickupDate: "2024-01-17",
    pickupTime: "09:00",
    submittedBy: "Tom Brown",
    submittedAt: "2024-01-11 08:30",
    notes: "Regular weekly order",
  },
  {
    id: "ORD-006",
    customer: "Deli Market",
    items: "Ham 8kg, Sausages 12kg",
    status: "Completed",
    pickupDate: "2024-01-13",
    pickupTime: "11:00",
    submittedBy: "Lisa Davis",
    submittedAt: "2024-01-08 15:45",
    notes: "Sliced ham preferred",
  },
]

function getStatusBadge(status) {
  var className = ""
  var text = ""
  var icon = null

  if (status === "New") {
    className = "legacy-badge-new"
    text = "ใหม่"
    icon = React.createElement(AlertCircle, { className: "h-3 w-3 mr-1" })
  } else if (status === "In Process") {
    className = "legacy-badge-process"
    text = "กำลังดำเนินการ"
    icon = React.createElement(Clock, { className: "h-3 w-3 mr-1" })
  } else if (status === "Completed") {
    className = "legacy-badge-completed"
    text = "เสร็จสิ้น"
    icon = React.createElement(CheckCircle, { className: "h-3 w-3 mr-1" })
  } else {
    className = "legacy-badge-new"
    text = status
  }

  return React.createElement("span", { className: className }, icon, text)
}

export default function PorkOrders() {
  const [orders, setOrders] = useState(porkOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  function handleStatusChange(orderId, newStatus) {
    setPendingStatusChange({ orderId: orderId, newStatus: newStatus })
    setShowConfirmDialog(true)
  }

  function confirmStatusChange() {
    if (pendingStatusChange) {
      // อัพเดทสถานะในข้อมูล
      var updatedOrders = orders.map((order) => {
        if (order.id === pendingStatusChange.orderId) {
          var updatedOrder = Object.assign({}, order)
          updatedOrder.status = pendingStatusChange.newStatus
          return updatedOrder
        }
        return order
      })

      setOrders(updatedOrders)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
    setShowConfirmDialog(false)
    setPendingStatusChange(null)
  }

  function getNextStatus(currentStatus) {
    if (currentStatus === "New") return "In Process"
    if (currentStatus === "In Process") return "Completed"
    return null
  }

  function showOrderDetails(order) {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // กรองข้อมูล
  var filteredOrders = orders.filter((order) => {
    var matchesSearch = true
    var matchesStatus = true

    if (searchTerm) {
      matchesSearch =
        order.customer.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        order.id.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    }

    if (statusFilter !== "all") {
      matchesStatus = order.status.toLowerCase() === statusFilter
    }

    return matchesSearch && matchesStatus
  })

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
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                หน้าหลัก
              </Link>
              <Link href="/submit-order" className="text-gray-600 hover:text-gray-900">
                สร้างคำสั่งซื้อ
              </Link>
              <Link href="/fish-orders" className="text-gray-600 hover:text-gray-900">
                แผนกปลา
              </Link>
              <Link href="/pork-orders" className="text-blue-600 font-medium">
                แผนกหมู
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600 font-semibold text-sm">🥓</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">คำสั่งซื้อแผนกหมู</h2>
              <p className="text-gray-600">จัดการและติดตามคำสั่งซื้อสินค้าหมู</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <div className="text-green-800">อัพเดทสถานะเรียบร้อยแล้ว!</div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="legacy-grid mb-8">
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">คำสั่งซื้อใหม่</div>
            <div className="text-2xl font-bold text-blue-600">1</div>
            <p className="text-xs text-gray-500">รอดำเนินการ</p>
          </div>
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">กำลังดำเนินการ</div>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-xs text-gray-500">กำลังเตรียม</p>
          </div>
          <div className="legacy-card p-4">
            <div className="text-sm font-medium text-gray-600 mb-2">เสร็จสิ้นวันนี้</div>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-gray-500">พร้อมรับ</p>
          </div>
        </div>

        {/* Filters */}
        <div className="legacy-card mb-6">
          <div className="p-4 border-b border-gray-200">
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
              <button className="legacy-button">
                <Filter className="h-4 w-4 mr-2" />
                กรองเพิ่มเติม
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="legacy-card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">คำสั่งซื้อแผนกหมู</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="legacy-table">
              <thead>
                <tr>
                  <th>รหัสคำสั่งซื้อ</th>
                  <th>ลูกค้า</th>
                  <th>รายการสินค้า</th>
                  <th>สถานะ</th>
                  <th>วันที่รับ</th>
                  <th>เวลารับ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  var nextStatus = getNextStatus(order.status)

                  return (
                    <tr key={order.id}>
                      <td className="font-medium text-blue-600">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="max-w-xs truncate" title={order.items}>
                        {order.items}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{order.pickupDate}</td>
                      <td>{order.pickupTime}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="legacy-button"
                            onClick={() => {
                              showOrderDetails(order)
                            }}
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {nextStatus && (
                            <button
                              className="legacy-button"
                              onClick={() => {
                                handleStatusChange(order.id, nextStatus)
                              }}
                              style={{ padding: "4px 8px", fontSize: "12px", background: "#ec4899" }}
                            >
                              เปลี่ยนเป็น {nextStatus === "In Process" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">รายละเอียดคำสั่งซื้อ - {selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">ข้อมูลคำสั่งซื้อและการจัดการสถานะ</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="legacy-grid">
                  <div>
                    <div className="text-sm font-medium text-gray-600">ลูกค้า</div>
                    <p className="text-sm">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">สถานะ</div>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">รายการสินค้า</div>
                  <p className="text-sm">{selectedOrder.items}</p>
                </div>
                <div className="legacy-grid">
                  <div>
                    <div className="text-sm font-medium text-gray-600">วันที่รับ</div>
                    <p className="text-sm">{selectedOrder.pickupDate}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">เวลารับ</div>
                    <p className="text-sm">{selectedOrder.pickupTime}</p>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">หมายเหตุ</div>
                  <p className="text-sm">{selectedOrder.notes || "ไม่มีหมายเหตุเพิ่มเติม"}</p>
                </div>
                <div className="legacy-grid">
                  <div>
                    <div className="text-sm font-medium text-gray-600">ผู้ส่ง</div>
                    <p className="text-sm">{selectedOrder.submittedBy}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">เวลาส่ง</div>
                    <p className="text-sm">{selectedOrder.submittedAt}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  className="legacy-button"
                  onClick={() => {
                    setShowModal(false)
                  }}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">ยืนยันการเปลี่ยนสถานะ</h3>
                <p className="text-sm text-gray-600">
                  คุณต้องการเปลี่ยนสถานะของคำสั่งซื้อ {pendingStatusChange && pendingStatusChange.orderId} เป็น "
                  {pendingStatusChange && pendingStatusChange.newStatus === "In Process" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}"
                  หรือไม่?
                </p>
              </div>
              <div className="p-4 flex justify-end gap-2">
                <button
                  className="legacy-button"
                  onClick={() => {
                    setShowConfirmDialog(false)
                  }}
                  style={{ background: "white", color: "#374151", border: "1px solid #d1d5db" }}
                >
                  ยกเลิก
                </button>
                <button className="legacy-button" onClick={confirmStatusChange}>
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
