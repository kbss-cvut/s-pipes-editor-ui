@echo off
setlocal enabledelayedexpansion

goto :begin

:print_usage
echo Start SPipes Editor on specified SPipes script PATH(s).
echo Usage:
echo   %0 PATH...
echo Examples:
echo   EXAMPLE-1 (load scripts from current directory): %0 .
echo   EXAMPLE-2 (load scripts from multiple directories): %0 \script\main \scripts\maintenance
goto eof:


:begin
IF "%1"=="" goto :print_usage

set PROJECT_DIR=%~dp0..\
REM WSL mount prefix
set WSL_PREFIX=/mnt/
REM DOCKER DESKTOP mount prefix
set DD_PREFIX=/host_mnt/
REM path converter command
set PATH_CONVERTER=%PROJECT_DIR%\bin\wslpath.bat

REM variable to store absolute paths from provided parameters
for %%A in (%*) do (
    REM set "tmp=%%~fA"
    REM echo argument=%%~fA
    FOR /F "tokens=*" %%g IN ('%PATH_CONVERTER% %%~fA') do (
        set absolute_path=%%g
        if "!CUSTOM_SCRIPT_PATHS!"=="" (
            set "CUSTOM_SCRIPT_PATHS=!absolute_path:%WSL_PREFIX%=%DD_PREFIX%!"
        ) else (
            set "CUSTOM_SCRIPT_PATHS=!CUSTOM_SCRIPT_PATHS!;!absolute_path:%WSL_PREFIX%=%DD_PREFIX%!"
        )
    )
)
cd %PROJECT_DIR%/deploy
echo starting s-pipes-editor-ui with scripts %CUSTOM_SCRIPT_PATHS%
docker-compose --env-file=.env up
:eof


