// script.js
// JavaScript 代码将在这里添加

// PNL 成本结构数据
const costData = {
    "name": "总收入 (Total Revenue)",
    "children": [
        { "name": "1.1 外部零件收入 (External Parts Revenue)" },
        { "name": "1.2 关联交易收入 (Intercompany Revenue)" },
        { "name": "1.3 模具收入 (Tooling Revenue)" },
        { "name": "1.4 总收入（不含模具） (Total Revenue (Ex Tooling))" },
        {
            "name": "2. 成本结构 (Cost Structure)",
            "children": [
                {
                    "name": "2.1 销售成本 (Cost of Sales - COS)",
                    "children": [
                        { "name": "2.1.1 材料成本 (Material Costs)" },
                        { "name": "2.1.2 废料收入 (Scrap Revenue)" },
                        { "name": "2.1.3 包装成本 (Packaging Costs)" },
                        { "name": "2.1.4 外包成本 (Subcontracting Costs)" }
                    ]
                },
                {
                    "name": "2.2 人工成本 (Labor Costs)",
                    "children": [
                        { "name": "2.2.1 直接人工 (Direct Labor)" },
                        { "name": "2.2.2 间接人工 (Indirect Labor)" }
                    ]
                },
                {
                    "name": "2.3 间接成本 (Indirect Costs)",
                    "children": [
                        { "name": "2.3.1 标准间接成本 (Standard Indirect COS)" },
                        { "name": "2.3.2 工厂支持成本 (Factory Support Costs)" },
                        { "name": "2.3.3 非标准间接成本 (Non-Standard Indirect COS)" }
                    ]
                },
                {
                    "name": "2.4 吸收成本 (Absorption Costs)",
                    "children": [
                        { "name": "2.4.1 变动成本 (Variable Costs)" },
                        { "name": "2.4.2 固定成本 (Fixed Costs)" }
                    ]
                }
            ]
        },
        { "name": "3. 毛利 (Gross Profit)",
          "children": [
            { "name": "3.1 总边际贡献 (Gross Manufacturing Margin - GMM)" },
            { "name": "3.2 毛利率 (Gross Profit Margin - GP%)" }
          ]
        },
        { "name": "4. 营业费用 (Operating Expenses)",
          "children": [
            { "name": "4.1 销售与市场费用 (Sales & Marketing)" },
            { "name": "4.2 行政管理费用 (General & Administration)" },
            { "name": "4.3 研发费用 (Research & Development)" }
          ]
        },
        { "name": "5. 营业利润 (Operating Income)",
          "children": [
            { "name": "5.1 EBITDA - 零件销售 (EBITDA - Part Sales)" },
            { "name": "5.2 EBITDA - 模具销售 (EBITDA - Tooling Sales)" },
            { "name": "5.3 合并EBITDA (EBITDA Before Corp Charge)" },
            { "name": "5.4 EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)" }
          ]
        },
        { "name": "6. 折旧与摊销 (Depreciation & Amortization)",
          "children": [
            { "name": "6.1 摊销 (Amortization)" },
            { "name": "6.2 折旧 (Depreciation)" }
          ]
        },
        { "name": "7. 息税前利润 (EBIT)",
          "children":[
            { "name": "7.1 毛利润 (Gross Profit)" }
          ]
        }
    ]
};

// 创建树状图
const treeContainer = d3.select("#cost-structure");

const width = 1600; // 增加宽度
const height = 1000; // 增加高度

// 创建树状图布局
const tree = d3.tree()
    .size([height - 200, width - 400]) // 调整边距
    .separation((a, b) => {
        // 根据层级调整节点间距
        if (a.depth === 0 || b.depth === 0) return 4;
        if (a.depth === 1 || b.depth === 1) return 3;
        return (a.parent === b.parent ? 2 : 2.5) / (a.depth * 0.8);
    });

const root = d3.hierarchy(costData);
tree(root);

// 创建SVG容器
const svg = treeContainer.append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "100%")
    .style("height", "auto")
    .style("font", "13px sans-serif")
    .style("user-select", "none")
    .append("g")
    .attr("transform", "translate(200,100)"); // 调整左侧边距

// 添加缩放功能
const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on("zoom", (event) => {
        svg.attr("transform", event.transform);
    });

// 创建控制按钮样式
const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#005F87",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    marginLeft: "10px"
};

// 创建控制面板容器
const controlPanel = treeContainer
    .append("div")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px")
    .style("display", "flex")
    .style("gap", "10px")
    .style("align-items", "center");

// 创建搜索区域容器
const searchContainer = controlPanel
    .append("div")
    .style("position", "relative")
    .style("display", "flex")
    .style("align-items", "center");

// 添加搜索框
const searchInput = searchContainer
    .append("input")
    .attr("type", "text")
    .attr("placeholder", "搜索节点...")
    .style("padding", "8px 30px 8px 8px") // 为清除按钮留出空间
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("margin-right", "10px")
    .style("width", "200px")
    .style("font-size", "14px");

// 添加搜索结果计数
const searchCount = searchContainer
    .append("span")
    .style("margin-right", "10px")
    .style("font-size", "14px")
    .style("color", "#666")
    .style("min-width", "60px")
    .text("");

// 添加清除按钮
const clearButton = searchContainer
    .append("button")
    .style("position", "absolute")
    .style("right", "70px")
    .style("top", "50%")
    .style("transform", "translateY(-50%)")
    .style("background", "none")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("padding", "4px")
    .style("color", "#999")
    .style("font-size", "16px")
    .text("×")
    .style("display", "none")
    .on("click", function() {
        searchInput.node().value = "";
        clearButton.style("display", "none");
        searchCount.text("");
        resetHighlight();
    });

// 添加搜索历史功能
const MAX_HISTORY = 5;

// 从本地存储加载搜索历史
const storedHistory = localStorage.getItem('searchHistory');
const searchHistory = new Set(storedHistory ? JSON.parse(storedHistory) : []);

// 保存搜索历史到本地存储
function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify([...searchHistory]));
}

// 清空搜索历史
function clearSearchHistory() {
    searchHistory.clear();
    saveSearchHistory();
    searchHistoryDropdown.style("display", "none");
}

// 添加清空历史按钮
const clearHistoryButton = searchHistoryDropdown
    .append("div")
    .style("padding", "8px 12px")
    .style("cursor", "pointer")
    .style("border-top", "2px solid #eee")
    .style("color", "#999")
    .style("font-size", "12px")
    .style("text-align", "center")
    .text("清空搜索历史")
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#f5f5f5")
            .style("color", "#FF6B35");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "white")
            .style("color", "#999");
    })
    .on("click", clearSearchHistory);

// 创建搜索历史下拉菜单
const searchHistoryDropdown = searchContainer
    .append("div")
    .style("position", "absolute")
    .style("top", "100%")
    .style("left", "0")
    .style("width", "200px")
    .style("background", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
    .style("display", "none")
    .style("z-index", "1000");

// 更新搜索事件处理
searchInput.on("input", function() {
    const searchTerm = this.value.toLowerCase();
    
    // 显示/隐藏搜索历史
    if (searchTerm === "" && searchHistory.size > 0) {
        updateSearchHistory();
        searchHistoryDropdown.style("display", "block");
    } else {
        searchHistoryDropdown.style("display", "none");
    }
    
    // 显示/隐藏清除按钮
    clearButton.style("display", searchTerm ? "block" : "none");
    
    if (!searchTerm) {
        searchCount.text("");
        resetHighlight();
        return;
    }

    let matchCount = 0;
    
    // 重置所有节点的样式
    resetHighlight();

    // 高亮匹配的节点
    node.each(function(d) {
        const isMatch = d.data.name.toLowerCase().includes(searchTerm);
        if (isMatch) {
            matchCount++;
            highlightNode(d, this);
        }
    });

    // 更新计数
    searchCount.text(matchCount ? `找到 ${matchCount} 个结果` : "无匹配结果");

    // 添加到搜索历史
    if (searchTerm && matchCount > 0) {
        searchHistory.add(searchTerm);
        if (searchHistory.size > MAX_HISTORY) {
            searchHistory.delete([...searchHistory][0]);
        }
    }
});

// 更新搜索历史显示
function updateSearchHistory() {
    searchHistoryDropdown.selectAll("div").remove();
    
    [...searchHistory].reverse().forEach(term => {
        searchHistoryDropdown
            .append("div")
            .text(term)
            .style("padding", "8px 12px")
            .style("cursor", "pointer")
            .style("transition", "background-color 0.2s")
            .style("border-bottom", "1px solid #eee")
            .on("mouseover", function() {
                d3.select(this).style("background-color", "#f5f5f5");
            })
            .on("mouseout", function() {
                d3.select(this).style("background-color", "white");
            })
            .on("click", function() {
                searchInput.node().value = term;
                searchInput.node().dispatchEvent(new Event('input'));
                searchHistoryDropdown.style("display", "none");
            });
    });
}

// 点击搜索框时显示历史记录
searchInput.on("focus", function() {
    if (this.value === "" && searchHistory.size > 0) {
        updateSearchHistory();
        searchHistoryDropdown.style("display", "block");
    }
});

// 点击其他地方时隐藏历史记录
document.addEventListener("click", function(event) {
    if (!searchContainer.node().contains(event.target)) {
        searchHistoryDropdown.style("display", "none");
    }
});

// 重置高亮的函数
function resetHighlight() {
    node.select("circle")
        .style("stroke", "#fff")
        .style("stroke-width", 2);
        
    node.select("text")
        .style("fill", d => {
            switch(d.depth) {
                case 0: return "#005F87";
                case 1: return "#333333";
                default: return "#666666";
            }
        });
}

// 高亮节点的函数
function highlightNode(d, element) {
    // 高亮节点及其路径
    let current = d;
    while (current) {
        d3.select(element).select("circle")
            .style("stroke", "#FF6B35")
            .style("stroke-width", 3);
        d3.select(element).select("text")
            .style("fill", "#FF6B35");
        current = current.parent;
    }
}

// 创建按钮容器
const buttonContainer = controlPanel
    .append("div")
    .style("display", "flex")
    .style("gap", "10px")
    .style("margin-left", "10px");

// 添加展开全部按钮
const expandAllButton = buttonContainer
    .append("button")
    .text("展开全部")
    .each(function() {
        Object.entries(buttonStyle).forEach(([key, value]) => {
            d3.select(this).style(key, value);
        });
    })
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#0078a8");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "#005F87");
    })
    .on("click", function() {
        expandAll(root);
        update(root);
    });

// 添加收起全部按钮
const collapseAllButton = buttonContainer
    .append("button")
    .text("收起全部")
    .each(function() {
        Object.entries(buttonStyle).forEach(([key, value]) => {
            d3.select(this).style(key, value);
        });
    })
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#0078a8");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "#005F87");
    })
    .on("click", function() {
        collapseAll(root);
        update(root);
    });

// 添加重置视图按钮
const resetButton = buttonContainer
    .append("button")
    .text("重置视图")
    .each(function() {
        Object.entries(buttonStyle).forEach(([key, value]) => {
            d3.select(this).style(key, value);
        });
    })
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#0078a8");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "#005F87");
    })
    .on("click", function() {
        treeContainer.select("svg")
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    });

// 展开所有节点的函数
function expandAll(d) {
    if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    if (d.children) d.children.forEach(expandAll);
}

// 收起所有节点的函数
function collapseAll(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    }
    if (d._children) d._children.forEach(collapseAll);
}

// 添加渐变效果
const defs = svg.append("defs");
const gradient = defs.append("linearGradient")
    .attr("id", "link-gradient")
    .attr("gradientUnits", "userSpaceOnUse");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#005F87");

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FF6B35");

// 添加连接线
const link = svg.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "url(#link-gradient)")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", d => {
        // 根据层级调整连接线粗细
        if (d.source.depth === 0) return 3;
        if (d.source.depth === 1) return 2;
        return 1.5;
    })
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
    .style("stroke-linecap", "round") // 添加圆角
    .style("transition", "all 0.3s ease");

// 添加节点组
const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// 添加节点圆圈和交互
const nodeCircle = node.append("g")
    .attr("cursor", "pointer");

// 添加工具提示容器
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("padding", "12px")
    .style("border-radius", "6px")
    .style("box-shadow", "0 4px 8px rgba(0,0,0,0.15)")
    .style("font-size", "13px")
    .style("line-height", "1.4")
    .style("max-width", "300px")
    .style("border-left", "4px solid #005F87")
    .style("pointer-events", "none")
    .style("transition", "opacity 0.2s");

// 添加展开/收起指示器
nodeCircle.append("text")
    .attr("class", "node-indicator")
    .attr("dy", "0.35em")
    .attr("x", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .style("opacity", d => d.children || d._children ? 1 : 0)
    .text(d => d.children ? "−" : d._children ? "+" : "");

// 添加节点圆圈
nodeCircle.append("circle")
    .attr("r", d => d.depth === 0 ? 6 : d.depth === 1 ? 5 : 4)
    .attr("fill", d => d.children ? "#005F87" : "#FF6B35")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .on("mouseover", function(event, d) {
        const nodeGroup = d3.select(this.parentNode);
        
        // 放大节点
        d3.select(this)
            .transition()
            .duration(300)
            .attr("r", d => (d.depth === 0 ? 8 : d.depth === 1 ? 7 : 6));

        // 显示工具提示
        tooltip.style("visibility", "visible")
            .html(() => {
                let content = `<strong>${d.data.name}</strong>`;
                if (d.children || d._children) {
                    const childCount = (d.children || d._children).length;
                    content += `<br/><span style="color: #666;">包含 ${childCount} 个子项</span>`;
                }
                if (d.data.name.includes("毛利")) {
                    content += `<br/><span style="color: #005F87;">关键指标</span>`;
                }
                return content;
            })
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");

        // 高亮连接线和节点
        link.style("stroke-opacity", l => {
            if (l.source === d) return 0.8;
            if (l.target === d) return 0.8;
            let current = l.source;
            while (current.parent) {
                if (current.parent === d) return 0.8;
                current = current.parent;
            }
            return 0.2;
        });
    })
    .on("mouseout", function(event, d) {
        const nodeGroup = d3.select(this.parentNode);
        
        // 恢复节点大小
        d3.select(this)
            .transition()
            .duration(300)
            .attr("r", d => d.depth === 0 ? 6 : d.depth === 1 ? 5 : 4);

        // 隐藏工具提示
        tooltip.style("visibility", "hidden");

        // 恢复连接线透明度
        link.style("stroke-opacity", 0.6);
    })
    .on("click", function(event, d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    });

// 添加文本标签
node.append("text")
    .attr("dy", "0.35em")
    .attr("x", d => d.children ? -15 : 15)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .style("font-size", d => {
        switch(d.depth) {
            case 0: return "14px";
            case 1: return "12px";
            default: return "11px";
        }
    })
    .style("font-weight", d => d.depth < 2 ? "bold" : "normal")
    .style("font-family", "Arial, sans-serif")
    .style("fill", d => {
        switch(d.depth) {
            case 0: return "#005F87";
            case 1: return "#333333";
            default: return "#666666";
        }
    })
    .text(d => d.data.name);

// 添加导出按钮
const exportContainer = buttonContainer
    .append("div")
    .style("position", "relative")
    .style("display", "inline-block");

const exportButton = exportContainer
    .append("button")
    .text("导出")
    .each(function() {
        Object.entries(buttonStyle).forEach(([key, value]) => {
            d3.select(this).style(key, value);
        });
    })
    .on("mouseover", function() {
        d3.select(this).style("background-color", "#0078a8");
        exportMenu.style("display", "block");
    })
    .on("mouseout", function() {
        d3.select(this).style("background-color", "#005F87");
    });

// 添加导出菜单
const exportMenu = exportContainer
    .append("div")
    .style("position", "absolute")
    .style("top", "100%")
    .style("right", "0")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("box-shadow", "0 2px 5px rgba(0,0,0,0.1)")
    .style("display", "none")
    .style("z-index", "1000")
    .on("mouseover", function() {
        d3.select(this).style("display", "block");
    })
    .on("mouseout", function() {
        d3.select(this).style("display", "none");
    });

// 添加导出选项
["SVG", "PNG"].forEach(format => {
    exportMenu.append("div")
        .text(`导出${format}`)
        .style("padding", "8px 16px")
        .style("cursor", "pointer")
        .style("transition", "background-color 0.2s")
        .style("white-space", "nowrap")
        .on("mouseover", function() {
            d3.select(this).style("background-color", "#f5f5f5");
        })
        .on("mouseout", function() {
            d3.select(this).style("background-color", "white");
        })
        .on("click", () => exportChart(format));
});

// 导出功能
function exportChart(format) {
    const svgNode = treeContainer.select("svg").node();
    const svgData = new XMLSerializer().serializeToString(svgNode);
    
    if (format === "SVG") {
        // 导出SVG
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "cost-structure.svg";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } else if (format === "PNG") {
        // 导出PNG
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = new Image();
        
        // 设置画布尺寸
        canvas.width = width;
        canvas.height = height;
        
        img.onload = () => {
            context.drawImage(img, 0, 0);
            const link = document.createElement("a");
            link.download = "cost-structure.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(event) {
    // Esc 键重置视图
    if (event.key === 'Escape') {
        treeContainer.select("svg")
            .transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    }
    
    // Ctrl/Cmd + E 展开全部
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        expandAll(root);
        update(root);
    }
    
    // Ctrl/Cmd + C 收起全部
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        collapseAll(root);
        update(root);
    }

    // Ctrl/Cmd + F 聚焦搜索框
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        searchInput.node().focus();
    }
});

// 添加移动端手势支持
let touchStartX = 0;
let touchStartY = 0;
const touchThreshold = 50; // 触发阈值

treeContainer.select("svg")
    .on("touchstart", function(event) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    })
    .on("touchmove", function(event) {
        if (event.touches.length > 1) {
            // 双指缩放由浏览器原生处理
            return;
        }
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // 如果移动距离超过阈值，阻止事件冒泡以防止页面滚动
        if (Math.abs(deltaX) > touchThreshold || Math.abs(deltaY) > touchThreshold) {
            event.preventDefault();
        }
    });

// 优化移动端点击
nodeCircle.select("circle")
    .on("touchend", function(event, d) {
        event.preventDefault();
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    });

// 添加响应式布局支持
function updateLayout() {
    const containerWidth = treeContainer.node().getBoundingClientRect().width;
    const containerHeight = window.innerHeight * 0.8;
    
    // 调整SVG视图框大小
    treeContainer.select("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-height", containerHeight + "px");

    // 调整控制面板布局
    if (containerWidth < 768) { // 移动端布局
        controlPanel
            .style("position", "relative")
            .style("top", "0")
            .style("right", "0")
            .style("flex-direction", "column")
            .style("margin-bottom", "10px");
        
        searchContainer
            .style("margin-bottom", "10px")
            .style("width", "100%");
        
        buttonContainer
            .style("margin-left", "0")
            .style("width", "100%")
            .style("justify-content", "space-between");
    } else { // 桌面端布局
        controlPanel
            .style("position", "absolute")
            .style("top", "20px")
            .style("right", "20px")
            .style("flex-direction", "row");
        
        searchContainer
            .style("margin-bottom", "0")
            .style("width", "auto");
        
        buttonContainer
            .style("margin-left", "10px")
            .style("width", "auto")
            .style("justify-content", "flex-start");
    }
}

// 监听窗口大小变化
window.addEventListener('resize', updateLayout);

// 初始化布局
updateLayout();

// 初始化缩放
treeContainer.select("svg")
    .call(zoom)
    .on("dblclick.zoom", null);

// 更新树状图的函数
function update(source) {
    // 重新计算树的布局
    tree(root);
    const duration = 500;

    // 更新节点位置
    const nodeUpdate = node
        .transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .style("opacity", d => {
            let current = d;
            while (current.parent) {
                if (!current.parent.children) {
                    return 0;
                }
                current = current.parent;
            }
            return 1;
        });

    // 更新连接线
    const linkUpdate = link
        .transition()
        .duration(duration)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .style("opacity", d => {
            let current = d.target;
            while (current.parent) {
                if (!current.parent.children) {
                    return 0;
                }
                current = current.parent;
            }
            return 0.6;
        });

    // 更新节点圆圈
    nodeUpdate.select("circle")
        .attr("r", d => d.depth === 0 ? 6 : d.depth === 1 ? 5 : 4)
        .attr("fill", d => d.children ? "#005F87" : "#FF6B35");

    // 更新展开/收起指示器
    nodeUpdate.select(".node-indicator")
        .style("opacity", d => d.children || d._children ? 1 : 0)
        .text(d => d.children ? "−" : d._children ? "+" : "");

    // 更新文本标签
    nodeUpdate.select("text")
        .attr("x", d => d.children ? -15 : 15)
        .attr("text-anchor", d => d.children ? "end" : "start");
}
