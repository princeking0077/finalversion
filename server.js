// Wrapper to support ESM import in Hostinger's environment
(async () => {
    try {
        await import('./backend/app.js');
    } catch (e) {
        console.error("Failed to start application:", e);
    }
})();
