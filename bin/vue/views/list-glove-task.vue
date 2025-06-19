<template id="list-glove-task">

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
                    *词向量训练会基于文本库的领域词汇识别和分词结果，训练新的能够体现领域特色的词向量表征，提升检索和其它AI应用效果。
                </el-text><br />
                <el-text type="warning" size="small">
                    *本功能适用于大规模文本数据场景，系统会优先使用文本库的自定义词向量训练结果，取代全局词向量库。
                </el-text>
            </div>

            <el-space :fill="true" wrap style="width:100%;">
                <el-card v-for="task in tasks" class="box-card" :key="task.id">
                    <template #header>
                        <div class="card-header" style="margin-bottom: 0px;">

                            <el-text style="font-size: 16pt;;">
                                <el-icon>
                                    <Coin />
                                </el-icon>
                                目标库：{{ task.dbName }}
                            </el-text>


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
                                        <office-building />
                                    </el-icon>
                                    词向量长度
                                </div>
                            </template>
                            {{ task.vectorSize }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    窗口长度
                                </div>
                            </template>
                            {{ task.windowSize }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Monitor />
                                    </el-icon>
                                    迭代训练次数
                                </div>
                            </template>
                            {{ task.trainIterations }}
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

                    </el-descriptions>

                </el-card>

            </el-space>
        </div>

    </app-frame>



</template>
<script>

const ListGloveTask = {
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
            location.href = ("/mag/alter_glove_task")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(task) {
            location.href = ("/mag/alter_glove_task/" + task)
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
            let url = "/api/delete_glove_task";
            params = { "task_id": task };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_glove_task")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_glove_task";
            axios.get(url).then((response) => {
                this.tasks = response.data;
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-glove-task"
};

app.component("list-glove-task", ListGloveTask);
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


