FILE_NAME=$(uuidgen)
cp -r ./ /tmp/$FILE_NAME

rm -r /tmp/$FILE_NAME/addon
rm -r /tmp/$FILE_NAME/node_modules
rm -r /tmp/$FILE_NAME/web-ext-artifacts
rm -rf /tmp/$FILE_NAME/.git
rm -r /tmp/$FILE_NAME/.gitignore
rm -r /tmp/$FILE_NAME/.DS_Store
rm -r /tmp/$FILE_NAME/.envrc
rm -r /tmp/$FILE_NAME/.eslintignore
rm -r /tmp/$FILE_NAME/.eslintrc
rm -r /tmp/$FILE_NAME/create-source-zip.sh
rm -rf /tmp/$FILE_NAME/.log

tree /tmp/$FILE_NAME

zip -r ./wakatime-source.zip /tmp/$FILE_NAME 2>&1 >/dev/null

if [[ -n $FILE_NAME ]]; then
	rm -r /tmp/$FILE_NAME
fi
