const list = ["zhihu", "steam"];
const content = document.createElement("div");

function updateStorage(text) {
  return function() {
    chrome.storage.local.set({ [text]: this.checked });
  };
}

function createSwitch(text, value) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");

  div.className = "wrapper";
  label.className = "switch";
  input.type = "checkbox";
  input.checked = value !== false;
  span1.textContent = text + "：";
  span2.className = "slider";

  input.onclick = updateStorage(text);

  label.appendChild(input);
  label.appendChild(span2);
  div.appendChild(span1);
  div.appendChild(label);

  return div;
}

list.forEach(function(text) {
  chrome.storage.local.get(text, data => {
    content.appendChild(createSwitch(text, data[text]));
  });
});

window.addEventListener("DOMContentLoaded", function() {
  document.body.appendChild(content);
});
