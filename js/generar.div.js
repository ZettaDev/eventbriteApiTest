/*global $:false*/
/*jslint maxerr: 10, plusplus: true, indent: 4*/

function generarDiv() {
    'use strict';
    var categorias = $('#choosen_select').val(),
        div_generado = "",
        date = new Date();
    div_generado += "&lt;div data-innobasque_eventbrite_category='";
    div_generado += categorias.toString();
    div_generado += "' DATA-INNOBASQUE_EVENTBRITE_TIMESTAMP='";
    div_generado += date.toJSON();
    div_generado += "'&gt;&lt;/div&gt;";
    $('#output_div').empty();
    $('#output_div').append(div_generado);
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
