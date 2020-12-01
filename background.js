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
function replaceHref(fn) {
  const aTags = document.getElementsByTagName("a");

  if (!fn) {
    return;
  }

  Array.from(aTags).forEach(fn);
}

function removeQuestionLoginModal() {
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
  const href = window.location.href;
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
    if (can && href.indexOf("https://www.zhihu.com/question") !== -1) {
      removeQuestionLoginModal();
    }
  });
};
