import React from 'react';
import { BackHandler, Dimensions, FlatList, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { SearchBar, Button } from 'react-native-elements';

// Other Imports 
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
      buttonText: "Press Me",
      searchKeyword: '',
      isProcessing: false,
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
    this.setState({ buttonText: this.state.selectedItem.processString + '...', isProcessing: true });
    const serviceName = this.state.selectedItem.service;
    const toolName = this.state.selectedItem.functions[this.state.pickerSelectedIndex];

    this.state.output = services[serviceName][toolName](this.state.input)
    this.state.buttonText = this.state.selectedItem.button;

    this.setState({ buttonText: this.state.selectedItem.button, isProcessing: false });
    return;
  }

  search(search) {
    this.setState({ searchKeyword: search })
  }

  render() {
    const searchKeyword = this.state.searchKeyword
    if (this.state.showToolsList == true) {
      return (
        <ScrollView>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={this.search}
            value={searchKeyword}
          />
          <FlatList
            data={this.state.tools}
            style={styles.container}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            numColumns={2} />
        </ScrollView>

      );
    }
    if (this.state.showToolScreen == true) {
      return (
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <TextInput
              style={styles.input}
              value={this.state.input}
              onChangeText={input => this.setState({ input })}
              placeholder="Input"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="send"
              multiline={true}
              returnKeyType='none'
              onSubmitEditing={this._submit}
              blurOnSubmit={true}
            />
            <TextInput
              style={styles.input}
              value={this.state.output}
              onChangeText={output => this.setState({ output })}
              placeholder="Output"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="send"
              multiline={true}
              returnKeyType='none'
              onSubmitEditing={this._submit}
              blurOnSubmit={true}
            />

            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ width: 100 }}>Select a Tool</Text>
              <Picker
                selectedValue={this.state.selectedItem.select[this.state.pickerSelectedIndex]}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ pickerSelectedIndex: itemIndex })
                }
                >
                {
                  this.state.selectedItem.select.map((item, index) => (
                    <Picker.Item label={item} value={item} key={index.toString()} />
                  ))
                }
              </Picker>
            </View>

            <View>
              <Button
                title={this.state.buttonText}
                loading={this.state.isProcessing}
                style={styles.processBtn} onPress={() => this.generateOutput()}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
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
    margin: 10,
    height: 150,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: "top"
  },
  processBtn: {
    marginTop: 10,
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