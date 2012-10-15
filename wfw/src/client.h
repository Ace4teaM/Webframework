#ifndef _WFW_CLIENT_H
#define _WFW_CLIENT_H

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>

#define SOCKET_ERROR -1
#define BUFFER_SIZE  256

int send_stream(const char* strHostName,int nHostPort,size_t (*callback)(char* buf,size_t size));

#endif /* _WFW_CLIENT_H */
