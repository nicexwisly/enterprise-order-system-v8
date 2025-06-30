// Component สำหรับฟอร์มสร้างคำสั่งซื้อ
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Send, Loader2 } from "lucide-react"
import { createOrder, type Order } from "@/lib/order-service"

interface OrderFormProps {
  onSuccess?: (order: Order) => void
  onCancel?: () => void
}

export function OrderForm({ onSuccess, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customer: "",
    department: "" as "Fish" | "Pork" | "",
    items: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
    submittedBy: "OCS Staff", // ในการใช้งานจริงจะได้จาก user session
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.customer.trim()) return "กรุณาระบุชื่อลูกค้า"
    if (!formData.department) return "กรุณาเลือกแผนก"
    if (!formData.items.trim()) return "กรุณาระบุรายการสินค้า"
    if (!formData.pickupDate) return "กรุณาระบุวันที่รับสินค้า"
    if (!formData.pickupTime) return "กรุณาระบุเวลารับสินค้า"

    // ตรวจสอบวันที่ไม่ให้เป็นอดีต
    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
    const now = new Date()
    if (pickupDateTime <= now) {
      return "วันที่และเวลารับสินค้าต้องเป็นอนาคต"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const newOrder = await createOrder({
        customer: formData.customer.trim(),
        department: formData.department as "Fish" | "Pork",
        items: formData.items.trim(),
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        notes: formData.notes.trim(),
        priority: formData.priority,
        submittedBy: formData.submittedBy,
      })

      setSuccess(true)

      // รีเซ็ตฟอร์ม
      setFormData({
        customer: "",
        department: "" as "Fish" | "Pork" | "",
        items: "",
        pickupDate: "",
        pickupTime: "",
        notes: "",
        priority: "normal",
        submittedBy: "OCS Staff",
      })

      if (onSuccess) {
        onSuccess(newOrder)
      }

      // ซ่อนข้อความสำเร็จหลัง 3 วินาที
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง")
      console.error("Error creating order:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    // บันทึกข้อมูลใน localStorage สำหรับ draft
    localStorage.setItem("orderDraft", JSON.stringify(formData))
    alert("บันทึกร่างเรียบร้อยแล้ว")
  }

  // โหลด draft จาก localStorage เมื่อ component mount
  useState(() => {
    const savedDraft = localStorage.getItem("orderDraft")
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setFormData((prev) => ({ ...prev, ...draftData }))
      } catch (err) {
        console.error("Error loading draft:", err)
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>สร้างคำสั่งซื้อใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        {/* แสดงข้อความแจ้งเตือน */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ส่งคำสั่งซื้อเรียบร้อยแล้ว! คำสั่งซื้อได้ถูกส่งไปยังแผนกที่เลือกแล้ว
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ข้อมูลลูกค้า */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-sm font-medium text-gray-700">
                ชื่อลูกค้า *
              </Label>
              <Input
                id="customer"
                type="text"
                required
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                placeholder="ระบุชื่อลูกค้า"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                แผนกปลายทาง *
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleInputChange("department", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแผนก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fish">แผนกปลา</SelectItem>
                  <SelectItem value="Pork">แผนกหมู</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* รายการสินค้า */}
          <div className="space-y-2">
            <Label htmlFor="items" className="text-sm font-medium text-gray-700">
              รายการสินค้า *
            </Label>
            <Textarea
              id="items"
              required
              value={formData.items}
              onChange={(e) => handleInputChange("items", e.target.value)}
              placeholder="ระบุรายการสินค้าและปริมาณ (เช่น ปลาแซลมอน 10 กก., ปลาทูน่า 5 กก.)"
              rows={4}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* ข้อมูลการรับสินค้า */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="text-sm font-medium text-gray-700">
                วันที่รับสินค้า *
              </Label>
              <Input
                id="pickupDate"
                type="date"
                required
                value={formData.pickupDate}
                onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                className="w-full"
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTime" className="text-sm font-medium text-gray-700">
                เวลารับสินค้า *
              </Label>
              <Input
                id="pickupTime"
                type="time"
                required
                value={formData.pickupTime}
                onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                ระดับความสำคัญ
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">ต่ำ</SelectItem>
                  <SelectItem value="normal">ปกติ</SelectItem>
                  <SelectItem value="high">สูง</SelectItem>
                  <SelectItem value="urgent">เร่งด่วน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* หมายเหตุเพิ่มเติม */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              หมายเหตุเพิ่มเติม
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="คำแนะนำพิเศษหรือข้อกำหนดเพิ่มเติม"
              rows={3}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* ปุ่มดำเนินการ */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button type="submit" className="flex-1 sm:flex-none" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  ส่งคำสั่งซื้อ
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none bg-transparent"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              บันทึกร่าง
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                className="flex-1 sm:flex-none"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
            )}
          </div>
        </form>

        {/* คำแนะนำการใช้งาน */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">คำแนะนำการกรอกข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• ช่องที่มีเครื่องหมาย (*) จำเป็นต้องกรอก</li>
              <li>• กรุณาระบุปริมาณและประเภทสินค้าให้ชัดเจน</li>
              <li>• วันที่รับสินค้าควรล่วงหน้าอย่างน้อย 24 ชั่วโมง</li>
              <li>• สำหรับคำสั่งซื้อเร่งด่วน กรุณาติดต่อแผนกโดยตรง</li>
              <li>• เวลาทำการ: 8:00 - 18:00 น.</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
