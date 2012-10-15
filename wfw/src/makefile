
# -= powerpc (DS108j) =- #
#CC=../powerpc-linux/bin/powerpc-linux-gcc
#LD=../powerpc-linux/bin/powerpc-linux-ld
#CFLAGS += -I../powerpc-linux/include
#LDFLAGS+= -L../powerpc-linux/lib
#OUTDIR=powerpc

# -= local =- #
#CC=gcc
CC=g++
LD=ld
OUTDIR=

all: getline wfw_usersd clean

clean:
	rm -rf *.o

#
#programmes
#

getline: getline.o
	$(CC) -o $(OUTDIR)getline getline.o

pipe_test: pipe_test.o icmd.o
	$(CC) -o $(OUTDIR)pipe_test pipe_test.o icmd.o

serv_test: serv_test.o icmd.o server.o
	$(CC) -o $(OUTDIR)serv_test serv_test.o icmd.o server.o

client_test: client_test.o client.o
	$(CC) -o $(OUTDIR)client_test client_test.o client.o
	
wfw_usersd: icmd.o icmdd.o server.o users_cmd.o
	$(CC) -o $(OUTDIR)wfw_usersd icmd.o icmdd.o server.o users_cmd.o

#
#objets
#

icmd.o: icmd.cpp
	$(CC) -o icmd.o -c icmd.cpp -W -Wall -ansi -pedantic

icmdd.o: icmdd.cpp
	$(CC) -o icmdd.o -c icmdd.cpp -W -Wall -ansi -pedantic
	
pipe_test.o: pipe_test.cpp
	$(CC) -o pipe_test.o -c pipe_test.cpp -W -Wall -ansi -pedantic
	
serv_test.o: serv_test.cpp
	$(CC) -o serv_test.o -c serv_test.cpp -W -Wall -ansi -pedantic
	
getline.o: getline.cpp
	$(CC) -o getline.o -c getline.cpp -W -Wall -ansi -pedantic
	
server.o: server.cpp
	$(CC) -o server.o -c server.cpp -W -Wall -ansi -pedantic

client.o: client.cpp
	$(CC) -o client.o -c client.cpp -W -Wall -ansi -pedantic

users_cmd.o: users_cmd.cpp
	$(CC) -o users_cmd.o -c users_cmd.cpp -W -Wall -ansi -pedantic