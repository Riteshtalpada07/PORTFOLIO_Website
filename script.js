const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const applyTheme = (theme) => {
    const isDark = theme === "dark";
    body.classList.toggle("dark-theme", isDark);

    if (themeToggle) {
        themeToggle.classList.toggle("dark", isDark);
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }
};

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
    themeToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newTheme = body.classList.contains("dark-theme") ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });

    themeToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            themeToggle.click();
        }
    });
}

const loader = document.getElementById("loader");

if (loader) {
    let isLoaderHidden = false;
    const minVisibleMs = 2500;
    const scriptStart = Date.now();

    const hideLoader = () => {
        if (isLoaderHidden) return;
        isLoaderHidden = true;

        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.4s ease";
        loader.style.pointerEvents = "none";

        setTimeout(() => {
            loader.style.display = "none";
        }, 400);
    };

    const hideLoaderWithMinDelay = () => {
        const elapsed = Date.now() - scriptStart;
        const remaining = Math.max(0, minVisibleMs - elapsed);
        setTimeout(hideLoader, remaining);
    };

    // Hide when DOM is ready; don't wait for every external asset.
    document.addEventListener("DOMContentLoaded", hideLoaderWithMinDelay, { once: true });
    window.addEventListener("load", hideLoaderWithMinDelay, { once: true });

    // Final safety fallback so loader can never stay forever.
    setTimeout(hideLoader, 5000);
}
