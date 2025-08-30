<template id="alter-admin-config">

    <app-frame>

        <div style="padding-left: 20px; width: 95%;">
            <el-page-header @back="gotoList()" title="返回">
                <template #content>
                    <el-text class="mx-1" size="large">管理员配置管理</el-text>
                </template>
            </el-page-header>
            <hr />

            <div class="infoBox">
                <el-text type="primary">
                    管理员配置用于设置管理员账号和密码，管理员账号和密码用于登录管理后台。
                </el-text>
            </div>

            <!-- 模型列表表格 -->
            <div class="table-container">
                <div class="table-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <el-button type="primary" @click="showAddDialog()">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            添加管理员
                        </el-button>
                        <el-text size="small" type="info">{{ dataStatus }}</el-text>
                    </div>
                </div>

                <div v-if="loading" style="text-align: center; padding: 20px;">
                    <el-text>加载中...</el-text>
                </div>

                <div v-else-if="!items || items.length === 0" style="text-align: center; padding: 20px;">
                    <el-text>暂无数据，请点击上方按钮添加管理员</el-text>
                </div>

                <table v-else style="width: 100%; border-collapse: collapse; border: 1px solid #dcdfe6;">
                    <thead>
                        <tr style="background-color: #f5f7fa;">
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 120px;">管理员账号
                            </th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 150px;">管理员昵称
                            </th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 120px;">管理员类型
                            </th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 100px;">启用</th>
                            <th style="border: 1px solid #dcdfe6; padding: 8px; text-align: left; width: 150px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid #ebeef5;">
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">{{ item.username }}</td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">{{ item.nickName }}</td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">
                                <el-tag v-if="item.adminType === 'Admin'" type="primary">管理员</el-tag>
                                <el-tag v-else-if="item.adminType === 'SuperAdmin'" type="success">超级管理员</el-tag>
                                <el-tag v-else type="info">{{ item.adminType }}</el-tag>
                            </td>
                            <td style="border: 1px solid #dcdfe6; padding: 8px;">
                                <el-switch v-model="item.ifInUse" size="small" @change="toggleAdminStatus(item)"
                                    :loading="item.statusLoading" />
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

            <!-- 编辑默认管理员信息 -->
            <div class="edit-default-admin-info">
                <el-form-item label="默认管理员" prop="defaultAdminUrn">
                    <el-select v-model="defaultAdminUrn" placeholder="请选择默认管理员" style="width: 100%"
                        @change="alterConfig">
                        <el-option v-for="admin in items" :key="admin.username" :label="admin.username"
                            :value="admin.username" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用默认管理员" prop="ifLoadDefaultAdmin">
                    <el-switch v-model="ifLoadDefaultAdmin" active-text="启用" inactive-text="禁用" :active-value="true"
                        :inactive-value="false" @change="alterConfig" />
                </el-form-item>

                <div class="errorMsg">
                    <el-text  type="info">
                        启用后，当访问管理端页面时若管理员没有登录时，系统会自动使用默认管理员登录。
                    </el-text>
                </div>
            </div>

            <!-- 添加/编辑模型弹窗 -->
            <el-dialog v-model="dialogVisible" :title="isEdit ? '修改管理员' : '添加管理员'" width="600px"
                :close-on-click-modal="false">
                <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                    <el-form-item label="管理员账号" prop="username">
                        <el-input v-model="form.username" placeholder="请输入管理员账号" @blur="checkAdminUrnExist"
                            :loading="usernameChecking" clearable />
                        <div v-if="form.username && !usernameChecking" style="margin-top: 5px;">
                            <el-text size="small" :type="usernameValid ? 'success' : 'danger'">
                                {{ usernameValid ? '用户名可用' : '用户名已存在，请重新输入' }}
                            </el-text>
                        </div>
                    </el-form-item>
                    <el-form-item label="管理员密码" prop="password">
                        <el-input v-model="form.password" placeholder="请输入管理员密码" show-password />
                    </el-form-item>
                    <el-form-item label="管理员昵称" prop="nickName">
                        <el-input v-model="form.nickName" placeholder="请输入管理员昵称" />
                    </el-form-item>
                    <el-form-item label="管理员类型" prop="adminType">
                        <el-select v-model="form.adminType" placeholder="请选择管理员类型" style="width: 100%">
                            <el-option v-for="item in adminTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <div class="errorMsg">
                        <el-text size="small" type="info">管理员配置用于设置管理员账号和密码，管理员账号和密码用于登录管理后台。</el-text>
                    </div>
                    <el-form-item label="是否启用" prop="ifInUse">
                        <el-switch v-model="form.ifInUse" active-text="启用" inactive-text="禁用" :active-value="true"
                            :inactive-value="false" />
                        <div style="margin-top: 5px;">
                            <el-text size="small" type="info">启用后该管理员配置将可用于登录管理后台</el-text>
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmit" :loading="submitting"
                            :disabled="!usernameValid || !form.username || !form.password || !form.nickName || !form.adminType">
                            {{ isEdit ? '修改' : '添加' }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>

        </div>

    </app-frame>

</template>
<script>

const AlterAdminConfig = {
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
            defaultAdminUrn: "admin",
            ifLoadDefaultAdmin: false,

            form: {
                id: '',
                username: '',
                password: '',
                nickName: '',
                adminType: 'Admin',
                ifInUse: true,
            },
            rules: {
                username: [
                    { required: true, message: '请输入管理员账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入管理员密码', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: '请输入管理员昵称', trigger: 'blur' }
                ],
                adminType: [
                    { required: true, message: '请选择管理员类型', trigger: 'change' }
                ]
            },
            adminTypes: [
                { value: 'Admin', label: '普通管理员' },
                { value: 'SuperAdmin', label: '超级管理员（可以管理所有管理员）' },
            ],
            // 添加用户名验证状态
            usernameValid: false,
            usernameChecking: false,
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
            location.href = ("/mag/")
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
            this.usernameValid = true; // 编辑模式下用户名已存在且可用
            this.usernameChecking = false;
            this.dialogVisible = true;
        },

        // 重置表单
        resetForm() {
            this.form = {
                id: '',
                username: '',
                password: '',
                nickName: '',
                adminType: 'Admin',
                ifInUse: true,
            };
            // 重置用户名验证状态
            this.usernameValid = false;
            this.usernameChecking = false;
            if (this.$refs.formRef) {
                this.$refs.formRef.resetFields();
            }
        },

        alterConfig() {
            this.submitting = true;
            let url = "/api/alter_admin_config";
            let fd = new FormData();
            fd.append("defaultAdminUrn", this.defaultAdminUrn);
            fd.append("ifLoadDefaultAdmin", this.ifLoadDefaultAdmin);

            axios.post(url, fd, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.submitting = false;
                const result = response.data;
                console.log(response.data);

                if (result === 'ok') {
                    this.$message({
                        message: '配置修改成功！',
                        type: 'success',
                    });
                } else {
                    this.$message({
                        message: result.startsWith('error:') ? result.substring(6) : '配置修改失败！',
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

        },


        checkAdminUrnExist() {
            if (!this.form.username) {
                this.usernameValid = false;
                return;
            }

            this.usernameChecking = true;
            let url = "/api/check_admin_exist";
            axios.post(url, { username: this.form.username }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                const result = response.data;
                console.log(result);
                if (result) {
                    this.$message({
                        message: '管理员账号已存在，请重新输入',
                        type: 'error',
                    });
                    this.usernameValid = false;
                } else {
                    this.$message({
                        message: '管理员账号可用',
                        type: 'success',
                    });
                    this.usernameValid = true;
                }
                this.usernameChecking = false;
            }).catch((error) => {
                this.usernameChecking = false;
                console.log(error);
                this.$message({
                    message: '检查用户名失败，请检查网络连接',
                    type: 'error',
                });
                this.usernameValid = false;
            });
        },


        // 提交表单
        onSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.submitting = true;
                    let url = "/api/alter_admin";
                    // this.form.defaultAdminUrn = this.defaultAdminUrn;
                    // this.form.ifLoadDefaultAdmin = this.ifLoadDefaultAdmin;

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
            this.$confirm('确定要删除这个管理员配置吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "/api/delete_admin";
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

        // 切换管理员状态
        toggleAdminStatus(row) {
            // 设置加载状态
            row.statusLoading = true;

            let url = "/api/alter_admin";
            const formData = {
                id: row.id,
                username: row.username,
                password: row.password,
                nickName: row.nickName,
                adminType: row.adminType,
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
                        message: `管理员已${row.ifInUse ? '启用' : '禁用'}！`,
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
            let url = "/api/admin_config"
            axios.get(url).then((response) => {
                console.log('API响应:', response.data);

                let newItems = [];
                // 确保数据格式正确
                if (response.data && response.data.admins) {
                    newItems = response.data.admins;
                } else if (Array.isArray(response.data)) {
                    newItems = response.data;
                } else {
                    newItems = [];
                    console.warn('API返回的数据格式不符合预期:', response.data);
                }
                this.ifLoadDefaultAdmin = response.data.ifLoadDefaultAdmin;
                this.defaultAdminUrn = response.data.defaultAdminUrn;

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
    template: "#alter-admin-config"
};

app.component("alter-admin-config", AlterAdminConfig);
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

.edit-default-admin-info {
    margin-top: 20px;
    text-align: left;
    padding: 10px 10px 10px 10px;
    background-color: #F2F6FC;
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

.errorMsg {
    margin-top: -17px;
    margin-bottom: 5px;
    text-align: left;
    margin-left: 0px;
}

</style>
