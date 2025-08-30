<template id="list-agent-tool">

    <app-frame>



        <div style="text-align: left;padding-left: 20px;width: 95%;">


            <div class="infoBox">
                <el-text type="info" size="medium">
                    *大模型Agent在交互过程中可以调用的工具，用于弥补大模型信息查询与本地函数调用方面的局限。
                </el-text><br />
            </div>

            <el-space :fill="true" wrap style="width:100%;">

                <el-divider content-position="left">
                    <el-text type="info">内置特色工具</el-text>
                </el-divider>

                <div>
                    <el-row :gutter="10" justify="left">

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/search2.png"
                                        style="width:90px;height:90px;margin-top: -10px;" class="circle-icon" />
                                    <h3 class="feature-title">互联网搜索</h3>
                                    <p class="feature-description">
                                        可以供Agent自动调用的进行互联网搜索的工具（需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="/user/user_web_search" type="info" title="">
                                            马上使用 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/weather2.png"
                                        style="width:90px;height:90px;margin-top: -10px;" class="circle-icon" />
                                    <h3 class="feature-title">天气预报</h3>
                                    <p class="feature-description">
                                        可以供Agent自动调用的查询当前所有的城市的天气预报的工具（需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="#" type="info" title="" @click="this.testWeather()">
                                            马上使用 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/location2.webp"
                                        style="width:90px;height:90px;margin-top: -10px;" class="circle-icon" />
                                    <h3 class="feature-title">本地地址</h3>
                                    <p class="feature-description">
                                        可以供Agent自动调用的查询当前系统所在的地理地址的功能（需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="#" type="info" title="" @click="this.testAddress()">
                                            马上使用 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/time2.png" style="width:90px;height:90px;margin-top: -10px;"
                                        class="circle-icon" />
                                    <h3 class="feature-title">本地时间</h3>
                                    <p class="feature-description">
                                        可以供Agent自动调用的查询本地时间的工具（无需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="#" type="info" title="" @click="this.testLocalTime()">
                                            马上使用 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/report2.png"
                                        style="width:90px;height:90px;margin-top: -10px;" class="circle-icon" />
                                    <h3 class="feature-title">图表生成</h3>
                                    <p class="feature-description">
                                        可将大模型回答结果整理成图表工具需要的格式并生成图表（无需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="#" type="info" title="" disabled>
                                            敬请期待 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="feature-card">
                                <div class="card-content">
                                    <img src="/images/tools/ppt_gen2.png"
                                        style="width:90px;height:90px;margin-top: -10px;" class="circle-icon" />
                                    <h3 class="feature-title">PPT制作</h3>
                                    <p class="feature-description">
                                        可将大模型回答结果整理成制作PPT需要的格式并生成PPT（无需联网）。
                                    </p>

                                    <div style="text-align: center;width:100%;">
                                        <el-link href="/user/user_make_ppt" type="info" title="">
                                            马上使用 >
                                        </el-link>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>


                    </el-row>
                </div>



            </el-space>
        </div>


        <el-dialog v-model="dialogVisible" title="查询结果" width="800" :before-close="handleClose" style="text-align: left;">
            <div v-html="message" style="line-height: 1.6; font-family: 'Microsoft YaHei', sans-serif;"></div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </app-frame>



</template>
<script>

const ListAgentTool = {
    mounted() {

    },
    data() {
        return {
            message: "...",
            dialogVisible:false,
            localTime: '',
            address: {},
            weather: {},
        };
    },
    methods: {


        testAddress() {
            let url = "/api/local_address";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.address = response.data;
                this.message = this.address;
                // console.log(response.data);
            });
        },

        testLocalTime() {
            let url = "/api/local_time";
            this.dialogVisible = true;
            axios.get(url).then((response) => {
                this.localTime = response.data;
                this.message = this.localTime;
                // console.log(response.data);
            });
        },

        testWeather() {
            let url = "/api/weather";
            this.dialogVisible = true;
            
            // 先获取地址信息，然后在回调中获取天气信息
            axios.get("/api/local_address").then((addressResponse) => {
                this.address = addressResponse.data;
                let rs = this.address.split("-");
                let city = rs[rs.length - 1];
                console.log(city);
                
                let params = {
                    "city": city,
                    "days": 3
                }
                
                return axios.post(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }).then((weatherResponse) => {
                this.weather = weatherResponse.data;
                console.log(this.weather)
                this.message = this.formatWeatherData(this.weather);
            }).catch((error) => {
                console.error('获取天气信息失败:', error);
                this.message = '获取天气信息失败，请稍后重试';
            });
        },

        formatWeatherData(weatherData) {
            if (!weatherData || weatherData.status !== 'ok') {
                return '获取天气信息失败';
            }

            let html = `<div style="text-align: center; margin-bottom: 15px;"><b style="font-size: 16px; color: #409eff;">🌟 ${weatherData.city} 天气及未来2天预报</b></div>`;
            
            if (weatherData.items && weatherData.items.length > 0) {
                html += '<table style="width:100%; border-collapse: collapse; font-size: 14px;">';
                html += '<thead><tr style="background-color: #f5f7fa;">';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">📅 日期</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌡️ 温度</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">☀️ 白天</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌙 夜间</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">💨 风向/风力</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">💧 湿度</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌅 日出</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌆 日落</th>';
                html += '<th style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">🌙 月相</th>';
                html += '</tr></thead><tbody>';
                
                weatherData.items.forEach((item, index) => {
                    const rowStyle = index % 2 === 0 ? 'background-color: #ffffff;' : 'background-color: #fafafa;';
                    html += `<tr style="${rowStyle}">`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.fxDate}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.tempMin}°C~${item.tempMax}°C</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.textDay}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.textNight}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.windDirDay}${item.windScaleDay}级</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.humidity}%</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.sunrise}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.sunset}</td>`;
                    html += `<td style="padding: 8px; border: 1px solid #dcdfe6; text-align: center;">${item.moonPhase}</td>`;
                    html += '</tr>';
                });
                
                html += '</tbody></table>';
            }
            
            return html;
        },


        formatTime(timestamp) {
            return timestampToString(timestamp);
        }

    },
    template: "#list-agent-tool"
};

app.component("list-agent-tool", ListAgentTool);
</script>
<style scoped>
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



.feature-card {
    text-align: center;
    padding: 0px;
    transition: transform 0.3s;
    margin-bottom: 10px;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.feature-icon {
    margin-top: -10px;
    margin-bottom: 0px;
    color: #409eff;
    /* 图标颜色，可以根据设计需求调整 */
}

.feature-title {
    font-size: 12px;
    margin-bottom: 0px;
    color: #333;
}

.feature-description {
    font-size: 12px;
    color: #666;
    margin: 10px -5px 20px -5px;
    line-height: 20px;
}

.circle-icon {
    width: 100px;
    /* 你可以根据需要调整大小 */
    height: 100px;
    background-color: white;
    /* 图标背景色，可以根据需要更改 */
    border-radius: 50%;
    /* 使图标成为圆形 */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 添加阴影效果 */
}
</style>
