document.addEventListener("DOMContentLoaded", () => {
    /**
     * 初始化开关状态 以及 添加开关事件。
     * @param {string} 开关ID 
     */
    function 初始化开关(开关ID) {
        const 开关 = document.getElementById(开关ID);

        // 从存储中加载当前状态
        chrome.storage.sync.get([开关ID], (result) => {
            开关.checked = result[开关ID] !== false;
        });

        开关.addEventListener("change", () => {
            chrome.storage.sync.set({ [开关ID]: 开关.checked });
        });
    }

    初始化开关("toggleHighlight");
});
  