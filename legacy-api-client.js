// API Client for Legacy Browsers (Chrome 70, Android 6.0.1)
// Uses XMLHttpRequest for maximum compatibility

;((window) => {
  // Determine base URL
  var baseURL
  if (typeof window !== "undefined" && window.location) {
    // Browser environment
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      baseURL = "http://" + window.location.hostname + ":3000"
    } else {
      baseURL = window.location.protocol + "//" + window.location.host
    }
  } else {
    // Fallback
    baseURL = "http://localhost:3000"
  }

  var API = {
    baseURL: baseURL,

    // Helper function to make HTTP requests
    request: function (method, url, data, callback) {
      var xhr = new XMLHttpRequest()
      var fullUrl = this.baseURL + url

      xhr.open(method, fullUrl, true)
      xhr.setRequestHeader("Content-Type", "application/json")

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          var response
          try {
            response = JSON.parse(xhr.responseText)
          } catch (e) {
            response = { error: "Invalid JSON response" }
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, response)
          } else {
            callback(response, null)
          }
        }
      }

      xhr.onerror = () => {
        callback({ error: "Network error" }, null)
      }

      if (data) {
        xhr.send(JSON.stringify(data))
      } else {
        xhr.send()
      }
    },

    // Get all orders
    getOrders: function (department, callback) {
      var url = "/api/orders"
      if (department) {
        url += "?department=" + encodeURIComponent(department)
      }
      this.request("GET", url, null, callback)
    },

    // Create new order
    createOrder: function (orderData, callback) {
      this.request("POST", "/api/orders", orderData, callback)
    },

    // Update order status
    updateOrderStatus: function (orderId, status, callback) {
      var url = "/api/orders/" + orderId + "/status"
      this.request("PUT", url, { status: status }, callback)
    },

    // Health check
    healthCheck: function (callback) {
      this.request("GET", "/api/health", null, callback)
    },
  }

  // Export API object
  if (typeof module !== "undefined" && module.exports) {
    // Node.js environment
    module.exports = API
  } else {
    // Browser environment
    window.LegacyAPI = API
  }
})(typeof window !== "undefined" ? window : this)
