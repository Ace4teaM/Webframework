#include "client.h"

int send_stream(const char* strHostName,int nHostPort,size_t (*callback)(char* buf,size_t size))
{
    int hSocket;                 /* handle to socket */
    struct hostent* pHostInfo;   /* holds info about a machine */
    struct sockaddr_in Address;  /* Internet socket address stuct */
    long nHostAddress;
    char buf[BUFFER_SIZE];
	size_t data_size=0;

    printf("Making a socket\n");
    /* make a socket */
    hSocket=socket(AF_INET,SOCK_STREAM,IPPROTO_TCP);

    if(hSocket == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not make a socket\n");
        return 0;
    }

    /* get IP address from name */
    pHostInfo=gethostbyname(strHostName);
    /* copy address into long */
    memcpy(&nHostAddress,pHostInfo->h_addr,pHostInfo->h_length);

    /* fill address struct */
    Address.sin_addr.s_addr=nHostAddress;
    Address.sin_port=htons(nHostPort);
    Address.sin_family=AF_INET;

    printf("Connecting to %s on port %d\n",strHostName,nHostPort);

    /* connect to host */
    if(connect(hSocket,(struct sockaddr*)&Address,sizeof(Address)) == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not connect to host\n");
        return 0;
    }
	
    printf("Enter empty line for closing connection\n");

	do{
		//passe la reponse du serveur et envoie la reponse cliente
		if((data_size=callback(buf,data_size))){
			write(hSocket,buf,data_size);
			//lit la reponse du serveur
			data_size=read(hSocket,buf,BUFFER_SIZE);
		}
	}while(data_size);

    printf("Closing socket\n");
    /* close socket */                       
    if(close(hSocket) == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not close socket\n");
        return 0;
    }

	return 0;
}




