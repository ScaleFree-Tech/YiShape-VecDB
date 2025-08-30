






@echo off

rem powershell.exe -Command "Start-Process cmd -Verb RunAs"

set SCRIPT_HOME=%~dp0%

set path=%path%;"%SCRIPT_HOME%"

rem runas /savecred /user:administrator "%APP_HOME%InstallService.bat"

sudo cmd /k %SCRIPT_HOME%uns_s_script.bat

pause