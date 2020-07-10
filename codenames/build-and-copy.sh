#!/bin/bash

ng build --base-href ./
rm dist-codenames.zip
zip -r dist-codenames.zip dist
scp dist-codenames.zip stan:
