<template id="alter-o">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">OLLAMA模型配置管理</el-text>
                </template>
            </el-page-header>
            <hr />

            <div class="infoBox">
                <el-text type="primary">
                    使用Ollama前需要在本地或局域网安装Ollama服务并在其中加载大模型，Ollama官网：
                </el-text>
                <el-link type="warning" href="https://ollama.com/" target="_blank">https://ollama.com/</el-link>
            </div>

            <!-- 模型列表表格 -->
            <div class="table-container">
                <div class="table-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <el-button type="primary" @click="showAddDialog()">
                            <el-icon><Plus /></el-icon>
                            添加模型
                        </el-button>
                        <el-text size="small" type="info">{{ dataStatus }}</el-text>
                    </div>
                </div>
                
                <div v-if="loading" style="text-align: center; padding: 20px;">
                    <el-text>加载中...</el-text>
                </div>
                
                <div v-else-if="!items || items.length === 0" style="text-align: center; padding: 20px;">
                    <el-text>暂无数据，请点击上方按钮添加模型配置</el-text>
                </div>
                
                <table v-else style="width: 100%; border-collapse: collapse; border: 1px solid #dcdfe6;">
                    <thead>
                        <tr style="background-color: #f5f7fa;">
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 120px;">IP地址</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 80px;">端口</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 150px;">模型名称</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 120px;">模型类型</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 100px;">启用</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 150px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid #ebeef5;">
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">{{ item.ipAddr }}</td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">{{ item.port }}</td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">{{ item.model }}</td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">
                                <el-tag v-if="item.modelType === 'Normal'" type="primary">文本问答</el-tag>
                                <el-tag v-else-if="item.modelType === 'Vision'" type="success">多模态问答</el-tag>
                                <el-tag v-else-if="item.modelType === 'Embedding'" type="warning">文本向量化</el-tag>
                                <el-tag v-else type="info">{{ item.modelType }}</el-tag>
                            </td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">
                                <el-switch 
                                    v-model="item.ifInUse" 
                                    size="small"
                                    @change="toggleModelStatus(item)"
                                    :loading="item.statusLoading"
                                />
                                <div style="margin-top: 2px;">
                                    <el-text size="small" :type="item.ifInUse ? 'success' : 'danger'">
                                        {{ item.ifInUse ? '启用' : '禁用' }}
                                    </el-text>
                                </div>
                            </td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">
                                <el-button size="small" type="primary" @click="showEditDialog(item)">
                                    修改
                                </el-button>
                                <el-button size="small" type="danger" @click="deleteItem(item)">
                                    删除
                                </el-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 添加/编辑模型弹窗 -->
            <el-dialog 
                v-model="dialogVisible" 
                :title="isEdit ? '修改OLLAMA模型' : '添加OLLAMA模型'"
                width="600px"
                :close-on-click-modal="false"
            >
                <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                    <el-form-item label="IP地址" prop="ipAddr">
                        <el-input v-model="form.ipAddr" placeholder="请输入OLLAMA服务所在的IP地址" />
                    </el-form-item>
                    <el-form-item label="端口" prop="port">
                        <el-input v-model="form.port" placeholder="请输入OLLAMA服务的端口号" />
                    </el-form-item>
                    <el-form-item label="模型名称" prop="model">
                        <el-input v-model="form.model" placeholder="请输入大模型的名称" />
                    </el-form-item>
                    <el-form-item label="模型类型" prop="modelType">
                        <el-select v-model="form.modelType" placeholder="请选择模型类型" style="width: 100%">
                            <el-option v-for="item in modelTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自定义参数" prop="options">
                        <el-input v-model="form.options" type="textarea" 
                            placeholder="每行一组参数，参数名和参数值用英文符号:分割"
                            :rows="6" />
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">每行一组参数，参数名和参数值用英文符号:分割。参数配置参考：</el-text>
                        <el-link size="small" type="warning"
                            href="https://github.com/ollama/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values"
                            target="_blank">
                            <el-text size="small">Ollama官网参数说明文档</el-text></el-link>
                    </div>
                    <el-form-item label="是否启用" prop="ifInUse">
                        <el-switch 
                            v-model="form.ifInUse" 
                            active-text="启用" 
                            inactive-text="禁用"
                            :active-value="true"
                            :inactive-value="false"
                        />
                        <div style="margin-top: 5px;">
                            <el-text size="small" type="info">启用后该模型配置将可用于LLM服务</el-text>
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmit" :loading="submitting">
                            {{ isEdit ? '修改' : '添加' }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>

        </div>

    </app-frame>

</template>
<script>

const AlterOllama = {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            items: [],
            loading: false,
            dialogVisible: false,
            isEdit: false,
            submitting: false,

            form: {
                id: '',
                ipAddr: '',
                port: 11434,
                model: '',
                options: '',
                modelType: 'Normal',
                ifInUse:true,
            },
            rules: {
                ipAddr: [
                    { required: true, message: '请输入IP地址', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '请输入端口号', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '端口号必须为数字', trigger: 'blur' }
                ],
                model: [
                    { required: true, message: '请输入模型名称', trigger: 'blur' }
                ],
                modelType: [
                    { required: true, message: '请选择模型类型', trigger: 'change' }
                ]
            },
            modelTypes: [
                { value: 'Normal', label: '文本问答' },
                { value: 'Vision', label: '多模态问答' },
                { value: 'Embedding', label: '文本向量化' },
            ],
        }
    },
    computed: {
        // 计算属性：检查是否有数据
        hasData() {
            return this.items && this.items.length > 0;
        },
        // 计算属性：数据状态描述
        dataStatus() {
            if (this.loading) return '加载中...';
            if (!this.hasData) return '暂无数据';
            return `共 ${this.items.length} 条记录`;
        }
    },
    methods: {
        gotoList() {
            console.log("ready goto")
            location.href = ("/mag/list_db")
        },
        
        // 显示添加对话框
        showAddDialog() {
            this.isEdit = false;
            this.resetForm();
            this.dialogVisible = true;
        },
        
        // 显示编辑对话框
        showEditDialog(row) {
            this.isEdit = true;
            this.form = { ...row }; // 复制数据
            this.dialogVisible = true;
        },
        
        // 重置表单
        resetForm() {
            this.form = {
                id: '',
                ipAddr: '',
                port: 11434,
                model: '',
                options: '',
                modelType: 'Normal',
                ifInUse: true,
            };
            if (this.$refs.formRef) {
                this.$refs.formRef.resetFields();
            }
        },
        
        // 提交表单
        onSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.submitting = true;
                    let url = "/api/alter_ollama";
                    
                    axios.post(url, this.form, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then((response) => {
                        this.submitting = false;
                        const result = response.data;
                        console.log(response.data);
                        
                        if (result === 'ok') {
                            this.$message({
                                message: this.isEdit ? '修改成功！' : '添加成功！',
                                type: 'success',
                            });
                            this.dialogVisible = false;
                            this.fetchData(); // 刷新列表
                        } else {
                            this.$message({
                                message: result.startsWith('error:') ? result.substring(6) : (this.isEdit ? '修改失败！' : '添加失败！'),
                                type: 'error',
                            });
                        }
                    }).catch((error) => {
                        this.submitting = false;
                        console.log(error);
                        this.$message({
                            message: '操作失败，请检查网络连接',
                            type: 'error',
                        });
                    });
                }
            });
        },
        
        // 删除项目
        deleteItem(row) {
            this.$confirm('确定要删除这个模型配置吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "/api/delete_ollama";
                axios.post(url, { id: row.id }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((response) => {
                    const result = response.data;
                    if (result === 'ok') {
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                        this.fetchData(); // 刷新列表
                    } else {
                        this.$message({
                            message: result.startsWith('error:') ? result.substring(6) : '删除失败！',
                            type: 'error',
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                    this.$message({
                        message: '删除失败，请检查网络连接',
                        type: 'error',
                    });
                });
            }).catch(() => {
                // 用户取消删除
            });
        },
        
        // 切换模型状态
        toggleModelStatus(row) {
            // 设置加载状态
            row.statusLoading = true;
            
            let url = "/api/alter_ollama";
            const formData = {
                id: row.id,
                ipAddr: row.ipAddr,
                port: row.port,
                model: row.model,
                modelType: row.modelType,
                options: row.options,
                ifInUse: row.ifInUse
            };
            
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                row.statusLoading = false;
                const result = response.data;
                
                if (result === 'ok') {
                    this.$message({
                        message: `模型已${row.ifInUse ? '启用' : '禁用'}！`,
                        type: 'success',
                    });
                } else {
                    // 如果失败，恢复原状态
                    row.ifInUse = !row.ifInUse;
                    this.$message({
                        message: result.startsWith('error:') ? result.substring(6) : '状态切换失败！',
                        type: 'error',
                    });
                }
            }).catch((error) => {
                row.statusLoading = false;
                // 如果失败，恢复原状态
                row.ifInUse = !row.ifInUse;
                console.log(error);
                this.$message({
                    message: '状态切换失败，请检查网络连接',
                    type: 'error',
                });
            });
        },
        

        
        // 获取数据
        fetchData() {
            this.loading = true;
            let url = "/api/llm_config/ollama"
            axios.get(url).then((response) => {
                console.log('API响应:', response.data);
                
                let newItems = [];
                // 确保数据格式正确
                if (response.data && response.data.models) {
                    newItems = response.data.models;
                } else if (Array.isArray(response.data)) {
                    newItems = response.data;
                } else {
                    newItems = [];
                    console.warn('API返回的数据格式不符合预期:', response.data);
                }
                
                // Vue 3 直接赋值即可，响应式系统会自动处理
                this.items = newItems;
                console.log('处理后的items:', this.items);
                this.loading = false;
            }).catch((error) => {
                console.error('获取数据失败:', error);
                this.items = []; // 确保失败时清空数据
                this.loading = false;
                this.$message({
                    message: '获取数据失败，请检查网络连接',
                    type: 'error',
                });
            });
        }
    },
    template: "#alter-o"
};

app.component("alter-ollama", AlterOllama);
</script>
<style>
.clearfloat {
    clear: both;
}

.infoBox {
    text-align: left;
    margin: 5px 0px 5px 0px;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
}

.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 80px;
}

.table-container {
    margin-top: 20px;
}

.table-header {
    margin-bottom: 15px;
    text-align: left;
}

.dialog-footer {
    text-align: right;
}
</style>
