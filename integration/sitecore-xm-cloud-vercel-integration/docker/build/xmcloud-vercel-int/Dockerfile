# escape=`

ARG BASE_IMAGE

##region configure powershell
FROM mcr.microsoft.com/powershell:nanoserver  AS installer-env
ARG PS_VERSION=7.0.0-rc.1
ARG PS_PACKAGE_URL=https://github.com/PowerShell/PowerShell/releases/download/v$PS_VERSION/PowerShell-$PS_VERSION-win-x64.zip


ENV POWERSHELL_TELEMETRY_OPTOUT="1"

SHELL ["pwsh", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

ARG PS_PACKAGE_URL_BASE64

RUN Write-host "Verifying valid Version..."; `
    if (!($env:PS_VERSION -match '^\d+\.\d+\.\d+(-\w+(\.\d+)?)?$' )) { `
        throw ('PS_Version ({0}) must match the regex "^\d+\.\d+\.\d+(-\w+(\.\d+)?)?$"' -f $env:PS_VERSION) `
    } `
    $ProgressPreference = 'SilentlyContinue'; `
    if($env:PS_PACKAGE_URL_BASE64){ `
        Write-host "decoding: $env:PS_PACKAGE_URL_BASE64" ;`
        $url = [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String($env:PS_PACKAGE_URL_BASE64)) `
    } else { `
        Write-host "using url: $env:PS_PACKAGE_URL" ;`
        $url = $env:PS_PACKAGE_URL `
    } `
    Write-host "downloading: $url"; `
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; `
    New-Item -ItemType Directory /installer > $null ; `
    Invoke-WebRequest -Uri $url -outfile /installer/powershell.zip -verbose; `
    Expand-Archive /installer/powershell.zip -DestinationPath \PowerShell

##region end configure powershell


FROM ${BASE_IMAGE} as base

ENV ProgramFiles="C:\Program Files" `
    PSModuleAnalysisCachePath="C:\Users\Public\AppData\Local\Microsoft\Windows\PowerShell\docker\ModuleAnalysisCache" `
    PSCORE="$ProgramFiles\PowerShell\pwsh.exe" `
    WindowsPATH="C:\Windows\system32;C:\Windows" `
    POWERSHELL_DISTRIBUTION_CHANNEL="PSDocker-NanoServer-1809"

USER ContainerAdministrator
RUN setx PATH "%PATH%;%ProgramFiles%\PowerShell;" /M

COPY --from=installer-env ["\\PowerShell\\", "$ProgramFiles\\PowerShell"]

# intialize powershell module cache
RUN pwsh `
        -NoLogo `
        -NoProfile `
        -Command " `
          $stopTime = (get-date).AddMinutes(15); `
          $ErrorActionPreference = 'Stop' ; `
          $ProgressPreference = 'SilentlyContinue' ; `
          while(!(Test-Path -Path $env:PSModuleAnalysisCachePath)) {  `
            Write-Host "'Waiting for $env:PSModuleAnalysisCachePath'" ; `
            if((get-date) -gt $stopTime) { throw 'timout expired'} `
            Start-Sleep -Seconds 6 ; `
          }"

RUN pwsh `
    -Command "Write-Host 'Test'"

# re-enable telemetry
ENV POWERSHELL_TELEMETRY_OPTOUT="0"

##STEPS FOR INTEGRATIONS APP
ARG NODEJS_VERSION

## 1. install Nodejs
# USER ContainerAdministrator
WORKDIR c:\build
RUN curl.exe -sS -L -o node.zip https://nodejs.org/dist/v%NODEJS_VERSION%/node-v%NODEJS_VERSION%-win-x64.zip
RUN tar.exe -xf node.zip -C C:\
RUN move C:\node-v%NODEJS_VERSION%-win-x64 c:\node
RUN del node.zip

RUN setx PATH "%PATH%;C:\node\;" /M
RUN icacls.exe C:\node\ /grant "Authenticated Users":(F) /t

SHELL ["pwsh", "-Command", "$ErrorActionPreference = 'Continue'; $ProgressPreference = 'Continue';"]
##Create Dir log & tmp
RUN New-Item -Path 'C:\temp' -ItemType Directory; `
    New-Item -Path 'C:\log' -ItemType Directory


WORKDIR /app

#2. Copy integration app code
COPY . /app
RUN dir
#3. install sitecore docker tools
RUN ./installdependencies.ps1
#4. install latest dotnet 6
RUN ./dotnet-install.ps1 -Channel LTS
#5. dotnet tool restore
RUN dotnet tool restore

RUN $env:path

EXPOSE 3000
ENTRYPOINT ["pwsh", "-Command", "npm install && npm run dev"]
