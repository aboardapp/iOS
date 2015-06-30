var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');

var Form = t.form.Form;
var {
  NavigatorIOS,
  View,
  Text,
  Image,
  StyleSheet,
  AlertIOS,
  TabBarIOS,
  ListView
} = React;


class RideDetail extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    console.log(this.props.ride);
    return (<Text>My Rides{this.props.ride} </Text>);
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});


module.exports = RideDetail;
