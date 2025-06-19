<template id="alter-config">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">修改系统配置</el-text>
                </template>
            </el-page-header>
            <hr />


            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="端口号">
                        <el-input v-model="form.queryPort" placeholder="请输入系统的TCP端口号"  />
                    </el-form-item>
                    <div class="errorMsg" >
                        <el-text size="small" type="info">
                            本系统服务所在服务器的TCP端口号，必须重启服务后才能生效
                        </el-text>
                    </div>
                    <el-form-item label="默认词句向量转换方法">
                        <el-select v-model="form.defaultWordDocTransMethod" placeholder="请选择词句向量的转换方法">
                            <el-option v-for="item in transMethods" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg" >
                        <el-text size="small" type="info">
                            指的是外部API调用本系统进行向量化但未指定具体文本库时如何操作
                        </el-text>
                    </div>
                    <el-form-item label="扫描间隔（秒）">
                        <el-input v-model="form.scanInterval" placeholder="请输入系统对数据源文件夹的扫描间隔，以秒为单位" />
                    </el-form-item>
                    <div class="errorMsg" >
                        <el-text size="small" type="info">
                            指的是系统扫描数据库中文件变更情况的间隔
                        </el-text>
                    </div>


                    <el-form-item label="服务器存储根路径">
                        <el-input v-model="form.dbStorageRoot" placeholder="请输入数据库文件的存储路径" />
                    </el-form-item>

                    <div class="errorMsg" >
                        <el-text size="small" type="info">
                            绝对路径示例：D:\rere_vector_db，相对路径示例：/db_data
                        </el-text>
                    </div>

                    <el-form-item label="存储根路径类型">
                        <el-select v-model="form.pathType" placeholder="请选择路径类型">
                            <el-option v-for="item in pathTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Web查询结果精排">
                        <el-switch v-model="form.ifReRankForWebSearch" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            利用内置的深度学习模型对Web查询结果进行再次精排序，提升搜索质量，但速度会降低。
                        </el-text>
                    </div>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <div class="clearfloat"></div>
            </div>
        </div>

    </app-frame>



</template>
<script>

const AlterConfig = {
    mounted() {
            this.fetchData();
    },
    data() {
        return {
            form: {
                queryPort: '7090',
                defaultWordDocTransMethod: 'TF_IDF',
                scanInterval: '50',
                dbStorageRoot:'D:\\rere_vector_db\\',
                pathType:'RELATIVE',
                word2vecFileCn:'',
                word2vecFileEn:'',
                ifReRankForWebSearch:false,
            },
            transMethods: [{ value: 'TF_IDF', label: '句向量为词向量的TF-IDF加权均值' },
            { value: 'AVERAGE', label: '句向量为词向量的平均值' }],
            pathTypes: [{ value: 'RELATIVE', label: '相对路径' },
            { value: 'ABSOLUTE', label: '绝对路径' }],
            result:'',
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
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
                    message: this.result=='ok'?'修改成功！':'修改失败！',
                    type: this.result=='ok'?'success':'error',
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
        }
    },
    template: "#alter-config"
};

app.component("alter-config", AlterConfig);
</script>
<style>
.clearfloat {

    clear: both;
}

.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 155px;
}

</style>

