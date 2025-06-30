// Utility functions สำหรับ Chrome 70-83 compatibility
export function isOldBrowser() {
  if (typeof window === "undefined") return false

  const userAgent = window.navigator.userAgent
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/)

  if (chromeMatch) {
    const chromeVersion = Number.parseInt(chromeMatch[1])
    return chromeVersion >= 70 && chromeVersion <= 83
  }

  return false
}

// Polyfill สำหรับ Object.assign (สำหรับ Chrome เก่า)
export function objectAssign(target, ...sources) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object")
  }

  const to = Object(target)

  for (let index = 0; index < sources.length; index++) {
    const nextSource = sources[index]

    if (nextSource != null) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey]
        }
      }
    }
  }
  return to
}

// Polyfill สำหรับ Array.find
export function arrayFind(array, predicate) {
  if (array == null) {
    throw new TypeError("Array.prototype.find called on null or undefined")
  }
  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function")
  }

  const list = Object(array)
  const length = Number.parseInt(list.length) || 0

  for (let i = 0; i < length; i++) {
    const element = list[i]
    if (predicate.call(arguments[2], element, i, list)) {
      return element
    }
  }
  return undefined
}

// Polyfill สำหรับ Array.includes
export function arrayIncludes(array, searchElement, fromIndex) {
  if (array == null) {
    throw new TypeError("Array.prototype.includes called on null or undefined")
  }

  const o = Object(array)
  const len = Number.parseInt(o.length) || 0

  if (len === 0) return false

  const n = Number.parseInt(fromIndex) || 0
  let k = n >= 0 ? n : Math.max(len + n, 0)

  while (k < len) {
    if (o[k] === searchElement) {
      return true
    }
    k++
  }

  return false
}

// Helper function สำหรับ localStorage ที่ปลอดภัย
export function safeLocalStorage() {
  try {
    const test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return {
      getItem: (key) => {
        try {
          return localStorage.getItem(key)
        } catch (e) {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
          return true
        } catch (e) {
          return false
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
          return true
        } catch (e) {
          return false
        }
      },
    }
  } catch (e) {
    // localStorage ไม่พร้อมใช้งาน
    return {
      getItem: () => null,
      setItem: () => false,
      removeItem: () => false,
    }
  }
}

// Helper function สำหรับ date formatting
export function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return day + "/" + month + "/" + year
  } catch (e) {
    return dateString
  }
}

// Helper function สำหรับ time formatting
export function formatTime(timeString) {
  try {
    const parts = timeString.split(":")
    if (parts.length >= 2) {
      return parts[0] + ":" + parts[1]
    }
    return timeString
  } catch (e) {
    return timeString
  }
}

// Helper function สำหรับ debounce
export function debounce(func, wait) {
  let timeout
  return function executedFunction() {
    const later = function () {
      clearTimeout(timeout)
      func.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Helper function สำหรับ throttle
export function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Helper function สำหรับ deep clone
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item))
  }

  if (typeof obj === "object") {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// Helper function สำหรับ validation
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone) {
  const re = /^[0-9]{9,10}$/
  return re.test(phone.replace(/[-\s]/g, ""))
}

export function validateRequired(value) {
  return value != null && String(value).trim().length > 0
}
