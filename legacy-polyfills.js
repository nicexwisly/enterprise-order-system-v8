// Polyfills สำหรับ Chrome 70 และ Android 6.0.1
;(() => {
  // Object.assign polyfill
  if (typeof Object.assign !== "function") {
    Object.assign = (target) => {
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object")
      }

      var to = Object(target)

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index]

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    }
  }

  // Array.find polyfill
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      if (this == null) {
        throw new TypeError("Array.prototype.find called on null or undefined")
      }
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function")
      }
      var list = Object(this)
      var length = Number.parseInt(list.length) || 0
      var thisArg = arguments[1]
      for (var i = 0; i < length; i++) {
        var element = list[i]
        if (predicate.call(thisArg, element, i, list)) {
          return element
        }
      }
      return undefined
    }
  }

  // Array.includes polyfill
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement) {
      var O = Object(this)
      var len = Number.parseInt(O.length) || 0
      if (len === 0) return false
      var n = Number.parseInt(arguments[1]) || 0
      var k = n >= 0 ? n : Math.max(len + n, 0)
      while (k < len) {
        if (O[k] === searchElement) {
          return true
        }
        k++
      }
      return false
    }
  }

  // String.includes polyfill
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== "number") {
        start = 0
      }
      if (start + search.length > this.length) {
        return false
      } else {
        return this.indexOf(search, start) !== -1
      }
    }
  }

  // Fetch polyfill สำหรับ Android 6.0.1
  if (!window.fetch) {
    window.fetch = (url, options) =>
      new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        var method = (options && options.method) || "GET"
        var headers = (options && options.headers) || {}
        var body = options && options.body

        xhr.open(method, url, true)

        // Set headers
        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key])
          }
        }

        xhr.onload = () => {
          var response = {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            text: () => Promise.resolve(xhr.responseText),
            json: () => Promise.resolve(JSON.parse(xhr.responseText)),
          }
          resolve(response)
        }

        xhr.onerror = () => {
          reject(new Error("Network error"))
        }

        xhr.send(body)
      })
  }

  // Promise polyfill สำหรับ Android 6.0.1 เก่า
  if (typeof Promise === "undefined") {
    window.Promise = function (executor) {
      var self = this
      self.state = "pending"
      self.value = undefined
      self.handlers = []

      function resolve(result) {
        if (self.state === "pending") {
          self.state = "fulfilled"
          self.value = result
          self.handlers.forEach(handle)
          self.handlers = null
        }
      }

      function reject(error) {
        if (self.state === "pending") {
          self.state = "rejected"
          self.value = error
          self.handlers.forEach(handle)
          self.handlers = null
        }
      }

      function handle(handler) {
        if (self.state === "pending") {
          self.handlers.push(handler)
        } else {
          if (self.state === "fulfilled" && typeof handler.onFulfilled === "function") {
            handler.onFulfilled(self.value)
          }
          if (self.state === "rejected" && typeof handler.onRejected === "function") {
            handler.onRejected(self.value)
          }
        }
      }

      this.then = (onFulfilled, onRejected) =>
        new Promise((resolve, reject) => {
          handle({
            onFulfilled: (result) => {
              try {
                resolve(onFulfilled ? onFulfilled(result) : result)
              } catch (ex) {
                reject(ex)
              }
            },
            onRejected: (error) => {
              try {
                resolve(onRejected ? onRejected(error) : error)
              } catch (ex) {
                reject(ex)
              }
            },
          })
        })

      executor(resolve, reject)
    }

    Promise.resolve = (value) =>
      new Promise((resolve) => {
        resolve(value)
      })

    Promise.reject = (reason) =>
      new Promise((resolve, reject) => {
        reject(reason)
      })
  }

  // addEventListener polyfill สำหรับ IE เก่า
  if (!Element.prototype.addEventListener) {
    Element.prototype.addEventListener = function (event, handler) {
      
      this.attachEvent("on" + event, () => {
        handler.call(this)
      })
    }
  }
})()
