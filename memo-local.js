document.addEventListener("DOMContentLoaded", function () {
  const contentEditable = document.getElementById("contentEditable");
  const search = document.getElementById("search");
  const searchCount = document.getElementById("searchCount");
  const valueCount = document.getElementById("valueCount");
  const textSaveButton = document.getElementById("textSaveButton");
  const filename = document.getElementById("filename");
  const addTab = document.getElementById("addTab");
  const deleteTab = document.getElementById("deleteTab");

  const data = [];
  let memos = [];
  let currentIdx = null;

  getStorageData();

  // chrome.storage.local.clear();

  function getStorageData() {

    chrome.storage.local.get(["memos", "currentIdx"], function (pairs) {
      if (pairs.memos) {
        memos = pairs.memos;
      };
      for (var i = 0; i < memos.length; i++) {
        createTab();
      };
      if (pairs.currentIdx !== undefined) {
        currentIdx = pairs.currentIdx;
      };
      selectTab(currentIdx);
    });

  }

  function unHighlight() {
    contentEditable.innerHTML = contentEditable.innerHTML.replace(/<span.*?>/g, "").replace(/<\/span>/g, "");
  };

  function saveChanges() {
    if (currentIdx !== null) {
      memos[currentIdx] = contentEditable.innerHTML;
    };
    console.log("save changes", memos);
    chrome.storage.local.set({ "memos": memos }, function () {
    });
  };

  function textSearchCount() {
    if (!search.value.replace(/\s/g, "")) {
      return 0;
    } else {
      let theValue = contentEditable.innerText;
      let reg = new RegExp(search.value, "gi");
      let count = (theValue.match(reg) || []).length;

      // console.log("theValue",theValue);
      // console.log();      
      // console.log("search.value",search.value);
      // console.log();
      // console.log("reg",reg);
      // console.log();
      // console.log("count",count);

      return count;
    };
  };

  function textCount() {
    let count = contentEditable.innerText.replace(/\s/g, "").length;
    valueCount.innerHTML = count + " 文字";
  };

  function textFileDownload() {
    let name = filename.value || "MemoText";
    let text = contentEditable.innerText;
    let blob = new Blob([text], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.target = "_blank";
    a.download = name + ".text"
    a.click();
    URL.revokeObjectURL(blob);
  };


  function createTab() {
    let memoTab = document.getElementById("memoTab");
    let addTab = document.getElementById("addTab");
    let tabLen = document.getElementsByClassName("btn btn-secondary tabs").length;
    let li = document.createElement("li");
    li.className = "nav-item tab ";
    li.id = `tab${tabLen + 1}`;

    let input = document.createElement("input");
    input.type = "radio"
    input.name = "tabsets"
    input.id = `tabcheck${tabLen + 1}`;

    let button = document.createElement("button");
    button.id = `tabButton${tabLen + 1}`;
    button.className = "btn btn-secondary tabs";
    button.innerHTML = tabLen + 1;

    button.addEventListener("click", (e) => {
      let tabs = document.getElementsByClassName("tabs");
      for (let i = 0; tabs.length > i; i++) {
        tabs[i].classList.remove("selecting");
      };
      e.preventDefault();

      selectTab(tabLen);
      let nawTab = document.getElementById(`tabButton${currentIdx + 1}`);
      nawTab.classList.add("selecting")

      textCount();

    });
    memoTab.appendChild(input);
    memoTab.appendChild(button);

    while (memos.length < (tabLen + 1)) {
      memos.push("");
    }

    saveChanges();
  }


  deleteTab.addEventListener("click", function () {
    let tabLen = document.getElementsByClassName("btn btn-secondary tabs").length;
    let ul = document.getElementById("memoTab");
    let tabs = document.getElementsByClassName("tabs");
    memos.splice(currentIdx, 1);
    while (tabs = ul.lastChild) {
      ul.removeChild(tabs);
    };
    selectTab(0);
    saveChanges();
    getStorageData();
    console.log(memos)
  });



  function selectTab(idx) {
    currentIdx = idx;
    contentEditable.innerHTML = memos[currentIdx];
    chrome.storage.local.set({ currentIdx: currentIdx });
  };

  addTab.addEventListener("click", function () {
    createTab();
  });

  //テキストファイルとしてダウンロード
  textSaveButton.addEventListener("click", function () {
    let name = filename.value || "MemoText";
    textFileDownload();
  });

  // searchエリアが変わったらハイライトを消し、ハイライトをしなおす
  //サーチして一致した数を返す
  search.addEventListener("keypress", function () {
    unHighlight();
    let keyword = search.value;
    localSearchHighlight(keyword);
    let searchword = document.getElementsByClassName("searchword");
    for (let i = 0; i < searchword.length; i++) {
      searchword[i].style.backgroundColor = "#c9c6c3";
    };
    searchCount.innerHTML = textSearchCount() + "箇所一致";
  });


  contentEditable.addEventListener("focus", function () {
    if (contentEditable.querySelectorAll("span").length >= 1) {
      unHighlight();
    }
  });

  //keyupごとに、テキストカウントとサーチカウント
  contentEditable.addEventListener("keyup", function () {
    textCount();
    saveChanges();
  });

  // escKeyでテキストを保存
  contentEditable.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
      unHighlight();
      saveChanges();
    };
  }, false);

  // blurでテキストを保存
  contentEditable.addEventListener("blur", function () {
    unHighlight();
    saveChanges();
  });

});

