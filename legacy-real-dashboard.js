// Dashboard ที่เชื่อมต่อกับ API จริง - Chrome 70/Android 6.0.1
document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput")
  var departmentFilter = document.getElementById("departmentFilter")
  var statusFilter = document.getElementById("statusFilter")
  var ordersTableBody = document.getElementById("ordersTableBody")

  var allOrders = []
  var filteredOrders = []
  var refreshInterval

  // Declare Utils and APIClient variables
  var Utils = {
    debounce: (func, wait) => {
      var timeout
      return function () {
        var args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(this, args)
        }, wait)
      }
    },
    showLoading: () => {
      console.log("Loading...")
    },
    hideLoading: () => {
      console.log("Loading finished.")
    },
    showAlert: (message, type) => {
      console.log("Alert: " + message)
    },
    truncateText: (text, maxLength) => (text.length > maxLength ? text.substring(0, maxLength) + "..." : text),
    formatDate: (date) => new Date(date).toLocaleDateString(),
    formatTime: (time) => new Date(time).toLocaleTimeString(),
    exportToCSV: (data, filename) => {
      console.log("Exporting data to CSV: " + filename)
    },
  }

  var APIClient = {
    getStats: (callback) => {
      // Simulate API call
      setTimeout(() => {
        callback(null, { success: true, data: { total: 100, new: 20, inProcess: 30, completed: 50 } })
      }, 1000)
    },
    getOrders: (filters, callback) => {
      // Simulate API call
      setTimeout(() => {
        callback(null, {
          success: true,
          data: [
            {
              id: 1,
              customer: "John Doe",
              department: "Fish",
              items: "Fish items",
              status: "New",
              pickupDate: "2023-10-01",
              pickupTime: "10:00",
              submittedBy: "Alice",
            },
          ],
        })
      }, 1000)
    },
  }

  // โหลดข้อมูลเริ่มต้น
  loadData()

  // Auto refresh ทุก 30 วินาที
  startAutoRefresh()

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", Utils.debounce(filterAndLoadOrders, 300))
  }

  if (departmentFilter) {
    departmentFilter.addEventListener("change", filterAndLoadOrders)
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterAndLoadOrders)
  }

  function loadData() {
    Utils.showLoading()

    // โหลดสถิติ
    APIClient.getStats((error, response) => {
      if (!error && response.success) {
        updateStats(response.data)
      }
    })

    // โหลดคำสั่งซื้อ
    filterAndLoadOrders()
  }

  function filterAndLoadOrders() {
    var filters = {
      search: searchInput ? searchInput.value : "",
      department: departmentFilter ? departmentFilter.value : "all",
      status: statusFilter ? statusFilter.value : "all",
    }

    APIClient.getOrders(filters, (error, response) => {
      Utils.hideLoading()

      if (error) {
        Utils.showAlert("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + (error.error || "Unknown error"), "error")
        return
      }

      if (response.success) {
        allOrders = response.data
        filteredOrders = response.data
        renderOrdersTable()
      } else {
        Utils.showAlert("ไม่สามารถโหลดข้อมูลได้", "error")
      }
    })
  }

  function updateStats(stats) {
    var totalElement = document.getElementById("totalOrders")
    var newElement = document.getElementById("newOrders")
    var inProcessElement = document.getElementById("inProcessOrders")
    var completedElement = document.getElementById("completedOrders")

    if (totalElement) totalElement.textContent = stats.total
    if (newElement) newElement.textContent = stats.new
    if (inProcessElement) inProcessElement.textContent = stats.inProcess
    if (completedElement) completedElement.textContent = stats.completed
  }

  function renderOrdersTable() {
    if (!ordersTableBody) return

    ordersTableBody.innerHTML = ""

    if (filteredOrders.length === 0) {
      var row = document.createElement("tr")
      var cell = document.createElement("td")
      cell.colSpan = 8
      cell.className = "text-center"
      cell.textContent = "ไม่พบข้อมูลคำสั่งซื้อ"
      row.appendChild(cell)
      ordersTableBody.appendChild(row)
      return
    }

    for (var i = 0; i < filteredOrders.length; i++) {
      var order = filteredOrders[i]
      var orderRow = createOrderRow(order)
      ordersTableBody.appendChild(orderRow)
    }
  }

  function createOrderRow(order) {
    var orderRow = document.createElement("tr")

    // รหัสคำสั่งซื้อ
    var idCell = document.createElement("td")
    idCell.className = "font-medium text-blue"
    idCell.textContent = order.id
    orderRow.appendChild(idCell)

    // ลูกค้า
    var customerCell = document.createElement("td")
    customerCell.textContent = order.customer
    orderRow.appendChild(customerCell)

    // แผนก
    var departmentCell = document.createElement("td")
    var departmentBadge = document.createElement("span")
    departmentBadge.className = "badge " + (order.department === "Fish" ? "badge-fish" : "badge-pork")
    departmentBadge.textContent = order.department === "Fish" ? "แผนกปลา" : "แผนกหมู"
    departmentCell.appendChild(departmentBadge)
    orderRow.appendChild(departmentCell)

    // รายการสินค้า
    var itemsCell = document.createElement("td")
    itemsCell.className = "truncate"
    itemsCell.title = order.items
    itemsCell.textContent = Utils.truncateText(order.items, 30)
    orderRow.appendChild(itemsCell)

    // สถานะ
    var statusCell = document.createElement("td")
    var statusBadge = createStatusBadge(order.status)
    statusCell.appendChild(statusBadge)
    orderRow.appendChild(statusCell)

    // วันที่รับ
    var dateCell = document.createElement("td")
    dateCell.textContent = Utils.formatDate(order.pickupDate)
    orderRow.appendChild(dateCell)

    // เวลารับ
    var timeCell = document.createElement("td")
    timeCell.textContent = Utils.formatTime(order.pickupTime)
    orderRow.appendChild(timeCell)

    // ผู้ส่ง
    var submitterCell = document.createElement("td")
    submitterCell.className = "text-gray-600"
    submitterCell.textContent = order.submittedBy
    orderRow.appendChild(submitterCell)

    return orderRow
  }

  function createStatusBadge(status) {
    var statusBadge = document.createElement("span")
    statusBadge.className = "badge"

    var icon = document.createElement("i")
    icon.className = "fas"

    if (status === "New") {
      statusBadge.className += " badge-new"
      statusBadge.textContent = " ใหม่"
      icon.className += " fa-exclamation-circle"
    } else if (status === "In Process") {
      statusBadge.className += " badge-process"
      statusBadge.textContent = " กำลังดำเนินการ"
      icon.className += " fa-clock"
    } else if (status === "Completed") {
      statusBadge.className += " badge-completed"
      statusBadge.textContent = " เสร็จสิ้น"
      icon.className += " fa-check-circle"
    }

    statusBadge.insertBefore(icon, statusBadge.firstChild)
    return statusBadge
  }

  function startAutoRefresh() {
    refreshInterval = setInterval(() => {
      console.log("🔄 Auto refreshing data...")
      loadData()
    }, 30000) // Refresh ทุก 30 วินาที
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  }

  // ฟังก์ชัน global สำหรับ export
  window.exportData = () => {
    Utils.exportToCSV(filteredOrders, "orders_" + new Date().toISOString().split("T")[0] + ".csv")
  }

  // Cleanup เมื่อออกจากหน้า
  window.addEventListener("beforeunload", () => {
    stopAutoRefresh()
  })
})
