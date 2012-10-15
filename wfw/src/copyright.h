#ifndef _COPYRIGHT_H
#define _COPYRIGHT_H

#define COPYRIGHT_PRINT_FORMAT "+\n| %s(R) v%s.\n| (C)%s-ID-Informatik. All rights reserved.\n+\n"
#define COPYRIGHT_PRINT(name,version,year) printf(COPYRIGHT_PRINT_FORMAT,name,version,year);

#endif /* _COPYRIGHT_H */