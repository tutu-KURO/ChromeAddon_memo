
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



document.addEventListener("DOMContentLoaded", function () {

  const textarea = document.getElementById("input_area");

  (function () {
    'use strict';
    //the rest of the function
  }());

  let GL = {};
  GL.commonmark = window.commonmark;
  GL.writer = new commonmark.HtmlRenderer({ sourcepos: true });
  GL.reader = new commonmark.Parser();
  GL.inputInterval = null;

  // Convert Markdown to HTML
  // (1) Code Highlight (hilight.js)
  // (2) Math Fomula (mathjax.js)
  GL.convertMarkDownToHtml = function () {
    let textarea = $("#input_area");
    let parsed = GL.reader.parse(textarea.val());
    // rendering
    $("div#preview_area").html(GL.writer.render(parsed));

    // Syntax Highlight (Use "highlight.js")
    $('pre code').each(function (i, block) {
      hljs.highlightBlock(block);
    });
    //MathJax.Hub.Typeset(["Typeset",MathJax.Hub, "posts-preview"]);  
  };

  // insert string at current Text Caret
  GL.insertAtCaret = function (target, str) {
    let obj = $(target);
    obj.focus();
    // Case of IE
    if (navigator.userAgent.match(/MSIE/)) {
      let r = document.selection.createRange();
      r.text = str;
      r.select();
      // Case of Others
    } else {
      let s = obj.val();
      let p = obj.get(0).selectionStart;
      let np = p + str.length;
      obj.val(s.substr(0, p) + str + s.substr(p));
      obj.get(0).setSelectionRange(np, np);
    }
  };

  $(document).ready(function () {
    GL.convertMarkDownToHtml();

    // Add event of keypress & keyup
    $('textarea#input_area').keypress(function () {
      if (GL.inputInterval) self.clearTimeout(GL.inputInterval);
      GL.inputInterval = setTimeout(GL.convertMarkDownToHtml, 500);
    });
    $('textarea#input_area').keyup(function (e) {
      if (e.keyCode == 46 || e.keyCode == 8) {
        if (GL.inputInterval) clearTimeout(GL.inputInterval);
        GL.inputInterval = setTimeout(GL.convertMarkDownToHtml, 500);
      }
    });

    // Add event of Drag & Drop of IMAGE
    // Change TEXTAREA Border 
    $('textarea#input_area').on('dragover', function (e) {
      console.log("dragover");
      $('textarea#input_area').css('border', '4px green dashed');
    });
    $('textarea#input_area').on('dragleave', function (e) {
      console.log("dragleave");
      $('textarea#input_area').css('border', '4px gray solid');
    });

    $('textarea#input_area').on('drop', function (e) {
      e.preventDefault();  // Invalid Browser Default Drag Action
      let file = e.originalEvent.dataTransfer.files[0];
      let imageMarkdown = "![sample-image](" + window.URL.createObjectURL(file) + ")";

      GL.insertAtCaret('textarea#input_area', imageMarkdown);
      $('textarea#input_area').css('border', '4px gray solid');

      GL.convertMarkDownToHtml();
    });

  });

  // chrome.storage.sync.get("key", function (value) {
  //   textarea.value = value.key;
  // });

  // function saveChanges() {
  //   let theValue = textarea.value;
  //   chrome.storage.sync.set({'key': theValue}, function() {
  //   });
  // }

  // textarea.addEventListener("keyup", function() {
  //   saveChanges();
  // })

})