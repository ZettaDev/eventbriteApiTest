/*global $:false, moment:false, DOMParser:false, console:false*/
/*jslint maxerr: 10, regexp: true, plusplus: true, indent: 4*/
// regexp: true avoid regex warning
// plusplus: true avoid var++ warning
(function () {
    'use strict';
    // configuracion global
    var eventBriteToken = "";
    var eventBriteUserId = "";
    // fin config

    // variables
    var paginaActual = 1;
    var numPaginas = 1;
    var categoryApi = {};
    var categoryData = {};
    // fin variables

    // filtrado
    var llamarFiltradoFechaInicio = false;
    var llamarFiltradoFechaFin = false;
    var llamarFiltradoEstado = false;
    // fin de filtrado

    // comparador de fechas
    function compararFecha(fechaOriginal, fechaComprobar) {
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
    function filtrado(ev) {
        $('.evento').hide();
        $('.evento').each(function (i, evento) {
            if (llamarFiltradoFechaInicio) {
                $(evento).find('time').each(function (i, tag) {
                    if ($(tag).hasClass('startdate')) {
                        if (compararFecha($('#fecha-inici').val(), $(tag).attr('DATA-EVENTBRITE_DATESTART')) !== -1) {
                            if (llamarFiltradoFechaFin) {
                                $(evento).find('span').each(function (i, end) {
                                    if ($(end).hasClass('enddate')) {
                                        if (compararFecha($('#fecha-fin').val(), $(end).attr('DATA-EVENTBRITE_DATEEND')) !== -1) {
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
                        if (compararFecha($('#fecha-fin').val(), $(tag).attr('DATA-EVENTBRITE_DATEEND')) !== 1) {
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
                    // Evitamos que se genere un toggle con el acordion
                    $('.status-' + $("#status").val()).closest('div .evento').show();
                }
            }
        });
        // Colapsa las categorias que no tienen ningun evento que coincida con el filtro
        /*
        $('.categorias').each(function (i, categoria) {
            $(categoria).find('.panel-collapse').collapse('show');
            var centinela = true;
            $(categoria).find('.evento').each(function (i, evento) {
                if ($(evento).is(":visible")) {
                    centinela = false;
                }
            });
            if (centinela) {
                $(categoria).find('.panel-collapse').collapse('hide');
            }
        });
        */
    }

    // filtrar por status
    function filtradoStatus(e) {
        llamarFiltradoEstado = true;
        filtrado();
    }

    // filtrar por fechas
    function fechaInici(e) {
        llamarFiltradoFechaInicio = true;
        filtrado();
    }
    function fechaFin(e) {
        llamarFiltradoFechaFin = true;
        filtrado();
    }

    // filtrar por categorias
    function filtradoCategoria(e) {
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
        $.each(datos.events, function (i, evento) {
            // creacion del evento html
            var htmlOut = "<li class='evento'>",
                startMoment = moment(evento.start.local),
                endMoment = moment(evento.end.local),
                parser = new DOMParser(),
                doc,
                fechaNueva = new Date('0001-01-01T00:00:00Z'),
                divNuevo = null,
                categoriasEvento = "";
            if (evento.description != null) {
                doc = parser.parseFromString(evento.description.html, "text/html");
            }
            htmlOut += "<time class='startdate' DATA-EVENTBRITE_DATESTART='" + startMoment.format('YYYY[-]MM[-]DD') + "'><span class='day'>" + startMoment.format("D") + "</span><span class='month'>" + startMoment.format("MMM") + "</span></time>";
            if (evento.logo) {
                htmlOut += "<img src='" + evento.logo.url + "'/>";
            }
            htmlOut += "<div class='info'><h2 class='title'>" + evento.name.html + "</h2>";
            if (evento.description != null) {
                htmlOut += "<p class='desc'>" + evento.description.text.substr(1, 700) + "...</p>";
            } else {
                htmlOut += "<p class='desc'>No hay descripción</p>";
            }
            htmlOut += "<ul>";
            htmlOut += "<span class='status-" + evento.status + "' style='width:33%;'>Status: " + evento.status + "</span>";
            htmlOut += "<span class='enddate' style='width:33%;' DATA-EVENTBRITE_DATEEND='" + endMoment.format('YYYY[-]MM[-]DD') + "'>Finaliza el: " + endMoment.format("LLLL") + "</span>";
            htmlOut += "<li style='width:33%;'><a href='https://www.eventbrite.com/edit?eid=" + evento.id + "'> Editar</a></li>";
            htmlOut += "</ul></div></li>";
            // fin del evento html

            // filtrado por categorias
            $(doc).find('div[DATA-EVENTBRITE_CATEGORY]').each(function (i, div) {
                var fechaComparar = new Date($(div).attr('DATA-EVENTBRITE_TIMESTAMP'));
                if (fechaComparar > fechaNueva) {
                    fechaNueva = fechaComparar;
                    divNuevo = div;
                }
            });
            if (divNuevo !== null) {
                categoriasEvento = $(divNuevo).attr('DATA-EVENTBRITE_CATEGORY');
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

    function collapseExpand() {
        var active;
        if ($('.collapse-init-button').length !== 0) {
            $('.collapse-init-button').click(function () {
                active = event.currentTarget.getAttribute('data-active');

                if (active === 'true') {
                    event.currentTarget.setAttribute('data-active', "false");
                    // collapse from registro
                    $('#accordion').closest(".panel-group").find('.panel-collapse').collapse('hide');
                    // collapse inside registro
                    //$(this).parent().find('.panel-collapse').collapse('hide');
                    $('.panel-title').attr('data-toggle', 'collapse');
                } else {
                    event.currentTarget.setAttribute('data-active', "true");
                    // collapse from registro
                    $('#accordion').closest(".panel-group").find('.panel-collapse').collapse('show');
                    // collapse inside registro
                    //$(this).parent().find('.panel-collapse').collapse('show');
                    $('.panel-title').attr('data-toggle', '');
                }
            });
        }
    }

    // creamos la lista de eventos
    function crearLista(categoryApi, categoryData) {
        var collapse = false,
            htmlCollapsible;
        // creamos el html
        $('#eventList').empty();
        htmlCollapsible = "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>";
        $.each(categoryApi, function (key, value) {
            htmlCollapsible += "<div class='panel panel-default categorias'><div class='panel-heading' role='tab' id='heading-" + key + "'><h4 class='panel-title'>";
            if (collapse) {
                htmlCollapsible += "<a class='collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapse-" + key + "' aria-expanded='false' aria-controls='collapse-" + key + "'>";
            } else {
                htmlCollapsible += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse-" + key + "' aria-expanded='true' aria-controls='collapse-" + key + "'>";
            }
            htmlCollapsible += categoryData[key];
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
        collapseExpand();
        $('#accordion').closest(".panel-group").find('.panel-collapse').collapse('show');
        $('#loading').hide();
        $('#loadMore').show();
    }

    // llamada recursiva para mas paginas
    function llamadaApi() {
        var urlApi = "",
            urlData = "";
        urlApi = "https://www.eventbriteapi.com/v3/users/" + eventBriteUserId + "/owned_events/?order_by=start_desc&page=" + paginaActual + "&token=" + eventBriteToken;
        if (paginaActual <= numPaginas) {
            $.getJSON(urlApi, function (data) {
                numPaginas = data.pagination.page_count;
                usoDatos(data);

                urlData = "js/data.json";
                $.getJSON(urlData, function (data) {
                    categoryData = data;
                    // llamamos a la funcion pasandole el array para que genere el html a mostrar
                    crearLista(categoryApi, categoryData);
                }).fail(function () {
                    console.log("error cargando categorias");
                });
            }).fail(function () {
                console.log("error cargando datos");
            });
        } else if (paginaActual > numPaginas) {
            $('#loadMore').hide();
            $('#loading').hide();
        } else {
            $('#loading').hide();
            $('#loadMore').show();
        }
    }

    function cargarMas() {
        $('#loading').show();
        $('#loadMore').hide();
        $('#fecha-inici').val("");
        $('#fecha-fin').val("");
        $('#category').val("");
        $('#status').val("");
        paginaActual += 1;
        llamadaApi();
    }

    // ready
    $(document).ready(function () {
        // configuracion de moment.js
        var language = window.navigator.userLanguage || window.navigator.language;
        moment.locale(language);
        // fin de configuracion
        // eventros de inicio
        $('#fecha-inici').on('change', fechaInici);
        $('#fecha-fin').on('change', fechaFin);
        $('#category').on('change', filtradoCategoria);
        $('#status').on('change', filtradoStatus);
        $('#loadMore').on('click', cargarMas);
        // fin de eventos
        // inicio de la app
        $('#loading').show();
        $('#loadMore').hide();
        paginaActual = 1;
        categoryApi = {};
        llamadaApi();
    });
}());
