document.addEventListener("DOMContentLoaded", function () {
  const contentEditable = document.getElementById("contentEditable");
  const search = document.getElementById("search");
  const searchCount = document.getElementById("searchCount");
  const valueCount = document.getElementById("valueCount");
  const textSaveButton = document.getElementById('textSaveButton');
  const filename = document.getElementById('filename');

  chrome.storage.sync.get("key", function (value) {
    contentEditable.innerHTML = value.key;
    textCount();
  });

  function unHighlight(){
    contentEditable.innerHTML = contentEditable.innerHTML.replace(/<span.*?>/g, '').replace(/<\/span>/g, '');
  };

  function saveChanges() {
    chrome.storage.sync.set({ 'key': contentEditable.innerHTML }, function () {
    });
  }

  function textSearchCount() {
    if(!search.value.replace(/\s/g, "")){
      return 0;
    }else{
      let theValue = contentEditable.innerText;
      let reg = new RegExp(search.value, 'gi');
      let count = (theValue.match(reg) || []).length;
      return count;
    };
  };

  function textCount(){
    let count = contentEditable.innerText.replace(/\s/g, "").length;
    valueCount.innerHTML = count + " 文字";
  };

  function textFileDownload(){
    let name = filename.value || 'MemoText';
    let text = contentEditable.innerText;
    let blob = new Blob( [text], {type: 'text/plain'} );
    let a = document.createElement("a");
    a.href =URL.createObjectURL(blob);
    a.target = "_blank";
    a.download = name + ".text"
    a.click();
    URL.revokeObjectURL(blob);
  };

  //ボタンをクリック時のポップアップ
  //テキストファイルとしてダウンロード
  textSaveButton.addEventListener('click',function(){
    let name = filename.value || 'MemoText';
   if(window.confirm(name + ".text" +"を保存します")){ 
    textFileDownload();
  }else{
      window.alert('キャンセルされました'); 
  };
  });

  // searchエリアが変わったらハイライトを消し、ハイライトをしなおす
  //サーチして一致した数を返す
  search.addEventListener("change", function () {
    unHighlight();
    let keyword = search.value;
    localSearchHighlight(keyword);
    let searchword = document.getElementsByClassName("searchword");
    for (let i = 0; i < searchword.length; i++) {
      searchword[i].style.backgroundColor = "#c9c6c3";
    };
    searchCount.innerHTML = textSearchCount() + "箇所一致";
  });

  //keyupごとに、テキストカウントとサーチカウント
  contentEditable.addEventListener("keyup", function() {
    textCount();
  });

  // escKeyでテキストを保存
  contentEditable.addEventListener("keydown", function (e) {
    if(e.keyCode === 27){
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

