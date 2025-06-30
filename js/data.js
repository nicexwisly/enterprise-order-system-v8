// ข้อมูลจำลองสำหรับระบบ - ใช้ JavaScript Objects แทน JSON
var OrderData = {
  // ข้อมูลคำสั่งซื้อ - เก็บใน memory
  orders: [
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
    {
      id: "ORD-004",
      customer: "BBQ Restaurant",
      department: "Pork",
      items: "Pork Shoulder 20kg, Bacon 5kg",
      status: "New",
      pickupDate: "2024-01-17",
      pickupTime: "09:00",
      submittedBy: "Tom Brown",
      submittedAt: "2024-01-11 08:30",
      notes: "Regular weekly order",
      priority: "normal",
    },
    {
      id: "ORD-005",
      customer: "Seafood Market",
      department: "Fish",
      items: "Mixed fish 25kg, Lobster 2kg",
      status: "In Process",
      pickupDate: "2024-01-16",
      pickupTime: "12:00",
      submittedBy: "Sarah Wilson",
      submittedAt: "2024-01-11 14:20",
      notes: "Regular weekly order",
      priority: "normal",
    },
    {
      id: "ORD-006",
      customer: "Deli Market",
      department: "Pork",
      items: "Ham 8kg, Sausages 12kg",
      status: "Completed",
      pickupDate: "2024-01-13",
      pickupTime: "11:00",
      submittedBy: "Lisa Davis",
      submittedAt: "2024-01-08 15:45",
      notes: "Sliced ham preferred",
      priority: "low",
    },
  ],

  // ตัวนับสำหรับ ID ใหม่
  orderCounter: 7,

  // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
  getAllOrders: function () {
    var result = []
    for (var i = 0; i < this.orders.length; i++) {
      result.push(this.copyOrder(this.orders[i]))
    }
    return result
  },

  // ฟังก์ชันสำหรับดึงข้อมูลตาม department
  getOrdersByDepartment: function (department) {
    var result = []
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].department === department) {
        result.push(this.copyOrder(this.orders[i]))
      }
    }
    return result
  },

  // ฟังก์ชันสำหรับดึงข้อมูลตาม ID
  getOrderById: function (id) {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === id) {
        return this.copyOrder(this.orders[i])
      }
    }
    return null
  },

  // ฟังก์ชันสำหรับเพิ่มคำสั่งซื้อใหม่
  addOrder: function (orderData) {
    var newId = "ORD-" + this.padNumber(this.orderCounter, 3)
    this.orderCounter++

    var newOrder = {
      id: newId,
      customer: orderData.customer,
      department: orderData.department,
      items: orderData.items,
      status: "New",
      pickupDate: orderData.pickupDate,
      pickupTime: orderData.pickupTime,
      submittedBy: orderData.submittedBy || "OCS Staff",
      submittedAt: this.getCurrentDateTime(),
      notes: orderData.notes || "",
      priority: orderData.priority || "normal",
    }

    this.orders.push(newOrder)
    return this.copyOrder(newOrder)
  },

  // ฟังก์ชันสำหรับอัพเดทสถานะ
  updateOrderStatus: function (orderId, newStatus) {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === orderId) {
        this.orders[i].status = newStatus
        return this.copyOrder(this.orders[i])
      }
    }
    return null
  },

  // ฟังก์ชันสำหรับค้นหา
  searchOrders: function (searchTerm, department, status) {
    var filtered = []

    for (var i = 0; i < this.orders.length; i++) {
      var order = this.orders[i]
      var matchesSearch = true
      var matchesDepartment = true
      var matchesStatus = true

      // ตรวจสอบ search term
      if (searchTerm) {
        var term = searchTerm.toLowerCase()
        matchesSearch =
          order.customer.toLowerCase().indexOf(term) !== -1 ||
          order.id.toLowerCase().indexOf(term) !== -1 ||
          order.items.toLowerCase().indexOf(term) !== -1
      }

      // ตรวจสอบ department
      if (department && department !== "all") {
        matchesDepartment = order.department.toLowerCase() === department.toLowerCase()
      }

      // ตรวจสอบ status
      if (status && status !== "all") {
        matchesStatus = order.status.toLowerCase() === status.toLowerCase()
      }

      if (matchesSearch && matchesDepartment && matchesStatus) {
        filtered.push(this.copyOrder(order))
      }
    }

    return filtered
  },

  // ฟังก์ชันสำหรับสถิติ
  getStats: function () {
    var stats = {
      total: this.orders.length,
      new: 0,
      inProcess: 0,
      completed: 0,
      fish: 0,
      pork: 0,
    }

    for (var i = 0; i < this.orders.length; i++) {
      var order = this.orders[i]

      // นับตามสถานะ
      if (order.status === "New") {
        stats.new++
      } else if (order.status === "In Process") {
        stats.inProcess++
      } else if (order.status === "Completed") {
        stats.completed++
      }

      // นับตามแผนก
      if (order.department === "Fish") {
        stats.fish++
      } else if (order.department === "Pork") {
        stats.pork++
      }
    }

    return stats
  },

  // ฟังก์ชันสำหรับสถิติตาม department
  getDepartmentStats: function (department) {
    var orders = this.getOrdersByDepartment(department)
    var stats = {
      total: orders.length,
      new: 0,
      inProcess: 0,
      completed: 0,
    }

    for (var i = 0; i < orders.length; i++) {
      var order = orders[i]
      if (order.status === "New") {
        stats.new++
      } else if (order.status === "In Process") {
        stats.inProcess++
      } else if (order.status === "Completed") {
        stats.completed++
      }
    }

    return stats
  },

  // ฟังก์ชันช่วยเหลือ - คัดลอก object
  copyOrder: (order) => ({
    id: order.id,
    customer: order.customer,
    department: order.department,
    items: order.items,
    status: order.status,
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    submittedBy: order.submittedBy,
    submittedAt: order.submittedAt,
    notes: order.notes,
    priority: order.priority,
  }),

  // ฟังก์ชันช่วยเหลือ - เติม 0 ข้างหน้า
  padNumber: (num, size) => {
    var s = num + ""
    while (s.length < size) {
      s = "0" + s
    }
    return s
  },

  // ฟังก์ชันสำหรับดึงวันที่และเวลาปัจจุบัน
  getCurrentDateTime: function () {
    var now = new Date()
    var year = now.getFullYear()
    var month = this.padNumber(now.getMonth() + 1, 2)
    var day = this.padNumber(now.getDate(), 2)
    var hours = this.padNumber(now.getHours(), 2)
    var minutes = this.padNumber(now.getMinutes(), 2)

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes
  },
}

// ทำให้ OrderData เป็น global variable
window.OrderData = OrderData
