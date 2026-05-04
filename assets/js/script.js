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

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const CONTACT_REQUEST_TIMEOUT_MS = 15000;

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get("name")?.toString().trim(),
            email: formData.get("email")?.toString().trim(),
            message: formData.get("message")?.toString().trim()
        };

        if (!payload.name || !payload.email || !payload.message) {
            if (contactStatus) {
                contactStatus.textContent = "Please fill all fields.";
                contactStatus.className = "text-center mt-3 mb-0 small text-danger";
            }
            return;
        }

        if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = "Sending...";
        }

        if (contactStatus) {
            contactStatus.textContent = "";
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONTACT_REQUEST_TIMEOUT_MS);

            const response = await fetch("/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const result = await response.json();

            if (response.ok && result.ok) {
                contactForm.reset();
                if (contactStatus) {
                    contactStatus.textContent = result.message || "Message sent successfully!";
                    contactStatus.className = "text-center mt-3 mb-0 small text-success";
                }
            } else {
                throw new Error(result.message || "Unable to send message.");
            }
        } catch (error) {
            if (contactStatus) {
                const message = error.name === "AbortError"
                    ? "Request timed out. Please try again."
                    : (error.message || "Unable to send message.");
                contactStatus.textContent = message;
                contactStatus.className = "text-center mt-3 mb-0 small text-danger";
            }
        } finally {
            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = "Send Message";
            }
        }
    });
}

const navbarCollapse = document.getElementById("navbarNav");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

if (navbarCollapse && navLinks.length) {
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            // Auto-close expanded mobile menu after navigation tap.
            if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}
