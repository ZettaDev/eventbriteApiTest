"use strict";
var eventBriteToken = "";
var eventBriteOrganizerId = "7906052665";
// config general de la app


$(document).ready( function() {
    $('#btnllamada').on('click',llamadaApi);
});

function llamadaApi(e) {
    var urlApi = "https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventBriteOrganizerId+"&token="+eventBriteToken;
    //alert(urlApi);

    $.get( urlApi , function( data ) {
        $( "#result" ).html( JSON.stringify( data ) );
        alert( "Load was performed." );
    });

}
