import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Video } from 'expo-av';

export default function DualTimerApp() {
    const [screenKey, setScreenKey] = useState(0);
    return <DualTimerScreen key={screenKey} onReset={() => setScreenKey(prev => prev + 1)} />;
}

function DualTimerScreen({ onReset }) {
    const [leftMinutes, setLeftMinutes] = useState('');
    const [leftSeconds, setLeftSeconds] = useState('');
    const [rightMinutes, setRightMinutes] = useState('');
    const [rightSeconds, setRightSeconds] = useState('');
    const [leftDelay, setLeftDelay] = useState('');
    const [rightDelay, setRightDelay] = useState('');
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [timersRunning, setTimersRunning] = useState(false);
    const [timerCompleted, setTimerCompleted] = useState(false);

    const isStartDisabled = !leftMinutes && !leftSeconds && !rightMinutes && !rightSeconds ? true : false;

    const startTimers = () => {
        if (isStartDisabled) {
            Alert.alert("Warning", "Insert time first", [{ text: "OK" }]);
            return;
        }
        setVideoPlaying(true);
        setTimerCompleted(false);
    };

    const handleVideoFinish = () => {
        setVideoPlaying(false);
        setTimersRunning(true);
    };

    useEffect(() => {
        let timerInterval;
        if (timersRunning) {
            timerInterval = setInterval(() => {
                setLeftSeconds(prev => {
                    if (prev === 0 || prev === '') {
                        if (leftMinutes === 0 || leftMinutes === '') return '';
                        setLeftMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
                setRightSeconds(prev => {
                    if (prev === 0 || prev === '') {
                        if (rightMinutes === 0 || rightMinutes === '') return '';
                        setRightMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
                if (!leftMinutes && !leftSeconds && !rightMinutes && !rightSeconds) {
                    clearInterval(timerInterval);
                    setTimersRunning(false);
                    setTimerCompleted(true);
                }
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [timersRunning, leftMinutes, leftSeconds, rightMinutes, rightSeconds]);

    return (
        <View style={styles.container}>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Left Side</Text>
                <Text style={styles.timer}>{`${leftMinutes || 0}:${leftSeconds < 10 ? '0' : ''}${leftSeconds || 0}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setLeftMinutes(text)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setLeftSeconds(text)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setLeftDelay(text)} />
            </View>
            <View style={styles.controlContainer}>
                <TouchableOpacity
                    onPress={startTimers}
                    style={[styles.startButton, isStartDisabled ? styles.disabledButton : null]}
                    disabled={isStartDisabled}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onReset} style={styles.resetButton}><Text style={styles.buttonText}>Reset</Text></TouchableOpacity>
                {videoPlaying && (
                    <View style={styles.videoContainer}>
                        <Video
                            source={require('./assets/video.mp4')}
                            style={styles.video}
                            shouldPlay
                            resizeMode="contain"
                            onPlaybackStatusUpdate={status => {
                                if (status.didJustFinish) handleVideoFinish();
                            }}
                        />
                    </View>
                )}
            </View>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Right Side</Text>
                <Text style={styles.timer}>{`${rightMinutes || 0}:${rightSeconds < 10 ? '0' : ''}${rightSeconds || 0}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setRightMinutes(text)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setRightSeconds(text)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setRightDelay(text)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: 'black', padding: 20 },
    sideContainer: { flex: 1, alignItems: 'center' },
    controlContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 },
    label: { fontSize: 24, color: 'white' },
    timer: { fontSize: 50, color: '#ff7f00', fontWeight: 'bold' },
    input: { width: 100, height: 40, borderBottomWidth: 1, borderBottomColor: '#ff7f00', color: 'white', textAlign: 'center', marginTop: 10 },
    videoContainer: { marginTop: 20, alignItems: 'center', width: 300, height: 300 },
    video: { width: '100%', height: '100%' },
    startButton: { backgroundColor: 'green', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', width: 150 },
    resetButton: { backgroundColor: 'red', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', width: 150 },
    disabledButton: { backgroundColor: 'gray' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
