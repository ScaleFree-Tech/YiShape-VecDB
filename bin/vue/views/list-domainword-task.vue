<template id="list-domainword-task">

    <app-frame>

        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <div>
                <el-button class="button" @click="gotoAdd()" type="primary">
                    <el-icon class="el-icon--left">
                        <Plus />
                    </el-icon>
                    添加新任务
                </el-button>
            </div>

            <div class="infoBox">
                <el-text type="info" size="medium">
                    *领域词汇识迭代分析所有文本块内容中的专业领域词汇，以供内部的分词模型使用。识别文本库中的领域词汇能大幅提升BM25检索算法的性能。
                </el-text><br />
                <el-text type="warning">
                    *迭代任务会产生海量的大模型调用，如果您使用的收费的大模型（如ChatGLM4），请谨慎使用。
                </el-text>
            </div>

            <el-space :fill="true" wrap style="width:100%;">
                <el-card v-for="task in tasks" class="box-card" :key="task.id">
                    <template #header>
                        <div class="card-header" style="margin-bottom: 25px;">
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
                            <el-tag size="small" type="success">{{ task.status }}</el-tag>
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
                                    辅助大模型
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
                                    数据输出地址
                                </div>
                            </template>
                            <el-tooltip :content="task.outputPath" placement="top">
                                <el-text style="max-width: 500px;" truncated type="info">
                                    {{ task.outputPath }}
                                </el-text>
                            </el-tooltip>
                        </el-descriptions-item>
                    </el-descriptions>

                </el-card>

            </el-space>
        </div>

    </app-frame>

</template>
<script>

const ListDomainwordTask = {
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
            location.href = ("/mag/alter_domainword_task")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(task) {
            location.href = ("/mag/alter_domainword_task/" + task)
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
            let url = "/api/delete_domainword_task";
            params = { "task_id": task };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_domainword_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_domainword_task";
            axios.get(url).then((response) => {
                this.tasks = response.data;
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-domainword-task"
};

app.component("list-domainword-task", ListDomainwordTask);
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


