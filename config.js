/**
 * 公交运营模式适应性分析平台配置文件
 * 包含车型信息和评价结果分值
 */

// 车型配置
const VEHICLE_CONFIG = {
    // FRT模式车型
    frt: [
        {
            id: "frt-vehicle-1",
            name: "象牌SXC6112GBEV3",
            type: "标准公交车",
            image: "images/vehicles/车型A.png",
            capacity: 85,
            isElectric: true
        },
        {
            id: "frt-vehicle-2",
            name: "申沃SWB6127PHEV2",
            type: "铰接公交车",
            image: "images/vehicles/车型B.png",
            capacity: 160,
            isElectric: false
        },
        {
            id: "frt-vehicle-3",
            name: "九龙 HKL6600BEV11",
            type: "双层公交车",
            image: "images/vehicles/车型C.png",
            capacity: 120,
            isElectric: true
        }
    ],
    
    // RbDRT模式车型
    rbdrt: [
        {
            id: "rbdrt-vehicle-1",
            name: "象牌SXC6112GBEV3",
            type: "小型面包车",
            image: "images/vehicles/车型A.png",
            capacity: 7,
            isElectric: true
        },
        {
            id: "rbdrt-vehicle-2",
            name: "申沃SWB6127PHEV2",
            type: "中型面包车",
            image: "images/vehicles/车型B.png",
            capacity: 15,
            isElectric: false
        },
        {
            id: "rbdrt-vehicle-3",
            name: "九龙 HKL6600BEV11",
            type: "小型巴士",
            image: "images/vehicles/车型C.png",
            capacity: 22,
            isElectric: true
        }
    ]
};

// 评价结果分值配置
const EVALUATION_SCORES = {
    // FRT模式分值
    frt: {
        company: 0.95,    // 公司效益
        passenger: 0.64,  // 乘客效益
        environment: 0.74, // 环境效益
        comprehensive: 0.71 // 综合效益
    },
    
    // RbDRT模式分值
    rbdrt: {
        company: 0.84,    // 公司效益
        passenger: 0.40,  // 乘客效益
        environment: 0.58, // 环境效益
        comprehensive: 0.51 // 综合效益
    },
    
    // 智慧车列模式分值
    smart: {
        company: 0.44,    // 公司效益
        passenger: 0.92,  // 乘客效益
        environment: 0.97, // 环境效益
        comprehensive: 0.89 // 综合效益
    }
};

// 结果分析文本配置
const ANALYSIS_TEXT = {
    title: "根据提供的效益得分表，以下是针对FRT、RbDRT和智慧车列三种交通模式的综合分析：",
    social: "从乘客角度考虑，智慧车列提供更灵活的服务，减少了等待时间，提高了出行便利性。智慧车列和RbDRT模式可根据客流需求动态调整，而FRT则更适合高密度走廊和稳定客流。",
    economic: "从运营成本角度考虑，FRT模式运维相对简单，车辆调度和人员安排更加规范，而智慧车列和RbDRT需要更复杂的调度算法和智能系统支持，初期投入较高，但长期可能带来更好的收益性。",
    rbdrt: "RbDRT表现相对较弱，需要重新评估模式设计或定位。建议应对路线合并或细化，对不同客流分布的路段采取差异化策略，适应更广泛的应用场景。",
    summary: "数据表明，智慧车列代表未来趋势，但需解决成本问题；FRT是当前务实选择。"
};

// 灵敏度分析图片配置
const SENSITIVITY_IMAGES = {
    // 不同分析维度对应的图片路径
    "passenger-demand": "images/sensitivity/passenger_demand.png",
    "peak-ratio": "images/sensitivity/peak_ratio.png",
    "spatial-var": "images/sensitivity/spatial_var.png",
    "route-length": "images/sensitivity/route_length.png",
    "other-option": "images/sensitivity/other_option.png"
};

// 灵敏度分析选项配置
const SENSITIVITY_OPTIONS = [
    {
        value: '线客流需求',
        name: '线客流需求',
        default: true  // 设为默认选中
    },
    {
        value: 'peak-ratio',
        name: '高峰需求比重'
    },
    // {
    //     value: 'spatial-var',
    //     name: '空间需求变异系数'
    // },
    // {
    //     value: 'route-length',
    //     name: '线路长度'
    // },
    {
        value: 'other-option',
        name: '其他选项'
    }
];

// 道路改造重要性排名数据（左侧排行榜）
const ROAD_IMPORTANCE_RANKING = [
    { name: "嘉定822路", value: 0.63 },
    { name: "嘉定1路", value: 0.55 },
    { name: "嘉定406路", value: 0.51 },
    { name: "嘉定799路", value: 0.45 },
    { name: "嘉定13路", value: 0.38 },
    { name: "嘉定115路", value: 0.24 },
    { name: "嘉定581路", value: 0.21 },
    { name: "嘉定628路", value: 0.13 },
    { name: "嘉定731路", value: 0.11 },
    { name: "其他线路", value: 0.10 }
];

// 道路详细数据（右侧6个模块数据）
const ROAD_DETAIL_DATA = {
    // 6条道路的数据，每条道路包含三种模式的分值
    "嘉定42路": {
        frt: 0.78,
        rbdrt: 0.32,
        smart: 0.51
    },
    "嘉定1路": {
        frt: 0.21,
        rbdrt: 0.38,
        smart: 0.76
    },
    "嘉定678路": {
        frt: 0.68,
        rbdrt: 0.74,
        smart: 0.76
    },
    "嘉定605路": {
        frt: 0.84,
        rbdrt: 0.21,
        smart: 0.62
    },
    "嘉定107路": {
        frt: 0.54,
        rbdrt: 0.48,
        smart: 0.31
    },
    "嘉定13路": {
        frt: 0.35,
        rbdrt: 0.12,
        smart: 0.59
    }
}; 

// 灵敏度分析数据
const SENSITIVITY_DATA = {
    '线客流需求': [
        // value1, value2, group
        [-100, 0.88, 'RdDRT'],
        [-95, 0.865, 'RdDRT'],
        [-90, 0.872, 'RdDRT'],
        [-85, 0.85, 'RdDRT'],
        [-80, 0.831, 'RdDRT'],
        [-75, 0.825, 'RdDRT'],
        [-70, 0.809, 'RdDRT'],
        [-65, 0.812, 'RdDRT'],
        [-60, 0.821, 'RdDRT'],
        [-55, 0.775, 'RdDRT'],
        [-50, 0.768, 'RdDRT'],
        [-45, 0.769, 'RdDRT'],
        [-40, 0.74, 'RdDRT'],
        [-35, 0.735, 'RdDRT'],
        [-30, 0.721, 'RdDRT'],
        [-25, 0.725, 'RdDRT'],
        [-20, 0.698, 'RdDRT'],
        [-15, 0.682, 'RdDRT'],
        [-10, 0.694, 'RdDRT'],
        [-5, 0.655, 'RdDRT'],
        [0, 0.621, 'RdDRT'],
        [5, 0.625, 'RdDRT'],
        [10, 0.602, 'RdDRT'],
        [15, 0.592, 'RdDRT'],
        [20, 0.58, 'RdDRT'],
        [25, 0.586, 'RdDRT'],
        [30, 0.55, 'RdDRT'],
        [35, 0.532, 'RdDRT'],
        [40, 0.52, 'RdDRT'],
        [45, 0.505, 'RdDRT'],
        [50, 0.481, 'RdDRT'],
        [55, 0.482, 'RdDRT'],
        [60, 0.46, 'RdDRT'],
        [65, 0.412, 'RdDRT'],
        [70, 0.43, 'RdDRT'],
        [75, 0.412, 'RdDRT'],
        [80, 0.4, 'RdDRT'],
        [85, 0.385, 'RdDRT'],
        [90, 0.37, 'RdDRT'],
        [95, 0.355, 'RdDRT'],
        [100, 0.356, 'RdDRT'],
        [-100, 0.54, 'FRT'],
        [-95, 0.552, 'FRT'],
        [-90, 0.551, 'FRT'],
        [-85, 0.571, 'FRT'],
        [-80, 0.585, 'FRT'],
        [-75, 0.592, 'FRT'],
        [-70, 0.591, 'FRT'],
        [-65, 0.612, 'FRT'],
        [-60, 0.625, 'FRT'],
        [-55, 0.635, 'FRT'],
        [-50, 0.647, 'FRT'],
        [-45, 0.659, 'FRT'],
        [-40, 0.661, 'FRT'],
        [-35, 0.682, 'FRT'],
        [-30, 0.674, 'FRT'],
        [-25, 0.704, 'FRT'],
        [-20, 0.714, 'FRT'],
        [-15, 0.713, 'FRT'],
        [-10, 0.735, 'FRT'],
        [-5, 0.742, 'FRT'],
        [0, 0.745, 'FRT'],
        [5, 0.746, 'FRT'],
        [10, 0.738, 'FRT'],
        [15, 0.729, 'FRT'],
        [20, 0.727, 'FRT'],
        [25, 0.711, 'FRT'],
        [30, 0.708, 'FRT'],
        [35, 0.699, 'FRT'],
        [40, 0.687, 'FRT'],
        [45, 0.685, 'FRT'],
        [50, 0.678, 'FRT'],
        [55, 0.675, 'FRT'],
        [60, 0.662, 'FRT'],
        [65, 0.668, 'FRT'],
        [70, 0.648, 'FRT'],
        [75, 0.639, 'FRT'],
        [80, 0.640, 'FRT'],
        [85, 0.635, 'FRT'],
        [90, 0.618, 'FRT'],
        [95, 0.612, 'FRT'],
        [100, 0.605, 'FRT'],
        [-100, 0.17, '智慧车列'],
        [-95, 0.195, '智慧车列'],
        [-90, 0.265, '智慧车列'],
        [-85, 0.241, '智慧车列'],
        [-80, 0.21, '智慧车列'],
        [-75, 0.231, '智慧车列'],
        [-70, 0.233, '智慧车列'],
        [-65, 0.262, '智慧车列'],
        [-60, 0.244, '智慧车列'],
        [-55, 0.275, '智慧车列'],
        [-50, 0.289, '智慧车列'],
        [-45, 0.3, '智慧车列'],
        [-40, 0.312, '智慧车列'],
        [-35, 0.325, '智慧车列'],
        [-30, 0.331, '智慧车列'],
        [-25, 0.34, '智慧车列'],
        [-20, 0.405, '智慧车列'],
        [-15, 0.415, '智慧车列'],
        [-10, 0.42, '智慧车列'],
        [-5, 0.432, '智慧车列'],
        [0, 0.445, '智慧车列'],
        [5, 0.451, '智慧车列'],
        [10, 0.371, '智慧车列'],
        [15, 0.377, '智慧车列'],
        [20, 0.392, '智慧车列'],
        [25, 0.466, '智慧车列'],
        [30, 0.541, '智慧车列'],
        [35, 0.51, '智慧车列'],
        [40, 0.564, '智慧车列'],
        [45, 0.655, '智慧车列'],
        [50, 0.643, '智慧车列'],
        [55, 0.677, '智慧车列'],
        [60, 0.679, '智慧车列'],
        [65, 0.722, '智慧车列'],
        [70, 0.746, '智慧车列'],
        [75, 0.761, '智慧车列'],
        [80, 0.788, '智慧车列'],
        [85, 0.795, '智慧车列'],
        [90, 0.84, '智慧车列'],
        [95, 0.862, '智慧车列'],
        [100, 0.875, '智慧车列']
    ]
};
