import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default function DualTimerApp() {
    const [screenKey, setScreenKey] = useState(0); // Ключ для обновления экрана

    return <DualTimerScreen key={screenKey} onReset={() => setScreenKey(prev => prev + 1)} />;
}

function DualTimerScreen({ onReset }) {
    const [leftTime, setLeftTime] = useState(0);
    const [rightTime, setRightTime] = useState(0);
    const [leftDelay, setLeftDelay] = useState(0);
    const [rightDelay, setRightDelay] = useState(0);
    const [leftDelayCountdown, setLeftDelayCountdown] = useState(0);
    const [rightDelayCountdown, setRightDelayCountdown] = useState(0);
    const [leftDelayRunning, setLeftDelayRunning] = useState(false);
    const [rightDelayRunning, setRightDelayRunning] = useState(false);
    const [leftRunning, setLeftRunning] = useState(false);
    const [rightRunning, setRightRunning] = useState(false);
    const [timersFinished, setTimersFinished] = useState(false);

    const startTimers = () => {
        if (timersFinished) return;

        setTimersFinished(false);

        if (leftDelay > 0) {
            setLeftDelayCountdown(leftDelay);
            setLeftDelayRunning(true);
        } else {
            setLeftRunning(true);
        }

        if (rightDelay > 0) {
            setRightDelayCountdown(rightDelay);
            setRightDelayRunning(true);
        } else {
            setRightRunning(true);
        }
    };

    const resetTimers = () => {
        onReset(); // Обновление экрана
    };

    useEffect(() => {
        let leftDelayInterval;
        if (leftDelayRunning && leftDelayCountdown > 0) {
            leftDelayInterval = setInterval(() => {
                setLeftDelayCountdown(prev => {
                    if (prev <= 1) {
                        setLeftDelayRunning(false);
                        setLeftRunning(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(leftDelayInterval);
    }, [leftDelayRunning, leftDelayCountdown]);

    useEffect(() => {
        let rightDelayInterval;
        if (rightDelayRunning && rightDelayCountdown > 0) {
            rightDelayInterval = setInterval(() => {
                setRightDelayCountdown(prev => {
                    if (prev <= 1) {
                        setRightDelayRunning(false);
                        setRightRunning(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(rightDelayInterval);
    }, [rightDelayRunning, rightDelayCountdown]);

    useEffect(() => {
        let leftInterval;
        if (leftRunning && leftTime > 0) {
            leftInterval = setInterval(() => {
                setLeftTime(prev => {
                    if (prev <= 1) {
                        setLeftRunning(false);
                        if (rightTime === 0) setTimersFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(leftInterval);
    }, [leftRunning, leftTime]);

    useEffect(() => {
        let rightInterval;
        if (rightRunning && rightTime > 0) {
            rightInterval = setInterval(() => {
                setRightTime(prev => {
                    if (prev <= 1) {
                        setRightRunning(false);
                        setTimersFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
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
                    editable={!leftRunning && !rightRunning}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Задержка (сек)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={text => setLeftDelay(Number(text) || 0)}
                    editable={!leftRunning && !rightRunning}
                />
                {leftDelayRunning && <Text style={styles.delayText}>Задержка: {leftDelayCountdown} сек</Text>}
            </View>
            <View style={styles.controlContainer}>
                <Button title="Старт" onPress={startTimers} color="#ff7f00" disabled={timersFinished} />
                <Button title="Сброс" onPress={resetTimers} color="#ff0000" />
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
                    editable={!leftRunning && !rightRunning}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Задержка (сек)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={text => setRightDelay(Number(text) || 0)}
                    editable={!leftRunning && !rightRunning}
                />
                {rightDelayRunning && <Text style={styles.delayText}>Задержка: {rightDelayCountdown} сек</Text>}
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
    delayText: {
        fontSize: 20,
        color: 'yellow',
        marginVertical: 5,
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
