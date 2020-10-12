const zhihu = true;

function replaceHref() {
  const aTags = document.getElementsByTagName("a");

  Array.from(aTags).forEach(a => {
    if (a.href.indexOf("https://link.zhihu.com/?target=") !== -1 && zhihu) {
      a.href = a.href
        .replace("https://link.zhihu.com/?target=", "")
        .replace("%3A", ":");
    }
  });
}

window.onload = event => {
  replaceHref();
};

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
