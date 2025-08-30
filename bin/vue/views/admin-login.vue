<template id="admin-login">

    <div class="login-container">
        <!-- 头部区域 -->
        <el-header style="height: 90px;width:1250px;margin-bottom: 0px;text-align: left!important;">
            <div class="header" style="text-align: left!important;margin-bottom: -25px;background: #ffffff;padding: 10px 10px 5px 5px;">

                <img src="/logo.png" style="height: 60px;margin-left: 10px;"  />

                <div
                    style="height:60px; line-height:60px;  overflow:hidden;margin-top: -60px;padding-left: 200px;border: 0px solid red;;">

                    <el-tooltip class="item" effect="light" content="易形 寓意通过灵活、丰富的 空间变换，实现最优向量表征、向量索引与向量检索计算。"
                        placement="right-start">
                        <el-text type="primary" style="font-size: 20px;">
                            向量数据库管理系统
                        </el-text>
                    </el-tooltip>
                    <div style="float: right;border:0px solid green;height: 50px;padding-top: 35px;line-height: 30px;">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-link href="/user" target="_blank" type="primary" title="打开用户工作台">
                            <el-text type="primary" size="small">
                                YiShape Studio
                            </el-text>
                        </el-link>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                </div>
            </div>
            <el-divider />
        </el-header>

        <!-- 登录表单区域 -->
        <div class="login-content">
            <el-card class="login-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-text type="info" style="font-size: 18px; font-weight: bold;">
                            <el-icon>
                                <User />
                            </el-icon>
                            管理员登录
                        </el-text>
                    </div>
                </template>

                <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入管理员用户名" prefix-icon="User" clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                            show-password clearable>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码" prop="captcha">
                        <div class="captcha-container">
                            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" prefix-icon="Key"
                                style="width: 60%;" clearable>
                            </el-input>
                            <div class="captcha-image" @click="refreshCaptcha">
                                <img :src="captchaUrl" alt="验证码" @error="handleImageError" @load="handleImageLoad" />
                                <div v-if="!captchaLoaded" class="captcha-placeholder">
                                    <el-icon><Loading /></el-icon>
                                    <span>加载中...</span>
                                </div>
                                <el-icon class="refresh-icon">
                                    <Refresh />
                                </el-icon>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%;">
                            <el-icon>
                                <Login />
                            </el-icon>
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 功能链接 -->
                <div class="login-links">
                    <el-link type="primary" @click="forgotPassword">忘记密码？</el-link>
                    <el-link type="info" href="/user" target="_blank">用户工作台</el-link>
                </div>
            </el-card>

            <!-- 系统信息卡片 -->
            <el-card class="info-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <el-text type="info">
                            系统信息
                        </el-text>
                    </div>
                </template>

                <div class="system-info">
                    <div class="info-item">
                        <el-icon>
                            <Monitor />
                        </el-icon>
                        <span>计算设备：</span>
                        <el-text :type="ifGPU ? 'success' : 'warning'" tag="b">{{ ifGPU ? 'GPU' : 'CPU' }}</el-text>
                    </div>
                    <div class="info-item">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        <span>当前时间：</span>
                        <el-text type="info">{{ currentTime }}</el-text>
                    </div>
                    <div class="info-item">
                        <el-icon>
                            <Connection />
                        </el-icon>
                        <span>系统状态：</span>
                        <el-text type="success">正常运行</el-text>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 页脚 -->
        <div class="footer-section">
            <el-text class="mx-1" type="info" size="small">
                {{ copyright.version }} &nbsp; {{ copyright.copy }} <br />
                {{ copyright.statement }}
            </el-text>
        </div>

        <!-- 登录结果对话框 -->
        <el-dialog v-model="dialogVisible" title="登录结果" :before-close="handleClose" style="text-align: left;">
            <div v-html="message" style="line-height: 1.6; font-family: 'Microsoft YaHei', sans-serif;"></div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<script>

// 版权信息函数
function getCopyrightInfo() {
    return {
        version: 'YiShape Vector Database v0.8',
        copy: '© 2024 易形空间. All rights reserved.',
        statement: '易形空间 - 寓意通过灵活、丰富的空间变换，实现最优向量表征、向量索引与向量检索计算。'
    };
}

const AdminLogin = {
    mounted() {
        this.requestData();
        this.refreshCaptcha();
        this.updateTime();
        // 每秒更新时间
        setInterval(() => {
            this.updateTime();
        }, 1000);
    },
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                captcha: ''
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { len: 4, message: '验证码长度为 4 位', trigger: 'blur' }
                ]
            },
            loading: false,
            dialogVisible: false,
            message: '',
            captchaUrl: '',
            captchaLoaded: false,
            currentTime: '',
            ifGPU: false,
            copyright: getCopyrightInfo()
        };
    },
    methods: {
        requestData() {
            let url = "/api/device";
            axios.get(url).then((response) => {
                let info = response.data;
                this.ifGPU = info.gpuNum > 0;
            });
        },
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },
        refreshCaptcha() {
            this.captchaLoaded = false;
            this.captchaUrl = `/api/captcha?t=${new Date().getTime()}`;
            console.log('刷新验证码，URL:', this.captchaUrl);
        },
        handleImageError() {
            this.captchaLoaded = false;
            console.error('验证码图片加载失败');
        },
        handleImageLoad() {
            this.captchaLoaded = true;
        },
        handleLogin() {
            this.$refs.loginFormRef.validate((valid) => {
                if (valid) {
                    this.loading = true;

                    // 创建FormData对象
                    const formData = new FormData();
                    formData.append('username', this.loginForm.username);
                    formData.append('password', this.loginForm.password);
                    formData.append('captcha', this.loginForm.captcha);

                    // 调用真实的登录API
                    axios.post('/api/admin_login_check', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then((response) => {
                        this.loading = false;
                        const result = response.data;
                        
                        if (result.ifPass) {
                            // 登录成功
                            this.dialogVisible = true;
                            this.message = '登录成功！正在跳转到管理后台...';
                            setTimeout(() => {
                                location.href = '/mag/';
                            }, 1000);
                        } else {
                            // 登录失败
                            let errorMsg = '登录失败！';
                            switch (result.msg) {
                                case 'captcha error':
                                    errorMsg = '验证码错误，请重新输入！';
                                    this.refreshCaptcha();
                                    this.loginForm.captcha = '';
                                    break;
                                case 'admin not found':
                                    errorMsg = '用户名不存在！';
                                    break;
                                case 'password error':
                                    errorMsg = '密码错误！';
                                    this.loginForm.password = '';
                                    break;
                                default:
                                    errorMsg = result.msg || '登录失败，请检查输入信息！';
                            }
                            
                            this.$message({
                                message: errorMsg,
                                type: 'error',
                                duration: 3000
                            });
                        }
                    }).catch((error) => {
                        this.loading = false;
                        console.error('登录请求失败:', error);
                        this.$message({
                            message: '网络连接失败，请检查网络设置！',
                            type: 'error',
                            duration: 3000
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        forgotPassword() {
            this.dialogVisible = true;
            this.message = '请联系系统管理员重置密码。';
        },
        handleClose() {
            this.dialogVisible = false;
        }
    },
    template: "#admin-login"
};

app.component("admin-login", AdminLogin);
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top:60px ;
}

.header-section {
    width: 100%;
    max-width: 1200px;
    margin-bottom: 20px;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
}

.header-text {
    flex: 1;
    text-align: center;
}

.login-content {
    display: flex;
    gap: 30px;
    max-width: 1200px;
    width: 100%;
    margin-bottom: 20px;
}

.login-card {
    flex: 2;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card {
    flex: 1;
    background: #ffffff;
    border-radius: 8px;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.captcha-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.captcha-image {
    position: relative;
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    min-width: 120px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.captcha-image img {
    width: 120px;
    height: 40px;
    display: block;
    object-fit: contain;
}

.captcha-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 40px;
    background: #f5f5f5;
    color: #999;
    font-size: 12px;
    gap: 4px;
}

.captcha-placeholder .el-icon {
    font-size: 16px;
}

.refresh-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
}

.captcha-image:hover .refresh-icon {
    opacity: 1;
}

.login-links {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
}

.system-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item .el-icon {
    color: #409eff;
}

.footer-section {
    max-width: 1170px;
    width: 100%;
    text-align: center;
    background: #ffffff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .login-content {
        flex-direction: column;
    }

    .header-content {
        flex-direction: column;
        gap: 10px;
    }

    .login-links {
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
}
</style>
