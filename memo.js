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



  // textarea.addEventListener("keypress",function(event){

  //   if( event.keyCode === 13 ) { 
  //     splitByLine = function() {
  //       let text  = document.getElementById('textarea').value.replace(/\r\n|\r/g, "\n");
  //       let lines = text.split( '\n' );
  //       let outArray = new Array();
  //       for(let i = 0;i < lines.length;i++ ){
  //         // 空行は無視する
  //         if(lines[i] == ''){
  //           continue;
  //         }
  //         outArray.push( lines[i] );
  //       }
  //       return outArray;
  //     }
  
  //     console.log(splitByLine())
  //     console.log(splitByLine().length)
      
    
  //   }

  // })

  


})

