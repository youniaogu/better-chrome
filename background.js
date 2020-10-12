function Replace() {
  this.zhihu = true;
  this.steam = true;
}

Replace.prototype.replaceDict = {
  "https://www.zhihu.com": {
    replaceMethod: this.replaceZhihu,
    storageName: "zhihu",
  },
  "https://zhuanlan.zhihu.com": {
    replaceMethod: this.replaceZhihu,
    storageName: "zhihu",
  },
  "https://store.steampowered.com": {
    replaceMethod: this.replaceSteam,
    storageName: "steam",
  },
};
Replace.prototype.replaceHref = function () {
  const aTags = document.getElementsByTagName("a");
  const { replaceMethod, storageName } = this.replaceDict[
    window.location.origin
  ];

  chrome.storage.local.get(storageName, (data) => {
    if (data[storageName] === false) {
      this[storageName] = false;
    }

    if (replaceMethod) {
      Array.from(aTags).forEach(replaceMethod.bind(this));
    }
  });
};
Replace.prototype.replaceZhihu = function (a) {
  if (a.href.indexOf("https://link.zhihu.com/?target=") !== -1 && this.zhihu) {
    a.href = a.href
      .replace("https://link.zhihu.com/?target=", "")
      .replace("%3A", ":");
  }
};
Replace.prototype.replaceSteam = function (a) {
  if (
    a.href.indexOf("https://steamcommunity.com/linkfilter/?url=") !== -1 &&
    this.steam
  ) {
    a.href = a.href.replace("https://steamcommunity.com/linkfilter/?url=", "");
  }
};

const replace = new Replace();

window.onload = function () {
  replace.replaceHref();
};
