Blockly.Blocks['riscar'] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour("#e67e22");
    this.appendDummyInput()
        .appendField("Voar ")
        .appendField(new Blockly.FieldDropdown([["1", "30"], ["2", "60"], ["3", "90"], ["4", "120"], ["5", "150"]]), "risco")
        .appendField("unidades de distância");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['girarantihorario'] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour("#c0392b");
    this.appendDummyInput()
        .appendField("Virar no sentido horário")
        .appendField(new Blockly.FieldAngle("90"), "girarEsquerda");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['girarhorario'] = {
  init: function() {
    //this.setHelpUrl('http://www.example.com/');
    this.setColour("#c0392b");
    this.appendDummyInput()
        .appendField("Virar no sentido anti-horário")
        .appendField(new Blockly.FieldAngle("90"), "girarEsquerda");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['mudarcor'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour("#e67e22");
    this.appendDummyInput()
        .appendField("Deixar rastro na cor")
        .appendField(new Blockly.FieldColour("#3366ff"), "NAME");
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['repetir'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour("#16a085");
    this.appendValueInput("repeticoes")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Repita");
    this.appendDummyInput()
        .appendField("vezes");
    this.appendStatementInput("NAME")
        .setCheck("null")
        .appendField("Passos");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['mover'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour("#c0392b");
    this.appendDummyInput()
        .appendField("Mover o Tuca para X:");
    this.appendValueInput("x")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("Y:");
    this.appendValueInput("y")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};