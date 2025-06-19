<template id="alter-domainword-task2">

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

                    <el-form-item label="目标数据库">
                        <el-select v-model="task.dbName" placeholder="选择数据库" :disabled="task_id!=null">
                            <el-option v-for="db in dbs" :key="db.name" :label="db.nickName + '（' + db.name + '）'"
                                :value="db.name" />
                        </el-select>
                    </el-form-item>
<!--
                    <el-form-item label="辅助大模型">
                        <el-select v-model="task.llmType" placeholder="选择挂载的大模型">
                            <el-option v-for="item in llms" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
-->

                    <el-form-item label="词最小长度">
                        <el-input-number id="num1" v-model="task.minLen" :step="1" :min="2" :max="5" placeholder="识别的词的最小长度" />
                    </el-form-item>

                    <el-form-item label="词最小长度">
                        <el-input-number id="num2" v-model="task.maxLen" :step="1" :min="6" :max="20" placeholder="识别的词的最大长度" />
                    </el-form-item>

                    <el-form-item label="保留词数">
                        <el-input v-model="task.totalNum" placeholder="保留的总词数" />
                    </el-form-item>

                    <el-form-item label="任务介绍">
                        <el-input v-model="task.desc" type="textarea" />
                    </el-form-item>

                    <div v-show="task_id != null">
                        <el-text type="warning">
                            注意：修改后任务将重新开始，原任务输出结果将被覆盖！
                        </el-text>
                    </div>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit"
                            :disabled="task.name == '' || task.dbName == ''">提交</el-button>
                        <el-button @click="gotoList()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </app-frame>



</template>
<script>

const AlterDomainwordTask2 = {
    mounted() {
        this.task_id = this.$javalin.pathParams["task_id"];
        if (this.task_id != null) {
            this.fetchTaskData(this.task_id);
        }
        this.fetchDBData();
        // console.log(this.$javalin.pathParams);
    },
    data() {
        return {
            task_id: '',
            task: {
                id: '',
                dbName: '',
                llmType: 'Ollama',
                minLen: 2,
                maxLen: 12,
                totalNum: 800,
                desc: '',
            },
            llms: getTaskLLMTypes(),
            dbs: [],
        }
    },
    methods: {
        gotoList() {
            location.href = ("/mag/list_domainword_task2")
        },
        onSubmit() {
            let url = "/api/alter_domainword_task2";
            console.log("data:" + JSON.stringify(this.task));
            axios.post(url, this.task, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                // console.log(response.data);
                location.href = ("/mag/list_domainword_task2")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchTaskData(task_id) {
            let url = "/api/domainword_task_detail2/" + task_id;
            // console.log(url);
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.task = response.data;
                // console.log(response.data);
            });
        },
        fetchDBData() {
            let url = "/api/list_db";
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.dbs = response.data.goodDbs;
                // console.log(response.data);
            });
        }
    },
    template: "#alter-domainword-task2"
};

app.component("alter-domainword-task2", AlterDomainwordTask2);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 140px;
}
</style>
