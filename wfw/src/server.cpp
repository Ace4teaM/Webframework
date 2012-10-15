#include "server.h"

int open_stream(int nHostPort,size_t (*callback)(char* buf,size_t size))
{
	int ret;
    int hSocket,hServerSocket;  /* handle to socket */
//    struct hostent* pHostInfo;   /* holds info about a machine */
    struct sockaddr_in Address; /* Internet socket address stuct */
	char strAddress[INET_ADDRSTRLEN];
    int nAddressSize=sizeof(struct sockaddr_in);
    char pBuffer[BUFFER_SIZE];
	size_t buf_size=0;
	FILE* _stdout=NULL;
//	FILE* code=NULL;

    printf("Making socket\n");
    /* make a socket */
    hServerSocket=socket(AF_INET,SOCK_STREAM,0);

    if(hServerSocket == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not make a socket\n");
        return 0;
    }

    /* fill address struct */
    Address.sin_addr.s_addr=INADDR_ANY;
    Address.sin_port=htons(nHostPort);
    Address.sin_family=AF_INET;

    printf("Binding to port %d\n",nHostPort);

    /* bind to a port */
    if(bind(hServerSocket,(struct sockaddr*)&Address,sizeof(Address)) == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not connect to host\n");
        return 0;
    }
 /*  get port number */
    getsockname( hServerSocket, (struct sockaddr *) &Address,(socklen_t *)&nAddressSize);
    printf("opened socket as fd (%d) on port (%d) for stream i/o\n",hServerSocket, ntohs(Address.sin_port) );

        printf("Server\n\
              sin_family        = %d\n\
              sin_addr.s_addr   = %d\n\
              sin_port          = %d\n"
              , Address.sin_family
              , Address.sin_addr.s_addr
              , ntohs(Address.sin_port)
            );


    printf("Making a listen queue of %d elements\n",QUEUE_SIZE);
    /* establish listen queue */
    if(listen(hServerSocket,QUEUE_SIZE) == SOCKET_ERROR)
    {
        fprintf(stderr,"Could not listen\n");
        return 0;
    }

    for(;;)
    {
        printf("Waiting for a connection...");
		fflush(stdout);

        /* obtient une connection cliente */
        hSocket=accept(hServerSocket,(struct sockaddr*)&Address,(socklen_t *)&nAddressSize);
		if(hSocket != -1)
		{
			inet_ntop(AF_INET, &(Address.sin_addr), strAddress, INET_ADDRSTRLEN);
			puts(strAddress);

			/*redirige la sortie standard sur le socket*/
			_stdout = stdout;
			stdout = fdopen(hSocket,"w");
//			code = fdopen(hSocket,"w");

			/*lit le client*/
			while((buf_size = read(hSocket,pBuffer,BUFFER_SIZE)))
			{
				/*reponse server*/
				ret=callback(pBuffer,buf_size);
//				fprintf(code,"%.4d ",ret);
//				fflush(code);
				fflush(stdout);

				/*debug*/
				fprintf(_stdout,"[%d]",ret);
				fwrite(pBuffer,buf_size,1,_stdout);
				fputs("\n",_stdout);
				
			}

			/*restore la sortie standard*/
			/*fclose(code);
			fclose(stdout);*/
			stdout = _stdout;

			printf("Closing the socket\n");
			/* close socket */
			if(close(hSocket) == SOCKET_ERROR)
			{
				 fprintf(stderr,"Could not close socket\n");
				 return 0;
			}
		}
        else
			printf("Error\n");
    }

	return 1;
}

/*lit a partir de l'entree standard*/
int read_stdin(int delemiter,int (*callback)(char* buf,size_t size))
{
	char buf[2048];
	int c;
	size_t i;

	i=0;
	while((c = fgetc(stdin))!=EOF)
	{
		i++;
		if(delemiter == c){
			return callback(buf,i);
		}
	}

	return EOF;
}

