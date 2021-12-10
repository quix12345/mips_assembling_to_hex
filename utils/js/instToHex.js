function isDec(dec) {
    return !isNaN(dec) && dec.indexOf(".") === -1
}

function covert_to_valid_hex_string(target) {
    if (target === "-1") {
        return "FFFF"
    } else if (target.includes("0X")) {
        return [true, target.replace("0X", "")];
    } else if (target.includes("0x")) {
        return [true, target.replace("0x", "")];
    } else if (isDec(target)) {
        return [true, target.toString(16)];
    } else {
        return [false]
    }
}

function instToHex(input_instruction) {
    //
    // CLEAR OUTPUT REGION
    //
    var rFormat = "op rs rt rd sa funct";
    var iFormat = "op rs rt imm";
    var jFormat = "op target";

    var registerTableName = {
        '00000': '$zero', '00001': '$at', '00010': '$v0', '00011': '$v1', '00100': '$a0',
        '00101': '$a1', '00110': '$a2', '00111': '$a3', '01000': '$t0', '01001': '$t1',
        '01010': '$t2', '01011': '$t3', '01100': '$t4', '01101': '$t5', '01110': '$t6',
        '01111': '$t7', '10000': '$s0', '10001': '$s1', '10010': '$s2', '10011': '$s3',
        '10100': '$s4', '10101': '$s5', '10110': '$s6', '10111': '$s7', '11000': '$t8',
        '11001': '$t9', '11010': '$k0', '11011': '$k1', '11100': '$gp', '11101': '$sp',
        '11110': '$fp', '11111': '$ra'
    };

    var registerTableNum = {
        '00000': '$0', '00001': '$1', '00010': '$2', '00011': '$3', '00100': '$4',
        '00101': '$5', '00110': '$6', '00111': '$7', '01000': '$8', '01001': '$9',
        '01010': '$10', '01011': '$11', '01100': '$12', '01101': '$13', '01110': '$14',
        '01111': '$15', '10000': '$16', '10001': '$17', '10010': '$18', '10011': '$19',
        '10100': '$20', '10101': '$21', '10110': '$22', '10111': '$23', '11000': '$24',
        '11001': '$25', '11010': '$26', '11011': '$27', '11100': '$28', '11101': '$29',
        '11110': '$30', '11111': '$31'
    };

    var hexTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101',
        '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
        'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111', 'A': '1010', 'B': '1011',
        'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
    };


    var registerToBinary = {
        '$zero': '00000',
        '$at': '00001',
        '$v0': '00010',
        '$v1': '00011',
        '$a0': '00100',
        '$a1': '00101',
        '$a2': '00110',
        '$a3': '00111',
        '$t0': '01000',
        '$t1': '01001',
        '$t2': '01010',
        '$t3': '01011',
        '$t4': '01100',
        '$t5': '01101',
        '$t6': '01110',
        '$t7': '01111',
        '$s0': '10000',
        '$s1': '10001',
        '$s2': '10010',
        '$s3': '10011',
        '$s4': '10100',
        '$s5': '10101',
        '$s6': '10110',
        '$s7': '10111',
        '$t8': '11000',
        '$t9': '11001',
        '$k0': '11010',
        '$k1': '11011',
        '$gp': '11100',
        '$sp': '11101',
        '$fp': '11110',
        '$ra': '11111',
        '$0': '00000',
        '$1': '00001',
        '$2': '00010',
        '$3': '00011',
        '$4': '00100',
        '$5': '00101',
        '$6': '00110',
        '$7': '00111',
        '$8': '01000',
        '$9': '01001',
        '$10': '01010',
        '$11': '01011',
        '$12': '01100',
        '$13': '01101',
        '$14': '01110',
        '$15': '01111',
        '$16': '10000',
        '$17': '10001',
        '$18': '10010',
        '$19': '10011',
        '$20': '10100',
        '$21': '10101',
        '$22': '10110',
        '$23': '10111',
        '$24': '11000',
        '$25': '11001',
        '$26': '11010',
        '$27': '11011',
        '$28': '11100',
        '$29': '11101',
        '$30': '11110',
        '$31': '11111',
        'zero': '00000',
        'at': '00001',
        'v0': '00010',
        'v1': '00011',
        'a0': '00100',
        'a1': '00101',
        'a2': '00110',
        'a3': '00111',
        't0': '01000',
        't1': '01001',
        't2': '01010',
        't3': '01011',
        't4': '01100',
        't5': '01101',
        't6': '01110',
        't7': '01111',
        's0': '10000',
        's1': '10001',
        's2': '10010',
        's3': '10011',
        's4': '10100',
        's5': '10101',
        's6': '10110',
        's7': '10111',
        't8': '11000',
        't9': '11001',
        'k0': '11010',
        'k1': '11011',
        'gp': '11100',
        'sp': '11101',
        'fp': '11110',
        'ra': '11111'
    };

    var opcodeTable = {
        '000000': 'SPECIAL', '000001': 'REGIMM', '000010': 'J', '000011': 'JAL', '000100': 'BEQ',
        '000101': 'BNE', '000110': 'BLEZ', '000111': 'BGTZ', '001000': 'ADDI', '001001': 'ADDIU',
        '001010': 'SLTI', '001011': 'SLTIU', '001100': 'ANDI', '001101': 'ORI', '001110': 'XORI',
        '001111': 'LUI', '100000': 'LB', '100001': 'LH', '100010': 'LWL', '100011': 'LW',
        '100100': 'LBU', '100101': 'LHU', '101000': 'SB', '101001': 'SH', '101011': 'SW',
    }

    var functTable = {
        '000000': 'SLL', '000010': 'SRL', '000011': 'SRA', '000100': 'SLLV', '000110': 'SRLV',
        '000111': 'SRAV', '001000': 'JR', '001001': 'JALR', '001100': 'SYSCALL', '001101': 'BREAK',
        '010000': 'MFHI', '010001': 'MTHI', '010010': 'MFLO', '010011': 'MTLO', '011000': 'MULT',
        '011001': 'MULTU', '011010': 'DIV', '011011': 'DIVU', '100000': 'ADD',
        '100001': 'ADDU', '100010': 'SUB', '100011': 'SUBU', '100100': 'AND', '100101': 'OR',
        '100110': 'XOR', '100111': 'NOR', '101010': 'SLT', '101011': 'SLTU'
    };

    const branchFuncTable = {
        '00000': "BLTZ", "10000": "BLTZAL", "10001": "BGEZAL", "00001": "BGEZ"
    }

    var formatTable = {
        // ALU
        'ADD': "op rd rs rt",
        'ADDI': "op rt rs imm",
        'ADDIU': "op rt rs imm",
        'ADDU': "op rd rs rt",
        'AND': "op rd rs rt",
        'ANDI': "op rt rs imm",
        'LUI': "op rt imm",
        'NOR': "op rd rs rt",
        'OR': "op rd rs rt",
        'ORI': "op rt rs imm",
        'SLT': "op rd rs rt",
        'SLTI': "op rt rs imm",
        'SLTIU': "op rt rs imm",
        'SLTU': "op rd rs rt",
        'SUB': "op rd rs rt",
        'SUBU': "op rd rs rt",
        'XOR': "op rd rs rt",
        'XORI': "op rt rs imm",
        // SHIFTER
        'SLL': "op rd rt sa",
        'SLLV': "op rd rt rs",
        'SRA': "op rd rt sa",
        'SRAV': "op rd rt rs",
        'SRL': "op rd rt sa",
        'SRLV': "op rd rt rs",
        // MULTIPLY
        'DIV': "op rs rt",
        'DIVU': "op rs rt",
        'MFHI': "op rd",
        'MFLO': "op rd",
        'MTHI': "op rs",
        'MTLO': "op rs",
        'MULT': "op rs rt",
        'MULTU': "op rs rt",
        // BRANCH
        'BEQ': "op rs rt offset",
        'BGEZ': "op rs offset",
        'BGEZAL': "op rs offset",
        'BGTZ': "op rs offset",
        'BLEZ': "op rs offset",
        'BLTZ': "op rs offset",
        'BLTZAL': "op rs offset",
        'BNE': "op rs rt offset",
        'BREAK': "op",
        'J': "op target",
        'JAL': "op target",
        'JALR': "op rs",
        'JR': "op rs",
        'MFC0': "op rt rd",
        'MTC0': "op rt rd",
        'SYSCALL': "op",
        // MEMORY
        'LB': "op rt offset(rs)",
        'LBU': "op rt offset(rs)",
        'LH': "op rt offset(rs)",
        'LHU': "op rt offset(rs)",
        'LW': "op rt offset(rs)",
        'SB': "op rt offset(rs)",
        'SH': "op rt offset(rs)",
        'SW': "op rt offset(rs)",
    }
    //
    // INPUT PARSING
    //
    var inputString = input_instruction
    var parsedString = inputString.toLowerCase();

    parsedString = parsedString.replace(/,/g, '');
    parsedString = parsedString.replace(/\(/g, ' ');
    parsedString = parsedString.replace(/\)/g, ' ');
    parsedString = parsedString.replace(/\s/g, ' ');
    parsedString = parsedString.trim();

    var inputFields = parsedString.split(' ');

    var instructionName = parsedString.split(' ')[0].toUpperCase();
    var opcode = "000000", funct = "000000";

    //
    // Find opcode
    //
    var found = false;
    for (var property in opcodeTable) {
        if (opcodeTable.hasOwnProperty(property)) {
            if (opcodeTable[property] == instructionName) {
                opcode = property;
                found = true;
            }
        }
    }

    //
    // Find funct if opcode is SPECIAL
    //
    if (opcode == "000000") {
        for (var fun in functTable) {
            if (functTable.hasOwnProperty(fun)) {
                if (functTable[fun] == instructionName) {
                    funct = fun;
                    opcode = "000000"
                    found = true;
                }
            }
        }
        for (var fun in branchFuncTable) {
            if (branchFuncTable.hasOwnProperty(fun)) {
                if (branchFuncTable[fun] == instructionName) {
                    funct = fun;
                    opcode = "000001"
                    found = true;
                }
            }
        }
    }

    // If opcode/funct is invalid, exit and report error
    if (!found) {
        return {"status": false, "errMsg": "opcode not found"};
    }


    //
    // Determine instruction type
    //
    var format = "";
    // R type instruction
    if (opcode == "000000") {
        format = rFormat;
    }
    // J type instruction
    else if (opcode == "000010" || opcode == "000011") {
        format = jFormat;
    }
    // I type instruction
    else {
        format = iFormat;
    }

    var instFormat = formatTable[instructionName];
    var instFields = instFormat;


    instFields = instFields.replace(/\(/, " ");
    instFields = instFields.replace(/\)/, " ");
    instFields = instFields.split(" ");

    var rs = "$0", rd = "$0", rt = "$0", shamt = "00000", imm = "0000000000000000",
        target = "00000000000000000000000000";
    var rs_c = "00000", rd_c = "00000", rt_c = "00000", shamt_c = "00000", imm_c = "", target_c = "";
    var i;
    for (i = 0; i < instFields.length; i++) {
        if (instFields[i] == "rd") {
            rd = inputFields[i];
        } else if (instFields[i] == "rs") {
            rs = inputFields[i];
        } else if (instFields[i] == "rt") {
            rt = inputFields[i];
        } else if (instFields[i] == "offset") {
            imm = inputFields[i];
            if(instructionName[0]==="B"){
                var imm_dec
                if(imm.substring(0,2)==="0x"||imm.substring(0,2)==="0X"){
                    imm_dec = parseInt(imm)
                }
                else{
                    imm_dec = parseInt("0x" + imm)
                }
                if (imm_dec % 4 !== 0) {
                    return {"status": false, "errMsg": "Error, check that target is not a multiple of 4"};
                } else {
                    imm = (imm_dec / 4).toFixed()
                    imm = imm.toString(16)
                }
            }

        } else if (instFields[i] == "imm") {
            imm = inputFields[i];
        } else if (instFields[i] == "sa") {
            shamt = inputFields[i];
        } else if (instFields[i] == "target") {
            target = inputFields[i];
        }
    }

    if (registerToBinary.hasOwnProperty(rd.toString())) {
        rd_c = registerToBinary[rd.toString()];
    } else {
        return {"status": false, "errMsg": "Invalid register"};
    }
    if (registerToBinary.hasOwnProperty(rt.toString())) {
        rt_c = registerToBinary[rt.toString()];
    } else {
        return {"status": false, "errMsg": "Invalid register"};
    }
    if (registerToBinary.hasOwnProperty(rs.toString())) {
        rs_c = registerToBinary[rs.toString()];
    } else {
        return {"status": false, "errMsg": "Invalid register"};
    }

    shamt_c = parseInt(shamt, 16).toString(2);

    if (shamt_c.length > 5) {
        return {"status": false, "errMsg": "Invalid shift"};
    }

    while (shamt_c.length < 5) {
        shamt_c = "0" + shamt_c;
    }

    if (format === iFormat) {
        imm = imm.toUpperCase();
        var imm_result = covert_to_valid_hex_string(imm)
        if (imm_result[0]) {
            imm = imm_result[1]
        } else {
            return {"status": false, "errMsg": "Error, check that immediate is valid hex"};
        }
        var k, immTemp = "";
        for (k = 0; k < imm.length; k += 1) {
            if (hexTable.hasOwnProperty(imm[k]) === false) {
                immTemp = false;
                break;
            } else {
                immTemp = immTemp + hexTable[imm[k]];
            }
        }
        if (immTemp === false) {
            return {"status": false, "errMsg": "Error, check that immediate is valid hex"};
        } else {
            imm_c = immTemp;
        }
        while (imm_c.length < 16) {
            imm_c = "0" + imm_c;
        }
    }

    if (format === jFormat) {
        target = target.toUpperCase();
        var target_result = covert_to_valid_hex_string(target)
        if (target_result[0]) {
            target = target_result[1]
        } else {
            return {"status": false, "errMsg": "Error, check that target is valid hex"};
        }
        var target_dec = parseInt("0x" + target)
        if (target_dec % 4 !== 0) {
            return {"status": false, "errMsg": "Error, check that target is not a multiple of 4"};
        } else {
            target = (target_dec / 4).toFixed()
            target = target.toString(16)
        }
        var o, targetTemp = "";
        for (o = 0; o < target.length; o += 1) {
            if (hexTable.hasOwnProperty(target[o]) === false) {
                targetTemp = "invalid";
                break;
            } else {
                targetTemp = targetTemp + hexTable[target[o]];
            }
        }
        if (targetTemp === "invalid") {
            return {"status": false, "errMsg": "Error, check that target is valid hex"};
        } else {
            target_c = targetTemp;
        }
        while (target_c.length < 26) {
            target_c = "0" + target_c;
        }
        target_c = target_c.substring(target_c.length - 26);
    }


    var binaryOut = "";
    binaryOut = format;
    binaryOut = binaryOut.replace("op", opcode);
    binaryOut = binaryOut.replace("rd", rd_c);
    binaryOut = binaryOut.replace("rs", rs_c);
    binaryOut = binaryOut.replace("rt", rt_c);
    binaryOut = binaryOut.replace("sa", shamt_c);
    binaryOut = binaryOut.replace("imm", imm_c);
    binaryOut = binaryOut.replace("offset", imm_c);
    binaryOut = binaryOut.replace("funct", funct);
    binaryOut = binaryOut.replace("target", target_c);
    binaryOut = binaryOut.replace(/\s/g, "");

    //
    // Make sure output hex is 8 digits
    //
    var hexOut = "";
    hexOut = parseInt(binaryOut, 2).toString(16).toUpperCase();
    while (hexOut.length < 8) {
        hexOut = "0" + hexOut;
    }

    //
    // OUTPUT RESULTS TO PAGE
    //

    return {"status": true, "hex": hexOut, "bin": binaryOut}
}
