<template id="list-db">

    <app-frame>



        <div style="text-align: left;padding-left: 20px;width: 95%;">
            <div>

                <el-button class="button" @click="gotoAdd()" type="primary">
                    <el-icon class="el-icon--left">
                        <Plus />
                    </el-icon>
                    添加新库</el-button>
            </div>


            <el-space :fill="true" wrap style="width:100%;">
                <el-card v-for="db in dbs.goodDbs" class="box-card" :key="db.id">
                    <template #header>
                        <div class="card-header">
                            <el-link class="bleft" :href="'/mag/db_detail/' + db.name" type="primary" title="查看数据库详情"
                                style="font-size: 16pt;;">
                                <el-icon>
                                    <Coin />
                                </el-icon>
                                {{ db.nickName }}（{{ db.name }}）
                            </el-link>

                            <el-button-group class="ml-4 bright">
                                <el-button type="primary" @click="gotoSearch(db.name,db.llmType,db.ifUseStreaming)">
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                    <el-text size="default" style="color:white">检索</el-text>
                                </el-button>
                                <el-button type="primary" @click="gotoAlter(db.name)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    <el-text size="default" style="color:white">编辑</el-text>
                                </el-button>
                                <el-button type="primary" @click="testDelete(db.name)">
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
                                        <trend-charts />
                                    </el-icon>
                                    状态
                                </div>
                            </template>
                            <el-tag size="small" type="success">{{ db.status }}</el-tag>
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
                            {{ this.formatTime(db.genTime) }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    数据源地址
                                </div>
                            </template>
                            <el-tooltip :content="db.tempDataSourcePath" placement="top">
                                <el-text style="max-width: 145px;" truncated type="info">
                                    {{ db.tempDataSourcePath }}
                                </el-text>
                            </el-tooltip>
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
                            {{ db.llmType }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Files />
                                    </el-icon>
                                    文件数
                                </div>
                            </template>
                            {{ db.fileNum }}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Compass />
                                    </el-icon>
                                    构建进度
                                </div>
                            </template>
                            <el-text :type="db.buildingPipeline.currentOrd==4?'success':'info'" >
                                {{ db.buildingPipeline.items[db.buildingPipeline.currentOrd-1].desc }}
                            </el-text>
                        </el-descriptions-item>

                    </el-descriptions>


                </el-card>

                <el-divider content-position="left" v-show="dbs.brokenDbs.length != 0">
                    <el-text type="danger">以下是故障数据库</el-text>
                </el-divider>


                <el-card v-for="db in dbs.brokenDbs" class="box-card" :key="db.id">
                    <template #header>
                        <div class="card-header">
                            <el-link class="bleft" :href="'/mag/db_detail/' + db.name" type="primary" title="查看数据库详情"
                                style="font-size: 16pt;;">
                                <el-icon>
                                    <Coin />
                                </el-icon>
                                {{ db.name }}
                            </el-link>

                            <el-button-group class="ml-4 bright">
                                <el-button type="primary" @click="gotoAlter(db.name)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                                <el-button type="primary" @click="testDelete(db.name)">
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
                            <el-tag size="small" type="danger">{{ db.status }}</el-tag>
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
                            {{ this.formatTime(db.genTime) }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <office-building />
                                    </el-icon>
                                    数据源地址
                                </div>
                            </template>
                            <el-tooltip :content="db.tempDataSourcePath" placement="top">
                                <el-text style="max-width: 145px;" truncated type="info">
                                    {{ db.tempDataSourcePath }}
                                </el-text>
                            </el-tooltip>
                        </el-descriptions-item>
                        <el-descriptions-item width="160px">
                            <template #label>
                                <div class="cell-item">
                                    <el-icon :style="iconStyle">
                                        <Timer />
                                    </el-icon>
                                    故障原因
                                </div>
                            </template>
                            <el-text type="danger">
                                {{ db.brokenMsg }}
                            </el-text>

                        </el-descriptions-item>

                    </el-descriptions>

                </el-card>


            </el-space>
        </div>

    </app-frame>



</template>
<script>

const ListDb = {
    mounted() {
        this.requestData();
    },
    data() {
        return {
            message: "Hello Element Plus",
            dbs: {
                goodDbs: [],
                brokenDbs: [],
            }
        };
    },
    methods: {
        gotoSearch(db,llmType,ifStream) {
            // location.href = ("/mag/list_db")
            let url = '/mag/db_search/' + db
            if( ifStream){
                url = '/mag/db_search_stream/' + db
            }
            location.href = url
        },
        gotoAdd() {
            console.log("ready goto")
            location.href = ("/mag/alter_db")
            // this.$router.push({ path: '/alter_db' })
        },
        gotoAlter(db) {
            console.log("ready goto")
            location.href = ("/mag/alter_db/" + db)
            // this.$router.push({ path: '/alter_db/' + db })
        },
        testDelete(db) {
            this.$msgbox(
                {
                    message: '确定要删除本数据库吗？这将删除关联的所有文本块和向量！',
                    title: '警告',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    showCancelButton: true,
                    type: 'warning',
                }
            ).then(() => {
                console.log("deleting..." + db)
                this.doDelete(db);
            }).catch(() => { });
        },
        doDelete(db) {
            let url = "/api/delete_db";
            params = { "db": db };
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                console.log(response.data);
                location.href = ("/mag/list_db")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });
        },
        requestData() {
            let url = "/api/list_db";
            axios.get(url).then((response) => {
                this.dbs = response.data;
                console.log(response.data);
            });
            //let url = helper.getServiceApiAddr()+"api/list_db";
            // fetch(url).then(response => response.json()
            // ).then((data) => {
            //     //this.databases = response.data;
            //     //this.databases = JSON.stringify(data);
            //     this.databases = data;
            //     console.log(this.databases);


            // });
        },
        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-db"
};

app.component("list-db", ListDb);
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
</style>




