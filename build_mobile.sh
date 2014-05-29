#!/bin/bash


echo ""
echo "[--- Sauvane : DEV Build mobile ---]"
echo ""

#sudo npm update -g cordova
rm -rf build

cordova create build com.apps4pro.sauvane NatiWheel

cp -r www build/.
cp build/www/config.xml build/config.xml

oldstring='src=\"res\/'
newstring='src=\"www\/res\/'
sed -i.bak "s#$oldstring#$newstring#g" build/config.xml


cd build
cordova platform add ios
cordova platform add android


cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.network-information
cordova plugin add org.apache.cordova.battery-status
cordova plugin add org.apache.cordova.device-motion
cordova plugin add org.apache.cordova.device-orientation
cordova plugin add org.apache.cordova.geolocation
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.media
cordova plugin add org.apache.cordova.media-capture
cordova plugin add org.apache.cordova.file
cordova plugin add org.apache.cordova.file-transfer
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.vibration
cordova plugin add org.apache.cordova.contacts
cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.splashscreen
cordova plugin add org.apache.cordova.inappbrowser
cordova plugin add org.apache.cordova.console

cordova plugin add https://github.com/phonegap-build/GAPlugin.git

cordova build ios
cordova build android

cd platforms/android
ant release

jarsigner -keystore ../../../android_key/apps4pro-key.keystore -storepass apps4pro -digestalg SHA1 -sigalg MD5withRSA bin/NatiWheel-release-unsigned.apk mykey
cp bin/NatiWheel-release-unsigned.apk ../../NatiWheel.apk
zipalign -f 4 ../../NatiWheel.apk ../../NatiWheel-aligned.apk
cd ../..

cd ..
