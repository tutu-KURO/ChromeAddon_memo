document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("textarea");
  const search 　= document.getElementById("search");
  const searchCount = document.getElementById("searchCount");
  const valueCount = document.getElementById("valueCount");

  


  chrome.storage.sync.get("key", function (value) {
    textarea.value = value.key;
  });

  function saveChanges() {
    let theValue = textarea.value;
    chrome.storage.sync.set({ 'key': theValue }, function () {
    });
  }

  function textSearchCount() {
    if (!search.value.replace(/\s/g, "")) {
      return 0;
    } else {
      let theValue = textarea.value;
      let reg = new RegExp(search.value, 'gi');
      let count = (theValue.match(reg) || []).length;
      
      //console.log(theValue.match(reg))
      // .fontcolor("red");

      console.log("カウント" + count)
      return count;
    }
  }

  search.addEventListener("keyup", function () {
    searchCount.innerHTML = textSearchCount() + "文字";
    
    
  })


  textarea.addEventListener("keyup", function () {
    saveChanges();
    textSearchCount();
    let count = this.value.replace(/\s/g, "").length;
    valueCount.innerHTML = count + " 文字";
  }, false)




})

