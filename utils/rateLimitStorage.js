export function getRateLimitExpiry (key) {
  try {
    const ls = parseInt(localStorage.getItem(key), 10)
    if (ls && ls > Date.now()) return ls
  } catch (e) {}
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'))
    if (match) {
      const val = parseInt(decodeURIComponent(match[1]), 10)
      if (val && val > Date.now()) return val
    }
  } catch (e) {}
  return null
}

export function setRateLimitExpiry (key, expiryMs) {
  try { localStorage.setItem(key, String(expiryMs)) } catch (e) {}
  try {
    const expires = new Date(expiryMs).toUTCString()
    document.cookie = `${key}=${expiryMs}; expires=${expires}; path=/; SameSite=Strict`
  } catch (e) {}
}

export function clearRateLimitExpiry (key) {
  try { localStorage.removeItem(key) } catch (e) {}
  try {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
  } catch (e) {}
}
