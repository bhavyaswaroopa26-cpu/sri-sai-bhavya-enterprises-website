const loader = document.querySelector(".page-loader");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const robotButton = document.querySelector(".robot-button");
const robotMessage = document.querySelector(".robot-message");

function hideLoader() {
  loader?.classList.add("is-hidden");
  document.body.classList.remove("loading");
}

window.addEventListener("load", hideLoader, { once: true });
window.setTimeout(hideLoader, 1800);

function updateHeader() {
  header?.classList.toggle("is-sticky", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu?.classList.toggle("is-open", !isOpen);
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const enquiryForm = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");
enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  if (!enquiryForm.reportValidity()) return;

  const formData = new FormData(enquiryForm);
  const name = String(formData.get("name")).trim();
  const phone = String(formData.get("phone")).trim();
  const interest = String(formData.get("interest"));
  const whatsappNumber = String(formData.get("whatsappNumber"));
  const message = String(formData.get("message") || "").trim();
  const enquiry = [
    "Hello Sri Sai Bhavya Enterprises, I am interested in your tea and coffee products. Please share your wholesale details.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Interested in: ${interest}`,
    message ? `Message: ${message}` : ""
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank");
  if (!whatsappWindow) {
    formStatus.textContent = "Your browser blocked the new tab. Please use the WhatsApp button or allow pop-ups and try again.";
    return;
  }
  whatsappWindow.opener = null;
  formStatus.textContent = "Your enquiry is ready in WhatsApp. Send it there to reach our team.";
  enquiryForm.reset();
});

const feedbackForm = document.querySelector("#feedback-form");
const feedbackStatus = document.querySelector("#feedback-status");
feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!feedbackForm.reportValidity()) return;

  const formData = new FormData(feedbackForm);
  const feedback = {
    rating: String(formData.get("rating")),
    message: String(formData.get("feedback") || "").trim(),
    submittedAt: new Date().toISOString()
  };
  try {
    const savedFeedback = JSON.parse(localStorage.getItem("ssbe-feedback") || "[]");
    if (!Array.isArray(savedFeedback)) throw new Error("Stored feedback has an invalid format.");
    savedFeedback.push(feedback);
    localStorage.setItem("ssbe-feedback", JSON.stringify(savedFeedback));
    feedbackStatus.textContent = "Thank you for visiting and sharing your feedback! It has been saved on this device.";
    feedbackForm.reset();
  } catch (error) {
    feedbackStatus.textContent = "Thanks for visiting! Your browser could not save feedback on this device.";
    console.error("Could not save visitor feedback.", error);
  }
});

robotButton?.addEventListener("click", () => {
  document.querySelector("#feedback").scrollIntoView({ behavior: "smooth" });
  robotMessage?.classList.add("is-hidden");
});

window.setTimeout(() => robotMessage?.classList.add("is-hidden"), 9000);
