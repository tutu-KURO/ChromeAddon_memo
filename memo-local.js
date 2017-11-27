document.addEventListener("DOMContentLoaded", function () {
  const contentEditable = document.getElementById("contentEditable");
  const search = document.getElementById("search");
  const searchCount = document.getElementById("searchCount");
  const valueCount = document.getElementById("valueCount");
  const textSaveButton = document.getElementById('textSaveButton');
  const filename = document.getElementById('filename');

  const addTab = document.getElementById("addTab");

  const data=[];
  let memos = [];
  let currentIdx = null;

  getStorageData();

  function getStorageData() {

    chrome.storage.local.get(['memos', 'currentIdx'], function(pairs) {
      if(pairs.memos) { 
        memos = pairs.memos;
      };
      for(var i = 0; i < memos.length; i++) {
        createTab();
      };
      if(pairs.currentIdx !== undefined) {
        currentIdx = pairs.currentIdx;
      };
      selectTab(currentIdx);
    });

  }

  function unHighlight() {
    contentEditable.innerHTML = contentEditable.innerHTML.replace(/<span.*?>/g, '').replace(/<\/span>/g, '');
  };

  function saveChanges() {
    //date.push(contentEditable.innerHTML);
    if (currentIdx !== null) {
      memos[currentIdx] = contentEditable.innerHTML;
    };

    console.log("save changes", memos);
    chrome.storage.local.set({ "memos" : memos }, function() {
    });
  };

  function textSearchCount() {
    if (!search.value.replace(/\s/g, "")) {
      return 0;
    } else {
      let theValue = contentEditable.innerText;
      let reg = new RegExp(search.value, 'gi');
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
    let name = filename.value || 'MemoText';
    let text = contentEditable.innerText;
    let blob = new Blob([text], { type: 'text/plain' });
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
    let tabLen = document.getElementsByClassName("nav-item tab").length;
    let li = document.createElement('li');
    li.className = "nav-item tab";
    li.id = `tab${tabLen + 1}`;
    let button = document.createElement("button");
    button.id = `tabButton${tabLen + 1}`;
    button.className ="btn btn-primary tabs";
    button.innerHTML = tabLen + 1;

    let deleteButton = document.createElement("button");
    deleteButton.id = `deleteButton${tabLen + 1}`;
    deleteButton.className = "btn btn-sm delete"
    deleteButton.innerHTML = "x";

    button.addEventListener('click', (e) => {
      e.preventDefault();
      selectTab(tabLen);
    });

    button.appendChild(deleteButton);
    li.appendChild(button);
    memoTab.insertBefore(li,addTab);

    while(memos.length < (tabLen + 1)) {
      memos.push("");
    }
    // saveChanges();

    deleteButton.addEventListener("click",function(){
      
      console.log("---")
      console.log("前",memos)
      console.log(currentIdx)
      memos.splice(currentIdx,1);
      
      console.log("後",memos)
  
      let ul = document.getElementById("memoTab")
      let li = document.getElementById(`tab${currentIdx + 1}`);
      
      ul.removeChild(li);

      saveChanges();
  
    });

    saveChanges();
  }



  

  function selectTab(idx) {
    currentIdx = idx;
    contentEditable.innerHTML = memos[currentIdx];
    chrome.storage.local.set({ currentIdx: currentIdx });
  }

  addTab.addEventListener("click",function(){
    createTab();
  })

  //ボタンをクリック時のポップアップ
  //テキストファイルとしてダウンロード
  textSaveButton.addEventListener('click', function () {
    let name = filename.value || 'MemoText';
    if (window.confirm(name + ".text" + "を保存します")) {
      textFileDownload();
    } else {
      window.alert('キャンセルされました');
    };
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
    if (contentEditable.querySelectorAll('span').length >= 1) {
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

