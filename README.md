# Running the VRaves

This site is the clone of Basic Company site. 

## Initialize

Open a PowerShell administrator prompt and run the following command, replacing the `-LicenseXmlPath` with the location of your Sitecore license file.

```
.\init.ps1 -LicenseXmlPath [Your License Path]
```

## Build the solution and start Sitecore

Run the following command in PowerShell.

```
docker-compose up -d
```
or

```
.\up.ps1 [-SkipBuild if you want to skip the build]
```

This will download any required Docker images, build the solution and Sitecore runtime images, and then start the containers. The example uses the *Sitecore Experience Management (XM1)* topology.

Once complete, you can access the instance with the following.

* Sitecore Content Management: https://cm.vraves.localhost
* Sitecore Identity Server: https://id.vraves.localhost
* VRaves Rendering Host site: https://rh.vraves.localhost

## Stop Sitecore

When you're done, stop and remove the containers using the following command.

```
.\down.ps1
```