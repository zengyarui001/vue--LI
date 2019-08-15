<template>
    <div class="login-wrap">
        <vue-particles
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#00FFFF"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            
            <div class="ms-content"> 
                 <el-input
                    :placeholder="rules.username[0].message"
                    prefix-icon="el-icon-lx-people"
                    @keyup.enter.native="submitLogin(ruleForm)"
                    v-model="ruleForm.account">
                </el-input>
                 <el-input
                    type="password"
                    :placeholder="rules.password[0].message"
                    prefix-icon="el-icon-lx-lock"
                    @keyup.enter.native="submitLogin(ruleForm)"
                    v-model="ruleForm.password">
                </el-input>
                <el-input
                    :placeholder="rules.google[0].message"
                    prefix-icon="el-icon-lx-lock"
                    @keyup.enter.native="submitLogin(ruleForm)"
                    v-model="ruleForm.verifyCode">
                </el-input>
                <div class="login-btn">
                    <el-button type="primary" @click="submitLogin(ruleForm)">登录</el-button>
                </div>  
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    account: '',
                    password: '',
                    verifyCode:''

                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名'}
                    ],
                    password: [
                        { required: true, message: '请输入密码' }
                    ],
                    google:[
                         { required: true, message: '请输入google验证码'}
                    ]
                }
            }
        },
        methods: {
            submitLogin(formName) {
                var self = this;
                this.$post(self.baseURL+this.site.Login,formName).then(res=>{
                     
                     if(res.data.code != self.S_CODE) {
                         this.$message.error(res.data.failedMsg);                     
                     }else if(res.data.code == 0) {
                         localStorage.setItem('ms_username',this.ruleForm.account);
                         localStorage.setItem('token',res.data.data);
                         this.$message({
                            message: '登陆成功',
                            type: 'success'
                        });
                         this.$router.push('/');
                     }
                })

            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        height: 250px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .el-input--small {
        line-height: 40px;
    }
</style>