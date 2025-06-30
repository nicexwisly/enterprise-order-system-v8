// JavaScript สำหรับหน้า Fish Orders - ไม่ใช้ localStorage
document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput")
  var statusFilter = document.getElementById("statusFilter")
  var fishOrdersTableBody = document.getElementById("fishOrdersTableBody")
  var orderModal = document.getElementById("orderModal")
  var confirmModal = document.getElementById("confirmModal")

  // ตัวแปรสำหรับเก็บข้อมูล
  var fishOrders = []
  var filteredOrders = []
  var selectedOrder = null
  var pendingStatusChange = null

  // โหลดข้อมูลเริ่มต้น
  loadData()

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", window.Utils.debounce(filterOrders, 300))
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterOrders)
  }

  function loadData() {
    fishOrders = window.OrderData.getOrdersByDepartment("Fish")
    filteredOrders = fishOrders.slice()

    updateStats()
    renderOrdersTable()
  }

  function updateStats() {
    var stats = window.OrderData.getDepartmentStats("Fish")

    var newElement = document.getElementById("fishNewOrders")
    var inProcessElement = document.getElementById("fishInProcessOrders")
    var completedElement = document.getElementById("fishCompletedOrders")

    if (newElement) newElement.textContent = stats.new
    if (inProcessElement) inProcessElement.textContent = stats.inProcess
    if (completedElement) completedElement.textContent = stats.completed
  }

  function filterOrders() {
    var searchTerm = searchInput ? searchInput.value : ""
    var status = statusFilter ? statusFilter.value : "all"

    filteredOrders = window.OrderData.searchOrders(searchTerm, "Fish", status)
    renderOrdersTable()
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
    itemsCell.textContent = window.Utils.truncateText(order.items, 30)
    orderRow.appendChild(itemsCell)

    // สถานะ
    var statusCell = document.createElement("td")
    statusCell.appendChild(window.Utils.createStatusBadge(order.status))
    orderRow.appendChild(statusCell)

    // วันที่รับ
    var dateCell = document.createElement("td")
    dateCell.textContent = window.Utils.formatDate(order.pickupDate)
    orderRow.appendChild(dateCell)

    // เวลารับ
    var timeCell = document.createElement("td")
    timeCell.textContent = window.Utils.formatTime(order.pickupTime)
    orderRow.appendChild(timeCell)

    // การดำเนินการ
    var actionCell = document.createElement("td")
    var actionContainer = document.createElement("div")
    actionContainer.style.display = "flex"
    actionContainer.style.gap = "8px"

    // ปุ่มดูรายละเอียด
    var viewBtn = document.createElement("button")
    viewBtn.className = "btn btn-outline"
    viewBtn.style.padding = "4px 8px"
    viewBtn.style.fontSize = "12px"
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>'
    viewBtn.onclick = () => {
      showOrderDetails(order)
    }
    actionContainer.appendChild(viewBtn)

    // ปุ่มเปลี่ยนสถานะ
    var nextStatus = getNextStatus(order.status)
    if (nextStatus) {
      var statusBtn = document.createElement("button")
      statusBtn.className = "btn btn-primary"
      statusBtn.style.padding = "4px 8px"
      statusBtn.style.fontSize = "12px"
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

  function getNextStatus(currentStatus) {
    if (currentStatus === "New") {
      return "In Process"
    } else if (currentStatus === "In Process") {
      return "Completed"
    }
    return null
  }

  function getStatusText(status) {
    if (status === "New") {
      return "ใหม่"
    } else if (status === "In Process") {
      return "กำลังดำเนินการ"
    } else if (status === "Completed") {
      return "เสร็จสิ้น"
    }
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
      window.Utils.escapeHtml(order.customer) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">สถานะ</div>' +
      "<div>" +
      window.Utils.createStatusBadge(order.status).outerHTML +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div style="margin-bottom: 16px;">' +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">รายการสินค้า</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.escapeHtml(order.items) +
      "</p>" +
      "</div>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">' +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">วันที่รับ</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.formatDate(order.pickupDate) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">เวลารับ</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.formatTime(order.pickupTime) +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div style="margin-bottom: 16px;">' +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">หมายเหตุ</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.escapeHtml(order.notes || "ไม่มีหมายเหตุเพิ่มเติม") +
      "</p>" +
      "</div>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">' +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">ผู้ส่ง</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.escapeHtml(order.submittedBy) +
      "</p>" +
      "</div>" +
      "<div>" +
      '<div style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 4px;">เวลาส่ง</div>' +
      '<p style="font-size: 14px;">' +
      window.Utils.escapeHtml(order.submittedAt) +
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
      var updatedOrder = window.OrderData.updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus)

      if (updatedOrder) {
        window.Utils.showAlert("อัพเดทสถานะเรียบร้อยแล้ว!", "success")
        loadData() // โหลดข้อมูลใหม่
      } else {
        window.Utils.showAlert("เกิดข้อผิดพลาดในการอัพเดทสถานะ", "error")
      }
    }

    window.closeConfirmModal()
  }
})
