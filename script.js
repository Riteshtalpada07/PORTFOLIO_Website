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


window.addEventListener("load", function () {
    let loader = document.getElementById("loader");

    // Minimum time (2 seconds)
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.transition = "0.5s";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

    }, 2000); // 2000ms = 2 seconds
});