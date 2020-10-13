function replaceZhihu(a) {
  if (a.href.indexOf("https://link.zhihu.com/?target=") !== -1) {
    a.href = a.href
      .replace("https://link.zhihu.com/?target=", "")
      .replace("%3A", ":");
  }
}
function replaceSteam(a) {
  if (a.href.indexOf("https://steamcommunity.com/linkfilter/?url=") !== -1) {
    a.href = a.href.replace("https://steamcommunity.com/linkfilter/?url=", "");
  }
}

function Replace() {
  this.zhihu = true;
  this.steam = true;
}
Replace.prototype.replaceDict = {
  "https://www.zhihu.com": { method: replaceZhihu, name: "zhihu" },
  "https://zhuanlan.zhihu.com": { method: replaceZhihu, name: "zhihu" },
  "https://store.steampowered.com": { method: replaceSteam, name: "steam" }
};
Replace.prototype.replaceHref = function() {
  const aTags = document.getElementsByTagName("a");
  const { method, name } = this.replaceDict[window.location.origin] || {};

  if (!method || !name) {
    return;
  }

  chrome.storage.local.get(name, data => {
    if (data[name] === false) {
      this[name] = false;
      return;
    }

    Array.from(aTags).forEach(method.bind(this));
  });
};

const replace = new Replace();

window.onload = function() {
  replace.replaceHref();
};
