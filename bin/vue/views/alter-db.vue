<template id="alter-db">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">{{ db == null ? '添加新文本库' : '修改' + db }} </el-text>
                </template>
            </el-page-header>
            <hr />


            <div style="text-align: center;width:100%;">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="文本库显示名称">
                        <el-input v-model="form.nickName" placeholder="文本库在界面显示的名称" @blur="checkNickName()" />
                    </el-form-item>
                    <div class="errorMsg" v-show="!this.checkNickNameResult">
                        <el-text size="small" type="danger">该显示名称不能不空</el-text>
                    </div>

                    <el-form-item label="唯一英文标识">
                        <el-input v-model="form.name" placeholder="该标识为文本库识别依据和存储名称" @blur="checkDbName()"
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
                            placeholder="关于本库信息内容、工作目的、所使用的语言等方面的说明，是大模型解析用户问题时自动生成合适检索问题的依据，也是ReAct等Agent推理本地检索时确定检索语的依据，至关重要。" />
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

                    <el-form-item label="检索方法">
                        <el-select v-model="form.searchMethod" placeholder="请选择文本块的检索方法">
                            <el-option v-for="item in searchMethods" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            混合检索方法可以综合关键词检索和向量检索的优点。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#search_method" target="_blank" title="查看检索方法的详细解释">
                            <el-text size="small" type="primary">检索方法解释</el-text>
                        </el-link>
                    </div>

                    <el-form-item label="检索返回结果数">
                        <el-select v-model="form.defaultK" placeholder="查询返回结果数">
                            <el-option v-for="k in ks" :key="k" :label="k" :value="k" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文本块向量化方法">
                        <el-select v-model="form.embeddingMethod" placeholder="请选择词句向量的转换方法">
                            <el-option v-for="item in embeddingMethods" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            将文本转换为数值向量的方法，也称为Embedding。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#embedding_method" target="_blank" title="查看向量化方法的详细解释">
                            <el-text size="small" type="primary">详细解释</el-text>
                        </el-link>
                    </div>

                    <el-form-item label="词句向量转换方法">
                        <el-select v-model="form.wordDocTransMethod" placeholder="请选择词句向量的转换方法">
                            <el-option v-for="item in transMethods" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            仅针对Glove文本块向量化方法，DistillBert使用内置序列化模型转换词句向量，无需设置。
                        </el-text>
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

                    
                    <el-form-item label="用户问题解析方法">
                        <el-select v-model="form.questionType" placeholder="请选择用户问题的解析方法">
                            <el-option v-for="item in questionTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            大模型解析检索问题 指的是先用大模型分析回答用户提出问题时需要用哪些语句检索本地数据，而不是直接使用原问题。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#question_parse" target="_blank" title="查看两种解析方法的详细解释">
                            <el-text size="small" type="primary">详细解释</el-text>
                        </el-link>
                    </div>

                    <el-form-item label="文本块最小长度">
                        <el-input v-model="form.minChunkSize" placeholder="文本块最小长度" />
                    </el-form-item>
                    <el-form-item label="文本块最大长度">
                        <el-input v-model="form.maxChunkSize" placeholder="文本块最大长度" />
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

                    <el-form-item label="大模型挂载">
                        <el-select v-model="form.modelExpr" placeholder="选择挂载的大模型">
                            <el-option v-for="item in llms" :key="item.modelExpr" :label="item.modelExpr" :value="item.modelExpr" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="大模型生成模式">
                        <el-select v-model="form.generateType" placeholder="选择偏好的大模型生成方式">
                            <el-option v-for="item in generateTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="大模型系统提示词">
                        <el-input v-model="form.sysPrompt" type="textarea" :rows="6" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            系统提示模板作用于检索增强生成和大模型问答。
                        </el-text>
                    </div>
                    <el-form-item label="大模型用户提示词">
                        <el-input v-model="form.userPrompt" type="textarea" :rows="6" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            ${context}表示检索到的本地信息， ${query}表示用户输入的问题。用户提示模板作用于检索增强生成。
                        </el-text>
                    </div>

                    <el-form-item label="大模型流式响应">
                        <el-switch v-model="form.ifUseStreaming" />
                    </el-form-item>


                    <el-form-item label="保留大模型思维链">
                        <el-switch v-model="form.ifUseThinkChain" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            当前仅有DeepSeek、Qwen、YiShape大模型支持思维链
                        </el-text>
                    </div>

                    <el-form-item label="允许下载源文件">
                        <el-switch v-model="form.ifAllowDownload" />
                    </el-form-item>

                    <el-form-item label="查询结果精排">
                        <el-switch v-model="form.ifReRank" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">
                            利用内置的深度学习模型对向量查询结果进行再次精排序，提升检索质量，但速度会降低。
                        </el-text>&nbsp;&nbsp;
                        <el-link href="/mag/doc_detail/text_db#rerank" target="_blank" title="查看支持的文档重排方法">
                            <el-text size="small" type="primary">详细解释</el-text>
                        </el-link>
                    </div>

                    <el-form-item label="文本块返回类型">
                        <el-select v-model="form.chunkReturnType" placeholder="选文本块返回类型">
                            <el-option v-for="item in chunkReturnTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="次序">
                        <el-input-number v-model="form.ord" :step="1" min="1" max="100"
                            placeholder="请输入文本库在界面上的排序次序。" />
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

const AlterDb = {
    mounted() {
        this.db = this.$javalin.pathParams["db"];
        console.log(this.$javalin.pathParams);
        if (this.db != null) {
            this.fetchDbData(this.db);
        } else {
            this.checkDataSource();
            this.checkNickName();
        }
        this.loadLLMModels();

    },
    data() {
        return {
            db: '',
            form: {
                name: '',
                nickName: '',
                status: 'RUNNING',
                type: 'TEXT',
                tempDataSourcePath: '',
                pathType: 'ABSOLUTE',
                minChunkSize: 500,
                maxChunkSize: 800,
                searchMethod: 'HYBRID',
                embeddingMethod: 'DistillBert',
                wordDocTransMethod: 'TF_IDF',
                vectorIndexType: 'Flat',
                modelExpr: 'DeepSeek',
                sysPrompt: '你是一个检索增强生成器，你将根据本地检索得到的和问题相关的答案重新汇总组织语言、提炼和问题相关的信息、补充缺失的信息，最后回答问题。如果本地检索得到的内容和问题无关，则无需参考，自行回答。',
                userPrompt: '请根据提供的上下文信息、补充缺失的信息，并回答问题，一般不少于200字。如果上下文信息中没有所需答案，请自行回答。如果上下文信息与问题无关，则无需参考上下文信息，并自行回答。上下文信息：<context>${context}</context>，问题: ${query}',
                desc: '',
                genTime: '',
                defaultK: 5,
                ifAllowDownload: true,
                questionType: 'LLM_PARSED',
                ifUseThinkChain: false,
                chunkReturnType: 'original',
                generateType: 'Chat',
                ifUseStreaming: true,
                ord: 1,
                ifReRank: true,
                disType: 'COS',
            },
            stats: [{ value: 'RUNNING', label: '运行' },
            { value: 'STOPPED', label: '停止' }],
            llms: [],
            pathTypes: [{ value: 'RELATIVE', label: '相对路径' },
            { value: 'ABSOLUTE', label: '绝对路径' }],
            chunkReturnTypes: [{ value: 'original', label: '原始文本块' },
            { value: 'withContext', label: '加载上下文（前、后加1）' }],
            transMethods: [{ value: 'TF_IDF', label: '句向量为词向量的TF-IDF加权均值' },
            { value: 'AVERAGE', label: '句向量为词向量的平均值' }],
            vectorIndexTypes: [
                { value: 'Flat', label: 'Flat（扁平索引，不消耗内存，无需构建但查询速度一般）' },
                { value: 'HNSW', label: 'HNSW（层次导航小世界，消耗大量内存，构建慢但查询极快）'},
                { value: 'E2LSH', label: 'E2LSH（局部敏感哈希，消耗少量内存，适用超大规模数据）' },
            ],
            questionTypes: [
                { value: 'LLM_PARSED', label: '大模型解析检索问题' },
                { value: 'ORIGIN', label: '原始问题' }
            ],
            embeddingMethods: [
                { value: 'Glove', label: 'Glove（浅层语义，向量长度：300，可自训练）' },
                { value: 'DistillBert', label: 'DistillBert（深层语义，向量长度：768）' }
            ],
            ks: [3, 5, 10, 15, 20],
            searchMethods: [
                { value: 'HYBRID', label: '混合方法（综合BM25及句向量比对结果）' },
                { value: 'BM25', label: 'BM25（词匹配及词独特性）' },
                { value: 'VECTOR', label: '句向量相似性，语义信息' }
            ],
            generateTypes: [{ value: 'Chat', label: '聊天式' },
            { value: 'Generate', label: '生成式（长写作）' }],
            disTypes: [
                { value: 'COS', label: '余弦相似性' },
                { value: 'EUCLIDEAN', label: '欧氏距离' }
            ],
            checkNameResult: true,
            checkNickNameResult: true,
            checkDataSourceResult: true,
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
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
                    let url = "/api/check_db_name/" + this.form.name;
                    axios.get(url).then((response) => {
                        this.checkNameResult = response.data;
                        console.log(this.checkNameResult);
                    });
                }
            }
        },
        loadLLMModels() {
                    let url = "/llm/get_all/text";
                    axios.get(url).then((response) => {
                        this.llms = response.data;
                        if (this.llms.length > 0 && this.db == null) {
                            this.form.modelExpr = this.llms[0].modelExpr;
                        }
                        console.log(this.llms);
                    });
        },
        onSubmit() {
            let url = "/api/alter_text_db";
            console.log("data:" + JSON.stringify(this.form));
            axios.post(url, this.form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.databases = response.data;
                console.log(response.data);
                location.href = ("/mag/list_db")
                // this.$router.push({ path: '/list_db' });
            }).catch((error) => {
                console.log(error);
            });

        },
        fetchDbData(db) {
            let url = "/api/text_db_detail/" + db;
            // let url = helper.getServiceApiAddr() + "api/db_detail/" + db;
            axios.get(url).then((response) => {
                this.form = response.data;
                // console.log(response.data);
                this.checkDataSource();
                this.checkNickName();
            });
        }
    },
    template: "#alter-db"
};

app.component("alter-db", AlterDb);
</script>
<style>
.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 125px;
}
</style>
