// Pure JavaScript API Client for Chrome 70+ and Android 6.0.1+
;((window) => {
  // Determine base URL
  var baseURL = ""
  if (typeof window !== "undefined" && window.location) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      baseURL = "http://localhost:3000"
    } else {
      baseURL = window.location.protocol + "//" + window.location.host
    }
  }

  // Simple AJAX function for older browsers
  function makeRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText)
            callback(null, response)
          } catch (e) {
            callback(new Error("Invalid JSON response"), null)
          }
        } else {
          callback(new Error("HTTP " + xhr.status + ": " + xhr.statusText), null)
        }
      }
    }

    xhr.onerror = () => {
      callback(new Error("Network error"), null)
    }

    xhr.open(method, baseURL + url, true)
    xhr.setRequestHeader("Content-Type", "application/json")

    if (data) {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  }

  // API methods
  var API = {
    // Health check
    healthCheck: (callback) => {
      makeRequest("GET", "/api/health", null, callback)
    },

    // Get all orders
    getOrders: (department, callback) => {
      var url = "/api/orders"
      if (department) {
        url += "?department=" + encodeURIComponent(department)
      }
      makeRequest("GET", url, null, callback)
    },

    // Create new order
    createOrder: (orderData, callback) => {
      makeRequest("POST", "/api/orders", orderData, callback)
    },

    // Update order status
    updateOrderStatus: (orderId, status, callback) => {
      makeRequest("PUT", "/api/orders/" + orderId + "/status", { status: status }, callback)
    },
  }

  // Export to global scope
  window.API = API
})(window)
