/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2010 ID-Informatik. (R)WebFrameWork. All rights reserved.
	Rev:1 - 29 septembre 2010.
    ---------------------------------------------------------------------------------------------------------------------------------------
	
	Syntaxe:
		getline n [-i]
	Description:
		Lit la n ieme ligne sur l'entree standard et la reecrit sur la sortie standard
	Arguments:
		n: numero de ligne a extraire
	Drapeaux:
		i: ignore les caracteres d'espacements en debut de ligne
	Input:
		Texte quelconque
	Output:
		Texte contenu a la ligne n
	Remarques:
		getline ne retourne pas le caractere de fin de ligne (LF) et ignore les retours chariots (CR)
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/param.h>

int main(int argc, char *argv[])
{
	int c,i,n,bFindFirst,bEndOfLine,bIgnoreNext;

	if(argc<1+1)
		return -1;

	i=0;
	bFindFirst=1;
	bEndOfLine=0;

	/*arguments*/
	n = atoi(argv[1]);

	while(!feof(stdin))
	{
		bIgnoreNext=0;

		c = fgetc(stdin);
		switch(c){
			case 0x20: /*Space*/
			case 0x9:  /*Tab*/
				break;
			case 0xA: /*LF*/
				bEndOfLine=1;
				break;
			case 0xD: /*CR*/
				bIgnoreNext=1;
				break;
			default:
				bFindFirst=0;
				break;
		}

		if(!bIgnoreNext && !bFindFirst && !bEndOfLine && i==n){
			putchar(c);
			/*printf("putchar %2.2x\n",c);*/
		}

		if(bEndOfLine){
			bFindFirst=1;
			bEndOfLine=0;
			i++;
			if(i>n){
				/*printf("end of line\n");*/
				return 0;
			}
		}
	}
	printf("no found\n");
	return 1;/*not found*/
}
