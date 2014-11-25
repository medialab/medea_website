var marked = require('marked'),
    renderer = new marked.Renderer();

var oldLink = renderer.link;

// Helpers
function escape(s) {
  return JSON.stringify(s).replace(/"/g, '\'');
}

// New link function
renderer.link = function(href, title, text) {
  var wordlist = href.split('zoom:');

  // If no zoom is found, we apply standard behaviour
  if (wordlist.length < 2)
    return oldLink.apply(this, Array.prototype.slice.call(arguments));

  var words = wordlist[1].split(',');

  if (words.length > 1)
    return '<span ng-click="groupFocus(' + escape(words) + ')">' + text + '</span>';
  else
    return '<span ng-click="focus(' + escape(words[0]) + ')"></span>';
};

// Exporting function
module.exports = function(string) {
  return marked(string, {renderer: renderer});
};

/*
console.log(module.exports('Hello [Dany](zoom:agriculture)'));
console.log(module.exports('Hello [Dany](zoom:agriculture,system)'));
console.log(module.exports('Hello [Dany](zoom:agriculture,system,QELROs)'));
console.log(module.exports('Hello [Dany](http://localhost)'));
*/
