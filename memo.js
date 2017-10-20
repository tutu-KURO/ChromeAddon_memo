document.addEventListener("DOMContentLoaded",function(){
  const textarea = document.getElementById("textarea")
  const valueCount = document.getElementById("valueCount")
  const md = document.getElementById("md")
  
  chrome.storage.sync.get("key", function (value) {
    textarea.value = value.key;
  });

  function saveChanges() {
    let theValue = textarea.value;
    chrome.storage.sync.set({'key': theValue}, function() {
    });
  }

  textarea.addEventListener("keyup", function() {
    saveChanges();
      let count = this.value.replace(/\s/g,"").length
      valueCount.innerHTML  = count + " 文字"
  },false)

  function mdChange (){
    location.href ="md.html"
  }  


})

