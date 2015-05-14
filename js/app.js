"use strict";
// configuracion global
var eventBriteToken = "";
var eventBriteOrganizerId = "3342909704";
// fin config

// variables
var categoryApi = {};
var fechaInicio = null;
var fechaFin = null;
var categoriaSeleccionada = null;
// fin variables


$(document).ready( function() {
    $('#fecha-inici').on('change',filtrado);
    $('#fecha-fin').on('change',filtrado);
    $('#category').on('change',filtrado);
    llamadaApi();
});

function filtrado(){

}

function llamadaApi(e) {
    //var urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    var urlApi = "js/data.json";
    $.getJSON( urlApi , function( data ) {
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
            console.log(edesc);
            //var edescjq = $.parseHTML(edesc);
            //var categoriasEvento = $(edescjq+".div").last().attr("data-innobasque_eventbrite_category");
            //.attr("data-innobasque_eventbrite_category")
            //console.log(edescjq);
            console.log($(edesc));
            /*
            $.each(categoriasEvento,function(key,value){
                if(categoryApi.hasOwnProperty(value)){
                    categoryApi[value] += htmlOut;
                } else {
                    categoryApi[value] = htmlOut;
                }
            });
            */
        });
    });
    //crearLista();
}

function crearLista(){
// creamos el html
    $('#eventList').empty();
    $.each(categoryApi,function(key,value){
        if (key == categoriaSeleccionada || categoriaSeleccionada == null){
            var htmlCollapsible = "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading"+key+"'><h4 class='panel-title'>";
            htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+key+"' aria-expanded='true' aria-controls='collapse"+key+"'>";
            htmlCollapsible += key;
            htmlCollapsible += "</a></h4></div><div id='collapse"+key+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading"+key+"'><div class='panel-body'>";
            htmlCollapsible += value;
            htmlCollapsible += "</div></div></div>";
            $('#eventList').append(htmlCollapsible);
        }
    });
}
