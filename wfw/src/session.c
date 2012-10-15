#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/param.h>

#include "icmd.h"

typedef struct{
	unsigned char uid[64];
	unsigned char pwd[64];
	unsigned char sid[64];
}USER;

const char* data_path = "/srv/Stockage";

int quit(char** args,int argc,int flags){
	printf("BYE\n");
	exit(0);
}

int user_login(char** args,int argc,int flags){
	if(argc<2+1)
		return 1;
	return 0;
}

int user_logout(char** args,int argc,int flags){
	if(argc<2+1)
		return 1;
	return 0;
}

int user_find(const char* uid){
	return -1;
}

int user_register(char** args,int argc,int flags){
	FILE* fp_users_cfg;
	char buf[PATH_MAX];
	const char* user = args[1];
	const char* password = args[2];
	if(argc<2+1)
		return 1;
//	printf("user: %s\n",user);
//	printf("password: %s\n",password);
	//cree le dossier
//	getcwd(path,PATH_MAX);
//	strcat(path,"/");
//	strcat(path,user);
	//ajoute l'utilisateur a la configuration
	if(fp_users_cfg=fopen("/etc/webframework/users.cfg","a")){
		sprintf(buf,"%s:/%s\n",user,password);
		fwrite(fp_users_cfg,buf,strlen(buf));
		fclose(fp_users_cfg);
	}
	else{
		printf("failed add user to configuration\n");
		return 1;
	}
	//assigne un dossier a l'utilisateur
	sprintf(buf,"%s/%s",data_path,user);
	if(mkdir(buf,00777) == -1){
		printf("mkdir failed: %s\n",buf);
		return 1;
	}
	//
	printf("user %s created\n",user);
	return 0;
}

CMD cmd_func[]={
	{"quit",quit},
	{"hello",user_login},
	{"login",user_login},
	{"logout",user_logout},
	{"register",user_register},
};

int main(void)
{
	printf("Session manager started\n");
	return read_cmd(cmd_func,sizeof(cmd_func)/sizeof(CMD));
}
