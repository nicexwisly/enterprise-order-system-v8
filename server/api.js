const http = require("http")
const fs = require("fs")
const path = require("path")
const url = require("url")

// In-memory database
const orders = [
  {
    id: 1,
    customerName: "บริษัท ABC จำกัด",
    product: "ปลาแซลมอน",
    quantity: 50,
    unit: "กิโลกรัม",
    status: "รอดำเนินการ",
    department: "fish",
    orderDate: "2024-06-30",
    notes: "ต้องการปลาสด คุณภาพดี",
  },
  {
    id: 2,
    customerName: "ร้านอาหาร XYZ",
    product: "หมูสามชั้น",
    quantity: 30,
    unit: "กิโลกรัม",
    status: "กำลังจัดส่ง",
    department: "pork",
    orderDate: "2024-06-29",
    notes: "ส่งก่อน 10:00 น.",
  },
]

let nextId = 3

// MIME types
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
}

// Serve static files
function serveStaticFile(filePath, res) {
  const extname = path.extname(filePath).toLowerCase()
  const contentType = mimeTypes[extname] || "text/plain"

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 - ไม่พบหน้า</title><meta charset="utf-8"></head>
          <body>
            <h1>404 - ไม่พบหน้าที่ต้องการ</h1>
            <p><a href="/">กลับหน้าหลัก</a></p>
          </body>
          </html>
        `)
      } else {
        res.writeHead(500)
        res.end("Server Error")
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content)
    }
  })
}

// Send JSON response
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(data))
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method

  console.log(`${method} ${pathname}`)

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    })
    res.end()
    return
  }

  // API Routes
  if (pathname.startsWith("/api/")) {
    // Health check
    if (pathname === "/api/health") {
      sendJSON(res, {
        status: "OK",
        timestamp: new Date().toISOString(),
        orders: orders.length,
      })
      return
    }

    // Get orders
    if (pathname === "/api/orders" && method === "GET") {
      const department = parsedUrl.query.department
      let filteredOrders = orders

      if (department && department !== "all") {
        filteredOrders = orders.filter((order) => order.department === department)
      }

      sendJSON(res, filteredOrders)
      return
    }

    // Create order
    if (pathname === "/api/orders" && method === "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk.toString()
      })

      req.on("end", () => {
        try {
          const orderData = JSON.parse(body)
          const newOrder = {
            id: nextId++,
            customerName: orderData.customerName || "",
            product: orderData.product || "",
            quantity: orderData.quantity || 0,
            unit: orderData.unit || "กิโลกรัม",
            status: "รอดำเนินการ",
            department: orderData.department || "fish",
            orderDate: new Date().toISOString().split("T")[0],
            notes: orderData.notes || "",
          }

          orders.push(newOrder)
          console.log(`📦 New order created: ${newOrder.id}`)
          sendJSON(res, newOrder, 201)
        } catch (error) {
          sendJSON(res, { error: "Invalid JSON" }, 400)
        }
      })
      return
    }

    // Update order status
    if (pathname.match(/^\/api\/orders\/\d+\/status$/) && method === "PUT") {
      const orderId = Number.parseInt(pathname.split("/")[3])
      let body = ""

      req.on("data", (chunk) => {
        body += chunk.toString()
      })

      req.on("end", () => {
        try {
          const { status } = JSON.parse(body)
          const orderIndex = orders.findIndex((order) => order.id === orderId)

          if (orderIndex === -1) {
            sendJSON(res, { error: "Order not found" }, 404)
            return
          }

          orders[orderIndex].status = status
          console.log(`🔄 Order ${orderId} status updated to: ${status}`)
          sendJSON(res, orders[orderIndex])
        } catch (error) {
          sendJSON(res, { error: "Invalid JSON" }, 400)
        }
      })
      return
    }

    // API not found
    sendJSON(res, { error: "API endpoint not found" }, 404)
    return
  }

  // Static file routing
  let filePath
  if (pathname === "/" || pathname === "/index.html") {
    filePath = path.join(__dirname, "..", "index.html")
  } else if (pathname === "/submit-order" || pathname === "/submit-order.html") {
    filePath = path.join(__dirname, "..", "submit-order.html")
  } else if (pathname === "/fish-orders" || pathname === "/fish-orders.html") {
    filePath = path.join(__dirname, "..", "fish-orders.html")
  } else if (pathname === "/pork-orders" || pathname === "/pork-orders.html") {
    filePath = path.join(__dirname, "..", "pork-orders.html")
  } else {
    filePath = path.join(__dirname, "..", pathname)
  }

  // Security check
  const resolvedPath = path.resolve(filePath)
  const rootPath = path.resolve(__dirname, "..")

  if (!resolvedPath.startsWith(rootPath)) {
    res.writeHead(403)
    res.end("Forbidden")
    return
  }

  serveStaticFile(filePath, res)
})

// Start server
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"

server.listen(PORT, HOST, () => {
  console.log(`🚀 Enterprise Order System V8`)
  console.log(`📊 Server: http://${HOST}:${PORT}`)
  console.log(`💚 Health: http://${HOST}:${PORT}/api/health`)
  console.log(`📱 Chrome 70+ & Android 6.0.1+ Ready`)
})

process.on("SIGTERM", () => {
  console.log("Shutting down...")
  server.close(() => {
    process.exit(0)
  })
})
