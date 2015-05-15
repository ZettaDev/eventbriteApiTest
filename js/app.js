"use strict";
// configuracion global
var eventBriteToken = "H242DTR22NVJD52EO7";
var eventBriteOrganizerId = "3342909704";
// fin config

// variables
var fechaInicio = "";
var fechaFin = "";
var categoriaSeleccionada = null;
// fin variables

// ready
$(document).ready( function() {
    $('#fecha-inici').on('change',filtradoFecha);
    $('#fecha-fin').on('change',filtradoFecha);
    $('#category').on('change',filtradoCategoria);
    llamadaApi();
});

// filtrar por fechas
function filtradoFecha(e){
    if (($('#fecha-inici').val() != "") && ($('#fecha-fin').val() != "")){
        fechaInicio = $('#fecha-inici').val();
        fechaFin = $('#fecha-fin').val();
        llamadaApi();
    }
}

// filtrar por categorias
function filtradoCategoria(e){
    categoriaSeleccionada = $("#category").val();
    llamadaApi();
}

// llamada y maquetacion de la respuesta de la api
function llamadaApi(e){
    var urlApi = "";
    if (($('#fecha-inici').val() != null) && ($('#fecha-fin').val() != "")){
        urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&start_date.range_start="+fechaInicio+"T00:00:00Z&start_date.range_end="+fechaFin+"T00:00:00Z&token="+eventBriteToken;
    } else {
        urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    }
    //urlApi = "js/data.json";
    var categoryApi = {};
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
            // recuperamos en una variable la descipcion del evento que contiene el div con las categorias
            var edesc = evento.description.html;
            // lo añadimos al html a exportar porque nos hara falta
            htmlOut += edesc;
            // recogemos el string que contiene la ultima ocurrencia del div con las categorias
            var categoriasEvento = edesc.substr(edesc.lastIndexOf("<div data-innobasque_eventbrite_category='"), edesc.lastIndexOf("'></div>"));
            // preguntamos si tiene categorias o esta vacio
            if (categoriasEvento.length){
                // lo añadimos a la categoria correspondiente
                categoriasEvento = categoriasEvento.split("'")[1].split(",");
                $.each(categoriasEvento,function(key,value){
                    if(categoryApi.hasOwnProperty(value)){
                        categoryApi[value] += htmlOut;
                    } else {
                        categoryApi[value] = htmlOut;
                    }
                });
            } else {
                // lo agregamos a una categoria comun llamada otros
                if(categoryApi.hasOwnProperty("otros")){
                    categoryApi["otros"] += htmlOut;
                } else {
                    categoryApi["otros"] = htmlOut;
                }
            }
        });
        // llamamos a la funcion pasandole el array para que genere el html a mostrar
        crearLista(categoryApi);
    });
}

function crearLista(categoryApi){
    // creamos el html
    $('#eventList').empty();
    $.each(categoryApi,function(key,value){
        if (key == categoriaSeleccionada || categoriaSeleccionada == null){
            var htmlCollapsible = "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>";
            htmlCollapsible += "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading"+key+"'><h4 class='panel-title'>";
            htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+key+"' aria-expanded='true' aria-controls='collapse"+key+"'>";
            htmlCollapsible += key;
            htmlCollapsible += "</a></h4></div><div id='collapse"+key+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading"+key+"'><div class='panel-body'>";
            htmlCollapsible += value;
            htmlCollapsible += "</div></div></div></div>";
            $('#eventList').append(htmlCollapsible);
        }
    });
}
