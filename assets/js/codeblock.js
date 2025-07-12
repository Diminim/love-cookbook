document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre code").forEach(codeBlock => {
        const pre = codeBlock.closest("pre");
        const wrapper = document.createElement("div");
        wrapper.className = "code-block";

        const linesSpan = codeBlock.querySelector("span[data-attrs]");
        let highlightLines = new Set();

        if (linesSpan) {
            const ranges = linesSpan.getAttribute("data-attrs").split(",");
            ranges.forEach(range => {
                const [start, end] = range.split("-").map(Number);
                if (end) {
                    for (let i = start; i <= end; i++) {
                        highlightLines.add(i);
                    }
                } else {
                    highlightLines.add(start);
                }
            });

            linesSpan.remove();
        }

        const codeText = codeBlock.innerText;
        const totalLines = codeText.split("\n").length;

        const highlightDiv = document.createElement("div");
        highlightDiv.className = "highlight-lines";

        for (let i = 1; i < totalLines; i++) {
            const highlightLine = document.createElement("div");
            highlightLine.className = "highlight-line";
            if (highlightLines.has(i)) {
                highlightLine.classList.add("active");
            }

            highlightDiv.appendChild(highlightLine);
        }

        wrapper.appendChild(pre.cloneNode(true));
        wrapper.appendChild(highlightDiv);
        pre.replaceWith(wrapper);
    });
});
