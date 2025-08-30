<template id="user-list-history">
    <user-frame>
        <div class="workspace-container">
            <el-page-header @back="goToMain()" class="page-header">
                <template #content>
                    <el-text class="page-title" size="large">会话记录</el-text>
                </template>
            </el-page-header>

            <!-- 使用趋势图表 -->
            <el-card class="usage-chart-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>使用趋势</span>
                    </div>
                </template>
                <div id="usageChart" style="width: 100%; height: 240px;"></div>
            </el-card>

            <!-- 最近会话记录 -->
            <el-card class="recent-sessions" shadow="hover">

                <template #header>
                    <div class="card-header">
                        <div class="section-title">
                            <el-icon :size="20"><Clock /></el-icon>
                            <span>最近会话记录</span>
                        </div>
                        <el-button 
                            type="danger" 
                            size="small"
                            :disabled="recentSessions.length === 0"
                            @click="clearAllSessions"
                        >
                            清除全部
                        </el-button>
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
                                            <el-link 
                                                type="primary" 
                                                class="resume-link"
                                                @click="resumeSession(session.id,session.type,session.llmType)"
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
    </user-frame>
</template>

<script>
const UserListHistory = {
    mounted() {
        this.initChart();
        window.addEventListener('resize', this.resizeChart);
        this.initDatabase();
    },
    unmounted() {
        window.removeEventListener('resize', this.resizeChart);
    },
    data() {
        return {
            timeRange: 'week',
            recentSessions: [],
            myChart: null,
            db: null, // Dexie数据库实例
        }
    },
    methods: {
        initDatabase() {
            this.db = this.db = getChatHistoryDB();
            
            // 从数据库获取所有会话记录
            this.db.chatHistory
                .orderBy('genTime')
                .reverse()
                .toArray()
                .then(records => {
                    this.recentSessions = records.map(record => ({
                        id: record.id,
                        llmType: record.llmType,
                        db: record.db,
                        type: record.type,
                        title: this.truncateTitle(record.title, 30),
                        time: new Date(record.genTime).toLocaleString(),
                        tagType: this.getTagType(record.type)
                    }));
                })
                .catch(error => {
                    console.error('获取会话历史失败:', error);
                });
        },
        truncateTitle(title, maxLength) {
            if (!title) return '';
            if (title.length <= maxLength) return title;
            return title.substring(0, maxLength) + '...';
        },
        getTagType(type) {
            const typeMap = {
                'LLM': 'info',
                'RAG': 'success',
                'Agent': 'warning'
            };
            return typeMap[type] || 'info';
        },
        initChart() {
            const chartDom = document.getElementById('usageChart');
            if (!chartDom) return;
            
            this.myChart = echarts.init(chartDom);
            
            // Get the last 7 days
            const dates = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
            }

            // Initialize data arrays for each type
            const llmData = new Array(7).fill(0);
            const ragData = new Array(7).fill(0);
            const agentData = new Array(7).fill(0);

            // Process recentSessions data
            this.recentSessions.forEach(session => {
                const sessionDate = new Date(session.time);
                const today = new Date();
                const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays >= 0 && diffDays < 7) {
                    const index = 6 - diffDays;
                    switch (session.type) {
                        case 'LLM':
                            llmData[index]++;
                            break;
                        case 'RAG':
                            ragData[index]++;
                            break;
                        case 'Agent':
                            agentData[index]++;
                            break;
                    }
                }
            });

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['LLM', 'RAG', 'Agent'],
                    top: 'bottom'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '60px',
                    top: '30px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dates,
                    axisLine: {
                        lineStyle: {
                            color: '#909399'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'LLM',
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        data: llmData,
                        itemStyle: {
                            color: '#409EFF'
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(64,158,255,0.2)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(64,158,255,0)'
                                }]
                            }
                        }
                    },
                    {
                        name: 'RAG',
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        data: ragData,
                        itemStyle: {
                            color: '#67C23A'
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(103,194,58,0.2)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(103,194,58,0)'
                                }]
                            }
                        }
                    },
                    {
                        name: 'Agent',
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        data: agentData,
                        itemStyle: {
                            color: '#E6A23C'
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(230,162,60,0.2)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(230,162,60,0)'
                                }]
                            }
                        }
                    }
                ]
            };
            this.myChart.setOption(option);
        },
        resizeChart() {
            if (this.myChart) {
                this.myChart.resize();
            }
        },
        goToMain() {
            location.href = '/user/user_workspace';
        },
        resumeSession(sessionId,type,llmType) {
            let url = '';
            if(type == 'LLM'){
                url = '/user/user_llm_session/'+llmType+'/'+sessionId;
            }else{
                url = '/user/user_rag_session/'+sessionId;
            }
            location.href = url;

        },
        deleteSession(sessionId) {
            this.$msgbox({
                message: '确定要删除这个会话记录吗？此操作不可恢复。',
                title: '警告',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true,
                type: 'warning'
            }).then(() => {
                console.log("删除会话ID:"+sessionId);
                // 先获取记录，再删除
                this.db.chatHistory
                    .delete(sessionId)
                    .then(() => {
                        // 从本地数组中移除该会话
                        this.recentSessions = this.recentSessions.filter(s => s.id !== sessionId);
                        
                        this.$message({
                            type: 'success',
                            message: '会话已删除'
                        });
                    })
                    .catch(error => {
                        console.error('删除会话失败:', error);
                        this.$message({
                            type: 'error',
                            message: '删除会话失败'
                        });
                    });
            }).catch(() => {
                // 用户取消删除操作
            });
        },
        clearAllSessions() {
            this.$msgbox({
                message: `确定要清除全部 ${this.recentSessions.length} 条会话记录吗？此操作不可恢复。`,
                title: '警告',
                confirmButtonText: '确定清除',
                cancelButtonText: '取消',
                showCancelButton: true,
                type: 'warning',
                confirmButtonClass: 'el-button--danger'
            }).then(() => {
                console.log("清除全部会话记录");
                // 清空数据库中的所有会话记录
                this.db.chatHistory
                    .clear()
                    .then(() => {
                        // 清空本地数组
                        this.recentSessions = [];
                        
                        this.$message({
                            type: 'success',
                            message: '所有会话记录已清除'
                        });
                    })
                    .catch(error => {
                        console.error('清除会话记录失败:', error);
                        this.$message({
                            type: 'error',
                            message: '清除会话记录失败'
                        });
                    });
            }).catch(() => {
                // 用户取消清除操作
            });
        }
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
                // 这里可以根据时间范围更新图表数据
                this.initChart();
            }
        },
        recentSessions: {
            handler() {
                // 当会话数据变化时更新图表
                this.initChart();
            },
            deep: true
        }
    },
    template: "#user-list-history"
}

app.component("user-list-history", UserListHistory);
</script>

<style scoped>
.workspace-container {
    padding: 20px;
    min-height: 80vh;
    position: relative;
    width:95%;
}

.page-header {
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
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
    border-right: 3px solid var(--el-color-info);
    box-shadow: 
        0 6px 16px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.timeline-container {
    padding: 0 20px;
}

.session-group {
    margin: 10px 0;
}

.session-card {
    margin-bottom: 10px;
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
    gap: 12px;
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
    margin-left: 12px;
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

</style> 