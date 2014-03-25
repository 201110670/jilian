var Bingo = {
    min: 1,
    max: 90,
    numerosSorteados: new Array(),
    windowDocument: null,
        
    init: function(parent){
        this.windowDocument = parent;
        this.bind();
    },
        
    bind: function(){
        $("#boton-borrar-todo").click(function(){
            Bingo.botonBorrarTodoAction();
        });
        $("#boton-jugar").click(function(){
            Bingo.botonJugarAction();
        });
        $(".texto").click(function(){
            Bingo.seleccionarTipoJuego(this);
        });
        $("#boton-sortear").click(function(){
            Bingo.jugar();
        });
        $(".wp-pagenavi-span").click(function(){
            Bingo.seleccionarBolaAction($('#' + this.id));
        });
    },
    
    seleccionarTipoJuego: function(boton){
        if(!$(boton).hasClass( "texto-seleccionado" )){
            $(boton).addClass('texto-seleccionado', 1000, 'easeOutQuart');
            var aux = $(boton).attr('id');
            switch(aux){
                case 'boton-terna':
                    $('#boton-linea').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    $('#boton-bingo').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    break; 
                case 'boton-linea':
                    $('#boton-terna').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    $('#boton-bingo').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    break;
                case 'boton-bingo':
                    $('#boton-terna').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    $('#boton-linea').removeClass('texto-seleccionado', 500, 'easeOutQuart'); 
                    break;
            }
        } else {
            $(boton).removeClass('texto-seleccionado', 1000, 'easeOutQuart');
        }	
    },
        
    botonBorrarTodoAction: function(){
        window.top.location.reload();
    },
        
    botonJugarAction: function(){
        bootbox.dialog({
            message: "<p>Quiere que el sistema genere automaticamente los números sorteados?<br/> (Esta opción es muy util cuando usted no dispone de bolillero para realizar el sorteo)</p>",
            title: "Seleccione una opción para iniciar el Juego",
            buttons: {
                danger: {
                    label: "No",
                    className: "btn-danger",
                    callback: function() {

                    }
                },
                main: {
                    label: "Si, generar",
                    className: "btn-primary",
                    callback: function() {
                        bootbox.hideAll();
                        Bingo.numerosSorteados = new Array();
                        Bingo.jugar();
                    }
                }
            }
        });
    },
    
    anularBola: function(numero){
        $('#bola-actual').html('-');
        $('#bola-salio-'+numero).remove();
        $('#bola-'+numero).removeClass('wp-pagenavi-span-bola-salio');
        $('#bola-'+numero).addClass('wp-pagenavi-span');
    },
    
    seleccionarBolaAction: function(bola){
        if(bola.hasClass( "wp-pagenavi-span-bola-salio" )){
            console.log("La bola seleccionada YA SALIO!");
        }
        else{
            var n = bola.html();
            console.log('Numero marcado: ' + n);
            this.generarBolaGigante(n);         
            this.marcarBolaYaSalio(bola);
            this.numerosSorteados.push(n);
            console.log(this.numerosSorteados);
        }        
    },
    
    marcarBolaYaSalio: function(bola){
        bola.addClass('wp-pagenavi-span-bola-salio', 3000, 'easeOutExpo',
            function(){
                bola.removeClass('wp-pagenavi-span');
                var numero = bola.html();
                $('#bola-actual-flotante').remove();
                $('#ultimas-6').prepend('<span class="wp-pagenavi-span-bola-salio" onclick="Bingo.anularBola(\''+numero+'\');" id="bola-salio-'+numero+'">'+numero+'</span>');
            }
        );
    },
    
    generarBolaGigante: function(numero){
        $('#bola-actual').html(numero);
        $( window.document.body ).prepend('<span class="bola-actual-flotante" id="bola-actual-flotante">'+numero+'</span>');
        $( ".bola-actual-flotante" ).position({
            of: $('#left-content')
        });
    },
    
    generarNumeroAleatorio: function() {
        //http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
        var n =  Math.floor(Math.random() * (Bingo.max - Bingo.min + 1)) + Bingo.min;
        if(n < 10){
            n = "0" + n.toString();
        }
        console.log('Numero generado: ' + n.toString());
        return n.toString();
    },
    
    jugar: function(){
        console.log(_.size(Bingo.numerosSorteados));
        if(_.size(Bingo.numerosSorteados) >= (Bingo.max)){
            Bingo.showMensajeJuegoFinalizado();
            return;
        }
        var n =	Bingo.generarNumeroAleatorio();        
        if(_.contains(Bingo.numerosSorteados, n)){
            // controlar que aca si ya tiene todos los numeros no genere infinitamente
            console.log('Numero sorteado ya salio: ' + n);
            Bingo.jugar();
        }
        else{
            Bingo.seleccionarBolaAction($('#bola-' + n));
        }
    },
    
    showMensajeJuegoFinalizado: function(){
        bootbox.dialog({
            message: "<p>Todos los números ya fueron sorteados.<br/>Desea LIMPIAR la pizarra?</p>",
            title: "El Juego a finalizado",
            buttons: {
                danger: {
                    label: "No",
                    className: "btn-danger",
                    callback: function() {
                        
                    }
                },
                main: {
                    label: "Si, limpiar",
                    className: "btn-primary",
                    callback: function() {
                        bootbox.hideAll();
                        Bingo.botonBorrarTodoAction();
                    }
                }
            }
        });
    }
};




$( window.document ).ready(function() {
    Bingo.init(this); 
});
