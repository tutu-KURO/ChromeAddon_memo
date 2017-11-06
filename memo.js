document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("textarea");
  const search = document.getElementById("search");
  const searchCount = document.getElementById("searchCount");
  const valueCount = document.getElementById("valueCount");
  const textSaveButton = document.getElementById('textSaveButton');
  const filename = document.getElementById('filename');

  function unHighlight(){
    textarea.innerHTML = textarea.innerHTML.replace(/<span.*?>/g, '').replace(/<\/span>/g, '');
  };


  chrome.storage.sync.get("key", function (value) {
    textarea.innerHTML = value.key;
  });

  function saveChanges() {
    chrome.storage.sync.set({ 'key': textarea.innerHTML }, function () {
    });
  }

  function textSearchCount() {
    if (!search.value.replace(/\s/g, "")) {
      return 0;
    } else {
      let theValue = textarea.innerText;
      let reg = new RegExp(search.value, 'gi');
      let count = (theValue.match(reg) || []).length;

      // console.log("本文" + theValue);
      // console.log();
      // console.log("検索文" + search.value);
      // console.log();
      // console.log("正規表現" + reg);
      // console.log();

      // console.log("カウント" + count)
      return count;
    };
  };

  function textCount(){
    let count = textarea.innerText.replace(/\s/g, "").length;
    valueCount.innerHTML = count + " 文字";
  };

  function textSave(){
    let name = filename.value || 'MemoText'
    let text = textarea.innerText;
    let blob = new Blob( [text], {type: 'text/plain'} );
    let a = document.createElement("a");
    a.href =URL.createObjectURL(blob);
    a.target = "_blank";
    a.download = name + ".text"
    a.click();

    URL.revokeObjectURL(blob);

  }

  textSaveButton.addEventListener('click',function(){
    let name = filename.value || 'MemoText'
   if(window.confirm(name + ".text" +"を保存します")){ 
    textSave();
  }else{
      window.alert('キャンセルされました'); 
  }

  })

  
  search.addEventListener("change", function () {
    unHighlight();
    let keyword = search.value;
    localSearchHighlight(keyword);
    let searchword = document.getElementsByClassName("searchword");
    for (let i = 0; i < searchword.length; i++) {
      searchword[i].style.backgroundColor = "#c9c6c3";
    }
    searchCount.innerHTML = textSearchCount() + "箇所一致";
  })

  
  textarea.addEventListener("keyup", function() {
    textSearchCount();
    textCount();
  });

  textarea.addEventListener("keydown", function (e) {
    if(e.keyCode === 27){
      unHighlight();
      saveChanges();
    };
  }, false)

  textarea.addEventListener("blur", function () {
    unHighlight();
    saveChanges();
  })

  

})

