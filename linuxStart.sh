#!/usr/bin/bash

one=1
two=2
#gameStart

echo Play with MikiBot "("1")" 
echo Play Solo "("2")" 
read -p ":" gameStart
echo "$gameStart" -eq "$one"
echo $gameStart -eq "$one"
#echo $one
if [ "$gameStart" -eq "$one" ]; then
		sed -i '3d' config/chessConfig.config.js
		sed -i '2 a botColor : '"'black'"' ,' config/chessConfig.config.js
		open http://localhost:8090
		python3 -m http.server 8090
fi
if [ "$gameStart" -eq "$two" ]; then
		sed -i '3d' config/chessConfig.config.js
        open http://localhost:8090
        python3 -m http.server 8090
fi


