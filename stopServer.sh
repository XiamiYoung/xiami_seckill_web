ps -ef | grep server.js | grep -v grep | awk '{print $2}' | xargs kill