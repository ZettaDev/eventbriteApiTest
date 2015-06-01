/*global $:false, ZeroClipboard:false*/
/*jslint maxerr: 10, plusplus: true, indent: 4*/

function generarDiv() {
    'use strict';
    var categorias = $('#choosen_select').val(),
        div_generado = "",
        date = new Date();
    div_generado += "<div data-innobasque_eventbrite_category='";
    div_generado += categorias.toString();
    div_generado += "' DATA-INNOBASQUE_EVENTBRITE_TIMESTAMP='";
    div_generado += date.toJSON();
    div_generado += "'></div>";
    $('#output_div').empty();
    $('#output_div').text(div_generado);
    $("body").on("copy", ".zclip", function(/* ClipboardEvent */ e) {
        console.log(div_generado);
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", div_generado);
        e.preventDefault();
      });
}

// ready
$(document).ready(function () {
    'use strict';
    // eventros de inicio
    $('#generar_div').on('click', generarDiv);
    // fin de eventos
    // cargar select
    var urlData = "js/data.json";
    $.getJSON(urlData, function (data) {
        $('#choosen_select').empty();
        $.each(data, function (key, value) {
            $('#choosen_select').append("<option value='" + key + "'>" + value + "</option>");
        });
        $('#choosen_select').trigger("chosen:updated");
    });
    // fin cargar select
});
