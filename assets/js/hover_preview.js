document.addEventListener("DOMContentLoaded", () => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("hover-preview");
    document.body.appendChild(tooltip);

    const tooltipCache = new Map();

    const showTooltip = (event, text) => {
        tooltip.innerText = text.trim();
        tooltip.style.display = "block";
        positionTooltip(event);
    };

    const moveTooltip = (event) => {
        positionTooltip(event);
    };

    const positionTooltip = (event) => {
        const tooltipWidth = tooltip.offsetWidth;
        const pageWidth = document.documentElement.clientWidth;
        const mouseX = event.pageX;
        const mouseY = event.pageY;

        if (mouseX + tooltipWidth + 10 > pageWidth) {
            tooltip.style.left = `${mouseX - tooltipWidth - 10}px`;
        } else {
            tooltip.style.left = `${mouseX + 10}px`;
        }

        tooltip.style.top = `${mouseY + 10}px`;
    };

    document.querySelectorAll('a[data-preview]').forEach(link => {
        link.addEventListener("mousemove", moveTooltip);
        link.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
        link.addEventListener("mouseenter", async (event) => {
            let href = link.getAttribute("data-preview");

            if (tooltipCache.has(href)) {
                showTooltip(event, tooltipCache.get(href));
                return;
            }

            let page = href;
            let anchor = "";

            if (href.includes("#")) {
                [page, anchor] = href.split("#");
            }

            const baseUrl = window.location.origin + window.location.pathname;
            const fullUrl = new URL(page, baseUrl).href;

            const response = await fetch(fullUrl);
            if (!response.ok) {
                return;
            }

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            let previewText = "";
            if (anchor) {
                const header = doc.getElementById(anchor);
                if (header) {
                    let next = header.nextElementSibling;
                    const abstract = next.querySelector('span[data-abstract]');
                    if (abstract) {
                        previewText = abstract.getAttribute('data-abstract');
                    } else {
                        if (!(next.innerHTML.includes("<code class") || next.innerHTML.includes('class="anchor"'))) {
                            previewText += `${next.innerText}`;
                        }
                    }
                }
            } else {
                const abstract = doc.querySelector("article h1 + * span[data-abstract]");
                if (abstract) {
                    previewText = abstract.getAttribute('data-abstract');
                } else {
                    const firstParagraph = doc.querySelector("p");
                    if (firstParagraph) {
                        previewText = firstParagraph.innerText;
                    }
                }
            }

            if (previewText) {
                showTooltip(event, previewText);
                tooltipCache.set(href, previewText);
            }
        });
    });
});
