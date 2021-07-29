const PATTERN_ZHIHU = /^https:\/\/www.zhihu.com\/question\//;
const PATTERN_ZHIHU_ZHUANLAN = /^https:\/\/zhuanlan.zhihu.com\/p\//;
const PATTERN_STEAM = /^https:\/\/store.steampowered.com\/app\//;
const PATTERN_JUEJIN = /^https:\/\/juejin.cn\/post\//;

function removePrefix(str) {
  const aTags = document.getElementsByTagName('a');

  if (!str) {
    return;
  }

  Array.from(aTags).forEach((a) => {
    if (a.href.indexOf(str) !== -1) {
      a.href = decodeURIComponent(a.href.replace(str, ''));
    }
  });
}

function removeZhihuLoginModal() {
  Array.from(document.getElementsByClassName('Modal-wrapper')).forEach((modal) => modal.remove());
  Array.from(document.getElementsByTagName('html')).forEach((html) => (html.style.overflow = 'auto'));
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
  const isZhihu = PATTERN_ZHIHU_ZHUANLAN.test(href) || PATTERN_ZHIHU.test(href);
  const isSteam = PATTERN_STEAM.test(href);
  const isJuejin = PATTERN_JUEJIN.test(href);

  if (isZhihu) {
    getConfig('zhihuAtag').then((can) => {
      can && removePrefix('https://link.zhihu.com/?target=');
    });

    getConfig('zhihuModal').then((can) => {
      can && removeZhihuLoginModal();
    });
  }

  if (isSteam) {
    getConfig('steamAtag').then((can) => {
      can && removePrefix('https://steamcommunity.com/linkfilter/?url=');
    });
  }

  if (isJuejin) {
    getConfig('juejinAtag').then((can) => {
      can && removePrefix('https://link.juejin.cn/?target=');
    });
  }
};
