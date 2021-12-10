"""
Copyright under MIT license
Author: Quix, Josiah
Imperial College London
"""
import getopt
import os

import execjs

copyright = """
===============================
Copyright under MIT license
Author: Quix, Josiah
Imperial College London
==============================="""


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

    def process_file(self, src_path="./src/source_code.txt", out_path="./out/output.txt", mode="byte"):
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
        if mode == "hex":
            f = open(out_path, "w", encoding="utf-8")
            for ins in ins_list:
                f.write(ins + "\n")
            f.close()
        elif mode == "byte":
            ram = open(out_path, "w", encoding="utf-8")
            for ins in ins_list:
                if "[Error]" in ins:
                    for i in range(4):
                        ram.write("[Error]" + "\n")
                else:
                    bytes = self.hex_to_bytes(ins)
                    for byte in bytes:
                        ram.write(byte + "\n")
            ram.close()


if __name__ == '__main__':
    import sys

    print(copyright)
    endian = True
    mode = "byte"
    argv = sys.argv[1:]
    inputfile = "./src/source_code.txt"
    outputfile = "./out/output.txt"
    try:
        opts, args = getopt.getopt(argv, "hi:o:m:e", ["ifile=", "ofile="])
    except getopt.GetoptError:
        print('mips_to_hex.py -i <inputfile> -o <outputfile> -m <mode> -e <endian>')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print('mips_to_hex.py -i <inputfile> -o <outputfile> -m <mode> -e <endian>')
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg
            if not os.path.exists(inputfile):
                print("Error! input file doesnt exist!")
                sys.exit(3)
        elif opt in ("-o", "--ofile"):
            outputfile = arg
            outputdir = "/".join(outputfile.split("/")[:-1])
            if not os.path.exists(outputdir):
                print("Error! output file doesnt exist!")
                sys.exit(4)
        elif opt in ("-m", "--mode"):
            mode = arg
            if not mode in ["byte", "hex"]:
                mode = "byte"
                print("Unknown mode! Convert mode to byte instead")
        elif opt in ("-e", "--endian"):
            endian = str(arg).lower() == "true"
            print("Endian reverse is " + str(endian))
    print("===============================\nStart converting...")
    try:
        endian_reverse = True
        assembler = MIPS_Assembler(endian)
        assembler.process_file(src_path=inputfile, out_path=outputfile, mode=mode)
    except:
        print("Undefined error happened!\nI give up!")
