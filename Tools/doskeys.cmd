@echo off
SET TOOLSDIR=%CD%

REM Windows operations
DOSKEY ls=dir
DOSKEY p=pushd $1
DOSKEY pd=popd
DOSKEY s=start $1
DOSKEY s.=start. $1
DOSKEY ip=ipconfig
DOSKEY ipa=ipconfig /all
DOSKEY pi=ping $1

REM Basic Windows executables
DOSKEY n=notepad.exe $1
DOSKEY .n=%TOOLSDIR%\TextAnalysisTool.NET\TextAnalysisTool.NET.exe $1
DOSKEY chosts=notepad.exe %SYSTEMROOT%\System32\drivers\etc\hosts

REM Navigation aliases
DOSKEY h=cd %TOOLSDIR%\..\
DOSKEY t=cd %TOOLSDIR%

DOSKEY delobj=for /R /D %%A in (*obj) do del /S /Q %%A
DOSKEY delbin=for /R /D %%A in (*bin) do del /S /Q %%A

DOSKEY ssh=%TOOLSDIR%\CygwinSSH\ssh.exe $*
DOSKEY ssht1=%TOOLSDIR%\CygwinSSH\ssh.exe -i "%TOOLSDIR%\..\Certs\myPrivateKey.key" -p 22 tommy@tidal1.cloudapp.net

DOSKEY ..=cd .\..\
DOSKEY ...=cd .\..\..\
DOSKEY ....=cd .\..\..\..\
DOSKEY .....=cd .\..\..\..\..\
DOSKEY ......=cd .\..\..\..\..\..\
DOSKEY .......=cd .\..\..\..\..\..\..\



ECHO Welcome to Command Prompt with Aliases