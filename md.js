window.onload = function() {  
  new Vue({
    el: '#editor',
    data: {
      input: '# Hello, Vue.js\n\n- hoge\n- foo\n- bar',
    },
    filters: {
      marked: marked,
    },
  });
}