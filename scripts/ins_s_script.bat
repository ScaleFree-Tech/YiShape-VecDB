

@echo off


REM 最大可用内存数量，以M为单位
set MAX_MEMORY=20480


Set SCRIPT_HOME=%~dp0%
set APP_HOME=%SCRIPT_HOME:~0,-4%
set LIB_HOME=%APP_HOME%;%BIN_HOME%libs
set JAVA_HOME=%APP_HOME%miniJre
set BIN_HOME=%APP_HOME%bin

REM %JAVA_HOME%
%SCRIPT_HOME%prunsrv_64 //IS//YiShape --DisplayName="YiShape" --Description="易形空间向量数据库_系统服务。" ^
               --Install=%SCRIPT_HOME%prunsrv_64.exe --Jvm=%JAVA_HOME%\bin\server\jvm.dll --JvmMs=512 --JvmMx=%MAX_MEMORY% ^
			   --Classpath=%JAVA_HOME%\lib\;%BIN_HOME%\libs;%BIN_HOME%\YiShape.exe ^
			   --StartMode=jvm --Startup=auto --StopMode=jvm --StartClass=com.reremouse.rerecontainer.service.StartYiShape --StartParams= ^
			   --StopClass=com.reremouse.rerecontainer.service.StopYiShape --StopParams= ^
			   --LogPath=%APP_HOME%\logs\ --LogPrefix=service

sc start YiShape

echo "本软件已经注册为了WINDOWS系统服务，服务名为：YiShape。本服务已经尝试启动，请到 【控制面板 - 管理工具 - 服务】 中查看结果！"
echo "。。。。如果服务没有启动成功，可能是您已在本软件的图型界面中启动了服务器，造成了端口冲突。或者其它软件已经占用了本软件要使用的端口，请到图形界面重设端口。"


pause 