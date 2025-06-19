<template id="react-agent-detail">

    <app-frame>

        <div style="padding-left: 20px; ">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ agent_id == null ? '' : '查看ReAct Agent配置详情' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <el-descriptions class="margin-top" :title="agent.name" :column="2" border>

                <el-descriptions-item width="170px">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            最大迭代次数
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ agent.maxRound }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item>
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


                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            Agent介绍
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ agent.desc }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Message-Box />
                            </el-icon>
                            用户指导
                        </div>
                    </template>
                    <el-text type="info" size="small">
                        {{ agent.userInstruction }}
                    </el-text>
                </el-descriptions-item>


                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            挂载文本库
                        </div>
                    </template>
                    {{ this.testJoin(agent.textDbs) }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <trend-charts />
                            </el-icon>
                            Agent工具
                        </div>
                    </template>
                    {{ this.testJoin(agent.tools) }}
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            大模型挂载
                        </div>
                    </template>
                    推理： {{ agent.reasoningLLM }}，行动： {{ agent.actLLM }}，观察： {{ agent.observeLLM }}
                </el-descriptions-item>



                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            推理步大模型提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ agent.reasonPrompt }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            推理收敛步大模型提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ agent.forceReasonPrompt }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            行动步大模型提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ agent.actPrompt }}
                    </el-text>
                </el-descriptions-item>

                <el-descriptions-item span="2">
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <Monitor />
                            </el-icon>
                            观察步大模型提示模板
                        </div>
                    </template>
                    <el-text class="mx-1" type="info" size="small">
                        {{ agent.observePrompt }}
                    </el-text>
                </el-descriptions-item>

            </el-descriptions>

        </div>

    </app-frame>

</template>



<script>

const ReActAgentDetail = {
    mounted() {
        this.agent_id = this.$javalin.pathParams["agent_id"];
        if (this.agent_id != null) {
            this.fetchAgentData(this.agent_id);
        }
    },
    data() {
        return {
            agent_id: '',
            agent: {
                id: '',
                name: '',
                maxRound: 3,
                desc: '',
                userInstruction: '',
                reasonPrompt: '',
                forceReasonPrompt: '',
                actPrompt: '',
                observePrompt: '',
                reasoningLLM: '',
                actLLM: '',
                observeLLM: '',
                textDbs: '',
                tools: '',
                genTime: '',
                ord: 1,
            },
        }
    },
    methods: {
        gotoList() {
            // console.log("ready goto")
            location.href = ("/mag/list_react_agent")
        },
        testJoin(arrs) {
            try { return arrs.join("，"); } catch (err) { return "";}
        },
        fetchAgentData(agent_id) {
            let url = "/api/react_agent_detail/" + agent_id;
            axios.get(url).then((response) => {
                this.agent = response.data;
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }
    },
    template: "#react-agent-detail"
};

app.component("react-agent-detail", ReActAgentDetail);
</script>

<style></style>
