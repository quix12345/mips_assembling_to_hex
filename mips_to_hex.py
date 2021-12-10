"""
Copyright under MIT license
Author: Quix, Josiah
Imperial College London
"""

import execjs


class MIPS_Assembler(object):
    def __init__(self, endian_reverse):
        js = open("./utils/js/instToHex.js", 'r', encoding='UTF-8')
        self.converter = execjs.compile(js.read())
        self.endian_reverse = endian_reverse

    @staticmethod
    def format_code(code):
        code_splits = code.split(",")
        output = ""
        for i, code_split in enumerate(code_splits):
            if i == 0:
                output = code_split.strip()
                continue
            output += ", " + code_split.strip()
        return output

    def convert_code_to_hex(self, code):
        try:
            result = self.converter.call('instToHex', self.format_code(code))
            if result["status"]:
                return result["hex"]
            else:
                return "[Error]" + result["errMsg"]
        except:
            return "[Error]" + "js error!"

    def hex_to_bytes(cls, hex):
        if len(hex) == 8:
            list = []
            list.append(hex[6:])
            list.append(hex[4:6])
            list.append(hex[2:4])
            list.append(hex[:2])
            if cls.endian_reverse:
                list.reverse()
            return list
        return hex

    def assembling_codes_to_hex(self, lines):
        ins_list = []
        ram_list = []
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
            code_in_hex = self.convert_code_to_hex(line.strip())
            print("%s (%s)" % (line, code_in_hex))
            ins_list.append(code_in_hex)
            if "[Error]" in code_in_hex:
                for i in range(4):
                    ram_list.append("FF")
            else:
                bytes = self.hex_to_bytes(code_in_hex)
                for byte in bytes:
                    ram_list.append(byte)
        return ins_list, ram_list

    def process_file(self, src_path="./src/source_code.txt", mode="both"):
        ins_list = []
        f = open(src_path, "r", encoding='utf-8')
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
            code_in_hex = self.convert_code_to_hex(line.strip())
            print("%s (%s)" % (line, code_in_hex))
            ins_list.append(code_in_hex)
        f.close()
        if mode == "both":
            f = open("./out/output.txt", "w", encoding="utf-8")
            ram = open("./out/ram.txt", "w", encoding="utf-8")
            for ins in ins_list:
                f.write(ins + "\n")
                if "[Error]" in ins:
                    for i in range(4):
                        ram.write("[Error]" + "\n")
                else:
                    bytes = self.hex_to_bytes(ins)
                    for byte in bytes:
                        ram.write(byte + "\n")
            f.close()
            ram.close()


endian_reverse = True
assembler = MIPS_Assembler(endian_reverse)
assembler.process_file()
