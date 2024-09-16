let debounceTimer;

// 顶级高亮词
const globalHighlightWords = ['广告'];

// 高亮词配置
const highlightConfig = {
  'www.zhihu.com': ['盐选'],
  'space.bilibili.com': ['公开收藏夹']
};

function getHighlightWords() {
  const hostname = window.location.hostname;
  return globalHighlightWords.concat(highlightConfig[hostname] || []);
}

function highlightAds() {
  const highlightWords = getHighlightWords();

  function highlightText(node) {
    let text = node.textContent;
    const regExp = new RegExp(`(${highlightWords.join('|')})`, 'gi');
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
