/**
 * 高亮页面中所有包含指定关键词的文本节点。
 * 该函数会遍历整个 DOM 树，将匹配到的文本用 <span class="highlight"> 包裹。
 */
function highlightAds() {
  console.debug("[高亮“广告”] 尝试高亮“广告”...")

  const searchWord = "广告";

  /**
   * 高亮单个文本节点中的关键词。
   * @param {Node} node - 需要处理的文本节点
   */
  function highlightText(node) {
    const text = node.textContent;
    const regExp = new RegExp(`(${searchWord})`, "gi");
    const newHTML = text.replace(regExp, "<span class=\"highlight\">\$1</span>");

    if (newHTML !== text) {
      // 使用 DOMParser 来解析 HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(newHTML, "text/html");
      const newNode = doc.body.firstChild;

      // 替换旧节点为新节点
      node.parentNode.replaceChild(newNode, node);
    }

    console.debug("[高亮“广告”] 高亮“广告”完毕")
  }

  /**
   * 递归遍历 DOM 树，查找所有文本节点并进行高亮处理。
   * @param {Node} node - 当前遍历到的节点
   */
  function traverseDOM(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      highlightText(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseDOM(node.childNodes[i]);
      }
    }
  }

  // 从 document.body 开始遍历整个页面
  traverseDOM(document.body);
}

/**
 * 防抖函数，避免高频率触发导致性能问题。
 * @param {Function} func - 需要防抖处理的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 包装后的防抖函数
 */
function debounce(func, delay) {
  let debounceTimer;
  return function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };
}

/**
 * 设置 MutationObserver 监听 DOM 变化，
 * 页面结构发生变化时自动重新高亮关键词。
 */
function setupMutationObserver() {
  const observer = new MutationObserver(debounce(() => {
    highlightAds();
  }, 600)); // 延迟一下，不延迟会直接把网页搞崩掉

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}

// 检查是否开启此功能
chrome.storage.sync.get(["enabled"], (result) => {
  if (result.enabled !== false) {
    highlightAds();
    setupMutationObserver();
  }
});
