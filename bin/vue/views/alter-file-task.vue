<template id="alter-file-task">

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
                    <el-form-item label="任务名称">
                        <el-input v-model="task.name" placeholder="请输入标识该任务的名称"  />
                    </el-form-item>

                    <el-form-item label="目标数据库">
                        <el-select v-model="task.dbName" placeholder="选择数据库">
                            <el-option v-for="db in dbs" :key="db.name" :label="db.nickName+'（'+db.name+'）'" :value="db.name" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="结果输出绝对路径">
                        <el-input v-model="task.outputPath" placeholder="结果输出绝对路径" />
                    </el-form-item>

                    <el-form-item label="大模型挂载">
                        <el-select v-model="task.modelExpr" placeholder="选择挂载的大模型">   
                            <el-option v-for="item in llms" :key="item.modelExpr" :label="item.modelExpr" :value="item.modelExpr" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="大模型系统提示模板">
                        <el-input v-model="task.sysPrompt" type="textarea" :rows="6" />
                    </el-form-item>

                    <el-form-item label="大模型用户提示模板">
                        <el-input v-model="task.userPrompt" type="textarea" :rows="6" />
                    </el-form-item>
                    <div class="errorMsg" >
                        <el-text size="small" type="info">
                            ${content}为内部变量，表示迭代中的每个文件内容。
                        </el-text>
                    </div>
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
                            :disabled="task.name == '' || task.dbName == '' || task.modelExpr == ''">提交</el-button>
                        <el-button @click="gotoList()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </app-frame>



</template>
<script>

const AlterFileTask = {
    mounted() {
        this.task_id = this.$javalin.pathParams["task_id"];
        if (this.task_id != null) {
            this.fetchTaskData(this.task_id);
        }
        this.fetchDBData();
        this.loadLLMModels();
        // console.log(this.$javalin.pathParams);
    },
    data() {
        return {
            task_id: '',
            task: {
                id: '',
                name: '',
                dbName: '',
                outputPath: 'D:\\test',
                modelExpr: '',
                sysPrompt: '你是一个对文档内容进行分类的工具。',
                userPrompt: '${content}。请根据用户输入的前述文档内容，判定文档的类别，并以{"类别":文档类别, "判定原因": 原因说明}的JSON格式返回。',
                desc: '',
            },
            llms: [],
            dbs: [],
        }
    },
    methods: {
        loadLLMModels() {
                    let url = "/llm/get_all/batch";
                    axios.get(url).then((response) => {
                        this.llms = response.data;
                        if (this.llms.length > 0 && this.task_id == null) {
                            this.task.modelExpr = this.llms[0].modelExpr;
                        }
                        console.log(this.llms);
                    });
        },
        gotoList() {
            location.href = ("/mag/list_file_task")
        },
        onSubmit() {
            let url = "/api/alter_file_task";
            console.log("data:" + JSON.stringify(this.task));
            axios.post(url, this.task, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                // console.log(response.data);
                location.href = ("/mag/list_file_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchTaskData(task_id) {
            let url = "/api/file_task_detail/" + task_id;
            // console.log(url);
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.task = response.data;
                // console.log(response.data);
            });
        },
        fetchDBData() {
            let url = "/api/list_text_db";
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.dbs = response.data.goodDbs;
                // console.log(response.data);
            });
        }
    },
    template: "#alter-file-task"
};

app.component("alter-file-task", AlterFileTask);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 140px;
}
</style>


