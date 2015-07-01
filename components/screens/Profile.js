var React = require('react-native');
var t = require('tcomb-form-native');
var RidesScreen = require('./Rides');
var formStylesheet = require('../formStyle');

var Form = t.form.Form;

var {
  NavigatorIOS,
  View,
  Text,
  Image,
  StyleSheet,
  AlertIOS,
  TouchableOpacity,
} = React;

var Person = t.struct({
  name: t.Str,
  email: t.Str,
  phone: t.Num,
});

var options = {
  fields: {
    name: {
      stylesheet: formStylesheet
    },
    email: {
      stylesheet: formStylesheet
    },
    phone: {
      stylesheet: formStylesheet
    }
  }
};

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

    var photo_api = `https://graph.facebook.com/v2.3/${id}/picture?width=240&redirect=false&access_token=${access_token}`;
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
        this.props.user.set("picture", responseData.data.url);
      })
      .done();

  }

  preloadFacebookData(user) {
    var {access_token, id} = user.get('authData').facebook;

    var api = `https://graph.facebook.com/v2.3/${id}?fields=name,email&access_token=${access_token}`;
    // var picture = `https://graph.facebook.com/${id}/picture?width=200&height=200&access_token=${access_token}`;

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

  onSave() {
    this.props.onSave && this.props.onSave();
  }

  onLogout() {

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
          style={styles.photo}
          source={{uri: photo && photo.url}}
        />
        <Form
          ref="form"
          type={Person}
          value={this.state.value}
          options={options} 
          onChange={this.onChange.bind(this)}
        />
        {this.props.signup?<TouchableOpacity style={{textAlign:'center', flex: 1}} onPress={this.onSave.bind(this)}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>:
        <TouchableOpacity style={{textAlign:'center', flex: 1}} onPress={this.onLogout.bind(this)}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>}

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
    let signup = !!this.props.signup;
    var route = {
      title: signup?'Sign Up':'Your profile',
      component: Profile,
      passProps: { user: this.props.user, onChange:this.onChangeForm.bind(this), onSave: this.onSave.bind(this), signup: signup }
    }
    if (!signup) {
      route.rightButtonTitle = 'Save',
      route.onRightButtonPress = this.onSave.bind(this);
    }
    return (
      <NavigatorIOS
        ref="nav"
        barTintColor="#335485"
        titleTextColor="#FFFFFF"
        tintColor="#FFFFFF"
        style={styles.container}
        itemWrapperStyle={styles.allPages}
        initialRoute={route}
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
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    marginBottom: 20,
    alignSelf: 'center',

    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },

  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  signup: {
    fontFamily: 'Avenir',
    fontSize: 24,
    color: '#335485',
    padding: 14,
    marginTop: 20,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#335485',
    width: 180,
    borderRadius: 3,
    textAlign: 'center',
    fontWeight: '500',
    alignSelf: 'center',
  },
  logout: {
    fontFamily: 'Avenir',
    fontSize: 14,
    color: '#335485',
    padding: 9,
    marginTop: 13,
    paddingBottom: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#335485',
    width: 100,
    borderRadius: 3,
    textAlign: 'center',
    fontWeight: '500',
    alignSelf: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },});


module.exports = ProfileScreen;
