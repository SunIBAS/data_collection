#!/bin/bash

# crontab -e
# 50 23 * * * /home/web/csvDown/downCsv.sh

name=$(date "+%m-%d").csv
wget https://raw.githubusercontent.com/BlankerL/DXY-2019-nCoV-Data/master/csv/DXYArea.csv -O $name
