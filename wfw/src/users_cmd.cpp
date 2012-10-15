/*
	webframework: users commands
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <sys/types.h>
#include <sys/param.h>
#include "icmd.h"
#include "server.h"

int login(char** argv,int argc,int flags);
int logout(char** argv,int argc,int flags);
int var(char** argv,int argc,int flags);

const char* data_path = "/srv/Stockage/users";
const char* cfg_path = "/etc/webframework";

CMD cmd_func[]={
	{"login",login},
	{"logout",logout},
	{"var",var},
};

int cmd_func_cnt = sizeof(cmd_func)/sizeof(CMD);
int host_port = 4501;

/*
var sid name [value]
*/
int var(char** argv,int argc,int flags)
{
	FILE *fp;
	size_t size;
	char buf[2048];
	struct _ARGS{
		char* cname;
		char* sid;
		char* name;
		char* value;
	}*args=(struct _ARGS*)argv;

	//set
	if(argc==4){
		puts("get not implanted\n");
		return 0;
	}
	//get
	else if(argc==3){
		//recherche la ligne de configuration et recupere la sortie
		sprintf(buf,"grep -i ^%s=.* %s/%s/vars",args->name,cfg_path,args->sid);
		if(NULL != (fp = popen(buf, "r" ))){
			*buf=0;
			fgets(  buf, sizeof(buf),fp );
			size=strlen(buf);
			if(size){
				//retourne
				fwrite(buf,size-1,1,stdout);
			}
			pclose(fp);
			return 0;
		}
	}
	else
		printf("invalid argument count (%d)\n",argc);
	return 1;
}

/*
login user_id session_id
*/
int logout(char** argv,int argc,int flags)
{
	return 0;
}

/*
login user_id password
*/
int login(char** argv,int argc,int flags)
{
	char *pwd,*uid;
	FILE* fp;
	int i,ret,sid;
	char buf[PATH_MAX];
	char user[PATH_MAX];
	time_t t;

	if(argc<1+2)
		return -1;

	/*arguments*/
	uid = argv[1];
	pwd = argv[2];

	if(time(&t)==-1)
		return -1;

	i=0;
	sprintf(user,"%s:%s",uid,pwd);

	//recherche l'utilisateur dans la liste
	do{
		ret=1;
		//lit la prochaine ligne
		sprintf(buf,"./getline %d < %s/users",i,cfg_path);
		if(NULL != (fp=popen(buf, "r"))){
			fgets(buf, sizeof(buf), fp);
			ret=pclose(fp);
		}
		printf("%s\n",buf);
		// ok
		if(ret==0){
			// ok, c'est cet utilisateur!
			if(strcmp(user,buf)==0){
				//genere un identificateur de session
				sid=rand();
				//creer un lien avec le dossier de l'utilisateur
				sprintf(buf,"ln -s -d %s/%s %s",data_path,uid,cfg_path);
				puts(buf);
				if(system(buf)!=0){
					printf("cant create user link!\n");//+1h
					return 1;
				}
				//reponse
				printf("uid=%s\nsid=%d\nlink=%s/%d\n",uid,sid,cfg_path,sid);
				//ajoute le session id a l'utilisateur
				//printf("%s:%d\n",user,sid);
				return 0;
			}
			/*else{
				printf("%s\n",buf);
			}*/
			i++;
		}
	}while(ret==0);

	return 1;
}
