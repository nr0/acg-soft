
/*

// Para desenhar um ponto:

        var c = document.getElementById("acg_canvas");
        var ctx = c.getContext("2d");
        ctx.fillRect(x,y,1,1);   //  COLOCAR EM X,Y: as coordenadas do ponto.

*/


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

   console.log("Fim do desenho da reta pelo metodo do declive.");
}



function reta_declive_vertical()
{

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


   console.log("Fim do desenho da reta pelo método Bresenham.");
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

}


