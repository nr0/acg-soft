// Onde vou: implementacao das circunferencias. Ver fundo do ficheiro

/*


TODO:

1. mudar o cursor para cruzinha quando é para desenhar.
2. variável global com o canvas: como fazer o setup ?
3. Strings grandes em javascript: onde as colocar?

ENUMS in Javascript
    http://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/

Tabela de estados:

0 = nada selecionado.

10 = Método do declive selecionado (aguarda 1º click).
11 = (idem) (aguarda 2º click e desenha).

20 = Método DDA selecionado (aguarda 1º click).
21 = (idem) (aguarda 2º click e desenha).

30 = Método Bresenham selecionado (aguarda 1º click).
31 = (idem) (aguarda 2º click e desenha).

40 = menu_circ_polinomial

50 = menu_circ_trig

60 = menu_circ_bresenham

70 = menu_elipse_polinomial

80 = menu_elipse_trig



A cada estado introduzido é necessário criar:

(1) Função do menu que inicia o estado.
(2) Alterar doMouseDown.
(3) Implementar o método.

*/


var estado = 0



//Variaveis para o desenho da reta
var reta_x1, reta_y1, reta_x2, reta_y2;

//Variaveis para desenho da circunferência
var centro_x, centro_y, pcirc_x, pcirc_y;

//Variaveis para desenho da elipse
var centro1_x, centro1_y, centro2_x, centro2_y, pelip_x, pelip_y;

//Variaveis para o preenchimento
var px,py;
var canvas_width, canvas_height;

//Desenho de um polígono vectorial
var ptspol; //pontos de um polígono.
var npts; //num de pontos.



function initialize() {
    var canvas = document.getElementById("acg_canvas");
    canvas.addEventListener("mousedown",doMouseDown,false);
}


////////////////////////////
// Canvas Event handlers
////////////////////////////


// Canvas click
function doMouseDown(event) {
    //canvas_x = event.pageX-300;
    //canvas_y = event.pageY-10;
    canvas_x = event.layerX-4;
    canvas_y = event.layerY-4;
    //alert("X=" + canvas_x + " Y=" + canvas_y);

    switch (estado)
    {

    /////////////////////
    //Do nothing.
    /////////////////////
    case 0:
        break;


    /////////////////////
    //Informação do pixel
    /////////////////////
    case 1:
        pixel_info();
        break;


    ///////////////////////////////
    //Desenho da reta pelo declive
    ///////////////////////////////
    case 10:
        //Guarda primeiro click
        reta_x1 = canvas_x;
        reta_y1 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x1=" + reta_x1;
        x.innerHTML += "<br>Ponto y1=" + reta_y1;

        estado = 11
        break;

    case 11:
        //Ocorreu a marcação do segundo ponto (metodo do declive)
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x2=" + reta_x2;
        x.innerHTML += "<br>Ponto y2=" + reta_y2;

        //Desenha
        reta_declive_desenha() //coordenadas são globais

        //Regressa ao estado original
        estado = 10
        break;        


    ///////////////////////////
    //Desenho da reta pelo DDA
    ///////////////////////////
    case 20:
        //Guarda primeiro click
        reta_x1 = canvas_x;
        reta_y1 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML="Descrição do método DDA"; 
        x.innerHTML += "<br>Ponto x1=" + reta_x1;
        x.innerHTML += "<br>Ponto y1=" + reta_y1;

        estado = 21
        break;

    case 21:
        //Ocorreu a marcação do segundo ponto
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;

        x.innerHTML += "<br>Ponto x2=" + reta_x2;
        x.innerHTML += "<br>Ponto y2=" + reta_y2;

        //Desenha
        reta_dda_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 20
        break;        

    /////////////////////////////////
    //Desenho da reta pelo Bresenham
    /////////////////////////////////
    case 30:
        //Guarda primeiro click
        reta_x1 = canvas_x;
        reta_y1 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML="Descrição do método Bresenham"; 
        x.innerHTML += "<br>Ponto x1=" + reta_x1;
        x.innerHTML += "<br>Ponto y1=" + reta_y1;

        estado = 31
        break;

    case 31:
        //Ocorreu a marcação do segundo ponto 
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x2=" + reta_x2;
        x.innerHTML += "<br>Ponto y2=" + reta_y2;

        //Desenha
        reta_bresenham_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 30
        break;


    ///////////////////////////////////////////////////
    //Desenho da circunferência pelo método polinomial
    ///////////////////////////////////////////////////
    case 40:
        //Guarda o centro
        centro_x = canvas_x;
        centro_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML="Circunferência pelo método polinomial"; 
        x.innerHTML += "<br>Centro x1=" + centro_x;
        x.innerHTML += "<br>Centro y1=" + centro_y;

        estado = 41
        break;

    case 41:
        //Ocorreu a marcação de um ponto na circunferência
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da circ. x=" + pcirc_x;
        x.innerHTML += "<br>Ponto da circ. y=" + pcirc_y;

        //Desenha
        circ_polinomial_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 40
        break;


    //////////////////////////////////////////////////////
    //Desenho da circunferência pelo método trigonométrico
    //////////////////////////////////////////////////////
    case 50:
        //Guarda primeiro click
        centro_x = canvas_x;
        centro_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML="Circunferência: método trigonométrico"; 
        x.innerHTML += "<br>Centro x=" + centro_x;
        x.innerHTML += "<br>Centro y=" + centro_y;

        estado = 51
        break;

    case 51:
        //Ocorreu a marcação do segundo ponto
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da circ. x=" + pcirc_x;
        x.innerHTML += "<br>Ponto da circ. y=" + pcirc_y;

        //Desenha
        circ_trig_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 50
        break;

    /////////////////////////////////////////////////
    //Desenho da circunferência pelo método Bresenham
    /////////////////////////////////////////////////
    case 60:

        //Guarda o centro da circunferência
        centro_x = canvas_x;
        centro_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML="Circunferência: método Bresenham"; 
        x.innerHTML += "<br>Centro x=" + centro_x;
        x.innerHTML += "<br>Centro y=" + centro_y;

        estado = 61
        break;

    case 61:
        //Regista um ponto da circunferência
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da circ. x=" + pcirc_x;
        x.innerHTML += "<br>Ponto da circ. y=" + pcirc_y;

        //Desenha
        circ_bresenham_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 60
        break;

    //////////////////////////////////////////
    //Desenho da elipse pelo método polinomial
    //////////////////////////////////////////
    case 70:
        //Guarda primeiro click de três clicks
        centro1_x = canvas_x;
        centro1_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Centro1 x=" + centro1_x;
        x.innerHTML += "<br>Centro1 y=" + centro1_y;

        estado = 71
        break;
    
    case 71:
        //Guarda o segundo click de três clicks
        centro2_x = canvas_x;
        centro2_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Centro2 x=" + centro2_x;
        x.innerHTML += "<br>Centro2 y=" + centro2_y;

        estado = 72
        break;

    case 72:
        //Guarda o terceiro click de três clicks
        pelip_x = canvas_x;
        pelip_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da elipse x=" + pelip_x;
        x.innerHTML += "<br>Ponto da elipse y=" + pelip_y;

        //Desenha
        elipse_polinomial_desenha()

        estado = 70
        break;


    //////////////////////////////////////////////
    //Desenho da elipse pelo método trigonométrico
    //////////////////////////////////////////////
    case 80:    
        //Guarda primeiro click de três clicks
        centro1_x = canvas_x;
        centro1_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Centro1 x=" + centro1_x;
        x.innerHTML += "<br>Centro1 y=" + centro1_y;

        estado = 81
        break;

    case 81:
        //Guarda o segundo click de três clicks
        centro2_x = canvas_x;
        centro2_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Centro2 x=" + centro2_x;
        x.innerHTML += "<br>Centro2 y=" + centro2_y;

        estado = 82
        break;
    
    case 82:
        //Guarda o terceiro click de três clicks
        pelip_x = canvas_x;
        pelip_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da elipse x=" + pelip_x;
        x.innerHTML += "<br>Ponto da elipse y=" + pelip_y;

        //Desenha
        elipse_trig_desenha()

        estado = 80
        break;
    

    //////////////////////////////////////////////
    //Preenchimento 4
    //////////////////////////////////////////////
    case 90:    
        //Guarda o click 
        px = canvas_x;
        py = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x=" + px;
        x.innerHTML += "<br>Ponto y=" + py;

        //germen
        germen4(px,py);

        estado = 0
        break;


    //////////////////////////////////////////////
    //Preenchimento 8
    //////////////////////////////////////////////
    case 100:    
        //Guarda o click 
        px = canvas_x;
        py = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x=" + px;
        x.innerHTML += "<br>Ponto y=" + py;

        //germen
        germen8(px,py);

        estado = 0
        break;

    //////////////////////////////////////////////
    //Desenho de um polígono "vectorial"
    //////////////////////////////////////////////
    case 110:    
        pol_primeiroponto();
        break;

    case 111:    
        pol_recebe_ponto();
        break;

    //////////////////////////////////////////////
    //Preenchimento 8
    //////////////////////////////////////////////
    case 120:
        varrimento();
        break;

    default:
        alert("Método não implementado, estado="+estado)

    } //end of switch(estado)

}


///////////////////
// Tela e pixeis
///////////////////


/*
  -------------------------
  Limpa a tela.
  -------------------------
*/



function menu_limpar()
{
        x=document.getElementById("description");
        x.innerHTML = "";

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0,500,500);

        estado = 0;
}


/*
  -------------------------
  Informação sobre o pixel
  -------------------------
*/

function menu_pixel_info()
{
    x=document.getElementById("description");
    x.innerHTML="Informação do pixel:"; 
    estado = 1;
}

function pixel_info()
{
    /*
    http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
    http://www.w3schools.com/tags/canvas_getimagedata.asp

    */

    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    var p = ctx.getImageData(canvas_x, canvas_y, 1, 1).data; 
    
    x=document.getElementById("description");
    x.innerHTML += "<br>Ponto (x,y)=(" + canvas_x + "," + canvas_y + ")";
    x.innerHTML += "<br>R=" + p[0] + ", G=" + p[1] + ",B=" + p[2];

    //console.log(p[0],p[1],p[2],p[3]);
}



/////////////////////////////////
// Algoritmos para varrimento
/////////////////////////////////


/* 
   -------------------------
   Recta: Método do declive
   -------------------------
*/

function menu_reta_declive()
{
    x=document.getElementById("description");
    x.innerHTML="Descrição do método do declive"; 
    //Events
    estado = 10; 
}  

function reta_declive_desenha()
{
    //Reta via javascript 
    //ctx.moveTo(reta_x1,reta_y1);
    //ctx.lineTo(reta_x2,reta_y2);
    //ctx.fillStyle = "#FF0000";
    //ctx.stroke();

    //Reta via algoritmo "Método do Declive"

    if (reta_x2 - reta_x1 == 0 ) {
        reta_declive_vertical();
        return;  
    }

    if ( Math.abs(reta_y2 - reta_y1) <= Math.abs(reta_x2 - reta_x1)) {  
        //declive abs <= 1

        if (reta_x1 > reta_x2) {
           var t = reta_x1;
           reta_x1 = reta_x2;
           reta_x2 = t;

           var t = reta_y1;
           reta_y1 = reta_y2;
           reta_y2 = t;
        }

        var m = (reta_y2 - reta_y1) / (reta_x2 - reta_x1);
        var b = reta_y1 - m * reta_x1;

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        for (var x=reta_x1; x<=reta_x2; x++) {
            ctx.fillStyle = "#FF0000";        
            y = m * x + b;
            ctx.fillRect(x,y,1,1);
        }

    } else {

        //declive abs > 1
        if (reta_y1 > reta_y2) {
           var t = reta_x1;
           reta_x1 = reta_x2;
           reta_x2 = t;

           var t = reta_y1;
           reta_y1 = reta_y2;
           reta_y2 = t;
        }
        im = (reta_x2-reta_x1) / (reta_y2 - reta_y1);
        ib = reta_x1 - im*reta_y1;

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");

        for (var y=reta_y1; y<=reta_y2; y++) {
            ctx.fillStyle = "#FF0000";        
            x = im * y + ib;
            ctx.fillRect(x,y,1,1);
        }

   }

   console.log("Fim do desenho da reta pelo metodo do declive.");

}



function reta_declive_vertical()
{

   //Ajuste dos pontos
   if (reta_y1 > reta_y2) {
       var t = reta_y1;
       reta_y1 = reta_y2;
       reta_y2 = t;
   }

   var c = document.getElementById("acg_canvas");
   var ctx = c.getContext("2d");

   for (y=reta_y1; y<=reta_y2; y++) {
       ctx.fillRect(reta_x1,y,1,1);
   } 

}




/*
 ----------------
 Reta: método DDA
 ----------------
*/


function menu_reta_dda()
{
    x=document.getElementById("description");
    x.innerHTML="Descrição do método DDA"; 
    //Events
    estado = 20 
}  

function reta_dda_desenha()
{


    //Reta via javascript 
    //ctx.moveTo(reta_x1,reta_y1);
    //ctx.lineTo(reta_x2,reta_y2);
    //ctx.fillStyle = "#FF0000";
    //ctx.stroke();

    //Reta via algoritmo "Método do Declive"

    if (reta_x2 - reta_x1 == 0 ) {
        reta_declive_vertical();
        return;  
    }

    if ( Math.abs(reta_y2 - reta_y1) <= Math.abs(reta_x2 - reta_x1)) {  
        //declive abs <= 1

        if (reta_x1 > reta_x2) {
           var t = reta_x1;
           reta_x1 = reta_x2;
           reta_x2 = t;

           var t = reta_y1;
           reta_y1 = reta_y2;
           reta_y2 = t;
        }

        var m = (reta_y2 - reta_y1) / (reta_x2 - reta_x1);

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        y = reta_y1
        for (var x=reta_x1; x<=reta_x2; x++) {
            ctx.fillStyle = "#FF0000";        
            ctx.fillRect(x,y,1,1);
            y += m
        }

    } else {

        //declive abs > 1
        if (reta_y1 > reta_y2) {
           var t = reta_x1;
           reta_x1 = reta_x2;
           reta_x2 = t;

           var t = reta_y1;
           reta_y1 = reta_y2;
           reta_y2 = t;
        }
        im = (reta_x2-reta_x1) / (reta_y2 - reta_y1);

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");

        x = reta_x1
        for (var y=reta_y1; y<=reta_y2; y++) {
            ctx.fillStyle = "#FF0000";        
            ctx.fillRect(x,y,1,1);
            x += im;
        }

   }

   console.log("Fim do desenho da reta pelo metodo DDA.");
}





/*
   -------------------------
   Reta: Método de Bresenham
   -------------------------
*/

function menu_reta_bresenham()
{
    x=document.getElementById("description");
    x.innerHTML="Descrição do método Bresenham"; 
    //Events
    estado = 30 
}  




function reta_bresenham_desenha()
{
    var x1 = reta_x1, y1 = reta_y1, x2 = reta_x2, y2 = reta_y2;

    var dx = x2 - x1, dy = y2 - y1;

    if (dx === 0)  {    //precisamos evitar dividir por 0
       RB_PassoPositivo(x1, y1, x2, y2)
    } else {   //determinamos o declive da recta
       d = dy / dx
       if (d > 0) {
            if (d > 1) {
                // d é maior que 1
                RB_PassoPositivo(x1, y1, x2, y2)
            } else {
                // d está entre 0 e 1
                RB_PassinhoPositivo(x1, y1, x2, y2)
            }
       } else {
            if (d > -1) {
                // d está entre -1 e 0
                RB_PassinhoNegativo(x1, y1, x2, y2)
            } else {
                // d é menor que -1
                RB_PassoNegativo(x1, y1, x2, y2)
            }
        }
    }
   console.log("Fim do desenho da reta pelo método Bresenham.");
}


function RB_PassinhoPositivo(x1, y1, x2, y2) 
{
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";        
        

    var dx = Math.abs(x1 - x2)  // dx > dy logo x será sempre incrementado enquanto que y nem sempre
    var dy = Math.abs(y1 - y2)  // Vem que o que controla o ciclo de desenho é a abcissa
    var inc1 = 2 * dy
    var p = inc1 - dx
    var inc2 = 2 * (dy - dx)    // notar que inc2 < 0

    var x,xfim,y;

    if (x1 > x2) {    //começar no ponto de menor abcissa
       x = x2
       y = y2
       xfim = x1
    } else {
       x = x1
       y = y1
       xfim = x2
    }

    //Desenha(x,y)
    ctx.fillRect(x,y,1,1);

    while (x < xfim) {
        x = x + 1
        if (p < 0) {
            p = p + inc1
        } else {
            y = y + 1
            p = p + inc2
        }

        //Desenha(x,y)
        ctx.fillRect(x,y,1,1);
    }

}

function RB_PassoPositivo(x1, y1, x2, y2) {

    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";        

    var dx = Math.abs(x1 - x2)  // dy > dx logo y será sempre incrementado enquanto que x nem sempre
    var dy = Math.abs(y1 - y2)  // Vem que o que controla o ciclo de desenho é a ordenada
    var inc1 = 2 * dx
    var p = inc1 - dy
    var inc2 = 2 * (dx - dy)    // notar que inc2 < 0

    var y = y1
    var yfim = y2
    var x = x1

    if (x1 === x2) {    //linha vertical
        if (y2 > y1) {
            yfim = y2
            y = y1
        } else {
            yfim = y1
            y = y2
        }
        while (y <= yfim) {  // apenas é necessário incrementar a ordenada, visto que é uma linha vertical
            //Desenha(x1,y)
            ctx.fillRect(x1,y,1,1);
            y = y + 1
        }
    } else {
        if (x1 > x2) {    //começar no ponto de menor abcissa
            x = x2
            y = y2
            yfim = y1
        } else  {
            x = x1
            y = y1
            yfim = y2
        }

        //Desenha(x1,y1)
        ctx.fillRect(x1,y1,1,1);

        while (y < yfim) {
            y = y + 1
            if (p < 0) {
                p = p + inc1
            } else {
                x = x + 1
                p = p + inc2
            }

            //Desenha(x,y)
            ctx.fillRect(x,y,1,1);
        }
    }

}


function RB_PassinhoNegativo(x1, y1, x2, y2) {

    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";        

    var dx = Math.abs(x2 - x1)  // dx > dy logo x será sempre incrementado enquanto que y nem sempre
    var dy = Math.abs(y2 - y1)  // Vem que o que controla o ciclo de desenho é a abcissa
    var p = 2 * dy - dx
    var inc1 = 2 * dy
    var inc2 = 2 * (dy - dx)    // notar que inc2 < 0

    if (x1 > x2) {    //começar no ponto de menor abcissa
       x = x2
       y = y2
       xfim = x1
    } else {
       x = x1
       y = y1
       xfim = x2
    }

    //Desenha(x,y)
    ctx.fillRect(x,y,1,1);

    while (x < xfim) {
        x = x + 1
        if (p < 0) {
            p = p + inc1
        } else {             // Dado que o declive é negativo, conclui-se que
            y = y - 1           // se x1 < x2 então y1 > y2 ou
            p = p + inc2        // se x1 > x2 então y1 < y2
        }                        // Assim, como começámos no ponto de menor abcissa, também
        //Desenha(x,y)         // começámos no ponto de maior ordenada, por isso é que decrementamos y.
        ctx.fillRect(x,y,1,1);
    }
}


function RB_PassoNegativo(x1, y1, x2, y2) {
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";        

    var dx = Math.abs(x2 - x1)  // dy > dx logo y será sempre incrementado enquanto que x nem sempre
    var dy = Math.abs(y2 - y1)  // Vem que o que controla o ciclo de desenho é a ordenada
    var p = 2 * dx - dy
    var inc1 = 2 * dx
    var inc2 = 2 * (dx - dy)    // notar que inc2 < 0

    if (x1 > x2) {    //começar no ponto de menor abcissa
       x = x2
       y = y2
       yfim = y1
    } else {
       x = x1
       y = y1
       yfim = y2
    }

    //Desenha(x,y)            // Dado que o declive é negativo, conclui-se que
    ctx.fillRect(x,y,1,1);  // se x1 < x2 então y1 > y2 ou
                       
    while (y > yfim) {       // se x1 > x2 então y1 < y2
       y = y - 1            // Assim, como começámos no ponto de menor abcissa, também
       if (p < 0) {        // começámos no ponto de maior ordenada, por isso é que decrementamos y.
            p = p + inc1
       } else {
            x = x + 1
            p = p + inc2
        }
       //Desenha(x,y)
        ctx.fillRect(x,y,1,1);
    }
}




//////////////////
// Circunferências
//////////////////


/*
 -------------------------------------
 Circunferência pelo método polinomial
 -------------------------------------
*/


function menu_circ_polinomial()
{
    x=document.getElementById("description");
    x.innerHTML="Circunferência: método polinomial"; 
    //Events
    estado = 40 
}  

function circ_polinomial_desenha()
{
    //Variaveis globais para desenho da circunferência
    //var centro_x1, centro_y1, pcirc_x2, pcirc_y2;
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";

    var raio = Math.floor( Math.sqrt( Math.pow(centro_x - pcirc_x,2) + Math.pow(centro_y - pcirc_y,2) ) );

    var y;
    var xend = Math.floor( raio * Math.sqrt(2)/2.0 )
    for(var x=0; x <= xend; x++) {
        y = Math.floor( Math.sqrt( raio*raio - x*x ) );
        //1º quadrante
        ctx.fillRect(centro_x + x, centro_y + y, 1, 1);
        ctx.fillRect(centro_x + y, centro_y + x, 1, 1);
        //2º quadrante
        ctx.fillRect(centro_x - x, centro_y + y, 1, 1);
        ctx.fillRect(centro_x - y, centro_y + x, 1, 1);
        //3º quadrante
        ctx.fillRect(centro_x - x, centro_y - y, 1, 1);
        ctx.fillRect(centro_x - y, centro_y - x, 1, 1);
        //4º quadrante
        ctx.fillRect(centro_x + x, centro_y - y, 1, 1);
        ctx.fillRect(centro_x + y, centro_y - x, 1, 1);
    }        

}


/*
 ------------------------------------------
 Circunferência pelo método trigonométrico.
 ------------------------------------------
*/

function menu_circ_trig()
{
    x=document.getElementById("description");
    x.innerHTML="Circunferência: método trigonométrico"; 
    //Events
    estado = 50 
}  




function circ_trig_desenha()
{
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";

    /*
    x = r cos( t )
    t1 = acos( x/r )    
    t2 = acos( (x+1)/r ) = acos( x/r + 1/r )
    1/r <= t2 - t1 <= sqrt(2) 1/r, for t in 0, 45º  (via Taylor Series)
    */
    
    var raio = Math.floor( Math.sqrt( Math.pow(centro_x - pcirc_x,2) + Math.pow(centro_y - pcirc_y,2) ) );
    var t_inc = 1.0/raio;
    var x,y;
    var t = Math.PI/2.0;
    while (t > Math.PI/4.0 ) {
        x = raio * Math.cos(t);
        y = raio * Math.sin(t);
        //1º quadrante
        ctx.fillRect(centro_x + x, centro_y + y, 1, 1);
        ctx.fillRect(centro_x + y, centro_y + x, 1, 1);
        //2º quadrante
        ctx.fillRect(centro_x - x, centro_y + y, 1, 1);
        ctx.fillRect(centro_x - y, centro_y + x, 1, 1);
        //3º quadrante
        ctx.fillRect(centro_x - x, centro_y - y, 1, 1);
        ctx.fillRect(centro_x - y, centro_y - x, 1, 1);
        //4º quadrante
        ctx.fillRect(centro_x + x, centro_y - y, 1, 1);
        ctx.fillRect(centro_x + y, centro_y - x, 1, 1);

        t = t - t_inc;
    }        
}


/*
 ------------------------------------------
 Circunferência pelo método trigonométrico.
 ------------------------------------------
*/


function menu_circ_bresenham()
{
    x=document.getElementById("description");
    x.innerHTML="Circunferência: método Bresenham"; 
    //Events
    estado = 60 
}  

function circ_bresenham_desenha()
{
    alert("To do !")
}



///////////////////////
// Elipses
///////////////////////


/* 
   -----------------------------
   Elipse pelo método polinomial
   -----------------------------
*/


function menu_elipse_polinomial()
{
    //Variaveis para desenho da elipse: 3 pontos
    //var centro1_x1, centro2_y1, pcirc_x2, pcirc_y2;

    x=document.getElementById("description");
    x.innerHTML="Elipse: método polinomial"; 
    //Events
    estado = 70 
}  


function elipse_polinomial_desenha()
{
    alert("To do !")
}



/* 
   ----------------------------------
   Elipse pelo método trigonométrico
   ----------------------------------
*/

function menu_elipse_trig()
{
    x=document.getElementById("description");
    x.innerHTML="Elipse: método trigonométrico"; 
    //Events
    estado = 80 
}  


function elipse_trig_desenha()
{
    alert("To do !")
}





///////////////////////
// Preenchimento
///////////////////////


//Controlo da recursividade.
var rec, maxrec=500;


/* 
   ------------------------
   Método Germen 4 (raster)
   ------------------------
*/





function menu_germen4()
{
    x=document.getElementById("description");
    x.innerHTML="Germen 4 (raster)"; 
    //Events
    estado = 90
}



function germen4()
{
    //Obtem a cor do pixel selecionado
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");

    canvas_width  = c.width;
    canvas_height = c.height;

    ctx.fillStyle = "#FF0000";

    rec = 0;

    germen4_doit(px, py, ctx)
    //    x.innerHTML += "<br>R=" + p[0] + ", G=" + p[1] + ",B=" + p[2];
}



function germen4_doit(x, y, ctx, ct)
{
    rec++;
    if (rec>maxrec)
        return;

    var vcor = ctx.getImageData(x, y, 1, 1).data; 

    if (x<0 || x>=canvas_width || y<0 || y>=canvas_height)
        return;

    if (vcor[0]!=255 || vcor[0]!=255 || vcor[0]===0) {
        //Pinta
        ctx.fillRect(x, y, 1, 1);
        //Propaga
        germen4_doit(x+1,y,ctx);
        germen4_doit(x-1,y,ctx);
        germen4_doit(x,y+1,ctx);
        germen4_doit(x,y-1,ctx);
    }
}



/* 
   ------------------------
   Método Germen 8 (raster)
   ------------------------
*/



function menu_germen8()
{
    x=document.getElementById("description");
    x.innerHTML="Germen 8 (raster)"; 
    //Events
    estado = 100
}


function germen8()
{
    //Obtem a cor do pixel selecionado
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");

    canvas_width  = c.width;
    canvas_height = c.height;

    ctx.fillStyle = "#FF0000";

    rec = 0;

    germen8_doit(px, py, ctx)
    //    x.innerHTML += "<br>R=" + p[0] + ", G=" + p[1] + ",B=" + p[2];
}



function germen8_doit(x, y, ctx, ct)
{
    rec++;
    if (rec>maxrec)
        return;

    var vcor = ctx.getImageData(x, y, 1, 1).data; 

    if (x<0 || x>=canvas_width || y<0 || y>=canvas_height)
        return;

    if (vcor[0]!=255 || vcor[0]!=255 || vcor[0]===0) {
        //Pinta
        ctx.fillRect(x, y, 1, 1);
        //Propaga: horizontal e vertical (4 sentidos)
        germen8_doit(x+1,y,ctx);
        germen8_doit(x-1,y,ctx);
        germen8_doit(x,y+1,ctx);
        germen8_doit(x,y-1,ctx);
        //Propaga: diagonal principal e secundária (4 sentidos)
        germen8_doit(x-1,y-1,ctx);
        germen8_doit(x-1,y+1,ctx);
        germen8_doit(x+1,y-1,ctx);
        germen8_doit(x+1,y+1,ctx);


    }
}



/* 
   --------------------------------------
   Desenho de um polígono (vectorial)
   --------------------------------------
*/

function menu_desenha_poligono()
{
    x=document.getElementById("description");
    x.innerHTML="Desenho de um polígono (vectorial)"; 

    //Prepara pontos
    ptspol = []; //Lista vazia

    //Events
    estado = 110;
}



function pol_primeiroponto()
{
        //Guarda o click 
        pfirst_x = canvas_x;
        pfirst_y = canvas_y;
        
        ptspol.push( {x: pfirst_x, y: pfirst_y} );

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo( pfirst_x, pfirst_y );

        estado = 111;
}



function pol_recebe_ponto()
{
    var stop_draw = false;

    //Ponto clicado.
    pol_x = canvas_x;
    pol_y = canvas_y;

    //Fechar a linha poligonal ?
    if ( Math.abs(pol_x - pfirst_x)<10 && Math.abs(pol_y - pfirst_y)<10 ) {
        pol_x = pfirst_x;
        pol_y = pfirst_y;
        stop_draw = true; //nao desenha mais    
    }

    //Regista
    ptspol.push( {x: pol_x, y: pol_y} )

    //Se existe um primeiro ponto desenha este segmento recente.
    if (estado===111) {
        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        ctx.lineTo(pol_x,pol_y);
        ctx.stroke();
    }
        
    if (stop_draw) {
        estado=0; //nao desenha mais    
    }
}


function desenha_poligono()
{
    //Desenha a partir do array ptspol
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    
    //Um ponto
    var p;

    //Primeiro ponto
    var p1 = ptspol[0];

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo( p1.x, p1.y );

    for (i=1; i<ptspol.length; i++) {
        p = ptspol[i];
        ctx.lineTo(p.x,p.y);
        ctx.stroke();
    }
    ctx.lineTo(p1.x,p1.y);
    ctx.stroke();

}



/* 
   --------------------------------------
   Método Linha de Varrimento (vectorial)
   --------------------------------------
*/

function menu_varrimento()
{
    x=document.getElementById("description");
    x.innerHTML="Varrimento (vectorial)"; 

    //Events
    estado = 120;

    //Temporário: para debug apenas
    //ptspol = [ {x:100,y:100}, {x:150,y:100}, {x:100,y:150}, {x:100,y:100} ];
    //desenha_poligono();
}


function varrimento()
{
    //Varre e regressa logo ao estado base.
    estado = 0;

    //Pixel selecionado potencialmente dentro de um ou mais polígonos.
    px = canvas_x;
    py = canvas_y;

    //Verificar se o polígono foi selecionado:
    //--> passar agora porque só há um polígono.

    //Obtem ymin e ymax.
    var ymin, ymax;

    //Assume-se um polígono fechado
    npts = ptspol.length;

    ymin = ptspol[0].y;
    ymax = ptspol[0].y;

    for (i=1; i<npts; i++) {
        if (ptspol[i].y > ymax)
            ymax = ptspol[i].y;
        if (ptspol[i].y < ymin)
            ymin = ptspol[i].y;
    }

    //Scan line vai de ymin até ymax
    for (yline = ymin+1; yline<=ymax-1; yline++)
        scanline_plot(yline);

    desenha_poligono();
}

function scanline_plot(yline)
{
    //Definição de Segmento: 
    //         dois pontos consecutivos da lista ptspol.


    //Determinar as interseções X e segmentos onde ocorre essa interseção.
    intersections = []; //{x:, p:} x=posição x da intersecção; p: 1ª posição do segmento

    var x1,y1,x2,y2;


    //Percorre todos os segmentos
    for (p=0; p<npts-1; p++) {
        x1 = ptspol[p].x;
        y1 = ptspol[p].y;
        x2 = ptspol[p+1].x;
        y2 = ptspol[p+1].y;
        res = classifica_intersecta(x1,y1,x2,y2,yline);
        //console.log(x1,y1,x2,y2,yline,":",res);
        if (res) {
            if (res instanceof Array) {
                intersections = intersections.concat(res);
            } else {
                intersections.push(res);
            }
        }

    }

    //There must be at least one intersection.
    intersections.sort(compare_x);

    //Desenha a partir do array ptspol
    var c = document.getElementById("acg_canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    
    //Extrai x de interesse
    var i=0;
    intersec = [];
    while (i<intersections.length) {
        if (intersections[i].type=='i') {
            intersec.push(intersections[i].x);
            i++;
        } else if (intersections[i].type=='min' && intersections[i+1].type=='max') {
            //se há um min tb há um max ou outro min (e vice versa)
            intersec.push(intersections[i].x);
            i+=2;
        } else if (intersections[i].type=='min' && intersections[i+1].type=='h') {
            //se há um min tb há um max ou outro min (e vice versa)
            intersec.push(intersections[i].x);
            i+=2;
        } else if (intersections[i].type=='max' && intersections[i+1].type=='h') {
            //se há um min tb há um max ou outro min (e vice versa)
            intersec.push(intersections[i].x);
            i+=2;
        } else
            i+=2; //outros: min min, max max, 
    }
    
    //"printa-os"
    var x1,x2;
    for (i=0; i<intersec.length; i=i+2) {
        x1 = intersec[i];
        x2 = intersec[i+1];
        if (x2-x1>2)
            ctx.fillRect(x1+1,yline,x2-x1+1-3,1);
    }

}

function compare_x(o1,o2) 
{
    if (o1.x < o2.x)
        return -1;
    if (o1.x > o2.x)
        return 1;
    if (o1.type=='min' && o2.type=='max')
        return -1;
    if (o1.type=='max' && o2.type=='min')
        return 1;
    if (o1.type=='min' && o2.type=='h')
        return -1;
    if (o1.type=='max' && o2.type=='h')
        return -1;
    return 0;
}


function classifica_intersecta(x1,y1,x2,y2,yline)
{
    //INPUT:
    //x1,y1,x2,y2 são inteiros e definem os extremos dum segmento.
    //y é um inteiro que define a posição scanline que varre desde 
    //o topo do polígono até baixo.
    //OUTPUT:
    //lista de:
    // {x: xi, type: 'h'} //intersects an horizontal line
    // {x: xi, type: 'i'} // intersects the interior point of a segment
    // {x: xi, type: 'min'} // intersects in the minimum y 
    // {x: xi, type: 'max'} // intersects in the maximum y 

    //Bounding box do segmento
    var ymin,ymax;
    if (y1 < y2) {
        ymin=y1;
        ymax=y2;
    } else {
        ymin = y2;
        ymax = y1;
    }
    if (yline<ymin || yline>ymax)
        return false;

    //Segmento horizontal
    if ( (y1-yline)==0 && (y2-yline)==0 ) {   // ou y==y1==y2
        //há 3 casos \_/   \_  /=\
        //                   \
        //Devolve os pontos inicial e final.
        return [ { x: x1, type: 'h'}, { x: x2, type: 'h'} ];
    }

    //Se a yline intersecta o mínimo
    if (yline == ymin) {
        if (ymin==y1)
            return { x: x1, type: 'min'}
        if (ymin==y2)
            return { x: x2, type: 'min'}
    }    

    //Se a yline intersecta o máximo
    if (yline == ymax) {
        if (ymax==y1)
            return { x: x1, type: 'max'}
        if (ymax==y2)
            return { x: x2, type: 'max'}
    }

    //Se a linha é vertical (interseção com ponto interior)
    if (x1==x2)
        return { x:x1, type: 'i'}

    //Caso oblíquo 
    //A yline intersecta a bounding box pelo que existe intersecção.
    var dx = x2-x1;
    var dy = y2-y1;
    var b = (y1*x2-y2*x1)/dx;
        
    var xline = (dx*yline + x1*y2 - x2*y1)/dy;

    return {x: xline, type: 'i'};

}


