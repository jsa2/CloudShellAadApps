#
# curl -o- https://raw.githubusercontent.com/jsa2/CloudShellAadApps/public/remote.sh | bash

git clone 'https://github.com/jsa2/CloudShellAadApps.git'

cd CloudShellAadApps

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm install 14

nvm use 14

nvm alias default 14

npm install

rnd=$RANDOM
rg=queryStorage-$rnd
location=westeurope
# You can ignore the warning "command substitution: ignored null byte in input"
storageAcc=storage$(head /dev/urandom | tr -dc a-z | head -c10)

echo $storageAcc
# Create Resource Group
az group create -n $rg \
-l $location \
--tags="svc=scan"


# Create storageAcc Account 
az storage account create -n $storageAcc  -g $rg --kind storageV2 -l $location -t Account --sku Standard_LRS

az storage account show-connection-string -g $rg  -n  $storageAcc -o json  > src/config.json

az storage account management-policy create --account-name $storageAcc  -g $rg --policy @retention.json

node main.js

echo "navigate to kql/runtime.kql if code does not open up"

code kql/runtime.kql

echo "To later delete the deployment type:"


echo "az group delete -n $rg "

echo "az group delete -n $rg " > deleteDepl.sh
