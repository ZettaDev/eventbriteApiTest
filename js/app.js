"use strict";
var eventBriteToken = "MQRI5BWCXONRZZOQDKL3";
var eventBriteOrganizerId = "8135119990";
// config general de la app


$(document).ready( function() {
    $('#btnllamada').on('click',llamadaApi);
});

function llamadaApi(e) {
    //var urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    var urlApi = "data.json";
    //alert(urlApi);

    $.get( urlApi , function( data ) {
        //$( "#result" ).html( JSON.stringify( data ) );
        //alert( "Load was performed." );
        var htmlInsertar = "";
        $.each(data.events,function(i, evento){
            htmlInsertar += "<div class='row'>";
            htmlInsertar += "<div class='col-md-8'>";
            htmlInsertar += "<p>"+evento.name.html+"</p><br />";
            htmlInsertar += "<p>Empieza el: "+evento.start.local+" Acaba el: "+evento.end.local+"</p></div>";
            //htmlInsertar += "<div class='col-md-4'><img src='"+evento.logo.url+"'></div>";
            htmlInsertar += "</div>";
            htmlInsertar += "<div class='row'>";
            htmlInsertar += "<div class='col-md-8'><div class='panel panel-default'><div class='panel-heading'>";
            htmlInsertar += "<h3 class='panel-title'>Información de la entrada</h3>";
            htmlInsertar += "</div><div class='panel-body panel-primary'>";
            htmlInsertar += "<table class='table table-striped'><tr><td><strong>TIPO DE ENTRADA</strong></td><td><strong>DESCRIPCION</strong></td><td><strong>PRECIO</strong></td></tr>";
            $.each(evento.ticket_classes,function(i, precio){
                htmlInsertar += "<tr>";
                htmlInsertar += "<td>"+precio.name+"</td>";
                htmlInsertar += "<td>"+precio.description+"</td>";
                //htmlInsertar += "<td>"+precio.cost.display+"</td>";
                htmlInsertar += "</tr>";
            });
            htmlInsertar += "</table>";
            htmlInsertar += "</div></div></div>";
            //htmlInsertar += "<div class='col-md-4'>"+evento.organizer.description.html+"</div>";
            htmlInsertar += "</div>";
            htmlInsertar += "<div class='col-md-12'><div class='panel panel-default'><div class='panel-heading'>";
            htmlInsertar += "<h3 class='panel-title'>Detalles del evento</h3>";
            htmlInsertar += "</div><div class='panel-body'>";
            htmlInsertar += evento.description.html;
            htmlInsertar += "</div></div>";
            htmlInsertar += "</div>";
        });
        $( "#result" ).html( htmlInsertar );
        alert( "Load was performed." );
    });

}
