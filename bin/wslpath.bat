@echo off
REM This script converts the input path to a path compatible with wsl
wsl -e wslpath -a %1