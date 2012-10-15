#ifndef _WFW_ICMD_H
#define _WFW_ICMD_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/param.h>

typedef struct{
	const char* name;
	int (*func)(char** args,int argc,int flags);
}CMD;

#define RMODE_SEARCH      0x0
#define RMODE_END_OF_WORD 0x1
#define RMODE_END_OF_CMD  0x2
#define RMODE_WORD        0x4

#define MAX_WORD 16
#define WORD_SIZE (256*16)

#define BIT_FROM_CHAR(c) ((c>='a'&&c<='z')?c-'a':c-'A')
#define CHAR_FROM_BIT(b) ('a'+(int)b)
#define BIT_FLAG(flags,c) ((flags>>BIT_FROM_CHAR(c)) & 0x1)

typedef struct{
// requis par check_cmd() ...
	const char* cmd_line;//pointeur sur la ligne de commande a lire
	size_t cmd_line_size;//si zero, initialise automatiquement
	const CMD* funcs; //table des fonctions
	int func_cnt; //longeur de 'funcs'
// initialise par check_cmd() ...
	size_t i; //position de lecture dans 'cmd_line'
	int flags; // drapeaux
	unsigned char word_cnt; // nombre de mot initialise dans 'pword'
//	int read_c; //obselete
//	int read_mode; //obselete
	int find_func_cnt; //numero de la commande trouver dans 'cmd', -1 si introuvable
	char word[WORD_SIZE]; //chaine des mots
	char* pword[MAX_WORD]; //pointeurs sur les mots contenus dans 'word'
}CMD_STRUCT;

int check_cmd(CMD_STRUCT* pcmd);
int find_cmd(const CMD_STRUCT* cmd,const char* pCmdName);
//int read_cmd(const CMD* pcmd_func,int cmd_count);

#endif /* _WFW_ICMD_H */
