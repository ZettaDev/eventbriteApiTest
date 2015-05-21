"use strict";
// configuracion global
var eventBriteToken = "";
var eventBriteUserId = "141339170718";
// fin config

// variables
var fechaInicio = "";
var fechaFin = "";
var paginaActual = 1;
var numPaginas = 1;
var categoryApi = {} ;
// fin variables

// ready
$(document).ready( function() {
    $('#fecha-inici').on('change',filtradoFecha);
    $('#fecha-fin').on('change',filtradoFecha);
    $('#category').on('change',filtradoCategoria);
    $('#eventList').empty();
    fechaInicio = "";
    fechaFin = "";
    paginaActual = 1;
    categoryApi = {} ;
    llamadaApi();
});

// filtrar por fechas
function filtradoFecha(e){
    if (($('#fecha-inici').val() != "") && ($('#fecha-fin').val() != "")){
        var fromFechaInicio = $('#fecha-inici').val();
        var fromFechaFin = $('#fecha-fin').val();
        console.log(fromFechaInicio);
        console.log(fromFechaFin);
    }
}

// comparador de rango de fechas
function filtradoFecha(fechaComprobar){
    if ((fechaInicio != "") && (fechaFin != "") && (fechaComprobar != "")){
        var from = fechaComprobar.split("-");
        var dateComprobar = new Date(from[2], from[1] - 1, from[0]);
        if (dateComprobar < fechaInicio){
            return false;
        } else if (dateComprobar > fechaFin) {
            return false;
        } else {
            return true;
        }
    }
}

// comparador de fechas
function compararFecha(fechaOriginal,fechaComprobar){
    var dateOriginal = new Date(fechaOriginal);
    var dateComprobar = new Date(fechaComprobar);
    if (dateComprobar < dateOriginal){
        return -1;
    } else if (dateComprobar > dateOriginal) {
        return 1;
    } else {
        return 0;
    }
}

// filtrar por categorias
function filtradoCategoria(e){
    var categoriaSeleccionada = $("#category").val();
    $('.categorias').hide();
    $('#heading'+categoriaSeleccionada).parent().parent().show();
}


// llamada recursiva para mas paginas
function llamadaApi() {
    var urlApi = "";
    urlApi = "https://www.eventbriteapi.com/v3/users/"+eventBriteUserId+"/owned_events/?order_by=start_asc&status=ended&page="+paginaActual+"&token="+eventBriteToken;
    //urlApi = "js/data.json";
    if (paginaActual <= numPaginas){
        $.getJSON( urlApi , function( data ) {
            numPaginas = data.pagination.page_count;
            usoDatos(data);
            paginaActual += 1;
            llamadaApi();
        });
    }
    // llamamos a la funcion pasandole el array para que genere el html a mostrar
    crearLista(categoryApi);
}


// llamada y maquetacion de la respuesta de la api
function usoDatos(datos){
    $.each(datos.events,function(i, evento){
        //if (filtradoFecha(evento.start.local) && filtradoFecha(evento.end.local)) {
            var htmlOut = "<div id='evento'><h1>titulo</h1><br />";
            htmlOut += "<p><a href='https://www.eventbrite.com/edit?eid="+evento.id+"'>"+evento.name.html+"</a></p><br /><br />";
            htmlOut += "<h1>Fecha Inicio</h1><br />";
            htmlOut += "<p id='FechaInicio'>"+evento.start.local+"</p><br /><br />";
            htmlOut += "<h1>Fecha Fin</h1><br />";
            htmlOut += "<p id='FechaFin'>"+evento.end.local+"</p><br /><br />";
            htmlOut += "<h1>localizacion</h1><br />";
            if (evento.venue == null) {
                htmlOut += "<p> Evento Online </p><br /><br />";
            } else {
                htmlOut += "<p>"+evento.venue.name+" "+evento.venue.address.address_1+" "+evento.venue.address.region+"</p><br /><br />";
            }
            htmlOut += "<h1>entradas</h1><br />";
            $.each(evento.ticket_classes,function(i, precio){
                var htmlTabla = "<table class='table table-striped'><tr><td><strong>TIPO DE ENTRADA</strong></td><td>"
                htmlTabla += "<strong>DESCRIPCION</strong></td><td><strong>PRECIO</strong></td></tr>";
                htmlTabla += "<tr>";
                htmlTabla += "<td>"+precio.name+"</td>";
                htmlTabla += "<td>"+precio.description+"</td>";
                if (precio.free) {
                    htmlTabla += "<td>Gratis</td>";
                } else {
                    htmlTabla += "<td>"+precio.cost.display+"</td>";
                }
                htmlTabla += "</tr>";
                htmlTabla += "</table>";
                htmlOut += "<p>"+htmlTabla+"</p><br /><br />";
            });
            htmlOut += "<h1>detalle evento</h1><br />";
            // recuperamos en una variable la descipcion del evento que contiene el div con las categorias
            var edesc = evento.description.html;
            // lo añadimos al html a exportar porque nos hara falta
            htmlOut += edesc+"</div>";
            // recogemos el string que contiene la ultima ocurrencia del div con las categorias
            //var categoriasEvento = edesc.substr(edesc.lastIndexOf("<DIV DATA-INNOBASQUE_EVENTBRITE_CATEGORY=\""), edesc.lastIndexOf("\">"));
            var parser = new DOMParser();
            var doc = parser.parseFromString(edesc, "text/html");
            var fechaNueva = new Date('0001-01-01T00:00:00Z');
            var divNuevo = null;
            $(doc).find('div[DATA-INNOBASQUE_EVENTBRITE_CATEGORY]').each(function(i,div){
                var fechaComparar = new Date($(div).attr('DATA-INNOBASQUE_EVENTBRITE_TIMESTAMP'));
                if (fechaComparar > fechaNueva) {
                    fechaNueva = fechaComparar;
                    divNuevo = div;
                }
            });
            var categoriasEvento = "";
            if (divNuevo != null) {
                categoriasEvento = $(divNuevo).attr('DATA-INNOBASQUE_EVENTBRITE_CATEGORY');
            }
            // preguntamos si tiene categorias o esta vacio
            if (categoriasEvento.length){
                // lo añadimos a la categoria correspondiente
                categoriasEvento = categoriasEvento.split(",");
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
        //}
    });

}

// creamos la lista de eventos
function crearLista(categoryApi){
    // creamos el html
    $.each(categoryApi,function(key,value){
        var htmlCollapsible = "<div class='panel-group categorias' id='accordion' role='tablist' aria-multiselectable='true'>";
        htmlCollapsible += "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading"+key+"'><h4 class='panel-title'>";
        htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+key+"' aria-expanded='true' aria-controls='collapse"+key+"'>";
        htmlCollapsible += key;
        htmlCollapsible += "</a></h4></div><div id='collapse"+key+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading"+key+"'><div class='panel-body'>";
        htmlCollapsible += value;
        htmlCollapsible += "</div></div></div></div>";
        $('#eventList').append(htmlCollapsible);
    });
}
