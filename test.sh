
rnd=$RANDOM
rg=queryStorage-$rnd
location=westeurope
# You can ignore the warning "command substitution: ignored null byte in input"
storageAcc=storage$(head /dev/urandom | tr -dc a-z | head -c10)

echo $storageAcc