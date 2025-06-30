"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Send } from "lucide-react"

export default function SubmitOrder() {
  const [formData, setFormData] = useState({
    customer: "",
    department: "",
    items: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
    priority: "normal",
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleInputChange(field, value) {
    var newFormData = Object.assign({}, formData)
    newFormData[field] = value
    setFormData(newFormData)
    setShowError("")
  }

  function validateForm() {
    if (!formData.customer.trim()) return "กรุณาระบุชื่อลูกค้า"
    if (!formData.department) return "กรุณาเลือกแผนก"
    if (!formData.items.trim()) return "กรุณาระบุรายการสินค้า"
    if (!formData.pickupDate) return "กรุณาระบุวันที่รับสินค้า"
    if (!formData.pickupTime) return "กรุณาระบุเวลารับสินค้า"

    // ตรวจสอบวันที่ไม่ให้เป็นอดีต
    var pickupDateTime = new Date(formData.pickupDate + "T" + formData.pickupTime)
    var now = new Date()
    if (pickupDateTime <= now) {
      return "วันที่และเวลารับสินค้าต้องเป็นอนาคต"
    }

    return null
  }

  function handleSubmit(e) {
    e.preventDefault()

    var validationError = validateForm()
    if (validationError) {
      setShowError(validationError)
      return
    }

    setIsSubmitting(true)
    setShowError("")

    // จำลองการส่งข้อมูล
    setTimeout(() => {
      setShowSuccess(true)
      setIsSubmitting(false)

      // รีเซ็ตฟอร์ม
      setFormData({
        customer: "",
        department: "",
        items: "",
        pickupDate: "",
        pickupTime: "",
        notes: "",
        priority: "normal",
      })

      // ซ่อนข้อความสำเร็จหลัง 5 วินาที
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }, 1000)
  }

  function handleSaveDraft() {
    try {
      localStorage.setItem("orderDraft", JSON.stringify(formData))
      alert("บันทึกร่างเรียบร้อยแล้ว")
    } catch (err) {
      alert("ไม่สามารถบันทึกร่างได้")
    }
  }

  // โหลด draft จาก localStorage
  useState(() => {
    try {
      var savedDraft = localStorage.getItem("orderDraft")
      if (savedDraft) {
        var draftData = JSON.parse(savedDraft)
        setFormData((prev) => Object.assign({}, prev, draftData))
      }
    } catch (err) {
      console.error("Error loading draft:", err)
    }
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
              <Link href="/submit-order" className="text-blue-600 font-medium">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <button className="legacy-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับหน้าหลัก
              </button>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">สร้างคำสั่งซื้อใหม่</h2>
          <p className="text-gray-600">สร้างคำขอสินค้าใหม่สำหรับแผนกปลาหรือแผนกหมู</p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800">ส่งคำสั่งซื้อเรียบร้อยแล้ว! คำสั่งซื้อได้ถูกส่งไปยังแผนกที่เลือกแล้ว</div>
          </div>
        )}

        {/* Error Alert */}
        {showError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">{showError}</div>
          </div>
        )}

        {/* Order Form */}
        <div className="legacy-card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">รายละเอียดคำสั่งซื้อ</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Customer Information */}
              <div className="legacy-grid mb-6">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อลูกค้า *
                  </label>
                  <input
                    id="customer"
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => {
                      handleInputChange("customer", e.target.value)
                    }}
                    placeholder="ระบุชื่อลูกค้า"
                    className="legacy-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    แผนกปลายทาง *
                  </label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => {
                      handleInputChange("department", e.target.value)
                    }}
                    className="legacy-select"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    <option value="Fish">แผนกปลา</option>
                    <option value="Pork">แผนกหมู</option>
                  </select>
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-2">
                  รายการสินค้า *
                </label>
                <textarea
                  id="items"
                  required
                  value={formData.items}
                  onChange={(e) => {
                    handleInputChange("items", e.target.value)
                  }}
                  placeholder="ระบุรายการสินค้าและปริมาณ (เช่น ปลาแซลมอน 10 กก., ปลาทูน่า 5 กก.)"
                  rows={4}
                  className="legacy-input"
                  disabled={isSubmitting}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </div>

              {/* Pickup Information */}
              <div className="legacy-grid mb-6">
                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                    วันที่รับสินค้า *
                  </label>
                  <input
                    id="pickupDate"
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => {
                      handleInputChange("pickupDate", e.target.value)
                    }}
                    className="legacy-input"
                    disabled={isSubmitting}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                    เวลารับสินค้า *
                  </label>
                  <input
                    id="pickupTime"
                    type="time"
                    required
                    value={formData.pickupTime}
                    onChange={(e) => {
                      handleInputChange("pickupTime", e.target.value)
                    }}
                    className="legacy-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    ระดับความสำคัญ
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => {
                      handleInputChange("priority", e.target.value)
                    }}
                    className="legacy-select"
                    disabled={isSubmitting}
                  >
                    <option value="low">ต่ำ</option>
                    <option value="normal">ปกติ</option>
                    <option value="high">สูง</option>
                    <option value="urgent">เร่งด่วน</option>
                  </select>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเหตุเพิ่มเติม
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => {
                    handleInputChange("notes", e.target.value)
                  }}
                  placeholder="คำแนะนำพิเศษหรือข้อกำหนดเพิ่มเติม"
                  rows={3}
                  className="legacy-input"
                  disabled={isSubmitting}
                  style={{ resize: "vertical", minHeight: "80px" }}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button type="submit" className="legacy-button flex-1 sm:flex-none" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "กำลังส่ง..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      ส่งคำสั่งซื้อ
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="legacy-button flex-1 sm:flex-none"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  style={{ background: "white", color: "#374151", border: "1px solid #d1d5db" }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกร่าง
                </button>

                <Link href="/" className="flex-1 sm:flex-none">
                  <button
                    type="button"
                    className="w-full legacy-button"
                    style={{ background: "transparent", color: "#6b7280", border: "none" }}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Form Guidelines */}
        <div className="legacy-card mt-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">คำแนะนำการกรอกข้อมูล</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• ช่องที่มีเครื่องหมาย (*) จำเป็นต้องกรอก</li>
              <li>• กรุณาระบุปริมาณและประเภทสินค้าให้ชัดเจน</li>
              <li>• วันที่รับสินค้าควรล่วงหน้าอย่างน้อย 24 ชั่วโมง</li>
              <li>• สำหรับคำสั่งซื้อเร่งด่วน กรุณาติดต่อแผนกโดยตรง</li>
              <li>• เวลาทำการ: 8:00 - 18:00 น.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
