/*global $:false*/
/*jslint maxerr: 10, plusplus: true, indent: 4*/
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

// filtrado
var filtradoFechaInicio = false;
var filtradoFechaFin = false;
//var filtradoCategorias = false;
//var filtradoEstado = false;
// fin de filtrado

// ready
$(document).ready( function() {
    // configuracion de moment.js
    var language = window.navigator.userLanguage || window.navigator.language;
    moment.locale(language);
    // fin de configuracion
    // eventros de inicio
    $('#fecha-inici').on('change',fechaInici);
    $('#fecha-fin').on('change',fechaFin);
    $('#category').on('change',filtradoCategoria);
    $('#status').on('change',filtradoStatus);
    $('#eventList').empty();
    // fin de eventos
    // inicio de la app
    fechaInicio = "";
    fechaFin = "";
    paginaActual = 1;
    categoryApi = {} ;
    llamadaApi();
});

// filtrar por fechas
function fechaInici(e){
    //$('.categorias').hide();
    var fromFechaInicio = $('#fecha-inici').val();
    filtradoFechaInicio = true;
    /*
    $('.categorias').find('time').each(function(i, time){
        if ($(time).hasClass('startdate')) {
            if(compararFecha(fromFechaInicio,$(time).attr('DATA-INNOBASQUE_EVENTBRITE_DATESTART')) != -1)   {
                $(time).closest('div .categorias').show();
            }
        }
    });
    */
    filtrado();
}
function fechaFin(e){
    //$('.categorias').hide();
    var fromFechaFin = $('#fecha-fin').val();
    filtradoFechaFin = true;
    /*
    $('.categorias').find('span').each(function(i, span){
        if ($(span).hasClass('enddate')){
            if(compararFecha(fromFechaFin,$(span).attr('DATA-INNOBASQUE_EVENTBRITE_DATEEND')) != -1)   {
                $(span).closest('div .categorias').show();
            }
        }
    });
    */
    filtrado();
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
    if (categoriaSeleccionada == "todos") {
        $('.categorias').show();
    } else {
        $('.categorias').hide();
        $('#heading-'+categoriaSeleccionada).closest('div .categorias').show();
    }
}

// filtrar por status
function filtradoStatus(e){
    var statusSeleccionada = $("#status").val();
    if (statusSeleccionada == "todos") {
        $('.categorias').show();
    } else {
        $('.categorias').hide();
        $('.status-'+statusSeleccionada).closest('div .categorias').show();
    }
}

// funcion universal para filtrar
function filtrado() {
    $('.categorias').hide();
    $('.categorias').each(function(i,categoria){

    });

}


// llamada recursiva para mas paginas
function llamadaApi() {
    var urlApi = "";
    urlApi = "https://www.eventbriteapi.com/v3/users/"+eventBriteUserId+"/owned_events/?order_by=start_desc&page="+paginaActual+"&token="+eventBriteToken;
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
        // creacion del evento html
        var htmlOut = "<li id='evento'>";
        var startMoment = moment(evento.start.local);
        htmlOut += "<time class='startdate' DATA-INNOBASQUE_EVENTBRITE_DATESTART='"+startMoment.format('YYYY[-]MM[-]DD')+"'><span class='day'>"+startMoment.format("D")+"</span><span class='month'>"+startMoment.format("MMM")+"</span></time>";
        if (evento.logo) {
            htmlOut += "<img src='"+evento.logo.url+"'/>";
        }
        htmlOut +="<div class='info'><h2 class='title'>"+evento.name.html+"</h2>";
        htmlOut += "<p class='desc'>"+evento.description.text.substr(1,700)+"...</p>";
        var endMoment = moment(evento.end.local);
        htmlOut += "<ul>";
        htmlOut += "<span class='status-"+evento.status+"' style='width:33%;'>Status: "+evento.status+"</span>";
        htmlOut += "<span class='enddate' style='width:33%;' DATA-INNOBASQUE_EVENTBRITE_DATEEND='"+endMoment.format('YYYY[-]MM[-]DD')+"'>Finaliza el: "+endMoment.format("LLLL")+"</span>";
        htmlOut += "<li style='width:33%;'><a href='https://www.eventbrite.com/edit?eid="+evento.id+"'> Editar</a></li>";
        htmlOut += "</ul></div></li>";
        // fin del evento html

        // filtrado por categorias
        var parser = new DOMParser();
        var doc = parser.parseFromString(evento.description.html, "text/html");
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
    });

}

// creamos la lista de eventos
function crearLista(categoryApi){
    // creamos el html
    $.each(categoryApi,function(key,value){
        var htmlCollapsible = "<div class='panel-group categorias' id='accordion-"+key+"' role='tablist' aria-multiselectable='true'>";
        htmlCollapsible += "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading-"+key+"'><h4 class='panel-title'>";
        htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion-"+key+"' href='#collapse-"+key+"' aria-expanded='true' aria-controls='collapse-"+key+"'>";
        htmlCollapsible += key;
        htmlCollapsible += "</a></h4></div><div id='collapse-"+key+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading-"+key+"'><div class='panel-body'><ul class='event-list'>";
        htmlCollapsible += value;
        htmlCollapsible += "</ul></div></div></div></div>";
        $('#eventList').append(htmlCollapsible);
    });
}


