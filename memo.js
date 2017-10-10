document.addEventListener("DOMContentLoaded",function(){
  const textarea = document.getElementById("textarea")

  let theValue = textarea.value;
  
  chrome.storage.sync.get("key", function (value) {
    textarea.value = value.key;
  });

  function saveChanges() {
    let theValue = textarea.value;
    chrome.storage.sync.set({'key': theValue}, function() {
    });
  }

  textarea.addEventListener("keyup",saveChanges,false)

})

