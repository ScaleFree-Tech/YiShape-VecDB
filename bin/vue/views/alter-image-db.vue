<template id="alter-image-db">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '添加新图像库' : '修改' + db }} </el-text>
                </template>
            </el-page-header>
            <hr />

            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="图像库显示名称">
                        <el-input v-model="form.nickName" placeholder="图像库在界面显示的名称" @blur="checkNickName()" />
                    </el-form-item>
                    <div class="errorMsg" v-show="!this.checkNickNameResult">
                        <el-text size="small" type="danger">该显示名称不能不空</el-text>
                    </div>

                    <el-form-item label="唯一英文标识">
                        <el-input v-model="form.name" placeholder="该标识为图像库识别依据和存储名称" @blur="checkDbName()"
                            :disabled="this.db != null" />
                    </el-form-item>
                    <div class="errorMsg" v-show="!this.checkNameResult">
                        <el-text size="small" type="danger">该数据库已存在</el-text>
                    </div>
                    <div class="errorMsg" v-show="this.form.name.trim() == ''">
                        <el-text size="small" type="danger">唯一英文标识不能为空</el-text>
                    </div>
                    <el-form-item label="数据库介绍">
                        <el-input v-model="form.desc" type="textarea" :rows="3"
                            placeholder="关于本图像库内容、工作目的、所使用的语言等方面的说明。" />
                    </el-form-item>
                    <!--
                    <el-form-item label="数据库类型">
                        <el-select v-model="form.type" placeholder="选择数据库类型">
                            <el-option label="文本向量数据库" value="TEXT" />
                        </el-select>
                    </el-form-item>
                    -->
                    <el-form-item label="数据库状态">
                        <el-select v-model="form.status" placeholder="选择数据库状态">
                            <el-option v-for="item in stats" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="检索返回结果数">
                        <el-select v-model="form.defaultK" placeholder="查询返回结果数">
                            <el-option v-for="k in ks" :key="k" :label="k" :value="k" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="图像向量化方法">
                        <el-select v-model="form.embeddingMethod" placeholder="请选择图像向量化方法">
                            <el-option v-for="item in embeddingMethods" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            将图像转换为数值向量的方法，也称为Embedding。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#embedding_method" target="_blank" title="查看向量化方法的详细解释">
                            <el-text size="small" type="primary">详细解释</el-text>
                        </el-link>
                    </div>

                    <el-form-item label="向量索引方法">
                        <el-select v-model="form.vectorIndexType" placeholder="请选择向量的索引方法">
                            <el-option v-for="item in vectorIndexTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>


                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            三种索引方法适用于不同应用场景。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#vector_indexing" target="_blank" title="查看各种向量索引方法的解释">
                            <el-text size="small" type="primary">详细解释</el-text>
                        </el-link>
                    </div>

                    
                    <el-form-item label="距离计算方法">
                        <el-select v-model="form.disType" placeholder="请选择距离的计算方法">
                            <el-option v-for="item in disTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="数据源路径类型">
                        <el-select v-model="form.pathType" placeholder="请选择路径类型">
                            <el-option v-for="item in pathTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="服务器数据源路径">
                        <el-input v-model="form.tempDataSourcePath" placeholder="文本数据源目录" @blur="checkDataSource()" />
                    </el-form-item>
                    <div class="errorMsg" v-show="!this.checkDataSourceResult">
                        <el-text size="small" type="danger">
                            绝对路径示例：F:\datasets\esg，相对路径示例：/example_data_sources/esg
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#supported_files" target="_blank" title="查看支持的文件类型及处理方法">
                            <el-text size="small" type="primary">支持的文件类型</el-text>
                        </el-link>
                    </div>
                    
                    <el-form-item label="允许下载源文件">
                        <el-switch v-model="form.ifAllowDownload" />
                    </el-form-item>

                    <el-form-item label="次序">
                        <el-input-number v-model="form.ord" :step="1" min="1" max="100"
                            placeholder="请输入图像库在界面上的排序次序。" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit"
                            :disabled="!checkNameResult || form.name == '' || !checkNickNameResult || !checkDataSourceResult">提交</el-button>
                        <el-button @click="gotoList()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </app-frame>

</template>
<script>

const AlterImageDb = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        console.log(this.$javalin.pathParams);
        if (this.db != null) {
            this.fetchImageDbData(this.db);
        } else {
            this.checkDataSource();
            this.checkNickName();
        }

    },
    data() {
        return {
            db: '',
            form: {
                name: '',
                nickName: '',
                status: 'RUNNING',
                type: 'IMAGE',
                tempDataSourcePath: '',
                pathType: 'ABSOLUTE',
                embeddingMethod: 'ResNet50',
                vectorIndexType: 'Flat',desc: '',
                genTime: '',
                defaultK: 5,
                ifAllowDownload: true,
                ord: 1,
                disType: 'COS',
            },
            stats: [{ value: 'RUNNING', label: '运行' },
            { value: 'STOPPED', label: '停止' }],
            pathTypes: [{ value: 'RELATIVE', label: '相对路径' },
            { value: 'ABSOLUTE', label: '绝对路径' }],
            vectorIndexTypes: [
                { value: 'Flat', label: 'Flat（扁平索引，不消耗内存，无需构建但查询速度一般）' },
                { value: 'HNSW', label: 'HNSW（层次导航小世界索引，消耗一定内存，构建慢但查询快）' }
            ],
            embeddingMethods: [
                { value: 'ResNet50', label: 'ResNet50，适用于普通图像（向量长度：2048）' },
                { value: 'Face', label: '人脸特征（向量长度：512）' }
            ],
            disTypes: [
                { value: 'COS', label: '余弦相似性' },
                { value: 'EUCLIDEAN', label: '欧氏距离' }
            ],
            ks: [3, 5, 10, 15, 20],
            checkNameResult: true,
            checkNickNameResult: true,
            checkDataSourceResult: true,
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_image_db")
            // this.$router.push({ path: '/list_db' })
        },
        checkNickName() {
            if (this.form.nickName == null) {
                this.checkNickNameResult = false;
            }
            else if (this.form.nickName.trim() == '') {
                this.checkNickNameResult = false;
            }
            else {
                this.checkNickNameResult = true;
            }
        },
        checkDataSource() {
            if (this.form.tempDataSourcePath == null) {
                this.checkDataSourceResult = false;
            }
            else if (this.form.tempDataSourcePath.trim() == '') {
                this.checkDataSourceResult = false;
            }
            else {
                this.checkDataSourceResult = true;
            }
        },
        checkDbName() {
            if (this.db == null) {
                if (this.form.name.trim() != '') {
                    let url = "/api/check_image_db_name/" + this.form.name;
                    axios.get(url).then((response) => {
                        this.checkNameResult = response.data;
                        console.log(this.checkNameResult);
                    });
                }
            }
        },
        onSubmit() {
            let url = "/api/alter_image_db";
            console.log("data:" + JSON.stringify(this.form));
            axios.post(url, this.form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                console.log(response.data);
                location.href = ("/mag/list_image_db")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchImageDbData(db) {
            let url = "/api/image_db_detail/" + db;
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
                this.checkDataSource();
                this.checkNickName();
            });
        }
    },
    template: "#alter-image-db"
};

app.component("alter-image-db", AlterImageDb);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 125px;
}
</style>
