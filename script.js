// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 检查配置文件是否正确加载
    if (typeof VEHICLE_CONFIG === 'undefined' || typeof EVALUATION_SCORES === 'undefined') {
        console.error('配置文件未正确加载！');
        alert('配置文件加载失败，请检查网络连接或刷新页面');
        return;
    } else {
        console.log('配置文件已成功加载');
    }
    
    // 更新当前时间
    updateDateTime();
    setInterval(updateDateTime, 1000); // 每秒更新一次时间
    
    // 页面切换功能
    initNavigation();
    
    // 初始化滑动条的值显示
    initSliders();
    
    // 初始化车型信息
    initVehicleInfo();
    
    // 初始化评价结果分值
    initEvaluationScores();
    
    // 初始化结果分析配置显示
    updateAnalysisConfig();
    
    // 初始化灵敏度分析选项
    initSensitivityOptions();
    
    // 确定按钮点击事件
    document.getElementById('submit-btn').addEventListener('click', function() {
        calculateResults();
    });
    
    // 导入数据按钮点击事件
    document.getElementById('import-data').addEventListener('click', function() {
        importData();
    });
    
    // 初始化数据管理页面
    initDataManagement();
    
    // 初始化高德地图
    const map = initMap();
    initPanels();
    
    // 初始化城市选择器
    initCitySelector();
    
    console.log('初始化完成');
});

/**
 * 更新时间显示
 */
function updateDateTime() {
    const now = new Date();
    const dateStr = now.getFullYear() + '年' + 
                   (now.getMonth() + 1) + '月' + 
                   now.getDate() + '日 ' + 
                   now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0')+':'+now.getSeconds().toString().padStart(2, '0');
    document.getElementById('datetime').textContent = dateStr;
}

/**
 * 初始化导航按钮的点击事件
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 取消所有按钮的激活状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的激活状态
            this.classList.add('active');
            
            // 隐藏所有页面
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none'; // 显式设置display属性为none
            });
            
            // 显示对应的页面
            const pageId = this.id.replace('btn-', 'page-');
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.display = 'block'; // 显式设置display属性为block
                console.log(`切换到页面: ${pageId}`);
            }
        });
    });
    
    // 初始化时，确保默认页面显示正确
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        const activePageId = activeBtn.id.replace('btn-', 'page-');
        const activePage = document.getElementById(activePageId);
        
        // 隐藏所有非活动页面
        pages.forEach(page => {
            if (page.id !== activePageId) {
                page.style.display = 'none';
            } else {
                page.style.display = 'block';
            }
        });
    }
}

/**
 * 初始化所有滑动条的值显示
 */
function initSliders() {
    // 外部因素滑动条
    initSlider('peak-demand-ratio', 'peak-demand-value');
    
    // FRT配置滑动条
    initSlider('frt-fleet-size', 'frt-fleet-value');
    initSlider('frt-departure-interval', 'frt-interval-value');
    
    // RbDRT配置滑动条
    initSlider('rbdrt-fleet-size', 'rbdrt-fleet-value');
    initSlider('rbdrt-departure-interval', 'rbdrt-interval-value');
    initSlider('rbdrt-deviation-range', 'rbdrt-deviation-value');
    initSlider('rbdrt-relax-time', 'rbdrt-relax-value');
    
    // 智慧车列配置滑动条
    initSlider('smart-fleet-size', 'smart-fleet-value');
    initSlider('smart-departure-interval', 'smart-interval-value');
    initSlider('smart-deviation-range', 'smart-deviation-value');
    initSlider('smart-relax-time', 'smart-relax-value');
}

/**
 * 初始化单个滑动条的值显示和事件
 * @param {string} sliderId - 滑动条元素的ID
 * @param {string} valueId - 显示值的元素ID
 */
function initSlider(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (slider && valueDisplay) {
        // 初始化显示
        valueDisplay.textContent = slider.value;
        
        // 监听滑动事件
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

/**
 * 初始化车型信息
 */
function initVehicleInfo() {
    // 检查配置文件是否存在
    if (typeof VEHICLE_CONFIG === 'undefined') {
        console.error('车型配置信息不存在');
        return;
    }
    
    console.log('初始化车型信息...');
    
    // 更新FRT车型信息
    updateVehicleInfo('frt');
    
    // 更新RbDRT车型信息
    updateVehicleInfo('rbdrt');
}

/**
 * 更新特定模式的车型信息
 * @param {string} mode - 模式名称 (frt/rbdrt)
 */
function updateVehicleInfo(mode) {
    if (!VEHICLE_CONFIG[mode]) {
        console.error(`找不到模式 ${mode} 的车型配置`);
        return;
    }
    
    console.log(`更新 ${mode} 模式的车型信息...`);
    
    // 获取车型选项容器
    const container = document.getElementById(`${mode}-vehicles`);
    if (!container) {
        console.error(`找不到 ${mode} 模式的车型选项容器`);
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 获取对应模式的车型配置
    const vehicles = VEHICLE_CONFIG[mode];
    
    // 重新创建车型选项
    vehicles.forEach(vehicle => {
        console.log(`处理车型: ${vehicle.id}, 名称: ${vehicle.name}`);
        
        // 创建车型选项容器
        const vehicleOption = document.createElement('div');
        vehicleOption.className = 'vehicle-option';
        
        // 创建单选框
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = vehicle.id;
        radio.name = `${mode}-vehicle`;
        radio.value = vehicle.id;
        
        // 创建标签
        const label = document.createElement('label');
        label.htmlFor = vehicle.id;
        label.textContent = vehicle.name;
        label.title = `${vehicle.type} - 载客量: ${vehicle.capacity}人 - ${vehicle.isElectric ? '电动' : '燃油'}`;
        
        // 创建图片
        const img = document.createElement('img');
        img.className = 'vehicle-img';
        img.src = vehicle.image;
        img.alt = vehicle.name;
        
        // 按照单选框-名称-图片的顺序添加到容器
        vehicleOption.appendChild(radio);
        vehicleOption.appendChild(label);
        vehicleOption.appendChild(img);
        
        // 添加到主容器
        container.appendChild(vehicleOption);
    });
    
    // 默认选中第一个选项
    const firstRadio = container.querySelector('input[type="radio"]');
    if (firstRadio) {
        firstRadio.checked = true;
    }
}

/**
 * 初始化评价结果分值
 */
function initEvaluationScores() {
    // 检查配置文件是否存在
    if (typeof EVALUATION_SCORES === 'undefined') {
        console.error('评价结果分值配置信息不存在');
        return;
    }
    
    console.log('初始化评价结果分值...');
    
    // 设置FRT分值
    setModeScores('frt');
    
    // 设置RbDRT分值
    setModeScores('rbdrt');
    
    // 设置智慧车列分值
    setModeScores('smart');
    
    // 延迟设置所有分值的显示位置
    setTimeout(() => {
        console.log('调整所有分值显示位置...');
        document.querySelectorAll('.bar').forEach(bar => {
            if (!bar.id) return;
            
            const valueDisplay = bar.parentElement.querySelector('.value-display');
            if (valueDisplay) {
                // 获取当前宽度百分比
                const widthStyle = bar.style.width;
                const percentage = parseFloat(widthStyle);
                
                if (!isNaN(percentage)) {
                    console.log(`初始化${bar.id}的值显示位置: ${percentage}%`);
                    if (percentage > 90) {
                        valueDisplay.style.left = `calc(${percentage}% - 40px)`;
                        valueDisplay.style.color = '#FFFFFF';
                    } else {
                        valueDisplay.style.left = `${percentage}%`;
                        valueDisplay.style.transform = 'translateX(5px)';
                        valueDisplay.style.color = 'rgba(150, 220, 255, 0.9)';
                    }
                }
            }
        });
    }, 500);
}

/**
 * 设置特定模式的分值
 * @param {string} mode - 模式名称 (frt/rbdrt/smart)
 */
function setModeScores(mode) {
    if (!EVALUATION_SCORES[mode]) return;
    
    const scores = EVALUATION_SCORES[mode];
    console.log(`设置${mode}模式的分值...`);
    
    // 使用animateBar函数设置各项分值
    // 公司效益
    animateBar(`${mode}-company-benefit`, scores.company);
    
    // 乘客效益
    animateBar(`${mode}-passenger-benefit`, scores.passenger);
    
    // 环境效益
    animateBar(`${mode}-environment-benefit`, scores.environment);
    
    // 综合效益
    animateBar(`${mode}-comprehensive-benefit`, scores.comprehensive);
}

/**
 * 更新结果分析配置显示
 */
function updateAnalysisConfig() {
    // 检查配置文件是否存在
    if (typeof ANALYSIS_TEXT === 'undefined' || typeof EVALUATION_SCORES === 'undefined') {
        console.error('结果分析配置信息不存在');
        return;
    }
    
    // 获取综合得分
    const frtScore = EVALUATION_SCORES.frt.comprehensive.toFixed(2);
    const rbdrtScore = EVALUATION_SCORES.rbdrt.comprehensive.toFixed(2);
    const smartScore = EVALUATION_SCORES.smart.comprehensive.toFixed(2);
    
    // 更新分析标题
    const titleElement = document.getElementById('analysis-title');
    if (titleElement) {
        titleElement.textContent = ANALYSIS_TEXT.title || '根据提供的效益得分表，以下是针对FRT、RbDRT和智慧车列三种交通模式的综合分析：';
    }
    
    // 更新配置值
    const scoresElement = document.getElementById('analysis-scores');
    // if (scoresElement) {
    //     scoresElement.innerHTML = `
    //         <span>FRT: ${frtScore}</span>
    //         <span>RdDRT: ${rbdrtScore}</span>
    //         <span>智慧车列: ${smartScore}</span>
    //     `;
    // }
    
    // 更新分析内容
    updateAnalysisText();
}

/**
 * 计算和更新评价结果
 */
function calculateResults() {
    console.log('开始计算评价结果...');
    
    // 读取用户输入的参数
    const routeLength = parseFloat(document.getElementById('route-length').value) || 0;
    const stationCount = parseInt(document.getElementById('station-count').value) || 0;
    const nonLinearCoef = parseFloat(document.getElementById('non-linear-coef').value) || 0;
    const passengerDemand = parseFloat(document.getElementById('passenger-demand').value) || 0;
    const peakDemandRatio = parseFloat(document.getElementById('peak-demand-ratio').value) || 0;
    const spatialDemandVar = parseFloat(document.getElementById('spatial-demand-var').value) || 0;
    
    // FRT配置
    const frtFleetSize = parseInt(document.getElementById('frt-fleet-size').value) || 0;
    const frtVehicle = document.querySelector('input[name="frt-vehicle"]:checked').id;
    const frtInterval = parseInt(document.getElementById('frt-departure-interval').value) || 0;
    
    // RbDRT配置
    const rbdrtFleetSize = parseInt(document.getElementById('rbdrt-fleet-size').value) || 0;
    const rbdrtVehicle = document.querySelector('input[name="rbdrt-vehicle"]:checked').id;
    const rbdrtInterval = parseInt(document.getElementById('rbdrt-departure-interval').value) || 0;
    const rbdrtDeviation = parseFloat(document.getElementById('rbdrt-deviation-range').value) || 0;
    const rbdrtRelaxTime = parseInt(document.getElementById('rbdrt-relax-time').value) || 0;
    
    // 智慧车列配置
    const smartFleetSize = parseInt(document.getElementById('smart-fleet-size').value) || 0;
    const smartInterval = parseInt(document.getElementById('smart-departure-interval').value) || 0;
    const smartDeviation = parseFloat(document.getElementById('smart-deviation-range').value) || 0;
    const smartRelaxTime = parseInt(document.getElementById('smart-relax-time').value) || 0;
    
    console.log('参数读取完成，开始计算...');
    
    // 在实际应用中，应根据以上参数进行计算
    // 这里简化处理，使用配置文件中的分值或进行一些简单计算
    
    // 计算乘客效益（示例：根据间隔和车型调整值）
    const passengerFactor = 100 - (Math.min(frtInterval, rbdrtInterval, smartInterval) / 120 * 30);
    
    // 计算公司效益（示例：根据车队规模和间隔调整值）
    const companyFactor = 100 - ((frtFleetSize + rbdrtFleetSize + smartFleetSize) / 220 * 40);
    
    // 计算环境效益（示例：根据可偏范围调整值）
    const environmentFactor = Math.max(rbdrtDeviation, smartDeviation) / 10 * 40 + 60;
    
    // 计算结果可以用于微调配置中的基础分值
    const frtPassengerScore = EVALUATION_SCORES.frt.passenger * (1 + (passengerFactor - 85) / 200);
    const rbdrtPassengerScore = EVALUATION_SCORES.rbdrt.passenger * (1 + (passengerFactor - 85) / 200);
    const smartPassengerScore = EVALUATION_SCORES.smart.passenger * (1 + (passengerFactor - 85) / 200);
    
    console.log('计算完成，开始更新评价结果...');
    
    // 更新分数显示（使用动画效果）
    animateBar('frt-passenger-benefit', Math.min(1, Math.max(0, frtPassengerScore)));
    animateBar('frt-company-benefit', EVALUATION_SCORES.frt.company);
    animateBar('frt-environment-benefit', EVALUATION_SCORES.frt.environment);
    animateBar('frt-comprehensive-benefit', EVALUATION_SCORES.frt.comprehensive);
    
    animateBar('rbdrt-passenger-benefit', Math.min(1, Math.max(0, rbdrtPassengerScore)));
    animateBar('rbdrt-company-benefit', EVALUATION_SCORES.rbdrt.company);
    animateBar('rbdrt-environment-benefit', EVALUATION_SCORES.rbdrt.environment);
    animateBar('rbdrt-comprehensive-benefit', EVALUATION_SCORES.rbdrt.comprehensive);
    
    animateBar('smart-passenger-benefit', Math.min(1, Math.max(0, smartPassengerScore)));
    animateBar('smart-company-benefit', EVALUATION_SCORES.smart.company);
    animateBar('smart-environment-benefit', EVALUATION_SCORES.smart.environment);
    animateBar('smart-comprehensive-benefit', EVALUATION_SCORES.smart.comprehensive);
    
    // 确保所有图表的值显示正确
    setTimeout(() => {
        console.log('动画完成，确保所有图表的值显示正确位置...');
        // 确保所有分值显示在正确位置
        document.querySelectorAll('.bar').forEach(bar => {
            if (!bar.id) return;
            
            console.log(`处理图表: ${bar.id}, 宽度: ${bar.style.width}`);
            const valueDisplay = bar.parentElement.querySelector('.value-display');
            if (valueDisplay) {
                // 解析当前宽度百分比
                const widthStr = bar.style.width;
                const percentage = parseFloat(widthStr);
                
                if (!isNaN(percentage)) {
                    console.log(`- 设置${bar.id}的值显示位置，百分比: ${percentage}%`);
                    if (percentage > 90) {
                        valueDisplay.style.left = `calc(${percentage}% - 40px)`;
                        valueDisplay.style.color = '#FFFFFF';
                    } else {
                        valueDisplay.style.left = `${percentage}%`;
                        valueDisplay.style.transform = 'translateX(5px)';
                        valueDisplay.style.color = 'rgba(150, 220, 255, 0.9)';
                    }
                }
            }
        });
    }, 600);
    
    // 更新结果分析文本
    updateAnalysisText(routeLength, passengerDemand, peakDemandRatio);
    
    // 更新结果分析配置显示
    updateAnalysisConfig();
    
    console.log('评价结果计算和更新完成');
}

/**
 * 更新结果分析文本
 * @param {number} [routeLength] - 线路长度
 * @param {number} [passengerDemand] - 客流需求
 * @param {number} [peakRatio] - 高峰需求比重
 */
function updateAnalysisText(routeLength, passengerDemand, peakRatio) {
    // 检查配置文件是否存在
    if (typeof ANALYSIS_TEXT === 'undefined') {
        console.error('结果分析文案配置信息不存在');
        return;
    }

    // 从配置文件中获取基础文本
    let socialText = ANALYSIS_TEXT.social || '';
    let economicText = ANALYSIS_TEXT.economic || '';
    let rbdrtText = ANALYSIS_TEXT.rbdrt || '';
    let summaryText = ANALYSIS_TEXT.summary || '';
    
    // 如果提供了参数，则基于参数动态调整分析文本
    if (routeLength !== undefined && passengerDemand !== undefined && peakRatio !== undefined) {
        // 添加基于参数的具体化建议
        if (passengerDemand > 100) {
            socialText = socialText.replace('选择智慧车列', '选择<span class="highlight">智慧车列</span>');
        }
        
        if (peakRatio > 0.7) {
            economicText = economicText.replace('选择FRT', '选择<span class="highlight">FRT</span>');
            summaryText = '数据表明，在高峰比重达到' + (peakRatio * 100).toFixed(0) + '%的情况下，智慧车列代表未来趋势，但需解决成本问题；FRT是当前务实选择。';
        }
        
        if (routeLength > 20) {
            rbdrtText = '针对' + routeLength.toFixed(1) + 'km的长线路，<span class="highlight">RdDRT</span>：建议覆盖推广，需重新评估模式设计或定位，并考虑分段运营。';
        }
    }
    
    // 更新DOM
    const socialAnalysisElement = document.getElementById('social-analysis');
    if (socialAnalysisElement) {
        socialAnalysisElement.innerHTML = socialText;
    }
    
    const economicAnalysisElement = document.getElementById('economic-analysis');
    if (economicAnalysisElement) {
        economicAnalysisElement.innerHTML = economicText;
    }
    
    const rbdrtAnalysisElement = document.getElementById('rbdrt-analysis');
    if (rbdrtAnalysisElement) {
        rbdrtAnalysisElement.innerHTML = rbdrtText;
    }
    
    const summaryAnalysisElement = document.getElementById('summary-analysis');
    if (summaryAnalysisElement) {
        summaryAnalysisElement.innerHTML = summaryText;
    }
}

/**
 * 更新灵敏度分析图片
 * @param {string} option - 选中的选项值
 */
function updateSensitivityImage(option) {
    // 检查配置文件是否存在
    if (typeof SENSITIVITY_DATA === 'undefined') {
        console.error('灵敏度分析数据配置不存在');
        return;
    }
    
    console.log(`尝试加载灵敏度分析数据，选项: ${option}`);
    
    // 获取容器
    const sensitivityImageContainer = document.querySelector('.sensitivity-image');
    if (!sensitivityImageContainer) {
        console.error('找不到灵敏度分析图像容器');
        return;
    }
    
    // 清空原有内容
    sensitivityImageContainer.innerHTML = '';
    
    // 检查是否有对应选项的数据配置
    if (SENSITIVITY_DATA[option]) {
        console.log(`找到选项 ${option} 的数据`);
        
        // 创建SVG容器
        const chartContainer = document.createElement('div');
        chartContainer.className = 'sensitivity-chart';
        sensitivityImageContainer.appendChild(chartContainer);
        
        // 绘制折线图
        drawLineChart(chartContainer, SENSITIVITY_DATA[option], option);
    } else {
        // 如果没有数据，显示错误信息
        console.error(`未找到选项 ${option} 对应的灵敏度分析数据`);
        sensitivityImageContainer.innerHTML = `<div class="error-message">未找到对应分析数据: ${option}<br>请检查配置文件中的数据设置</div>`;
    }
}

/**
 * 绘制折线图
 * @param {HTMLElement} container - 图表容器元素
 * @param {Array} data - 图表数据
 * @param {string} title - 图表标题
 */
function drawLineChart(container, data, title) {
    console.log('开始绘制折线图');
    
    // 设置图表尺寸和边距
    const margin = {top: 30, right: 30, bottom: 50, left: 50};
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建SVG元素
    const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // 准备数据
    // 将数据按group分组
    const groupedData = d3.group(data, d => d[2]);
    
    // 获取X轴的值域
    const xExtent = d3.extent(data, d => d[0]);
    
    // 获取Y轴的值域
    const yExtent = d3.extent(data, d => d[1]);
    const yMin = Math.floor(yExtent[0] * 10) / 10; // 四舍五入到最近的0.1
    const yMax = Math.ceil(yExtent[1] * 10) / 10;
    
    // 创建X轴比例尺
    const x = d3.scaleLinear()
        .domain(xExtent)
        .range([0, width]);
    
    // 创建Y轴比例尺
    const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);
    
    // 添加X轴网格线
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .ticks(10)
            .tickSize(-height)
            .tickFormat('')
        );
    
    // 添加Y轴网格线
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat('')
        );
    
    // 添加X轴
    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10));
    
    // 添加X轴标签
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 35)
        .style('text-anchor', 'middle')
        .style('fill', 'rgba(150, 220, 255, 0.8)')
        .text('value1');
    
    // 添加Y轴
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(y).ticks(10));
    
    // 添加Y轴标签
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -35)
        .style('text-anchor', 'middle')
        .style('fill', 'rgba(150, 220, 255, 0.8)')
        .text('value2');
    
    // 定义折线生成器
    const line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .curve(d3.curveMonotoneX); // 使用单调曲线使线条更平滑
    
    // 绘制每个组的折线
    const groups = ['RdDRT', 'FRT', '智慧车列'];
    const colors = {
        'RdDRT': '#0033cc',
        'FRT': '#4da6ff',
        '智慧车列': '#00ccff'
    };
    
    const classNames = {
        'RdDRT': 'rbdrt',
        'FRT': 'frt',
        '智慧车列': 'smart'
    };
    
    // 绘制折线
    groups.forEach(group => {
        const groupData = [...groupedData.get(group) || []].sort((a, b) => a[0] - b[0]);
        
        if (groupData.length > 0) {
            // 绘制线条
            svg.append('path')
                .datum(groupData)
                .attr('class', `line ${classNames[group]}`)
                .attr('d', line);
            
            // 绘制数据点
            svg.selectAll(`.dot-${classNames[group]}`)
                .data(groupData)
                .enter()
                .append('circle')
                .attr('class', `dot ${classNames[group]}`)
                .attr('cx', d => x(d[0]))
                .attr('cy', d => y(d[1]))
                .attr('r', 3);
        }
    });
    
    // 添加图表标题
    svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -10)
        .text(`${title}灵敏度分析`);
    
    // 添加图例 - 修改了图例的位置，将其向下移动
    const legend = svg.append('g')
        .attr('class', 'chart-legend')
        .attr('transform', `translate(${width/2 - 90}, ${height + 42})`); // 修改y轴位置从35到42，并水平居中
    
    groups.forEach((group, i) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(${i * 60}, 0)`);
        
        legendItem.append('line')
            .attr('class', `chart-legend-item-color ${classNames[group]}`)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 15)
            .attr('y2', 0)
            .style('stroke', colors[group])
            .style('stroke-width', 2)
            .style('stroke-dasharray', group === 'FRT' ? '4,2' : null);
        
        legendItem.append('text')
            .attr('class', 'chart-legend-item-text')
            .attr('x', 20)
            .attr('y', 4)
            .style('fill', 'rgba(150, 220, 255, 0.8)')
            .text(group);
    });
    
    console.log('折线图绘制完成');
}

/**
 * 导入数据功能
 */
function importData() {
    // 这里仅做示例，实际应用中可以通过文件上传或API获取数据
    alert('数据导入功能已触发，实际应用中可实现文件上传或API数据获取');
}

/**
 * 设置柱状图的宽度并添加动画效果
 * @param {string} elementId - 柱状图元素的ID
 * @param {number} percentage - 百分比值(0-100)或小数值(0-1)
 */
function animateBar(elementId, percentage) {
    const bar = document.getElementById(elementId);
    if (bar) {
        // 获取数值显示元素
        const valueDisplay = bar.parentElement.querySelector('.value-display');
        
        // 判断是百分比还是小数值
        const isDecimal = percentage <= 1;
        const displayPercentage = isDecimal ? percentage * 100 : percentage;
        const displayValue = isDecimal ? percentage.toFixed(2) : (percentage / 100).toFixed(2);
        
        // 重置宽度
        bar.style.width = '0%';
        
        // 动画显示
        setTimeout(() => {
            // 设置光条宽度
            bar.style.width = `${displayPercentage}%`;
            
            if (valueDisplay) {
                // 设置显示值
                valueDisplay.textContent = displayValue;
                
                // 重置所有定位样式
                valueDisplay.style.right = 'auto';
                valueDisplay.style.left = 'auto';
                
                // 根据光条宽度确定值的显示位置
                if (displayPercentage > 90) {
                    // 如果光条很长，将值显示在光条内部末端
                    valueDisplay.style.left = `calc(${displayPercentage}% - 40px)`;
                    valueDisplay.style.color = '#FFFFFF';
                } else {
                    // 否则显示在光条外部右侧
                    valueDisplay.style.left = `${displayPercentage}%`;
                    valueDisplay.style.transform = 'translateX(5px)';
                    valueDisplay.style.color = 'rgba(150, 220, 255, 0.9)';
                }
            }
        }, 100);
    }
}

/**
 * 初始化数据管理页面
 */
function initDataManagement() {
    // 检查是否有道路数据配置
    if (typeof ROAD_IMPORTANCE_RANKING === 'undefined' || typeof ROAD_DETAIL_DATA === 'undefined') {
        console.error('道路数据配置不存在');
        return;
    }
    
    console.log('初始化数据管理页面...');
    
    // 渲染左侧排行榜
    renderRoadRanking();
    
    // 渲染右侧道路详情
    renderRoadDetails();
    
    // 添加窗口大小改变事件监听
    window.addEventListener('resize', function() {
        // 重新渲染以适应新的窗口大小
        renderRoadRanking();
        renderRoadDetails();
    });
}

/**
 * 渲染左侧道路重要性排行榜
 */
function renderRoadRanking() {
    const container = document.getElementById('ranking-items-container');
    if (!container) {
        console.error('找不到排行榜容器元素');
        return;
    }
    
    console.log('渲染道路重要性排行榜...');
    
    // 检查现有条目，如果已存在则只更新位置而不重新创建
    if (container.children.length === ROAD_IMPORTANCE_RANKING.length) {
        // 只更新现有条目的位置
        Array.from(container.children).forEach((rankItem, index) => {
            const item = ROAD_IMPORTANCE_RANKING[index];
            const bar = rankItem.querySelector('.rank-bar');
            const valueDisplay = rankItem.querySelector('.rank-value');
            
            if (bar && valueDisplay) {
                // 计算百分比
                const percentage = item.value * 100;
                
                // 更新百分比并调整分值位置
                setTimeout(() => {
                    // 根据百分比调整分值位置
                    if (percentage > 90) {
                        valueDisplay.style.left = `calc(${percentage}% - 45px)`;
                        valueDisplay.style.color = '#FFFFFF';
                    } else {
                        valueDisplay.style.left = `${percentage}%`;
                        valueDisplay.style.transform = 'translateX(5px)';
                        valueDisplay.style.color = 'rgba(150, 220, 255, 0.9)';
                    }
                }, 10);
            }
        });
        
        return; // 已更新现有条目，无需重新创建
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 渲染每一个排名项
    ROAD_IMPORTANCE_RANKING.forEach((item, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'ranking-item';
        
        // 创建HTML结构
        rankItem.innerHTML = `
            <div class="road-name">${item.name}</div>
            <div class="rank-bar-container">
                <div class="rank-bar" style="width: 0%"></div>
                <div class="rank-value">${item.value.toFixed(2)}</div>
            </div>
        `;
        
        container.appendChild(rankItem);
        
        // 添加动画效果
        setTimeout(() => {
            const bar = rankItem.querySelector('.rank-bar');
            const valueDisplay = rankItem.querySelector('.rank-value');
            if (bar && valueDisplay) {
                // 设置光条宽度
                const percentage = item.value * 100;
                bar.style.width = `${percentage}%`;
                
                // 根据百分比调整分值位置
                if (percentage > 90) {
                    valueDisplay.style.left = `calc(${percentage}% - 45px)`;
                    valueDisplay.style.color = '#FFFFFF';
                } else {
                    valueDisplay.style.left = `${percentage}%`;
                    valueDisplay.style.transform = 'translateX(5px)';
                    valueDisplay.style.color = 'rgba(150, 220, 255, 0.9)';
                }
            }
        }, 100 + index * 50); // 依次延迟显示
    });
}

/**
 * 渲染右侧道路详情
 */
function renderRoadDetails() {
    const container = document.getElementById('road-details-container');
    if (!container) {
        console.error('找不到道路详情容器元素');
        return;
    }
    
    console.log('渲染道路详情...');
    
    // 清空容器
    container.innerHTML = '';
    
    // 获取所有道路名称
    const roadNames = Object.keys(ROAD_DETAIL_DATA);
    
    // 渲染每个道路卡片
    roadNames.forEach((roadName, index) => {
        const roadData = ROAD_DETAIL_DATA[roadName];
        
        // 创建道路卡片元素
        const roadCard = document.createElement('div');
        roadCard.className = 'road-detail-card';
        
        // 构建基本HTML结构
        roadCard.innerHTML = `
            <div class="road-card-header">
                <div class="road-card-title">${roadName}</div>
                <div class="detail-btn">详情 >></div>
            </div>
            <div class="chart-container">
                <div class="y-axis"></div>
                <div class="road-chart">
                    <div class="chart-grid"></div>
                    <div class="chart-columns-container"></div>
                </div>
            </div>
            <div class="chart-labels-container"></div>
        `;
        
        // 添加卡片到容器
        container.appendChild(roadCard);
        
        // 获取图表容器
        const chartContainer = roadCard.querySelector('.chart-container');
        // 设置样式确保Y轴与图表区域正确对齐
        chartContainer.style.position = 'relative';
        chartContainer.style.minHeight = '200px';
        chartContainer.style.margin = '10px 0 0 0';
        chartContainer.style.display = 'flex';
        
        // 获取Y轴容器
        const yAxis = roadCard.querySelector('.y-axis');
        // 设置Y轴样式
        yAxis.style.width = '30px';
        yAxis.style.position = 'relative';
        yAxis.style.flexShrink = '0';
        
        // 获取道路图表容器
        const roadChart = roadCard.querySelector('.road-chart');
        // 设置道路图表样式
        roadChart.style.flex = '1';
        roadChart.style.position = 'relative';
        roadChart.style.height = '200px'; // 固定高度以确保网格线定位准确
        
        // 获取网格线容器
        const chartGrid = roadCard.querySelector('.chart-grid');
        // 设置网格线容器样式
        chartGrid.style.position = 'absolute';
        chartGrid.style.left = '0';
        chartGrid.style.right = '0';
        chartGrid.style.top = '0';
        chartGrid.style.bottom = '0';
        chartGrid.style.width = '100%';
        chartGrid.style.height = '100%';
        chartGrid.style.zIndex = '1';
        
        // 获取柱状图容器
        const columnsContainer = roadCard.querySelector('.chart-columns-container');
        // 设置柱状图容器样式
        columnsContainer.style.position = 'absolute';
        columnsContainer.style.left = '0';
        columnsContainer.style.right = '0';
        columnsContainer.style.bottom = '0';
        columnsContainer.style.top = '0';
        columnsContainer.style.width = '100%';
        columnsContainer.style.height = '100%';
        columnsContainer.style.display = 'flex';
        columnsContainer.style.justifyContent = 'space-around';
        columnsContainer.style.alignItems = 'flex-end';
        columnsContainer.style.zIndex = '2';
        
        // 获取标签容器
        const labelsContainer = roadCard.querySelector('.chart-labels-container');
        // 设置标签容器样式
        labelsContainer.style.display = 'flex';
        labelsContainer.style.justifyContent = 'space-around';
        labelsContainer.style.padding = '10px 0';
        labelsContainer.style.marginTop = '5px';
        labelsContainer.style.width = '100%'; // 确保宽度与图表容器一致
        // 确保标签容器的尺寸和柱状图容器匹配
        labelsContainer.style.boxSizing = 'border-box';
        
        // 生成Y轴标签 - 从0到1，每隔0.1一个
        for (let i = 0; i <= 10; i++) {
            const value = i / 10;
            
            // 创建Y轴标签
            const label = document.createElement('div');
            label.className = 'y-axis-label';
            label.style.position = 'absolute';
            label.style.right = '5px';
            label.style.bottom = `${value * 100}%`; // 关键是这里，确保与实际数值对应
            label.style.transform = 'translateY(50%)';
            label.style.fontSize = '12px';
            label.style.color = 'rgba(150, 220, 255, 0.7)';
            label.style.zIndex = '5';
            label.textContent = value.toFixed(1);
            
            // 添加到Y轴容器
            yAxis.appendChild(label);
            
            // 创建对应的网格线
            const gridLine = document.createElement('div');
            gridLine.className = 'grid-line';
            gridLine.style.position = 'absolute';
            gridLine.style.left = '0';
            gridLine.style.right = '0';
            gridLine.style.height = '1px';
            gridLine.style.bottom = `${value * 100}%`; // 保持与Y轴标签的位置一致
            gridLine.style.backgroundColor = 'rgba(100, 180, 255, 0.2)';
            
            // 添加到网格线容器
            chartGrid.appendChild(gridLine);
        }
        
        // 创建柱状图列
        const modes = [
            { name: 'FRT', value: roadData.frt, className: 'frt' },
            { name: 'RdDRT', value: roadData.rbdrt, className: 'rbdrt' },
            { name: '智慧车列', value: roadData.smart, className: 'smart' }
        ];
        
        modes.forEach(mode => {
            // 创建列容器
            const column = document.createElement('div');
            column.className = 'chart-column';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.alignItems = 'center';
            column.style.justifyContent = 'flex-end';
            column.style.height = '100%';
            column.style.position = 'relative';
            column.style.margin = '0 10px';
            
            // 创建数值显示
            const valueEl = document.createElement('div');
            valueEl.className = 'column-value';
            valueEl.style.position = 'relative';
            valueEl.style.marginBottom = '5px';
            valueEl.style.fontSize = '12px';
            valueEl.style.fontWeight = 'bold';
            valueEl.style.color = 'rgba(150, 220, 255, 0.9)';
            valueEl.textContent = mode.value.toFixed(2);
            column.appendChild(valueEl);
            
            // 创建柱子
            const bar = document.createElement('div');
            bar.className = `column-bar ${mode.className}`;
            bar.style.width = '40px';
            bar.style.borderRadius = '5px 5px 0 0';
            bar.style.transition = 'height 0.5s ease';
            bar.style.position = 'relative';
            bar.style.minHeight = '1px';
            bar.style.maxHeight = '100%';
            bar.style.height = '0'; // 初始高度为0
            column.appendChild(bar);
            
            // 添加到柱状图容器
            columnsContainer.appendChild(column);
            
            // 创建标签 - 现在将标签添加到单独的标签容器中，与柱状图分离
            const label = document.createElement('div');
            label.className = 'column-label';
            label.textContent = mode.name;
            
            // 添加网格线数值在标签的左侧
            const gridValue = document.createElement('span');
            gridValue.className = 'grid-value';
            gridValue.style.position = 'absolute';
            gridValue.style.left = '8px';
            gridValue.style.top = '50%';
            gridValue.style.transform = 'translateY(-50%)';
            gridValue.style.fontSize = '14px';
            gridValue.style.color = 'rgba(150, 220, 255, 0.5)';
            gridValue.textContent = '  ';
            label.appendChild(gridValue);
            
            // 添加到标签容器
            labelsContainer.appendChild(label);
        });
        
        // 添加详情按钮点击事件
        const detailBtn = roadCard.querySelector('.detail-btn');
        detailBtn.addEventListener('click', function() {
            showRoadDetail(roadName);
        });
        
        // 延迟设置柱状图高度，实现动画效果
        setTimeout(() => {
            const bars = roadCard.querySelectorAll('.column-bar');
            const values = [roadData.frt, roadData.rbdrt, roadData.smart];
            
            bars.forEach((bar, i) => {
                const value = values[i];
                // 使用实际数值*100%作为高度，确保与网格线对应
                bar.style.height = `${value * 100}%`;
                
                // 设置不同的背景色
                if (i === 0) { // FRT
                    bar.style.background = 'linear-gradient(180deg, rgb(0, 120, 255), rgb(0, 180, 255))';
                } else if (i === 1) { // RbDRT
                    bar.style.background = 'linear-gradient(180deg, rgb(0, 170, 80), rgb(0, 220, 130))';
                } else { // 智慧车列
                    bar.style.background = 'linear-gradient(180deg, rgb(255, 130, 0), rgb(255, 180, 50))';
                }
            });
        }, 200 + index * 100);
    });
}

/**
 * 显示道路详情
 * @param {string} roadName - 道路名称
 */
function showRoadDetail(roadName) {
    console.log(`显示 ${roadName} 的详细信息`);
    // 这里可以根据需要显示详细信息，比如弹出模态框或跳转到详情页面
    alert(`${roadName} 详细信息将在此显示，包括更多分析数据和建议。`);
}

/**
 * 初始化灵敏度分析选项
 */
function initSensitivityOptions() {
    // 检查配置文件是否存在
    if (typeof SENSITIVITY_OPTIONS === 'undefined') {
        console.error('灵敏度分析选项配置不存在');
        return;
    }
    
    console.log('初始化灵敏度分析选项...');
    
    // 获取容器
    const container = document.getElementById('sensitivity-options-container');
    if (!container) {
        console.error('找不到灵敏度分析选项容器');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 记录默认选中的选项值
    let defaultOption = null;
    
    // 添加样式更新函数
    const updateSelectedStyle = (selectedRadio) => {
        // 移除所有标签的选中样式
        container.querySelectorAll('label').forEach(label => {
            label.classList.remove('selected');
        });
        
        // 给选中项的标签添加选中样式
        if (selectedRadio && selectedRadio.parentElement) {
            selectedRadio.parentElement.classList.add('selected');
        }
    };
    
    // 动态生成选项
    SENSITIVITY_OPTIONS.forEach(option => {
        // 创建标签元素
        const label = document.createElement('label');
        
        // 创建单选框
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'sensitivity';
        radio.value = option.value;
        
        // 如果是默认选项，设置为选中状态
        if (option.default) {
            radio.checked = true;
            defaultOption = option.value;
        }
        
        // 添加单选框到标签
        label.appendChild(radio);
        
        // 添加文本
        label.appendChild(document.createTextNode(' ' + option.name));
        
        // 添加标签到容器
        container.appendChild(label);
        
        // 添加事件监听
        radio.addEventListener('change', function() {
            updateSensitivityImage(this.value);
            updateSelectedStyle(this);
        });
    });
    
    // 更新默认选中项的样式
    const defaultRadio = container.querySelector('input[type="radio"]:checked');
    updateSelectedStyle(defaultRadio);
    
    // 加载默认选项的图片
    if (defaultOption) {
        console.log(`加载默认灵敏度分析图片: ${defaultOption}`);
        updateSensitivityImage(defaultOption);
    } else if (SENSITIVITY_OPTIONS.length > 0) {
        // 如果没有默认选项，选中第一个
        const firstRadio = container.querySelector('input[type="radio"]');
        if (firstRadio) {
            firstRadio.checked = true;
            updateSensitivityImage(firstRadio.value);
            updateSelectedStyle(firstRadio);
        }
    }
}

// 初始化高德地图
function initMap() {
    console.log('初始化地图...');
    
    // 创建地图实例 公交线路
    const map = new AMap.Map('map-container', {
        zoom: 11,
        // 默认显示上海嘉定区公交线路
        center: [121.2647, 31.3751],
        viewMode: '3D',
        pitch: 50,
        mapStyle: 'amap://styles/blue',
        features: ['bg', 'building', 'point', 'road'],
        showBuildingBlock: true,
        buildingAnimation: true,
        skyColor: '#091220'  // 设置天空颜色
    });

    // 使用plugin方法加载控件，而不是直接实例化
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], function() {
        // 添加比例尺控件
        const scale = new AMap.Scale({
            position: 'LB',
            theme: 'blue'
        });
        map.addControl(scale);
        
        // 添加工具条控件
        const toolbar = new AMap.ToolBar({
            position: {
                top: '100px',
                right: '40px'
            },
            theme: 'blue'
        });
        map.addControl(toolbar);
    });

    // 设置地图样式 - 使用字符串ID而不是对象
    try {
        map.setMapStyle('amap://styles/blue');
        
        // 添加建筑物图层
        const buildings = new AMap.Buildings({
            zooms: [12, 20],
            zIndex: 10,
            heightFactor: 2
        });
        buildings.setMap(map);
        
        console.log('地图样式和建筑物图层设置成功');
    } catch (error) {
        console.error('设置地图样式时出错:', error);
    }

    console.log('地图初始化完成');
    return map;
}

// 初始化面板控制
function initPanels() {
    console.log('开始初始化面板控制...');
    
    const leftPanel = document.querySelector('.floating-panel.left-panel');
    const rightPanel = document.querySelector('.floating-panel.right-panel');
    const leftToggle = document.querySelector('.left-toggle');
    const rightToggle = document.querySelector('.right-toggle');

    if (!leftPanel || !rightPanel) {
        console.error('面板元素未找到', {leftPanel, rightPanel});
        return;
    }
    
    if (!leftToggle || !rightToggle) {
        console.error('面板切换按钮未找到', {leftToggle, rightToggle});
        return;
    }

    console.log('面板元素和切换按钮已找到，准备设置面板初始状态...');

    // 先移除可能存在的类，确保状态一致
    leftPanel.classList.remove('expanded');
    rightPanel.classList.remove('expanded');
    
    // 强制重绘
    void leftPanel.offsetWidth;
    void rightPanel.offsetWidth;
    
    // 设置默认展开状态
    setTimeout(() => {
        leftPanel.classList.add('expanded');
        rightPanel.classList.add('expanded');
        
        console.log('设置面板默认展开状态完成');
        
        // 确保切换按钮图标正确
        if (leftToggle.querySelector('.toggle-icon')) {
            leftToggle.querySelector('.toggle-icon').textContent = '◀';
        }
        
        if (rightToggle.querySelector('.toggle-icon')) {
            rightToggle.querySelector('.toggle-icon').textContent = '▶';
        }
    }, 100);

    console.log('添加面板切换事件监听...');

    // 左侧面板切换
    leftToggle.addEventListener('click', function() {
        console.log('左侧面板切换按钮被点击');
        leftPanel.classList.toggle('expanded');
        
        const icon = leftToggle.querySelector('.toggle-icon');
        if (icon) {
            icon.textContent = leftPanel.classList.contains('expanded') ? '◀' : '▶';
        }
        
        console.log('左侧面板状态:', leftPanel.classList.contains('expanded') ? '展开' : '收起');
    });

    // 右侧面板切换
    rightToggle.addEventListener('click', function() {
        console.log('右侧面板切换按钮被点击');
        rightPanel.classList.toggle('expanded');
        
        const icon = rightToggle.querySelector('.toggle-icon');
        if (icon) {
            icon.textContent = rightPanel.classList.contains('expanded') ? '▶' : '◀';
        }
        
        console.log('右侧面板状态:', rightPanel.classList.contains('expanded') ? '展开' : '收起');
    });

    console.log('面板初始化完成');
}

// 初始化城市选择器
function initCitySelector() {
    const citySelector = document.querySelector('.header-city-selector');
    const selectedArea = document.querySelector('.header-city-selector .selected-area');
    const selectedAreaText = document.getElementById('selected-area-text');
    const districtItems = document.querySelectorAll('.district-item');
    
    // 默认选中嘉定区
    setActiveDistrict('嘉定区');
    
    // 点击选择区域按钮显示/隐藏下拉菜单
    selectedArea.addEventListener('click', function() {
        citySelector.classList.toggle('active');
    });
    
    // 点击区域项时更新选中区域
    districtItems.forEach(item => {
        item.addEventListener('click', function() {
            const district = this.getAttribute('data-district');
            setActiveDistrict(district);
            citySelector.classList.remove('active');
            
            // 这里可以添加切换区域后的地图操作，例如：
            updateMapForDistrict(district);
        });
    });
    
    // 点击其他区域时关闭下拉菜单
    document.addEventListener('click', function(event) {
        if (!citySelector.contains(event.target)) {
            citySelector.classList.remove('active');
        }
    });
    
    // 设置活动区域
    function setActiveDistrict(district) {
        selectedAreaText.innerText = `上海市-${district}`;
        districtItems.forEach(item => {
            if (item.getAttribute('data-district') === district) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 更新地图显示的区域
    function updateMapForDistrict(district) {
        if (map) {
            // 根据区域名称设置地图中心点和缩放级别
            // 这里是示例，实际应用中可以使用高德地图API的地理编码服务获取具体坐标
            const districtCenter = {
                '嘉定区': [121.2647, 31.3751],
                '浦东新区': [121.5447, 31.2223],
                '黄浦区': [121.4905, 31.2228],
                '静安区': [121.4575, 31.2295],
                '徐汇区': [121.4362, 31.1897],
                '长宁区': [121.4247, 31.2205],
                '普陀区': [121.3992, 31.2493],
                '虹口区': [121.5066, 31.2649],
                '杨浦区': [121.5261, 31.2600],
                '宝山区': [121.4851, 31.4056],
                '闵行区': [121.3812, 31.1148],
                '松江区': [121.2288, 31.0324],
                '青浦区': [121.1245, 31.1496],
                '奉贤区': [121.4741, 30.9179],
                '金山区': [121.3416, 30.7418],
                '崇明区': [121.3973, 31.6229]
            };
            
            if (districtCenter[district]) {
                map.setCenter(districtCenter[district]);
                map.setZoom(12);
                
                // 可以在这里添加显示该区域的边界等操作
                // 例如使用高德地图的DistrictSearch API
            }
        }
    }
}