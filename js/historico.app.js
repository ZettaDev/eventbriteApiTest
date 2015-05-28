/*global $:false, moment:false, DOMParser:false*/
/*jslint maxerr: 10, plusplus: true, indent: 4*/

// configuracion global
var eventBriteToken = "";
var eventBriteUserId = "141339170718";
// fin config

// variables
var paginaActual = 1;
var numPaginas = 1;
var categoryApi = {};
// fin variables

// filtrado
var llamarFiltradoFechaInicio = false;
var llamarFiltradoFechaFin = false;
var llamarFiltradoEstado = false;
// fin de filtrado

// comparador de fechas
function compararFecha(fechaOriginal, fechaComprobar) {
    'use strict';
    var dateOriginal = new Date(fechaOriginal), dateComprobar = new Date(fechaComprobar);
    if (dateComprobar < dateOriginal) {
        return -1;
    } else if (dateComprobar > dateOriginal) {
        return 1;
    } else {
        return 0;
    }
}

// funcion universal para filtrar
function filtrado() {
    'use strict';
    $('.evento').hide();
    $('.evento').each(function (i, evento) {
        if (llamarFiltradoFechaInicio) {
            $(evento).find('time').each(function (i, tag) {
                if ($(tag).hasClass('startdate')) {
                    if (compararFecha($('#fecha-inici').val(), $(tag).attr('DATA-INNOBASQUE_EVENTBRITE_DATESTART')) !== -1) {
                        if (llamarFiltradoFechaFin) {
                            $(evento).find('span').each(function (i, end) {
                                if ($(end).hasClass('enddate')) {
                                    if (compararFecha($('#fecha-fin').val(), $(end).attr('DATA-INNOBASQUE_EVENTBRITE_DATEEND')) !== -1) {
                                        if ($("#status").val() === "todos") {
                                            $(evento).show();
                                        } else {
                                            $(evento).find('.status-' + $("#status").val()).closest('div .evento').show();
                                        }
                                    }
                                }
                            });
                        } else {
                            if ($("#status").val() === "todos") {
                                $(evento).show();
                            } else {
                                $(evento).find('.status-' + $("#status").val()).closest('div .evento').show();
                            }
                        }
                    }
                }
            });
        } else if (llamarFiltradoFechaFin) {
            $(evento).find('span').each(function (i, tag) {
                if ($(tag).hasClass('enddate')) {
                    if (compararFecha($('#fecha-fin').val(), $(tag).attr('DATA-INNOBASQUE_EVENTBRITE_DATEEND')) !== -1) {
                        if ($("#status").val() === "todos") {
                            $(evento).show();
                        } else {
                            $(evento).find('.status-' + $("#status").val()).closest('div .evento').show();
                        }
                    }
                }
            });
        } else if (llamarFiltradoEstado) {
            if ($("#status").val() === "todos") {
                $(evento).show();
            } else {
                $('.status-' + $("#status").val()).closest('div .evento').show();
            }
        }
    });
    $('.categorias').each(function (i, categoria) {
        $(categoria).show();
        var centinela = true;
        $(categoria).find('.evento').each(function (i, evento) {
            if ($(evento).is(":visible")) {
                centinela = false;
            }
        });
        if (centinela) {
            $(categoria).hide();
        }
    });
}

// filtrar por status
function filtradoStatus(e) {
    'use strict';
    llamarFiltradoEstado = true;
    filtrado();
}

// filtrar por fechas
function fechaInici(e) {
    'use strict';
    llamarFiltradoFechaInicio = true;
    filtrado();
}
function fechaFin(e) {
    'use strict';
    llamarFiltradoFechaFin = true;
    filtrado();
}

// filtrar por categorias
function filtradoCategoria(e) {
    'use strict';
    var categoriaSeleccionada = $("#category").val();
    if (categoriaSeleccionada === "todos") {
        $('.categorias').show();
    } else {
        $('.categorias').hide();
        $('#heading-' + categoriaSeleccionada).closest('div .categorias').show();
    }
}

// llamada y maquetacion de la respuesta de la api
function usoDatos(datos) {
    'use strict';
    $.each(datos.events, function (i, evento) {
        // creacion del evento html
        var htmlOut = "<li class='evento'>",
            startMoment = moment(evento.start.local),
            endMoment = moment(evento.end.local),
            parser = new DOMParser(),
            doc = parser.parseFromString(evento.description.html, "text/html"),
            fechaNueva = new Date('0001-01-01T00:00:00Z'),
            divNuevo = null,
            categoriasEvento = "";

        htmlOut += "<time class='startdate' DATA-INNOBASQUE_EVENTBRITE_DATESTART='" + startMoment.format('YYYY[-]MM[-]DD') + "'><span class='day'>" + startMoment.format("D") + "</span><span class='month'>" + startMoment.format("MMM") + "</span></time>";
        if (evento.logo) {
            htmlOut += "<img src='" + evento.logo.url + "'/>";
        }
        htmlOut += "<div class='info'><h2 class='title'>" + evento.name.html + "</h2>";
        htmlOut += "<p class='desc'>" + evento.description.text.substr(1, 700) + "...</p>";
        htmlOut += "<ul>";
        htmlOut += "<span class='status-" + evento.status + "' style='width:33%;'>Status: " + evento.status + "</span>";
        htmlOut += "<span class='enddate' style='width:33%;' DATA-INNOBASQUE_EVENTBRITE_DATEEND='" + endMoment.format('YYYY[-]MM[-]DD') + "'>Finaliza el: " + endMoment.format("LLLL") + "</span>";
        htmlOut += "<li style='width:33%;'><a href='https://www.eventbrite.com/edit?eid=" + evento.id + "'> Editar</a></li>";
        htmlOut += "</ul></div></li>";
        // fin del evento html

        // filtrado por categorias
        $(doc).find('div[DATA-INNOBASQUE_EVENTBRITE_CATEGORY]').each(function (i, div) {
            var fechaComparar = new Date($(div).attr('DATA-INNOBASQUE_EVENTBRITE_TIMESTAMP'));
            if (fechaComparar > fechaNueva) {
                fechaNueva = fechaComparar;
                divNuevo = div;
            }
        });
        if (divNuevo !== null) {
            categoriasEvento = $(divNuevo).attr('DATA-INNOBASQUE_EVENTBRITE_CATEGORY');
        }
        // preguntamos si tiene categorias o esta vacio
        if (categoriasEvento.length) {
            // lo añadimos a la categoria correspondiente
            categoriasEvento = categoriasEvento.split(",");
            $.each(categoriasEvento, function (key, value) {
                if (categoryApi.hasOwnProperty(value)) {
                    categoryApi[value] += htmlOut;
                } else {
                    categoryApi[value] = htmlOut;
                }
            });
        } else {
            // lo agregamos a una categoria comun llamada otros
            if (categoryApi.hasOwnProperty("otros")) {
                categoryApi.otros += htmlOut;
            } else {
                categoryApi.otros = htmlOut;
            }
        }
    });

}

// creamos la lista de eventos
function crearLista(categoryApi) {
    'use strict';
    var collapse = false,
        htmlCollapsible;
    // creamos el html
    $('#eventList').empty();
    htmlCollapsible = "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>";
    $.each(categoryApi, function (key, value) {
        htmlCollapsible += "<div class='panel panel-default categorias'><div class='panel-heading' role='tab' id='heading-" + key + "'><h4 class='panel-title'><span class='collapse-init-button glyphicon glyphicon-sort' data-active='true' title='Expandir / Colapsar' style='cursor: pointer;' aria-hidden='true'></span>";
        if (collapse) {
            htmlCollapsible += "<a class='collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapse-" + key + "' aria-expanded='false' aria-controls='collapse-" + key + "'>";
        } else {
            htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse-" + key + "' aria-expanded='true' aria-controls='collapse-" + key + "'>";
        }
        htmlCollapsible += key;
        if (collapse) {
            htmlCollapsible += "</a></h4></div><div id='collapse-" + key + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading-" + key + "'><div class='panel-body'><ul class='event-list'>";
        } else {
            htmlCollapsible += "</a></h4></div><div id='collapse-" + key + "' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading-" + key + "'><div class='panel-body'><ul class='event-list'>";
        }
        htmlCollapsible += value;
        htmlCollapsible += "</ul></div></div></div>";
        collapse = true;
    });
    htmlCollapsible += "</div>";
    $('#eventList').append(htmlCollapsible);
}

// llamada recursiva para mas paginas
function llamadaApi() {
    'use strict';
    var urlApi = "";
    urlApi = "https://www.eventbriteapi.com/v3/users/" + eventBriteUserId + "/owned_events/?order_by=start_desc&page=" + paginaActual + "&token=" + eventBriteToken;
    if (paginaActual <= numPaginas) {
        $.getJSON(urlApi, function (data) {
            numPaginas = data.pagination.page_count;
            usoDatos(data);
            paginaActual += 1;
            llamadaApi();
        });
    }
    // llamamos a la funcion pasandole el array para que genere el html a mostrar
    crearLista(categoryApi);
}

function collapseExpand() {
    'use strict';
    var active;

    if ($('.collapse-init-button').length !== 0) {
        $('.collapse-init-button').click(function () {
            active = event.currentTarget.getAttribute('data-active');

            if (active === 'true') {
                event.currentTarget.setAttribute('data-active', "false");
                // collapse from registro
                $(this).closest(".panel-group").find(".list-group").find('.panel-collapse').collapse('hide');
                // collapse inside registro
                //$(this).parent().find('.panel-collapse').collapse('hide');
                $('.panel-title').attr('data-toggle', 'collapse');
            } else {
                event.currentTarget.setAttribute('data-active', "true");
                // collapse from registro
                $(this).closest(".panel-group").find(".list-group").find('.panel-collapse').collapse('show');
                // collapse inside registro
                //$(this).parent().find('.panel-collapse').collapse('show');
                $('.panel-title').attr('data-toggle', '');
            }
        });
    }
}

// ready
$(document).ready(function () {
    'use strict';
    // configuracion de moment.js
    var language = window.navigator.userLanguage || window.navigator.language;
    moment.locale(language);
    // fin de configuracion
    // eventros de inicio
    $('#fecha-inici').on('change', fechaInici);
    $('#fecha-fin').on('change', fechaFin);
    $('#category').on('change', filtradoCategoria);
    $('#status').on('change', filtradoStatus);
    // fin de eventos
    // inicio de la app
    paginaActual = 1;
    categoryApi = {};
    llamadaApi();
});
