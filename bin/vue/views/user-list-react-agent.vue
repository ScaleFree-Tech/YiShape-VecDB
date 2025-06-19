<template id="user-list-react-agent">
    <user-frame>
        <div class="container">
            <el-page-header @back="goToMain()" class="page-header">
                <template #content>
                    <el-text class="page-title" size="large">ReAct Agent</el-text>
                </template>
            </el-page-header>
            
            <div class="content-wrapper">
                <el-space :fill="true" wrap style="width:100%;">
                    <el-card v-for="agent in agents" 
                            class="db-card" 
                            :key="agent.id"
                            :body-style="{ padding: '0px' }"
                            shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <div class="header-left">
                                    <el-icon class="header-icon"><Bicycle /></el-icon>
                                    <span class="db-name">{{ agent.name }}</span>
                                </div>
                                <el-button type="primary" 
                                         class="search-button"
                                         @click="startSession(agent.id)">
                                    <el-icon><Search /></el-icon>
                                    开启Agent会话
                                </el-button>
                            </div>
                        </template>

                        <el-descriptions class="db-info" :column="2" :size="size" border>
                            <el-descriptions-item width="240px">
                                <template #label>
                                    <div class="info-label">
                                        <el-icon><Coin /></el-icon>
                                        最大迭代次数
                                    </div>
                                </template>
                                <el-tag size="small" type="success" class="status-tag">{{ agent.maxRound }}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template #label>
                                    <div class="info-label">
                                        <el-icon><Timer /></el-icon>
                                        创建时间
                                    </div>
                                </template>
                                {{ this.formatTime(agent.genTime) }}
                            </el-descriptions-item>

                            <el-descriptions-item span="2">
                                <template #label>
                                    <div class="info-label">
                                        <el-icon><office-building /></el-icon>
                                        Agent介绍
                                    </div>
                                </template>
                                <div class="agent-desc">{{ agent.desc }}</div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                </el-space>
            </div>
        </div>
    </user-frame>
</template>




<script>

const UserListReActAgent = {
    mounted() {
        this.requestData();
    },
    data() {
        return {
            message: "Hello Element Plus",
            agents: {
            }
        };
    },
    methods: {

        startSession(id) {
            location.href = ("/user/user_react_agent_session/" + id)
        },
        requestData() {
            let url = "/api/list_react_agent";
            axios.get(url).then((response) => {
                this.agents = response.data;
                // console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        },
        goToMain() {
            location.href = '/user/user_workspace';
        }

    },
    template: "#user-list-react-agent"
};

app.component("user-list-react-agent", UserListReActAgent);
</script>


<style scoped>
.container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    width: 95%;
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

.content-wrapper {
    margin-top: 24px;
}

.db-card {
    width: 100%;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
}

.db-card:hover {
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon {
    font-size: 20px;
    color: #409EFF;
}

.db-name {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
}

.search-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.search-button:hover {
    transform: scale(1.02);
}

.db-info {
    padding: 20px;
}

.info-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #606266;
}

.info-label .el-icon {
    font-size: 16px;
    color: #909399;
}

.status-tag {
    border-radius: 4px;
    padding: 4px 8px;
}

.agent-desc {
    line-height: 1.6;
    color: #606266;
    font-size: 14px;
}

:deep(.el-descriptions__cell) {
    padding: 16px !important;
}

:deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #ebeef5;
}

@media (max-width: 768px) {
    .container {
        padding: 16px;
    }
    
    .db-card {
        margin-bottom: 16px;
    }
}
</style>
