import React from 'react';
import { BackHandler, Button, Dimensions, FlatList, KeyboardAvoidingView, Picker, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import * as services from './services';

const tools = require('./assets/tools.json')

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tools: tools,
      showToolsList: true,
      showToolScreen: false,
      selectedItem: {},
      selectedFunction: null,
      pickerSelectedIndex: 0,
      input: "",
      output: "",
      buttonText: "Press Me"
    };

  }

  componentDidMount() {

    const self = this
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log(self.state.showToolsList)
      if (self.state.showToolsList == true) {
        //BackHandler.exitApp();
        return true;
      } else {
        self.setState({
          showToolsList: true,
          showToolScreen: false,
          selectedItem: {},
          selectedFunction: null,
          input: "",
          output: ""
        })
        return true;
      }
    });
  }


  renderItem = ({ item, index }) => {
    return (
      <TouchableHighlight key={index.toString()} onPress={() => {
        this.setState({
          selectedItem: item,
          showToolScreen: true,
          showToolsList: false,
          output: "",
          input: "",
          pickerSelectedIndex: 0,
          buttonText: item.button
        })
        console.log("Pressed", this.state.showToolScreen)
      }} style={[styles.item, { height: Dimensions.get('window').width / 2 }]}>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableHighlight>
    );
  }



  generateOutput() {
    this.setState({ buttonText: this.state.selectedItem.processString + '...' });
    const serviceName = this.state.selectedItem.service;
    const toolName = this.state.selectedItem.functions[this.state.pickerSelectedIndex];

    this.state.output = services[serviceName][toolName](this.state.input)
    this.state.buttonText = this.state.selectedItem.button;

    this.setState({ buttonText: this.state.selectedItem.button });
    return;
  }

  render() {
    if (this.state.showToolsList == true) {
      return (
        <FlatList
          data={this.state.tools}
          style={styles.container}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          numColumns={2} />
      );
    }
    if (this.state.showToolScreen == true) {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.form}>
          <Text>Input Here:</Text>
          <TextInput
            style={styles.input}
            value={this.state.input}
            onChangeText={input => this.setState({ input })}
            placeholder="Input Here..."
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="send"
            multiline={true}
            returnKeyType='none'
            onSubmitEditing={this._submit}
            blurOnSubmit={true}
          />
          <Text>Select one of the Below</Text>
          <Picker
            selectedValue={this.state.selectedItem.select[this.state.pickerSelectedIndex]}
            style={{ height: 50, width: 400 }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ pickerSelectedIndex: itemIndex })
            }>
            {
              this.state.selectedItem.select.map((item, index) => (
                <Picker.Item label={item} value={item} key={index.toString()} />
              ))
            }
          </Picker>
          <View>
            <Button title={this.state.buttonText} onPress={() => this.generateOutput()} />
          </View>
          <Text>Outputs Here:</Text>
          <TextInput
            style={styles.input}
            value={this.state.output}
            onChangeText={output => this.setState({ output })}
            placeholder="Output goes Here..."
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="send"
            multiline={true}
            returnKeyType='none'
            onSubmitEditing={this._submit}
            blurOnSubmit={true}
          />
        </KeyboardAvoidingView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#6495ED',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
    fontSize: 15,
  },
  header: {
    paddingTop: 20,
    padding: 20,
    backgroundColor: '#336699',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 150,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    margin: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
}); 