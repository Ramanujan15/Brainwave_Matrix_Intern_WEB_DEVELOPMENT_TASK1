if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("✅ Service Worker Registered"))
      .catch(err => console.log("❌ Service Worker Failed", err));
  }
  