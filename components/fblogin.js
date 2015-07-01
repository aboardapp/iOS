'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;

var FBLoginManager = require('NativeModules').FBLoginManager;

var FBLoginMock = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  },

  getInitialState: function(){
    return {
      user: null,
    };
  },

  handleLogin: function(){
    var _this = this;
    FBLoginManager.loginWithPermissions(this.props.permissions, function(error, data){
      if (!error) {
        _this.setState({ user : data});
        _this.props.onLogin && _this.props.onLogin(data);
      } else {
        console.log(error, data);
      }
    });
  },

  handleLogout: function(){
    var _this = this;
    FBLoginManager.logout(function(error, data){
      if (!error) {
        _this.setState({ user : null});
        _this.props.onLogout && _this.props.onLogout();
      } else {
        console.log(error, data);
      }
    });
  },

  onPress: function(){
    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  },

  componentWillMount: function(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if (!error) {
        _this.setState({ user : data});
        _this.props.onLoginFound(data);
      }
    });
  },

  render: function() {
    var text = this.state.user ? "Log out" : "Connect with Facebook";
    return (
      <View style={this.props.style}>
        <TouchableHighlight
          style={styles.container}
          onPress={this.onPress}
        >
          <View style={styles.FBLoginButton}>
            <Image style={styles.FBLogo} source={require('image!FB-f-Logo__white_144')} />
            <Text style={[styles.FBLoginButtonText, this.state.user ? styles.FBLoginButtonTextLoggedIn : styles.FBLoginButtonTextLoggedOut]}
              numberOfLines={1}>{text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 68,
    width: 280,
    paddingLeft: 2,

    backgroundColor: '#3B5998',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5273B9',

  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '700',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
  FBLoginButtonTextLoggedIn: {
    marginLeft: 5,
  },
  FBLoginButtonTextLoggedOut: {
    marginLeft: 40,
  },
  FBLogo: {
    position: 'absolute',
    height: 28,
    width: 28,

    left: 20,
    top: 20,
  },
});

module.exports = FBLoginMock;
