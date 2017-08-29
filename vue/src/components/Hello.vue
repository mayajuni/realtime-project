<template>
  <div class='hello'>
    <h1>{{ msg }}</h1>
    <a id="kakao-login-btn"></a>
    <button @click="facebookLogin">faceboo111k</button>
    <button ref="google">googleLogin</button>
    <!--<div class="g-signin2" data-onsuccess="googleLogin"></div>-->
  </div>
</template>

<script>
  export default {
    name: 'hello',
    mounted() {
      setTimeout(() => {
        this.kakaoLogin();
        this.googleLogin();
      });
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    methods: {
      facebookLogin() {
        const fb = window.FB;
        fb.login((response) => {
          if (response.status === 'connected') {
            fb.api('/me', {fields: 'email,id,cover,name,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified'}, function (response) {
              console.log(response);
            });
          }
        }, {scope: 'public_profile, user_friends, email'});
      },
      kakaoLogin() {
        const kakao = window.Kakao;
        kakao.init('e8f2052057af9ade82e82053ffcbd9c1');
        // 카카오 로그인 버튼을 생성합니다.
        kakao.Auth.createLoginButton(
          {
            container: '#kakao-login-btn',
            success: authObj => this.getProfile(authObj),
            fail: err => console.log(err),
          });
      },
      getProfile(authObj) {
        console.log(authObj);
        const kakao = window.Kakao;
        kakao.API.request({
          url: '/v1/user/me',
          success: res => console.log(res),
          fail: error => console.log(error),
        });
      },
      googleLogin() {
        const gapi = window.gapi;
        gapi.load('auth2', () => {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          this.auth2 = gapi.auth2.init({
            client_id: '239343969228-qdk34cjsluqugijk8432j86qtsgf9cji.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
          });
          this.auth2.attachClickHandler(this.$refs.google, {},
            (googleUser) => {
              const profile = googleUser.getBasicProfile();
              console.log(`ID: ${profile.getId()}`);
              console.log(`Name: ${profile.getName()}`);
              console.log(`Image URL: ${profile.getImageUrl()}`);
              console.log(`Email: ${profile.getEmail()}`);
            }, (error) => {
              console.log(error);
            });
        });
      },
    },
  };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
