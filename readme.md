## License

[READ HERE](https://github.com/jsa2/CloudShellAadApps/blob/public/LICENSE)

# DO NOT USE THIS TOOL, IT IS IN ALPHA STAGE, AND WE MADE PUBLIC REPO ONLY TO TEST IT OURSELVES IN CERTAIN SCRIPTED SCENARIOS

As the licenses says, 0%  Liability 0% Warranty

## Consent analytics solution


## Use cases

Use Cases | notes
-|-
✅ Inventory of apps and permissions 
✅ Detect applications that share app and user permissions / scopes 
✅ Detect password use on applications, and expiring/d passwords 
✅ Detect AppType (Managed, Multi, single etc)
✅ Review replyURL's
✅ Detect recent sign-ins | This is API setting not enabled by default



## Prerequisites 

Requirement | description | Install
-|-|-
✅ access to Azure Cloud Shell Bash | uses pre-existing software on Azure CLI, Node etc 
✅ access to create storage account and resource group|
✅ User is Azure AD member


## Running the tool

- Log in to Azure Cloud Shell (**BASH** ) and paste following line to the shell
```bash
curl -o- https://raw.githubusercontent.com/jsa2/CloudShellAadApps/public/remote.sh | bash
```

## After initial run

### Checking results again
```bash
cd Cloud CloudShellAadApps
nvm use 14; node main.js
```

### Checking with sign-ins 
```bash
cd Cloud CloudShellAadApps
nvm use 14; node mainSignIns.js
```
## Known issues
### Continous Access Evaluation
Azure CLI is unable to obtain new access tokens for sessions, that rely on IP restrictions and are targeteted by [strict enforcement](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/concept-continuous-access-evaluation#ip-address-variation)
``az account get-access-token --resource=https://graph.microsoft.com --query accessToken --output json`` 
![image](https://user-images.githubusercontent.com/58001986/146808098-035dd7a9-1314-41fe-aa36-471988da634d.png)


