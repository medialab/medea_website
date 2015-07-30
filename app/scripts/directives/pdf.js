'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:donut
 * @description
 * # donut
 */
angular.module('driveoutApp.directives.pdf', [])
  .directive('pdf', function ($timeout, $http) {
    return {
      restrict: 'EA',
      scope: {
        url: '@',
        ratio: '='
      },
      link: function postLink(scope, element, attrs) {
        //
        // If absolute URL from the remote server is provided, configure the CORS
        // header on that server.
        //
        var url = scope.url;


        //
        // Disable workers to avoid yet another cross-origin issue (workers need
        // the URL of the script to be loaded, and dynamically loading a cross-origin
        // script does not work).
        //
        // PDFJS.disableWorker = true;

        //
        // In cases when the pdf.worker.js is located at the different folder than the
        // pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
        // shall be specified.
        //
        // PDFJS.workerSrc = '../../build/pdf.worker.js';
        $timeout(function() {

          var pdfDoc = null,
              pageNum = 1,
              pageRendering = false,
              pageNumPending = null,
              scale = 0.8,
              canvas = document.getElementById('containerPdfConclusion'),
              ctx = canvas.getContext('2d');

          document.getElementById('nextPDF').addEventListener('click', onNextPage);
          document.getElementById('prevPDF').addEventListener('click', onPrevPage);

          var ratio = scope.ratio;

          /**
           * Asynchronously downloads PDF.
           */
           // PDFJS.verbosity = 5;
          PDFJS.getDocument(url).then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.getElementById('page_countPDF').textContent = pdfDoc_.numPages;
            // Initial/first page rendering
            $timeout(function() {renderPage(pageNum)});
          });

          /**
           * Get page info from document, resize canvas accordingly, and render page.
           * @param num Page number.
           */
          function renderPage(num) {
            console.log($('#pdf').width()*ratio, $('#pdf').height())
            if ($('#pdf').width()*ratio < $('#pdf').height() - $('.vizLegendZone').height()) {
              $('#containerPdfConclusion').css({
                  'position': 'absolute',
                  'height': ($('#pdf').width()*ratio -30) + 'px',
                  'width': '100%',
                  'margin-left': '0px',
                  'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
                  'margin-bottom': 30 + 'px'});
            }
            else {
              $('#containerPdfConclusion').css({
                'width': '70%',
                'height': '',
                'bottom': '',
                'position': '',
                'margin-left': '15%'
              });
            }
            pageRendering = true;
            // Using promise to fetch the page
            $('#containerPdfConclusion').css({
              'visibility': 'hidden'
            });
            pdfDoc.getPage(num).then(function(page) {
              var viewport = page.getViewport(scale);
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              // Render PDF page into canvas context
              var renderContext = {
                canvasContext: ctx,
                viewport: viewport
              };
              var renderTask = page.render(renderContext);

              // Wait for rendering to finish
              renderTask.promise.then(function () {
                pageRendering = false;
                if (pageNumPending !== null) {
                  // New page rendering is pending
                  renderPage(pageNumPending);
                  pageNumPending = null;
                }
                $('#containerPdfConclusion').css({
                  'visibility': 'inherit'
                });
              });
            });

            // Update page counters
            document.getElementById('page_numPDF').textContent = pageNum;
          }

          /**
           * If another page rendering in progress, waits until the rendering is
           * finised. Otherwise, executes rendering immediately.
           */
          function queueRenderPage(num) {
            if (pageRendering) {
              pageNumPending = num;
            } else {
              renderPage(num);
            }
          }

          /**
           * Displays previous page.
           */
          function onPrevPage() {
            if (pageNum <= 1) {
              return;
            }
            pageNum--;
            queueRenderPage(pageNum);
          }

          /**
           * Displays next page.
           */
          function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
              return;
            }
            pageNum++;
            queueRenderPage(pageNum);
          }
          window.addEventListener('resize', function() {
            if (element.height() !== 0) {
              $timeout(function() {queueRenderPage(pageNum)});
            }
          });
        })


      }
    };
  });
