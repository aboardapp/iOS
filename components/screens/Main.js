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
  constructor () {
    super();
    this.state = {
      user: null
    };
  }

  onChangeForm(value, validated) {
    console.log('change form', value, validated);
    this.userValue = value;
    this.validated = validated;
  }

  onSave() {
    if (!this.validated) {
      AlertIOS.alert(
        'Aboard',
        'You only can save once the data is validated',
        [
          {
            text: 'OK',
            onPress: () => console.log('Tapped OK'),
          },
        ]
      );
      return;
    }
    let user = this.props.user;
    user.set("name", this.userValue.name);
    user.set("email", this.userValue.email);
    user.set("phone", this.userValue.phone);
    user.set("validated", true);
    user.save();
    this.setState(this.state);
  }

  render () {
    var validated = !!this.props.user.get('validated');
    return (
      validated?<RidesScreen user={this.props.user} />:
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={{
          title: 'Sign Up',
          component: Profile,
          rightButtonTitle: 'Save',
          onRightButtonPress: this.onSave.bind(this),
          passProps: { user: this.props.user, onChange:this.onChangeForm.bind(this) }
        }}
      />
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
