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
  Text
} = React;

class AppEntry extends React.Component {
  constructor () {
    super();
    this.state = {
      user: null
    };
  }
  onLogin(user) {
    console.log('ONLOGIN');
    this.setState({user:user});
    // this.props.navigator.replace({
    //   title: 'Rides',
    //   component: RidesScreen,
    //   passProps: {user},
    // });
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

AppRegistry.registerComponent('AppEntry', () => AppEntry);

module.exports = AppEntry;
