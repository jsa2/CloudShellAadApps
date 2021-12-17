

rnd=$RANDOM
rg=queryStorage-$rnd
location=westeurope
# You can ignore the warning "command substitution: ignored null byte in input"
storageAcc=storage$(head /dev/urandom | tr -dc a-z | head -c10)

echo $storageAcc
# Create Resource Group
az group create -n $rg \
-l $location \
--tags="svc=tempStorage"


# Create storageAcc Account 
az storage account create -n $storageAcc  -g $rg --kind storageV2 -l $location -t Account --sku Standard_LRS

az storage account show-connection-string -g $rg  -n  $storageAcc -o json  > src/config.json



# To later delete the deployment
echo "az group delete -n $rg -y"