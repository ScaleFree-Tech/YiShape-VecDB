<template id="user-workspace">
    <user-frame>
        <div class="workspace-container">



            <!-- 顶部统计卡片区域 -->
            <el-row :gutter="20" class="stat-cards">
                <el-col :span="8" v-for="stat in statistics" :key="stat.title">
                    <el-card shadow="hover" class="stat-card" :class="stat.borderClass" @click="navigateTo(stat.route)">
                        <div class="stat-content">
                            <div class="stat-icon" :class="stat.colorClass">
                                <el-icon :size="42"><component :is="stat.icon" /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stat.value }}</div>
                                <div class="stat-title">{{ stat.title }}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>



            <!-- 大模型增强应用区 -->
            <el-card class="llm-section" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <div class="section-title">
                            <el-icon :size="20"><Connection /></el-icon>
                            <span>大模型增强应用</span>
                        </div>
                    </div>
                </template>     
                <el-row :gutter="20" class="llm-cards">
                    <el-col :span="8" v-for="model in llmModels" :key="model.name">
                        <div class="llm-card" @click="gotoLLM(model.name)">
                            <div class="llm-card-content">
                                <div class="model-header">
                                    <img :src="model.icon" :alt="model.name" class="llm-icon" />
                                    <el-tag 
                                        :type="model.status === 'online' ? 'success' : 'info'" 
                                        size="small" 
                                        class="status-tag"
                                        :effect="model.status === 'online' ? 'light' : 'plain'"
                                    >
                                        {{ model.status === 'online' ? '在线' : '离线' }}
                                    </el-tag>
                                </div>
                                <h3 class="llm-name">{{ model.name }}</h3>
                                <div class="model-version">{{ model.version }}</div>
                                <p class="llm-description">{{ model.description }}</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 工具列表 -->
            <el-card class="tool-section" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <div class="section-title">
                            <el-icon :size="20"><Tools /></el-icon>
                            <span>常用工具</span>
                        </div>
                    </div>
                </template>
                <el-row :gutter="20" class="tool-cards">
                    <el-col :span="4" v-for="tool in tools" :key="tool.title">
                        <div class="tool-card" @click="handleClick(tool.name)">
                            <div class="tool-card-content">
                                <img :src="tool.src" :alt="tool.title" class="tool-icon" />
                                <h3 class="tool-title">{{ tool.title }}</h3>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>



            <!-- 最近会话记录 -->
            <el-card class="recent-sessions" shadow="hover">

                <template #header>
                    <div class="card-header">
                        <div class="section-title">
                            <el-icon :size="20"><Clock /></el-icon>
                            <span>最近会话记录</span>
                        </div>
                        <el-link 
                            type="primary" 
                            class="view-all-link"
                            @click="navigateTo('user_list_history')"
                        >
                            查看全部
                            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                        </el-link>
                    </div>
                </template>
                <div class="timeline-container">
                    <el-timeline>
                        <template v-for="(group, date) in groupedSessions" :key="date">
                            <el-timeline-item
                                :timestamp="date"
                                placement="top"
                                type="primary"
                                size="large"
                                :hollow="true"
                                class="custom-timeline-item"
                            >
                                <div class="session-group">
                                    <el-card v-for="session in group" 
                                        :key="session.id" 
                                        class="session-card"
                                        shadow="hover"
                                    >
                                        <div class="session-info">
                                            <div class="session-time">{{ session.time.split(' ')[1] }}</div>
                                            <el-tag :type="session.tagType" size="small" class="session-type">
                                                {{ session.type }}
                                            </el-tag>
                                            <span class="session-title">{{ session.title }}</span>
                                            <div class="session-actions">
                                                <el-link 
                                                    type="primary" 
                                                    class="resume-link"
                                                    @click="resumeSession(session.id,session.type,session.llmType,session.db)"
                                                >
                                                    恢复会话
                                                </el-link>
                                                <el-link 
                                                    type="primary" 
                                                    class="resume-link"
                                                    @click="deleteSession(session.id)"
                                                >
                                                    删除会话
                                                </el-link>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </el-timeline-item>
                        </template>
                    </el-timeline>
                    <el-text type="info" size="small" style="text-align: left;">
                        *大模型会话属个人隐私，服务器端不保留任何会话信息。会话记录存储在本地浏览器缓存中，清理浏览器缓存时会丢失，请及时保存重要数据在其它地方。
                    </el-text>
                </div>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="查询结果"  :before-close="handleClose"
            style="text-align: left;">
            <div v-html="message" style="line-height: 1.6; font-family: 'Microsoft YaHei', sans-serif;"></div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>


    </user-frame>
</template>

<script>
const UserWorkspace = {
    mounted() {
        // this.initChart();
        window.addEventListener('resize', this.resizeChart);
        // 初始化数据库
        this.initDatabase();
        this.requestData();
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeChart);
    },
    data() {
        return {
            message: "...",
            dialogVisible: false,
            localTime: '',
            address: {},


            timeRange: 'week',
            stats:{},
            statistics: [
                { 
                    title: '文本块迭代任务', 
                    value: '12', 
                    icon: 'Files',
                    trend: 15,
                    colorClass: 'blue-bg',
                    route: 'user_list_chunk_task',
                    borderClass: 'blue-border'
                },
                { 
                    title: '图像检索', 
                    value: '5', 
                    icon: 'Connection',
                    trend: -8,
                    colorClass: 'green-bg',
                    route: 'user_list_image_db',
                    borderClass: 'green-border'
                },
                { 
                    title: '总会话数', 
                    value: '128', 
                    icon: 'ChatDotSquare',
                    trend: 23,
                    colorClass: 'purple-bg',
                    route: 'user_list_history',
                    borderClass: 'purple-border'
                },
            ],
            llmModels: [
                {
                    name: 'LLM',
                    description: '大模型交互：最先进的商业与开源大模型聚合',
                    icon: '/images/deepseek.jpg',
                    status: 'online',
                    version: 'Ollama, DeepSeek, Qwen, Kimi, ChatGLM'
                },
                {
                    name: 'RAG',
                    description: '检索增强生成：多种检索方法、用户意图理解、海量文件支持',
                    icon: '/images/rag3.png',
                    status: 'online',
                    version: 'R1'
                },
                {
                    name: 'Agent',
                    description: '大模型Agent任务：整合大模型、本地知识库与丰富的Agent工具',
                    icon: '/images/agent3.png',
                    status: 'online',//'online'|'offline'
                    version: 'v1.0'
                }
            ],
            tools: [
                { name: 'user_web_search', title: '互联网搜索', src: '/images/tools/search2.png' },
                { name: 'weather', title: '天气预报', src: '/images/tools/weather2.png' },
                { name: 'local_address', title: '地理位置', src: '/images/tools/location2.webp' },
                { name: 'image_analysis', title: '图像分析', src: '/images/tools/analysis.png' },
                { name: 'file_convert', title: '文件转换', src: '/images/tools/report2.png' },
                { name: 'user_make_ppt', title: 'PPT制作', src: '/images/tools/ppt_gen2.png' },
            ],
            recentSessions: [],
            myChart: null,
            db: null, // Dexie数据库实例
        }
    },
    methods: {
        initDatabase() {
            this.db = this.db = getChatHistoryDB();
            this.loadRecentSessions();
        },
        requestData() {
            let url = "/api/find_statistics";
            axios.get(url).then((response) => {
                this.stats = response.data;
                console.log(response.data);
                this.statistics[0].value = this.stats.chunkTasks.length;
                this.statistics[1].value = this.stats.imageDatabases.length;
                this.llmModels[1].version = '共'+this.stats.databases.length+'个文本库';
                this.llmModels[2].version = '共'+this.stats.reActAgents.length+'个Agent';
            });
        },
        loadRecentSessions() {
            // 从数据库加载最近的会话记录
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            console.log(threeDaysAgo.getTime());
            Promise.all([
                this.db.chatHistory
                    .orderBy('genTime')
                    // .where('genTime')
                    // .aboveOrEqual(threeDaysAgo)
                    .reverse()
                    .limit(5)
                    .toArray(),
                this.db.chatHistory
                    .count()
            ]).then(([records, totalCount]) => {
                this.recentSessions = records.map(record => ({
                    id: record.id,
                    type: record.type,
                    db: record.db,
                    title: this.truncateTitle(record.title, 30),
                    llmType: record.llmType,
                    genTime: record.genTime,
                    time: new Date(record.genTime).toLocaleString(),
                    tagType: this.getTagType(record.type)
                }));
                // 更新总会话数统计
                this.statistics[2].value = totalCount.toString();
            }).catch(error => {
                console.error('加载会话历史失败:', error);
            });
        },
        truncateTitle(title, maxLength) {
            if (!title) return '';
            if (title.length <= maxLength) return title;
            return title.substring(0, maxLength) + '...';
        },
        getTagType(type) {
            const typeMap = {
                '对话': 'info',
                'RAG': 'success',
                'Agent': 'warning'
            };
            return typeMap[type] || 'info';
        },
        deleteSession(sessionId) {
            this.$msgbox({
                message: '确定要删除本会话记录吗？',
                title: '警告',
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showCancelButton: true,
                type: 'warning',
            }).then(() => {
                this.db.chatHistory
                    .delete(sessionId)
                    .then(() => {
                        console.log('会话记录已删除');
                        this.loadRecentSessions(); // 重新加载会话列表
                    })
                    .catch(error => {
                        console.error('删除会话记录失败:', error);
                    });
            }).catch(() => { });
        },
        navigateTo(route) {
            let url = '/user/' + route
            location.href = url
        },
        gotoLLM(model) {
            let url = '';
            if(model== 'LLM'){
                url = '/user/user_llm_session/';
            }else if(model == 'RAG'){
                url = '/user/user_list_db';
            }else if(model == 'Agent'){
                url = '/user/user_list_react_agent';
            }
            location.href = url;
        },
        resumeSession(sessionId,type,llmType,db) {
            // alert(sessionId+type+llmType);
            let url = '';
            if(type == 'LLM'){
                url = '/user/user_llm_session/'+llmType+'/'+sessionId;
            }else{
                url = '/user/user_rag_session/'+db+'/'+sessionId;
            }
            location.href = url;
        },

        handleClick(name) {
            if (name == 'local_time') {
                this.testLocalTime();
            }else if (name == 'local_address') {
                this.testAddress();
            }else if (name == 'weather') {
                this.testWeather();
            }else if (name == 'user_web_search') {
                location.href = ("/user/user_web_search");
            }else if (name == 'user_make_ppt') {
                location.href = ("/user/user_make_ppt");
            }else if (name == 'image_analysis') {
                location.href = ("/user/user_image_analysis");
            }else if (name == 'file_convert') {
                location.href = ("/user/user_file_convert");
            }else{
                this.dialogVisible = true;
                this.message = '正在开发中，敬请期待...';
            }
        },

        testAddress() {
            let url = "/api/local_address";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.address = response.data;
                this.message = this.address;
                console.log(response.data);
            });
        },

        testLocalTime() {
            let url = "/api/local_time";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.localTime = response.data;
                this.message = this.localTime;
                console.log(response.data);
            });
        },

        testWeather() {
            let url = "/api/weather";
            this.dialogVisible = true;
            
            // 先获取地址信息，然后在回调中获取天气信息
            axios.get("/api/local_address").then((addressResponse) => {
                this.address = addressResponse.data;
                let rs = this.address.split("-");
                let city = rs[rs.length - 1];
                console.log(city);
                
                let params = {
                    "city": city,
                    "days": 3
                }
                
                return axios.post(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }).then((weatherResponse) => {
                this.weather = weatherResponse.data;
                console.log(this.weather)
                this.message = this.formatWeatherData(this.weather);
            }).catch((error) => {
                console.error('获取天气信息失败:', error);
                this.message = '获取天气信息失败，请稍后重试';
            });
        },

        formatWeatherData(weatherData) {
            if (!weatherData || weatherData.status !== 'ok') {
                return '获取天气信息失败';
            }

            let html = `<div style="text-align: center; margin-bottom: 15px;"><b style="font-size: 16px; color: #409eff;">🌟 ${weatherData.city} 天气及未来2天预报</b></div>`;
            
            if (weatherData.items && weatherData.items.length > 0) {
                html += '<table style="width:100%; border-collapse: collapse; font-size: 14px;">';
                html += '<thead><tr style="background-color: #f5f7fa;">';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">📅 日期</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌡️ 温度</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">☀️ 白天</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌙 夜间</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">💨 风向/风力</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">💧 湿度</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌅 日出</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌆 日落</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌙 月相</th>';
                html += '</tr></thead><tbody>';
                
                weatherData.items.forEach((item, index) => {
                    const rowStyle = index % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #fafafa;';
                    html += `<tr style="${rowStyle}">`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.fxDate}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.tempMin}°C~${item.tempMax}°C</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.textDay}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.textNight}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.windDirDay}${item.windScaleDay}级</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.humidity}%</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.sunrise}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.sunset}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.moonPhase}</td>`;
                    html += '</tr>';
                });
                
                html += '</tbody></table>';
            }
            
            return html;
        },



    },
    computed: {
        groupedSessions() {
            const groups = {};
            this.recentSessions.forEach(session => {
                const date = session.time.split(' ')[0];
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(session);
            });
            return groups;
        }
    },
    watch: {
        timeRange: {
            handler(newValue) {
                this.initChart();
            }
        }
    },
    template: "#user-workspace"
}

app.component("user-workspace", UserWorkspace);
</script>

<style scoped>
.workspace-container {
    padding: 20px;
    min-height: 60vh;
    position: relative;
    border: 0px solid rgba(229, 230, 235, 0.7);
    margin-bottom: -50px;
}

.workspace-container > .el-card:not(:last-child) {
    margin-bottom: 10px;
}

.stat-cards {
    margin-top: -20px;
    margin-bottom: 10px;
}

.stat-card, .llm-section, .usage-chart-card, .recent-sessions {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(229, 230, 235, 0.7);
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.stat-card {
    border-radius: 16px;
    transition: all 0.3s;
    cursor: pointer;
    overflow: hidden;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 
            0 12px 20px -5px rgba(0, 0, 0, 0.08),
            0 4px 12px -2px rgba(0, 0, 0, 0.05);
        
        .stat-icon {
            transform: scale(1.05);
        }

        .stat-title {
            opacity: 1;
        }
    }
}

.stat-content {
    display: flex;
    align-items: flex-start;
    padding: 0px;
    position: relative;
}

.stat-icon {
    padding: 14px;
    border-radius: 12px;
    margin-right: 10px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    :deep(.el-icon) {
        font-size: 24px;
    }
}

.stat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.stat-info .stat-value {
    font-size: 32px;
    font-weight: 600;
    background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    margin-bottom: 2px;
    transition: transform 0.3s ease;
}

.stat-info .stat-title {
    font-size: 16px;
    color: #303133;
    margin-bottom: -8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(45deg, #303133, #606266);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.9;
}

.usage-chart-card {
    margin-bottom: 20px;
    border-radius: 12px;
    border-top: 3px solid var(--el-color-success);
    box-shadow: 
        0 4px 12px -2px rgba(0, 0, 0, 0.05),
        0 2px 6px -1px rgba(0, 0, 0, 0.03);
    --el-card-padding: 16px;
}

.chart-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

:deep(.el-radio-button__inner) {
    padding: 4px 16px;
}

.chart-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.recent-sessions {
    margin-bottom: 20px;
    border-radius: 12px;
    border-left: 3px solid var(--el-color-primary);
    /* border-top: 3px solid var(--el-color-primary); */
    box-shadow: 
        0 6px 16px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.timeline-container {
    padding: 0 20px;
    text-align: left;
}

.session-group {
    margin: 10px 0;
}

.session-card {
    margin-bottom: 5px;
    border: 1px solid rgba(229, 230, 235, 0.5);
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
        border-color: var(--el-color-primary-light-5);
        box-shadow: 0 2px 12px -4px rgba(0, 0, 0, 0.08);
    }
}

.session-card:last-child {
    margin-bottom: 0;
}

.session-info {
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    width: 100%;
}

.session-time {
    color: #909399;
    font-size: 13px;
    width: 60px;
    flex-shrink: 0;
}

.session-type {
    flex-shrink: 0;
    min-width: 48px;
    text-align: center;
}

.session-title {
    color: #606266;
    font-size: 14px;
    flex-grow: 1;
    text-align: left;
    margin: 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.resume-link {
    flex-shrink: 0;
    font-size: 13px;
    margin-left: auto;
}

.session-actions {
    display: flex;
    gap: 12px;
    margin-left: auto;
}

:deep(.custom-timeline-item) {
    .el-timeline-item__timestamp.is-top {
        text-align: left !important;
        margin-left: 32px;
        padding-left: 0;
        width: 100%;
        position: relative;
        font-size: 14px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 20px;
        padding-top: 4px;
    }

    .el-timeline-item__wrapper {
        padding-left: 32px;
        margin-top: -25px;
    }

    .el-timeline-item__tail {
        left: 8px;
    }

    .el-timeline-item__node {
        left: 8px;
    }
}

:deep(.el-timeline) {
    padding-left: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #303133;
    font-size: 16px;
    font-weight: 600;
}

.section-title .el-icon {
    color: #409EFF;
}

.llm-section {
    margin-bottom: 10px;
    border-radius: 16px;
    border-left: 3px solid var(--el-color-primary);
    /* border-bottom: 3px solid var(--el-color-primary); */
    box-shadow: 
        0 6px 16px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.llm-cards {
    margin: 0 -10px;
    padding: 5px 0;
}

.llm-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    border: 1px solid rgba(229, 230, 235, 0.7);
    box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
    
    &:hover {
        transform: translateY(-5px);
        border-color: var(--el-color-primary-light-5);
        box-shadow: 
            0 12px 20px -5px rgba(0, 0, 0, 0.08),
            0 4px 12px -2px rgba(0, 0, 0, 0.05);

        .start-chat-btn {
            background-color: #409EFF;
            color: white;
            border-color: #409EFF;
        }
    }
}

.llm-card-content {
    padding: 14px;
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}

.model-header {
    position: relative;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.llm-icon {
    margin-top: 10px;
    width: 72px;
    height: 72px;
    margin-bottom: 12px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.llm-card:hover .llm-icon {
    transform: scale(1.05);
}

.status-tag {
    margin-top: 10px;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 12px;
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
}

.llm-name {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px;
}

.model-version {
    color: #909399;
    font-size: 13px;
    margin-bottom: 8px;
}

.llm-description {
    font-size: 14px;
    color: #606266;
    line-height: 1.4;
    margin: 0;
    flex-grow: 1;
    padding: 0 8px;
}

.model-action {
    margin-top: 10px;
}

.start-chat-btn {
    width: 140px;
    transition: all 0.3s ease;
}

.view-all-link {
    display: flex;
    align-items: center;
    font-size: 14px;
    
    :deep(.el-icon) {
        font-size: 14px;
        margin-top: 1px;
        transition: transform 0.3s ease;
    }
    
    &:hover {
        :deep(.el-icon) {
            transform: translateX(3px);
        }
    }
}


.tool-section {
    margin-top: 0px;
    margin-bottom: 10px;
    border-radius: 16px;
    border-right: 3px solid var(--el-color-primary);
    box-shadow: 
        0 6px 16px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.tool-cards {
    margin: 0 -10px;
    padding: 5px 0;
}

.tool-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    border: 1px solid rgba(229, 230, 235, 0.7);
    box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
    
    &:hover {
        transform: translateY(-5px);
        border-color: var(--el-color-primary-light-5);
        box-shadow: 
            0 12px 20px -5px rgba(0, 0, 0, 0.08),
            0 4px 12px -2px rgba(0, 0, 0, 0.05);
    }
}

.tool-card-content {
    padding: 14px;
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    align-items: center;
}

.tool-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.tool-card:hover .tool-icon {
    transform: scale(1.05);
}

.tool-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
}

:deep(.el-card__header) {
    padding: 12px 20px;
}

:deep(.el-card__body) {
    padding: 12px;
}

.blue-bg {
    background: rgba(64, 158, 255, 0.12);
    color: #409EFF;
}

.green-bg {
    background: rgba(103, 194, 58, 0.12);
    color: #67C23A;
}

.purple-bg {
    background: rgba(126, 87, 194, 0.12);
    color: #7E57C2;
}

.blue-border {
    border-top-color: #409EFF;
}

.green-border {
    border-top-color: #67C23A;
}

.purple-border {
    border-top-color: #7E57C2;
}

</style> 