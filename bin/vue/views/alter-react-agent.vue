<template id="alter-react-agent">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ task_id == null ? '添加新任务' : '修改任务' }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <div style="text-align: center;width:100%;">
                <el-form :model="task" label-width="auto">

                    <el-form-item label="Agent名称">
                        <el-input v-model="agent.name" placeholder="文本库在界面显示的名称" />
                    </el-form-item>

                    <el-form-item label="最大迭代次数">
                        <el-input-number v-model="agent.maxRound" :step="1" min="1" max="5"
                            placeholder="请输入Agent在界面上的排序次序。" />
                    </el-form-item>

                    <el-form-item label="用户指导语">
                        <el-input v-model="agent.userInstruction" type="textarea" />
                    </el-form-item>

                    <el-form-item label="Agent介绍">
                        <el-input v-model="agent.desc" type="textarea" />
                    </el-form-item>


                    <el-form-item label="推理步大模型">
                        <el-select v-model="agent.reasoningLLM" placeholder="选择挂载的大模型">
                            <el-option v-for="item in llms" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="推理步提示词">
                        <el-input v-model="agent.reasonPrompt" type="textarea" :rows="6" />
                    </el-form-item>

                    <el-form-item label="观察步大模型">
                        <el-select v-model="agent.observeLLM" placeholder="选择挂载的大模型">
                            <el-option v-for="item in llms" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="观察步提示词">
                        <el-input v-model="agent.observePrompt" type="textarea" :rows="6" />
                    </el-form-item>

                    <el-form-item label="挂载数据库">
                        <el-checkbox-group v-model="agent.textDbs">
                            <el-checkbox v-for="db in dbs" :key="db.name" :label="db.nickName" :value="db.name" />
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="挂载Agent工具">
                        <el-checkbox-group v-model="agent.tools">
                            <el-checkbox v-for="t in tools" :key="t.name" :label="t.nickName" :value="t.name" />
                        </el-checkbox-group>
                    </el-form-item>


                    <el-form-item label="次序">
                        <el-input-number v-model="agent.ord" :step="1" min="1" max="100"
                            placeholder="请输入Agent在界面上的排序次序。" />
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" :disabled="agent.name == ''">提交</el-button>
                        <el-button @click="gotoList()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </app-frame>

</template>
<script>

const AlterReActAgent = {
    mounted() {
        this.fetchDBData();
        this.agent_id = this.$javalin.pathParams["agent_id"];
        if (this.agent_id != null) {
            this.fetchAgentData(this.agent_id);
        }
        // console.log(this.$javalin.pathParams);
    },
    data() {
        return {
            agent_id: '',
            // selectedDbs: [],
            // selectedTools: [],
            agent: {
                id: '',
                name: '',
                maxRound: 3,
                desc: '',
                userInstruction: '',
                reasonPrompt: getReActReasoningPrompt(),
                observePrompt: getReActObservePrompt(),
                reasoningLLM: 'YiShape',
                observeLLM: 'YiShape',
                textDbs: [],
                tools: [],
                genTime: '',
                ord: 1,
            },
            dbs: [],
            tools: [
                { name: 'WebSearch', nickName: '互联网搜索引擎' },
                { name: 'LocalTime', nickName: '当前时间计算' },
                { name: 'Address', nickName: '当前地址计算' },
            ],
            llms: getRAGLLMTypes(),
        }
    },
    methods: {
        gotoList() {
            location.href = ("/mag/list_react_agent")
        },
        onSubmit() {
            let url = "/api/alter_react_agent";
            this.agent.textDbsStr = this.agent.textDbs.join(",");
            this.agent.toolsStr = this.agent.tools.join(",");
            console.log("data:" + JSON.stringify(this.agent));
            axios.post(url, this.agent, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                // console.log(response.data);
                location.href = ("/mag/list_react_agent")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchAgentData(agent_id) {
            let url = "/api/react_agent_detail/" + agent_id;
            // console.log(url);
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.agent = response.data;
                if(this.agent.textDbs == null)this.agent.textDbs=[];
                if(this.agent.tools == null)this.agent.tools=[];
                // if (this.agent.textDbs != null) {
                //     let ts = JSON.stringify(this.agent.textDbs).trim();
                //     let ds = ts.split(",");
                //     for (const d of ds) {
                //         if(d!=""){
                //             this.selectedDbs.push(d);
                //         }
                //     }
                // }
                // if (this.agent.tools != null) {
                //     let ts = JSON.stringify(this.agent.tools).trim();
                //     let ds = ts.split(",");
                //     for (const d of ds) {
                //         if(d!=""){
                //             this.selectedTools.push(d);
                //         }
                //     }
                // }
                console.log(response.data);
            });
        },
        fetchDBData() {
            let url = "/api/list_db";
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.dbs = response.data.goodDbs;
                console.log(response.data);
            });
        }
    },
    template: "#alter-react-agent"
};

app.component("alter-react-agent", AlterReActAgent);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 123px;
}
</style>
