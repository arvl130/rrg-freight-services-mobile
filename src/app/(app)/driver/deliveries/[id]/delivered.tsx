import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />  
      <View style={{ 
      justifyContent: 'center',
      height: '95%', }}>
        <FontAwesome5 style={styles.checkIcon} name="check-circle" size={160} color="black" />
      <Text style={styles.bold}>Delivered
      </Text>
      <Text style={styles.text}>The{' '}
      <Text style={styles.underline}>RRG-YMZ9K5YU8AUP</Text>
      <Text style={styles.text}>{' '}has been successfully delivered.
      </Text>
      </Text>
      </View>
    </View>
      
  );
}

const styles = StyleSheet.create({
  container: {   
    marginLeft: 17,
    marginRight: 17,
    marginTop: 50,
    backgroundColor: '#78CFDC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#78CFDC',

    
  },
  underline: {
    textAlign: 'center',
    fontSize: 23,
    textDecorationLine: 'underline',
},

text: {
  textAlign: 'center',
  fontSize: 23,

},

bold: {
  marginBottom: '20%',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 50,
},

Icon:{
  alignContent: 'center',
},
checkIcon:{
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 1,
}
});
