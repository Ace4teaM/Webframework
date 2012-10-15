#include "icmd.h"
#include "server.h"

int cmd_exit(char** args,int argc,int flags);
int cmd_hello(char** args,int argc,int flags);

CMD cmd_func[]={
	{"exit",cmd_exit},
	{"quit",cmd_exit},
	{"bye",cmd_exit},
	{"hello",cmd_hello},
	{"hi",cmd_hello},
};

size_t callback(char* buf,size_t size)
{
	CMD_STRUCT cmd;
	memset(&cmd,0,sizeof(cmd));
	cmd.cmd_line = buf;
	cmd.cmd_line_size = size;
	cmd.funcs = cmd_func;
	cmd.func_cnt = sizeof(cmd_func)/sizeof(CMD);
	
//	buf[size]=0;
//	printf("read: %s\n",buf);


	if((check_cmd(&cmd)==0) && (cmd.find_func_cnt!=-1)){
		cmd.funcs[cmd.find_func_cnt].func(cmd.pword,cmd.word_cnt,cmd.flags);
	}
	else if(cmd.word_cnt)
		printf("warning: unknown command '%s'\n",cmd.pword[0]);
	else
		printf("warning: no command read\n");

	return 0;
}

int main(void)
{
	printf("welcome server command line\n");
	return open_stream(4578,callback);
}

int cmd_exit(char** args,int argc,int flags){
	printf("BYE");
	if(BIT_FLAG(flags,'p'))
		printf(" ;)");
	printf(" BYE");
	printf("\n");

	fprintf(stderr,"close server now!\n");
	exit(0);

	return 0;
}

int cmd_hello(char** args,int argc,int flags){
	printf("hello!\n");

	return 0;
}
