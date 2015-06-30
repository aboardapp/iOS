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
  name: t.Str,              // a required string
  email: t.Str,              // a required string
  phone: t.Num,  // an optional string
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
    console.log('FETCH facebook DATA')
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
    return (<View style={styles.container2}>
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

    </View>);
  }
}

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


module.exports = Profile;
