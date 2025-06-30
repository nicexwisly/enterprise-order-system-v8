// Submit Order ที่เชื่อมต่อกับ API จริง - Chrome 70/Android 6.0.1
document.addEventListener("DOMContentLoaded", () => {
  var orderForm = document.getElementById("orderForm")
  var submitBtn = document.getElementById("submitBtn")

  // Declare Utils and APIClient variables
  var Utils = window.Utils // Assuming Utils is a global object
  var APIClient = window.APIClient // Assuming APIClient is a global object

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
      submittedBy: "OCS Staff", // ในการใช้งานจริงจะได้จาก user session
    }

    // Validate ข้อมูล
    var errors = Utils.validateForm(formData)
    if (errors.length > 0) {
      Utils.showAlert(errors.join("<br>"), "error")
      return
    }

    // แสดง loading state
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...'

    // ส่งข้อมูลไปยัง API
    APIClient.createOrder(formData, (error, response) => {
      submitBtn.disabled = false
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ส่งคำสั่งซื้อ'

      if (error) {
        Utils.showAlert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ: " + (error.error || "Unknown error"), "error")
        return
      }

      if (response.success) {
        // แสดงข้อความสำเร็จ
        Utils.showAlert(
          "ส่งคำสั่งซื้อเรียบร้อยแล้ว!<br>" +
            "รหัสคำสั่งซื้อ: <strong>" +
            response.data.id +
            "</strong><br>" +
            "ส่งไปยัง: <strong>" +
            (response.data.department === "Fish" ? "แผนกปลา" : "แผนกหมู") +
            "</strong>",
          "success",
        )

        // รีเซ็ตฟอร์ม
        orderForm.reset()

        // เปลี่ยนเส้นทางไปหน้าหลักหลัง 3 วินาที
        setTimeout(() => {
          window.location.href = "legacy-index.html"
        }, 3000)
      } else {
        Utils.showAlert("ไม่สามารถส่งคำสั่งซื้อได้: " + (response.error || "Unknown error"), "error")
      }
    })
  }

  // Auto-save draft ทุก 30 วินาที
  setInterval(() => {
    if (orderForm) {
      var formData = {
        customer: document.getElementById("customer").value,
        department: document.getElementById("department").value,
        items: document.getElementById("items").value,
        pickupDate: document.getElementById("pickupDate").value,
        pickupTime: document.getElementById("pickupTime").value,
        notes: document.getElementById("notes").value,
        priority: document.getElementById("priority").value,
      }

      // บันทึกใน localStorage
      try {
        localStorage.setItem("orderDraft", JSON.stringify(formData))
        console.log("📝 Auto-saved draft")
      } catch (e) {
        console.log("❌ Cannot save draft")
      }
    }
  }, 30000)

  // โหลด draft เมื่อเริ่มต้น
  try {
    var savedDraft = localStorage.getItem("orderDraft")
    if (savedDraft) {
      var draftData = JSON.parse(savedDraft)

      if (draftData.customer) document.getElementById("customer").value = draftData.customer
      if (draftData.department) document.getElementById("department").value = draftData.department
      if (draftData.items) document.getElementById("items").value = draftData.items
      if (draftData.pickupDate) document.getElementById("pickupDate").value = draftData.pickupDate
      if (draftData.pickupTime) document.getElementById("pickupTime").value = draftData.pickupTime
      if (draftData.notes) document.getElementById("notes").value = draftData.notes
      if (draftData.priority) document.getElementById("priority").value = draftData.priority

      console.log("📋 Loaded draft from localStorage")
    }
  } catch (e) {
    console.log("❌ Cannot load draft")
  }
})
