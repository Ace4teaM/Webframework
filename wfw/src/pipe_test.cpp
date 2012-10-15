#include "icmd.h"

int cmd_exit(char** args,int argc,int flags);
int cmd_hello(char** args,int argc,int flags);

CMD cmd_func[]={
	{"exit",cmd_exit},
	{"quit",cmd_exit},
	{"bye",cmd_exit},
	{"hello",cmd_hello},
	{"hi",cmd_hello},
};

int main(void)
{
	CMD_STRUCT cmd;
	char *pbuf,buf[2048];
	int c;

	//init
	memset(&cmd,0,sizeof(cmd));
	cmd.cmd_line = buf;
	cmd.funcs = cmd_func;
	cmd.func_cnt = sizeof(cmd_func)/sizeof(CMD);
	pbuf=buf;

	printf("welcome interactive command line\n");
	
	while((c = fgetc(stdin))!=EOF)
	{
		*pbuf++ = c;
		if(0xA == c){
			*pbuf = 0;
			if((check_cmd(&cmd)==0) && (cmd.find_func_cnt!=-1)){
				cmd.funcs[cmd.find_func_cnt].func(cmd.pword,cmd.word_cnt,cmd.flags);
			}
			else if(cmd.word_cnt)
				printf("warning: unknown command '%s'\n",cmd.pword[0]);
			else
				printf("warning: no command read\n");

			//re-init
			memset(&cmd,0,sizeof(cmd));
			cmd.cmd_line = buf;
			cmd.funcs = cmd_func;
			cmd.func_cnt = sizeof(cmd_func)/sizeof(CMD);
			pbuf=buf;
		}
	}
}

int cmd_exit(char** args,int argc,int flags){
	printf("BYE");
	if(BIT_FLAG(flags,'p'))
		printf(" ;)");
	printf("\n");
	exit(0);

	return 0;
}

int cmd_hello(char** args,int argc,int flags){
	printf("hello!\n");

	return 0;
}
