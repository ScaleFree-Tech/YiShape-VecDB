<template id="list-domainword-task2">

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
                <el-text type="info" size="small">
                    *本功能会调用系统内置的机器学习模型识别指定文本库中所有的专业领域词汇，以加强系统的分词结果。更好的分词结果不仅能大幅提升BM25检索算法的性能，也是训练能体现专业领域特色的词向量表征的基础。
                </el-text><br />
                <el-text type="warning" size='small'>
                    *该功能适用于大规模文本数据场景，运行时消耗一定内存，请参照文档评估您的文本库内存消耗需求，防止内存崩溃。
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
                            <el-tag size="small"  :type="task.status == 'FINISHED' ? 'success' : 'warning'">{{ task.status }}</el-tag>
                        </el-descriptions-item>

                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Monitor />
                                    </el-icon>
                                    词最小长度
                                </div>
                            </template>
                            {{ task.minLen }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Monitor />
                                    </el-icon>
                                    词最大长度
                                </div>
                            </template>
                            {{ task.maxLen }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Monitor />
                                    </el-icon>
                                    保留词数
                                </div>
                            </template>
                            {{ task.totalNum }}
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

                        <el-descriptions-item span="2">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    下载识别结果
                                </div>
                            </template>
                            <el-link :href="'/download2?type=domainword&id=' + task.id"  target="_blank"
                                :disabled="task.status != 'FINISHED'" type="primary">
                                <el-text  type="primary">
                                    词汇文件
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

const ListDomainwordTask2 = {
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
            location.href = ("/mag/alter_domainword_task2")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(task) {
            location.href = ("/mag/alter_domainword_task2/" + task)
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
            let url = "/api/delete_domainword_task2";
            params = { "task_id": task };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_domainword_task2")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_domainword_task2";
            axios.get(url).then((response) => {
                this.tasks = response.data;
                console.log(response.data);
            });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-domainword-task2"
};

app.component("list-domainword-task2", ListDomainwordTask2);
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

.infoBox {
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}
</style>
