var React = require('react-native');
var t = require('tcomb-form-native');
var RidesScreen = require('./Rides');
var Profile = require('./Profile');

var {
  NavigatorIOS,
  View,
  Text,
  Image,
  StyleSheet,
  AlertIOS
} = React;


class Main extends React.Component {
  render () {
    var validated = !!this.props.user.get('signed');
    return (
      validated?<RidesScreen user={this.props.user} />:
      <Profile user={this.props.user} onSave={() => this.setState(this.state)} />
    );
  }
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allPages: {
    backgroundColor: '#EEE',
    paddingTop: 64,
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },});


module.exports = Main;
