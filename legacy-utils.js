// Utility functions สำหรับ Chrome 70 และ Android 6.0.1
var Utils = {
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

  padNumber: (num, size) => {
    var s = num + ""
    while (s.length < size) {
      s = "0" + s
    }
    return s
  },

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

  showAlert: (message, type, containerId) => {
    var container = document.getElementById(containerId || "alertContainer")
    if (!container) {
      // สร้าง alert container ถ้าไม่มี
      container = document.createElement("div")
      container.id = "alertContainer"
      container.style.position = "fixed"
      container.style.top = "20px"
      container.style.right = "20px"
      container.style.zIndex = "9999"
      document.body.appendChild(container)
    }

    // ลบ alert เก่า
    container.innerHTML = ""

    var alert = document.createElement("div")
    alert.className = "alert alert-" + (type || "success")
    alert.style.padding = "16px"
    alert.style.borderRadius = "8px"
    alert.style.marginBottom = "12px"
    alert.style.maxWidth = "400px"
    alert.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"

    if (type === "error") {
      alert.style.background = "#fee2e2"
      alert.style.color = "#991b1b"
      alert.style.border = "1px solid #fca5a5"
    } else if (type === "warning") {
      alert.style.background = "#fef3c7"
      alert.style.color = "#92400e"
      alert.style.border = "1px solid #fde68a"
    } else {
      alert.style.background = "#d1fae5"
      alert.style.color = "#065f46"
      alert.style.border = "1px solid #a7f3d0"
    }

    alert.innerHTML = message
    container.appendChild(alert)

    // ซ่อน alert หลัง 5 วินาที
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 5000)
  },

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

    if (formData.pickupDate && formData.pickupTime) {
      var pickupDateTime = new Date(formData.pickupDate + "T" + formData.pickupTime)
      var now = new Date()
      if (pickupDateTime <= now) {
        errors.push("วันที่และเวลารับสินค้าต้องเป็นอนาคต")
      }
    }

    return errors
  },

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

    // สำหรับ Chrome 70 และ Android 6.0.1
    if (navigator.msSaveBlob) {
      // IE/Edge
      var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      navigator.msSaveBlob(blob, filename || "orders.csv")
    } else {
      // Chrome/Firefox/Safari
      var link = document.createElement("a")
      if (link.download !== undefined) {
        var csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        var url = URL.createObjectURL(csvBlob)
        link.setAttribute("href", url)
        link.setAttribute("download", filename || "orders.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  },

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

  truncateText: (text, maxLength) => {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + "..."
  },

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
}

// ทำให้เป็น global variable
window.Utils = Utils
