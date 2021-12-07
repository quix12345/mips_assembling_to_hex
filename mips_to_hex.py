"""
Copyright under MIT license
Author: Quix, Josiah
Imperial College London
"""

import execjs

js = open("js/instToHex.js", 'r', encoding='UTF-8')
converter = execjs.compile(js.read())


def format_code(code):
    code_splits = code.split(",")
    output = ""
    for i, code_split in enumerate(code_splits):
        if i == 0:
            output = code_split.strip()
            continue
        output += ", " + code_split.strip()
    return output


def convert_code_to_hex(code):
    result = converter.call('instToHex', format_code(code))
    try:
        if result["status"]:
            return result["hex"]
        else:
            return "[Error]" + result["errMsg"]
    except:
        return "[Error]" + result["errMsg"]


def hex_to_bytes(hex):
    if len(hex) == 8:
        list = []
        list.append(hex[6:])
        list.append(hex[4:6])
        list.append(hex[2:4])
        list.append(hex[:2])
        return list
    return hex


ins_list = []
f = open("src/source_code.txt", "r", encoding='utf-8')
lines = f.readlines()
for line in lines:
    line = line.replace("\n", "")
    if line.strip() == "":
        continue
    if line.strip()[:2] == "//":
        continue
    if not line:
        continue
    line = line.split("//")[0]
    if "($" not in line:
        line = line.split("(")[0]
    code_in_hex = convert_code_to_hex(line.strip())
    print("%s (%s)", line, code_in_hex)
    ins_list.append(code_in_hex)
f.close()
# print(ins_list)
f = open("./out/output.txt", "w", encoding="utf-8")
ram = open("./out/ram.txt", "w", encoding="utf-8")
for ins in ins_list:
    f.write(ins + "\n")
    if "[Error]" in ins:
        for i in range(4):
            ram.write("[Error]" + "\n")
    else:
        bytes = hex_to_bytes(ins)
        for byte in bytes:
            ram.write(byte + "\n")
f.close()
ram.close()
