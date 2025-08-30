<template id="alter-api-key">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">修改API KEY</el-text>
                </template>
            </el-page-header>
            <hr />


            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">


                    <el-form-item label="当前API KEY">
                        <el-input v-model="form.apiKey" placeholder="当前API KEY" readonly />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            生成的API KEY用于API调用时使用，请妥善保管。通过HTTP请求时请将API KEY放在Authorization头中。一旦泄露，请及时修改。
                        </el-text>
                    </div>
                    <el-form-item label="操作">
                        <el-button type="primary" @click="generateKey">生成新的API KEY</el-button>
                    </el-form-item>
                    


                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存设置</el-button>
                    </el-form-item>
                </el-form>
                <div class="clearfloat"></div>
            </div>
        </div>

    </app-frame>



</template>
<script>

const AlterApiKey = {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            form: {
                queryPort: '7090',
                defaultWordDocTransMethod: 'TF_IDF',
                scanInterval: '50',
                dbStorageRoot: 'D:\\rere_vector_db\\',
                pathType: 'RELATIVE',
                word2vecFileCn: '',
                word2vecFileEn: '',
                ifReRankForWebSearch: false,
                apiKey: '',
            },
            result: '',
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/")
            // this.$router.push({ path: '/list_db' })
        },
        onSubmit() {
            let url = "/api/alter_config";
            axios.post(url, this.form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.result = response.data;
                console.log(response.data);
                this.$message({
                    title: '修改结果',
                    message: this.result == 'ok' ? '修改成功！' : '修改失败！',
                    type: this.result == 'ok' ? 'success' : 'error',
                });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchData() {
            let url = "/api/config"
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
            });
        },
        generateKey() {
            let url = "/api/generate_api_key"
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form.apiKey = response.data;
                console.log(this.form.apiKey);
            });
        }
    },
    template: "#alter-api-key"
};

app.component("alter-api-key", AlterApiKey);
</script>
<style>
.clearfloat {

    clear: both;
}

.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 95px;
}
</style>
