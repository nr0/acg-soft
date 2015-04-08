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

//Variaveis de acesso ao canvas
var canvas;
var ctx;

//variveis auxiliares para desenho
var desenha = true;
var temp = 0;

//Variaveis para o desenho da reta
var reta_x1, reta_y1, reta_x2, reta_y2;

//variaveis auxiliares reta Bresenham
var pontosBre = [];

//Variaveis para desenho da circunferência
var centro_x, centro_y, pcirc_x, pcirc_y;

//variaveis auxiliares circunferencia Bresenham
var pontosCircBre = [];

//Variaveis para desenho da elipse
var centro1_x, centro1_y, centro2_x, centro2_y, pelip_x, pelip_y;
var pelip1_x, pelip1_y, pelip2_x, pelip2_y; //elipse trigonometrica

//variaveis auxiliares elipse trigonometrica
var pontosEtrig = [];

//Variaveis para o preenchimento
var px,py;
var canvas_width, canvas_height;

//Desenho de um polígono vectorial
var ptspol; //pontos de um polígono.
var npts; //num de pontos.

//Recorte de retas
var segsReta = [];

//Recorte de poligonos


////////////////////////
// Inicializar canvas //
////////////////////////
 window.onload = function initialize() {
	 canvas = document.getElementById("acg_canvas");
	 ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown",doMouseDown,false);
    canvas.addEventListener("mousemove",mouseMove,false);
    canvas.addEventListener("mouseout",mouseOut,false);
}


////////////////////////////
// Canvas Event handlers
////////////////////////////

function mouseMove(event) {
	
	canvas_x = event.layerX-4;
   canvas_y = event.layerY-4;
	
	switch(estado){
		// reta bresenham temporaria
		case 31:{
			document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
			//apagar reta temporaria
			if(desenha){ 
				temp = 1;
				reta_bresenham_desenha();
			}
		
			//desenhar a nova reta temporaria
			temp = 0;
			desenha=true;
			reta_x2 = canvas_x;
			reta_y2 = canvas_y;
			reta_bresenham_desenha();
			break;
		}
		// circunferencia de bresenham temporaria
		case 61:{
			document.getElementById("temp").innerHTML = "Raio da circ. "+ pontosCircBre.length +" = " +
					 dist( {x:centro_x, y:centro_y}, {x:canvas_x, y:canvas_y } ) + "<br>" +
					 "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			//apagar circunferencia temporaria
			if(desenha){
				temp = 1;
				circ_bresenham_desenha();
			}
		
			//desenhar a nova circunferencia temporaria
			temp = 0;
			desenha=true;
			pcirc_x = canvas_x;
			pcirc_y = canvas_y;
			circ_bresenham_desenha();
			break;
		}
		//elipse trigonometrica temporaria
		case 81:{
			document.getElementById("temp").innerHTML =  "Centro ET"+(pontosEtrig.length+1)+" ( "+pelip1_x+"; "+
					canvas_y + ")<br>" + "Eixo Horizontal ET"+(pontosEtrig.length+1) +" = "+
					 Math.abs(pelip1_x-canvas_x) + "<br>" + "Eixo Vertical ET"+(pontosEtrig.length+1) + " = " +
					 Math.abs(pelip1_y-canvas_y) +"<br>"+ "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			//apagar elipse temporaria
			if(desenha){
				temp = 1;
				elipse_trig_desenha();
			}
			
			//desenhar a nova elipse temporaria
			temp = 0;
			desenha=true;
			pelip2_x = canvas_x;
			pelip2_y = canvas_y;
			elipse_trig_desenha();
			break;
		}
		
		case 130:{
			document.getElementById("temp").innerHTML = "Selecione o primeiro ponto<br>" + "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			break;
		}
		case 131:{
			document.getElementById("temp").innerHTML = "Selecione o segundo ponto<br>" + "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			
			break;
		}
		case 135:{
				document.getElementById("temp").innerHTML = "Selecione o primeiro ponto da janela de recorte...<br>x = "+ canvas_x + "<br>y = "+canvas_y;
			
			
			break;
		}
		case 136:{
			document.getElementById("temp").innerHTML = "Selecione o segundo ponto da janela de recorte...<br>x = "+ canvas_x + "<br>y = " + canvas_y;
			break;
		}
		default:
			document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
			break;
		
	}
	
	imprimePontos();
}

function mouseOut(event){
	
	canvas_x = event.layerX-4;
   canvas_y = event.layerY-4;
	document.getElementById("temp").innerHTML = "x = "+ "indefinido" + "<br>y = " + "indefinido";
	
}


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
    case 0:{
    	break;
    }
    

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
        x.innerHTML += "<br>Ponto x1 =" + reta_x1;
        x.innerHTML += "<br>Ponto y1 =" + reta_y1;

        estado = 11;
        break;

    case 11:
        //Ocorreu a marcação do segundo ponto (metodo do declive)
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto x2=" + reta_x2;
        x.innerHTML += "<br>Ponto y2=" + reta_y2;

        //Desenha
        reta_declive_desenha(); //coordenadas são globais

        //Regressa ao estado original
        estado = 10;
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

        estado = 21;
        break;

    case 21:
        //Ocorreu a marcação do segundo ponto
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;

        x.innerHTML += "<br>Ponto x2=" + reta_x2;
        x.innerHTML += "<br>Ponto y2=" + reta_y2;

        //Desenha
        reta_dda_desenha(); //coordenadas são globais
        
        //Regressa ao estado
        estado = 20;
        break;        

    /////////////////////////////////
    //Desenho da reta pelo Bresenham
    /////////////////////////////////
    case 30:
        //Guarda primeiro click
        reta_x1 = canvas_x;
        reta_y1 = canvas_y;
        
        pontosBre[pontosBre.length] = {x:reta_x1, y:reta_y1};
        
        document.getElementById("description").innerHTML += "<br>Ponto B" + (pontosBre.length) + " ( " + reta_x1 + "; " + reta_y1 + ")";
        
        estado = 31;
        temp=0;
        desenha = false;
        break;

    case 31:
        //Ocorreu a marcação do segundo ponto 
        reta_x2 = canvas_x;
        reta_y2 = canvas_y;
        
        pontosBre[pontosBre.length] = {x:reta_x2, y:reta_y2};
        
        document.getElementById("description").innerHTML += "<br>Ponto B" + (pontosBre.length) + " ( " + reta_x2 + "; " + reta_y2 + ") <br>";
        
        //Desenha
        temp=-1;
        reta_bresenham_desenha(); //coordenadas são globais
        imprimePontosBre();
        
        //Regressa ao estado
        estado = 30;
        temp=0;
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

        estado = 41;
        break;

    case 41:
        //Ocorreu a marcação de um ponto na circunferência
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da circ. x=" + pcirc_x;
        x.innerHTML += "<br>Ponto da circ. y=" + pcirc_y;

        //Desenha
        circ_polinomial_desenha(); //coordenadas são globais

        //Regressa ao estado
        estado = 40;
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

        estado = 51;
        break;

    case 51:
        //Ocorreu a marcação do segundo ponto
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da circ. x=" + pcirc_x;
        x.innerHTML += "<br>Ponto da circ. y=" + pcirc_y;

        //Desenha
        circ_trig_desenha(); //coordenadas são globais

        //Regressa ao estado
        estado = 50;
        break;

    /////////////////////////////////////////////////
    //Desenho da circunferência pelo método Bresenham
    /////////////////////////////////////////////////
    case 60:
        //Guarda o centro da circunferência
        centro_x = canvas_x;
        centro_y = canvas_y;
		  pontosCircBre[pontosCircBre.length] = {x:centro_x, y:centro_y};
		  
		  pintaPixel(centro_x, centro_y);
		  
        document.getElementById("description").innerHTML += "<br>Centro B"+ (pontosCircBre.length) +" (" + centro_x + "; " + centro_y + ")";
        document.getElementById("temp").innerHTML = "Raio da circ. "+ (pontosCircBre.length) +" = 0<br>" + document.getElementById("temp").innerHTML;
        	
        estado = 61;
        desenha=false;
        temp=0;
        break;

    case 61:
        //Regista um ponto da circunferência
        pcirc_x = canvas_x;
        pcirc_y = canvas_y;
        
        document.getElementById("description").innerHTML += "<br>Raio da circ. "+ (pontosCircBre.length) +" = " +
        				dist( {x:centro_x, y:centro_y}, {x:pcirc_x, y:pcirc_y } ) + "<br>";        
        
        document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
        
        //Desenha
        temp=-1;
        circ_bresenham_desenha() //coordenadas são globais

        //Regressa ao estado
        estado = 60;
        temp = 0;
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

        estado = 71;
        break;
    
    case 71:
        //Guarda o segundo click de três clicks
        centro2_x = canvas_x;
        centro2_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Centro2 x=" + centro2_x;
        x.innerHTML += "<br>Centro2 y=" + centro2_y;

        estado = 72;
        break;

    case 72:
        //Guarda o terceiro click de três clicks
        pelip_x = canvas_x;
        pelip_y = canvas_y;

        x=document.getElementById("description");
        x.innerHTML += "<br>Ponto da elipse x=" + pelip_x;
        x.innerHTML += "<br>Ponto da elipse y=" + pelip_y;

        //Desenha
        elipse_polinomial_desenha();

        estado = 70;
        break;


    /////////////////////////////////////////////////
    //Desenho da elipse pelo método trigonométrico //
    /////////////////////////////////////////////////
    case 80:    
        //Guarda o centro da elipse
        pelip1_x = canvas_x;
        pelip1_y = canvas_y;
        
        document.getElementById("temp").innerHTML = "Centro ET"+(pontosEtrig.length+1)+" ( "+pelip1_x+"; "+
					canvas_y + ")<br>" + "Eixo Horizontal ET"+(pontosEtrig.length+1) +" = 0<br>"+
					"Eixo Vertical ET"+(pontosEtrig.length+1)+" = 0<br>"+ document.getElementById("temp").innerHTML;
        
        desenha=false;
        temp=0;
        estado = 81;
        break;

    case 81:
        //Guarda um ponto da elipse
        pelip2_x = canvas_x;
        pelip2_y = canvas_y;
        
			//guarda o centro da elipse
        pontosEtrig[pontosEtrig.length] = {x:pelip1_x, y:pelip2_y, eixoH:Math.abs(pelip1_x-pelip2_x), eixoV:Math.abs(pelip1_y-pelip2_y)};
        
        document.getElementById("description").innerHTML += "<br>Centro ET"+ pontosEtrig.length +" ( " + pelip1_x + "; " + pelip2_y + ")";
        document.getElementById("description").innerHTML += "<br>Eixo Horizontal ET"+ pontosEtrig.length +" = "+ pontosEtrig[pontosEtrig.length-1].eixoH;
        document.getElementById("description").innerHTML += "<br>Eixo Vertical ET"+ pontosEtrig.length +" = "+ pontosEtrig[pontosEtrig.length-1].eixoV + "<br>";
        document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
        
        //Desenha
        temp=-1;
        elipse_trig_desenha();
		  imprimePtsET();
			
		  //Regressa ao estado
        estado = 80;
        temp = 0;
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

        estado = 0;
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

        estado = 0;
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
    
    ////////////////////////////////
    // Recorte Retas Liang-Barsky //
    ////////////////////////////////
		case 130:{
			ctx.beginPath();
			//primeiro ponto
			ctx.moveTo(canvas_x, canvas_y);
			document.getElementById("temp").innerHTML = "Introduzir Segmentos de Reta<br><br>Selecione o segundo ponto<br>" + "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			estado = 131;
			break;
		}
		case 131:{
    		ctx.lineTo(canvas_x, canvas_y);
    		ctx.strokeStyle = "red";
    		ctx.fill();
    		ctx.stroke();
    		
    		document.getElementById("rlb").innerHTML = "<button onclick=\"func()\" >Definir Janela de Recorte</button>";
    		document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
			estado = 130;
			break;
		}
		case 135:{
			ctx.beginPath();
			//primeiro ponto do retangulo de recorte
			reta_x1 = canvas_x;
			reta_y1 = canvas_y;
			document.getElementById("temp").innerHTML = "Selecione o segundo ponto da janela de recorte...<br>x = "+ canvas_x + "<br>y = " + canvas_y;
			
			estado = 136;
			break;
		}
		case 136:{
			reta_x2=canvas_x;
			reta_y2=canvas_y;
			document.getElementById("temp").innerHTML = "x = "+ canvas_x + "<br>y = " + canvas_y;
			
			recorte_LiangBarsky(reta_x1, reta_y1,reta_x2, reta_y2);
			estado = 130;
			break;
		}
    
    default:
        alert("Método não implementado, estado="+estado)

    } //end of switch(estado)
    
}


function func(){

	estado=135;
	document.getElementById("temp").innerHTML = "Selecione o primeiro ponto da janela de recorte...<br>"+document.getElementById("temp").innerHTML;
	document.getElementById("rlb").innerHTML = "";
}

/////////////////////
//  Tela e pixeis  //
/////////////////////


/*
  -------------------------
  Limpa a tela e alguns dados
  -------------------------
*/
function menu_limpar()
{
	document.getElementById("description").innerHTML = "";

	ctx.clearRect(0, 0,canvas.width,canvas.height);

	estado = 0;
	pontosBre = [];
	pontosCircBre = [];
	pontosEtrig = [];
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
    estado = 20; 
}  

function reta_dda_desenha()
{

    //Reta via javascript 
    //ctx.moveTo(reta_x1,reta_y1);
    //ctx.lineTo(reta_x2,reta_y2);
    //ctx.fillStyle = "#FF0000";
    //ctx.stroke();

    //Reta via algoritmo "Método do Declive"

    

   console.log("Fim do desenho da reta pelo metodo DDA.");
}



/*
   -------------------------
   Reta: Método de Bresenham
   -------------------------
*/
function menu_reta_bresenham(){
    document.getElementById("description").innerHTML="Descrição do método Bresenham<br>"; 
    //Events
    estado = 30;
}  

// NOVA reta_bresenham_desenha()
function reta_bresenham_desenha(){
	
	var x1 = reta_x1, y1 = reta_y1, x2 = reta_x2, y2 = reta_y2;
	
	var dy = Math.abs(y2 - y1);
	var dx = Math.abs(x2 - x1);
	
	var ix = (x1 < x2 ? 1 : -1); // direcao incremento
	var iy = (y1 < y2 ? 1 : -1);

	var dy2 = (dy << 1); // slope scaling factors to avoid floating point
	var dx2 = (dx << 1);
	
	var d = 0;  // delta do valor exato e do valor arredondado da variavel dependente
	
	confDesenho();
	
	if (dy <= dx){
		for (;;) {
			pintaPixel(x1, y1);
			
			if (x1 == x2)
				break;
			
			x1 += ix;
			d += dy2;
			if (d > dx) {
				y1 += iy;
				d -= dx2;
			}
		}
	}
	if(dy > dx){
		for (;;) {
			pintaPixel(x1, y1);
			
			if (y1 == y2)
				break;
			
			y1 += iy;
			d += dx2;
			if (d > dy) {
				x1 += ix;
				d -= dy2;
			}
		}
	}
	//console.log("Fim do desenho da reta pelo método Bresenham.");
}


/////////////////////
// Circunferências //
/////////////////////

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
    estado = 40;
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
	alert("To do!");  
}


/*
 ------------------------------------------
 Circunferência pelo método de Bresenham.
 ------------------------------------------
*/

function menu_circ_bresenham()
{
    document.getElementById("description").innerHTML = "Circunferência: Método de Bresenham<br>"; 
    //Events
    estado = 60; 
}  

function circ_bresenham_desenha(){

	var r = Math.floor(Math.sqrt( Math.pow( centro_x - pcirc_x, 2) + Math.pow( centro_y - pcirc_y, 2)  ));
	
	var x = 0;
	var y = r;
	var d = (3-2*r);
	
	confDesenho();
	
	while( x <= y ){
		if(d<0)
			d = d + 4*x + 6;
		else{
			d = d + 4*(x-y) + 10;
			y = y-1;
		}
		
		pintaPixel( x + centro_x, y + centro_y);
		pintaPixel( -x + centro_x, -y + centro_y);
		pintaPixel( y + centro_x, x + centro_y);
		pintaPixel( -y + centro_x, -x + centro_y);
		pintaPixel( -y + centro_x, x + centro_y);
		pintaPixel( y + centro_x, -x + centro_y);
		pintaPixel( -x + centro_x, y + centro_y);
		pintaPixel( x + centro_x, -y + centro_y);
		
		x++;
	}
}



///////////////////////
//      Elipses      //
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
    x.innerHTML="Elipse: Método polinomial"; 
    //Events
    estado = 70;
}  

function elipse_polinomial_desenha()
{
    alert("To do !");
}



/*
   ----------------------------------
   Elipse pelo método trigonométrico
   ----------------------------------
*/
function menu_elipse_trig()
{
    document.getElementById("description").innerHTML="Elipse: Método Trigonométrico<br>"; 
    //Events
    estado = 80;
}  

function elipse_trig_desenha(){
	
	var x1 = pelip1_x;
	var y1 = pelip1_y;
	var x2 = pelip2_x;
	var y2 = pelip2_y;
	
	var a = Math.abs(x2-x1);
	var b = Math.abs(y2-y1);
	var ang=0;
	var angFim = 11/7; // Pi/2
    
	confDesenho();
	while(ang <= angFim+0.005){
		var x = Math.round(a*Math.cos(ang));
		var y = Math.round(b*Math.sin(ang));
		
		pintaPixel( x + x1, y + y2);
		pintaPixel( -x +x1, y + y2);
		pintaPixel( x + x1, -y +y2);
		pintaPixel( -x +x1, -y +y2);
		
		ang+=0.005;
	}
}


///////////////////////
// Preenchimento
///////////////////////


//Controlo da recursividade.
var rec, maxrec=600;
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
    estado = 90;
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
    estado = 100;
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

    germen8_doit(px, py, ctx);
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

///////////////
//  Recorte  //
///////////////

/*
Recorte de retas pelo método de Liang-Barsky
*/
function menu_recorte_LiangBarsky(){
	document.getElementById("description").innerHTML="Recorte: Método de Liang-Barsky"; 
	
	//Events
	if(pontosBre.length>1){ //existe pelo menos uma reta desenhada
		document.getElementById("temp").innerHTML = "Selecione o primeiro ponto da janela de recorte<br>" + document.getElementById("temp").innerHTML;
		estado=135;
	}
	else{
		estado=130;
		document.getElementById("temp").innerHTML = "Introduzir Segmentos de Reta<br><br>Selecione o primeiro ponto<br>" + document.getElementById("temp").innerHTML;
	}
}

function recorte_LiangBarsky(a,b,c,d){
	
	console.log(a);
	console.log(b);
	console.log(c);
	console.log(d);
	
	
	
	
	//definir retangulo e recortar as retas
}

/*
Recorte de retas pelo método de Cohen-Sutherland
*/
function menu_recorte_CohenSutherland(){
	document.getElementById("description").innerHTML="Recorte: Método de Cohen-Sutherland"; 
	//Events
	estado = 140;
}

function recorte_CohenSutherland(){
	
}

	
function menu_recorte_Poligonos(){
	document.getElementById("description").innerHTML="Recorte: Polígonos"; 
	//Events
	estado = 150;
}

function recorte_Poligonos(){
	//definir poligonos
	
	//definir retangulo e recortá-los
}



//////////////////////////
//  Funcoes auxiliares  //
//////////////////////////


// altera as configurações de desenho
function confDesenho(){
	
	if(temp == 1){  //apagar
		ctx.globalCompositeOperation = "xor";
		ctx.fillStyle = "red";
		return;
	}
	if(temp == 0){  //temporario
		ctx.globalCompositeOperation = "xor";
		ctx.fillStyle = "gray";
		return;
	}
	
	//desenho final
	ctx.globalCompositeOperation = "source-over";  // por definicao
	ctx.fillStyle = "red";
}

//pinta um determinado pixel
function pintaPixel(_x, _y){
	ctx.fillRect(_x, _y, 1, 1);
}

//devolve a distancia entre dois pontos
function dist(A, B){
	return Math.floor(Math.sqrt(Math.pow(A.x-B.x,2)+ Math.pow(A.y-B.y,2)));
}

//imprime todos os pontos armazenados em memoria
function imprimePontos(){
	imprimePontosBre();
	imprimePtsCircBre();
	imprimePtsET();
}

//imprime pontos das retas de bresenham
function imprimePontosBre() {
	
	for(var i=0; i<pontosBre.length-1;i=i+2){
		var dx = pontosBre[i+1].x - pontosBre[i].x;
		var dy = pontosBre[i+1].y - pontosBre[i].y;
		
		//apaga os anteriores
		ctx.fillStyle = "white";
		ctx.fillText(("B" + (i+1)), pontosBre[i].x + (dx>0?-15+(i>=9?-8:0):2), pontosBre[i].y + (dy>0?-2:2));
		ctx.fillText(("B" + (i+2)), pontosBre[i+1].x + (dx>0?2:-15+(i>=9?-8:0)) , pontosBre[i+1].y + (dy>0?2:-2));

		//imprime o novo estado
		ctx.fillStyle = "black";
		ctx.fillText(("B" + (i+1)), pontosBre[i].x + (dx>0?-15+(i>=9?-8:0):2), pontosBre[i].y + (dy>0?-2:2));
		ctx.fillText(("B" + (i+2)), pontosBre[i+1].x + (dx>0?2:-15+(i>=9?-8:0)) , pontosBre[i+1].y + (dy>0?2:-2));
	}
}

//imprime os centros das circunferencias de bresenham
function imprimePtsCircBre(){
	for(var i=0; i<pontosCircBre.length;i++){
		
		//apaga os anteriores
		ctx.fillStyle = "white";
		ctx.fillText(("CB" + (i+1)), pontosCircBre[i].x + 2, pontosCircBre[i].y - 3);

		//imprime o novo estado
		ctx.fillStyle = "black";
		ctx.fillText(("CB" + (i+1)), pontosCircBre[i].x + 2, pontosCircBre[i].y - 3);
		
		pintaPixel(pontosCircBre[i].x, pontosCircBre[i].y);
	}
}

//imprime os centros das elipses em modo trigonometrico
function imprimePtsET(){
	for(var i=0; i<pontosEtrig.length;i++){
		//apaga os anteriores
		ctx.fillStyle = "white";
		ctx.fillText(("ET" + (i+1)), pontosEtrig[i].x + 2, pontosEtrig[i].y - 3);

		//imprime o novo estado
		ctx.fillStyle = "black";
		ctx.fillText(("ET" + (i+1)), pontosEtrig[i].x + 2, pontosEtrig[i].y - 3);
		
		pintaPixel(pontosEtrig[i].x, pontosEtrig[i].y);
	}
}


