

@echo off


REM �������ڴ���������MΪ��λ
set MAX_MEMORY=20480


Set SCRIPT_HOME=%~dp0%
set APP_HOME=%SCRIPT_HOME:~0,-4%
set LIB_HOME=%APP_HOME%;%BIN_HOME%libs
set JAVA_HOME=%APP_HOME%miniJre
set BIN_HOME=%APP_HOME%bin

REM %JAVA_HOME%
%SCRIPT_HOME%prunsrv_64 //IS//YiShape --DisplayName="YiShape" --Description="���οռ��������ݿ�_ϵͳ����" ^
               --Install=%SCRIPT_HOME%prunsrv_64.exe --Jvm=%JAVA_HOME%\bin\server\jvm.dll --JvmMs=512 --JvmMx=%MAX_MEMORY% ^
			   --Classpath=%JAVA_HOME%\lib\;%BIN_HOME%\libs;%BIN_HOME%\YiShape.exe ^
			   --StartMode=jvm --Startup=auto --StopMode=jvm --StartClass=com.reremouse.rerecontainer.service.StartYiShape --StartParams= ^
			   --StopClass=com.reremouse.rerecontainer.service.StopYiShape --StopParams= ^
			   --LogPath=%APP_HOME%\logs\ --LogPrefix=service

sc start YiShape

echo "������Ѿ�ע��Ϊ��WINDOWSϵͳ���񣬷�����Ϊ��YiShape���������Ѿ������������뵽 ��������� - ������ - ���� �в鿴�����"
echo "���������������û�������ɹ��������������ڱ������ͼ�ͽ����������˷�����������˶˿ڳ�ͻ��������������Ѿ�ռ���˱����Ҫʹ�õĶ˿ڣ��뵽ͼ�ν�������˿ڡ�"


pause 