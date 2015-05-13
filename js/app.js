"use strict";
var eventBriteToken = "";
var eventBriteOrganizerId = "8135119990";
// config general de la app


$(document).ready( function() {
    $('#btnllamada').on('click',llamadaApi);
});

function llamadaApi(e) {
    //var urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    var urlApi = "js/data.json";
    //alert(urlApi);

    $.getJSON( urlApi , function( data ) {
        //$( "#result" ).html( JSON.stringify( data ) );
        //alert( "Load was performed." );
        var tipos = {};
        // recorremos los eventos
        $.each(data.events,function(i, evento){
            var htmlOut = "<h1>titulo</h1><br />";
            htmlOut += "<p>"+evento.name.html+"</p><br /><br />";
            htmlOut += "<h1>localizacion</h1><br />";
            htmlOut += "<p>"+evento.venue.name+" "+evento.venue.address.address_1+" "+evento.venue.address.region+"</p><br /><br />";
            htmlOut += "<h1>entradas</h1><br />";
            $.each(evento.ticket_classes,function(i, precio){
                var htmlTabla = "<table class='table table-striped'><tr><td><strong>TIPO DE ENTRADA</strong></td><td><strong>DESCRIPCION</strong></td><td><strong>PRECIO</strong></td></tr>";
                htmlTabla += "<tr>";
                htmlTabla += "<td>"+precio.name+"</td>";
                htmlTabla += "<td>"+precio.description+"</td>";
                htmlTabla += "<td>"+precio.cost.display+"</td>";
                htmlTabla += "</tr>";
                htmlTabla += "</table>";
                htmlOut += "<p>"+htmlTabla+"</p><br /><br />";
            });
            htmlOut += "<h1>detalle evento</h1><br />";
            var edesc = evento.description.html;
            htmlOut += edesc;
            var edescjq = $.parseHTML(edesc);
            if(tipos.hasOwnProperty($(edescjq).attr("data-innobasque_eventbrite_category"))){
                tipos[$(edescjq).attr("data-innobasque_eventbrite_category")] += htmlOut;
            } else {
                tipos[$(edescjq).attr("data-innobasque_eventbrite_category")] = htmlOut;
            }

        });
        // creamos el html
        $('#accordion').empty();
        $.each(tipos,function(key,value){
            var htmlCollapsible = "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading"+key+"'><h4 class='panel-title'>";
            htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+key+"' aria-expanded='true' aria-controls='collapse"+key+"'>";
            htmlCollapsible += key;
            htmlCollapsible += "</a></h4></div><div id='collapse"+key+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading"+key+"'><div class='panel-body'>";
            htmlCollapsible += value;
            htmlCollapsible += "</div></div></div>";
            $('#accordion').append(htmlCollapsible);
        });
    });

}
