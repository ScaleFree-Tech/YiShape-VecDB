<template id="alter-glove-task">

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
                            <el-option v-for="db in dbs" :key="db.name" :label="db.name" :value="db.name" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="词向量长度">
                        <el-select v-model="task.vectorSize" placeholder="选择向量长度">
                            <el-option v-for="item in vecLens" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="窗口长度">
                        <el-select v-model="task.windowSize" placeholder="选择窗口长度">
                            <el-option v-for="item in windows" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="迭代训练次数">
                        <el-input-number v-model="task.trainIterations" :step="1" min="10" max="100" placeholder="请输入迭代训练次数，一般为10-100。"/>
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

const AlterGloveTask = {
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
                trainIterations: 10,
                vectorSize:100,
                windowSize:3,
                desc: '',
            },
            vecLens: [
                {value:50,label:50},
                {value:100,label:100},
                {value:200,label:200},
                {value:300,label:300}
            ],
            windows: [
                {value:3,label:3},
                {value:5,label:5}
            ],
            dbs: [],
            llms: [],
        }
    },
    methods: {
        gotoList() {
            location.href = ("/mag/list_glove_task")
        },

        onSubmit() {
            let url = "/api/alter_glove_task";
            console.log("data:" + JSON.stringify(this.task));
            axios.post(url, this.task, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                // console.log(response.data);
                location.href = ("/mag/list_glove_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchTaskData(task_id) {
            let url = "/api/glove_task_detail/" + task_id;
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
    template: "#alter-glove-task"
};

app.component("alter-glove-task", AlterGloveTask);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 140px;
}
</style>

