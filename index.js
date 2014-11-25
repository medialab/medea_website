'use strict';
/*
  
  Example and basiuc usage for drive-out!
  settings fil have to be in the same level.
*/
var settings = require('./settings'),
    extend   = require('util')._extend,
    drive    = require('./drive-api')(settings),

    fs       = require('fs'),

    MEDIA_PATH = './app/media',
    CONTENTS_PATH    = './app/contents';




/*
  Return a well filled result object according to file.id
*/
function parseGoogleDocument(result) {
  console.log('parsing', result.slug)
  // for GOOGLE DOCUMENTS
  var html = drive.files.getHtml({fileId:result.id}),
      $ = drive.utils.parse(html);

  console.log($('body').html())

  result.title = $('.title').text();
  result.subtitle = $('.subtitle').html();

  // parse document sections
  $('h1').each( function(i, el){
    var section = {
      title: $(this).text(),
      html: $(this).nextUntil('h1').html() // guillaume
    };
    console.log('-------------------- oh', $(this).text());
    // check it's own h4
    var directives = $(this).find('h4');

    if(directives.length)
      console.log('oh yeh it has a durect')
    else
      section.type = 'text'
    
    result.sections.push(section);
  })

  return result;  
};


drive.start().then(function logic() {
  console.log('custom indexer of drive-out');

  var fileId = drive.utils.getFileId(settings.DRIVE_FOLDER_URL),
      pages,
      narratives = []; // static pages dicts
  
  console.log();
  console.log('folder url:', settings.DRIVE_FOLDER_URL);
  console.log('folder id: ', fileId);

  fs.existsSync(MEDIA_PATH) || fs.mkdirSync(MEDIA_PATH);
  fs.existsSync(CONTENTS_PATH) || fs.mkdirSync(CONTENTS_PATH);

  // static pages
  /*
    Left menu...
  */
  pages = drive.files.walk({fileId: fileId, mediapath: MEDIA_PATH}, function (file, options, results) {
    var result = {
      id: file.id,
      title: file.title,
      slug: drive.utils.slugify(file.title),
      mimeType: file.mimeType,
      sections: [] // it will bring h1 sections inside
    };
    console.log('--> ', file.title, file.id, file.mimeType);

    if(file.mimeType == 'application/vnd.google-apps.document') {
      console.log('ee');
      result = parseGoogleDocument(result);

      drive.utils.write(CONTENTS_PATH + '/' + result.slug + '.json', JSON.stringify(result,null,2)); 
  
      return result;
    };// end if file.mimeType == 'application/vnd.google-apps.document'

    if(file.mimeType == 'application/vnd.google-apps.folder') {
      result.type = 'folder';
      narratives.push(result)
      return result;
    };
  });

  drive.utils.write(CONTENTS_PATH + '/index.json', JSON.stringify(pages,null,2)); 
  
  // cycle through narratives folder to get files (one narrative per google doc)
  for(var i=0; i<narratives.length; i++) {
    console.log(narratives[i].slug);
    console.log('-------------------------');
    drive.files.walk({fileId: narratives[i].id, mediapath: MEDIA_PATH}, function (file, options, results) {
        console.log('--> ', file.title, file.id, file.mimeType);
    })
  };


  // create contents directory if it does not exist
  

  // recursive save files data
  
  /*function save_recursively(items, path) {
    var results = [];

    fs.existsSync(path) || fs.mkdirSync(path);
    
    for(var i in items) {
      
      if(items[i].items){
        var clone = {};
        for(var k in items[i]){ // copy only non items
          if(k != 'items')
            clone[k] =   items[i][k];
        }
        results.push(clone); 
        save_recursively(items[i].items, path + "/" + items[i].slug);
      } else if(!items[i].target){
        results.push(items[i]);
      }
      
    };

    for(var i in results) {
      for(var j in items) {
        if(results[i].slug == items[j].target){
          results[i].metadata = extend({},items[j]);
          break;
        }
      }
    }

    // save index here.
    drive.utils.write(path + '/index.json', JSON.stringify(results,null,2)); 
  };
  // save_recursively(files, CONTENTS_PATH);
  */

}, console.log).catch(function(err) {
  console.log(err)
});