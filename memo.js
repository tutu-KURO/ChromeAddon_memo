document.addEventListener("DOMContentLoaded",function(){
  const textarea = document.getElementById("textarea")
  const valueCount = document.getElementById("valueCount")

  
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
      let count = this.value.replace(/\r?\n/g,"").length
      valueCount.innerHTML  = count + " 文字"
  },false)

  textarea.addEventListener("keyup",function(event){
    console.lof(scrollHeight)

    console.lof(event.target.style.scrollHeight)

    console.lof()
    
    if(event.target.scrollHeight > event.target.offsetHeight){
      event.target.style.height = event.target.scrollHeight + "rem";
    } else {
      let hight ,lineHeight;
      while (true){
        height = Number(event.target.style.height.split("rem")[0]);
        lineHeight = Number(event.target.style.scrollHeight.split("rem")[0]);
        event.target.style.height = height - lineHeight + "rem";
        if(event.target.scrollHeight > event.target.offsetHeight){
          event.target.style.height = event.target.scrollHeight + "rem";
          break;
        }        
      }
    }
  })

  


})

