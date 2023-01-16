import {FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import NewDevice from './NewDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Devices = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [devices, setDevices] = useState([]);
    const [deviceModify, setDeviceModify] = useState();

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

    const loadDevices = async () => {
        let value = await getData("devices");
        if (value !== null && value.length > 0) {
            const json = JSON.parse(value);
            console.log(json);
            setDevices(json);
        }
    }

    useEffect(() => {
         if(!modalVisible){
             let a = loadDevices();
             setDeviceModify(null);
         }
    }, [modalVisible]);

    const clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch(e) {
            // clear error
        }
    }

    useEffect(() => {
        if(deviceModify !== undefined && deviceModify !== null){
            setModalVisible(true);
        }
    }, [deviceModify]);

    useEffect(() => {
        let a = clearAll();
    }, []);

    const generateDevices = () => {
        return(
            devices.map((device, index) => {
                return (
                    <TouchableOpacity onPress={() => {setDeviceModify(index)}}  key={"device_"+index} style={[styles.device, {backgroundColor: device.backgroundColor}]}>
                        <Text style={[styles.title, {color:device.fontColor}]} >{device.name}</Text>
                        <Text style={{color:device.fontColor}}>{device.place}</Text>
                    </TouchableOpacity>
                );
            })
        )
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {

                }}
            >
                <NewDevice setModalVisible={setModalVisible} devices={devices} deviceModify={deviceModify}/>
            </Modal>

            <ScrollView>
                <View style={styles.devices}>
                    {generateDevices()}
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.device, {backgroundColor: "white"}]}>
                        <Text style={styles.add}>+</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    devices: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    device: {
        height: 160,
        margin: "5%",
        width: "40%",
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderWidth: 2
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    add: {
        fontWeight: 'bold',
        fontSize: 50,
        color: 'black'
    },
});

export default Devices;
