let debounceTimer;

function highlightAds() {
  const searchWord = '广告';

  function highlightText(node) {
    const text = node.textContent;
    const regExp = new RegExp(`(${searchWord})`, 'gi');
    const newHTML = text.replace(regExp, '<span class="highlight">\$1</span>');

    if (newHTML !== text) {
      // 使用 DOMParser 来解析 HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(newHTML, 'text/html');
      const newNode = doc.body.firstChild;

      // 替换旧节点为新节点
      node.parentNode.replaceChild(newNode, node);
    }
  }

  function traverseDOM(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      highlightText(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseDOM(node.childNodes[i]);
      }
    }
  }

  traverseDOM(document.body);
}

function debounce(func, delay) {
  return function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };
}

// 监听 DOM 变化
function setupMutationObserver() {
  const observer = new MutationObserver(debounce(() => {
    highlightAds();
  }, 600)); // 延迟一下，不延迟会直接把网页搞崩掉

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}

// 检查是否开启此功能
chrome.storage.sync.get(['enabled'], (result) => {
  if (result.enabled !== false) {
    highlightAds();
    setupMutationObserver();
  }
});
