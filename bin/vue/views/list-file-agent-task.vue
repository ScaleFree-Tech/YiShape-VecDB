<template id="list-file-task">

    <app-frame>



        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <div>

                <el-button class="button" @click="gotoAdd()" type="primary">
                    <el-icon class="el-icon--left">
                        <Plus />
                    </el-icon>
                    添加新任务</el-button>
            </div>
            <div class="infoBox">
                <el-text type="info" size="small">
                    *文件迭代任务使用大模型按照提示词分析指定数据库源文件路径中每个文件的内容。
                    由于大部分大模型有输入文本的长度限制，每次分析一个文件中的全部内容，可能导致大模型输入溢出。
                </el-text><br />
                <el-text type="warning" size="small">
                    *除非有特殊需求（如文档分类）、并能保证文件内容较少，否则不建议使用本方法迭代分析。
                </el-text>
            </div>

            <el-space :fill="true" wrap style="width:100%;">
                <el-card v-for="task in tasks" class="box-card" :key="task.id">
                    <template #header>
                        <div class="card-header">
                            <el-link class="bleft" :href="'/mag/file_task_detail/' + task.id" type="primary"
                                title="查看任务详情" style="font-size: 16pt;;">
                                <el-icon>
                                    <trend-charts />
                                </el-icon>
                                {{ task.name }}
                            </el-link>

                            <el-button-group class="ml-4 bright">
                                <el-button type="primary" @click="gotoAlter(task.id)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button type="primary" @click="testDelete(task.id)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon></el-button>
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
                                    任务数据库
                                </div>
                            </template>
                            <el-tag size="small" type="success">{{ task.dbName }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <trend-charts />
                                    </el-icon>
                                    状态
                                </div>
                            </template>
                            <el-tag size="small" :type="task.status == 'FINISHED' ? 'success' : 'warning'">{{ task.status }}</el-tag>
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
                            {{ this.formatTime(task.genTime) }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Monitor />
                                    </el-icon>
                                    大模型挂载
                                </div>
                            </template>
                            {{ task.llmType }}
                        </el-descriptions-item>

                        <el-descriptions-item span="2">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    下载识别结果
                                </div>
                            </template>
                            <el-link :href="'/download2?type=file_task&id=' + task.id"  target="_blank"
                                :disabled="task.status != 'FINISHED'" type="primary">
                                <el-text  type="primary">
                                    结果文件
                                </el-text>
                            </el-link>
                        </el-descriptions-item>

                    </el-descriptions>

                </el-card>

            </el-space>
        </div>

    </app-frame>



</template>
<script>

const ListFileTask = {
    mounted() {
        this.requestData();
    },
    data() {
        return {
            message: "Hello Element Plus",
            tasks: {
            }
        };
    },
    methods: {
        gotoAdd() {
            location.href = ("/mag/alter_file_task")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(task) {
            location.href = ("/mag/alter_file_task/" + task)
            // this.$router.push({ path: '/alter_db/' + db })
        },
        testDelete(task) {
            this.$msgbox(
                {
                    message: '确定要删除本任务吗？这将删除关联的挖掘结果数据！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                console.log("deleting..." + task)
                this.doDelete(task);
            }).catch(() => { });
        },
        doDelete(task) {
            let url = "/api/delete_file_task";
            params = { "task_id": task };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_file_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_file_task";
            axios.get(url).then((response) => {
                this.tasks = response.data;
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-file-task"
};

app.component("list-file-task", ListFileTask);
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










