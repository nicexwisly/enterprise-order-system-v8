// Custom hook สำหรับจัดการ state ของคำสั่งซื้อ
"use client"

import { useState, useEffect, useCallback } from "react"
import { type Order, getAllOrders, getOrdersByDepartment, updateOrderStatus, getOrderStats } from "@/lib/order-service"

export function useOrders(department?: "Fish" | "Pork") {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = department ? await getOrdersByDepartment(department) : await getAllOrders()

      setOrders(data)
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }, [department])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateStatus = useCallback(async (orderId: string, newStatus: Order["status"]) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus)
      if (updatedOrder) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))
        return true
      }
      return false
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการอัพเดทสถานะ")
      console.error("Error updating status:", err)
      return false
    }
  }, [])

  const refreshOrders = useCallback(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    updateStatus,
    refreshOrders,
  }
}

export function useOrderStats() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProcess: 0,
    completed: 0,
    fish: 0,
    pork: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getOrderStats()
        setStats(data)
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // อัพเดทสถิติทุก 30 วินาที
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return { stats, loading }
}
