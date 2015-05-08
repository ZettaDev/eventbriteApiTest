"use strict";
var eventBriteToken = "";
var eventBriteOrganizerId = "8135119990";
// config general de la app


$(document).ready( function() {
    $('#btnllamada').on('click',llamadaApi);
});

function llamadaApi(e) {
    //var urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    var urlApi = "http://" + window.location.host + "/eventbriteApiTest/js/data.json";
    //alert(urlApi);

    var htmlDatosTipo1 = "";
    var htmlDatosTipo2 = "";
    var htmlDatosTipo3 = "";

    $.get( urlApi , function( data ) {
        //$( "#result" ).html( JSON.stringify( data ) );
        //alert( "Load was performed." );

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
            htmlOut += "<p>"+edesc+"</p><br /><br />";
            if (edesc.indexOf("<div class='tipo1") == 0){
                htmlDatosTipo1 += htmlOut;
            } else if (edesc.indexOf("<div class='tipo2") == 0){
                htmlDatosTipo2 += htmlOut;
            } else if (edesc.indexOf("<div class='tipo3") == 0){
                htmlDatosTipo3 += htmlOut;
            }
        });
       $( "#tipo1" ).html( htmlDatosTipo1 );
       $( "#tipo2" ).html( htmlDatosTipo2 );
       $( "#tipo3" ).html( htmlDatosTipo3 );
    });

}
