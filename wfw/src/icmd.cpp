#include "icmd.h"

int check_cmd(CMD_STRUCT* pcmd)
{
	int c; //caractere lut
	int read_mode; //mode de lecture
	char* pwrite; // pointeur sur le prochain caractere du mot
	char* pwrite_end; // pointeur sur la fin de chaine du mot
	int u_flag_bit;

	//verifie la taille
	if(pcmd->cmd_line == 0)
		return -1;
	if(!pcmd->cmd_line_size && !(pcmd->cmd_line_size=strlen(pcmd->cmd_line)))
		return -1;

	//intialise les arguments
	read_mode = RMODE_SEARCH;
	pcmd->i=0;
	pcmd->word_cnt = 0;
	pcmd->find_func_cnt = -1;
	pwrite = pcmd->pword[0] = pcmd->word;
	pwrite_end = pwrite + sizeof(pcmd->word);

	//lit les caracteres
	while(pcmd->i < pcmd->cmd_line_size)
	{
		c = pcmd->cmd_line[pcmd->i];
		
		switch(c){
			/* fin de fichier
			case EOF: 
				read_mode = EOF | RMODE_END_OF_CMD | RMODE_END_OF_WORD;
				break;*/
			 /* fin de commande */
			/*case '$': LF*/
			case 0xA: /*LF*/
			case 0xD: /*CR*/
			case 0x0: /*ZERO*/
				read_mode = RMODE_END_OF_CMD | RMODE_END_OF_WORD;
				break;
			 /* fin de mot */
			case 0x20: /*Space*/
			case 0x9: /*Tab*/
				read_mode = RMODE_END_OF_WORD;
				break;
			 /* lecture */
			default:
				read_mode = RMODE_WORD;
				break;
		}
		
		/* fin de commande */
		if(pcmd->i == pcmd->cmd_line_size-1){
			read_mode |= RMODE_END_OF_CMD | RMODE_END_OF_WORD;
		}

		//fin de chaine premature!
		if(read_mode == EOF){
			/*printf("end of file\n");*/
			return 0;
		}
		
		//lit le mot
		if(read_mode & RMODE_WORD){
			*pwrite++ = c;
			if(pwrite>=pwrite_end){
				printf("error: command word size overflow\n");
				return 1;
			}
		}
		
		//fin de mot, si au moins un caractere dans celui ci
		if((read_mode & RMODE_END_OF_WORD) && (pwrite!=pcmd->pword[pcmd->word_cnt])){
			*pwrite++ = 0; /* termine la chaine*/
			
			/*clear all flag? '--'*/
			if((pcmd->pword[pcmd->word_cnt][0]=='-') && (pcmd->pword[pcmd->word_cnt][1]=='-') && (pcmd->pword[pcmd->word_cnt][2]==0)){
//				printf("all flags cleared\n");
				pcmd->flags=0;

				pwrite = pcmd->pword[pcmd->word_cnt]; /* retourne au debut du mot*/
			}
			/*push flag? '-?'*/
			else if((pcmd->pword[pcmd->word_cnt][0]=='-') && (pcmd->pword[pcmd->word_cnt][1]!=0) && (pcmd->pword[pcmd->word_cnt][2]==0)){
				u_flag_bit = (int)pcmd->pword[pcmd->word_cnt][1];

				if(u_flag_bit>='a' && u_flag_bit<='z')
					u_flag_bit = u_flag_bit-(int)'a';
				if(u_flag_bit>='A' && u_flag_bit<='Z')
					u_flag_bit = u_flag_bit-(int)'A';

				if(u_flag_bit>=0 || u_flag_bit<=26){/*ok*/
					pcmd->flags |= (1<<u_flag_bit);
//					printf("read flag: %d:0x%1.8X [0x%1.8X]\n",u_flag_bit,(int)(1<<u_flag_bit),pcmd->flags);
				}
//				else{
//					printf("warning: invalid flag: %c (use 'a' to 'z' character)\n",pcmd->pword[pcmd->word_cnt][1]);
//				}

				pwrite = pcmd->pword[pcmd->word_cnt]; /* retourne au debut du mot*/
			}
			/*argument string*/
			else{
				/*ok pour ce pointeur, passe au prochain*/
				pcmd->word_cnt++;
				//depassement?
				if(pcmd->word_cnt>=MAX_WORD){
					printf("error: command words count overflow\n");
					return 1;
				}
				/*initialise le prochain pointeur sur le debut du prochain mot*/
				pcmd->pword[pcmd->word_cnt] = pwrite;

//				printf("read word: %s [%d]\n",pcmd->pword[pcmd->word_cnt-1],strlen(pcmd->pword[pcmd->word_cnt-1]));
			}

			read_mode ^= RMODE_END_OF_WORD; // fin du mode RMODE_END_OF_WORD
		}

		/*fin de commande*/
		if(read_mode & RMODE_END_OF_CMD){
			/*recherche la commande*/
			if(pcmd->word_cnt){
				pcmd->find_func_cnt = find_cmd(pcmd,pcmd->pword[0]);
			}
/*			else
				printf("no command! type 'exit' to quit\n");
*/
			return 0;
		}

		pcmd->i++;
	}
	return 0;
}
/*
int read_cmd(const CMD* pcmd_func,int cmd_count)
{
	CMD_STRUCT cmd;
	int cmd_cnt;
	int u_flag_bit;
	int ret;
	char* pwrite;
	char* pwrite_end;

	memset(&cmd,0,sizeof(cmd));
	cmd.cmd = pcmd_func;
	cmd.cmd_cnt = cmd_count;
	cmd.pword[0] = cmd.word;
	pwrite = cmd.pword[0];
	pwrite_end = pwrite + sizeof(cmd.word);

	while(cmd.read_mode!=EOF){

		cmd.read_c = fgetc(stdin);

		switch(cmd.read_c){
			// fin de fichier
			case EOF: 
				cmd.read_mode = EOF | RMODE_END_OF_CMD | RMODE_END_OF_WORD;
				break;
			 // fin de commande
			case 0xA: //LF
			case 0xD: //CR
				cmd.read_mode = RMODE_END_OF_CMD | RMODE_END_OF_WORD;
				break;
			 // fin de mot
			case 0x20: //Space
			case 0x9: //Tab
				cmd.read_mode = RMODE_END_OF_WORD;
				break;
			 // lecture 
			default:
				cmd.read_mode = RMODE_WORD;
				break;
		}
		
		if(cmd.read_mode == EOF){
			//printf("end of file\n");
			return 0;
		}
		
		if(cmd.read_mode & RMODE_WORD){
			*pwrite++ = cmd.read_c;
			if(pwrite>=pwrite_end){
				printf("error: command word size overflow\n");
				return 1;
			}
		}

		if((cmd.read_mode & RMODE_END_OF_WORD) && (pwrite!=cmd.pword[cmd.word_cnt])){
			*pwrite++ = 0; // termine la chaine
			
			//clear all flag? (--)
			if((pwrite[0]=='-') && (pwrite[1]=='-') && (pwrite[2]==0)){
				printf("all flags cleared\n");
				cmd.flags=0;

				pwrite = cmd.pword[cmd.word_cnt]; // retourne au debut du mot
			}
			//push flag? (-?)
			else if((pwrite[0]=='-') && (pwrite[1]!=0) && (pwrite[2]==0)){
				u_flag_bit = (int)pwrite[1];

				if(u_flag_bit>='a' && u_flag_bit<='z')
					u_flag_bit = u_flag_bit-(int)'a';
				if(u_flag_bit>='A' && u_flag_bit<='Z')
					u_flag_bit = u_flag_bit-(int)'A';

				if(u_flag_bit>=0 || u_flag_bit<=26){//ok
					cmd.flags |= (1<<u_flag_bit);
//					printf("read flag: %d:0x%1.8X [0x%1.8X]\n",u_flag_bit,(int)(1<<u_flag_bit),cmd.flags);
				}
				else{
					printf("warning: invalid flag: %c (use 'a' to 'z' character)\n",pwrite[1]);
				}

				pwrite = cmd.pword[cmd.word_cnt]; // retourne au debut du mot
			}
			//argument string
			else{
//				printf("read word: %s [%d]\n",cmd.word[cmd.word_cnt],strlen(cmd.word[cmd.word_cnt]));
				//enregistre l'argument
				cmd.pword[++cmd.word_cnt] = pwrite; // debut prochain mot
				if(cmd.word_cnt>=MAX_WORD){
					printf("error: command words count overflow\n");
					return 1;
				}
			}
			cmd.read_mode ^= RMODE_END_OF_WORD;
		}
		
		//execute la commande
		if(cmd.read_mode & RMODE_END_OF_CMD){
			//execute la commande
			if(cmd.word_cnt){
				if((cmd_cnt = find_cmd(&cmd,cmd.pword[0])) != -1 ){
//					printf("find command '%s' in index %d\n",cmd.word[0],cmd_cnt);
					ret=cmd.cmd[cmd_cnt].func(cmd.pword,cmd.word_cnt,cmd.flags);
					if(ret!=0)
						printf("warning: command return error code '%d'\n",ret);
				}
				else{
					printf("warning: unknown command '%s'\n",cmd.pword[0]);
				}
			}
//			else
//				printf("no command! type 'exit' to quit\n");

			//printf("end of command\n");
			cmd.word_cnt=0;
			cmd.pword[0] = cmd.word;
			pwrite = cmd.pword[0];
			cmd.read_mode=RMODE_SEARCH;
		}

		
	}

	return 0;
}*/

int find_cmd(const CMD_STRUCT* cmd,const char* pCmdName)
{
	int i=0;
	while(i<cmd->func_cnt){
		if(strcmp(cmd->funcs[i].name,pCmdName)==0)
			return i;
		i++;
	}
	return -1;
}
