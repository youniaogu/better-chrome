const WATCH_OPTION_DEFAULT = { childList: true, subtree: false };
const PATTERN_ZHIHU = /^https:\/\/www\.zhihu\.com\/question\//;
const PATTERN_ZHIHU_ZHUANLAN = /^https:\/\/zhuanlan\.zhihu\.com\/p\//;
const PATTERN_STEAM = /^https:\/\/store\.steampowered\.com\/app\//;
const PATTERN_JUEJIN = /^https:\/\/juejin\.cn\/post\//;
const PATTERN_CSDN_1 = /^https:\/\/blog\.csdn\.net\/\w+\/article\/details\/\d+/;
const PATTERN_CSDN_2 = /^https:\/\/\w+\.blog\.csdn\.net\/article\/details\/\d+/;
const PATTERN_TWITTER = /^https:\/\/twitter\.com\/.+\/status\/.+/;
const PATTERN_GITHUB_REPOS = /^https:\/\/github\.com\/[a-z0-9A-Z\.\_\-]+\/[a-z0-9A-Z\.\_\-]+(?=[^\/]*$)/;

const href = window.location.href;
const isZhihu = PATTERN_ZHIHU_ZHUANLAN.test(href) || PATTERN_ZHIHU.test(href);
const isSteam = PATTERN_STEAM.test(href);
const isJuejin = PATTERN_JUEJIN.test(href);
const isCSDN = PATTERN_CSDN_1.test(href) || PATTERN_CSDN_2.test(href);
const isTwitter = PATTERN_TWITTER.test(href);
const isGithub = PATTERN_GITHUB_REPOS.test(href);

function removePrefix(str) {
  if (!str) {
    return;
  }

  Array.from(document.getElementsByTagName('a')).forEach((a) => {
    if (a.href.includes(str)) {
      a.href = decodeURIComponent(a.href.replace(str, ''));
    }
  });
}

function watchElement(element, callback, option = {}) {
  const observer = new MutationObserver(callback);
  observer.observe(element, { ...WATCH_OPTION_DEFAULT, ...option });
  return observer;
}

// ZHIHU
function replaceZhihuATag() {
  const element = document.querySelector('div[role=list]') || document.querySelector('div.Post-RichTextContainer');
  const replace = function () {
    removePrefix('https://link.zhihu.com/?target=');
  };

  replace();
  watchElement(element, replace);
}
function closeZhihuLoginModal() {
  const watcher = watchElement(document.body, function () {
    const close = document.querySelector('button.Modal-closeButton[aria-label=关闭]');
    if (close) {
      close.click();
      watcher.disconnect();
    }
  });
}

// STEAM
function replaceSteamATag() {
  const replace = function () {
    removePrefix('https://steamcommunity.com/linkfilter/?url=');
  };

  replace();
  watchElement(document.body, replace);
}

// JUEJIN
function replaceJuejinATag() {
  const replace = function () {
    removePrefix('https://link.juejin.cn/?target=');
  };

  replace();
  watchElement(document.body, replace);
}

// CSDN
function removeContentEvent() {
  const content = document.getElementById('content_views');
  const newContent = content.cloneNode(true);
  content.parentNode.replaceChild(newContent, content);
}
function closeCSDNLoginModal() {
  const watcher = watchElement(document.body, function () {
    const close = document.querySelector('div.passport-login-mark');
    if (close) {
      close.click();
      watcher.disconnect();
    }
  });
}

// TWITTER
function closeTwitterLoginModal() {
  const watcher = watchElement(
    document.body,
    function () {
      const dialog = document.querySelector('div[role=dialog] div[role=group]');
      if (dialog) {
        dialog.remove();
        document.documentElement.style.overflowY = 'auto';
      }
    },
    { subtree: true }
  );
}

// GITHUB
function getReposCreateTime(href) {
  return new Promise((res) => {
    fetch('https://api.github.com/repos/' + href.match(/(?<=https:\/\/github\.com\/)[^?]+(?=\?|$)/)[0])
      .then((response) => response.json())
      .then(({ created_at }) => {
        if (created_at) {
          const date = new Date(created_at);
          const createdTime = ` ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          res(createdTime);
        } else {
          res();
        }
      });
  });
}
function createSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  g.setAttribute('transform', `scale(${16 / 1024}, ${16 / 1024})`);

  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('class', 'octicon mr-2');
  path1.setAttribute(
    'd',
    'M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0z m316.78 828.78a446.4 446.4 0 1 1 96-142.42 446.59 446.59 0 0 1-96 142.42z'
  );
  path2.setAttribute('d', 'M672 512H512V224a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32h192a32 32 0 0 0 0-64z');

  g.appendChild(path1);
  g.appendChild(path2);
  svg.appendChild(g);

  return svg;
}
function displayCreateTime(createdTime) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  const svg = createSvg();
  const strong = document.createElement('strong');
  const text = document.createTextNode(' created ');

  h3.innerText = 'Created';
  h3.setAttribute('class', 'sr-only');

  strong.innerText = createdTime || ' Not Found';

  a.setAttribute('data-view-component', 'true');
  a.setAttribute('class', 'Link--muted');
  a.setAttribute('style', 'cursor: default;');
  a.append(svg);
  a.append(strong);
  createdTime && a.append(text);

  div.setAttribute('class', 'mt-2');
  div.appendChild(a);

  document.getElementsByClassName('BorderGrid-cell')[0].appendChild(h3);
  document.getElementsByClassName('BorderGrid-cell')[0].appendChild(div);
}

function getConfig(key) {
  return new Promise((res) => {
    chrome.storage.local.get(key, (data) => {
      res(data[key]);
    });
  });
}

(function launch() {
  if (isZhihu) {
    getConfig('zhihuAtag').then((can) => {
      can && replaceZhihuATag();
    });
    getConfig('zhihuModal').then((can) => {
      can && closeZhihuLoginModal();
    });
  }

  if (isSteam) {
    getConfig('steamAtag').then((can) => {
      can && replaceSteamATag();
    });
  }

  if (isJuejin) {
    getConfig('juejinAtag').then((can) => {
      can && replaceJuejinATag();
    });
  }

  if (isCSDN) {
    getConfig('csdnAtag').then((can) => {
      can && removeContentEvent();
    });
    getConfig('csdnModal').then((can) => {
      can && closeCSDNLoginModal();
    });
  }

  if (isTwitter) {
    getConfig('twitterModal').then((can) => {
      can && closeTwitterLoginModal();
    });
  }

  if (isGithub) {
    getConfig('reposCreateTime').then((can) => {
      can && getReposCreateTime(href).then(displayCreateTime);
    });
  }
})();
