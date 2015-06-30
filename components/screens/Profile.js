var React = require('react-native');
var t = require('tcomb-form-native');
var RidesScreen = require('./Rides');

var Form = t.form.Form;

var {
  NavigatorIOS,
  View,
  Text,
  Image,
  StyleSheet,
  AlertIOS
} = React;

var Person = t.struct({
  name: t.Str,
  email: t.Str,
  phone: t.Num,
});

class Profile extends React.Component {
  constructor (props) {
    super();
    var user = props.user;
    var name = user.get('name');
    var email = user.get('email');
    var picture = user.get('picture');
    var phone = user.get('phone');
    this.state = {
      value: {
        name: name,
        email: email,
        phone: phone,
      }
    };
    if (!(name && email && phone)) {
      this.preloadFacebookData(user);
    }
    this.preloadImage(user);
  }
  preloadImage(user) {
    var {access_token, id} = user.get('authData').facebook;

    var photo_api = `https://graph.facebook.com/v2.3/${id}/picture?width=100&redirect=false&access_token=${access_token}`;
    var _this = this;
    fetch(photo_api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          photo : {
            url : responseData.data.url,
            height: responseData.data.height,
            width: responseData.data.width,
          },
        });
      })
      .done();

  }

  preloadFacebookData(user) {
    var {access_token, id} = user.get('authData').facebook;

    var api = `https://graph.facebook.com/v2.3/${id}?fields=name,email&access_token=${access_token}`;
    // var picture = `https://graph.facebook.com/${id}/picture?width=100&height=100&access_token=${access_token}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        var {name, email} = responseData;
        this.state.value.name = this.state.value.name || name;
        this.state.value.email = this.state.value.name || email;
        this.setState(this.state);
      })
      .done();
  }

  onChange(value) {
    this.setState({value});
    this.refreshValue();
  }

  componentDidMount() {
    this.refreshValue();
  }

  refreshValue() {
    var form_value = this.refs.form.getValue();
    let validated = form_value != null;
    this.props.onChange(form_value, validated)
  }

  render() {
    var photo = this.state.photo;
    return (
      <View style={styles.container2}>
        <Image
          style={photo &&
            {
              height: photo.height,
              width: photo.width,
            }
          }
          source={{uri: photo && photo.url}}
        />
        <Form
          ref="form"
          type={Person}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
      </View>
    );
  }
}


class ProfileScreen extends React.Component {
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
    user.set("signed", true);
    user.save();
    this.props.onSave && this.props.onSave();
  }

  isUserSigned() {
    return !!this.props.user.get('signed');
  }

  render () {
    let signed = this.isUserSigned();
    return (
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={{
          title: signed?'Your profile':'Sign Up',
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


module.exports = ProfileScreen;
