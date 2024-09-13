function highlightAds() {
  const searchWord = '广告';

  function highlightText(node) {
    const text = node.textContent;
    const regExp = new RegExp(`(${searchWord})`, 'gi');
    const newHTML = text.replace(regExp, '<span class="highlight">\$1</span>');

    if (newHTML !== text) {
      const newNode = document.createElement('span');
      newNode.innerHTML = newHTML;
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

// 检查是否开启此功能
chrome.storage.sync.get(['enabled'], (result) => {
  if (result.enabled !== false) {
    highlightAds();
  }
});
