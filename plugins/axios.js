class CacheManager {
  constructor(axios, app, inject) {
    this.$axios = axios;
    this.app = app;

    this.cache = new Map();
    this.pending = new Map();
    this.meCache = { tokenKey: null, data: null };

    this.DEFAULT_TTL = 5 * 60 * 1000;

    this.init();
    this.startGC();
    this.expose(inject);
  }

  getTokenKey = () =>
    this.app.$auth?.$storage?.getUniversal("_token.local") || null;

  getKey(config) {
    const url = (config.url || "").split("?")[0];
    const params = JSON.stringify(config.params || {});
    return `${url}:${params}`;
  }

  shouldBypass(config) {
    return config?.skipCache || config?.headers?.["x-skip-cache"];
  }

  getCache(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  setCache(key, data, ttl) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttl || this.DEFAULT_TTL)
    });
  }

  updateCache(targetUrl, updateFn) {
    if (!targetUrl || typeof updateFn !== "function") return;

    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(targetUrl)) {
        const newData = updateFn(entry.data);
        this.cache.set(key, {
          ...entry,
          data: newData
        });
      }
    }
  }

  invalidate(pattern) {
    if (!pattern) return;

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll() {
    this.cache.clear();
    this.pending.clear();
    this.meCache = { tokenKey: null, data: null };
  }

  async handleRequest(config) {
    const method = (config.method || "get").toLowerCase();
    const tokenKey = this.getTokenKey();

    if (this.shouldBypass(config)) return config;

    if (
      config.url?.endsWith("/api/v1/me") &&
      method === "get" &&
      this.meCache.data &&
      this.meCache.tokenKey === tokenKey
    ) {
      return this.serveFromCache(config, this.meCache.data, "ME_HIT");
    }
    if (method !== "get" || !config.cache) return config;

    const key = this.getKey(config);

    const cached = this.getCache(key);
    if (cached) {
      return this.serveFromCache(config, cached, "HIT");
    }

    if (this.pending.has(key)) {
      return this.servePending(config, this.pending.get(key));
    }

    const request = this.$axios({
      ...config,
      skipCache: true
    });

    this.pending.set(key, request);

    return this.servePending(config, request);
  }

  serveFromCache(config, data, type) {
    config.adapter = () =>
      Promise.resolve({
        data,
        status: 200,
        statusText: "OK",
        headers: { "x-cache": type },
        config,
        request: { fromCache: true }
      });

    return config;
  }

  servePending(config, promise) {
    config.adapter = () =>
      promise.then(res => ({
        ...res,
        headers: { ...(res.headers || {}), "x-cache": "PENDING" }
      }));

    return config;
  }

  init() {
    this.$axios.onRequest(config => this.handleRequest(config));

    this.$axios.onResponse(response => {
      const { config, data } = response;
      const method = (config.method || "get").toLowerCase();
      const key = this.getKey(config);

      this.pending.delete(key);
      if (config.skipInvalidate) {
        return response;
      }
      if (["post", "put", "patch", "delete"].includes(method)) {
        this.invalidate(config.url);
        return response;
      }

      if (config.url?.endsWith("/api/v1/me")) {
        this.meCache = {
          tokenKey: this.getTokenKey(),
          data
        };
        return response;
      }

      if (method === "get" && config.cache) {
        this.setCache(key, data, config.ttl);
      }

      return response;
    });

    this.$axios.onResponseError(err => {
      if (err.response?.status === 401) {
        this.clearAll();
        this.app.$auth.logout();
      }
      return Promise.reject(err);
    });
  }

  startGC() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, val] of this.cache.entries()) {
        if (val.expiresAt < now) {
          this.cache.delete(key);
        }
      }
    }, 60 * 1000);
  }

  expose(inject) {
    inject("invalidateCache", p => this.invalidate(p));
    this.app.$invalidateCache = p => this.invalidate(p);

    inject("updateCache", (url, fn) => this.updateCache(url, fn));
    this.app.$updateCache = (url, fn) => this.updateCache(url, fn);

    inject("clearCache", () => this.clearAll());
    this.app.$clearCache = () => this.clearAll();
  }
}

export default function(context, inject) {
  new CacheManager(context.$axios, context.app, inject);
}
