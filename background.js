function replaceZhihu(a) {
  if (a.href.indexOf("https://link.zhihu.com/?target=") !== -1) {
    a.href = decodeURIComponent(
      a.href.replace("https://link.zhihu.com/?target=", "")
    );
  }
}
function replaceSteam(a) {
  if (a.href.indexOf("https://steamcommunity.com/linkfilter/?url=") !== -1) {
    a.href = decodeURIComponent(
      a.href.replace("https://steamcommunity.com/linkfilter/?url=", "")
    );
  }
}
function replaceHref(fn) {
  const aTags = document.getElementsByTagName("a");

  if (!fn) {
    return;
  }

  Array.from(aTags).forEach(fn);
}

function removeZhihuLoginModal() {
  Array.from(
    document.getElementsByClassName("Modal-wrapper")
  ).forEach((modal) => modal.remove());
  Array.from(document.getElementsByTagName("html")).forEach(
    (html) => (html.style.overflow = "auto")
  );
}

function getConfig(key) {
  return new Promise((res) => {
    chrome.storage.local.get(key, (data) => {
      res(data[key]);
    });
  });
}

window.onload = function () {
  const origin = window.location.origin;

  getConfig("zhihuAtag").then((can) => {
    if (
      can &&
      ["https://www.zhihu.com", "https://zhuanlan.zhihu.com"].includes(origin)
    ) {
      replaceHref(replaceZhihu);
    }
  });

  getConfig("steamAtag").then((can) => {
    if (can && ["https://store.steampowered.com"].includes(origin)) {
      replaceHref(replaceSteam);
    }
  });

  getConfig("zhihuModal").then((can) => {
    if (
      can &&
      ["https://www.zhihu.com", "https://zhuanlan.zhihu.com"].includes(origin)
    ) {
      removeZhihuLoginModal();
    }
  });
};
