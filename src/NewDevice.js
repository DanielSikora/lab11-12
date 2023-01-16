import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewDevice = (props) => {

    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [command, setCommand] = useState('');
    const [deleteButton, setDeleteButton] = useState(false);

    const onColorChange = color => {
        setColor(color);
    };

    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            // saving error
        }
    }

    const getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);

            if(value !== null) {
                return value;
            }
            else {
                return null;
            }
        } catch(e) {
            // error reading value
        }
    }

    const padZero = (str, len) => {
        len = len || 2;
        let zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    const invertColor = (hex, bw) => {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        let r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }

    const save = async () => {

        let fontColor = invertColor(color, true);

        const json = {
            id: 0,
            name: name,
            place: place,
            command: command,
            backgroundColor: color,
            fontColor: fontColor
        }
        let send;
        let value = props.devices;
        if(props.deviceModify !== null){
            console.log("modify device");
            send = props.devices;
            let id = send[props.deviceModify].id;
            send[props.deviceModify] = json;
            send[props.deviceModify].id = id;
        }
        else if(value.length === 0){
            console.log("first device");
            send = [json];
        }
        else {
            console.log("next device");
            json.id = props.devices[props.devices.length-1].id + 1;
            send = [...props.devices,json];
        }
        let a = await storeData("devices", JSON.stringify(send));
        props.setModalVisible(false);
    }

    useEffect(() => {
        if(props.deviceModify !== null){
            console.log(props.devices[props.deviceModify])
            setColor(props.devices[props.deviceModify].backgroundColor)
            setName(props.devices[props.deviceModify].name)
            setPlace((props.devices[props.deviceModify].place))
            setCommand(props.devices[props.deviceModify].command)
            setDeleteButton(true)
        }
    }, [props.deviceModify]);

    const deleteDevice = async () => {
        let send = props.devices;
        send.splice(props.deviceModify, 1);

        let a = await storeData("devices", JSON.stringify(send));
        props.setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add new device</Text>
                </View>
                <View Style={{margin: 50}}>
                    <TextInput placeholder="Name" style={styles.TextInput}
                               onChangeText={(name) => setName(name)}
                               value={name}
                    />

                    <TextInput placeholder="Place" style={styles.TextInput}
                               onChangeText={(place) => setPlace(place)}
                               value={place}
                    />

                    <TextInput placeholder="Command" style={styles.TextInput}
                               onChangeText={(command) => setCommand(command)}
                               value={command}
                    />

                    <View style={styles.colorContainer}>
                        <Text style={styles.colorTitle}>Color</Text>
                        <ColorPicker
                            color={color}
                            onColorChange={(color) => onColorChange(color)}
                            thumbSize={20}
                            sliderSize={20}
                            noSnap={true}
                            row={false}
                            sliderHidden={true}
                            swatches={false}
                        />
                    </View>
                    {deleteButton ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => props.setModalVisible(false)} style={styles.button2}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => save()} style={styles.button2}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteDevice()} style={styles.button2}>
                            <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                    ) : (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => props.setModalVisible(false)} style={styles.button}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => save()} style={styles.button}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }

                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 20
    },
    TextInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        fontFamily: 'DancingScript-Regular',
        fontSize: 20,
        padding: 10,
    },
    colorContainer: {
        margin: 12,
        display: 'flex'
    },
    colorTitle: {
        fontSize: 20,
        fontFamily: 'DancingScript-Regular',
        color: 'black',
        fontWeigh: 'bald'
    },
    buttonContainer: {
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12,
        display: 'flex',
        flexDirection: 'row'
    },
    button: {
        margin: 15,
        width: '40%',
        padding: 15,
        borderWidth: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    button2: {
        margin: "2%",
        width: '30%',
        padding: 15,
        borderWidth: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText: {
        color: 'black',
        fontFamily: 'DancingScript-Regular'
    },
    header: {
        justifyContent:'center',
        alignItems:'center',
        width: "100%",
        marginTop: 10,
        marginBottom: 10
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'DancingScript-Regular'
    }

});

export default NewDevice;
