<template id="list-react-agent">

    <app-frame>



        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <div>

                <el-button class="button" @click="gotoAdd()" type="primary">
                    <el-icon class="el-icon--left">
                        <Plus />
                    </el-icon>
                    添加新Agent</el-button>
            </div>

            <div class="infoBox">
                <el-text type="info" size="small">
                    *ReAct Agent是一种将大模型对问题的解答设计为迭代式 推理、行动、观察 三个步骤的交互策略，旨在通过迭代调用本地函数逐步增强大模型的信息与功能。
                </el-text><br />
            </div>

            <el-space :fill="true" wrap style="width:100%;">
                
                <el-card v-for="agent in agents" class="box-card" :key="agent.id">
                    <template #header>
                        <div class="card-header" >

                            <el-link class="bleft" :href="'/mag/react_agent_detail/' + agent.id" type="primary" title="查看配置详情"
                                style="font-size: 16pt;;">
                                <el-icon>
                                    <Bicycle />
                                </el-icon>
                                {{ agent.name }}
                            </el-link>
                            <el-button-group class="ml-4 bright">

                                <el-button type="primary" @click="startSession(agent.id)">
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                    <el-text size="default" style="color:white">检索</el-text>
                                </el-button>

                                <el-button type="primary" @click="gotoAlter(agent.id)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    <el-text size="default" style="color:white">修改</el-text>
                                </el-button>
                                <el-button type="primary" @click="testDelete(agent.id)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    <el-text size="default" style="color:white">删除</el-text>
                                </el-button>
                            </el-button-group>
                        </div>
                    </template>


                    <el-descriptions class="margin-top" :column="2" :size="size" border>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Coin />
                                    </el-icon>
                                    最大迭代次数
                                </div>
                            </template>
                            <el-tag size="small" type="success">{{ agent.maxRound }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Timer />
                                    </el-icon>
                                    创建时间
                                </div>
                            </template>
                            {{ this.formatTime(agent.genTime) }}
                        </el-descriptions-item>
                        
                        <el-descriptions-item span="2">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    Agent介绍
                                </div>
                            </template>
                            {{ agent.desc }}
                        </el-descriptions-item>


                    </el-descriptions>

                </el-card>

            </el-space>
        </div>

    </app-frame>



</template>
<script>

const ListReActAgent = {
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
        gotoAdd() {
            location.href = ("/mag/alter_react_agent")
            // this.$router.push({ path: '/alter_db' })
        },
        startSession(id){
            location.href = ("/mag/react_agent_session/" + id)
        },
        gotoAlter(id) {
            location.href = ("/mag/alter_react_agent/" + id)
            // this.$router.push({ path: '/alter_db/' + db })
        },
        testDelete(agent) {
            this.$msgbox(
                {
                    message: '确定要删除本Agent吗？这将删除所有关联的Agent会话！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                console.log("deleting..." + agent)
                this.doDelete(agent);
            }).catch(() => { });
        },
        doDelete(agent) {
            let url = "/api/delete_react_agent";
            params = { "agent_id": agent };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_react_agent")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_react_agent";
            axios.get(url).then((response) => {
                this.agents = response.data;
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-react-agent"
};

app.component("list-react-agent", ListReActAgent);
</script>
<style>
.bleft {
    /* justify-content: flex-start;
  display: flex; */
    display: inline-block;
}

.bright {
    /* flex:1;           
  justify-content: flex-end;
  display: flex; */
    float: right;
}

.infoBox{
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}
</style>


