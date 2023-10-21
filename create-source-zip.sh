file_name=$(uuidgen)
rm -r ./wakatime-source.zip
cp -r ./ /tmp/$file_name

rm -r /tmp/$file_name/addon
rm -r /tmp/$file_name/node_modules
rm -r /tmp/$file_name/web-ext-artifacts
rm -rf /tmp/$file_name/.git
rm -r /tmp/$file_name/.gitignore
rm -r /tmp/$file_name/.DS_Store
rm -r /tmp/$file_name/.envrc
rm -r /tmp/$file_name/.eslintignore
rm -r /tmp/$file_name/.eslintrc
rm -r /tmp/$file_name/create-source-zip.sh
rm -rf /tmp/$file_name/.log

tree /tmp/$file_name

project_directory=$(pwd)

pushd /tmp/$file_name
zip -r $project_directory/wakatime-source.zip ./* 2>&1 >/dev/null

if [[ -n $file_name ]]; then
	rm -rf /tmp/$file_name
fi
