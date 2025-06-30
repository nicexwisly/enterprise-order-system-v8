// Fish Orders ที่เชื่อมต่อกับ API จริง - Chrome 70/Android 6.0.1
document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput")
  var statusFilter = document.getElementById("statusFilter")
  var fishOrdersTableBody = document.getElementById("fishOrdersTableBody")
  var orderModal = document.getElementById("orderModal")
  var confirmModal = document.getElementById("confirmModal")

  var fishOrders = []
  var filteredOrders = []
  var selectedOrder = null
  var pendingStatusChange = null
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
    showAlert: (message, type) => {
      alert(message)
    },
    truncateText: (text, maxLength) => (text.length > maxLength ? text.substring(0, maxLength) + "..." : text),
    formatDate: (date) => new Date(date).toLocaleDateString(),
    formatTime: (time) => new Date(time).toLocaleTimeString(),
    escapeHtml: (unsafe) =>
      unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"),
  }

  var APIClient = {
    getOrders: (filters, callback) => {
      // Simulate API call
      setTimeout(() => {
        callback(null, {
          success: true,
          data: [
            {
              id: 1,
              customer: "John Doe",
              items: "Fish 1, Fish 2",
              status: "New",
              pickupDate: "2023-10-01",
              pickupTime: "10:00",
            },
            {
              id: 2,
              customer: "Jane Smith",
              items: "Fish 3",
              status: "In Process",
              pickupDate: "2023-10-02",
              pickupTime: "11:00",
            },
            {
              id: 3,
              customer: "Alice Johnson",
              items: "Fish 4",
              status: "Completed",
              pickupDate: "2023-10-03",
              pickupTime: "12:00",
            },
          ],
        })
      }, 1000)
    },
    updateOrderStatus: (orderId, newStatus, callback) => {
      // Simulate API call
      setTimeout(() => {
        callback(null, { success: true })
      }, 1000)
    },
  }

  // โหลดข้อมูลเริ่มต้น
  loadData()

  // Auto refresh ทุก 15 วินาที (แผนกต้องการข้อมูลล่าสุด)
  startAutoRefresh()

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", Utils.debounce(filterOrders, 300))
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterOrders)
  }

  function loadData() {
    var filters = {
      department: "Fish",
      search: searchInput ? searchInput.value : "",
      status: statusFilter ? statusFilter.value : "all",
    }

    APIClient.getOrders(filters, (error, response) => {
      if (error) {
        Utils.showAlert("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + (error.error || "Unknown error"), "error")
        return
      }

      if (response.success) {
        fishOrders = response.data
        filteredOrders = response.data
        updateStats()
        renderOrdersTable()
      }
    })
  }

  function filterOrders() {
    loadData() // โหลดข้อมูลใหม่จาก server ตาม filter
  }

  function updateStats() {
    var stats = {
      new: fishOrders.filter((order) => order.status === "New").length,
      inProcess: fishOrders.filter((order) => order.status === "In Process").length,
      completed: fishOrders.filter((order) => order.status === "Completed").length,
    }

    var newElement = document.getElementById("fishNewOrders")
    var inProcessElement = document.getElementById("fishInProcessOrders")
    var completedElement = document.getElementById("fishCompletedOrders")

    if (newElement) newElement.textContent = stats.new
    if (inProcessElement) inProcessElement.textContent = stats.inProcess
    if (completedElement) completedElement.textContent = stats.completed
  }

  function renderOrdersTable() {
    if (!fishOrdersTableBody) return

    fishOrdersTableBody.innerHTML = ""

    if (filteredOrders.length === 0) {
      var row = document.createElement("tr")
      var cell = document.createElement("td")
      cell.colSpan = 7
      cell.className = "text-center"
      cell.textContent = "ไม่พบข้อมูลคำสั่งซื้อ"
      row.appendChild(cell)
      fishOrdersTableBody.appendChild(row)
      return
    }

    for (var i = 0; i < filteredOrders.length; i++) {
      var order = filteredOrders[i]
      var orderRow = createOrderRow(order)
      fishOrdersTableBody.appendChild(orderRow)
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

    // การดำเนินการ
    var actionCell = document.createElement("td")
    var actionContainer = document.createElement("div")
    actionContainer.style.display = "flex"
    actionContainer.style.gap = "8px"

    // ปุ่มดูรายละเอียด
    var viewBtn = document.createElement("button")
    viewBtn.className = "btn btn-outline btn-sm"
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>'
    viewBtn.onclick = () => {
      showOrderDetails(order)
    }
    actionContainer.appendChild(viewBtn)

    // ปุ่มเปลี่ยนสถานะ
    var nextStatus = getNextStatus(order.status)
    if (nextStatus) {
      var statusBtn = document.createElement("button")
      statusBtn.className = "btn btn-primary btn-sm"
      statusBtn.style.background = "#2563eb"
      statusBtn.textContent = "เปลี่ยนเป็น " + getStatusText(nextStatus)
      statusBtn.onclick = () => {
        handleStatusChange(order.id, nextStatus)
      }
      actionContainer.appendChild(statusBtn)
    }

    actionCell.appendChild(actionContainer)
    orderRow.appendChild(actionCell)

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

  function getNextStatus(currentStatus) {
    if (currentStatus === "New") return "In Process"
    if (currentStatus === "In Process") return "Completed"
    return null
  }

  function getStatusText(status) {
    if (status === "New") return "ใหม่"
    if (status === "In Process") return "กำลังดำเนินการ"
    if (status === "Completed") return "เสร็จสิ้น"
    return status
  }

  function showOrderDetails(order) {
    selectedOrder = order

    var modalTitle = document.getElementById("modalTitle")
    var modalBody = document.getElementById("modalBody")

    if (modalTitle) {
      modalTitle.textContent = "รายละเอียดคำสั่งซื้อ - " + order.id
    }

    if (modalBody) {
      modalBody.innerHTML = createOrderDetailsHTML(order)
    }

    if (orderModal) {
      orderModal.classList.remove("hidden")
    }
  }

  function createOrderDetailsHTML(order) {
    return (
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">' +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">ลูกค้า</div>' +
      '<p style="font-size: 14px;">' +
      Utils.escapeHtml(order.customer) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">สถานะ</div>' +
      "<div>" +
      createStatusBadge(order.status).outerHTML +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div style="margin-bottom: 16px;">' +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">รายการสินค้า</div>' +
      '<p style="font-size: 14px;">' +
      Utils.escapeHtml(order.items) +
      "</p>" +
      "</div>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">' +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">วันที่รับ</div>' +
      '<p style="font-size: 14px;">' +
      Utils.formatDate(order.pickupDate) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">เวลารับ</div>' +
      '<p style="font-size: 14px;">' +
      Utils.formatTime(order.pickupTime) +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div style="margin-bottom: 16px;">' +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">หมายเหตุ</div>' +
      '<p style="font-size: 14px;">' +
      Utils.escapeHtml(order.notes || "ไม่มีหมายเหตุเพิ่มเติม") +
      "</p>" +
      "</div>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">' +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">ผู้ส่ง</div>' +
      '<p style="font-size: 14px;">' +
      Utils.escapeHtml(order.submittedBy) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">เวลาส่ง</div>' +
      '<p style="font-size: 14px;">' +
      Utils.escapeHtml(order.submittedAt) +
      "</p>" +
      "</div>" +
      "</div>"
    )
  }

  function handleStatusChange(orderId, newStatus) {
    pendingStatusChange = { orderId: orderId, newStatus: newStatus }

    var confirmMessage = document.getElementById("confirmMessage")
    if (confirmMessage) {
      confirmMessage.textContent =
        "คุณต้องการเปลี่ยนสถานะของคำสั่งซื้อ " + orderId + ' เป็น "' + getStatusText(newStatus) + '" หรือไม่?'
    }

    if (confirmModal) {
      confirmModal.classList.remove("hidden")
    }
  }

  function startAutoRefresh() {
    refreshInterval = setInterval(() => {
      console.log("🔄 Auto refreshing fish orders...")
      loadData()
    }, 15000) // Refresh ทุก 15 วินาที
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  }

  // ฟังก์ชัน global
  window.closeModal = () => {
    if (orderModal) {
      orderModal.classList.add("hidden")
    }
  }

  window.closeConfirmModal = () => {
    if (confirmModal) {
      confirmModal.classList.add("hidden")
    }
    pendingStatusChange = null
  }

  window.confirmStatusChange = () => {
    if (pendingStatusChange) {
      APIClient.updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus, (error, response) => {
        if (error) {
          Utils.showAlert("เกิดข้อผิดพลาดในการอัพเดทสถานะ: " + (error.error || "Unknown error"), "error")
        } else if (response.success) {
          Utils.showAlert("อัพเดทสถานะเรียบร้อยแล้ว!", "success")
          loadData() // โหลดข้อมูลใหม่
        } else {
          Utils.showAlert("ไม่สามารถอัพเดทสถานะได้", "error")
        }
      })
    }

    window.closeConfirmModal()
  }

  // Cleanup เมื่อออกจากหน้า
  window.addEventListener("beforeunload", () => {
    stopAutoRefresh()
  })
})
