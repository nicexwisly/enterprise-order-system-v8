// ข้อมูลจำลองสำหรับ Chrome 70 และ Android 6.0.1
// ใช้ ES5 syntax เท่านั้น
var OrderData = {
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
  ],

  orderCounter: 4,

  getAllOrders: function () {
    var result = []
    for (var i = 0; i < this.orders.length; i++) {
      result.push(this.copyOrder(this.orders[i]))
    }
    return result
  },

  getOrdersByDepartment: function (department) {
    var result = []
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].department === department) {
        result.push(this.copyOrder(this.orders[i]))
      }
    }
    return result
  },

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

  updateOrderStatus: function (orderId, newStatus) {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === orderId) {
        this.orders[i].status = newStatus
        return this.copyOrder(this.orders[i])
      }
    }
    return null
  },

  searchOrders: function (searchTerm, department, status) {
    var filtered = []

    for (var i = 0; i < this.orders.length; i++) {
      var order = this.orders[i]
      var matchesSearch = true
      var matchesDepartment = true
      var matchesStatus = true

      if (searchTerm) {
        var term = searchTerm.toLowerCase()
        matchesSearch =
          order.customer.toLowerCase().indexOf(term) !== -1 ||
          order.id.toLowerCase().indexOf(term) !== -1 ||
          order.items.toLowerCase().indexOf(term) !== -1
      }

      if (department && department !== "all") {
        matchesDepartment = order.department.toLowerCase() === department.toLowerCase()
      }

      if (status && status !== "all") {
        matchesStatus = order.status.toLowerCase() === status.toLowerCase()
      }

      if (matchesSearch && matchesDepartment && matchesStatus) {
        filtered.push(this.copyOrder(order))
      }
    }

    return filtered
  },

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

      if (order.status === "New") {
        stats.new++
      } else if (order.status === "In Process") {
        stats.inProcess++
      } else if (order.status === "Completed") {
        stats.completed++
      }

      if (order.department === "Fish") {
        stats.fish++
      } else if (order.department === "Pork") {
        stats.pork++
      }
    }

    return stats
  },

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

  padNumber: (num, size) => {
    var s = num + ""
    while (s.length < size) {
      s = "0" + s
    }
    return s
  },

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

// ทำให้เป็น global variable
window.OrderData = OrderData
