@echo off
REM Vue3 EPUB 阅读器 - 本地安装脚本（Windows）
REM 此脚本自动设置本地开发环境

setlocal enabledelayedexpansion

echo.
echo 🚀 开始设置 Vue3 EPUB 阅读器本地开发环境...
echo.

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\..\"
set "READER_DIR=%SCRIPT_DIR%"

REM 检查 Node.js 版本
echo ➜ 检查 Node.js 版本...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo   Node.js 版本: %NODE_VERSION%

REM 步骤 1: 安装项目根目录的依赖
echo.
echo ➜ 安装项目根目录依赖...
cd /d "%PROJECT_ROOT%"

if exist "node_modules" (
    echo   ⚠ node_modules 已存在，跳过安装
) else (
    call npm install --legacy-peer-deps
    echo   ✓ 项目根目录依赖安装完成
)

REM 步骤 2: 编译 elegant-epub
echo.
echo ➜ 编译 elegant-epub...
call npm run compile
echo   ✓ elegant-epub 编译完成

REM 步骤 3: 安装 Vue3 项目依赖
echo.
echo ➜ 安装 Vue3 项目依赖...
cd /d "%READER_DIR%"

if exist "node_modules" (
    echo   ⚠ node_modules 已存在，跳过安装
) else (
    call npm install
    echo   ✓ Vue3 项目依赖安装完成
)

REM 验证安装
echo.
echo ➜ 验证安装...
call npm list elegant-epub >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   ✓ elegant-epub 已正确链接
) else (
    echo   ⚠ elegant-epub 链接可能有问题，请检查
)

echo.
echo ✨ 安装完成！
echo.
echo 下一步：
echo 1. 启动开发服务器:
echo    cd "%READER_DIR%"
echo    npm run dev
echo.
echo 2. 浏览器会自动打开 http://localhost:5173
echo.
echo 3. 修改 elegant-epub 源代码后，在项目根目录运行:
echo    npm run compile
echo.
pause
