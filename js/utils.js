// Utility functions สำหรับระบบ - ไม่ใช้ JSON หรือ localStorage
var Utils = {
  // ฟังก์ชันสำหรับสร้าง badge สถานะ
  createStatusBadge: (status) => {
    var badge = document.createElement("span")
    badge.className = "badge"

    var icon = document.createElement("i")
    icon.className = "fas"

    if (status === "New") {
      badge.className += " badge-new"
      badge.textContent = "ใหม่"
      icon.className += " fa-exclamation-circle"
    } else if (status === "In Process") {
      badge.className += " badge-process"
      badge.textContent = "กำลังดำเนินการ"
      icon.className += " fa-clock"
    } else if (status === "Completed") {
      badge.className += " badge-completed"
      badge.textContent = "เสร็จสิ้น"
      icon.className += " fa-check-circle"
    } else {
      badge.className += " badge-new"
      badge.textContent = status
    }

    badge.insertBefore(icon, badge.firstChild)
    return badge
  },

  // ฟังก์ชันสำหรับสร้าง badge แผนก
  createDepartmentBadge: (department) => {
    var badge = document.createElement("span")
    badge.className = "badge"

    if (department === "Fish") {
      badge.className += " badge-fish"
      badge.textContent = "แผนกปลา"
    } else if (department === "Pork") {
      badge.className += " badge-pork"
      badge.textContent = "แผนกหมู"
    } else {
      badge.textContent = department
    }

    return badge
  },

  // ฟังก์ชันสำหรับแสดง alert
  showAlert: (message, type, containerId) => {
    var container = document.getElementById(containerId || "alertContainer")
    if (!container) return

    // ลบ alert เก่า
    container.innerHTML = ""

    var alert = document.createElement("div")
    alert.className = "alert alert-" + (type || "success")

    var icon = document.createElement("i")
    icon.className = "fas"

    if (type === "error") {
      icon.className += " fa-exclamation-triangle"
    } else if (type === "warning") {
      icon.className += " fa-exclamation-circle"
    } else {
      icon.className += " fa-check-circle"
    }

    alert.appendChild(icon)
    alert.appendChild(document.createTextNode(message))
    container.appendChild(alert)

    // ซ่อน alert หลัง 5 วินาที
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 5000)
  },

  // ฟังก์ชันสำหรับ format วันที่
  formatDate: function (dateString) {
    try {
      var date = new Date(dateString)
      var day = this.padNumber(date.getDate(), 2)
      var month = this.padNumber(date.getMonth() + 1, 2)
      var year = date.getFullYear()
      return day + "/" + month + "/" + year
    } catch (e) {
      return dateString
    }
  },

  // ฟังก์ชันสำหรับ format เวลา
  formatTime: (timeString) => {
    try {
      var parts = timeString.split(":")
      if (parts.length >= 2) {
        return parts[0] + ":" + parts[1]
      }
      return timeString
    } catch (e) {
      return timeString
    }
  },

  // ฟังก์ชันสำหรับ debounce
  debounce: (func, wait) => {
    var timeout
    return function () {
      
      var args = arguments
      var later = () => {
        timeout = null
        func.apply(this, args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // ฟังก์ชันสำหรับ validation
  validateForm: (formData) => {
    var errors = []

    if (!formData.customer || !formData.customer.trim()) {
      errors.push("กรุณาระบุชื่อลูกค้า")
    }

    if (!formData.department) {
      errors.push("กรุณาเลือกแผนก")
    }

    if (!formData.items || !formData.items.trim()) {
      errors.push("กรุณาระบุรายการสินค้า")
    }

    if (!formData.pickupDate) {
      errors.push("กรุณาระบุวันที่รับสินค้า")
    }

    if (!formData.pickupTime) {
      errors.push("กรุณาระบุเวลารับสินค้า")
    }

    // ตรวจสอบวันที่ไม่ให้เป็นอดีต
    if (formData.pickupDate && formData.pickupTime) {
      var pickupDateTime = new Date(formData.pickupDate + "T" + formData.pickupTime)
      var now = new Date()
      if (pickupDateTime <= now) {
        errors.push("วันที่และเวลารับสินค้าต้องเป็นอนาคต")
      }
    }

    return errors
  },

  // ฟังก์ชันสำหรับ export ข้อมูลเป็น CSV
  exportToCSV: (data, filename) => {
    var headers = ["รหัสคำสั่งซื้อ", "ลูกค้า", "แผนก", "รายการสินค้า", "สถานะ", "วันที่รับ", "เวลารับ", "ผู้ส่ง", "หมายเหตุ"]

    var csvContent = headers.join(",") + "\n"

    for (var i = 0; i < data.length; i++) {
      var order = data[i]
      var row = [
        order.id,
        '"' + order.customer + '"',
        order.department,
        '"' + order.items + '"',
        order.status,
        order.pickupDate,
        order.pickupTime,
        '"' + order.submittedBy + '"',
        '"' + (order.notes || "") + '"',
      ]
      csvContent += row.join(",") + "\n"
    }

    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    var link = document.createElement("a")

    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename || "orders.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },

  // ฟังก์ชันสำหรับ loading state
  showLoading: () => {
    var overlay = document.getElementById("loadingOverlay")
    if (overlay) {
      overlay.classList.remove("hidden")
    }
  },

  hideLoading: () => {
    var overlay = document.getElementById("loadingOverlay")
    if (overlay) {
      overlay.classList.add("hidden")
    }
  },

  // ฟังก์ชันสำหรับ truncate text
  truncateText: (text, maxLength) => {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + "..."
  },

  // ฟังก์ชันสำหรับ escape HTML
  escapeHtml: (text) => {
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  },

  // ฟังก์ชันช่วยเหลือ - เติม 0 ข้างหน้า
  padNumber: (num, size) => {
    var s = num + ""
    while (s.length < size) {
      s = "0" + s
    }
    return s
  },
}

// ทำให้ Utils เป็น global variable
window.Utils = Utils
