// Component สำหรับจัดการสถานะคำสั่งซื้อ
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import type { Order } from "@/lib/order-service"

interface OrderStatusManagerProps {
  order: Order
  onStatusUpdate: (orderId: string, newStatus: Order["status"]) => Promise<boolean>
  disabled?: boolean
}

export function OrderStatusManager({ order, onStatusUpdate, disabled = false }: OrderStatusManagerProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<Order["status"] | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "New":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            ใหม่
          </Badge>
        )
      case "In Process":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            กำลังดำเนินการ
          </Badge>
        )
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            เสร็จสิ้น
          </Badge>
        )
    }
  }

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "New":
        return "In Process"
      case "In Process":
        return "Completed"
      default:
        return null
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "New":
        return "ใหม่"
      case "In Process":
        return "กำลังดำเนินการ"
      case "Completed":
        return "เสร็จสิ้น"
    }
  }

  const handleStatusChange = (newStatus: Order["status"]) => {
    setPendingStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = async () => {
    if (!pendingStatus) return

    setIsUpdating(true)

    try {
      const success = await onStatusUpdate(order.id, pendingStatus)

      if (success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
      setShowConfirmDialog(false)
      setPendingStatus(null)
    }
  }

  const nextStatus = getNextStatus(order.status)

  return (
    <div className="space-y-4">
      {/* แสดงสถานะปัจจุบัน */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">สถานะ:</span>
        {getStatusBadge(order.status)}
      </div>

      {/* ปุ่มเปลี่ยนสถานะ */}
      {nextStatus && !disabled && (
        <Button onClick={() => handleStatusChange(nextStatus)} disabled={isUpdating} className="w-full sm:w-auto">
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              กำลังอัพเดท...
            </>
          ) : (
            <>เปลี่ยนเป็น "{getStatusText(nextStatus)}"</>
          )}
        </Button>
      )}

      {/* แสดงข้อความสำเร็จ */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">อัพเดทสถานะเรียบร้อยแล้ว!</AlertDescription>
        </Alert>
      )}

      {/* Dialog ยืนยันการเปลี่ยนสถานะ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการเปลี่ยนสถานะ</DialogTitle>
            <DialogDescription>
              คุณต้องการเปลี่ยนสถานะของคำสั่งซื้อ {order.id}
              จาก "{getStatusText(order.status)}" เป็น "{pendingStatus ? getStatusText(pendingStatus) : ""}" หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isUpdating}>
              ยกเลิก
            </Button>
            <Button onClick={confirmStatusChange} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังอัพเดท...
                </>
              ) : (
                "ยืนยัน"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
