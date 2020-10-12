const zhihu = true;
const steam = true;

const replaceDict = {
  "https://www.zhihu.com": replaceZhihu,
  "https://zhuanlan.zhihu.com": replaceZhihu,
  "https://store.steampowered.com": replaceSteam,
};

function replaceZhihu(a) {
  if (a.href.indexOf("https://link.zhihu.com/?target=") !== -1 && zhihu) {
    a.href = a.href
      .replace("https://link.zhihu.com/?target=", "")
      .replace("%3A", ":");
  }
}
function replaceSteam(a) {
  if (
    a.href.indexOf("https://steamcommunity.com/linkfilter/?url=") !== -1 &&
    steam
  ) {
    a.href = a.href.replace("https://steamcommunity.com/linkfilter/?url=", "");
  }
}

function replaceHref() {
  const aTags = document.getElementsByTagName("a");
  const replace = replaceDict[window.location.origin];

  Array.from(aTags).forEach(replace);
}

window.onload = replaceHref;

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   for (key in changes) {
//     if (key !== "REPLACE_ZHIHU_A_TAG") {
//       return;
//     }

//     if (changes[key].newValue === false) {
//       zhihu = false;
//     } else {
//       zhihu = true;

//       replaceHref();
//     }
//   }
// });
