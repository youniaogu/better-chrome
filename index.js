const list = [
  { id: "zhihuAtag", text: "replace zhihu a tag" },
  { id: "steamAtag", text: "replace steam a tag" },
  { id: "zhihuModal", text: "remove zhihu login modal" },
];
const content = document.createElement("div");

function updateStorage(id) {
  return function () {
    chrome.storage.local.set({ [id]: this.checked });
  };
}

function createSwitch(id, text, value) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");

  div.className = "wrapper";
  label.className = "switch";
  input.type = "checkbox";

  if (value === undefined) {
    input.checked = false;
  } else {
    input.checked = value;
  }

  span1.textContent = text + "：";
  span2.className = "slider";

  input.onclick = updateStorage(id);

  label.appendChild(input);
  label.appendChild(span2);
  div.appendChild(span1);
  div.appendChild(label);

  return div;
}

list.forEach(function (obj) {
  chrome.storage.local.get(obj.id, (data) => {
    content.appendChild(createSwitch(obj.id, obj.text, data[obj.id]));
  });
});

window.addEventListener("DOMContentLoaded", function () {
  document.body.appendChild(content);
});
