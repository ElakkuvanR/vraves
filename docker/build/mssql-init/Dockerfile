# escape=`

ARG PARENT_IMAGE
ARG SPE_IMAGE
ARG SXA_IMAGE
ARG HEADLESS_SERVICES_IMAGE

FROM ${SXA_IMAGE} as sxa
FROM ${SPE_IMAGE} AS spe
FROM ${HEADLESS_SERVICES_IMAGE} AS headless_services
FROM ${PARENT_IMAGE}

# Copy and init the JSS / Headless Services Module
COPY --from=headless_services C:\module\db C:\jss_data

# Add SPE module
COPY --from=spe \module\db \spe_data

# # Add SXA module
# COPY --from=sxa \module\db \sxa_data
# RUN C:\DeployDatabases.ps1 -ResourcesDirectory C:\sxa_data; `
#     Remove-Item -Path C:\sxa_data -Recurse -Force;