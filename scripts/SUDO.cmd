

@echo off
set myTemp=%~dp0%temp


@echo Set objShell = CreateObject("Shell.Application") > %myTemp%\sudo.tmp.vbs
@echo args = Right("%*", (Len("%*") - Len("%1"))) >> %myTemp%\sudo.tmp.vbs
@echo objShell.ShellExecute "%1", args, "", "runas" >> %myTemp%\sudo.tmp.vbs
@cscript %myTemp%\sudo.tmp.vbs


