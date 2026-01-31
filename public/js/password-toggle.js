document.addEventListener("DOMContentLoaded", function() {
    const pswdBtn = document.querySelector("#pswdBtn");
    const pswdInput = document.querySelector("#account_password");
    const showIcon = document.querySelector(".show-icon");
    const hideIcon = document.querySelector(".hide-icon");

    if (pswdBtn) {
        pswdBtn.addEventListener("click", function() {
            const type = pswdInput.getAttribute("type");
            if (type === "password") {
                pswdInput.setAttribute("type", "text");
                showIcon.classList.add("hidden");
                hideIcon.classList.remove("hidden");
                pswdBtn.setAttribute("aria-label", "Hide password");
            } else {
                pswdInput.setAttribute("type", "password");
                showIcon.classList.remove("hidden");
                hideIcon.classList.add("hidden");
                pswdBtn.setAttribute("aria-label", "Show password");
            }
        });
    }
});