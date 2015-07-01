var React = require('react-native');
var {Parse} = require('parse');

var {PARSE_APP_ID, PARSE_REST_KEY} = require('./constants');
var Login = require('./screens/Login');
var Main = require('./screens/Main');

Parse.initialize(PARSE_APP_ID, PARSE_REST_KEY);

// Make react global
window.React = React;

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  View,
  Text,
  StatusBarIOS
} = React;

class AppEntry extends React.Component {
  constructor () {
    super();
    this.state = {
      user: null
    };
  }

  onLogin(user) {
    this.setState({user:user});
  }

  render () {
    return (
      this.state.user?
      <Main user={this.state.user} />:
      <Login onLogin={this.onLogin.bind(this)}/>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allPages: {
    backgroundColor: '#EEE',
  }
});

StatusBarIOS.setStyle('light-content');
AppRegistry.registerComponent('AppEntry', () => AppEntry);

module.exports = AppEntry;
