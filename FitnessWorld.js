import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default function DualTimerApp() {
    const [leftTime, setLeftTime] = useState(0);
    const [rightTime, setRightTime] = useState(0);
    const [delay, setDelay] = useState(0);
    const [leftRunning, setLeftRunning] = useState(false);
    const [rightRunning, setRightRunning] = useState(false);

    const startTimers = () => {
        setLeftRunning(true);
        setTimeout(() => setRightRunning(true), delay * 1000);
    };

    React.useEffect(() => {
        let leftInterval;
        if (leftRunning && leftTime > 0) {
            leftInterval = setInterval(() => {
                setLeftTime(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(leftInterval);
    }, [leftRunning, leftTime]);

    React.useEffect(() => {
        let rightInterval;
        if (rightRunning && rightTime > 0) {
            rightInterval = setInterval(() => {
                setRightTime(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(rightInterval);
    }, [rightRunning, rightTime]);

    return (
        <View style={styles.container}>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Левая рука</Text>
                <Text style={styles.timer}>{leftTime} сек</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите время"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={text => setLeftTime(Number(text) || 0)}
                />
            </View>
            <View style={styles.controlContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Задержка (сек)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={text => setDelay(Number(text) || 0)}
                />
                <Button title="Старт" onPress={startTimers} color="#ff7f00" />
            </View>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Правая рука</Text>
                <Text style={styles.timer}>{rightTime} сек</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите время"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={text => setRightTime(Number(text) || 0)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 20,
    },
    sideContainer: {
        flex: 1,
        alignItems: 'center',
    },
    controlContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 24,
        color: 'white',
        marginBottom: 10,
    },
    timer: {
        fontSize: 32,
        color: '#ff7f00',
        fontWeight: 'bold',
    },
    input: {
        width: 100,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ff7f00',
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
    },
});
