#!/bin/bash

# Vue3 EPUB 阅读器 - 本地安装脚本
# 此脚本自动设置本地开发环境

set -e

echo "🚀 开始设置 Vue3 EPUB 阅读器本地开发环境..."
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
READER_DIR="$SCRIPT_DIR"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印带颜色的输出
print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 检查 Node.js 版本
print_step "检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_warning "Node.js 版本应该 >= 20.0.0"
    echo "当前版本: $(node -v)"
    exit 1
fi
print_success "Node.js 版本: $(node -v)"

# 步骤 1: 安装项目根目录的依赖
print_step "安装项目根目录依赖..."
cd "$PROJECT_ROOT"

if [ -d "node_modules" ]; then
    print_warning "node_modules 已存在，跳过安装"
else
    npm install --legacy-peer-deps
    print_success "项目根目录依赖安装完成"
fi

# 步骤 2: 编译 elegant-epub
print_step "编译 elegant-epub..."
npm run compile
print_success "elegant-epub 编译完成"

# 步骤 3: 安装 Vue3 项目依赖
print_step "安装 Vue3 项目依赖..."
cd "$READER_DIR"

if [ -d "node_modules" ]; then
    print_warning "node_modules 已存在，跳过安装"
else
    npm install
    print_success "Vue3 项目依赖安装完成"
fi

# 验证安装
print_step "验证安装..."
if npm list elegant-epub > /dev/null 2>&1; then
    print_success "elegant-epub 已正确链接"
else
    print_warning "elegant-epub 链接可能有问题，请检查"
fi

echo ""
echo -e "${GREEN}✨ 安装完成！${NC}"
echo ""
echo "下一步："
echo -e "${BLUE}1.${NC} 启动开发服务器:"
echo "   cd $READER_DIR"
echo "   npm run dev"
echo ""
echo -e "${BLUE}2.${NC} 浏览器会自动打开 http://localhost:5173"
echo ""
echo -e "${BLUE}3.${NC} 修改 elegant-epub 源代码后，在项目根目录运行:"
echo "   npm run compile"
echo ""
