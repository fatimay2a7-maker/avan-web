const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "بستن منو" : "باز کردن منو");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "باز کردن منو");
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  wrapper.classList.toggle("has-error", Boolean(message));
  const error = wrapper.querySelector(".field-error");
  if (error) error.textContent = message || "";
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(field) {
  const value = field.value.trim();

  if (field.id === "name") {
    if (value.length < 2) return "نام باید حداقل ۲ حرف داشته باشد.";
  }
  if (field.id === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "لطفاً یک ایمیل معتبر وارد کنید.";
  }
  if (field.id === "message") {
    if (value.length < 10) return "لطفاً حداقل ۱۰ حرف درباره پروژه توضیح دهید.";
  }
  return "";
}

if (contactForm && formStatus) {
  const requiredFields = [
    contactForm.querySelector("#name"),
    contactForm.querySelector("#email"),
    contactForm.querySelector("#message")
  ];

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => setFieldError(field, validateField(field)));
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("has-error")) {
        setFieldError(field, validateField(field));
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    formStatus.classList.remove("error");

    let firstInvalidField = null;
    requiredFields.forEach((field) => {
      const error = validateField(field);
      setFieldError(field, error);
      if (error && !firstInvalidField) firstInvalidField = field;
    });

    if (firstInvalidField) {
      formStatus.textContent = "لطفاً موارد مشخص‌شده را اصلاح کنید.";
      formStatus.classList.add("error");
      firstInvalidField.focus();
      return;
    }

    formStatus.textContent = "اعتبارسنجی با موفقیت انجام شد! برای ارسال واقعی، باید فرم را به بک‌اند یا سرویس فرم متصل کنید.";
    contactForm.reset();
    requiredFields.forEach((field) => setFieldError(field, ""));
  });
}
