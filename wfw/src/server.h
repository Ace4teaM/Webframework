#ifndef _WFW_SERVER_H
#define _WFW_SERVER_H

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>
#include <arpa/inet.h>

#define SOCKET_ERROR        -1
#define BUFFER_SIZE         100
#define MESSAGE             "Hello"
#define QUEUE_SIZE          5

int open_stream(int nHostPort,size_t (*callback)(char* buf,size_t size));
int read_stdin(int delemiter,size_t (*callback)(char* buf,size_t size));

#endif /* _WFW_SERVER_H */
