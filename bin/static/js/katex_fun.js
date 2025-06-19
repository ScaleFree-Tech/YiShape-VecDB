/**
 * 加载KaTeX库及其依赖的异步函数
 * 动态加载KaTeX的CSS和JavaScript文件，包括auto-render扩展
 * @returns {Promise} 返回一个Promise，在所有资源加载完成后resolve
 */
function loadKatexInstance() {
    return new Promise((resolve, reject) => {
        // 检查KaTeX及其渲染函数是否已经加载到全局环境
        if (window.katex && window.renderMathInElement) {
            resolve();
            return;
        }

        // 加载CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/js/katex/katex.min.css';
        document.head.appendChild(link);

        // 加载JS
        const script = document.createElement('script');
        script.src = '/js/katex/katex.min.js';
        script.onload = () => {
            // 加载auto-render扩展
            const autoRenderScript = document.createElement('script');
            autoRenderScript.src = '/js/katex/auto-render.min.js';
            autoRenderScript.onload = () => resolve();
            autoRenderScript.onerror = reject;
            document.head.appendChild(autoRenderScript);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * 使用KaTeX渲染页面中的LaTeX公式
 * @param {string} css_style - CSS选择器，用于选择需要渲染LaTeX的元素
 */
function renderExistingLatex(css_style) {
    if (window.renderMathInElement) {
        // 选择所有匹配的元素
        const elements = document.querySelectorAll(css_style);
        elements.forEach(element => {
            // 对每个元素应用KaTeX渲染
            window.renderMathInElement(element, {
                // 定义LaTeX分隔符配置
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '(', right: ')', display: false },
                    { left: '[', right: ']', display: true },
                    { left: '{', right: '}', display: true },
                    { left: '\\langle', right: '\\rangle', display: true },
                    { left: '\\lceil', right: '\\rceil', display: true },
                    { left: '\\lfloor', right: '\\rfloor', display: true },

                ],
                throwOnError: false,
                output: 'html',  // 使用HTML输出
                macros: {        // 定义常用宏
                    "\\R": "\\mathbb{R}",
                    "\\ge": "\\geqslant",
                    "\\le": "\\leqslant",
                    "\\geq": "\\geqslant",
                    "\\leq": "\\leqslant"
                }
            });
        });
    }
}