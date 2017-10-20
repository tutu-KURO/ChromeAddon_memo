
// document.addEventListener("DOMContentLoaded",function(){

//   new Vue({
//     el: '#editor',
//     data: {
//       input: '# Hello, Vue.js\n\n- hoge\n- foo\n- bar',
//     },
//     filters: {
//       marked: marked,
//     },
//   })

// })

(function () {
  'use strict';
   //the rest of the function
}());

var GL ={};
GL.commonmark = window.commonmark;
GL.writer = new commonmark.HtmlRenderer({sourcepos: true});
GL.reader = new commonmark.Parser();
GL.inputInterval = null;

// Convert Markdown to HTML
// (1) Code Highlight (hilight.js)
// (2) Math Fomula (mathjax.js)
GL.convertMarkDownToHtml = function(){
  var textarea = $("#input_area");
  var parsed = GL.reader.parse(textarea.val());
  // rendering
  $("div#preview_area").html(GL.writer.render(parsed));
  
  // Syntax Highlight (Use "highlight.js")
  $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
  });
  //MathJax.Hub.Typeset(["Typeset",MathJax.Hub, "posts-preview"]);  
};

// insert string at current Text Caret
GL.insertAtCaret = function(target, str){
    var obj = $(target);
    obj.focus();
    // Case of IE
    if(navigator.userAgent.match(/MSIE/)){
        var r = document.selection.createRange();
        r.text = str;
        r.select();
    // Case of Others
    }else{
        var s = obj.val();
        var p = obj.get(0).selectionStart;
        var np = p + str.length;
        obj.val(s.substr(0, p) + str + s.substr(p));
        obj.get(0).setSelectionRange(np, np);
    }
};

$(document).ready(function(){
  GL.convertMarkDownToHtml();

  // Add event of keypress & keyup
  $('textarea#input_area').keypress(function() {
    if(GL.inputInterval) self.clearTimeout(GL.inputInterval);
    GL.inputInterval = setTimeout(GL.convertMarkDownToHtml, 500);
  });
  $('textarea#input_area').keyup(function(e) {
    if (e.keyCode == 46 || e.keyCode == 8){
      if(GL.inputInterval) clearTimeout(GL.inputInterval);
      GL.inputInterval = setTimeout(GL.convertMarkDownToHtml, 500);
    }
  });
  
  // Add event of Drag & Drop of IMAGE
  // Change TEXTAREA Border 
  $('textarea#input_area').on('dragover', function(e){
    console.log("dragover");
    $('textarea#input_area').css('border', '4px green dashed');
  });
  $('textarea#input_area').on('dragleave', function(e){
    console.log("dragleave");
    $('textarea#input_area').css('border', '4px gray solid');
  });
  
  $('textarea#input_area').on('drop', function(e){
    e.preventDefault();  // Invalid Browser Default Drag Action
    var file = e.originalEvent.dataTransfer.files[0];
    var imageMarkdown = "![sample-image]("+window.URL.createObjectURL(file)+")";

    GL.insertAtCaret('textarea#input_area', imageMarkdown);
    $('textarea#input_area').css('border', '4px gray solid');

    GL.convertMarkDownToHtml();
  });
  
});