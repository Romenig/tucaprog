var workspace;
var blocklyDiv;
var canvas;
var angulo;
var paths;
var path;
var cor;
var bugio;
var pontoAtual;
var interpreter;
var highlightPause = false;
var parseBool = false;
var grid;
var xCenter;
var yCenter;
var stop = false;
var forCount = 0;
var blocklyArea;

$(function() {
    blocklyArea = document.getElementById('blocklyArea');
    blocklyDiv = document.getElementById('blocklyDiv');
    workspace = Blockly.inject(blocklyDiv, {
        toolbox: document.getElementById('toolbox'),
        trashcan: true		
    });
    var onresize = function(e) {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    };
    window.addEventListener('resize', onresize, false);
    onresize();
    Blockly.svgResize(workspace);
    canvas = document.getElementById('myCanvas');
    paper.setup(canvas);
    initVariables();
    initCanvas();
    initGrid();
});

function resetCanvas() {
    paper.project.clear();
    initVariables();
    initCanvas();
    initGrid();
}

function downloadDataUri(options) {
    if (!options.url)
        options.url = "http://download-data-uri.appspot.com/";
    $('<form method="post" action="' + options.url +
        '" style="display:none"><input type="hidden" name="filename" value="' +
        options.filename + '"/><input type="hidden" name="data" value="' +
        options.data + '"/></form>').appendTo('body').submit().remove();
}



function hideCanvasElements(boolean){
    for(var i = 0; i < grid.length; i++){
        grid[i].visible = false;
    }
    for(var i = 0; i < gridText.length; i++){
        gridText[i].visible = false;
    }
    bugio.visible = false;
    paper.view.draw();

}

function showCanvasElements(){
    for(var i = 0; i < grid.length; i++){
        grid[i].visible = true;
    }
    for(var i = 0; i < gridText.length; i++){
        gridText[i].visible = true;
    }
    bugio.visible = true;
    paper.view.draw();

}

function downloadPNG() {
    hideCanvasElements();
    var thisImage = new Image();
    thisImage = canvas.toDataURL("image/png");
    downloadDataUri({
        data: thisImage,
        filename: 'imagem.png'
    });
    showCanvasElements();
    paper.view.draw();
}

function downloadSVG() {
    hideCanvasElements();
    var svg = paper.project.exportSVG({
        asString: true
    });
    downloadDataUri({
        data: 'data:image/svg+xml;base64,' + btoa(svg),
        filename: 'imagem.svg'
    });
    showCanvasElements();
    paper.view.draw();
};

function initGrid() {
    grid = [];
    gridText = [];
    var x, y;

    for (var i = 0; i < canvas.width; i += 30) {
        var line = new paper.Path();
        line.strokeColor = "#eeeeee";
        line.add(new paper.Point(i, 0));
        line.add(new paper.Point(i, canvas.height));
        grid.push(line);
    }

    for (var i = 0; i < canvas.height; i += 30) {
        var line = new paper.Path();
        line.strokeColor = "#eeeeee";
        line.add(new paper.Point(0, i));
        line.add(new paper.Point(canvas.width, i));
        grid.push(line);
    }

    var xline = new paper.Path();
    xline.strokeColor = "#dddddd";
    xline.add(new paper.Point(0, yCenter));
    xline.add(new paper.Point(canvas.width, yCenter));
    xline.strokeWidth = 1;
    grid.push(xline);

    var yline = new paper.Path();
    yline.strokeColor = "#dddddd";
    yline.strokeWidth = 1;
    yline.add(new paper.Point(xCenter, 0));
    yline.add(new paper.Point(xCenter, canvas.height));
    grid.push(yline);

    for (var i = 0; i < canvas.width/2; i += 30 ) {
        var text1 = new paper.PointText(new paper.Point(xCenter+i+5, yCenter+13));
        text1.fillColor = 'black';
        text1.content = ''+(i/30 )+'';	
        gridText.push(text1);
        if(i != 0){
        	var text2 = new paper.PointText(new paper.Point(-i+5+xCenter, yCenter+13));
	        text2.fillColor = 'black';
	        text2.content = ''+((i/30)*-1 )+'';	
	        gridText.push(text2);
        }
    }

    for (var i = 0; i < canvas.height/2; i += 30 ) {
        var text1 = new paper.PointText(new paper.Point(xCenter+5, i+yCenter+13));
        text1.fillColor = 'black';
        text1.content = ''+((i/30)*-1 )+'';	
        gridText.push(text1);
        if(i != 0){
        	var text2 = new paper.PointText(new paper.Point(5+xCenter, yCenter+13-i));
	        text2.fillColor = 'black';
	        text2.content = ''+(i/30 )+'';	
	        gridText.push(text2);
        }
    }


    bugio.bringToFront();
    paper.view.draw();
}

function initVariables() {
    angulo = (Math.PI) / 2;
    cor = "#000000";
    xCenter = (canvas.width - canvas.width % 30) / 2 - ((canvas.width - canvas.width % 30) / 2) % 30;
    yCenter = (canvas.height - canvas.height % 30) / 2 - ((canvas.height - canvas.height % 30) / 2) % 30;
    pontoAtual = new paper.Point(xCenter, yCenter);
    paths = [];
}

function apagarDesenho() {
    path.remove();
    for (var i = 0; i < paths.length; i++) {
        paths[i].remove();
    }
    resetarVariaveis();
    paper.view.draw();
}


var rotationCumulated = 0;

function resetarVariaveis() {
    pontoAtual = new paper.Point(xCenter, yCenter);
    bugio.position = pontoAtual;
    bugio.rotate(-rotationCumulated,bugio.position);
    rotationCumulated = 0;
    path = new paper.Path();
    path.strokeColor = cor;
    path.add(pontoAtual);

    paths = [];

    angulo = (Math.PI) / 2;
    cor = "#000000";
}

function initCanvas() {

    var url = './css/tuca.png';
    bugio = new paper.Raster(url);
    bugio.position = pontoAtual;
    bugio.scale(0.6);
    path = new paper.Path();
    path.strokeColor = "#000000";
    path.add(bugio.position);
    paper.view.draw();
}

function riscarEmLinhaReta(comprimento) {
    var pontoCalculado = new paper.Point(pontoAtual.x + Math.cos(angulo) * comprimento, pontoAtual.y + Math.sin(angulo) * comprimento);
    bugio.position = pontoCalculado;
    path.add(pontoCalculado);
    path.bringToFront();
    pontoAtual = pontoCalculado;
    bugio.bringToFront();
    paper.view.draw();
}

//------------------------------

function parseCode() {
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log("Code \n" + code);
    interpreter = new Interpreter(code, initApi);
    highlightPause = false;
    workspace.traceOn(true);
}

function highlightBlock(id) {
    workspace.highlightBlock(id);
    highlightPause = true;
}

function executarComVelocidade() {

    if (stop) {
        stop = false;
        return;
    }

    if (!parseBool) {
        parseCode();
        parseBool = true;
    }

    function nextStep() {
        if (interpreter.step()) {
            window.setTimeout(nextStep, 50.1 - document.getElementById("slider").value);
        } else {
            highlightPause = false;
            workspace.traceOn(true);
            workspace.highlightBlock(null);
            parseBool = false;
        }
    }

    nextStep();
}

/***
colocar um botão de parse para fazer o parse antes de executar... pode ser isso...
**/
function stepCode() {

    if (!parseBool) {
        parseCode();
        parseBool = true;
    }

    if (interpreter.step()) {
        if (highlightPause) {
            highlightPause = false;
        } else {
            stepCode();
        }
    } else {
        highlightPause = false;
        workspace.traceOn(true);
        workspace.highlightBlock(null);
        parseBool = false;
    }

}
//------------------------------

function initApi(interpreter, scope) {
    // Add an API function for the alert() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the prompt() block.
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for highlighting blocks.
    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for drawing blocks.
    var wrapper = function(comprimento) {
        comprimento = comprimento ? comprimento.toString() : '';
        return interpreter.createPrimitive(riscarEmLinhaReta(comprimento));
    };
    interpreter.setProperty(scope, 'riscarEmLinhaReta',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for drawing blocks.
    var wrapper = function(x, y) {
        x = x ? x.toString() : '';
        y = y ? y.toString() : '';
        return interpreter.createPrimitive(moverBugioPara(x, y));
    };
    interpreter.setProperty(scope, 'moverBugioPara',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for drawing blocks.
    var wrapper = function(anguloNovo) {
        anguloNovo = anguloNovo ? anguloNovo.toString() : '';
        return interpreter.createPrimitive(atualizarAngulo(anguloNovo));
    };
    interpreter.setProperty(scope, 'atualizarAngulo', interpreter.createNativeFunction(wrapper));

    // Add an API function for drawing blocks.
    var wrapper = function(novacor) {
        novacor = novacor ? novacor.toString() : '';
        return interpreter.createPrimitive(atualizarCor(novacor));
    };
    interpreter.setProperty(scope, 'atualizarCor', interpreter.createNativeFunction(wrapper));
}

function atualizarAngulo(novoAngulo) {
	
	var calculo = (novoAngulo/Math.PI)*180;
	rotationCumulated += calculo;
	bugio.rotate(calculo, bugio.position);
    angulo += parseFloat(novoAngulo);
    paper.view.draw();
}

function atualizarCor(novaCor) {
    cor = novaCor;
    paths.push(path);
    path = new paper.Path();
    path.strokeColor = novaCor;
    path.add(pontoAtual);
    bugio.bringToFront();
}

function moverBugioPara(x, y) {

    var valueX = parseInt(x)*30 + parseInt(xCenter);
    var valueY = -1 * parseInt(y)*30 + parseInt(yCenter);

    pontoAtual = new paper.Point(valueX, valueY);
    atualizarCor(cor);

    bugio.position = pontoAtual;
    paper.view.draw();
}

/*
Métodos dos blocos personalizados.
*/
Blockly.JavaScript['riscar'] = function(block) {
    var dropdown_name = block.getFieldValue('risco');
    // TODO: Assemble JavaScript into code variable.
    var code = 'riscarEmLinhaReta(' + dropdown_name + ');\n';
    return code;
};

Blockly.JavaScript['girarantihorario'] = function(block) {
    var angle_giraresquerda = block.getFieldValue('girarEsquerda');
    var code = "atualizarAngulo(" + Math.PI * parseInt(angle_giraresquerda) / 180 + ");\n";
    return code;
};

Blockly.JavaScript['girarhorario'] = function(block) {
    var angle_giraresquerda = block.getFieldValue('girarEsquerda');
    // TODO: Assemble JavaScript into code variable.
    var code = "atualizarAngulo(" + (-1 * (Math.PI * parseInt(angle_giraresquerda) / 180)) + ");\n";
    return code;
};

Blockly.JavaScript['mudarcor'] = function(block) {
    var colour_name = block.getFieldValue('NAME');
    var code = "atualizarCor('" + colour_name + "');\n";
    return code;
};

Blockly.JavaScript['repetir'] = function(block) {
    var value_repeticoes = Blockly.JavaScript.valueToCode(block, 'repeticoes', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code;
    if (isNaN(value_repeticoes)) {
        code = "for(var index" + forCount + " = 0; index" + forCount + " < " + value_repeticoes + "; index" + forCount + "++){\n";
    } else {
        code = "for(var index" + forCount + " = 0; index" + forCount + " < " + parseInt(value_repeticoes) + "; index" + forCount + "++){\n";
    }
    forCount++;
    code += statements_name + "}\n";
    return code;
};

Blockly.JavaScript['mover'] = function(block) {



    var value_x;
    if (isNaN(Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC))) {
        value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    } else {
        value_x = parseInt(Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC));
    }
    var value_y;
    if (isNaN(Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC))) {
        value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
    } else {
        value_y = parseInt(Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC));
    }

    // TODO: Assemble JavaScript into code variable.
    var code = 'moverBugioPara(' + value_x + ',' + value_y + ');\n';

    return code;
};