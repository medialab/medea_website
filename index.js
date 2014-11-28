'use strict';
/*
  
  Example and basiuc usage for drive-out!
  settings fil have to be in the same level.
*/
var settings = require('./settings'),
    extend   = require('util')._extend,
    drive    = require('./drive-api')(settings),

    cmp      = require('./custom-markdown-parser'),
    fs       = require('fs'),

    MEDIA_PATH = './app/media',
    CONTENTS_PATH    = './app/contents';




/*
  Return a well filled result object according to file.id
*/
function parseGoogleDocument(result) {
  console.log('      parsing', result.slug)
  // for GOOGLE DOCUMENTS
  var html = drive.files.getHtml({fileId:result.id}),
      $ = drive.utils.parse(html);

  result.title = $('.title').text();
  result.subtitle = $('.subtitle').html();
  //console.log(html)
  // parse document sections
  $('h1').each( function(i, el){
    var contents = $(this).nextUntil('h1').get().map(function(e) {return $(e).html()}).join(''), // html specific to this section
        section = {
          title: $(this).text(),
          html: cmp(contents) // guillaume
        };

    // check it's own h4
    var directive = $(this).nextUntil('h1').filter('h4');

    //console.log(section.title, directives.length, directives);
    if(directive.length) {
      //console.log(directive.html())
      console.log('n. attachments: ', directive.find('a[href]').length);
      section.directive =  directive.text().split(' ').shift().trim()
      section.type = 'directive'
      // check linked data
      directive.find('a[href]').each(function (i, e) {
        var datahref = e.attribs['href'].match(/id=([^&]*)/); // this is the address on google drive for the linked data
        
        if(datahref) {
          // get download urls
          var file = drive.files.get({
            fileId: datahref.pop()
          });
          console.log('directive has this file attached', file.title)
          
          if(file.downloadUrl) {
            section.datasrc = section.datasrc || []; // add a proper list to hold data urls if it has'nt been done yet

            drive.files.download({
              downloadUrl: file.downloadUrl,
              filepath: MEDIA_PATH + '/' + file.id + '.' + file.fileExtension
            })
            section.datasrc.push( 'media/' + file.id + '.' + file.fileExtension)
            console.log('downloading file', file.downloadUrl);
          } else {
            console.log('CANNOT DOWNLoAD  file', file.title);
          }
        };
          /*
          drive.files.download({
            downloadUrl: file.downloadUrl,
            filepath: options.mediapath + '/' + file.id + '.' + file.fileExtension
          })
          */
      })
    } else {
      section.type = 'text'
    }

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
    // save result to a file named as file.slug
    if(file.mimeType == 'application/vnd.google-apps.document') {
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
    console.log();
    if(narratives[i].slug != 'ipcc') {
      continue
    }

    console.log(narratives[i].slug);
    fs.existsSync(CONTENTS_PATH + '/' + narratives[i].slug) || fs.mkdirSync(CONTENTS_PATH +'/' + narratives[i].slug);
    console.log('-------------------------');

    drive.files.walk({fileId: narratives[i].id, mediapath: MEDIA_PATH}, function (file, options, results, items) {
      console.log('--> "', file.title,'" ', file.id, file.mimeType);

      var result = {
        id: file.id,
        title: file.title.replace(/[0-9]*[\s.]*/,''),
        slug: drive.utils.slugify(file.title.replace(/[0-9]*[\s.]*/,'')),
        mimeType: file.mimeType,
        sections: [] // it will bring h1 sections inside
      };

      if(file.mimeType == 'application/vnd.google-apps.document') {
        result = parseGoogleDocument(result);

        result.menu = items.filter(function(d) {
          if(d.mimeType == 'application/vnd.google-apps.document' && d.title.match(/^[0-9]{1,}[\s.]*/))
            return d
        }).map(function(d) {
          return {
            title: d.title.replace(/^[0-9]*[\s.]*/,''),
            slug: drive.utils.slugify(d.title.replace(/^[0-9]*[\s.]*/,'')),
          }
        });

        drive.utils.write(CONTENTS_PATH + '/' + narratives[i].slug + '/' + result.slug + '.json', JSON.stringify(result,null,2)); 
      };
    })

  };


}, console.log).catch(function(err) {
  console.log(err)
});