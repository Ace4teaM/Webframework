#include "copyright.h"
#include "icmd.h"
#include "server.h"

extern CMD cmd_func[];
extern int cmd_func_cnt;
extern int host_port;

size_t callback(char* buf,size_t size)
{
	CMD_STRUCT cmd;
	memset(&cmd,0,sizeof(cmd));
	cmd.cmd_line = buf;
	cmd.cmd_line_size = size;
	cmd.funcs = cmd_func;
	cmd.func_cnt = cmd_func_cnt;
	
	if((check_cmd(&cmd)==0) && (cmd.find_func_cnt!=-1)){
		return cmd.funcs[cmd.find_func_cnt].func(cmd.pword,cmd.word_cnt,cmd.flags);
	}
	else if(cmd.word_cnt){
		printf("warning: unknown command '%s'",cmd.pword[0]);
		return 1;
	}
	
	printf("warning: no command read");
	return 1;
}

int main(void)
{
	COPYRIGHT_PRINT("Interactive Command Line Server","1.0","2010");
	return open_stream(host_port,callback);
}
