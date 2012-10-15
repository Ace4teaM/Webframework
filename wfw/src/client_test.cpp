#include "copyright.h"
#include "client.h"

size_t callback(char* buf,size_t size)
{
	int c;

	//server msg
	buf[size]=0;
	printf("%s\n",buf);

	//reponse
	printf("$ ");
	size=0;
	while((c=fgetc(stdin))!=EOF)
	{
		if(size<BUFFER_SIZE-1){
			if(c==0xA){
				buf[size]=0;
				return size;
			}
			buf[size++]=c;
		}
	}
	//reponse
/*	if(size && strcmp(buf,"hello"))
		strcpy(buf,"quit -p");
	else
		strcpy(buf,"quit");
	return strlen(buf);*/
	return 0;
}

int main(int argc,char* argv[])
{
	COPYRIGHT_PRINT("Interactive Command Line Client","1.0","2010");
	return send_stream(argv[1],atoi(argv[2]),callback);
}
