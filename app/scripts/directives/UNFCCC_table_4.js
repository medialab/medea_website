'use strict'

angular.module('driveoutApp.directives.unfccctablefour', [])
  .directive('unfccctablefour', function () {
    return {
      templateUrl: 'views/templates/UNFCCC_table_4.html',
      link: function postLink(scope, element) {
        var titleTable1 = 'List of the automatically extracted terms with their different forms',
            titleTable2 = 'List of the manually selected terms with their forms and frequency';

        //Build the table to have the header fixed
        $('#tableDivContainer.scrollableOverlay').css({
          'max-height': element.height() - $('#buttonsTableContainer').height() - $('.tableHeader').height() - 10 + 'px'
        });
        window.addEventListener('resize', function() {
          $('#tableDivContainer.scrollableOverlay').css({
            'max-height': element.height() - $('#buttonsTableContainer').height() - $('.tableHeader').height() - 10 + 'px'
          });
        });

        //Changes the tables on click
        $('#extractedTermsButton').on('click', function() {
          $('#tableExtracted').removeClass('displayNone');

          if (!$('#tableSelected').hasClass('displayNone'))
            $('#tableSelected').addClass('displayNone');

          $('#extractedTermsButton').prop('disabled', true)
          $('#selectedTermsButton').prop('disabled', false)

          if ($('.vizLegendText h4').text() !== titleTable1)
            $('.vizLegendText h4').text(titleTable1);
        });
        $('#selectedTermsButton').on('click', function() {
          $('#tableSelected').removeClass('displayNone');

          $('#extractedTermsButton').prop('disabled', false)
          $('#selectedTermsButton').prop('disabled', true)

          if (!$('#tableExtracted').hasClass('displayNone'))
            $('#tableExtracted').addClass('displayNone');

          if ($('.vizLegendText h4').text() !== titleTable2)
            $('.vizLegendText h4').text(titleTable2)
        });
      }
    };
  });
