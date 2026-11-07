async function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Erreur de chargement : ${file}`);
        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    await Promise.all([
        loadComponent("#header-placeholder", "./header.html"),
        loadComponent("#footer-placeholder", "./footer.html"),
    ]);

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".menu a, .footer-links a").forEach((link) => {
        const linkPage = link.getAttribute("href")?.split("#")[0];


        if (
            linkPage === currentPage ||
            (currentPage === "index.html" && (linkPage === "./" || linkPage === ""))
        ) {
            link.setAttribute("aria-current", "page");
        }
    });
});
