// JavaScript สำหรับหน้า Submit Order - ไม่ใช้ localStorage
document.addEventListener("DOMContentLoaded", () => {
  var orderForm = document.getElementById("orderForm")
  var submitBtn = document.getElementById("submitBtn")

  // ตั้งค่าวันที่ขั้นต่ำเป็นวันถัดไป
  var pickupDateInput = document.getElementById("pickupDate")
  if (pickupDateInput) {
    var tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    pickupDateInput.min = tomorrow.toISOString().split("T")[0]
  }

  // Event listener สำหรับ form submission
  if (orderForm) {
    orderForm.addEventListener("submit", handleSubmit)
  }

  function handleSubmit(e) {
    e.preventDefault()

    // ดึงข้อมูลจากฟอร์ม
    var formData = {
      customer: document.getElementById("customer").value.trim(),
      department: document.getElementById("department").value,
      items: document.getElementById("items").value.trim(),
      pickupDate: document.getElementById("pickupDate").value,
      pickupTime: document.getElementById("pickupTime").value,
      notes: document.getElementById("notes").value.trim(),
      priority: document.getElementById("priority").value,
    }

    // Validate ข้อมูล
    var errors = window.Utils.validateForm(formData)
    if (errors.length > 0) {
      window.Utils.showAlert(errors.join("<br>"), "error")
      return
    }

    // แสดง loading state
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...'

    // จำลองการส่งข้อมูล
    setTimeout(() => {
      try {
        var newOrder = window.OrderData.addOrder(formData)

        // แสดงข้อความสำเร็จ
        window.Utils.showAlert("ส่งคำสั่งซื้อเรียบร้อยแล้ว! รหัสคำสั่งซื้อ: " + newOrder.id, "success")

        // รีเซ็ตฟอร์ม
        orderForm.reset()

        // เปลี่ยนเส้นทางไปหน้าหลักหลัง 2 วินาที
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      } catch (error) {
        window.Utils.showAlert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง", "error")
        console.error("Error submitting order:", error)
      } finally {
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ส่งคำสั่งซื้อ'
      }
    }, 1000)
  }
})
