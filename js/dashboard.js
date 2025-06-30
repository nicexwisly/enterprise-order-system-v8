// JavaScript สำหรับหน้า Dashboard - ไม่ใช้ localStorage
document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput")
  var departmentFilter = document.getElementById("departmentFilter")
  var statusFilter = document.getElementById("statusFilter")
  var ordersTableBody = document.getElementById("ordersTableBody")

  // ตัวแปรสำหรับเก็บข้อมูล
  var allOrders = []
  var filteredOrders = []

  // โหลดข้อมูลเริ่มต้น
  loadData()

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", window.Utils.debounce(filterOrders, 300))
  }

  if (departmentFilter) {
    departmentFilter.addEventListener("change", filterOrders)
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterOrders)
  }

  function loadData() {
    window.Utils.showLoading()

    // จำลองการโหลดข้อมูล
    setTimeout(() => {
      allOrders = window.OrderData.getAllOrders()
      filteredOrders = allOrders.slice()

      updateStats()
      renderOrdersTable()
      window.Utils.hideLoading()
    }, 500)
  }

  function updateStats() {
    var stats = window.OrderData.getStats()

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

    filteredOrders = window.OrderData.searchOrders(searchTerm, department, status)
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
    departmentCell.appendChild(window.Utils.createDepartmentBadge(order.department))
    orderRow.appendChild(departmentCell)

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

    // ผู้ส่ง
    var submitterCell = document.createElement("td")
    submitterCell.className = "text-gray-600"
    submitterCell.textContent = order.submittedBy
    orderRow.appendChild(submitterCell)

    return orderRow
  }

  // ฟังก์ชัน global สำหรับ export
  window.exportData = () => {
    window.Utils.exportToCSV(filteredOrders, "orders_" + new Date().toISOString().split("T")[0] + ".csv")
  }
})
