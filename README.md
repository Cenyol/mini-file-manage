### Mini File Manage System

#### Language & DB
NodeJs + SQLite3

#### Feature
1. save file name and content in SQLite3, and assume file name is unique;
2. one could edit file name and content, and it can prevent conflicts when multiple users edit the same file;
3. one need get lock of file before edit it, otherwise he can't edit it;
4. use trasaction to prevent concurrent from getting lock, to ensure only one person can edit that file one time;
5. use schedule logic code, to reclaim lock that time out 60 seconds;


#### Launch In Terminal
```
git clone https://github.com/Cenyol/mini-file-manage.git
cd mini-file-manage
npm install
node index.js
```
Precondition: you need to have installed node and npm

#### Clean Old Data
if you want, what you need to is run the below cmd:
```
cd mini-file-manage
rm -f sqlite3.db

# rerun init system
node index.js
```