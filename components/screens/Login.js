var React = require('react-native');

var FBLogin = require('../fblogin');
var {FBLoginManager} = require('NativeModules');
var {Parse} = require('parse');
var ParseReact = require('parse-react');
var ParseComponent = require('parse-react/class')

var registerInstallation = require('../registerInstallation');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  PushNotificationIOS,
  AlertIOS,
  Image
} = React;

class Login extends React.Component {
  handleLogin(data) {
    console.log(data);
    var {credentials} = data;
    console.log(credentials);
    this.setState({ user : data.credentials });
    var expiration_date = new Date(credentials.tokenExpirationDate).toISOString()
    let authData = {
      id: credentials.userId,
      access_token: credentials.token,
      expiration_date: expiration_date
    };
    Parse.FacebookUtils.logIn(authData, {
      success: (user) => {
        user.fetch();
        this.props.onLogin(user);
        this.setState({loadingCurrentUser: false});
      },
      error: (user, error) => {
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(() => {
              this.handleLogin(credentials);
            });
            break;
          default:
            this.setState({loadingCurrentUser: false});
        }
      }
    });
  }

  render () {
    var _this = this;
    return (
      <FBLogin style={styles.fblogin}
        permissions={["email","user_friends"]}
        onLogin={this.handleLogin.bind(this)}
        onLogout={function(){
          console.log("Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log("Existing login found.");
          console.log(data);
          _this.handleLogin(data);
        }}
        onLoginNotFound={function(){
          console.log("No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }}
      />
    );
  }
}

class LoginScreen extends React.Component {
  onLogin(user) {
    this.props.onLogin(user);
  }

  render () {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('image!logo')} />
        <Text style={styles.tagline}>
          An easier commute
        </Text>
        <Login onLogin={this.onLogin.bind(this)} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A629D',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  fblogin: {
    marginBottom: 10,
    // width: 240,
    // height: 64,
    // textAlign: 'center',
    // borderColor: '#5273B9',
    // borderWidth: 1,
    // backgroundColor: '#4866B9',
    // borderRadius: 3,
  },
  logo: {
    marginBottom: 15,
  },
  tagline: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 54
  },
  instructions: {
    textAlign: 'right',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = LoginScreen;