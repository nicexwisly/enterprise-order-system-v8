// JavaScript สำหรับหน้า Dashboard - Chrome 70 และ Android 6.0.1
document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput")
  var departmentFilter = document.getElementById("departmentFilter")
  var statusFilter = document.getElementById("statusFilter")
  var ordersTableBody = document.getElementById("ordersTableBody")

  var allOrders = []
  var filteredOrders = []

  // Declare Utils and OrderData variables
  var Utils = window.Utils // Assuming Utils is a global object
  var OrderData = window.OrderData // Assuming OrderData is a global object

  // โหลดข้อมูลเริ่มต้น
  loadData()

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", Utils.debounce(filterOrders, 300))
  }

  if (departmentFilter) {
    departmentFilter.addEventListener("change", filterOrders)
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterOrders)
  }

  function loadData() {
    Utils.showLoading()

    // จำลองการโหลดข้อมูล
    setTimeout(() => {
      allOrders = OrderData.getAllOrders()
      filteredOrders = allOrders.slice()

      updateStats()
      renderOrdersTable()
      Utils.hideLoading()
    }, 500)
  }

  function updateStats() {
    var stats = OrderData.getStats()

    var totalElement = document.getElementById("totalOrders")
    var newElement = document.getElementById("newOrders")
    var inProcessElement = document.getElementById("inProcessOrders")
    var completedElement = document.getElementById("completedOrders")

    if (totalElement) totalElement.textContent = stats.total
    if (newElement) newElement.textContent = stats.new
    if (inProcessElement) inProcessElement.textContent = stats.inProcess
    if (completedElement) completedElement.textContent = stats.completed
  }

  function filterOrders() {
    var searchTerm = searchInput ? searchInput.value : ""
    var department = departmentFilter ? departmentFilter.value : "all"
    var status = statusFilter ? statusFilter.value : "all"

    filteredOrders = OrderData.searchOrders(searchTerm, department, status)
    renderOrdersTable()
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
    var statusBadge = document.createElement("span")
    statusBadge.className = "badge"

    var icon = document.createElement("i")
    icon.className = "fas"

    if (order.status === "New") {
      statusBadge.className += " badge-new"
      statusBadge.textContent = " ใหม่"
      icon.className += " fa-exclamation-circle"
    } else if (order.status === "In Process") {
      statusBadge.className += " badge-process"
      statusBadge.textContent = " กำลังดำเนินการ"
      icon.className += " fa-clock"
    } else if (order.status === "Completed") {
      statusBadge.className += " badge-completed"
      statusBadge.textContent = " เสร็จสิ้น"
      icon.className += " fa-check-circle"
    }

    statusBadge.insertBefore(icon, statusBadge.firstChild)
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

  // ฟังก์ชัน global สำหรับ export
  window.exportData = () => {
    Utils.exportToCSV(filteredOrders, "orders_" + new Date().toISOString().split("T")[0] + ".csv")
  }
})
