document.addEventListener('DOMContentLoaded', () => {
    const toggleHighlight = document.getElementById('toggleHighlight');
  
    // 从存储中加载当前状态
    chrome.storage.sync.get(['enabled'], (result) => {
      toggleHighlight.checked = result.enabled !== false;
    });
  
    toggleHighlight.addEventListener('change', () => {
      chrome.storage.sync.set({ enabled: toggleHighlight.checked });
    });
});
  