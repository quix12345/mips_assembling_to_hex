# MIP32 Assembler

### Environment
1. install python3 and nodejs, add them to system PATH(/bin)
2. For python, run "pip install pyexecjs" before execute

### For Use
##### Direct use
1.run mips_to_hex.py, it will assembling the code in "src/source_code.txt" to "out" by default
##### By command line
2.run python mips_to_hex.py -i \<inputfile> -o \<outputfile> -m \<mode> -e \<endian>
* -i: input file name
* -o: output file name
* -m: output mode(hex or byte, default by byte)
* -e: whether reverse the endian system(default by true)

### Example code for test
- addiu $v0, $zero, 0x34
- addiu $v0, $v0, 0x02
- jr $zero

### Tutorial on MIP32 assembling
1. Support most of the MIP32 ISA
2. Lower case or Upper case doesn't matter (lw=LW,ADDIU=addiu)
3. Comment by "// comment" or "(comment)"
4. immediate values should be writing in hex(e.g. 0xFFFF) but it can be in dec as well
5. space after a comma was appreciated, but the assembler will format it automatically
6. see http://mipsconverter.com/opcodes.html for MIPS assembling tutorial

##### Old Tutorial (obselete)
1. Put the source assebling code in source_code.txt
2. Run mips_to_hex.py
3. Get result in ram.txt and output.txt

