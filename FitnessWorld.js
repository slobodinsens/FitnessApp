import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function DualTimerApp() {
    const [screenKey, setScreenKey] = useState(0);
    return <DualTimerScreen key={screenKey} onReset={() => setScreenKey(prev => prev + 1)} />;
}

function DualTimerScreen({ onReset }) {
    const [leftMinutes, setLeftMinutes] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);
    const [rightMinutes, setRightMinutes] = useState(0);
    const [rightSeconds, setRightSeconds] = useState(0);
    const [leftDelay, setLeftDelay] = useState(0);
    const [rightDelay, setRightDelay] = useState(0);
    const [leftRunning, setLeftRunning] = useState(false);
    const [rightRunning, setRightRunning] = useState(false);
    const [timersFinished, setTimersFinished] = useState(false);

    const [sound, setSound] = useState(null);

    const playSound = async (type) => {
        const soundFile = type === 'start'
            ? require('./assets/start.mp3')
            : require('./assets/end.mp3');

        const { sound } = await Audio.Sound.createAsync(soundFile);
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const startTimers = () => {
        if (timersFinished || (leftMinutes === 0 && leftSeconds === 0 && rightMinutes === 0 && rightSeconds === 0)) return;

        setTimersFinished(false);
        playSound('start');  // Play start sound

        let leftTotalTime = leftMinutes * 60 + leftSeconds;
        let rightTotalTime = rightMinutes * 60 + rightSeconds;

        if (leftTotalTime > 0) {
            if (leftDelay > 0) {
                setTimeout(() => setLeftRunning(true), leftDelay * 1000);
            } else {
                setLeftRunning(true);
            }
        }

        if (rightTotalTime > 0) {
            if (rightDelay > 0) {
                setTimeout(() => setRightRunning(true), rightDelay * 1000);
            } else {
                setRightRunning(true);
            }
        }
    };

    const resetTimers = () => {
        setLeftMinutes(0);
        setLeftSeconds(0);
        setRightMinutes(0);
        setRightSeconds(0);
        setLeftDelay(0);
        setRightDelay(0);
        setLeftRunning(false);
        setRightRunning(false);
        setTimersFinished(false);
        onReset();
    };

    useEffect(() => {
        let leftInterval;
        if (leftRunning && (leftMinutes > 0 || leftSeconds > 0)) {
            leftInterval = setInterval(() => {
                setLeftSeconds(prev => {
                    if (prev === 0) {
                        if (leftMinutes === 0) {
                            setLeftRunning(false);
                            if (rightMinutes === 0 && rightSeconds === 0) {
                                setTimersFinished(true);
                                playSound('end');  // Play end sound
                            }
                            return 0;
                        }
                        setLeftMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(leftInterval);
    }, [leftRunning, leftMinutes, leftSeconds]);

    useEffect(() => {
        let rightInterval;
        if (rightRunning && (rightMinutes > 0 || rightSeconds > 0)) {
            rightInterval = setInterval(() => {
                setRightSeconds(prev => {
                    if (prev === 0) {
                        if (rightMinutes === 0) {
                            setRightRunning(false);
                            setTimersFinished(true);
                            playSound('end');  // Play end sound
                            return 0;
                        }
                        setRightMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(rightInterval);
    }, [rightRunning, rightMinutes, rightSeconds]);

    return (
        <View style={styles.container}>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Left Side</Text>
                <Text style={styles.timer}>{`${leftMinutes}:${leftSeconds < 10 ? '0' : ''}${leftSeconds}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setLeftMinutes(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setLeftSeconds(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setLeftDelay(Number(text) || 0)} />
            </View>
            <View style={styles.controlContainer}>
                <Button title="Start" onPress={startTimers} color="#ff7f00" disabled={timersFinished || (leftMinutes === 0 && leftSeconds === 0 && rightMinutes === 0 && rightSeconds === 0)} />
                <Button title="Reset" onPress={resetTimers} color="#ff0000" />
            </View>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Right Side</Text>
                <Text style={styles.timer}>{`${rightMinutes}:${rightSeconds < 10 ? '0' : ''}${rightSeconds}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setRightMinutes(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setRightSeconds(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setRightDelay(Number(text) || 0)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: 'black', padding: 20 },
    sideContainer: { flex: 1, alignItems: 'center' },
    controlContainer: { alignItems: 'center' },
    label: { fontSize: 24, color: 'white' },
    timer: { fontSize: 50, color: '#ff7f00', fontWeight: 'bold' }, // Increased size
    input: { width: 100, height: 40, borderBottomWidth: 1, borderBottomColor: '#ff7f00', color: 'white', textAlign: 'center', marginTop: 10 },
});
